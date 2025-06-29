import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  console.log('🚨 MIDDLEWARE ENTRY POINT - RUNNING!', req.nextUrl.pathname)
  console.log('🔒 MIDDLEWARE RUNNING for path:', req.nextUrl.pathname)
  console.log('🔒 MIDDLEWARE: Request URL:', req.nextUrl.href)
  
  const { pathname } = req.nextUrl
  const res = NextResponse.next()
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/book',
    '/journal',
    '/onboarding',
    '/full-audio-player',
    '/workshop'
  ]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  console.log('🔒 MIDDLEWARE: Is protected route?', isProtectedRoute, 'for path:', pathname)

  if (isProtectedRoute) {
    console.log('🔒 MIDDLEWARE: Checking authentication for protected route:', pathname)
    try {
      // Create Supabase client for middleware
      const supabase = createMiddlewareClient({ req, res })
      console.log('🔒 MIDDLEWARE: Supabase client created')
      
      // Check if user is authenticated
      const { data: { session }, error } = await supabase.auth.getSession()
      
      console.log('🔒 MIDDLEWARE: Session check result:', { 
        hasSession: !!session, 
        sessionUser: session?.user?.email || 'none',
        error: error?.message || 'none' 
      })
      
      if (error) {
        console.error('🔒 MIDDLEWARE ERROR: Error checking session:', error)
      }
      
      // If no session, redirect to login with return URL
      if (!session) {
        console.log(`🔒 MIDDLEWARE: No session found, redirecting ${pathname} to login`)
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('returnUrl', pathname)
        console.log('🔒 MIDDLEWARE: Redirect URL:', redirectUrl.href)
        return NextResponse.redirect(redirectUrl)
      }
      
      console.log(`🔒 MIDDLEWARE: User authenticated, allowing access to ${pathname}`)
    } catch (error) {
      console.error('🔒 MIDDLEWARE ERROR: Error in middleware auth check:', error)
      // On error, redirect to login for safety
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/login'
      redirectUrl.searchParams.set('returnUrl', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}