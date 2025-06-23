
'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Bookmark, BookmarkCheck, Gauge } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAdvancedAudioPlayer } from '@/hooks/useAdvancedAudioPlayer';

export default function FullAudiobookPlayer() {
  // Get all state and functions from the hook - this component is purely presentational
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
    isLoading,
    error,
    hasBookmark,
    
    // Audio element ref
    audioRef,
    
    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    changeSpeed,
    toggleBookmark,
    jumpToBookmark,
    
    // Utility functions
    formatTime
  } = useAdvancedAudioPlayer({
    autoLoad: true,
    autoPlay: false
  });

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

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <SacredCard variant="heavy" className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center animate-pulse">
              <span className="text-white text-2xl">🎧</span>
            </div>
            <h3 className="text-xl font-serif text-sacred-blue-900">Loading Audiobook...</h3>
            <p className="text-sacred-blue-600">Preparing your spiritual journey</p>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <SacredCard variant="heavy" className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-serif text-red-700">Audio Error</h3>
            <p className="text-red-600">{error}</p>
            <SacredButton variant="primary" onClick={() => window.location.reload()}>
              Try Again
            </SacredButton>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  // No tracks state
  if (!tracks.length) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[400px]"
      >
        <SacredCard variant="heavy" className="p-8 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-sacred-blue-100 flex items-center justify-center">
              <span className="text-sacred-blue-600 text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-serif text-sacred-blue-900">No Audio Tracks</h3>
            <p className="text-sacred-blue-600">No audio tracks found for the guidebook</p>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const canGoBack = currentTrackIndex > 0;
  const canGoForward = currentTrackIndex < tracks.length - 1;

  return (
    <div className="space-y-8">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Track Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="heavy" className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-20 h-20 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl">🎧</span>
              </div>
              <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-serif text-sacred-blue-900 mb-2">
                  {currentTrack?.title || 'Loading...'}
                </h2>
                <p className="text-sacred-blue-600">
                  Track {currentTrackIndex + 1} of {tracks.length}
                </p>
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-center space-x-4 text-lg">
              <span className="font-mono text-sacred-blue-900">{formatTime(currentTime)}</span>
              <span className="text-sacred-blue-400">/</span>
              <span className="font-mono text-sacred-blue-600">{formatTime(duration)}</span>
            </div>
          </div>
        </SacredCard>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SacredCard variant="glass" className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-serif text-sacred-blue-900 text-center">Progress</h3>
            
            {/* Interactive Progress Bar */}
            <div 
              className="relative w-full h-3 bg-sacred-blue-100 rounded-full cursor-pointer hover:bg-sacred-blue-200 transition-colors"
              onClick={handleProgressClick}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-sacred-gradient rounded-full"
                style={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.1 }}
              />
              
              {/* Progress Handle */}
              <motion.div
                className="absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white border-2 border-sacred-blue-300 rounded-full shadow-lg cursor-pointer"
                style={{ left: `${progressPercent}%`, marginLeft: '-10px' }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            </div>
          </div>
        </SacredCard>
      </motion.div>

      {/* Main Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SacredCard variant="glass" className="p-8">
          <div className="flex items-center justify-center space-x-6">
            {/* Previous Track */}
            <SacredButton
              variant="ghost"
              size="lg"
              onClick={previousTrack}
              disabled={!canGoBack}
              className="w-16 h-16 rounded-full"
            >
              <SkipBack size={24} />
            </SacredButton>

            {/* Play/Pause */}
            <SacredButton
              variant="primary"
              size="lg"
              onClick={playPause}
              disabled={!currentTrack?.audioUrl}
              className="w-20 h-20 rounded-full"
            >
              {isActuallyPlaying ? <Pause size={32} /> : <Play size={32} />}
            </SacredButton>

            {/* Next Track */}
            <SacredButton
              variant="ghost"
              size="lg"
              onClick={nextTrack}
              disabled={!canGoForward}
              className="w-16 h-16 rounded-full"
            >
              <SkipForward size={24} />
            </SacredButton>
          </div>
        </SacredCard>
      </motion.div>

      {/* Advanced Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {/* Speed Control */}
          <SacredCard variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-serif text-sacred-blue-900">Playback Speed</h4>
              <SacredButton
                variant="gold"
                size="lg"
                onClick={changeSpeed}
                className="w-full"
              >
                <Gauge size={20} className="mr-2" />
                {speed}x Speed
              </SacredButton>
            </div>
          </SacredCard>

          {/* Bookmark Control */}
          <SacredCard variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-serif text-sacred-blue-900">Bookmark</h4>
              <div className="flex space-x-3">
                <SacredButton
                  variant={hasBookmark ? "gold" : "ghost"}
                  size="md"
                  onClick={toggleBookmark}
                  className="flex-1"
                >
                  {hasBookmark ? <BookmarkCheck size={20} className="mr-2" /> : <Bookmark size={20} className="mr-2" />}
                  {hasBookmark ? 'Saved' : 'Save'}
                </SacredButton>
                
                {hasBookmark && (
                  <SacredButton
                    variant="primary"
                    size="md"
                    onClick={jumpToBookmark}
                    className="flex-1"
                  >
                    Jump to Bookmark
                  </SacredButton>
                )}
              </div>
            </div>
          </SacredCard>
        </div>
      </motion.div>

      {/* Track List Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SacredCard variant="heavy" className="p-6">
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-6 text-center">
            Audiobook Chapters
          </h3>
          
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {tracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  index === currentTrackIndex 
                    ? 'bg-sacred-gradient text-white shadow-lg' 
                    : 'bg-white/50 hover:bg-white/70 text-sacred-blue-900'
                }`}
                onClick={() => {
                  if (index !== currentTrackIndex) {
                    playTrackAtIndex(index);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold">{track.title}</h4>
                    <p className={`text-sm ${
                      index === currentTrackIndex 
                        ? 'text-white/80' 
                        : 'text-sacred-blue-600'
                    }`}>
                      Chapter {index + 1}
                    </p>
                  </div>
                  
                  {index === currentTrackIndex && (
                    <div className="flex items-center space-x-2">
                      {isActuallyPlaying ? (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-white animate-pulse"></div>
                          <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-4 bg-white animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </SacredCard>
      </motion.div>
    </div>
  );
}
