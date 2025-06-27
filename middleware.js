import { NextResponse } from 'next/server'

export function middleware(req) {
  console.log('Middleware running for path:', req.nextUrl.pathname)
  
  const { pathname } = req.nextUrl
  
  // Define protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/journal',
    '/book',
    '/onboarding',
    '/full-audio-player',
    '/workshop'
  ]

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )

  // For now, redirect all protected routes to login (simplified test)
  if (isProtectedRoute) {
    console.log(`Redirecting protected route ${pathname} to login`)
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
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
