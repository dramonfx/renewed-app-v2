
'use client';

import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, RotateCw, Bookmark, BookmarkCheck, Gauge, Trash2 } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';

export default function NewFullAudiobookPlayer() {
  // Get all state and functions from the new golden snippet hook
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
    clearBookmarks,
    
    // Utility functions
    formatTime
  } = useAudioPlayer({
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
            <p className="text-sacred-blue-600">Connecting to Supabase using golden snippet pattern</p>
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
            <p className="text-sacred-blue-600">No audio tracks found with valid signed URLs</p>
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
                <p className="text-xs text-sacred-blue-400 mt-1">
                  Powered by Golden Snippet Integration ✨
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
          <div className="flex items-center justify-center space-x-4">
            {/* Skip Backward 10s */}
            <SacredButton
              variant="ghost"
              size="md"
              onClick={skipBackward10}
              disabled={!currentTrack?.audioUrl}
              className="w-12 h-12 rounded-full relative"
              title="Skip backward 10 seconds"
            >
              <RotateCcw size={18} />
              <span className="absolute -bottom-1 text-xs font-bold">10s</span>
            </SacredButton>

            {/* Previous Track */}
            <SacredButton
              variant="ghost"
              size="lg"
              onClick={previousTrack}
              disabled={!canGoBack}
              className="w-16 h-16 rounded-full"
              title="Previous track"
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
              title={isActuallyPlaying ? "Pause" : "Play"}
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
              title="Next track"
            >
              <SkipForward size={24} />
            </SacredButton>

            {/* Skip Forward 10s */}
            <SacredButton
              variant="ghost"
              size="md"
              onClick={skipForward10}
              disabled={!currentTrack?.audioUrl}
              className="w-12 h-12 rounded-full relative"
              title="Skip forward 10 seconds"
            >
              <RotateCw size={18} />
              <span className="absolute -bottom-1 text-xs font-bold">10s</span>
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
              <h4 className="text-lg font-serif text-sacred-blue-900">Quick Bookmark</h4>
              <SacredButton
                variant="primary"
                size="lg"
                onClick={saveBookmark}
                disabled={!currentTrack}
                className="w-full"
              >
                <Bookmark size={20} className="mr-2" />
                Save Position
              </SacredButton>
            </div>
          </SacredCard>
        </div>
      </motion.div>

      {/* Bookmarks Management */}
      {bookmarks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <SacredCard variant="heavy" className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-serif text-sacred-blue-900">
                  Saved Bookmarks ({bookmarks.length})
                </h3>
                <SacredButton
                  variant="ghost"
                  size="sm"
                  onClick={clearBookmarks}
                >
                  <Trash2 size={16} className="mr-2" />
                  Clear All
                </SacredButton>
              </div>
              
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {bookmarks.slice(-5).reverse().map((bookmark) => ( // Show latest 5
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-sacred-blue-900">{bookmark.trackTitle}</h4>
                      <p className="text-sm text-sacred-blue-600">
                        {formatTime(bookmark.time)} • {new Date(bookmark.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <SacredButton
                      variant="ghost"
                      size="sm"
                      onClick={() => jumpToBookmark(bookmark)}
                    >
                      Jump
                    </SacredButton>
                  </motion.div>
                ))}
              </div>
            </div>
          </SacredCard>
        </motion.div>
      )}

      {/* Track List Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
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
                transition={{ duration: 0.3, delay: index * 0.05 }}
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
                      Chapter {index + 1} • {track.slug}
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
