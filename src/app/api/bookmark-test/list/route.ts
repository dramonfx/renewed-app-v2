import { NextRequest, NextResponse } from 'next/server'

// Mock bookmark data for testing
let mockBookmarks = [
  {
    id: '1',
    title: 'Next.js Documentation',
    url: 'https://nextjs.org/docs',
    description: 'Official Next.js documentation for learning and reference',
    tags: ['nextjs', 'documentation', 'react'],
    section: 'work',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Tailwind CSS',
    url: 'https://tailwindcss.com',
    description: 'Utility-first CSS framework',
    tags: ['css', 'tailwind', 'styling'],
    section: 'work',
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: 'GitHub Repository',
    url: 'https://github.com/dramonfx/renewed-app-v2',
    description: 'Main project repository',
    tags: ['github', 'repository', 'project'],
    section: 'general',
    created_at: new Date().toISOString()
  }
]

/**
 * Public API endpoint to list bookmarks for testing
 * This bypasses authentication when SKIP_AUTH is enabled
 */
export async function GET(request: NextRequest) {
  try {
    // Check if auth bypass is enabled
    const authBypass = process.env.SKIP_AUTH === 'true'
    
    if (!authBypass) {
      return NextResponse.json(
        { error: 'Authentication required. Set SKIP_AUTH=true for testing.' },
        { status: 401 }
      )
    }
    
    // Return mock bookmarks for testing
    return NextResponse.json({
      bookmarks: mockBookmarks,
      total: mockBookmarks.length,
      message: 'Bookmarks loaded successfully (test data)'
    })
  } catch (error) {
    console.error('Bookmark list error:', error)
    return NextResponse.json(
      { error: 'Failed to load bookmarks' },
      { status: 500 }
    )
  }
}
