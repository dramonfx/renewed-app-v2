
'use client';

import { motion } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Bookmark, 
  BookmarkCheck, 
  Gauge, 
  Volume2, 
  VolumeX,
  RefreshCw,
  AlertTriangle,
  Wifi,
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  Trash2
} from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import { useAdvancedAudioPlayer } from '@/hooks/useAdvancedAudioPlayer';

export default function FullAudiobookPlayer() {
  // Get all state and functions from the enhanced hook
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
    hasBookmark,
    
    // Robustness state
    isOnline,
    circuitBreakerState,
    retryCount,
    lastError,
    
    // Audio element ref
    audioRef,
    
    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    skip,
    changeSpeed,
    setVolume,
    toggleMute,
    
    // Bookmark functions
    toggleBookmark,
    jumpToBookmark,
    clearBookmark,
    getBookmark,
    
    // Utility functions
    formatTime,
    
    // Robustness functions
    retryOperation,
    resetCircuitBreakers
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

  // Handle volume slider change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Network Status Indicator
  const NetworkStatus = () => (
    <div className="flex items-center space-x-2">
      {isOnline ? (
        <div className="flex items-center space-x-2 text-green-600">
          <Wifi size={16} />
          <span className="text-sm">Online</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2 text-red-600">
          <WifiOff size={16} />
          <span className="text-sm">Offline</span>
        </div>
      )}
      
      {circuitBreakerState !== 'CLOSED' && (
        <div className="flex items-center space-x-1 text-amber-600">
          <AlertTriangle size={14} />
          <span className="text-xs">{circuitBreakerState}</span>
        </div>
      )}
    </div>
  );

  // Enhanced Error Display with Recovery Options
  const ErrorDisplay = ({ error }) => {
    if (!error) return null;

    const getErrorIcon = (type) => {
      switch (type) {
        case 'NETWORK': return <WifiOff size={24} className="text-red-500" />;
        case 'CIRCUIT_BREAKER': return <AlertTriangle size={24} className="text-amber-500" />;
        case 'AUTH': return <XCircle size={24} className="text-red-500" />;
        default: return <AlertTriangle size={24} className="text-red-500" />;
      }
    };

    const getActionButton = () => {
      switch (error.suggestedAction) {
        case 'Retry':
          return (
            <SacredButton 
              variant="primary" 
              size="sm" 
              onClick={retryOperation}
              disabled={!isOnline}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Retry</span>
            </SacredButton>
          );
        case 'Wait and Retry':
          return (
            <SacredButton 
              variant="gold" 
              size="sm" 
              onClick={resetCircuitBreakers}
              className="flex items-center space-x-2"
            >
              <Clock size={16} />
              <span>Reset & Retry</span>
            </SacredButton>
          );
        case 'Refresh Page':
          return (
            <SacredButton 
              variant="primary" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Refresh Page</span>
            </SacredButton>
          );
        case 'Clear Bookmark':
          return (
            <SacredButton 
              variant="ghost" 
              size="sm" 
              onClick={clearBookmark}
              className="flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Clear Bookmark</span>
            </SacredButton>
          );
        default:
          return (
            <SacredButton 
              variant="primary" 
              size="sm" 
              onClick={retryOperation}
              disabled={!isOnline}
              className="flex items-center space-x-2"
            >
              <RefreshCw size={16} />
              <span>Try Again</span>
            </SacredButton>
          );
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="mb-6"
      >
        <SacredCard variant="glass" className="p-4 border-l-4 border-red-400">
          <div className="flex items-start space-x-3">
            {getErrorIcon(error.type)}
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-red-700 mb-1">
                {error.type === 'NETWORK' ? 'Connection Issue' : 
                 error.type === 'CIRCUIT_BREAKER' ? 'Service Temporarily Unavailable' :
                 error.type === 'AUTH' ? 'Authentication Error' : 'Error'}
              </h4>
              <p className="text-sm text-red-600 mb-3">{error.userMessage}</p>
              <div className="flex items-center space-x-3">
                {getActionButton()}
                {retryCount > 0 && (
                  <span className="text-xs text-gray-500">
                    Retry {retryCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </SacredCard>
      </motion.div>
    );
  };

  // Loading state with enhanced feedback
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
            
            {/* Network status during loading */}
            <div className="pt-4 border-t border-sacred-blue-200">
              <NetworkStatus />
            </div>
            
            {retryCount > 0 && (
              <p className="text-sm text-amber-600">
                Retrying... (Attempt {retryCount})
              </p>
            )}
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  // No tracks state with enhanced error handling
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
            
            <div className="pt-4 border-t border-sacred-blue-200 space-y-3">
              <NetworkStatus />
              
              {isOnline && (
                <SacredButton 
                  variant="primary" 
                  onClick={retryOperation}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw size={16} />
                  <span>Retry Loading</span>
                </SacredButton>
              )}
            </div>
          </div>
        </SacredCard>
      </motion.div>
    );
  }

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  const canGoBack = currentTrackIndex > 0;
  const canGoForward = currentTrackIndex < tracks.length - 1;
  const bookmark = getBookmark();

  return (
    <div className="space-y-8">
      {/* Hidden audio element */}
      <audio ref={audioRef} />

      {/* Error Display */}
      <ErrorDisplay error={error} />

      {/* System Status Bar (shown when relevant) */}
      {(!isOnline || circuitBreakerState !== 'CLOSED' || retryCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SacredCard variant="glass" className="p-3">
            <div className="flex items-center justify-between">
              <NetworkStatus />
              
              {retryCount > 0 && (
                <div className="text-sm text-amber-600">
                  {retryCount} retry{retryCount > 1 ? 's' : ''} attempted
                </div>
              )}
              
              {circuitBreakerState === 'CLOSED' && isOnline && retryCount === 0 && (
                <div className="flex items-center space-x-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm">All systems operational</span>
                </div>
              )}
            </div>
          </SacredCard>
        </motion.div>
      )}

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
                {currentTrack?.error && (
                  <p className="text-red-500 text-sm mt-1">
                    ⚠️ Audio unavailable
                  </p>
                )}
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
              title="Previous Track"
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
              title="Next Track"
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
        <div className="grid md:grid-cols-3 gap-6">
          {/* Speed Control */}
          <SacredCard variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-serif text-sacred-blue-900">Playback Speed</h4>
              <SacredButton
                variant="gold"
                size="lg"
                onClick={changeSpeed}
                className="w-full"
                title="Change Playback Speed"
              >
                <Gauge size={20} className="mr-2" />
                {speed}x Speed
              </SacredButton>
            </div>
          </SacredCard>

          {/* Volume Control */}
          <SacredCard variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-serif text-sacred-blue-900">Volume</h4>
              <div className="space-y-3">
                <SacredButton
                  variant="ghost"
                  size="md"
                  onClick={toggleMute}
                  className="w-full"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX size={20} className="mr-2" /> : <Volume2 size={20} className="mr-2" />}
                  {isMuted ? 'Muted' : Math.round(volume * 100) + '%'}
                </SacredButton>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-sacred-blue-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #60B5FF 0%, #60B5FF ${volume * 100}%, #ddd ${volume * 100}%, #ddd 100%)`
                  }}
                />
              </div>
            </div>
          </SacredCard>

          {/* Bookmark Control */}
          <SacredCard variant="glass" className="p-6">
            <div className="text-center space-y-4">
              <h4 className="text-lg font-serif text-sacred-blue-900">Bookmark</h4>
              <div className="space-y-2">
                <SacredButton
                  variant={hasBookmark ? "gold" : "ghost"}
                  size="md"
                  onClick={toggleBookmark}
                  className="w-full"
                  disabled={!currentTrack}
                  title={hasBookmark ? "Update Bookmark" : "Save Bookmark"}
                >
                  {hasBookmark ? <BookmarkCheck size={20} className="mr-2" /> : <Bookmark size={20} className="mr-2" />}
                  {hasBookmark ? 'Saved' : 'Save'}
                </SacredButton>
                
                {hasBookmark && (
                  <div className="flex space-x-2">
                    <SacredButton
                      variant="primary"
                      size="sm"
                      onClick={jumpToBookmark}
                      className="flex-1"
                      title="Jump to Bookmark"
                    >
                      Jump to
                    </SacredButton>
                    <SacredButton
                      variant="ghost"
                      size="sm"
                      onClick={clearBookmark}
                      className="flex-1"
                      title="Clear Bookmark"
                    >
                      <Trash2 size={16} />
                    </SacredButton>
                  </div>
                )}
                
                {bookmark && bookmark.trackTitle && (
                  <p className="text-xs text-sacred-blue-600 mt-2">
                    📍 {bookmark.trackTitle} ({formatTime(bookmark.time)})
                  </p>
                )}
              </div>
            </div>
          </SacredCard>
        </div>
      </motion.div>

      {/* Skip Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SacredCard variant="glass" className="p-6">
          <div className="text-center space-y-4">
            <h4 className="text-lg font-serif text-sacred-blue-900">Quick Navigation</h4>
            <div className="flex justify-center space-x-4">
              <SacredButton
                variant="ghost"
                size="md"
                onClick={() => skip(-30)}
                disabled={!currentTrack}
                title="Skip Back 30 seconds"
              >
                ⏪ 30s
              </SacredButton>
              <SacredButton
                variant="ghost"
                size="md"
                onClick={() => seek(0)}
                disabled={!currentTrack}
                title="Restart Track"
              >
                ⏮️ Start
              </SacredButton>
              <SacredButton
                variant="ghost"
                size="md"
                onClick={() => skip(30)}
                disabled={!currentTrack}
                title="Skip Forward 30 seconds"
              >
                30s ⏩
              </SacredButton>
            </div>
          </div>
        </SacredCard>
      </motion.div>

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
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  index === currentTrackIndex 
                    ? 'bg-sacred-gradient text-white shadow-lg' 
                    : track.audioUrl 
                      ? 'bg-white/50 hover:bg-white/70 text-sacred-blue-900'
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => {
                  if (index !== currentTrackIndex && track.audioUrl) {
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
                        : track.audioUrl
                          ? 'text-sacred-blue-600'
                          : 'text-gray-400'
                    }`}>
                      Chapter {index + 1} {!track.audioUrl && '(Audio unavailable)'}
                    </p>
                  </div>
                  
                  {index === currentTrackIndex && track.audioUrl && (
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
                  
                  {!track.audioUrl && (
                    <AlertTriangle size={16} className="text-gray-400" />
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
