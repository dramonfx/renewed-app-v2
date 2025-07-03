'use client';

import { BookOpenIcon } from '@heroicons/react/24/outline';
import JournalEntryCard from './JournalEntryCard';

export default function JournalEntryList({ entries, loading, onEntryClick }) {
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

  if (entries.length === 0) {
    return (
      <div className="py-12 text-center">
        <BookOpenIcon className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h3 className="mb-2 text-lg font-medium text-gray-900">Begin Your Sacred Journey</h3>
        <p className="mb-6 text-gray-600">
          Create your first reflection to start documenting your spiritual growth.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <JournalEntryCard key={entry.id} entry={entry} onClick={() => onEntryClick(entry)} />
      ))}
    </div>
  );
}
