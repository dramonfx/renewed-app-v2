import { NextRequest, NextResponse } from 'next/server'

// This would normally be stored in a database
// For testing, we'll use a simple in-memory store
let mockBookmarks: any[] = []

/**
 * Public API endpoint to create bookmarks for testing
 * This bypasses authentication when SKIP_AUTH is enabled
 */
export async function POST(request: NextRequest) {
  try {
    // Check if auth bypass is enabled
    const authBypass = process.env.SKIP_AUTH === 'true'
    
    if (!authBypass) {
      return NextResponse.json(
        { error: 'Authentication required. Set SKIP_AUTH=true for testing.' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    const { title, url, description, tags, section } = body
    
    // Validate required fields
    if (!title || !url) {
      return NextResponse.json(
        { error: 'Title and URL are required' },
        { status: 400 }
      )
    }
    
    // Create new bookmark
    const newBookmark = {
      id: Date.now().toString(),
      title,
      url,
      description: description || '',
      tags: Array.isArray(tags) ? tags : [],
      section: section || 'general',
      created_at: new Date().toISOString(),
      user_id: 'test-user' // Mock user ID for testing
    }
    
    // Add to mock storage
    mockBookmarks.push(newBookmark)
    
    return NextResponse.json({
      bookmark: newBookmark,
      message: 'Bookmark created successfully (test data)'
    })
  } catch (error) {
    console.error('Bookmark creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    )
  }
}
