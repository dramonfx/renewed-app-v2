// src/app/test-enhanced-audio/page.jsx
'use client';

import React, { useState } from 'react';
import EnhancedAudioPlayer from '../../components/audio/EnhancedAudioPlayer';

/**
 * Test Page for Enhanced Audio Player - Phase 2
 *
 * Comprehensive test page for validating the Enhanced Audio Player
 * with various track types and configurations.
 */

const TestEnhancedAudioPage = () => {
  const [selectedConfig, setSelectedConfig] = useState('default');

  // Sample tracks for testing
  const sampleTracks = [
    {
      id: 'track-1',
      title: 'Sacred Blue Meditation',
      slug: 'sacred-blue-meditation',
      sources: [
        {
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3',
          format: 'mp3',
          quality: 'high',
          size: 1024000,
          duration: 180,
        },
      ],
      metadata: {
        artist: 'At His Feet Productions',
        album: 'Sacred Sounds',
        year: 2024,
        genre: 'Meditation',
        bitrate: 320,
      },
      preloaded: false,
      bufferProgress: 0,
    },
    {
      id: 'track-2',
      title: 'Peaceful Harmony',
      slug: 'peaceful-harmony',
      sources: [
        {
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-04.mp3',
          format: 'mp3',
          quality: 'high',
          size: 2048000,
          duration: 240,
        },
      ],
      metadata: {
        artist: 'At His Feet Productions',
        album: 'Sacred Sounds',
        year: 2024,
        genre: 'Ambient',
        bitrate: 320,
      },
      preloaded: false,
      bufferProgress: 0,
    },
    {
      id: 'track-3',
      title: 'Divine Whispers',
      slug: 'divine-whispers',
      sources: [
        {
          url: 'https://www.soundjay.com/misc/sounds/bell-ringing-03.mp3',
          format: 'mp3',
          quality: 'medium',
          size: 1536000,
          duration: 200,
        },
      ],
      metadata: {
        artist: 'At His Feet Productions',
        album: 'Sacred Sounds',
        year: 2024,
        genre: 'Spiritual',
        bitrate: 256,
      },
      preloaded: false,
      bufferProgress: 0,
    },
  ];

  const configurations = {
    default: {
      name: 'Default Configuration',
      props: {
        autoPlay: false,
        showControls: true,
        showProgress: true,
        showVolume: true,
        showPlaylist: false,
      },
    },
    minimal: {
      name: 'Minimal Player',
      props: {
        autoPlay: false,
        showControls: true,
        showProgress: false,
        showVolume: false,
        showPlaylist: false,
      },
    },
    full: {
      name: 'Full Featured',
      props: {
        autoPlay: false,
        showControls: true,
        showProgress: true,
        showVolume: true,
        showPlaylist: true,
      },
    },
    autoplay: {
      name: 'Auto-Play Enabled',
      props: {
        autoPlay: true,
        showControls: true,
        showProgress: true,
        showVolume: true,
        showPlaylist: false,
      },
    },
  };

  const handleTrackChange = (track, index) => {};

  const handlePlaybackStateChange = (isPlaying) => {};

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '40px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              color: '#ffffff',
              fontSize: '32px',
              fontWeight: '700',
              marginBottom: '16px',
            }}
          >
            Enhanced Audio Player Test
          </h1>
          <p
            style={{
              color: '#cbd5e1',
              fontSize: '18px',
              marginBottom: '24px',
            }}
          >
            Phase 2 Core Audio Engine Testing Suite
          </p>

          {/* Configuration Selector */}
          <div style={{ marginBottom: '32px' }}>
            <label
              style={{
                color: '#e2e8f0',
                fontSize: '16px',
                marginRight: '12px',
              }}
            >
              Configuration:
            </label>
            <select
              value={selectedConfig}
              onChange={(e) => setSelectedConfig(e.target.value)}
              style={{
                background: '#374151',
                color: '#ffffff',
                border: '1px solid #4b5563',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
              }}
            >
              {Object.entries(configurations).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Player Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '32px',
            marginBottom: '32px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <EnhancedAudioPlayer
            tracks={sampleTracks}
            currentTrackIndex={0}
            onTrackChange={handleTrackChange}
            onPlaybackStateChange={handlePlaybackStateChange}
            {...configurations[selectedConfig].props}
          />
        </div>

        {/* Feature Information */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            marginBottom: '32px',
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
              🎵 Core Features
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Intelligent audio buffering</li>
              <li>• Network-aware streaming</li>
              <li>• Error recovery mechanisms</li>
              <li>• Performance monitoring</li>
              <li>• Keyboard shortcuts</li>
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
              ⚡ Performance
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Smart preloading</li>
              <li>• Memory management</li>
              <li>• Adaptive quality</li>
              <li>• Buffer optimization</li>
              <li>• Analytics tracking</li>
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
              🎨 UI Features
            </h3>
            <ul style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
              <li>• Sacred Blue theme</li>
              <li>• Responsive design</li>
              <li>• Smooth animations</li>
              <li>• Progress visualization</li>
              <li>• Playlist management</li>
            </ul>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
          }}
        >
          <h3 style={{ color: '#ffffff', fontSize: '18px', marginBottom: '16px' }}>
            ⌨️ Keyboard Shortcuts
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              fontSize: '14px',
              color: '#cbd5e1',
            }}
          >
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                Space
              </kbd>{' '}
              Play/Pause
            </div>
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                ←
              </kbd>{' '}
              Skip Back 10s
            </div>
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                →
              </kbd>{' '}
              Skip Forward 10s
            </div>
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                ↑
              </kbd>{' '}
              Volume Up
            </div>
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                ↓
              </kbd>{' '}
              Volume Down
            </div>
            <div>
              <kbd style={{ background: '#374151', padding: '2px 6px', borderRadius: '4px' }}>
                M
              </kbd>{' '}
              Toggle Mute
            </div>
          </div>
        </div>

        {/* Test Instructions */}
        <div
          style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <h3 style={{ color: '#fbbf24', fontSize: '18px', marginBottom: '16px' }}>
            🧪 Testing Instructions
          </h3>
          <ol style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.8' }}>
            <li>1. Try different configurations using the dropdown above</li>
            <li>2. Test keyboard shortcuts while the player is focused</li>
            <li>3. Monitor buffer health and loading progress</li>
            <li>4. Test error recovery by using invalid URLs</li>
            <li>5. Check network adaptation by throttling connection</li>
            <li>6. Verify playlist functionality with multiple tracks</li>
            <li>7. Test volume controls and mute functionality</li>
            <li>8. Validate seek/scrub behavior</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TestEnhancedAudioPage;
