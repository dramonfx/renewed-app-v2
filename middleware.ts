// =============================================================================
// THE ONE TRUE GATEKEEPER - SACRED MIDDLEWARE FOR RENEWED APPLICATION
// =============================================================================
// Forged from first principles to protect all sacred paths with unwavering strength
// Compatible with Next.js 14 App Router and Supabase authentication
// =============================================================================

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

/**
 * The One True Gatekeeper - Sacred Middleware Function
 * 
 * This middleware serves as the sole guardian of all protected routes in the RENEWED application.
 * It ensures that only authenticated users can access sacred paths while providing seamless
 * authentication flow with proper returnUrl handling.
 */
export async function middleware(req: NextRequest) {
  console.log('🛡️  THE ONE TRUE GATEKEEPER AWAKENS - Protecting:', req.nextUrl.pathname)
  
  // =============================================================================
  // AUTHENTICATION BYPASS - Check for SKIP_AUTH environment variable
  // =============================================================================
  const skipAuth = process.env.SKIP_AUTH === 'true'
  if (skipAuth) {
    console.log('🚧 AUTHENTICATION BYPASS ACTIVE - SKIP_AUTH=true detected')
    console.log('✅ ACCESS GRANTED - Authentication bypassed for testing')
    const response = NextResponse.next()
    response.headers.set('X-Auth-Bypassed', 'true')
    return response
  }
  
  const startTime = Date.now()
  const { pathname, search, origin } = req.nextUrl
  const fullPath = pathname + search
  
  // Create response object that will carry any necessary headers/cookies
  const response = NextResponse.next()
  
  // =============================================================================
  // SACRED PATH DEFINITIONS - Routes requiring authentication
  // =============================================================================
  const protectedRoutes = [
    '/dashboard',
    '/book',
    '/journal', 
    '/onboarding',
    '/full-audio-player',
    '/workshop'
  ]
  
  // Public routes that never require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup', 
    '/forgot-password'
  ]
  
  // Development/test routes (protect in production)
  const devRoutes = [
    '/test-',
    '/design-test',
    '/supabase-test'
  ]
  
  // =============================================================================
  // PATH ANALYSIS - Determine if route requires protection
  // =============================================================================
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  const isDevRoute = devRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  console.log('🔍 GATEKEEPER ANALYSIS:', {
    path: pathname,
    isProtected: isProtectedRoute,
    isPublic: isPublicRoute,
    isDev: isDevRoute
  })
  
  // Allow public routes to pass through
  if (isPublicRoute) {
    console.log('✅ PUBLIC ROUTE - Access granted without authentication')
    return response
  }
  
  // =============================================================================
  // AUTHENTICATION VERIFICATION - The Sacred Check
  // =============================================================================
  if (isProtectedRoute) {
    console.log('🔒 PROTECTED ROUTE DETECTED - Initiating sacred authentication check')
    
    try {
      // Create Supabase middleware client
      const supabase = createMiddlewareClient({ req, res: response })
      
      // Perform session check
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      const authResult = {
        hasSession: !!session,
        userEmail: session?.user?.email || null,
        userId: session?.user?.id || null,
        error: sessionError?.message || null
      }
      
      console.log('🔐 AUTHENTICATION RESULT:', authResult)
      
      // Handle authentication errors
      if (sessionError) {
        console.error('❌ SESSION ERROR:', sessionError.message)
        // Continue with redirect logic below
      }
      
      // =============================================================================
      // GUARDIAN'S DECISION - Grant or deny access
      // =============================================================================
      if (!session) {
        console.log('🚫 ACCESS DENIED - No valid session found')
        console.log('🔄 REDIRECTING TO LOGIN with returnUrl:', pathname)
        
        // Construct secure redirect URL with returnUrl preservation
        const loginUrl = new URL('/login', origin)
        
        // Preserve the full path including query params as returnUrl
        if (pathname !== '/login') {
          loginUrl.searchParams.set('returnUrl', pathname + search)
        }
        
        console.log('📍 REDIRECT DESTINATION:', loginUrl.href)
        
        const redirectResponse = NextResponse.redirect(loginUrl)
        
        // Add security headers to redirect response
        redirectResponse.headers.set('X-Robots-Tag', 'noindex, nofollow')
        redirectResponse.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        
        const endTime = Date.now()
        console.log(`⏱️  GATEKEEPER EXECUTION TIME: ${endTime - startTime}ms`)
        
        return redirectResponse
      }
      
      // =============================================================================
      // ACCESS GRANTED - User authenticated successfully
      // =============================================================================
      console.log('✅ ACCESS GRANTED - User authenticated:', authResult.userEmail)
      console.log('🛡️  GATEKEEPER PROTECTION COMPLETE - Proceeding to sacred path')
      
      // Add user context headers for downstream components (optional)
      response.headers.set('X-User-ID', authResult.userId || '')
      response.headers.set('X-User-Email', authResult.userEmail || '')
      
    } catch (middlewareError) {
      // =============================================================================
      // ERROR HANDLING - Graceful fallback
      // =============================================================================
      console.error('💥 GATEKEEPER ERROR - Critical authentication failure:', middlewareError)
      
      // On critical error, redirect to login for security
      const errorLoginUrl = new URL('/login', origin)
      errorLoginUrl.searchParams.set('returnUrl', pathname)
      errorLoginUrl.searchParams.set('error', 'auth_check_failed')
      
      console.log('🚨 EMERGENCY REDIRECT to:', errorLoginUrl.href)
      
      const errorResponse = NextResponse.redirect(errorLoginUrl)
      errorResponse.headers.set('X-Auth-Error', 'middleware_failure')
      
      return errorResponse
    }
  }
  
  // =============================================================================
  // DEVELOPMENT ROUTE HANDLING
  // =============================================================================
  if (isDevRoute) {
    console.log('🧪 DEVELOPMENT ROUTE - Adding development headers')
    response.headers.set('X-Environment', 'development')
    response.headers.set('X-Route-Type', 'development')
  }
  
  const endTime = Date.now()
  console.log(`⏱️  GATEKEEPER EXECUTION TIME: ${endTime - startTime}ms`)
  console.log('🛡️  THE ONE TRUE GATEKEEPER STANDS VIGILANT - Path secured\n')
  
  return response
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