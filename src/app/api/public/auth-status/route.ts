import { NextRequest, NextResponse } from 'next/server'

/**
 * Public API endpoint to check authentication bypass status
 * This helps the frontend understand if SKIP_AUTH is enabled
 */
export async function GET(request: NextRequest) {
  try {
    const authBypass = process.env.SKIP_AUTH === 'true'
    
    return NextResponse.json({
      authBypass,
      environment: process.env.NODE_ENV,
      message: authBypass 
        ? 'Authentication bypass is ENABLED - Development mode'
        : 'Authentication bypass is disabled'
    })
  } catch (error) {
    console.error('Auth status check error:', error)
    return NextResponse.json(
      { error: 'Failed to check auth status' },
      { status: 500 }
    )
  }
}
