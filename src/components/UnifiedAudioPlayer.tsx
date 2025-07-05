
'use client';

import React, { MouseEvent } from 'react';
import type { JSX } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  RotateCw,
  Bookmark,
  BookmarkCheck,
  Gauge,
  Trash2,
  Volume2,
  VolumeX,
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAudioPlayerFixed } from '@/hooks/useAudioPlayerFixed';
import type { Bookmark as BookmarkType } from '@/hooks/useBookmarks';

export type AudioPlayerMode = 'full' | 'single';

export interface UnifiedAudioPlayerFixedProps {
  mode?: AudioPlayerMode;
  singleTrackSlug?: string | null;
  className?: string;
  onTrackChange?: (track: any) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

interface BookmarkItemProps {
  bookmark: BookmarkType;
  onJump: (bookmark: BookmarkType) => void;
  onDelete: (id: string) => void;
  formatTime: (time: number) => string;
}

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  formatTime: (time: number) => string;
}

/**
 * Bookmark Item Component
 */
const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onJump, onDelete, formatTime }) => (
  <div className="flex items-center justify-between rounded-lg bg-sacred-blue-50 p-3">
    <button
      onClick={() => onJump(bookmark)}
      className="flex flex-1 items-center text-left text-sm text-sacred-blue-700 hover:text-sacred-blue-900"
    >
      <BookmarkCheck className="mr-2 inline h-3 w-3" />
      {bookmark.label || `Resume from ${formatTime(bookmark.time)}`}
    </button>
    <button
      onClick={() => onDelete(bookmark.id)}
      className="ml-2 text-red-500 hover:text-red-700"
      aria-label="Delete bookmark"
    >
      <Trash2 className="h-3 w-3" />
    </button>
  </div>
);

/**
 * Volume Control Component
 */
const VolumeControl: React.FC<VolumeControlProps> = ({ volume, isMuted, onVolumeChange, onToggleMute }) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onToggleMute}
      className="text-sacred-blue-600 hover:text-sacred-blue-800"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={isMuted ? 0 : volume}
      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      className="w-16 accent-sacred-blue-500"
      aria-label="Volume"
    />
  </div>
);

/**
 * Speed Control Component
 */
const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  
  return (
    <div className="flex items-center space-x-1">
      <Gauge className="h-4 w-4 text-sacred-blue-600" />
      <select
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="rounded border border-sacred-blue-200 bg-white px-2 py-1 text-xs text-sacred-blue-700"
        aria-label="Playback speed"
      >
        {speeds.map((s) => (
          <option key={s} value={s}>
            {s}x
          </option>
        ))}
      </select>
    </div>
  );
};

/**
 * Progress Bar Component
 */
const ProgressBar: React.FC<ProgressBarProps> = ({ currentTime, duration, onSeek, formatTime }) => {
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>): void => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    onSeek(newTime);
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-2">
      <div
        className="relative h-2 cursor-pointer rounded-full bg-sacred-blue-100"
        onClick={handleProgressClick}
        role="progressbar"
        aria-valuenow={currentTime}
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-label="Audio progress"
      >
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-sacred-blue-500 transition-all duration-100"
          style={{ width: `${progressPercentage}%` }}
        />
        <div
          className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-sacred-blue-600 shadow-md transition-all duration-100"
          style={{ left: `calc(${progressPercentage}% - 8px)` }}
        />
      </div>
      <div className="flex justify-between text-xs text-sacred-blue-600">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

/**
 * Unified Audio Player Component
 * 
 * Clean implementation with working bookmark system:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Professional UI with Sacred Design System
 * - Comprehensive controls and progress tracking
 */
