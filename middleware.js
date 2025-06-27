import { NextResponse } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req) {
  console.log('Middleware running for path:', req.nextUrl.pathname)
  
  const { pathname } = req.nextUrl
  const res = NextResponse.next()
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/book',
    '/onboarding',
    '/full-audio-player',
    '/workshop'
  ]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  if (isProtectedRoute) {
    try {
      // Create Supabase client for middleware
      const supabase = createMiddlewareClient({ req, res })
      
      // Check if user is authenticated
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error checking session in middleware:', error)
      }
      
      // If no session, redirect to login with return URL
      if (!session) {
        console.log(`No session found, redirecting ${pathname} to login`)
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/login'
        redirectUrl.searchParams.set('returnUrl', pathname)
        return NextResponse.redirect(redirectUrl)
      }
      
      console.log(`User authenticated, allowing access to ${pathname}`)
    } catch (error) {
      console.error('Error in middleware auth check:', error)
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
