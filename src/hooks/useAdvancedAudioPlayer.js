
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

// === ROBUSTNESS INFRASTRUCTURE ===

/**
 * Timeout wrapper for promises with configurable timeout
 */
const withTimeout = (promise, timeoutMs = 15000, operation = 'Operation') => {
  return Promise.race([
    promise,
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`${operation} timeout after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
};

/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by temporarily blocking operations after repeated failures
 */
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, name = 'CircuitBreaker') {
    this.failureThreshold = threshold;
    this.timeout = timeout;
    this.name = name;
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
  }

  async execute(operation) {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        console.log(`[${this.name}] Circuit breaker transitioning to HALF_OPEN`);
      } else {
        throw new Error(`[${this.name}] Circuit breaker is OPEN - operation blocked`);
      }
    }

    try {
      const result = await operation();
      
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failureCount = 0;
        console.log(`[${this.name}] Circuit breaker reset to CLOSED`);
      }
      
      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();
      
      if (this.failureCount >= this.failureThreshold) {
        this.state = 'OPEN';
        console.warn(`[${this.name}] Circuit breaker OPENED after ${this.failureCount} failures`);
      }
      
      throw error;
    }
  }

  getState() {
    return {
      state: this.state,
      failureCount: this.failureCount,
      lastFailureTime: this.lastFailureTime
    };
  }

  reset() {
    this.state = 'CLOSED';
    this.failureCount = 0;
    this.lastFailureTime = null;
    console.log(`[${this.name}] Circuit breaker manually reset`);
  }
}

/**
 * Retry logic with exponential backoff
 */
const withRetry = async (fn, maxRetries = 3, baseDelay = 1000, operation = 'Operation') => {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      if (attempt > 0) {
        console.log(`[${operation}] Succeeded on attempt ${attempt + 1}`);
      }
      return result;
    } catch (error) {
      if (attempt === maxRetries) {
        console.error(`[${operation}] Failed after ${maxRetries + 1} attempts:`, error.message);
        throw error;
      }
      
      const delay = baseDelay * Math.pow(2, attempt);
      console.warn(`[${operation}] Attempt ${attempt + 1} failed, retrying in ${delay}ms:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

/**
 * Error categorization for better user experience
 */
const categorizeError = (error) => {
  const message = error.message?.toLowerCase() || '';
  
  if (message.includes('timeout') || message.includes('network')) {
    return {
      type: 'NETWORK',
      userMessage: 'Connection issue. Please check your internet and try again.',
      isRetryable: true,
      suggestedAction: 'Retry'
    };
  }
  
  if (message.includes('unauthorized') || message.includes('forbidden')) {
    return {
      type: 'AUTH',
      userMessage: 'Authentication issue. Please refresh the page.',
      isRetryable: false,
      suggestedAction: 'Refresh Page'
    };
  }
  
  if (message.includes('not found') || message.includes('404')) {
    return {
      type: 'NOT_FOUND',
      userMessage: 'Audio file not found. Some content may be unavailable.',
      isRetryable: false,
      suggestedAction: 'Skip'
    };
  }
  
  if (message.includes('circuit breaker')) {
    return {
      type: 'CIRCUIT_BREAKER',
      userMessage: 'Service temporarily unavailable. Please wait a moment and try again.',
      isRetryable: true,
      suggestedAction: 'Wait and Retry'
    };
  }
  
  return {
    type: 'UNKNOWN',
    userMessage: 'An unexpected error occurred. Please try again.',
    isRetryable: true,
    suggestedAction: 'Retry'
  };
};

/**
 * Advanced Audio Player Hook - Enhanced with Robustness Patterns
 * 
 * Enhanced Features:
 * - Circuit breaker pattern for failure prevention
 * - Timeout wrappers for all Supabase operations
 * - Retry logic with exponential backoff
 * - Network status monitoring and auto-recovery
 * - Comprehensive error categorization
 * - Graceful degradation under adverse conditions
 * - Progressive enhancement for unstable networks
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.initialTracks - Pre-loaded tracks array
 * @param {boolean} options.autoLoad - Whether to auto-load tracks from Supabase
 * @param {boolean} options.autoPlay - Whether to auto-play when track loads
 * @returns {Object} Complete audio player API with robustness features
 */
export function useAdvancedAudioPlayer(options = {}) {
  const {
    initialTracks = [],
    autoLoad = true,
    autoPlay = false
  } = options;

  // === ROBUSTNESS STATE ===
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [circuitBreakerState, setCircuitBreakerState] = useState('CLOSED');
  const [retryCount, setRetryCount] = useState(0);
  const [lastError, setLastError] = useState(null);

  // === CIRCUIT BREAKERS ===
  const supabaseQueryBreaker = useRef(new CircuitBreaker(5, 60000, 'SupabaseQuery'));
  const audioUrlBreaker = useRef(new CircuitBreaker(3, 30000, 'AudioURL'));

  // === CORE STATE MANAGEMENT ===
  const [tracks, setTracks] = useState(initialTracks);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasBookmark, setHasBookmark] = useState(false);
  const [bookmarkRefreshKey, setBookmarkRefreshKey] = useState(0);

  // === REFS ===
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const networkRetryTimeoutRef = useRef(null);

  // === COMPUTED VALUES ===
  const currentTrack = useMemo(() => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  const progressKey = useMemo(() => {
    return currentTrack ? `audio-progress-${currentTrack.slug || currentTrack.id}` : null;
  }, [currentTrack]);

  const globalBookmarkKey = 'audio-bookmark-global';

  // === NETWORK STATUS MONITORING ===
  useEffect(() => {
    const handleOnline = () => {
      console.log('[Network] Connection restored');
      setIsOnline(true);
      setError(null);
      
      // Auto-retry failed operations after network recovery
      if (lastError && lastError.isRetryable) {
        console.log('[Network] Auto-retrying after connection restore');
        if (tracks.length === 0) {
          loadTracks();
        }
      }
    };

    const handleOffline = () => {
      console.warn('[Network] Connection lost');
      setIsOnline(false);
      setError({
        type: 'NETWORK',
        userMessage: 'Connection lost. Please check your internet connection.',
        isRetryable: true,
        suggestedAction: 'Check Connection'
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [lastError, tracks.length]);

  // === UTILITY FUNCTIONS ===
  const formatTime = useCallback((time) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // === ROBUST SUPABASE OPERATIONS ===
  const robustSupabaseQuery = useCallback(async (queryFn, operation = 'Database Query') => {
    return await supabaseQueryBreaker.current.execute(async () => {
      return await withTimeout(
        withRetry(queryFn, 3, 1000, operation),
        15000,
        operation
      );
    });
  }, []);

  const robustSignedUrl = useCallback(async (bucket, path, operation = 'Signed URL') => {
    return await audioUrlBreaker.current.execute(async () => {
      return await withTimeout(
        withRetry(() => supabase.storage.from(bucket).createSignedUrl(path, 3600), 3, 500, operation),
        10000,
        operation
      );
    });
  }, []);

  // === ENHANCED SUPABASE INTEGRATION ===
  const loadTracks = useCallback(async (fetchAll = true) => {
    try {
      setIsLoading(true);
      setError(null);
      setRetryCount(0);

      if (!isOnline) {
        throw new Error('No internet connection');
      }

      console.log('[Audio] Loading tracks from Supabase...');

      // Robust database query
      const sectionsData = await robustSupabaseQuery(
        async () => {
          const { data, error } = await supabase
            .from('sections')
            .select('id, title, slug, order, audio_file_path')
            .order('order', { ascending: true });

          if (error) throw new Error(error.message);
          return data;
        },
        'Sections Query'
      );

      const fetchedTracks = [];
      if (sectionsData && sectionsData.length > 0) {
        console.log(`[Audio] Processing ${sectionsData.length} sections for audio URLs...`);
        
        // Process sections in batches to avoid overwhelming the service
        const batchSize = 3;
        for (let i = 0; i < sectionsData.length; i += batchSize) {
          const batch = sectionsData.slice(i, i + batchSize);
          
          const batchPromises = batch.map(async (section) => {
            if (!section.audio_file_path) {
              return {
                id: section.id,
                title: section.title,
                slug: section.slug || String(section.id),
                audioUrl: null,
                error: 'No audio file path'
              };
            }

            try {
              const signedUrlData = await robustSignedUrl(
                'book-assets',
                section.audio_file_path,
                `Audio URL for ${section.title}`
              );

              return {
                id: section.id,
                title: section.title,
                slug: section.slug || String(section.id),
                audioUrl: signedUrlData.signedUrl
              };
            } catch (urlError) {
              console.warn(`[Audio] Failed to get URL for section ${section.id}:`, urlError.message);
              return {
                id: section.id,
                title: section.title,
                slug: section.slug || String(section.id),
                audioUrl: null,
                error: urlError.message
              };
            }
          });

          const batchResults = await Promise.allSettled(batchPromises);
          
          batchResults.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              fetchedTracks.push(result.value);
            } else {
              const section = batch[index];
              console.error(`[Audio] Batch processing failed for section ${section.id}:`, result.reason);
              fetchedTracks.push({
                id: section.id,
                title: section.title,
                slug: section.slug || String(section.id),
                audioUrl: null,
                error: result.reason?.message || 'Batch processing failed'
              });
            }
          });

          // Small delay between batches to prevent overwhelming the service
          if (i + batchSize < sectionsData.length) {
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }
      }

      console.log(`[Audio] Successfully loaded ${fetchedTracks.length} tracks`);
      setTracks(fetchedTracks);
      setIsLoading(false);
      setLastError(null);
      
      // Update circuit breaker states
      setCircuitBreakerState(supabaseQueryBreaker.current.getState().state);
      
      return fetchedTracks;
    } catch (err) {
      const categorizedError = categorizeError(err);
      console.error('[Audio] Track loading failed:', err.message);
      
      setError(categorizedError);
      setLastError(categorizedError);
      setIsLoading(false);
      setRetryCount(prev => prev + 1);
      
      // Update circuit breaker states
      setCircuitBreakerState(supabaseQueryBreaker.current.getState().state);
      
      return [];
    }
  }, [isOnline, robustSupabaseQuery, robustSignedUrl]);

  // === ENHANCED ERROR RECOVERY ===
  const retryOperation = useCallback(async () => {
    if (!isOnline) {
      setError({
        type: 'NETWORK',
        userMessage: 'Please check your internet connection and try again.',
        isRetryable: true,
        suggestedAction: 'Check Connection'
      });
      return;
    }

    console.log('[Audio] Manual retry requested');
    setRetryCount(prev => prev + 1);
    
    if (tracks.length === 0) {
      await loadTracks();
    }
  }, [isOnline, tracks.length, loadTracks]);

  const resetCircuitBreakers = useCallback(() => {
    console.log('[Audio] Resetting circuit breakers');
    supabaseQueryBreaker.current.reset();
    audioUrlBreaker.current.reset();
    setCircuitBreakerState('CLOSED');
    setError(null);
    setLastError(null);
  }, []);

  // === BOOKMARK SYSTEM ===
  const updateBookmarkState = useCallback(() => {
    if (!currentTrack) return;
    try {
      const raw = localStorage.getItem(globalBookmarkKey);
      const data = JSON.parse(raw || '{}');
      setHasBookmark(!!data && !!data.slug && !isNaN(data.time));
    } catch {
      setHasBookmark(false);
    }
  }, [currentTrack]);

  const toggleBookmark = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    
    const bookmark = { 
      slug: currentTrack.slug, 
      time: audioRef.current.currentTime, 
      trackTitle: currentTrack.title 
    };
    localStorage.setItem(globalBookmarkKey, JSON.stringify(bookmark));
    setHasBookmark(true);
    setBookmarkRefreshKey(prev => prev + 1);
  }, [currentTrack]);

  const clearBookmark = useCallback(() => {
    localStorage.removeItem(globalBookmarkKey);
    setHasBookmark(false);
    setBookmarkRefreshKey(prev => prev + 1);
  }, []);

  const jumpToBookmark = useCallback(() => {
    try {
      const raw = localStorage.getItem(globalBookmarkKey);
      const data = JSON.parse(raw || '{}');
      
      if (!data || !data.slug || isNaN(data.time)) {
        throw new Error('Invalid bookmark data');
      }

      const index = tracks.findIndex(t => t.slug === data.slug);
      if (index === -1) {
        throw new Error('Bookmarked track not found');
      }

      setIsPlaying(false);
      
      if (currentTrackIndex === index) {
        // Same track - just seek to bookmark time
        if (audioRef.current) {
          audioRef.current.currentTime = data.time;
          setCurrentTime(data.time);
        }
        setIsPlaying(true);
      } else {
        // Different track - set flag to jump after track loads
        sessionStorage.setItem('jumpToGlobalBookmarkTime', data.time.toString());
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    } catch (err) {
      console.error("Error jumping to bookmark:", err);
      setError({
        type: 'BOOKMARK',
        userMessage: "Unable to jump to bookmark. The bookmark may be invalid.",
        isRetryable: false,
        suggestedAction: 'Clear Bookmark'
      });
    }
  }, [tracks, currentTrackIndex]);

  const getBookmark = useCallback(() => {
    try {
      const raw = localStorage.getItem(globalBookmarkKey);
      return JSON.parse(raw || '{}');
    } catch {
      return null;
    }
  }, []);

  // === PROGRESS PERSISTENCE ===
  const saveProgress = useCallback(() => {
    if (!audioRef.current || !progressKey) return;
    
    const { currentTime: time, duration: dur } = audioRef.current;
    if (time > 0 && dur > 0 && time < dur && !isNaN(dur)) {
      localStorage.setItem(progressKey, time.toString());
    }
  }, [progressKey]);

  const restoreProgress = useCallback(() => {
    if (!audioRef.current || !progressKey) return;

    // Check for bookmark jump first
    const jumpToBookmarkTimeStr = sessionStorage.getItem('jumpToGlobalBookmarkTime');
    if (jumpToBookmarkTimeStr !== null && currentTrack && 
        localStorage.getItem(globalBookmarkKey)?.includes(currentTrack.slug)) {
      const jumpTime = parseFloat(jumpToBookmarkTimeStr);
      sessionStorage.removeItem('jumpToGlobalBookmarkTime');
      
      if (!isNaN(jumpTime) && jumpTime < (audioRef.current.duration || Infinity)) {
        audioRef.current.currentTime = jumpTime;
        setCurrentTime(jumpTime);
        return;
      }
    }

    // Otherwise restore normal progress
    const savedTime = localStorage.getItem(progressKey);
    if (savedTime && !isNaN(parseFloat(savedTime))) {
      const timeToSet = parseFloat(savedTime);
      if (timeToSet < (audioRef.current.duration || Infinity) && timeToSet > 0.1) {
        audioRef.current.currentTime = timeToSet;
        setCurrentTime(timeToSet);
      } else {
        audioRef.current.currentTime = 0;
        setCurrentTime(0);
      }
    } else {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  }, [progressKey, currentTrack]);

  // === PLAYBACK CONTROLS ===
  const playPause = useCallback(() => {
    if (!audioRef.current || !currentTrack || !currentTrack.audioUrl) return;
    setIsPlaying(prev => !prev);
  }, [currentTrack]);

  const seek = useCallback((time) => {
    if (!audioRef.current || !currentTrack) return;
    
    const seekTime = Math.max(0, Math.min(duration, time));
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    
    if (progressKey) {
      localStorage.setItem(progressKey, seekTime.toString());
    }
  }, [currentTrack, duration, progressKey]);

  const skip = useCallback((seconds) => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);
  }, [currentTime, duration, seek]);

  const restart = useCallback(() => {
    seek(0);
  }, [seek]);

  // === TRACK NAVIGATION ===
  const nextTrack = useCallback(() => {
    if (currentTrackIndex < tracks.length - 1) {
      // Clear progress for current track
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length, currentTrack, progressKey]);

  const previousTrack = useCallback(() => {
    if (currentTrackIndex > 0) {
      // Clear progress for current track
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, currentTrack, progressKey]);

  const playTrackAtIndex = useCallback((index) => {
    if (index >= 0 && index < tracks.length) {
      // Clear progress for current track
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  }, [tracks.length, currentTrack, progressKey]);

  // === SPEED CONTROL ===
  const changeSpeed = useCallback(() => {
    const speedOptions = [1, 1.25, 1.5, 2];
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIndex];
    setSpeed(newSpeed);
  }, [speed]);

  // === VOLUME CONTROL ===
  const setVolumeLevel = useCallback((newVolume) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    setIsMuted(clampedVolume === 0);
  }, []);

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  // === RESET FUNCTION ===
  const resetPlayer = useCallback(() => {
    setCurrentTrackIndex(0);
    setIsPlaying(false);
    setIsActuallyPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setSpeed(1);
    setVolume(0.8);
    setIsMuted(false);
    setError(null);
    setLastError(null);
    setHasBookmark(false);
    setRetryCount(0);
    
    // Reset circuit breakers
    resetCircuitBreakers();
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.8;
    }
  }, [resetCircuitBreakers]);

  // === AUDIO ELEMENT LIFECYCLE ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack || !currentTrack.audioUrl) {
      if (audioElement) audioElement.src = '';
      setIsPlaying(false);
      setIsActuallyPlaying(false);
      setDuration(0);
      setCurrentTime(0);
      return;
    }

    const currentSrc = audioElement.src;
    const newSrc = currentTrack.audioUrl;
    
    if (currentSrc !== newSrc) {
      audioElement.src = newSrc;
      setCurrentTime(0);
      setDuration(0);
      audioElement.load();
    }
    
    audioElement.playbackRate = speed;
  }, [currentTrack, speed]);

  // === PLAY/PAUSE INTENT HANDLING ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack || !currentTrack.audioUrl) return;

    if (isPlaying) {
      audioElement.play()
        .then(() => {
          setIsActuallyPlaying(true);
          setError(null); // Clear any previous playback errors
        })
        .catch(e => {
          console.error("Error attempting to play audio:", e);
          setIsPlaying(false);
          setIsActuallyPlaying(false);
          
          const categorizedError = categorizeError(e);
          setError({
            ...categorizedError,
            userMessage: "Playback failed. Please try again or select a different track."
          });
        });
    } else {
      audioElement.pause();
      setIsActuallyPlaying(false);
    }
  }, [isPlaying, currentTrack]);

  // === AUDIO EVENT LISTENERS ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack) return;

    const handleTimeUpdate = () => setCurrentTime(audioElement.currentTime);
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration || 0);
      restoreProgress();
    };
    
    const handlePlay = () => setIsActuallyPlaying(true);
    const handlePause = () => setIsActuallyPlaying(false);
    
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
        setIsActuallyPlaying(false);
      }
    };
    
    const handleError = (e) => {
      console.error("Audio playback error:", e);
      const categorizedError = categorizeError(e.target?.error || e);
      setError({
        ...categorizedError,
        userMessage: "Audio playback error. Please try a different track."
      });
      setIsPlaying(false);
      setIsActuallyPlaying(false);
    };

    // Add event listeners
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    audioElement.addEventListener('pause', saveProgress);

    // Start progress save interval
    progressIntervalRef.current = setInterval(saveProgress, 5000);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
      audioElement.removeEventListener('pause', saveProgress);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentTrack, currentTrackIndex, tracks.length, nextTrack, restoreProgress, saveProgress]);

  // === BOOKMARK STATE UPDATES ===
  useEffect(() => {
    updateBookmarkState();
  }, [currentTrack, bookmarkRefreshKey, updateBookmarkState]);

  // === INITIAL TRACK LOADING ===
  useEffect(() => {
    if (autoLoad && tracks.length === 0) {
      loadTracks();
    }
  }, [autoLoad, tracks.length, loadTracks]);

  // === AUTO PLAY ===
  useEffect(() => {
    if (autoPlay && currentTrack && currentTrack.audioUrl && !isPlaying) {
      setIsPlaying(true);
    }
  }, [autoPlay, currentTrack, isPlaying]);

  // === CLEANUP ===
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (networkRetryTimeoutRef.current) {
        clearTimeout(networkRetryTimeoutRef.current);
      }
    };
  }, []);

  // === RETURN COMPREHENSIVE API WITH ROBUSTNESS FEATURES ===
  return {
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

    // Audio element ref (for advanced usage)
    audioRef,

    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    skip,
    restart,
    changeSpeed,
    setVolume: setVolumeLevel,
    toggleMute,

    // Bookmark functions
    toggleBookmark,
    jumpToBookmark,
    clearBookmark,
    getBookmark,

    // Utility functions
    loadTracks,
    resetPlayer,
    formatTime,

    // Robustness functions
    retryOperation,
    resetCircuitBreakers,

    // Progress key for external access
    progressKey,
    globalBookmarkKey
  };
}

export default useAdvancedAudioPlayer;
