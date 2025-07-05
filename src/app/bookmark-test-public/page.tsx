'use client'

import React, { useState, useEffect } from 'react'

interface Bookmark {
  id: string
  title: string
  url: string
  description?: string
  tags?: string[]
  section: string
  created_at: string
}

export default function PublicBookmarkTestPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(false)
  const [newBookmark, setNewBookmark] = useState({
    title: '',
    url: '',
    description: '',
    tags: '',
    section: 'general'
  })
  const [authBypass, setAuthBypass] = useState(false)

  // Check if auth bypass is enabled
  useEffect(() => {
    fetch('/api/public/auth-status')
      .then(res => res.json())
      .then(data => {
        setAuthBypass(data.authBypass || false)
      })
      .catch(console.error)
  }, [])

  // Load bookmarks
  const loadBookmarks = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookmark-test/list')
      if (response.ok) {
        const data = await response.json()
        setBookmarks(data.bookmarks || [])
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Create bookmark
  const createBookmark = async () => {
    if (!newBookmark.title || !newBookmark.url) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/bookmark-test/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newBookmark,
          tags: newBookmark.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        })
      })
      
      if (response.ok) {
        setNewBookmark({ title: '', url: '', description: '', tags: '', section: 'general' })
        loadBookmarks()
      }
    } catch (error) {
      console.error('Failed to create bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  // Delete bookmark
  const deleteBookmark = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/bookmark-test/delete?id=${id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        loadBookmarks()
      }
    } catch (error) {
      console.error('Failed to delete bookmark:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load bookmarks on component mount
  useEffect(() => {
    loadBookmarks()
  }, [])

  const sections = ['general', 'work', 'personal', 'research', 'inspiration']

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-800 flex items-center justify-center gap-2">
            📚 Public Bookmark Test Interface
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Development testing interface for bookmark functionality. Test cross-section navigation and bookmark operations without authentication barriers.
          </p>
          
          {authBypass && (
            <div className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium mt-2">
              🚧 AUTH BYPASS ENABLED - Development Mode
            </div>
          )}
        </div>

        {/* Create New Bookmark */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            ➕ Create New Bookmark
          </h2>
          <p className="text-slate-600 mb-4">
            Add a new bookmark to test the bookmark system functionality
          </p>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Bookmark Title"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBookmark.title}
                onChange={(e) => setNewBookmark({ ...newBookmark, title: e.target.value })}
              />
              <input
                type="url"
                placeholder="URL (https://...)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBookmark.url}
                onChange={(e) => setNewBookmark({ ...newBookmark, url: e.target.value })}
              />
            </div>
            
            <textarea
              placeholder="Description (optional)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={newBookmark.description}
              onChange={(e) => setNewBookmark({ ...newBookmark, description: e.target.value })}
              rows={2}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Tags (comma separated)"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBookmark.tags}
                onChange={(e) => setNewBookmark({ ...newBookmark, tags: e.target.value })}
              />
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newBookmark.section}
                onChange={(e) => setNewBookmark({ ...newBookmark, section: e.target.value })}
              >
                {sections.map(section => (
                  <option key={section} value={section}>
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={createBookmark}
              disabled={loading || !newBookmark.title || !newBookmark.url}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Bookmark'}
            </button>
          </div>
        </div>

        {/* Bookmarks by Section */}
        <div className="space-y-6">
          {sections.map(section => {
            const sectionBookmarks = bookmarks.filter(b => b.section === section)
            if (sectionBookmarks.length === 0) return null
            
            return (
              <div key={section} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 capitalize">
                  {section} Bookmarks ({sectionBookmarks.length})
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sectionBookmarks.map(bookmark => (
                    <div key={bookmark.id} className="border rounded-lg p-4 space-y-2 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-slate-800 truncate flex-1">
                          {bookmark.title}
                        </h3>
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => window.open(bookmark.url, '_blank')}
                            className="text-blue-600 hover:text-blue-800 p-1"
                            title="Open URL"
                          >
                            🔗
                          </button>
                          <button
                            onClick={() => deleteBookmark(bookmark.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-800 p-1 disabled:text-gray-400"
                            title="Delete bookmark"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-slate-600 truncate">
                        {bookmark.url}
                      </p>
                      
                      {bookmark.description && (
                        <p className="text-sm text-slate-700">
                          {bookmark.description}
                        </p>
                      )}
                      
                      {bookmark.tags && bookmark.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {bookmark.tags.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs text-slate-500">
                        Created: {new Date(bookmark.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">How to Enable Auth Bypass:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-slate-600">
                <li>Set <code className="bg-slate-100 px-1 rounded">SKIP_AUTH=true</code> in your .env.local file</li>
                <li>Restart your development server</li>
                <li>Navigate to this page to test bookmark functionality</li>
                <li>Test cross-section navigation without login barriers</li>
              </ol>
            </div>
            
            <hr className="my-4" />
            
            <div className="space-y-2">
              <h4 className="font-semibold">Features to Test:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
                <li>Create bookmarks in different sections</li>
                <li>Add tags and descriptions</li>
                <li>Navigate between sections</li>
                <li>Delete bookmarks</li>
                <li>Open bookmark URLs</li>
                <li>Test responsive design</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500 py-4">
          <p>🔧 Development Testing Interface - Not for Production Use</p>
          <p>Repository: dramonfx/renewed-app-v2 | Branch: enhanced-bookmarks</p>
        </div>
      </div>
    </div>
  )
}
