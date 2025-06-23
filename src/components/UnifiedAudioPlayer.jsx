
'use client';

import React from 'react';
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

/**
 * Unified Audio Player Component
 * 
 * A single, comprehensive audio player component that provides consistent UI/UX
 * across all audio contexts in the application. Based on the clean, compact design
 * of ImmersiveAudioPlayer but with the complete feature set of FullAudiobookPlayer.
 * 
 * @param {Object} props - Component props
 * @param {string} props.mode - Player mode: 'full' (full audiobook) or 'single' (single section)
 * @param {string} props.singleTrackSlug - Slug for single track mode (required when mode='single')
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Unified audio player component
 */
export default function UnifiedAudioPlayer({ 
  mode = 'full',           // 'full' or 'single'
  singleTrackSlug = null,  // for single mode
  className = ''
}) {
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

  // Handle progress bar click for seeking
  const handleProgressClick = (e) => {
    if (!duration || !currentTrack) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentClicked = clickX / rect.width;
    const newTime = percentClicked * duration;
    
    seek(newTime);
  };

  // Determine what controls to show based on mode
  const showTrackNavigation = mode === 'full' && tracks.length > 1;
  const canGoBack = currentTrackIndex > 0;
  const canGoForward = currentTrackIndex < tracks.length - 1;

  // Calculate progress percentage
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };



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

  // No tracks state
  if (!tracks.length) {
    return (
      <SacredCard variant="glass" className={`p-6 ${className}`}>
        <div className="text-center text-sacred-blue-600">
          <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="font-semibold">No Audio Available</p>
          <p className="text-sm opacity-75 mt-1">
            {mode === 'single' 
              ? `No audio found for section "${singleTrackSlug}"`
              : 'No audio tracks found'
            }
          </p>
        </div>
      </SacredCard>
    );
  }

  return (
    <SacredCard variant="glass" className={`p-6 space-y-6 ${className}`}>
      {/* Hidden audio element */}
      <audio ref={audioRef} />
      
      {/* Header with track info */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif text-sacred-blue-900">
          {currentTrack?.title || 'Audio Experience'}
        </h3>
        <div className="flex items-center justify-center space-x-4 text-sm text-sacred-blue-600">
          {mode === 'full' && tracks.length > 1 && (
            <span>Track {currentTrackIndex + 1} of {tracks.length}</span>
          )}
          <span className="font-mono">{formatTime(currentTime)}</span>
          <span>/</span>
          <span className="font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-2">
        <div 
          className="w-full h-2 bg-sacred-blue-100 rounded-full cursor-pointer relative overflow-hidden"
          onClick={handleProgressClick}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-sacred-blue-500 to-sacred-gold-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.1 }}
          />
          <motion.div
            className="absolute top-0 w-4 h-4 bg-white border-2 border-sacred-blue-500 rounded-full shadow-lg transform -translate-y-1 -translate-x-2 cursor-grab"
            style={{ left: `${progressPercent}%` }}
            whileHover={{ scale: 1.1 }}
            whileDrag={{ scale: 1.2 }}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-center space-x-3">
        {/* Skip Backward 10s */}
        <motion.button
          onClick={skipBackward10}
          disabled={!currentTrack?.audioUrl}
          className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors disabled:opacity-50 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Skip backward 10 seconds"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="absolute -bottom-1 text-xs font-bold">10s</span>
        </motion.button>

        {/* Previous Track (full mode only) */}
        {showTrackNavigation && (
          <motion.button
            onClick={previousTrack}
            disabled={!canGoBack}
            className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Previous track"
          >
            <SkipBack className="w-6 h-6" />
          </motion.button>
        )}

        {/* Play/Pause Button */}
        <motion.button
          onClick={playPause}
          disabled={!currentTrack?.audioUrl}
          className="p-4 bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={isActuallyPlaying ? "Pause" : "Play"}
        >
          {isActuallyPlaying ? (
            <Pause className="w-8 h-8" />
          ) : (
            <Play className="w-8 h-8 ml-1" />
          )}
        </motion.button>

        {/* Next Track (full mode only) */}
        {showTrackNavigation && (
          <motion.button
            onClick={nextTrack}
            disabled={!canGoForward}
            className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title="Next track"
          >
            <SkipForward className="w-6 h-6" />
          </motion.button>
        )}

        {/* Skip Forward 10s */}
        <motion.button
          onClick={skipForward10}
          disabled={!currentTrack?.audioUrl}
          className="p-2 text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors disabled:opacity-50 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Skip forward 10 seconds"
        >
          <RotateCw className="w-5 h-5" />
          <span className="absolute -bottom-1 text-xs font-bold">10s</span>
        </motion.button>
      </div>

      {/* Secondary Controls Row */}
      <div className="flex items-center justify-between space-x-4">
        {/* Speed and Save Controls Group */}
        <div className="flex items-center space-x-2">
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={changeSpeed}
            className="flex items-center space-x-1"
            title="Change playback speed"
          >
            <Gauge className="w-4 h-4" />
            <span className="text-sm font-semibold">{speed}x</span>
          </SacredButton>

          <SacredButton
            variant="ghost"
            size="sm"
            onClick={saveBookmark}
            disabled={!currentTrack}
            className="flex items-center space-x-1 bg-sacred-gold-gradient text-gray-800 hover:shadow-lg hover:shadow-sacred-gold-500/25 font-semibold"
            title="Save bookmark at current position"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-sm">Save</span>
          </SacredButton>
        </div>

        {/* Volume Control - Fixed alignment */}
        <div className="flex items-center space-x-3 flex-1 max-w-[140px] mr-2">
          <motion.button
            onClick={toggleMute}
            className="text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </motion.button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-sacred-blue-100 rounded-full outline-none slider"
          />
        </div>
      </div>

      {/* Bookmarks Section (when bookmarks exist) */}
      {bookmarks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-sacred-blue-100 pt-4 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-sacred-blue-900">
              Saved Bookmarks ({bookmarks.length})
            </h4>
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={clearBookmarks}
              className="text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Clear
            </SacredButton>
          </div>
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {bookmarks.slice(-3).reverse().map((bookmark) => ( // Show latest 3
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2 bg-white/50 rounded-lg text-sm group"
              >
                <div className="flex-1 min-w-0 mr-2">
                  <p className="font-medium text-sacred-blue-900 truncate">
                    {bookmark.trackTitle}
                  </p>
                  <p className="text-xs text-sacred-blue-600">
                    {formatTime(bookmark.time)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-1">
                  <SacredButton
                    variant="ghost"
                    size="sm"
                    onClick={() => jumpToBookmark(bookmark)}
                    className="text-xs px-2 py-1"
                  >
                    Jump
                  </SacredButton>
                  
                  <motion.button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors opacity-60 group-hover:opacity-100"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    title="Delete this bookmark"
                  >
                    <X className="w-3 h-3" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Track List (full mode only) */}
      {mode === 'full' && tracks.length > 1 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-sacred-blue-100 pt-4 space-y-3"
        >
          <h4 className="text-sm font-semibold text-sacred-blue-900 text-center">
            Audiobook Chapters
          </h4>
          
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                className={`p-2 rounded-lg cursor-pointer transition-all duration-200 text-sm ${
                  index === currentTrackIndex 
                    ? 'bg-sacred-gradient text-white shadow-md' 
                    : 'bg-white/50 hover:bg-white/70 text-sacred-blue-900'
                }`}
                onClick={() => {
                  if (index !== currentTrackIndex) {
                    playTrackAtIndex(index);
                  }
                }}
                title={`Play ${track.title}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{track.title}</p>
                    <p className={`text-xs ${
                      index === currentTrackIndex 
                        ? 'text-white/80' 
                        : 'text-sacred-blue-600'
                    }`}>
                      Chapter {index + 1}
                    </p>
                  </div>
                  
                  {index === currentTrackIndex && (
                    <div className="flex items-center space-x-1 ml-2">
                      {isActuallyPlaying ? (
                        <div className="flex space-x-0.5">
                          <div className="w-0.5 h-3 bg-white animate-pulse"></div>
                          <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-0.5 h-3 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </SacredCard>
  );
}
