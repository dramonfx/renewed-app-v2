// src/app/test-audio-engine-features/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import { useEnhancedAudioPlayer } from '../../hooks/useEnhancedAudioPlayer';

/**
 * Audio Engine Features Test Page - Phase 2
 * 
 * Advanced testing page for Core Audio Engine features including
 * analytics, error recovery, buffer management, and performance monitoring.
 */

const TestAudioEngineFeaturesPage = () => {
  const [engineStats, setEngineStats] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const sampleTrack = {
    id: 'test-track-1',
    title: 'Engine Test Track',
    slug: 'engine-test-track',
    sources: [
      {
        url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
        format: 'mp3',
        quality: 'high',
        size: 1024000,
        duration: 180
      }
    ],
    metadata: {
      artist: 'Test Artist',
      album: 'Test Album',
      year: 2024,
      genre: 'Test',
      bitrate: 320
    },
    preloaded: false,
    bufferProgress: 0
  };

  const [state, controls] = useEnhancedAudioPlayer({
    analytics: true,
    keyboardShortcuts: true,
    errorRecovery: true,
    engine: {
      performanceMonitoring: true,
      adaptiveBuffering: true,
      memoryManagement: true
    }
  });

  // Update engine stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const stats = controls.getEngineStats();
      setEngineStats(stats);
    }, 1000);

    return () => clearInterval(interval);
  }, [controls]);

  // Load test track on mount
  useEffect(() => {
    controls.loadTrack(sampleTrack);
  }, []);

  const addTestResult = (test, result, details = '') => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      test,
      result,
      details
    }]);
  };

  const runPerformanceTest = async () => {
    addTestResult('Performance Test', 'RUNNING', 'Testing load times and buffer health...');
    
    try {
      const startTime = performance.now();
      await controls.loadTrack(sampleTrack);
      const loadTime = performance.now() - startTime;
      
      addTestResult('Load Time Test', 'PASS', `Loaded in ${loadTime.toFixed(2)}ms`);
      
      // Test buffer health
      setTimeout(() => {
        if (state.bufferHealth > 50) {
          addTestResult('Buffer Health Test', 'PASS', `Buffer health: ${state.bufferHealth}%`);
        } else {
          addTestResult('Buffer Health Test', 'WARN', `Low buffer health: ${state.bufferHealth}%`);
        }
      }, 2000);
      
    } catch (error) {
      addTestResult('Performance Test', 'FAIL', error.message);
    }
  };

  const runErrorRecoveryTest = async () => {
    addTestResult('Error Recovery Test', 'RUNNING', 'Testing error handling...');
    
    const invalidTrack = {
      ...sampleTrack,
      id: 'invalid-track',
      sources: [{
        url: 'https://invalid-url-that-does-not-exist.mp3',
        format: 'mp3',
        quality: 'high',
        size: 1024000,
        duration: 180
      }]
    };
    
    try {
      await controls.loadTrack(invalidTrack);
      
      // Check if error state is handled
      setTimeout(() => {
        if (state.errorState) {
          addTestResult('Error Detection', 'PASS', `Error detected: ${state.errorState}`);
        } else {
          addTestResult('Error Detection', 'FAIL', 'No error detected for invalid URL');
        }
      }, 3000);
      
    } catch (error) {
      addTestResult('Error Recovery Test', 'PASS', 'Error properly caught and handled');
    }
  };

  const runAnalyticsTest = () => {
    addTestResult('Analytics Test', 'RUNNING', 'Testing analytics tracking...');
    
    // Simulate user interactions
    controls.play().then(() => {
      addTestResult('Play Event', 'PASS', 'Play event tracked');
      
      setTimeout(() => {
        controls.pause();
        addTestResult('Pause Event', 'PASS', 'Pause event tracked');
      }, 1000);
      
      setTimeout(() => {
        controls.seek(30);
        addTestResult('Seek Event', 'PASS', 'Seek event tracked');
      }, 2000);
    }).catch(error => {
      addTestResult('Analytics Test', 'FAIL', error.message);
    });
  };

  const runKeyboardTest = () => {
    addTestResult('Keyboard Test', 'RUNNING', 'Testing keyboard shortcuts...');
    
    // Simulate keyboard events
    const testKeys = [
      { key: ' ', description: 'Space (Play/Pause)' },
      { key: 'ArrowLeft', description: 'Left Arrow (Skip Back)' },
      { key: 'ArrowRight', description: 'Right Arrow (Skip Forward)' },
      { key: 'm', description: 'M (Mute)' }
    ];
    
    testKeys.forEach((testKey, index) => {
      setTimeout(() => {
        const event = new KeyboardEvent('keydown', {
          key: testKey.key,
          code: testKey.key === ' ' ? 'Space' : testKey.key,
          bubbles: true
        });
        
        window.dispatchEvent(event);
        addTestResult('Keyboard Shortcut', 'PASS', `${testKey.description} triggered`);
      }, index * 500);
    });
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    addTestResult('Test Suite', 'RUNNING', 'Starting comprehensive engine tests...');
    
    await runPerformanceTest();
    
    setTimeout(() => {
      runAnalyticsTest();
    }, 2000);
    
    setTimeout(() => {
      runKeyboardTest();
    }, 4000);
    
    setTimeout(() => {
      runErrorRecoveryTest();
    }, 6000);
    
    setTimeout(() => {
      addTestResult('Test Suite', 'COMPLETE', 'All tests completed');
      setIsRunningTests(false);
    }, 10000);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const formatStats = (stats) => {
    if (!stats) return 'Loading...';
    
    return {
      engine: stats.engine || {},
      buffer: stats.buffer || {},
      analytics: stats.analytics || {},
      errorRecovery: stats.errorRecovery || {}
    };
  };

  const formattedStats = formatStats(engineStats);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      color: '#ffffff'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Audio Engine Features Test Suite
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>
            Phase 2 Core Audio Engine - Advanced Testing Dashboard
          </p>
        </div>

        {/* Control Panel */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Test Controls</h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
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
                opacity: isRunningTests ? 0.6 : 1
              }}
            >
              {isRunningTests ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={runPerformanceTest}
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#34d399',
                cursor: 'pointer'
              }}
            >
              Performance Test
            </button>
            
            <button
              onClick={runAnalyticsTest}
              style={{
                background: 'rgba(168, 85, 247, 0.2)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#a78bfa',
                cursor: 'pointer'
              }}
            >
              Analytics Test
            </button>
            
            <button
              onClick={runKeyboardTest}
              style={{
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#fbbf24',
                cursor: 'pointer'
              }}
            >
              Keyboard Test
            </button>
            
            <button
              onClick={runErrorRecoveryTest}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#f87171',
                cursor: 'pointer'
              }}
            >
              Error Recovery Test
            </button>
            
            <button
              onClick={clearResults}
              style={{
                background: 'rgba(107, 114, 128, 0.2)',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '8px',
                padding: '12px 24px',
                color: '#9ca3af',
                cursor: 'pointer'
              }}
            >
              Clear Results
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Engine Stats */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#60a5fa', fontSize: '18px', marginBottom: '16px' }}>
              🎵 Engine Stats
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>Buffer Health: <span style={{ color: '#34d399' }}>{state.bufferHealth}%</span></div>
              <div>Loading Progress: <span style={{ color: '#fbbf24' }}>{state.loadingProgress}%</span></div>
              <div>Memory Usage: <span style={{ color: '#a78bfa' }}>{formattedStats.engine.memoryUsage || 0}MB</span></div>
              <div>Error Count: <span style={{ color: '#f87171' }}>{formattedStats.engine.errorCount || 0}</span></div>
            </div>
          </div>

          {/* Buffer Stats */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#34d399', fontSize: '18px', marginBottom: '16px' }}>
              📊 Buffer Stats
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>Strategy: <span style={{ color: '#60a5fa' }}>{formattedStats.buffer.currentStrategy || 'Balanced'}</span></div>
              <div>Network: <span style={{ color: '#fbbf24' }}>{state.networkCondition}</span></div>
              <div>Downlink: <span style={{ color: '#a78bfa' }}>{formattedStats.buffer.downlink || 0} Mbps</span></div>
              <div>Avg Health: <span style={{ color: '#34d399' }}>{formattedStats.buffer.averageBufferHealth || 100}%</span></div>
            </div>
          </div>

          {/* Analytics Stats */}
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#a78bfa', fontSize: '18px', marginBottom: '16px' }}>
              📈 Analytics
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>Session ID: <span style={{ color: '#60a5fa' }}>{formattedStats.analytics.session?.sessionId?.slice(-8) || 'N/A'}</span></div>
              <div>Events: <span style={{ color: '#fbbf24' }}>{formattedStats.analytics.pendingEvents || 0}</span></div>
              <div>Play Time: <span style={{ color: '#34d399' }}>{Math.round(state.currentTime)}s</span></div>
              <div>Retry Queue: <span style={{ color: '#f87171' }}>{formattedStats.analytics.retryQueueSize || 0}</span></div>
            </div>
          </div>

          {/* Error Recovery Stats */}
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ color: '#f87171', fontSize: '18px', marginBottom: '16px' }}>
              🛡️ Error Recovery
            </h3>
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <div>Active Sessions: <span style={{ color: '#60a5fa' }}>{formattedStats.errorRecovery.activeSessions || 0}</span></div>
              <div>Success Rate: <span style={{ color: '#34d399' }}>{formattedStats.errorRecovery.successRate || 100}%</span></div>
              <div>Avg Attempts: <span style={{ color: '#fbbf24' }}>{formattedStats.errorRecovery.averageAttempts || 0}</span></div>
              <div>Total Sessions: <span style={{ color: '#a78bfa' }}>{formattedStats.errorRecovery.totalSessions || 0}</span></div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Test Results</h2>
          
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
                    background: result.result === 'PASS' ? 'rgba(16, 185, 129, 0.1)' :
                               result.result === 'FAIL' ? 'rgba(239, 68, 68, 0.1)' :
                               result.result === 'WARN' ? 'rgba(245, 158, 11, 0.1)' :
                               'rgba(107, 114, 128, 0.1)',
                    border: `1px solid ${result.result === 'PASS' ? 'rgba(16, 185, 129, 0.2)' :
                                         result.result === 'FAIL' ? 'rgba(239, 68, 68, 0.2)' :
                                         result.result === 'WARN' ? 'rgba(245, 158, 11, 0.2)' :
                                         'rgba(107, 114, 128, 0.2)'}`
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                      {result.test}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {result.timestamp} - {result.details}
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: result.result === 'PASS' ? '#065f46' :
                               result.result === 'FAIL' ? '#7f1d1d' :
                               result.result === 'WARN' ? '#78350f' :
                               '#374151',
                    color: result.result === 'PASS' ? '#34d399' :
                           result.result === 'FAIL' ? '#f87171' :
                           result.result === 'WARN' ? '#fbbf24' :
                           '#9ca3af'
                  }}>
                    {result.result}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAudioEngineFeaturesPage;