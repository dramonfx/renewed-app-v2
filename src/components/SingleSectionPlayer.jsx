
'use client';

import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, Gauge, Bookmark } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

/**
 * Single Section Player Component
 * 
 * Designed for individual book section pages
 * Uses golden snippet pattern via useAudioPlayer hook
 * Focused on single track playback with essential controls
 * 
 * @param {Object} props
 * @param {string} props.sectionSlug - The slug of the section to play
 */
export default function SingleSectionPlayer({ sectionSlug }) {
  // Get state and functions from the new golden snippet hook in single track mode
  const {
    // State values
    tracks,
    currentTrack,
    isPlaying,
    isActuallyPlaying,
    currentTime,
    duration,
    speed,
    isLoading,
    error,
    
    // Audio element ref
    audioRef,
    
    // Control functions
    playPause,
    seek,
    restart,
    changeSpeed,
    saveBookmark,
    
    // Utility functions
    formatTime
  } = useAudioPlayer({
    autoLoad: true,
    autoPlay: false,
    singleTrackSlug: sectionSlug
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

  // Skip forward 15 seconds
  const skipForward = () => {
    if (!audioRef.current) return;
    const newTime = Math.min(duration, currentTime + 15);
    seek(newTime);
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center animate-pulse">
              <span className="text-white text-lg">🎵</span>
            </div>
            <h4 className="text-lg font-serif text-sacred-blue-900">Loading Audio...</h4>
            <p className="text-sm text-sacred-blue-600">Preparing section audio</p>
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
        className="w-full"
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-lg">⚠️</span>
            </div>
            <h4 className="text-lg font-serif text-red-700">Audio Error</h4>
            <p className="text-sm text-red-600">{error}</p>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  // No audio state
  if (!tracks.length || !currentTrack) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full"
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <div className="space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-sacred-blue-100 flex items-center justify-center">
              <span className="text-sacred-blue-600 text-lg">🔇</span>
            </div>
            <h4 className="text-lg font-serif text-sacred-blue-900">No Audio Available</h4>
            <p className="text-sm text-sacred-blue-600">Audio not found for this section</p>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full space-y-6">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Section Audio Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SacredCard variant="heavy" className="p-6">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-14 h-14 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">🎧</span>
              </div>
              <div className="text-left">
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-1">
                  {currentTrack.title}
                </h3>
                <p className="text-sm text-sacred-blue-600">Section Audio Experience</p>
              </div>
            </div>

            {/* Time Display */}
            <div className="flex items-center justify-center space-x-3 text-lg">
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
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <SacredCard variant="glass" className="p-4">
          <div className="space-y-3">
            <h4 className="text-md font-serif text-sacred-blue-900 text-center">Progress</h4>
            
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
                className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-white border-2 border-sacred-blue-300 rounded-full shadow-md cursor-pointer"
                style={{ left: `${progressPercent}%`, marginLeft: '-8px' }}
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
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SacredCard variant="glass" className="p-6">
          <div className="flex items-center justify-center space-x-4">
            {/* Restart */}
            <SacredButton
              variant="ghost"
              size="md"
              onClick={restart}
              className="w-12 h-12 rounded-full"
            >
              <RotateCcw size={20} />
            </SacredButton>

            {/* Play/Pause */}
            <SacredButton
              variant="primary"
              size="lg"
              onClick={playPause}
              disabled={!currentTrack?.audioUrl}
              className="w-16 h-16 rounded-full"
            >
              {isActuallyPlaying ? <Pause size={28} /> : <Play size={28} />}
            </SacredButton>

            {/* Skip Forward 15s */}
            <SacredButton
              variant="ghost"
              size="md"
              onClick={skipForward}
              className="w-12 h-12 rounded-full"
            >
              <SkipForward size={20} />
            </SacredButton>
          </div>
        </SacredCard>
      </motion.div>

      {/* Speed and Bookmark Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Speed Control */}
          <SacredCard variant="glass" className="p-4">
            <div className="text-center space-y-3">
              <h5 className="text-sm font-serif text-sacred-blue-900">Speed</h5>
              <SacredButton
                variant="gold"
                size="md"
                onClick={changeSpeed}
                className="w-full"
              >
                <Gauge size={16} className="mr-1" />
                {speed}x
              </SacredButton>
            </div>
          </SacredCard>

          {/* Bookmark Control */}
          <SacredCard variant="glass" className="p-4">
            <div className="text-center space-y-3">
              <h5 className="text-sm font-serif text-sacred-blue-900">Bookmark</h5>
              <SacredButton
                variant="primary"
                size="md"
                onClick={saveBookmark}
                disabled={!currentTrack}
                className="w-full"
              >
                <Bookmark size={16} className="mr-1" />
                Save
              </SacredButton>
            </div>
          </SacredCard>
        </div>
      </motion.div>

      {/* Audio Status Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center"
      >
        <p className="text-xs text-sacred-blue-500">
          {isActuallyPlaying ? '▶️ Playing' : isPlaying ? '⏸️ Paused' : '⏹️ Stopped'} • 
          <span className="ml-1">Golden Snippet Audio Engine</span>
        </p>
      </motion.div>
    </div>
  );
}
