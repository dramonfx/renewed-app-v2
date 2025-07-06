"use client";
import type { EnhancedTrack } from '@/hooks/types';
// src/components/audio/EnhancedAudioPlayer.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useEnhancedAudioPlayer } from '../../hooks/useEnhancedAudioPlayer';
import type { EnhancedTrack, AudioPlayerProps } from '../../hooks/types';

/**
 * Enhanced Audio Player Component - Phase 2
 *
 * Advanced audio player component with Sacred Blue theme integration,
 * comprehensive controls, and enhanced features.
 */

interface EnhancedAudioPlayerProps {
  tracks: EnhancedTrack[];
  currentTrackIndex?: number;
  autoPlay?: boolean;
  showControls?: boolean;
  showProgress?: boolean;
  showVolume?: boolean;
  showPlaylist?: boolean;
  className?: string;
  onTrackChange?: (track: EnhancedTrack, index: number) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

const EnhancedAudioPlayer: React.FC<EnhancedAudioPlayerProps> = ({
  tracks,
  currentTrackIndex = 0,
  autoPlay = false,
  showControls = true,
  showProgress = true,
  showVolume = true,
  showPlaylist = false,
  className = '',
  onTrackChange,
  onPlaybackStateChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(currentTrackIndex);
  const [showPlaylistPanel, setShowPlaylistPanel] = useState(showPlaylist);

  const audioPlayer = useEnhancedAudioPlayer({
    autoLoad: true,
    autoPlay,
    mode: 'full',
  });
  
  // Extract commonly used state and controls for backward compatibility
  const state = {
    isPlaying: audioPlayer.isPlaying,
    currentTime: audioPlayer.currentTime,
    duration: audioPlayer.duration,
    volume: audioPlayer.volume,
    speed: audioPlayer.speed,
    error: audioPlayer.error,
    isLoading: audioPlayer.isLoading,
    currentTrack: audioPlayer.currentTrack,
  };
  
  const controls = {
    play: () => audioPlayer.playPause(),
    pause: () => audioPlayer.playPause(),
    stop: () => audioPlayer.seek(0),
    seek: (time: number) => audioPlayer.seek(time),
    setVolume: (volume: number) => audioPlayer.setVolume(volume),
    nextTrack: () => audioPlayer.nextTrack(),
    previousTrack: () => audioPlayer.previousTrack(),
    loadTrack: (track: any) => console.log('Loading track:', track), // Mock implementation
  };

  // Load initial track
  useEffect(() => {
    if (tracks.length > 0 && currentIndex < tracks.length) {
      const track = tracks[currentIndex];
      controls.loadTrack(track);
      onTrackChange?.(track, currentIndex);
    }
  }, [currentIndex, tracks]);

  // Handle playback state changes
  useEffect(() => {
    onPlaybackStateChange?.(state.isPlaying);
  }, [state.isPlaying, onPlaybackStateChange]);

  // Auto-play if enabled
  useEffect(() => {
    if (autoPlay && state.currentTrack && !state.isPlaying && !state.isLoading) {
      controls.play().catch(console.error);
    }
  }, [autoPlay, state.currentTrack, state.isPlaying, state.isLoading]);

  const handlePlayPause = useCallback(async () => {
    try {
      if (state.isPlaying) {
        controls.pause();
      } else {
        await controls.play();
      }
    } catch (error) {
      console.error('Playback error:', error);
    }
  }, [state.isPlaying, controls]);

  const handleNextTrack = useCallback(() => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, tracks.length]);

  const handlePreviousTrack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleSeek = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(event.target.value);
      controls.seek(time);
    },
    [controls]
  );

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const volume = parseFloat(event.target.value);
      controls.setVolume(volume);
    },
    [controls]
  );

  const handleTrackSelect = useCallback((index: number) => {
    setCurrentIndex(index);
    setShowPlaylistPanel(false);
  }, []);

  const formatTime = useCallback((time: number): string => {
    if (!isFinite(time)) return '0:00';

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const getBufferProgress = useCallback((): number => {
    return state.bufferHealth;
  }, [state.bufferHealth]);

  const currentTrack = tracks[currentIndex];

  return (
    <div className={`enhanced-audio-player ${className}`}>
      <style jsx>{`
        .enhanced-audio-player {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          max-width: 480px;
          margin: 0 auto;
        }

        .track-info {
          text-align: center;
          margin-bottom: 24px;
        }

        .track-title {
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #ffffff;
        }

        .track-artist {
          font-size: 16px;
          color: #cbd5e1;
          margin-bottom: 4px;
        }

        .track-status {
          font-size: 12px;
          color: #94a3b8;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #10b981;
        }

        .status-dot.loading {
          background: #f59e0b;
          animation: pulse 1s infinite;
        }

        .status-dot.error {
          background: #ef4444;
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .progress-section {
          margin-bottom: 24px;
        }

        .progress-container {
          position: relative;
          margin-bottom: 8px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          appearance: none;
          outline: none;
          cursor: pointer;
        }

        .progress-bar::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-bar::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .buffer-indicator {
          position: absolute;
          top: 0;
          left: 0;
          height: 6px;
          background: rgba(255, 255, 255, 0.4);
          border-radius: 3px;
          pointer-events: none;
          transition: width 0.3s ease;
        }

        .time-display {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #cbd5e1;
        }

        .controls {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
        }

        .control-button {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 50%;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 18px;
        }

        .control-button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .control-button:active {
          transform: scale(0.95);
        }

        .control-button.play-pause {
          width: 56px;
          height: 56px;
          background: rgba(255, 255, 255, 0.15);
          font-size: 24px;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .volume-section {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .volume-icon {
          font-size: 16px;
          color: #cbd5e1;
        }

        .volume-slider {
          flex: 1;
          height: 4px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          appearance: none;
          outline: none;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #ffffff;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }

        .playlist-toggle {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          transition: background 0.2s ease;
        }

        .playlist-toggle:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .playlist-panel {
          margin-top: 16px;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 16px;
          max-height: 200px;
          overflow-y: auto;
        }

        .playlist-item {
          display: flex;
          align-items: center;
          padding: 8px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
          margin-bottom: 4px;
        }

        .playlist-item:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .playlist-item.active {
          background: rgba(255, 255, 255, 0.15);
        }

        .playlist-item-info {
          flex: 1;
        }

        .playlist-item-title {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2px;
        }

        .playlist-item-artist {
          font-size: 12px;
          color: #cbd5e1;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 16px;
          font-size: 14px;
          color: #fecaca;
        }

        .loading-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px;
          font-size: 14px;
          color: #cbd5e1;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid #ffffff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* Track Information */}
      {currentTrack && (
        <div className="track-info">
          <div className="track-title">{currentTrack.title}</div>
          <div className="track-artist">{currentTrack.metadata?.artist || 'Unknown Artist'}</div>
          <div className="track-status">
            <div className="status-indicator">
              <div
                className={`status-dot ${
                  state.isLoading ? 'loading' : state.errorState ? 'error' : ''
                }`}
              ></div>
              <span>
                {state.isLoading
                  ? 'Loading...'
                  : state.errorState
                    ? 'Error'
                    : state.isPlaying
                      ? 'Playing'
                      : 'Paused'}
              </span>
            </div>
            <div>Buffer: {Math.round(state.bufferHealth)}%</div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {state.errorState && <div className="error-message">{state.errorState}</div>}

      {/* Loading Indicator */}
      {state.isLoading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          Loading track...
        </div>
      )}

      {/* Progress Section */}
      {showProgress && currentTrack && (
        <div className="progress-section">
          <div className="progress-container">
            <div className="buffer-indicator" style={{ width: `${getBufferProgress()}%` }}></div>
            <input
              type="range"
              className="progress-bar"
              min={0}
              max={state.duration || 0}
              value={state.currentTime}
              onChange={handleSeek}
              disabled={!currentTrack || state.isLoading}
            />
          </div>
          <div className="time-display">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      {showControls && (
        <div className="controls">
          <button
            className="control-button"
            onClick={handlePreviousTrack}
            disabled={currentIndex === 0}
            title="Previous Track"
          >
            ⏮
          </button>

          <button
            className="control-button"
            onClick={() => controls.skipBackward(10)}
            disabled={!currentTrack}
            title="Skip Back 10s"
          >
            ⏪
          </button>

          <button
            className="control-button play-pause"
            onClick={handlePlayPause}
            disabled={!currentTrack || state.isLoading}
            title={state.isPlaying ? 'Pause' : 'Play'}
          >
            {state.isPlaying ? '⏸' : '▶'}
          </button>

          <button
            className="control-button"
            onClick={() => controls.skipForward(10)}
            disabled={!currentTrack}
            title="Skip Forward 10s"
          >
            ⏩
          </button>

          <button
            className="control-button"
            onClick={handleNextTrack}
            disabled={currentIndex === tracks.length - 1}
            title="Next Track"
          >
            ⏭
          </button>
        </div>
      )}

      {/* Volume Section */}
      {showVolume && (
        <div className="volume-section">
          <span className="volume-icon">
            {state.muted ? '🔇' : state.volume > 0.5 ? '🔊' : '🔉'}
          </span>
          <input
            type="range"
            className="volume-slider"
            min={0}
            max={1}
            step={0.01}
            value={state.muted ? 0 : state.volume}
            onChange={handleVolumeChange}
          />
          <button
            className="control-button"
            onClick={() => controls.setMuted(!state.muted)}
            style={{ width: '32px', height: '32px', fontSize: '14px' }}
            title={state.muted ? 'Unmute' : 'Mute'}
          >
            {state.muted ? '🔇' : '🔊'}
          </button>
        </div>
      )}

      {/* Playlist Toggle */}
      {tracks.length > 1 && (
        <button
          className="playlist-toggle"
          onClick={() => setShowPlaylistPanel(!showPlaylistPanel)}
        >
          {showPlaylistPanel ? 'Hide' : 'Show'} Playlist ({tracks.length} tracks)
        </button>
      )}

      {/* Playlist Panel */}
      {showPlaylistPanel && (
        <div className="playlist-panel">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`playlist-item ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleTrackSelect(index)}
            >
              <div className="playlist-item-info">
                <div className="playlist-item-title">{track.title}</div>
                <div className="playlist-item-artist">
                  {track.metadata?.artist || 'Unknown Artist'}
                </div>
              </div>
              {index === currentIndex && (
                <span style={{ fontSize: '12px' }}>{state.isPlaying ? '▶' : '⏸'}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedAudioPlayer;
