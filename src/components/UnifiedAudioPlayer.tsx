'use client';

import React, { MouseEvent } from 'react';
import type { JSX } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward,
  RotateCcw,    // Skip Backward 10s
  RotateCw,     // Skip Forward 10s
  Bookmark,
  BookmarkCheck,
  Gauge,
  Trash2,
  Volume2,
  VolumeX,
  X
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import type { AudioTrack } from '@/types';

/**
 * Audio player mode types
 */
export type AudioPlayerMode = 'full' | 'single';

/**
 * Props for the UnifiedAudioPlayer component
 */
export interface UnifiedAudioPlayerProps {
  /** Player mode: 'full' for full audiobook, 'single' for single section */
  mode?: AudioPlayerMode;
  /** Slug for single track mode (required when mode='single') */
  singleTrackSlug?: string | null;
  /** Additional CSS classes */
  className?: string;
  /** Optional callback when track changes */
  onTrackChange?: (track: AudioTrack | null) => void;
  /** Optional callback when playback state changes */
  onPlayStateChange?: (isPlaying: boolean) => void;
}

/**
 * Bookmark display component props
 */
interface BookmarkItemProps {
  bookmark: {
    id: string;
    time: number;
    label?: string;
  };
  onJump: (time: number) => void;
  onDelete: (id: string) => void;
  formatTime: (time: number) => string;
}

/**
 * Volume control component props
 */
interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
}

/**
 * Speed control component props
 */
interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
}

/**
 * Track navigation component props
 */
interface TrackNavigationProps {
  tracks: AudioTrack[];
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
const BookmarkItem: React.FC<BookmarkItemProps> = ({ 
  bookmark, 
  onJump, 
  onDelete, 
  formatTime 
}) => (
  <div className="flex items-center justify-between p-2 bg-white/20 rounded-lg mb-2">
    <button
      onClick={() => onJump(bookmark.time)}
      className="flex-1 text-left text-sm text-sacred-blue-700 hover:text-sacred-blue-900 transition-colors"
    >
      <BookmarkCheck className="w-3 h-3 inline mr-2" />
      {bookmark.label || `Bookmark at ${formatTime(bookmark.time)}`}
    </button>
    <button
      onClick={() => onDelete(bookmark.id)}
      className="text-red-400 hover:text-red-600 transition-colors ml-2"
      aria-label="Delete bookmark"
    >
      <Trash2 className="w-4 h-4" />
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
  onToggleMute 
}) => (
  <div className="flex items-center space-x-2">
    <button
      onClick={onToggleMute}
      className="text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
    </button>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={isMuted ? 0 : volume}
      onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
      className="w-16 h-1 bg-sacred-blue-200 rounded-lg appearance-none cursor-pointer slider"
      aria-label="Volume control"
    />
  </div>
);

/**
 * Speed Control Component
 */
