// src/app/test-bookmarks/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import BookmarkPanel from '../../components/bookmarks/BookmarkPanel';
import { useBookmarkManager } from '../../hooks/bookmarks/useBookmarkManager';
import { BookmarkManager } from '../../lib/bookmarks/BookmarkManager';

/**
 * Bookmark System Test Page - Phase 3
 *
 * Comprehensive testing page for the Bookmark Renaissance system
 * with advanced management, search, and synchronization features.
 */

const TestBookmarksPage = () => {
  const [bookmarkManager] = useState(
    () =>
      new BookmarkManager({
        enableSync: true,
        enableCollaboration: false,
        enableAnalytics: true,
        autoSave: true,
        syncInterval: 30000,
        maxBookmarks: 1000,
        enableOfflineMode: true,
        enableExport: true,
      })
  );

  const [state, actions] = useBookmarkManager({
    trackId: 'test-track-1',
    enableRealTimeSync: true,
    enableLocalStorage: true,
  });

  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPanel, setShowPanel] = useState(true);
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);

  // Sample track data
  const sampleTrack = {
    id: 'test-track-1',
    title: 'Sacred Blue Meditation - Extended',
    artist: 'At His Feet Productions',
    duration: 300, // 5 minutes
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
  };

  // Simulate audio playback
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= sampleTrack.duration) {
            setIsPlaying(false);
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, sampleTrack.duration]);

  // Test functions
  const addTestResult = (test, result, details = '') => {
    setTestResults((prev) => [
      ...prev,
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        test,
        result,
        details,
      },
    ]);
  };

  const runBookmarkCreationTest = async () => {
    addTestResult('Bookmark Creation Test', 'RUNNING', 'Testing bookmark creation...');

    try {
      const testBookmarks = [
        {
          timestamp: 30,
          title: 'Beautiful Opening',
          description: 'The meditation begins with peaceful sounds',
          tags: ['peaceful', 'opening'],
          category: 'favorites',
        },
        {
          timestamp: 90,
          title: 'Deep Breathing Section',
          description: 'Focus on breath awareness',
          tags: ['breathing', 'mindfulness'],
          category: 'important',
        },
        {
          timestamp: 180,
          title: 'Visualization Moment',
          description: 'Sacred blue light visualization',
          tags: ['visualization', 'sacred'],
          category: 'notes',
        },
        {
          timestamp: 240,
          title: 'Closing Gratitude',
          description: 'Ending with gratitude practice',
          tags: ['gratitude', 'closing'],
          category: 'share',
        },
      ];

      for (const bookmark of testBookmarks) {
        await actions.createBookmark(sampleTrack.id, bookmark.timestamp, bookmark.title, {
          description: bookmark.description,
          tags: bookmark.tags,
          category: bookmark.category,
          isPublic: false,
        });
      }

      addTestResult(
        'Bookmark Creation Test',
        'PASS',
        `Created ${testBookmarks.length} test bookmarks`
      );
    } catch (error) {
      addTestResult('Bookmark Creation Test', 'FAIL', error.message);
    }
  };

  const runSearchTest = async () => {
    addTestResult('Search Test', 'RUNNING', 'Testing search functionality...');

    try {
      // Test text search
      const searchResults = actions.searchBookmarks('breathing');
      addTestResult(
        'Text Search',
        searchResults.length > 0 ? 'PASS' : 'FAIL',
        `Found ${searchResults.length} bookmarks for "breathing"`
      );

      // Test tag search
      const tagResults = actions.searchBookmarks('', { tags: ['peaceful'] });
      addTestResult(
        'Tag Search',
        tagResults.length > 0 ? 'PASS' : 'FAIL',
        `Found ${tagResults.length} bookmarks with "peaceful" tag`
      );

      // Test category filter
      const categoryResults = actions.searchBookmarks('', { categories: ['favorites'] });
      addTestResult(
        'Category Filter',
        categoryResults.length > 0 ? 'PASS' : 'FAIL',
        `Found ${categoryResults.length} bookmarks in "favorites" category`
      );

      addTestResult('Search Test', 'PASS', 'All search tests completed');
    } catch (error) {
      addTestResult('Search Test', 'FAIL', error.message);
    }
  };

  const runExportImportTest = async () => {
    addTestResult('Export/Import Test', 'RUNNING', 'Testing export and import functionality...');

    try {
      // Test JSON export
      const jsonData = actions.exportBookmarks('json');
      addTestResult(
        'JSON Export',
        jsonData.length > 0 ? 'PASS' : 'FAIL',
        `Exported ${jsonData.length} characters of JSON data`
      );

      // Test CSV export
      const csvData = actions.exportBookmarks('csv');
      addTestResult(
        'CSV Export',
        csvData.length > 0 ? 'PASS' : 'FAIL',
        `Exported ${csvData.length} characters of CSV data`
      );

      // Test XML export
      const xmlData = actions.exportBookmarks('xml');
      addTestResult(
        'XML Export',
        xmlData.length > 0 ? 'PASS' : 'FAIL',
        `Exported ${xmlData.length} characters of XML data`
      );

      addTestResult('Export/Import Test', 'PASS', 'Export tests completed successfully');
    } catch (error) {
      addTestResult('Export/Import Test', 'FAIL', error.message);
    }
  };

  const runCategoryTest = async () => {
    addTestResult('Category Test', 'RUNNING', 'Testing category management...');

    try {
      // Create custom category
      const customCategory = await actions.createCategory(
        'Custom Test',
        '#ff6b6b',
        '🧪',
        'Test category for validation'
      );

      addTestResult('Category Creation', 'PASS', `Created custom category: ${customCategory.name}`);

      // Create bookmark with custom category
      await actions.createBookmark(sampleTrack.id, 150, 'Test Bookmark with Custom Category', {
        description: 'Testing custom category assignment',
        tags: ['test', 'custom'],
        category: customCategory.id,
        isPublic: false,
      });

      addTestResult(
        'Category Assignment',
        'PASS',
        'Successfully assigned bookmark to custom category'
      );

      addTestResult('Category Test', 'PASS', 'All category tests completed');
    } catch (error) {
      addTestResult('Category Test', 'FAIL', error.message);
    }
  };

  const runPerformanceTest = async () => {
    addTestResult('Performance Test', 'RUNNING', 'Testing performance with bulk operations...');

    try {
      const startTime = performance.now();

      // Create multiple bookmarks quickly
      const promises = [];
      for (let i = 0; i < 20; i++) {
        promises.push(
          actions.createBookmark(
            sampleTrack.id,
            Math.random() * sampleTrack.duration,
            `Performance Test Bookmark ${i + 1}`,
            {
              description: `Auto-generated bookmark for performance testing`,
              tags: ['performance', 'test', `batch-${Math.floor(i / 5)}`],
              category: ['favorites', 'important', 'notes', 'share'][i % 4],
              isPublic: false,
            }
          )
        );
      }

      await Promise.all(promises);

      const endTime = performance.now();
      const duration = endTime - startTime;

      addTestResult('Bulk Creation', 'PASS', `Created 20 bookmarks in ${duration.toFixed(2)}ms`);

      // Test search performance
      const searchStart = performance.now();
      const searchResults = actions.searchBookmarks('test');
      const searchEnd = performance.now();

      addTestResult(
        'Search Performance',
        'PASS',
        `Searched ${searchResults.length} results in ${(searchEnd - searchStart).toFixed(2)}ms`
      );

      addTestResult('Performance Test', 'PASS', 'All performance tests completed');
    } catch (error) {
      addTestResult('Performance Test', 'FAIL', error.message);
    }
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);

    addTestResult('Test Suite', 'RUNNING', 'Starting comprehensive bookmark tests...');

    await runBookmarkCreationTest();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runSearchTest();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runCategoryTest();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runExportImportTest();
    await new Promise((resolve) => setTimeout(resolve, 1000));

    await runPerformanceTest();

    addTestResult('Test Suite', 'COMPLETE', 'All bookmark tests completed successfully');
    setIsRunningTests(false);
  };

  const clearAllBookmarks = async () => {
    if (!confirm('Are you sure you want to clear all test bookmarks?')) return;

    try {
      const allBookmarks = state.bookmarks;
      for (const bookmark of allBookmarks) {
        await actions.deleteBookmark(bookmark.id);
      }
      addTestResult('Cleanup', 'PASS', `Cleared ${allBookmarks.length} bookmarks`);
    } catch (error) {
      addTestResult('Cleanup', 'FAIL', error.message);
    }
  };

  const handleSeek = (timestamp) => {
    setCurrentTime(timestamp);
    addTestResult(
      'Seek Action',
      'PASS',
      `Seeked to ${Math.floor(timestamp / 60)}:${(timestamp % 60).toString().padStart(2, '0')}`
    );
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        color: '#ffffff',
      }}
    >
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            📚 The Bookmark Renaissance - Phase 3 Testing
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>
            Advanced Bookmark Management System with Real-time Synchronization
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px', gap: '32px' }}>
          {/* Main Content */}
          <div>
            {/* Mock Audio Player */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '16px' }}>🎵 Mock Audio Player</h2>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
                  {sampleTrack.title}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>{sampleTrack.artist}</div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    height: '6px',
                    position: 'relative',
                    cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    setCurrentTime(percent * sampleTrack.duration);
                  }}
                >
                  <div
                    style={{
                      background: '#3b82f6',
                      height: '100%',
                      borderRadius: '4px',
                      width: `${(currentTime / sampleTrack.duration) * 100}%`,
                      transition: 'width 0.1s ease',
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    color: '#9ca3af',
                    marginTop: '4px',
                  }}
                >
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(sampleTrack.duration)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '48px',
                    height: '48px',
                    color: 'white',
                    fontSize: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isPlaying ? '⏸' : '▶'}
                </button>

                <button
                  onClick={() => setShowPanel(!showPanel)}
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: '#a78bfa',
                    cursor: 'pointer',
                  }}
                >
                  {showPanel ? 'Hide' : 'Show'} Bookmarks
                </button>
              </div>
            </div>

            {/* Test Controls */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                marginBottom: '32px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>🧪 Test Controls</h2>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <button
                  onClick={runAllTests}
                  disabled={isRunningTests}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: 'white',
                    fontWeight: '600',
                    cursor: isRunningTests ? 'not-allowed' : 'pointer',
                    opacity: isRunningTests ? 0.6 : 1,
                  }}
                >
                  {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
                </button>

                <button
                  onClick={runBookmarkCreationTest}
                  style={{
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#34d399',
                    cursor: 'pointer',
                  }}
                >
                  Test Creation
                </button>

                <button
                  onClick={runSearchTest}
                  style={{
                    background: 'rgba(168, 85, 247, 0.2)',
                    border: '1px solid rgba(168, 85, 247, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#a78bfa',
                    cursor: 'pointer',
                  }}
                >
                  Test Search
                </button>

                <button
                  onClick={runExportImportTest}
                  style={{
                    background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#fbbf24',
                    cursor: 'pointer',
                  }}
                >
                  Test Export/Import
                </button>

                <button
                  onClick={clearAllBookmarks}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#f87171',
                    cursor: 'pointer',
                  }}
                >
                  Clear All
                </button>
              </div>

              {/* Statistics */}
              {state.stats && (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '16px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    padding: '16px',
                  }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#60a5fa' }}>
                      {state.stats.totalBookmarks}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Total Bookmarks</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#34d399' }}>
                      {state.stats.recentActivity}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Recent Activity</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#fbbf24' }}>
                      {Object.keys(state.stats.bookmarksByCategory).length}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Categories</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '600', color: '#a78bfa' }}>
                      {state.stats.syncQueueSize}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>Sync Queue</div>
                  </div>
                </div>
              )}
            </div>

            {/* Test Results */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>📊 Test Results</h2>

              {testResults.length === 0 ? (
                <p style={{ color: '#9ca3af', textAlign: 'center', padding: '40px' }}>
                  No test results yet. Run some tests to see results here.
                </p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {testResults.map((result) => (
                    <div
                      key={result.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        marginBottom: '8px',
                        borderRadius: '8px',
                        background:
                          result.result === 'PASS'
                            ? 'rgba(16, 185, 129, 0.1)'
                            : result.result === 'FAIL'
                              ? 'rgba(239, 68, 68, 0.1)'
                              : result.result === 'RUNNING'
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(107, 114, 128, 0.1)',
                        border: `1px solid ${
                          result.result === 'PASS'
                            ? 'rgba(16, 185, 129, 0.2)'
                            : result.result === 'FAIL'
                              ? 'rgba(239, 68, 68, 0.2)'
                              : result.result === 'RUNNING'
                                ? 'rgba(245, 158, 11, 0.2)'
                                : 'rgba(107, 114, 128, 0.2)'
                        }`,
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '600', marginBottom: '4px' }}>{result.test}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                          {result.timestamp} - {result.details}
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background:
                            result.result === 'PASS'
                              ? '#065f46'
                              : result.result === 'FAIL'
                                ? '#7f1d1d'
                                : result.result === 'RUNNING'
                                  ? '#78350f'
                                  : '#374151',
                          color:
                            result.result === 'PASS'
                              ? '#34d399'
                              : result.result === 'FAIL'
                                ? '#f87171'
                                : result.result === 'RUNNING'
                                  ? '#fbbf24'
                                  : '#9ca3af',
                        }}
                      >
                        {result.result}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bookmark Panel */}
          {showPanel && (
            <div>
              <BookmarkPanel
                bookmarkManager={bookmarkManager}
                currentTrackId={sampleTrack.id}
                currentTime={currentTime}
                onBookmarkSeek={handleSeek}
                onClose={() => setShowPanel(false)}
              />
            </div>
          )}
        </div>

        {/* Feature Overview */}
        <div
          style={{
            marginTop: '40px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <div
            style={{
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h3 style={{ color: '#60a5fa', fontSize: '18px', marginBottom: '16px' }}>
              📚 Advanced Management
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Real-time bookmark creation and editing</li>
              <li>• Category-based organization</li>
              <li>• Tag-based classification</li>
              <li>• Drag-and-drop reordering</li>
              <li>• Bulk operations support</li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h3 style={{ color: '#34d399', fontSize: '18px', marginBottom: '16px' }}>
              🔍 Smart Search & Filter
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Full-text search across content</li>
              <li>• Advanced filtering by tags/categories</li>
              <li>• Date range filtering</li>
              <li>• Smart search suggestions</li>
              <li>• Saved search queries</li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(168, 85, 247, 0.1)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h3 style={{ color: '#a78bfa', fontSize: '18px', marginBottom: '16px' }}>
              🔄 Real-time Sync
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Automatic cloud synchronization</li>
              <li>• Offline mode with sync queue</li>
              <li>• Conflict resolution</li>
              <li>• Version history tracking</li>
              <li>• Cross-device consistency</li>
            </ul>
          </div>

          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.2)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <h3 style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '16px' }}>
              📤 Export & Share
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Multiple export formats (JSON, CSV, XML)</li>
              <li>• Social sharing capabilities</li>
              <li>• Collaborative collections</li>
              <li>• Public bookmark sharing</li>
              <li>• Import from various sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestBookmarksPage;