export default function UnifiedAudioPlayer({
  mode = 'full',
  singleTrackSlug = null,
  className = '',
  onTrackChange,
  onPlayStateChange,
}: UnifiedAudioPlayerFixedProps): JSX.Element {
  const {
    // State
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    currentTime,
    duration,
    speed,
    volume,
    isMuted,
    isLoading,
    error,
    bookmarks,

    // Audio ref
    audioRef,

    // Controls
    playPause,
    seek,
    setSpeed,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    skipForward,
    skipBackward,

    // Bookmark functions
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,

    // Utilities
    formatTime,
  } = useAudioPlayerFixed({
    mode,
    singleTrackSlug,
    autoLoad: true,
    autoPlay: false,
    saveProgress: true,
    restoreProgress: true,
  });

  // Handle track change callback
  React.useEffect(() => {
    if (onTrackChange && currentTrack) {
      onTrackChange(currentTrack);
    }
  }, [currentTrack, onTrackChange]);

  // Handle play state change callback
  React.useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  // Handle bookmark save
  const handleSaveBookmark = (): void => {
    if (currentTime > 0) {
      saveBookmark(currentTime);
    }
  };

  if (error) {
    return (
      <SacredCard variant="glass" className={`p-6 text-center ${className}`}>
        <div className="mb-3 text-4xl text-red-500">⚠️</div>
        <p className="text-red-600">Audio Error: {error}</p>
        <p className="mt-2 text-sm text-red-500">Please try refreshing the page</p>
      </SacredCard>
    );
  }

  if (isLoading) {
    return (
      <SacredCard variant="glass" className={`p-6 text-center ${className}`}>
        <div className="mb-3 animate-spin text-4xl text-sacred-blue-500">⏳</div>
        <p className="text-sacred-blue-600">Loading audio...</p>
      </SacredCard>
    );
  }

  if (!currentTrack) {
    return (
      <SacredCard variant="glass" className={`p-6 text-center ${className}`}>
        <div className="mb-3 text-4xl text-sacred-blue-500">🎵</div>
        <p className="text-sacred-blue-600">No audio track available</p>
      </SacredCard>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <SacredCard variant="glass" className="overflow-hidden">
        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata" />

        {/* Header */}
        <div className="border-b border-sacred-blue-100 bg-gradient-to-r from-sacred-blue-50 to-sacred-blue-100 p-4">
          <h3 className="font-semibold text-sacred-blue-900">
            {currentTrack.title}
          </h3>
          {mode === 'full' && tracks.length > 1 && (
            <p className="text-sm text-sacred-blue-600">
              Track {currentTrackIndex + 1} of {tracks.length}
            </p>
          )}
        </div>

        {/* Main Controls */}
        <div className="space-y-4 p-4">
          {/* Progress Bar */}
          <ProgressBar
            currentTime={currentTime}
            duration={duration}
            onSeek={seek}
            formatTime={formatTime}
          />

          {/* Primary Controls */}
          <div className="flex items-center justify-center space-x-4">
            {mode === 'full' && (
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={previousTrack}
                disabled={currentTrackIndex === 0}
                aria-label="Previous track"
              >
                <SkipBack className="h-4 w-4" />
              </SacredButton>
            )}

            <SacredButton
              variant="ghost"
              size="sm"
              onClick={() => skipBackward(15)}
              aria-label="Skip backward 15 seconds"
            >
              <RotateCcw className="h-4 w-4" />
            </SacredButton>

            <SacredButton
              variant="primary"
              size="lg"
              onClick={playPause}
              disabled={!currentTrack.audioUrl}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </SacredButton>

            <SacredButton
              variant="ghost"
              size="sm"
              onClick={() => skipForward(15)}
              aria-label="Skip forward 15 seconds"
            >
              <RotateCw className="h-4 w-4" />
            </SacredButton>

            {mode === 'full' && (
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={nextTrack}
                disabled={currentTrackIndex === tracks.length - 1}
                aria-label="Next track"
              >
                <SkipForward className="h-4 w-4" />
              </SacredButton>
            )}
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            <VolumeControl
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={setVolume}
              onToggleMute={toggleMute}
            />

            <div className="flex items-center space-x-4">
              <SpeedControl speed={speed} onSpeedChange={setSpeed} />
              
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={handleSaveBookmark}
                disabled={!currentTrack || !currentTime || !canSaveBookmark}
                title={
                  !canSaveBookmark 
                    ? `Maximum ${mode === 'single' ? '1' : '2'} bookmark${mode === 'single' ? '' : 's'} reached`
                    : 'Save bookmark'
                }
                aria-label="Save bookmark"
              >
                <Bookmark className="h-4 w-4" />
              </SacredButton>
            </div>
          </div>
        </div>

        {/* Track List (Full Mode Only) */}
        {mode === 'full' && tracks.length > 1 && (
          <div className="border-t border-sacred-blue-100 bg-sacred-blue-25 p-4">
            <h4 className="mb-2 text-sm font-medium text-sacred-blue-800">Tracks</h4>
            <div className="max-h-32 space-y-1 overflow-y-auto">
              {tracks.map((track, index) => (
                <button
                  key={track.id}
                  onClick={() => {
                    if (index !== currentTrackIndex) {
                      // Handle track selection logic here
                    }
                  }}
                  className={`w-full rounded px-2 py-1 text-left text-xs transition-colors ${
                    index === currentTrackIndex
                      ? 'bg-sacred-blue-100 text-sacred-blue-900'
                      : 'text-sacred-blue-600 hover:bg-sacred-blue-50'
                  }`}
                >
                  {track.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {bookmarks && bookmarks.length > 0 && (
          <div className="border-t border-sacred-blue-100 bg-sacred-blue-25 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="text-sm font-medium text-sacred-blue-800">
                Bookmarks ({bookmarks.length}/{mode === 'single' ? '1' : '2'})
              </h4>
              {bookmarks.length > 0 && (
                <SacredButton
                  variant="ghost"
                  size="xs"
                  onClick={clearBookmarks}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Clear all bookmarks"
                >
                  <Trash2 className="h-3 w-3" />
                </SacredButton>
              )}
            </div>
            <div className="space-y-2">
              {bookmarks.map((bookmark) => (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onJump={jumpToBookmark}
                  onDelete={deleteBookmark}
                  formatTime={formatTime}
                />
              ))}
            </div>
          </div>
        )}
      </SacredCard>
    </motion.div>
  );
}

export {
  BookmarkItemProps,
  VolumeControlProps,
  SpeedControlProps,
  ProgressBarProps,
};
