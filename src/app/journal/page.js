'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import JournalHeader from '@/components/journal/JournalHeader'
import JournalEntryList from '@/components/journal/JournalEntryList'
import NewJournalEntry from '@/components/journal/NewJournalEntry'
import JournalEntryModal from '@/components/journal/JournalEntryModal'

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [user, setUser] = useState(null)
  const [filters, setFilters] = useState({
    mindset: '',
    reflectionType: '',
    search: ''
  })
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Check authentication and load user
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    checkAuth()
  }, [supabase, router])

  // Load journal entries
  const loadEntries = async () => {
    if (!user) return
    
    setLoading(true)
    setError('')
    
    try {
      const params = new URLSearchParams()
      if (filters.mindset) params.append('mindset', filters.mindset)
      if (filters.reflectionType) params.append('reflection_type', filters.reflectionType)
      if (filters.search) params.append('search', filters.search)
      
      const response = await fetch(`/api/journal?${params.toString()}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load entries')
      }
      
      setEntries(data.entries || [])
    } catch (error) {
      console.error('Error loading entries:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Load journal statistics
  const loadStats = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/journal/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.stats || {})
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      // Don't show error for stats, it's not critical
    }
  }

  // Load entries and stats when user is available or filters change
  useEffect(() => {
    if (user) {
      loadEntries()
      loadStats()
    }
  }, [user, filters])

  // Handle new entry creation
  const handleNewEntry = async (entryData) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create entry')
      }
      
      // Add new entry to the list and refresh stats
      setEntries(prev => [data.entry, ...prev])
      loadStats()
      setShowNewEntry(false)
    } catch (error) {
      console.error('Error creating entry:', error)
      throw error // Re-throw to let the form handle it
    }
  }

  // Handle entry update
  const handleUpdateEntry = async (id, entryData) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update entry')
      }
      
      // Update entry in the list and refresh stats
      setEntries(prev => prev.map(entry => 
        entry.id === id ? data.entry : entry
      ))
      loadStats()
      setSelectedEntry(null)
    } catch (error) {
      console.error('Error updating entry:', error)
      throw error
    }
  }

  // Handle entry deletion
  const handleDeleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this reflection? This action cannot be undone.')) {
      return
    }
    
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete entry')
      }
      
      // Remove entry from the list and refresh stats
      setEntries(prev => prev.filter(entry => entry.id !== id))
      loadStats()
      setSelectedEntry(null)
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry: ' + error.message)
    }
  }

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your sacred space...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <JournalHeader 
          entries={entries}
          stats={stats}
          filters={filters}
          onFilterChange={handleFilterChange}
          onNewEntry={() => setShowNewEntry(true)}
        />
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <button 
              onClick={loadEntries}
              className="mt-2 text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        )}
        
        <JournalEntryList
          entries={entries}
          loading={loading}
          onEntryClick={setSelectedEntry}
        />
        
        {/* New Entry Modal */}
        <NewJournalEntry
          isOpen={showNewEntry}
          onClose={() => setShowNewEntry(false)}
          onSave={handleNewEntry}
        />
        
        {/* Entry Detail Modal */}
        {selectedEntry && (
          <JournalEntryModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
            onUpdate={handleUpdateEntry}
            onDelete={handleDeleteEntry}
          />
        )}
      </div>
    </div>
  )
}
