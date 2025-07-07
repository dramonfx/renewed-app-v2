
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Bookmark, 
  RotateCcw, 
  Trash2, 
  CheckCircle, 
  AlertCircle,
  Bug,
  RefreshCw
} from 'lucide-react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';
import UnifiedAudioPlayerFixed from '@/components/UnifiedAudioPlayerFixed';

export default function TestAudioResumeBooksmarks() {
  const [testResults, setTestResults] = useState({
    autoResume: null,
    singleBookmarks: null,
    fullBookmarks: null,
    crossSectionNav: null
  });
  
  const [debugInfo, setDebugInfo] = useState({
    progress: {},
    bookmarks: {}
  });

  // Refresh debug info
  const refreshDebugInfo = () => {
    // Get all progress data
    const allProgress = {};
    const allBookmarks = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('audio-progress-')) {
        try {
          const value = localStorage.getItem(key);
          allProgress[key] = value ? JSON.parse(value) : null;
        } catch {
          allProgress[key] = localStorage.getItem(key);
        }
      }
      if (key?.startsWith('bookmarks-')) {
        try {
          const value = localStorage.getItem(key);
          allBookmarks[key] = value ? JSON.parse(value) : null;
        } catch {
          allBookmarks[key] = localStorage.getItem(key);
        }
      }
    }
    
    setDebugInfo({ progress: allProgress, bookmarks: allBookmarks });
  };

  // Clear all data
  const clearAllData = () => {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('audio-progress-') || key.startsWith('bookmarks-')
    );
    keys.forEach(key => localStorage.removeItem(key));
    refreshDebugInfo();
    setTestResults({
      autoResume: null,
      singleBookmarks: null,
      fullBookmarks: null,
      crossSectionNav: null
    });
  };

  useEffect(() => {
    refreshDebugInfo();
  }, []);

  const TestInstructions = ({ title, steps, status }) => (
    <SacredCard variant="glass" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-sacred-blue-900">{title}</h3>
        {status === 'pass' && <CheckCircle className="h-5 w-5 text-green-600" />}
        {status === 'fail' && <AlertCircle className="h-5 w-5 text-red-600" />}
      </div>
      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="text-sm text-sacred-blue-700">
            <span className="font-semibold">{index + 1}.</span> {step}
          </li>
        ))}
      </ol>
    </SacredCard>
  );

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SacredCard variant="heavy" className="p-8 text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="sacred-icon-bg mr-4 h-16 w-16">
                <Bug className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-serif text-sacred-blue-900">
                  Audio Resume & Bookmark Test Suite
                </h1>
                <p className="text-sacred-blue-600 mt-2">
                  Comprehensive testing for auto-resume and bookmark functionality
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <SacredButton onClick={refreshDebugInfo} variant="ghost">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Debug Info
              </SacredButton>
              <SacredButton onClick={clearAllData} variant="outline">
                <Trash2 className="mr-2 h-4 w-4" />
                Clear All Data
              </SacredButton>
            </div>
          </SacredCard>
        </motion.div>

        {/* Test Instructions */}
        <div className="grid md:grid-cols-2 gap-6">
          <TestInstructions
            title="🎯 Test 1: Auto-Resume Functionality"
            status={testResults.autoResume}
            steps={[
              "Play any audio track for 10+ seconds in Full Player below",
              "Navigate away or refresh the page",
              "Return to this page and play the same track",
              "Verify: Audio should resume from where you left off (not from beginning)",
              "Check console logs for 'Progress restored' messages"
            ]}
          />
          
          <TestInstructions
            title="🔖 Test 2: Single Player Bookmarks"
            status={testResults.singleBookmarks}
            steps={[
              "Use Single Player below to play a track",
              "Save a bookmark at a specific time",
              "Navigate to a different time in the audio",
              "Click the bookmark to jump back",
              "Verify: Should jump to exact bookmark time"
            ]}
          />
          
          <TestInstructions
            title="📚 Test 3: Full Player Bookmarks"
            status={testResults.fullBookmarks}
            steps={[
              "Use Full Player below to play any track",
              "Save 2 bookmarks at different times",
              "Switch to a different track",
              "Return to original track and test bookmarks",
              "Verify: Bookmarks should work across tracks"
            ]}
          />
          
          <TestInstructions
            title="🔄 Test 4: Cross-Section Navigation"
            status={testResults.crossSectionNav}
            steps={[
              "Create bookmarks in multiple tracks (Full Player)",
              "Navigate between tracks using track selection",
              "Test bookmark jumping across different tracks",
              "Verify: Should switch tracks and jump to correct time",
              "Check console for 'Bookmark navigation' messages"
            ]}
          />
        </div>

        {/* Single Player Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              Single Player Mode Test
            </h2>
            <UnifiedAudioPlayerFixed mode="single" singleTrackSlug="prologue" />
          </SacredCard>
        </motion.div>

        {/* Full Player Test */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              Full Player Mode Test
            </h2>
            <UnifiedAudioPlayerFixed mode="full" />
          </SacredCard>
        </motion.div>

        {/* Debug Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <SacredCard variant="glass" className="p-8">
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              Debug Information
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-sacred-blue-800 mb-4">
                  📊 Stored Progress Data
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(debugInfo.progress, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-sacred-blue-800 mb-4">
                  🔖 Stored Bookmark Data
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-auto">
                  <pre className="text-xs text-gray-700">
                    {JSON.stringify(debugInfo.bookmarks, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-sacred-blue-600">
                💡 <strong>Pro Tip:</strong> Open browser DevTools console to see detailed logs 
                about progress saving, restoration, and bookmark operations.
              </p>
            </div>
          </SacredCard>
        </motion.div>

        {/* Success Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6 text-center">
              ✅ Success Criteria
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-sacred-blue-800 mb-4">
                  Step 1: Auto-Resume ✅
                </h3>
                <ul className="space-y-2 text-sm text-sacred-blue-700">
                  <li>• Full audio player remembers exact position across browser sessions</li>
                  <li>• Progress is saved every 5 seconds automatically</li>
                  <li>• Audio resumes from saved position when reloading/returning</li>
                  <li>• Works for both single tracks and full playlist</li>
                  <li>• Console shows "Progress saved" and "Progress restored" messages</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-sacred-blue-800 mb-4">
                  Step 2: Enhanced Bookmarks ✅
                </h3>
                <ul className="space-y-2 text-sm text-sacred-blue-700">
                  <li>• Single player: 1 bookmark per section (section-specific)</li>
                  <li>• Full player: 2 bookmarks max (persistent across tracks)</li>
                  <li>• Bookmarks can navigate between different sections/tracks</li>
                  <li>• Clicking bookmark in full player switches tracks if needed</li>
                  <li>• No conflicts between single and full player bookmarks</li>
                </ul>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
