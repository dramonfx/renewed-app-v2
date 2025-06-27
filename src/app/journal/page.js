
'use client'

import { useState, useEffect } from 'react'
import JournalHeader from '@/components/journal/JournalHeader'
import JournalEntryList from '@/components/journal/JournalEntryList'
import NewJournalEntry from '@/components/journal/NewJournalEntry'
import JournalEntryModal from '@/components/journal/JournalEntryModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import journalStorage from '@/lib/journalStorage'

export default function JournalPage() {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({})
  const [entriesLoading, setEntriesLoading] = useState(true)
  const [error, setError] = useState('')
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [filters, setFilters] = useState({
    mindset: '',
    reflectionType: '',
    search: ''
  })
  const [storageAvailable, setStorageAvailable] = useState(true)

  // Load journal entries from localStorage
  const loadEntries = () => {
    setEntriesLoading(true)
    setError('')

    try {
      // Create filter object compatible with journalStorage
      const storageFilters = {
        mindset: filters.mindset,
        reflection_type: filters.reflectionType,
        search: filters.search
      }

      const loadedEntries = journalStorage.getEntries(storageFilters)
      setEntries(loadedEntries)
    } catch (error) {
      console.error('Error loading entries:', error)
      setError(error.message)
      setStorageAvailable(false)
    } finally {
      setEntriesLoading(false)
    }
  }

  // Load journal statistics from localStorage
  const loadStats = () => {
    try {
      const loadedStats = journalStorage.getStats()
      setStats(loadedStats)
    } catch (error) {
      console.error('Error loading stats:', error)
      // Don't show error for stats, it's not critical
    }
  }

  // Check storage availability on mount
  useEffect(() => {
    try {
      const testKey = '__sacred_journal_test__'
      localStorage.setItem(testKey, 'test')
      localStorage.removeItem(testKey)
      setStorageAvailable(true)
    } catch (error) {
      setStorageAvailable(false)
      setError('localStorage is not available. Please enable it in your browser settings.')
    }
  }, [])

  // Load entries and stats when component mounts or filters change
  useEffect(() => {
    if (storageAvailable) {
      loadEntries()
      loadStats()
    }
  }, [filters, storageAvailable])

  // Handle new entry creation
  const handleNewEntry = async (entryData) => {
    try {
      const newEntry = journalStorage.createEntry(entryData)

      // Update local state immediately
      setEntries(prev => [newEntry, ...prev])
      loadStats() // Refresh stats
      setShowNewEntry(false)

      // Clear any saved draft since we successfully saved
      journalStorage.clearDraft()

      return newEntry
    } catch (error) {
      console.error('Error creating entry:', error)
      throw error // Re-throw to let the form handle it
    }
  }

  // Handle entry update
  const handleUpdateEntry = async (id, entryData) => {
    try {
      const updatedEntry = journalStorage.updateEntry(id, entryData)

      // Update entry in the list
      setEntries(prev => prev.map(entry =>
        entry.id === id ? updatedEntry : entry
      ))
      loadStats() // Refresh stats
      setSelectedEntry(null)

      return updatedEntry
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
      journalStorage.deleteEntry(id)

      // Remove entry from the list
      setEntries(prev => prev.filter(entry => entry.id !== id))
      loadStats() // Refresh stats
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

  // Handle data export
  const handleExportData = () => {
    try {
      const exportData = journalStorage.exportData()
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sacred-journal-export-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      alert('Failed to export data: ' + error.message)
    }
  }

  // Show error if storage is not available
  if (!storageAvailable) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Storage Not Available</h2>
          <p className="text-gray-600 mb-4">
            Sacred Journal requires localStorage to save your reflections. Please enable localStorage in your browser settings and refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    )
  }

  // Show loading state
  if (entriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <LoadingSpinner />
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
          onExportData={handleExportData}
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
          loading={entriesLoading}
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
