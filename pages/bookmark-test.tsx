// pages/bookmark-test.tsx
'use client';

import React, { useState, useRef } from 'react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { BookmarkButton } from '@/components/BookmarkButton';
import { BookmarkList } from '@/components/BookmarkList';

/**
 * Clean Bookmark System Test Page
 * 
 * Professional test page to verify bookmark functionality:
 * - Cross-section navigation
 * - localStorage persistence
 * - Mode-aware bookmark limits
 * - Clean error handling
 */
export default function BookmarkTestPage() {
  const [mode, setMode] = useState<'single' | 'full'>('full');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState('section-1');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock audio player time update
  const startMockPlayer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    intervalRef.current = setInterval(() => {
      setCurrentTime(prev => prev + 1);
    }, 1000);
    
    setIsPlaying(true);
  };

  const stopMockPlayer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const jumpToTime = (time: number) => {
    setCurrentTime(time);
  };

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
      trackId: currentSection,
      maxBookmarks: mode === 'single' ? 1 : 2
    },
    jumpToTime
  );

  const handleSaveBookmark = () => {
    const label = `Bookmark at ${Math.floor(currentTime / 60)}:${String(Math.floor(currentTime % 60)).padStart(2, '0')}`;
    saveBookmark(currentTime, label, currentSection);
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Clean Bookmark System Test
          </h1>
          <p className="text-lg text-gray-600">
            Testing cross-section navigation, persistence, and clean implementation
          </p>
        </div>

        {/* Mode Selector */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mode Selection</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setMode('single')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${mode === 'single'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              Single Mode (1 bookmark)
            </button>
            <button
              onClick={() => setMode('full')}
              className={`
                px-4 py-2 rounded-lg font-medium transition-colors
                ${mode === 'full'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              Full Mode (2 bookmarks)
            </button>
          </div>
        </div>

        {/* Mock Audio Player */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Mock Audio Player</h2>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-2xl font-mono">
              {formatTime(currentTime)}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={isPlaying ? stopMockPlayer : startMockPlayer}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors
                  ${isPlaying
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                `}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              
              <button
                onClick={() => setCurrentTime(0)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Section Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Section:
            </label>
            <select
              value={currentSection}
              onChange={(e) => setCurrentSection(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="section-1">Section 1</option>
              <option value="section-2">Section 2</option>
              <option value="section-3">Section 3</option>
            </select>
          </div>

          {/* Bookmark Controls */}
          <div className="flex items-center gap-4">
            <BookmarkButton
              onSaveBookmark={handleSaveBookmark}
              canSave={canSaveBookmark}
            />
            
            <button
              onClick={clearBookmarks}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium"
            >
              Clear All
            </button>
            
            <span className="text-sm text-gray-600">
              {mode === 'single' ? '1 bookmark max' : '2 bookmarks max'}
            </span>
          </div>
        </div>

        {/* Bookmark List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <BookmarkList
            bookmarks={bookmarks}
            onJumpToBookmark={jumpToBookmark}
            onDeleteBookmark={deleteBookmark}
          />
        </div>

        {/* Test Instructions */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
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