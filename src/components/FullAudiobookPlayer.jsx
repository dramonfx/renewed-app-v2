
'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  FastForward
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import useAdvancedAudioPlayer from '@/hooks/useAdvancedAudioPlayer';

/**
 * FullAudiobookPlayer - Pure UI Component
 * 
 * A "dumb" component that provides a complete audiobook player interface
 * powered by the useAdvancedAudioPlayer hook. Serves as the definitive
 * design standard for all future audio players.
 * 
 * Features:
 * - Complete hook integration for state management
 * - Sacred design system consistency  
 * - Standardized control buttons
 * - Interactive progress bar
 * - Track list with current highlighting
 * - Responsive design matching Dashboard layout
 */
export default function FullAudiobookPlayer({ className = '' }) {
  // Hook integration - all state and logic comes from here
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
    hasBookmark,

    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    skip,
    restart,
    changeSpeed,
    setVolume,
    toggleMute,

    // Bookmark functions
    toggleBookmark,
    jumpToBookmark,

    // Utility functions
    loadTracks,
    formatTime
  } = useAdvancedAudioPlayer({
    autoLoad: true,
    autoPlay: false
  });

  // Load tracks on component mount
  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  // Handle loading state
  if (isLoading) {
    return (
      <SacredCard variant="heavy" className={`p-8 ${className}`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-sacred-blue-200 border-t-sacred-blue-600 rounded-full mx-auto mb-4"></div>
          <p className="text-sacred-blue-600 font-medium">Loading audiobook experience...</p>
        </div>
      </SacredCard>
    );
  }

  // Handle error state
  if (error) {
    return (
      <SacredCard variant="heavy" className={`p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-xl">⚠️</span>
          </div>
          <p className="text-red-600 font-medium mb-4">Audio Error</p>
          <p className="text-red-500 text-sm">{error}</p>
          <SacredButton
            variant="primary"
            onClick={() => window.location.reload()}
            className="mt-4"
          >
            Reload Player
          </SacredButton>
        </div>
      </SacredCard>
    );
  }

  // Handle empty tracks
  if (!tracks || tracks.length === 0) {
    return (
      <SacredCard variant="heavy" className={`p-8 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-sacred-blue-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-sacred-blue-600 text-xl">🎧</span>
          </div>
          <p className="text-sacred-blue-600 font-medium">No audio tracks available</p>
          <p className="text-sacred-blue-500 text-sm mt-2">Please check back later for audiobook content.</p>
        </div>
      </SacredCard>
    );
  }

  // Helper function to format progress percentage
  const getProgressPercentage = () => {
    if (!duration || duration === 0) return 0;
    return Math.min(100, (currentTime / duration) * 100);
  };

  // Helper function to handle progress bar click
  const handleProgressClick = (e) => {
    if (!duration) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = percentage * duration;
    
    seek(seekTime);
  };

  // Speed options for cycling
  const speedOptions = [1, 1.25, 1.5, 2];
  const getNextSpeed = () => {
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    return speedOptions[nextIndex];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Main Player Card */}
      <SacredCard variant="heavy" className="p-8">
        {/* Current Track Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-2">
            {currentTrack?.title || 'No Track Selected'}
          </h2>
          <p className="text-sacred-blue-600">
            Track {currentTrackIndex + 1} of {tracks.length}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between text-sm text-sacred-blue-600 mb-2">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div 
            className="w-full h-3 bg-sacred-blue-100 rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-200 group-hover:from-blue-600 group-hover:to-blue-700"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </motion.div>

        {/* Main Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center justify-center space-x-4 mb-8"
        >
          {/* Previous Track */}
          <SacredButton
            variant="ghost"
            size="lg"
            onClick={previousTrack}
            disabled={currentTrackIndex === 0}
            className="w-14 h-14 rounded-full"
          >
            <SkipBack className="w-6 h-6" />
          </SacredButton>

          {/* Skip Backward */}
          <SacredButton
            variant="ghost"
            size="lg"
            onClick={() => skip(-10)}
            className="w-12 h-12 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </SacredButton>

          {/* Play/Pause */}
          <SacredButton
            variant="primary"
            size="lg"
            onClick={playPause}
            className="w-16 h-16 rounded-full"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </SacredButton>

          {/* Skip Forward */}
          <SacredButton
            variant="ghost"
            size="lg"
            onClick={() => skip(15)}
            className="w-12 h-12 rounded-full"
          >
            <FastForward className="w-5 h-5" />
          </SacredButton>

          {/* Next Track */}
          <SacredButton
            variant="ghost"
            size="lg"
            onClick={nextTrack}
            disabled={currentTrackIndex === tracks.length - 1}
            className="w-14 h-14 rounded-full"
          >
            <SkipForward className="w-6 h-6" />
          </SacredButton>
        </motion.div>

        {/* Secondary Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center justify-center space-x-6"
        >
          {/* Speed Control */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={() => changeSpeed(getNextSpeed())}
            className="min-w-[60px]"
          >
            {speed}x
          </SacredButton>

          {/* Bookmark */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={toggleBookmark}
            className="w-10 h-10 rounded-full"
          >
            {hasBookmark ? (
              <BookmarkCheck className="w-5 h-5 text-yellow-600" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </SacredButton>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="w-10 h-10 rounded-full"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </SacredButton>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-2 bg-sacred-blue-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Restart Track */}
          <SacredButton
            variant="ghost"
            size="sm"
            onClick={restart}
            className="w-10 h-10 rounded-full"
          >
            <RotateCcw className="w-5 h-5" />
          </SacredButton>
        </motion.div>

        {/* Bookmark Jump Button */}
        {hasBookmark && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-6 text-center"
          >
            <SacredButton
              variant="gold"
              size="sm"
              onClick={jumpToBookmark}
            >
              Jump to Bookmark
            </SacredButton>
          </motion.div>
        )}
      </SacredCard>

      {/* Track List */}
      <SacredCard variant="glass" className="p-6">
        <h3 className="text-xl font-serif text-sacred-blue-900 mb-6 text-center">
          Audiobook Chapters
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id || track.slug || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className={`p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                index === currentTrackIndex
                  ? 'bg-sacred-blue-100 border-2 border-sacred-blue-300 shadow-md'
                  : 'bg-white/50 hover:bg-white/70 border border-transparent hover:border-sacred-blue-200'
              }`}
              onClick={() => playTrackAtIndex(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className={`font-medium mb-1 ${
                    index === currentTrackIndex 
                      ? 'text-sacred-blue-900' 
                      : 'text-sacred-blue-700'
                  }`}>
                    {track.title}
                  </h4>
                  <p className="text-sm text-sacred-blue-500">
                    Chapter {index + 1}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {index === currentTrackIndex && (
                    <div className="flex items-center space-x-1">
                      {isPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-sacred-blue-600 animate-pulse"></div>
                          <div className="w-1 h-4 bg-sacred-blue-600 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-4 bg-sacred-blue-600 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-sacred-blue-600 flex items-center justify-center">
                          <Pause className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  )}
                  <SacredButton
                    variant={index === currentTrackIndex ? "primary" : "ghost"}
                    size="sm"
                  >
                    {index === currentTrackIndex ? 'Playing' : 'Play'}
                  </SacredButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SacredCard>
    </div>
  );
}
