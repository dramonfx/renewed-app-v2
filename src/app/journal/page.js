
// src/app/journal/page.js
// Sacred Journaling Workshop - Main journal page serving as sanctuary for reflection

'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import JournalHeader from '@/components/journal/JournalHeader';
import JournalEntryList from '@/components/journal/JournalEntryList';
import NewJournalEntry from '@/components/journal/NewJournalEntry';
import JournalStats from '@/components/journal/JournalStats';
import { BookOpen, Plus, Search, Filter } from 'lucide-react';

export default function JournalPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Sacred state management
  const [entries, setEntries] = useState([]);
  const [entriesLoading, setEntriesLoading] = useState(true);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedTags, setSelectedTags] = useState([]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch journal entries
  const fetchEntries = async () => {
    try {
      setEntriesLoading(true);
      const params = new URLSearchParams();
      
      if (searchQuery) params.append('search', searchQuery);
      if (filterType !== 'all') params.append('type', filterType);
      if (selectedTags.length > 0) params.append('tags', selectedTags.join(','));
      
      const response = await fetch(`/api/journal?${params.toString()}`);
      
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
      } else {
        console.error('Failed to fetch journal entries');
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
    } finally {
      setEntriesLoading(false);
    }
  };

  // Initial fetch and refresh on filter changes
  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user, searchQuery, filterType, selectedTags]);

  // Handle new entry creation
  const handleNewEntry = (newEntry) => {
    setEntries(prev => [newEntry, ...prev]);
    setShowNewEntry(false);
  };

  // Handle entry update
  const handleEntryUpdate = (updatedEntry) => {
    setEntries(prev => prev.map(entry => 
      entry.id === updatedEntry.id ? updatedEntry : entry
    ));
  };

  // Handle entry deletion
  const handleEntryDelete = (deletedEntryId) => {
    setEntries(prev => prev.filter(entry => entry.id !== deletedEntryId));
  };

  // Sacred reflection types
  const reflectionTypes = [
    { value: 'all', label: 'All Reflections', icon: BookOpen },
    { value: 'journal', label: 'Journal Entries', icon: BookOpen },
    { value: 'gratitude', label: 'Gratitude', icon: '🙏' },
    { value: 'challenge', label: 'Challenges', icon: '⚡' },
    { value: 'insight', label: 'Insights', icon: '✨' },
    { value: 'prayer', label: 'Prayers', icon: '🕊️' },
    { value: 'growth', label: 'Growth', icon: '🌱' },
    { value: 'joy', label: 'Joy', icon: '☀️' }
  ];

  // Show loading state during authentication check
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 to-sacred-blue-100 flex items-center justify-center">
        <div className="sacred-glass p-8 text-center">
          <div className="sacred-icon-bg w-16 h-16 mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <p className="text-sacred-blue-700 font-semibold">Preparing your sacred space...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sacred-blue-50 via-white to-sacred-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Sacred Journal Header */}
        <JournalHeader />

        {/* Sacred Journal Statistics */}
        <JournalStats entries={entries} />

        {/* Sacred Search and Filter Bar */}
        <div className="sacred-glass p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Sacred Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sacred-blue-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search your reflections..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="sacred-input pl-10"
              />
            </div>

            {/* Sacred Filter */}
            <div className="lg:w-64">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="sacred-input"
              >
                {reflectionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sacred New Entry Button */}
            <button
              onClick={() => setShowNewEntry(true)}
              className="sacred-button flex items-center gap-2 lg:px-6"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">New Entry</span>
            </button>
          </div>
        </div>

        {/* Sacred Journal Entries */}
        <JournalEntryList 
          entries={entries}
          loading={entriesLoading}
          onEntryUpdate={handleEntryUpdate}
          onEntryDelete={handleEntryDelete}
        />

        {/* Sacred New Entry Modal */}
        {showNewEntry && (
          <NewJournalEntry
            onSave={handleNewEntry}
            onCancel={() => setShowNewEntry(false)}
          />
        )}

        {/* Sacred Floating Action Button for Mobile */}
        <button
          onClick={() => setShowNewEntry(true)}
          className="fixed bottom-6 right-6 lg:hidden sacred-icon-bg w-14 h-14 shadow-2xl hover:scale-110 transition-transform duration-300"
          aria-label="Create new journal entry"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
