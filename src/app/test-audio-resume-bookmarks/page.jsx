
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import UnifiedAudioPlayerFixed from '@/components/UnifiedAudioPlayerFixed';
import { useAudioPlayerFixed } from '@/hooks/useAudioPlayerFixed';

export default function TestAudioResumeBookmarksPage() {
  const [debugInfo, setDebugInfo] = useState({});
  const [testResults, setTestResults] = useState({
    autoResume: 'Not tested',
    bookmarkInline: 'Not tested',
    perTrackBookmarks: 'Not tested',
    crossSectionNavigation: 'Not tested',
  });

  // Initialize audio player for debugging
  const {
    tracks,
    currentTrack,
    currentTrackIndex,
    bookmarks,
    getAllProgress,
    clearAllProgress,
    formatTime,
  } = useAudioPlayerFixed({
    mode: 'full',
    autoLoad: true,
  });

  // Update debug info
  useEffect(() => {
    const updateDebugInfo = () => {
      setDebugInfo({
        currentTrack: currentTrack?.title || 'None',
        currentTrackIndex,
        totalTracks: tracks.length,
        totalBookmarks: bookmarks.length,
        bookmarksByTrack: tracks.reduce((acc, track) => {
          const trackBookmarksCount = bookmarks.filter(b => b.trackId === track.id).length;
          if (trackBookmarksCount > 0) {
            acc[track.title] = trackBookmarksCount;
          }
          return acc;
        }, {}),
        progressData: getAllProgress(),
        localStorage: Object.keys(localStorage).filter(key => 
          key.startsWith('audio-progress-') || key.startsWith('bookmarks-')
        ),
      });
    };

    updateDebugInfo();
    const interval = setInterval(updateDebugInfo, 2000);
    return () => clearInterval(interval);
  }, [currentTrack, currentTrackIndex, tracks, bookmarks, getAllProgress]);

  const runAutoResumeTest = async () => {
    setTestResults(prev => ({ ...prev, autoResume: 'Testing...' }));
    
    // Simulate leaving and returning
    const hasProgressData = Object.keys(debugInfo.progressData || {}).length > 0;
    const hasLocalStorageEntries = debugInfo.localStorage.some(key => key.startsWith('audio-progress-'));
    
    if (hasProgressData && hasLocalStorageEntries) {
      setTestResults(prev => ({ ...prev, autoResume: '✅ PASSED - Progress data found' }));
    } else {
      setTestResults(prev => ({ ...prev, autoResume: '⚠️ PARTIAL - Play audio for a few seconds first' }));
    }
  };

  const runBookmarkInlineTest = () => {
    setTestResults(prev => ({ ...prev, bookmarkInline: 'Testing...' }));
    
    const hasBookmarks = bookmarks.length > 0;
    if (hasBookmarks) {
      setTestResults(prev => ({ 
        ...prev, 
        bookmarkInline: '✅ PASSED - Bookmarks exist and should be visible inline' 
      }));
    } else {
      setTestResults(prev => ({ 
        ...prev, 
        bookmarkInline: '⚠️ PARTIAL - Create bookmarks using the bookmark button below' 
      }));
    }
  };

  const runPerTrackBookmarkTest = () => {
    setTestResults(prev => ({ ...prev, perTrackBookmarks: 'Testing...' }));
    
    const bookmarkCounts = Object.values(debugInfo.bookmarksByTrack || {});
    const hasMultipleTracksWithBookmarks = bookmarkCounts.length > 1;
    const respectsLimits = bookmarkCounts.every(count => count <= 2);
    
    if (hasMultipleTracksWithBookmarks && respectsLimits) {
      setTestResults(prev => ({ 
        ...prev, 
        perTrackBookmarks: '✅ PASSED - Multiple tracks have bookmarks within limits' 
      }));
    } else if (respectsLimits) {
      setTestResults(prev => ({ 
        ...prev, 
        perTrackBookmarks: '⚠️ PARTIAL - Add bookmarks to different tracks to test' 
      }));
    } else {
      setTestResults(prev => ({ 
        ...prev, 
        perTrackBookmarks: '❌ FAILED - Bookmark limits not respected' 
      }));
    }
  };

  const runCrossSectionTest = () => {
    setTestResults(prev => ({ ...prev, crossSectionNavigation: 'Testing...' }));
    
    const hasCrossSectionBookmarks = bookmarks.some(b => 
      b.trackId && b.trackId !== currentTrack?.id
    );
    
    if (hasCrossSectionBookmarks) {
      setTestResults(prev => ({ 
        ...prev, 
        crossSectionNavigation: '✅ PASSED - Bookmarks exist across sections' 
      }));
    } else {
      setTestResults(prev => ({ 
        ...prev, 
        crossSectionNavigation: '⚠️ PARTIAL - Create bookmarks in different sections to test' 
      }));
    }
  };

  const runAllTests = () => {
    runAutoResumeTest();
    setTimeout(runBookmarkInlineTest, 500);
    setTimeout(runPerTrackBookmarkTest, 1000);
    setTimeout(runCrossSectionTest, 1500);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <SacredCard variant="heavy" className="p-8">
            <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900">
              🎯 Auto-Resume & Bookmark System Test
            </h1>
            <p className="text-lg text-sacred-blue-600">
              Comprehensive testing for the three priority implementations
            </p>
          </SacredCard>
        </motion.div>

        {/* Test Results Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SacredCard variant="glass" className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-sacred-blue-900">Test Results</h2>
              <SacredButton onClick={runAllTests} variant="primary">
                Run All Tests
              </SacredButton>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <h3 className="font-semibold text-sacred-blue-800">Priority 1: Auto-Resume</h3>
                  <p className="text-sm text-sacred-blue-600">{testResults.autoResume}</p>
                </div>
                <div className="rounded-lg bg-white/20 p-3">
                  <h3 className="font-semibold text-sacred-blue-800">Priority 2: Inline Bookmarks</h3>
                  <p className="text-sm text-sacred-blue-600">{testResults.bookmarkInline}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-lg bg-white/20 p-3">
                  <h3 className="font-semibold text-sacred-blue-800">Per-Track Bookmark Limits</h3>
                  <p className="text-sm text-sacred-blue-600">{testResults.perTrackBookmarks}</p>
                </div>
                <div className="rounded-lg bg-white/20 p-3">
                  <h3 className="font-semibold text-sacred-blue-800">Cross-Section Navigation</h3>
                  <p className="text-sm text-sacred-blue-600">{testResults.crossSectionNavigation}</p>
                </div>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-sacred-blue-900">
              Audio Player with Enhanced Bookmark System
            </h2>
            <UnifiedAudioPlayerFixed mode="full" />
          </SacredCard>
        </motion.div>

        {/* Debug Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <SacredCard variant="glass" className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-sacred-blue-900">Debug Information</h2>
              <SacredButton 
                onClick={clearAllProgress} 
                variant="ghost" 
                className="text-xs opacity-70"
              >
                Clear All Progress
              </SacredButton>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="mb-2 font-semibold text-sacred-blue-800">Current State</h3>
                <div className="space-y-1 text-sm text-sacred-blue-600">
                  <p><strong>Current Track:</strong> {debugInfo.currentTrack}</p>
                  <p><strong>Track Index:</strong> {debugInfo.currentTrackIndex + 1} of {debugInfo.totalTracks}</p>
                  <p><strong>Total Bookmarks:</strong> {debugInfo.totalBookmarks}</p>
                </div>
                
                <h3 className="mb-2 mt-4 font-semibold text-sacred-blue-800">Bookmarks by Track</h3>
                <div className="space-y-1 text-sm text-sacred-blue-600">
                  {Object.entries(debugInfo.bookmarksByTrack || {}).map(([track, count]) => (
                    <p key={track}><strong>{track}:</strong> {count} bookmark{count !== 1 ? 's' : ''}</p>
                  ))}
                  {Object.keys(debugInfo.bookmarksByTrack || {}).length === 0 && (
                    <p className="italic opacity-75">No bookmarks yet</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="mb-2 font-semibold text-sacred-blue-800">localStorage Entries</h3>
                <div className="max-h-32 space-y-1 overflow-y-auto text-xs text-sacred-blue-600">
                  {debugInfo.localStorage?.map(key => (
                    <p key={key} className="font-mono">{key}</p>
                  )) || <p className="italic opacity-75">No storage entries</p>}
                </div>
                
                <h3 className="mb-2 mt-4 font-semibold text-sacred-blue-800">Progress Data</h3>
                <div className="max-h-32 overflow-y-auto text-xs text-sacred-blue-600">
                  <pre className="font-mono">
                    {JSON.stringify(debugInfo.progressData, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <SacredCard variant="glass" className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-sacred-blue-900">Testing Instructions</h2>
            <div className="space-y-4 text-sm text-sacred-blue-600">
              <div>
                <h3 className="font-semibold text-sacred-blue-800">1. Auto-Resume Testing:</h3>
                <p>• Play audio for 10+ seconds, then navigate away or refresh the page</p>
                <p>• Return to this page - it should resume from where you left off</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sacred-blue-800">2. Bookmark System Testing:</h3>
                <p>• Create bookmarks using the bookmark button in the player</p>
                <p>• Switch to different tracks and create bookmarks there</p>
                <p>• Notice bookmarks appear inline in the track list above: "Track Name • Bookmark 1 – 03:21"</p>
                <p>• Test individual bookmark deletion using the trash icons</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-sacred-blue-800">3. Cross-Section Navigation:</h3>
                <p>• Create bookmarks in multiple tracks</p>
                <p>• Click on bookmarks from different tracks to test navigation</p>
                <p>• Verify it switches tracks and jumps to the correct time</p>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
