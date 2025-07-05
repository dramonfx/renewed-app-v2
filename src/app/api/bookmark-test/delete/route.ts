import { NextRequest, NextResponse } from 'next/server'

// Mock bookmark storage (in real app, this would be a database)
let mockBookmarks: any[] = []

/**
 * Public API endpoint to delete bookmarks for testing
 * This bypasses authentication when SKIP_AUTH is enabled
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check if auth bypass is enabled
    const authBypass = process.env.SKIP_AUTH === 'true'
    
    if (!authBypass) {
      return NextResponse.json(
        { error: 'Authentication required. Set SKIP_AUTH=true for testing.' },
        { status: 401 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const bookmarkId = searchParams.get('id')
    
    if (!bookmarkId) {
      return NextResponse.json(
        { error: 'Bookmark ID is required' },
        { status: 400 }
      )
    }
    
    // Find and remove bookmark
    const initialLength = mockBookmarks.length
    mockBookmarks = mockBookmarks.filter(bookmark => bookmark.id !== bookmarkId)
    
    if (mockBookmarks.length === initialLength) {
      return NextResponse.json(
        { error: 'Bookmark not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      message: 'Bookmark deleted successfully (test data)',
      deletedId: bookmarkId
    })
  } catch (error) {
    console.error('Bookmark deletion error:', error)
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    )
  }
}
