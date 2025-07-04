'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalEntryList from '@/components/journal/JournalEntryList';
import SacredJournalEntry from '@/components/journal/SacredJournalEntry';
import JournalEntryModal from '@/components/journal/JournalEntryModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SparklesIcon } from '@heroicons/react/24/outline';
import journalStorage from '@/lib/journalStorage';

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({});
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [filters, setFilters] = useState({
    mindset: '',
    reflectionType: '',
    search: '',
  });
  const [storageAvailable, setStorageAvailable] = useState(true);

  // Load journal entries from localStorage
  const loadEntries = () => {
    setEntriesLoading(true);
    setError('');

    try {
      // Create filter object compatible with journalStorage
      const storageFilters = {
        mindset: filters.mindset,
        reflection_type: filters.reflectionType,
        search: filters.search,
      };

      const loadedEntries = journalStorage.getEntries(storageFilters);
      setEntries(loadedEntries);
    } catch (error) {
      console.error('Error loading entries:', error);
      setError(error.message);
      setStorageAvailable(false);
    } finally {
      setEntriesLoading(false);
    }
  };

  // Load journal statistics from localStorage
  const loadStats = () => {
    try {
      const loadedStats = journalStorage.getStats();
      setStats(loadedStats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Don't show error for stats, it's not critical
    }
  };

  // Check storage availability on mount
  useEffect(() => {
    try {
      const testKey = '__sacred_journal_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
      setStorageAvailable(true);
    } catch (error) {
      setStorageAvailable(false);
      setError('localStorage is not available. Please enable it in your browser settings.');
    }
  }, []);

  // Load entries and stats when component mounts or filters change
  useEffect(() => {
    if (storageAvailable) {
      loadEntries();
      loadStats();
    }
  }, [filters, storageAvailable]);

  // Handle new entry creation
  const handleNewEntry = async (entryData) => {
    try {
      const newEntry = journalStorage.createEntry(entryData);

      // Update local state immediately
      setEntries((prev) => [newEntry, ...prev]);
      loadStats(); // Refresh stats
      setShowNewEntry(false);

      // Clear any saved draft since we successfully saved
      journalStorage.clearDraft();

      return newEntry;
    } catch (error) {
      console.error('Error creating entry:', error);
      throw error; // Re-throw to let the form handle it
    }
  };

  // Handle entry update
  const handleUpdateEntry = async (id, entryData) => {
    try {
      const updatedEntry = journalStorage.updateEntry(id, entryData);

      // Update entry in the list
      setEntries((prev) => prev.map((entry) => (entry.id === id ? updatedEntry : entry)));
      loadStats(); // Refresh stats
      setSelectedEntry(null);

      return updatedEntry;
    } catch (error) {
      console.error('Error updating entry:', error);
      throw error;
    }
  };

  // Handle entry deletion
  const handleDeleteEntry = async (id) => {
    if (
      !confirm('Are you sure you want to delete this reflection? This action cannot be undone.')
    ) {
      return;
    }

    try {
      journalStorage.deleteEntry(id);

      // Remove entry from the list
      setEntries((prev) => prev.filter((entry) => entry.id !== id));
      loadStats(); // Refresh stats
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry: ' + error.message);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Handle data export
  const handleExportData = () => {
    try {
      const exportData = journalStorage.exportData();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sacred-journal-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export data: ' + error.message);
    }
  };

  // Show error if storage is not available
  if (!storageAvailable) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mb-4 text-red-500">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Storage Not Available</h2>
          <p className="mb-4 text-gray-600">
            Sacred Journal requires localStorage to save your reflections. Please enable
            localStorage in your browser settings and refresh the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (entriesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Sacred Background Overlay */}
      <div className="via-indigo-900/3 pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-900/5 to-purple-900/5"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="mx-auto max-w-6xl px-4 py-8">
          {/* Sacred Header with Enhanced Styling */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <JournalHeader
              entries={entries}
              stats={stats}
              filters={filters}
              onFilterChange={handleFilterChange}
              onNewEntry={() => setShowNewEntry(true)}
              onExportData={handleExportData}
            />
          </motion.div>

          {/* Enhanced Error Display */}
          {error && (
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="mb-6 rounded-xl border border-red-200 bg-red-50/90 p-6 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                  <SparklesIcon className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-800">
                    Something went amiss in your sacred space
                  </p>
                  <p className="mt-1 text-sm text-red-600">{error}</p>
                </div>
              </div>
              <button
                onClick={loadEntries}
                className="mt-4 rounded-lg bg-red-100 px-4 py-2 font-medium text-red-700 transition-colors hover:bg-red-200"
              >
                Restore Connection
              </button>
            </motion.div>
          )}

          {/* Sacred Journal Entries */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <JournalEntryList
              entries={entries}
              loading={entriesLoading}
              onEntryClick={setSelectedEntry}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Sacred Journal Entry Modal */}
      <SacredJournalEntry
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
  );
}
