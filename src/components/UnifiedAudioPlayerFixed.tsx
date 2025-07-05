
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
import type { SimpleBookmark } from '@/hooks/useSimpleBookmarks';

export type AudioPlayerMode = 'full' | 'single';

export interface UnifiedAudioPlayerFixedProps {
  mode?: AudioPlayerMode;
  singleTrackSlug?: string | null;
  className?: string;
  onTrackChange?: (track: any) => void;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

interface BookmarkItemProps {
  bookmark: SimpleBookmark;
  onJump: (bookmark: SimpleBookmark) => void;
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
  onSpeedChange: () => void;
}

interface TrackNavigationProps {
  tracks: any[];
  currentTrackIndex: number;
  onTrackSelect: (index: number) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Bookmark Item Component
 */
const BookmarkItem: React.FC<BookmarkItemProps> = ({ bookmark, onJump, onDelete, formatTime }) => (
  <div className="mb-2 flex items-center justify-between rounded-lg bg-white/20 p-2">
    <button
      onClick={() => onJump(bookmark)}
      className="flex-1 text-left text-sm text-sacred-blue-700 transition-colors hover:text-sacred-blue-900"
    >
      <BookmarkCheck className="mr-2 inline h-3 w-3" />
      {bookmark.label || `Resume from ${formatTime(bookmark.time)}`}
    </button>
    <button
      onClick={() => onDelete(bookmark.id)}
      className="ml-2 text-red-400 transition-colors hover:text-red-600"
      aria-label="Delete bookmark"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  </div>
);

/**
 * Volume Control Component
 */
const VolumeControl: React.FC<VolumeControlProps> = ({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onToggleMute}
      className="text-sacred-blue-600 transition-colors hover:text-sacred-blue-800"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={isMuted ? 0 : volume}
      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      className="slider h-1 w-16 cursor-pointer appearance-none rounded-lg bg-sacred-blue-200"
      aria-label="Volume control"
    />
  </div>
);

/**
 * Speed Control Component
 */
const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => (
  <div className="flex items-center space-x-2">
    <Gauge className="h-4 w-4 text-sacred-blue-600" />
    <button
      onClick={onSpeedChange}
      className="rounded border border-sacred-blue-300 bg-white/20 px-2 py-1 text-xs text-sacred-blue-700 transition-colors hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500"
      aria-label="Change playback speed"
    >
      {speed}x
    </button>
  </div>
);

/**
 * Track Navigation Component
 */
const TrackNavigation: React.FC<TrackNavigationProps> = ({
  tracks,
  currentTrackIndex,
  onTrackSelect,
  canGoBack,
  canGoForward,
  onPrevious,
  onNext,
}) => (
  <div className="space-y-3">
    <div className="flex justify-center space-x-4">
      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoBack}
        className="opacity-80 hover:opacity-100"
        aria-label="Previous track"
      >
        <SkipBack className="h-4 w-4" />
      </SacredButton>

      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoForward}
        className="opacity-80 hover:opacity-100"
        aria-label="Next track"
      >
        <SkipForward className="h-4 w-4" />
      </SacredButton>
    </div>

    {tracks.length > 1 && (
      <div className="max-h-32 space-y-1 overflow-y-auto">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`w-full rounded p-2 text-left text-xs transition-colors ${
              index === currentTrackIndex
                ? 'bg-sacred-blue-200 text-sacred-blue-900'
                : 'bg-white/10 text-sacred-blue-700 hover:bg-white/20'
            }`}
          >
            {index + 1}. {track.title}
          </button>
        ))}
      </div>
    )}
  </div>
);

/**
 * Fixed Unified Audio Player Component
 * 
 * Clean implementation with working bookmark system:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Simple "Resume from X:XX" functionality
 * - Persistence between sessions
 */