const SpeedControl: React.FC<SpeedControlProps> = ({ speed, onSpeedChange }) => {
  const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  
  return (
    <div className="flex items-center space-x-2">
      <Gauge className="w-4 h-4 text-sacred-blue-600" />
      <select
        value={speed}
        onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
        className="text-xs bg-white/20 border border-sacred-blue-300 rounded px-2 py-1 text-sacred-blue-700 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500"
        aria-label="Playback speed"
      >
        {speedOptions.map((speedOption) => (
          <option key={speedOption} value={speedOption}>
            {speedOption}x
          </option>
        ))}
      </select>
    </div>
  );
};

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
  onNext
}) => (
  <div className="space-y-3">
    {/* Track Navigation Buttons */}
    <div className="flex justify-center space-x-4">
      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onPrevious}
        disabled={!canGoBack}
        className="opacity-80 hover:opacity-100"
        aria-label="Previous track"
      >
        <SkipBack className="w-4 h-4" />
      </SacredButton>
      
      <SacredButton
        variant="ghost"
        size="sm"
        onClick={onNext}
        disabled={!canGoForward}
        className="opacity-80 hover:opacity-100"
        aria-label="Next track"
      >
        <SkipForward className="w-4 h-4" />
      </SacredButton>
    </div>

    {/* Track List */}
    {tracks.length > 1 && (
      <div className="max-h-32 overflow-y-auto space-y-1">
        {tracks.map((track, index) => (
          <button
            key={track.id}
            onClick={() => onTrackSelect(index)}
            className={`w-full text-left text-xs p-2 rounded transition-colors ${
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
 * Unified Audio Player Component
 * 
 * A single, comprehensive audio player component that provides consistent UI/UX
 * across all audio contexts in the application. Enhanced with full TypeScript
 * support and improved error handling.
 */
export default function UnifiedAudioPlayer({ 
  mode = 'full',
  singleTrackSlug = null,
  className = '',
  onTrackChange,
  onPlayStateChange
}: UnifiedAudioPlayerProps): JSX.Element {
  // Validate props
  if (mode === 'single' && !singleTrackSlug) {
    console.warn('UnifiedAudioPlayer: singleTrackSlug is required when mode is "single"');
  }

  // Initialize audio player with appropriate configuration
  const hookOptions = {
    autoLoad: true,
    autoPlay: false,
    mode: mode,
    ...(mode === 'single' && singleTrackSlug && { singleTrackSlug })
  };

  // Get all state and functions from the useAudioPlayer hook
  const {
    // State values
    tracks,
    currentTrack,
    currentTrackIndex,
    isPlaying,
    isActuallyPlaying,
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
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    setVolume,
    toggleMute,
    
    // Utility functions
    formatTime
  } = useAudioPlayer(hookOptions);

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

  // Handle volume change
  const handleVolumeChange = (newVolume: number): void => {
    setVolume(newVolume);
  };

  // Handle bookmark save
  const handleSaveBookmark = (): void => {
    if (!currentTrack || !currentTime) return;
    
    const label = `${currentTrack.title} - ${formatTime(currentTime)}`;
    saveBookmark(currentTime, label);
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
          <VolumeX className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">Audio Unavailable</p>
          <p className="text-sm opacity-75 mt-1">{error}</p>
          <SacredButton
            variant="primary"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
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
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-sacred-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
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
          <Volume2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No Audio Available</p>
          <p className="text-sm opacity-75 mt-1">
            Audio content is not available for this section.
          </p>
        </div>
      </SacredCard>
    );
  }

  return (
    <SacredCard variant="glass" className={`overflow-hidden ${className}`}>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        preload="metadata"
        className="hidden"
        aria-label="Audio player"
      />

      <div className="p-6 space-y-6">
        {/* Current Track Info */}
        {currentTrack && (
          <div className="text-center">
            <h3 className="text-lg font-semibold text-sacred-blue-900 mb-1">
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
            className="w-full h-2 bg-sacred-blue-200 rounded-full cursor-pointer overflow-hidden"
            onClick={handleProgressClick}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-label="Audio progress"
          >
            <motion.div 
              className="h-full bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 rounded-full"
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
          {/* Skip Backward 10s */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={skipBackward10}
            disabled={!currentTrack}
            className="opacity-80 hover:opacity-100"
            aria-label="Skip backward 10 seconds"
          >
            <RotateCcw className="w-5 h-5" />
          </SacredButton>

          {/* Play/Pause Button */}
          <SacredButton
            variant="primary"
            size="lg"
            onClick={playPause}
            disabled={!currentTrack}
            loading={isLoading}
            className="relative"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6" />
            ) : (
              <Play className="w-6 h-6 ml-1" />
            )}
          </SacredButton>

          {/* Skip Forward 10s */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={skipForward10}
            disabled={!currentTrack}
            className="opacity-80 hover:opacity-100"
            aria-label="Skip forward 10 seconds"
          >
            <RotateCw className="w-5 h-5" />
          </SacredButton>
        </div>

        {/* Additional Controls */}
        <div className="flex items-center justify-between text-sm">
          {/* Volume Control */}
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />

          {/* Speed Control */}
          <SpeedControl
            speed={speed}
            onSpeedChange={changeSpeed}
          />

          {/* Bookmark Button */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={handleSaveBookmark}
            disabled={!currentTrack || !currentTime}
            className="opacity-80 hover:opacity-100"
            aria-label="Save bookmark"
          >
            <Bookmark className="w-4 h-4" />
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
                Bookmarks ({bookmarks.length})
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
            
            <div className="max-h-32 overflow-y-auto space-y-1">
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

// Export component types for external use
export type { 
  UnifiedAudioPlayerProps as AudioPlayerProps, 
  AudioPlayerMode as PlayerMode,
  BookmarkItemProps,
  VolumeControlProps,
  SpeedControlProps,
  TrackNavigationProps
};