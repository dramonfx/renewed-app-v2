
// src/components/journal/JournalEntryList.jsx
// Sacred Journal Entry List - Gallery of spiritual reflections

'use client';

import { useState } from 'react';
import JournalEntryCard from './JournalEntryCard';
import JournalEntryModal from './JournalEntryModal';
import { BookOpen, Sparkles } from 'lucide-react';

export default function JournalEntryList({ 
  entries = [], 
  loading = false,
  onEntryUpdate,
  onEntryDelete 
}) {
  const [selectedEntry, setSelectedEntry] = useState(null);

  // Handle entry selection for detailed view
  const handleEntrySelect = (entry) => {
    setSelectedEntry(entry);
  };

  // Handle entry close
  const handleEntryClose = () => {
    setSelectedEntry(null);
  };

  // Handle entry update
  const handleEntryUpdate = (updatedEntry) => {
    onEntryUpdate?.(updatedEntry);
    setSelectedEntry(updatedEntry); // Update modal view
  };

  // Handle entry deletion
  const handleEntryDelete = (deletedEntryId) => {
    onEntryDelete?.(deletedEntryId);
    setSelectedEntry(null); // Close modal if deleting current entry
  };

  // Sacred loading state
  if (loading) {
    return (
      <div className="sacred-glass p-12 text-center">
        <div className="sacred-icon-bg w-16 h-16 mx-auto mb-6 animate-pulse">
          <BookOpen className="w-8 h-8" />
        </div>
        <p className="text-sacred-blue-600 font-medium">
          Gathering your sacred reflections...
        </p>
      </div>
    );
  }

  // Sacred empty state
  if (entries.length === 0) {
    return (
      <div className="sacred-glass p-12 text-center">
        <div className="sacred-icon-bg-gold w-20 h-20 mx-auto mb-6">
          <Sparkles className="w-10 h-10" />
        </div>
        <h3 className="font-sacred-serif text-2xl font-semibold text-sacred-blue-800 mb-4">
          Begin Your Sacred Journey
        </h3>
        <p className="text-sacred-blue-600 mb-6 max-w-md mx-auto">
          Your journal is ready to receive your first reflection. Every thought, 
          every insight, every moment of growth starts with a single entry.
        </p>
        <p className="text-sm text-sacred-blue-500 italic">
          Click "New Entry" above to begin your spiritual writing practice.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Sacred Entry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {entries.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            onClick={() => handleEntrySelect(entry)}
          />
        ))}
      </div>

      {/* Sacred Entry Modal */}
      {selectedEntry && (
        <JournalEntryModal
          entry={selectedEntry}
          onClose={handleEntryClose}
          onUpdate={handleEntryUpdate}
          onDelete={handleEntryDelete}
        />
      )}
    </>
  );
}
