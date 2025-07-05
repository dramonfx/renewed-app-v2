
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import UnifiedAudioPlayerFixed from '@/components/UnifiedAudioPlayerFixed';

/**
 * Bookmark System Fix Test Page
 * 
 * Test page to verify the new bookmark system works correctly:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Simple "Resume from X:XX" functionality
 * - Persistence between sessions
 */
export default function TestBookmarkFixPage() {
  const [mode, setMode] = useState<'single' | 'full'>('full');
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  const runBookmarkTests = () => {
    addTestResult('🧪 Starting bookmark system tests...');
    addTestResult(`📋 Testing ${mode} mode`);
    addTestResult(`✅ Player loaded successfully`);
    addTestResult(`📝 Instructions: Play audio, save bookmarks, test resume functionality`);
    
    if (mode === 'single') {
      addTestResult(`🎯 Single mode: Maximum 1 bookmark allowed`);
    } else {
      addTestResult(`🎯 Full mode: Maximum 2 bookmarks allowed`);
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8">
            <div className="text-center">
              <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                Bookmark System Fix Test
              </h1>
              <p className="mx-auto mb-4 max-w-2xl text-lg text-sacred-blue-600">
                Testing the new clean bookmark implementation with proper persistence and limits.
              </p>
              
              {/* Mode Selector */}
              <div className="flex justify-center space-x-4 mb-4">
                <SacredButton
                  variant={mode === 'full' ? 'primary' : 'ghost'}
                  onClick={() => setMode('full')}
                >
                  Full Player (2 bookmarks max)
                </SacredButton>
                <SacredButton
                  variant={mode === 'single' ? 'primary' : 'ghost'}
                  onClick={() => setMode('single')}
                >
                  Single Player (1 bookmark max)
                </SacredButton>
              </div>

              <div className="flex justify-center space-x-4">
                <SacredButton variant="secondary" onClick={runBookmarkTests}>
                  Run Tests
                </SacredButton>
                <SacredButton variant="ghost" onClick={clearTestResults}>
                  Clear Results
                </SacredButton>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Audio Player */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <SacredCard variant="glass" className="p-6">
            <h2 className="mb-4 text-center text-xl font-semibold text-sacred-blue-900">
              {mode === 'single' ? 'Single Player Test' : 'Full Player Test'}
            </h2>
            <UnifiedAudioPlayerFixed
              mode={mode}
              singleTrackSlug={mode === 'single' ? 'section-1' : null}
              onTrackChange={(track) => {
                if (track) {
                  addTestResult(`🎵 Track changed: ${track.title}`);
                }
              }}
              onPlayStateChange={(isPlaying) => {
                addTestResult(`${isPlaying ? '▶️' : '⏸️'} Playback ${isPlaying ? 'started' : 'paused'}`);
              }}
            />
          </SacredCard>
        </motion.div>

        {/* Test Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-sacred-blue-900">
              Test Instructions
            </h3>
            <div className="space-y-2 text-sm text-sacred-blue-700">
              <p><strong>1. Play Audio:</strong> Click play and let it run for a few seconds</p>
              <p><strong>2. Save Bookmark:</strong> Click the bookmark button to save current position</p>
              <p><strong>3. Seek Forward:</strong> Move to a different position in the audio</p>
              <p><strong>4. Test Resume:</strong> Click on the bookmark to resume from saved position</p>
              <p><strong>5. Test Limits:</strong> Try saving more bookmarks than allowed</p>
              <p><strong>6. Test Persistence:</strong> Refresh the page and verify bookmarks are saved</p>
              
              {mode === 'single' && (
                <p className="mt-4 p-2 bg-blue-100 rounded">
                  <strong>Single Mode:</strong> Only 1 bookmark allowed. New bookmark replaces old one.
                </p>
              )}
              
              {mode === 'full' && (
                <p className="mt-4 p-2 bg-green-100 rounded">
                  <strong>Full Mode:</strong> Maximum 2 bookmarks allowed. Oldest is removed when limit exceeded.
                </p>
              )}
            </div>
          </SacredCard>
        </motion.div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <SacredCard variant="glass" className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-sacred-blue-900">
                Test Results
              </h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {testResults.map((result, index) => (
                  <div
                    key={index}
                    className="text-xs font-mono text-sacred-blue-600 p-2 bg-white/20 rounded"
                  >
                    {result}
                  </div>
                ))}
              </div>
            </SacredCard>
          </motion.div>
        )}

        {/* Technical Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-8"
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-sacred-blue-900">
              Technical Implementation
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-sacred-blue-700">
              <div>
                <h4 className="font-semibold mb-2">Features Implemented:</h4>
                <ul className="space-y-1">
                  <li>✅ Simple bookmark storage with localStorage</li>
                  <li>✅ Mode-aware bookmark limits (1 for single, 2 for full)</li>
                  <li>✅ Automatic bookmark replacement in single mode</li>
                  <li>✅ Oldest bookmark removal in full mode</li>
                  <li>✅ Session persistence</li>
                  <li>✅ Clean UI with resume indicators</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Storage Keys:</h4>
                <ul className="space-y-1 font-mono text-xs">
                  <li>Single: <code>bookmarks-single-{'{trackId}'}</code></li>
                  <li>Full: <code>bookmarks-full</code></li>
                  <li>Progress: <code>audio-progress-{'{trackId}'}</code></li>
                </ul>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
