// pages/bookmark-test.tsx
// Clean Bookmark System Test Page

import React, { useState, useEffect } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkButton } from '@/components/BookmarkButton';
import { BookmarkList } from '@/components/BookmarkList';

/**
 * Clean Bookmark System Test Page
 * 
 * Professional test page to verify bookmark functionality:
 * - Cross-section bookmark navigation
 * - Mode-aware bookmark limits
 * - Clean UI with Sacred Design System
 */
export default function BookmarkTestPage() {
  // Mock audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentSection, setCurrentSection] = useState('00_prologue');
  const [mode, setMode] = useState<'single' | 'full'>('single');

  // Mock timer for testing
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  // Mock sections for testing
  const sections = [
    { slug: '00_prologue', title: 'Prologue' },
    { slug: '01_intro_through_next_steps', title: 'Introduction Through Next Steps' },
    { slug: '02_kingdom_government', title: 'Kingdom Government' },
    { slug: '03_elephant_in_the_kingdom', title: 'Elephant in the Kingdom' },
    { slug: '04_characteristics_of_principles', title: 'Characteristics of Principles' },
    { slug: '05_approved', title: 'Approved' },
    { slug: '06_key_principles_01-10', title: '30 Key Principles (01–10)' },
    { slug: '06_key_principles_11-20', title: '30 Key Principles (11–20)' },
    { slug: '06_key_principles_21-30', title: '30 Key Principles (21–30)' },
    { slug: '07_conclusion', title: 'Conclusion' },
  ];

  // Initialize bookmark hook
  const {
    bookmarks,
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark
  } = useBookmarks(
    {
      mode,
      trackId: mode === 'single' ? currentSection : undefined,
      maxBookmarks: mode === 'single' ? 1 : 2
    }
  );

  const handleSaveBookmark = () => {
    const label = `Bookmark at ${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`;
    saveBookmark(currentTime, label, currentSection);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-blue-900">
            Clean Bookmark System Test
          </h1>
          <p className="text-lg text-blue-700">
            Professional bookmark testing with cross-section navigation
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Controls Panel */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-blue-900">
              Audio Player Controls
            </h2>
            
            {/* Mode Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-blue-800">
                Player Mode
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setMode('single')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'single'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Single Mode (1 bookmark)
                </button>
                <button
                  onClick={() => setMode('full')}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'full'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  Full Mode (2 bookmarks)
                </button>
              </div>
            </div>

            {/* Section Selection */}
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-blue-800">
                Current Section
              </label>
              <select
                value={currentSection}
                onChange={(e) => setCurrentSection(e.target.value)}
                className="w-full rounded-lg border border-blue-200 bg-white px-3 py-2 text-blue-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                {sections.map((section) => (
                  <option key={section.slug} value={section.slug}>
                    {section.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Mock Audio Controls */}
            <div className="mb-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-blue-800">Time</span>
                <span className="text-sm text-blue-600">{formatTime(currentTime)}</span>
              </div>
              <div className="mb-4 flex items-center space-x-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`rounded-lg px-6 py-2 font-medium text-white transition-colors ${
                    isPlaying
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-green-500 hover:bg-green-600'
                  }`}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setCurrentTime(0)}
                  className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Bookmark Controls */}
            <div className="border-t border-blue-100 pt-4">
              <BookmarkButton
                onSaveBookmark={handleSaveBookmark}
                canSave={canSaveBookmark}
              />
              <button
                onClick={clearBookmarks}
                className="ml-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
              >
                Clear All
              </button>
              <p className="mt-2 text-xs text-blue-600">
                {mode === 'single' ? '1 bookmark max' : '2 bookmarks max'}
              </p>
            </div>
          </div>

          {/* Bookmark List */}
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <BookmarkList
              bookmarks={bookmarks}
              onJumpToBookmark={jumpToBookmark}
              onDeleteBookmark={deleteBookmark}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 rounded-xl bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Test Instructions
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Click &quot;Play&quot; to start the mock timer</li>
            <li>Save bookmarks at different times</li>
            <li>Test bookmark limits (1 for single, 2 for full mode)</li>
            <li>Change sections and save cross-section bookmarks</li>
            <li>Click &quot;Resume&quot; to test navigation</li>
            <li>Refresh the page to test persistence</li>
            <li>Test delete functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
