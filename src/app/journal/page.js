'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalEntryList from '@/components/journal/JournalEntryList';
import SacredJournalEntry from '@/components/journal/SacredJournalEntry';
import JournalEntryModal from '@/components/journal/JournalEntryModal';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { SparklesIcon, BookOpenIcon, HeartIcon } from '@heroicons/react/24/outline';
import { useDeepReflection } from '@/hooks/useDeepReflection';
import { ContemplativeLoading, SpiritualPause } from '@/components/SpiritualPauseSystem';
import journalStorage from '@/lib/journalStorage';

// Deep Reflections List Component
function DeepReflectionsList({ reflections, loading, onDeleteReflection }) {
  const [isDeleting, setIsDeleting] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this reflection? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(id);
    const result = await onDeleteReflection(id);
    
    if (!result.success) {
      console.error('Failed to delete reflection:', result.error);
    }
    
    setIsDeleting(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-3 h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="mb-2 h-3 w-1/2 rounded bg-gray-200"></div>
                <div className="h-3 w-1/3 rounded bg-gray-200"></div>
              </div>
              <div className="ml-4 h-6 w-16 rounded-full bg-gray-200"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 rounded bg-gray-200"></div>
              <div className="h-3 w-5/6 rounded bg-gray-200"></div>
              <div className="h-3 w-4/6 rounded bg-gray-200"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (reflections.length === 0) {
    return (
      <div className="py-12 text-center">
        <SparklesIcon className="mx-auto mb-4 h-16 w-16 text-blue-300" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">No Sacred Reflections Yet</h3>
        <p className="mb-6 text-gray-600">
          Listen to audio sections and capture your spiritual insights as they arise.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reflections.map((reflection, index) => (
        <motion.div
          key={reflection.id}
          className="bg-white/70 backdrop-blur-sm rounded-2xl border border-blue-100 overflow-hidden hover:shadow-lg transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 * index }}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <SparklesIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">
                    {reflection.section_title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-blue-600">
                    <div className="flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" />
                      <span className="font-mono">{reflection.formatted_timestamp}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpenIcon className="w-3 h-3" />
                      <span>{formatDate(reflection.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(reflection.id)}
                disabled={isDeleting === reflection.id}
                className="p-2 text-blue-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                aria-label="Delete reflection"
                title="Delete this reflection"
              >
                {isDeleting === reflection.id ? (
                  <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                ) : (
                  <HeartIcon className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Reflection Content */}
            <div className="prose prose-blue max-w-none">
              <p className="text-blue-800 leading-relaxed italic">
                &ldquo;{reflection.answer_text}&rdquo;
              </p>
            </div>

            {/* Tags */}
            {reflection.tags && reflection.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {reflection.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

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
  const [activeTab, setActiveTab] = useState('journal');

  // Deep Reflections integration
  const { 
    reflections: deepReflections, 
    loading: deepReflectionsLoading, 
    error: deepReflectionsError,
    hasReflections,
    stats: deepReflectionStats,
    deleteReflection
  } = useDeepReflection();

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

  // Show contemplative loading state
  if (entriesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <ContemplativeLoading 
          text="Gathering your sacred reflections..."
          category="practice"
          showQuote={true}
        />
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
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <JournalHeader
                  entries={entries}
                  stats={stats}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onNewEntry={() => setShowNewEntry(true)}
                  onExportData={handleExportData}
                />
              </div>
              {/* Spiritual Pause Moment */}
              <div className="ml-4 flex items-center space-x-2">
                <SpiritualPause 
                  trigger="click"
                  duration={4000}
                  category="reflection"
                />
                <span className="text-xs text-blue-600 hidden sm:block">Take a pause</span>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mb-6"
          >
            <div className="flex space-x-1 rounded-xl bg-white/50 p-1 backdrop-blur-sm border border-blue-100">
              <button
                onClick={() => setActiveTab('journal')}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                  activeTab === 'journal'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-blue-600 hover:bg-blue-50'
                }`}
              >
                <BookOpenIcon className="w-4 h-4 mr-2" />
                Journal Entries ({entries.length})
              </button>
              {hasReflections && (
                <button
                  onClick={() => setActiveTab('reflections')}
                  className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                    activeTab === 'reflections'
                      ? 'bg-blue-500 text-white shadow-md'
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <SparklesIcon className="w-4 h-4 mr-2" />
                  Sacred Reflections ({deepReflections.length})
                </button>
              )}
            </div>
          </motion.div>

          {/* Enhanced Error Display */}
          {(error || deepReflectionsError) && (
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
                  <p className="mt-1 text-sm text-red-600">{error || deepReflectionsError}</p>
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

          {/* Tab Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {activeTab === 'journal' && (
              <JournalEntryList
                entries={entries}
                loading={entriesLoading}
                onEntryClick={setSelectedEntry}
              />
            )}
            
            {activeTab === 'reflections' && (
              <DeepReflectionsList
                reflections={deepReflections}
                loading={deepReflectionsLoading}
                onDeleteReflection={deleteReflection}
              />
            )}
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