export default function UnifiedAudioPlayerFixed({
  mode = 'full',
  singleTrackSlug = null,
  className = '',
  onTrackChange,
  onPlayStateChange,
}: UnifiedAudioPlayerFixedProps): JSX.Element {
  // Validate props
  if (mode === 'single' && !singleTrackSlug) {
    console.warn('UnifiedAudioPlayerFixed: singleTrackSlug is required when mode is "single"');
  }

  // Initialize fixed audio player
  const {
    // State values
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

    // Audio element ref
    audioRef,

    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    skipForward10,
    skipBackward10,
    changeSpeed,
    setVolume,
    toggleMute,

    // Bookmark functions
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,

    // Utility functions
    formatTime,
  } = useAudioPlayerFixed({
    autoLoad: true,
    autoPlay: false,
    mode,
    singleTrackSlug,
  });

  // Notify parent of track changes
  React.useEffect(() => {
    onTrackChange?.(currentTrack);
  }, [currentTrack, onTrackChange]);

  // Notify parent of play state changes
  React.useEffect(() => {
    onPlayStateChange?.(isPlaying);
  }, [isPlaying, onPlayStateChange]);

  // Handle progress bar click for seeking
  const handleProgressClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (!duration || !currentTrack) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentClicked = clickX / rect.width;
    const newTime = percentClicked * duration;

    seek(newTime);
  };

  // Handle bookmark save
  const handleSaveBookmark = (): void => {
    if (!currentTrack || !currentTime) return;
    saveBookmark(currentTime);
  };

  // Determine what controls to show based on mode
  const showTrackNavigation = mode === 'full' && tracks.length > 1;
  const canGoBack = currentTrackIndex > 0;
  const canGoForward = currentTrackIndex < tracks.length - 1;

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Error state
  if (error) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-red-600">
          <VolumeX className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="font-semibold">Audio Unavailable</p>
          <p className="mt-1 text-sm opacity-75">{error}</p>
          <SacredButton variant="primary" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </SacredButton>
        </div>
      </SacredCard>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="py-8 text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-sacred-blue-500 border-t-transparent"></div>
          <p className="text-sacred-blue-600">Loading audio...</p>
        </div>
      </SacredCard>
    );
  }

  // No tracks available
  if (!tracks || tracks.length === 0) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-sacred-blue-600">
          <Volume2 className="mx-auto mb-3 h-12 w-12 opacity-50" />
          <p className="font-semibold">No Audio Available</p>
          <p className="mt-1 text-sm opacity-75">
            Audio content is not available for this section.
          </p>
        </div>
      </SacredCard>
    );
  }

  return (
    <SacredCard variant="glass" className={`overflow-hidden ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" className="hidden" aria-label="Audio player" />

      <div className="space-y-6 p-6">
        {/* Current Track Info */}
        {currentTrack && (
          <div className="text-center">
            <h3 className="mb-1 text-lg font-semibold text-sacred-blue-900">
              {currentTrack.title}
            </h3>
            {mode === 'full' && tracks.length > 1 && (
              <p className="text-sm text-sacred-blue-600">
                Track {currentTrackIndex + 1} of {tracks.length}
              </p>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div
            className="h-2 w-full cursor-pointer overflow-hidden rounded-full bg-sacred-blue-200"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-label="Audio progress"
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600"
              style={{ width: `${progressPercent}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>

          <div className="flex justify-between text-xs text-sacred-blue-600">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-6">
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={skipBackward10}
            disabled={!currentTrack}
            className="opacity-80 hover:opacity-100"
            aria-label="Skip backward 10 seconds"
          >
            <RotateCcw className="h-5 w-5" />
          </SacredButton>

          <SacredButton
            variant="primary"
            size="lg"
            onClick={playPause}
            disabled={!currentTrack}
            loading={isLoading}
            className="relative"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
          </SacredButton>

          <SacredButton
            variant="ghost"
            size="sm"
            onClick={skipForward10}
            disabled={!currentTrack}
            className="opacity-80 hover:opacity-100"
            aria-label="Skip forward 10 seconds"
          >
            <RotateCw className="h-5 w-5" />
          </SacredButton>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between text-sm">
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={setVolume}
            onToggleMute={toggleMute}
          />

          <SpeedControl speed={speed} onSpeedChange={changeSpeed} />

          <SacredButton
            variant="ghost"
            size="sm"
            onClick={handleSaveBookmark}
            disabled={!currentTrack || !currentTime || !canSaveBookmark}
            className="opacity-80 hover:opacity-100"
            aria-label="Save bookmark"
            title={
              !canSaveBookmark 
                ? `Maximum ${mode === 'single' ? '1' : '2'} bookmark${mode === 'single' ? '' : 's'} reached`
                : 'Save bookmark'
            }
          >
            <Bookmark className="h-4 w-4" />
          </SacredButton>
        </div>

        {/* Track Navigation */}
        {showTrackNavigation && (
          <TrackNavigation
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            onTrackSelect={playTrackAtIndex}
            canGoBack={canGoBack}
            canGoForward={canGoForward}
            onPrevious={previousTrack}
            onNext={nextTrack}
          />
        )}

        {/* Bookmarks */}
        {bookmarks && bookmarks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-sacred-blue-700">
                Bookmarks ({bookmarks.length}/{mode === 'single' ? '1' : '2'})
              </h4>
              {bookmarks.length > 0 && (
                <SacredButton
                  variant="ghost"
                  size="sm"
                  onClick={clearBookmarks}
                  className="text-xs opacity-70 hover:opacity-100"
                >
                  Clear All
                </SacredButton>
              )}
            </div>

            <div className="max-h-32 space-y-1 overflow-y-auto">
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
      </div>
    </SacredCard>
  );
}

export type {
  UnifiedAudioPlayerFixedProps as AudioPlayerProps,
  AudioPlayerMode as PlayerMode,
  BookmarkItemProps,
  VolumeControlProps,
  SpeedControlProps,
  TrackNavigationProps,
};
