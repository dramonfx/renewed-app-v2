
// src/hooks/useAudioPlayer.ts
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { 
  UseAudioPlayerReturn, 
  AudioPlayerOptions, 
  AudioBookmark, 
  TrackWithUrl 
} from './types';

/**
 * Master Audio Player Hook - Uses Golden Snippet Pattern
 * 
 * Based on proven working Supabase connection from /supabase-test
 * Direct environment variable access, no wrapper dependencies
 * 
 * Features:
 * - Golden snippet Supabase integration
 * - Playlist management with real signed URLs
 * - Playback speed control (1x, 1.25x, 1.5x, 2x)
 * - Bookmark system with persistence
 * - Progress tracking and restoration
 * - Comprehensive error handling
 * - Single and multi-track support
 */
export function useAudioPlayer(options: AudioPlayerOptions = {}): UseAudioPlayerReturn {
  const {
    autoLoad = true,
    autoPlay = false,
    singleTrackSlug = null,
    mode = 'full' // Add mode for context-aware bookmarks
  } = options;

  // === CORE STATE MANAGEMENT ===
  const [tracks, setTracks] = useState<TrackWithUrl[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<AudioBookmark[]>([]);

  // === REFS ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // === COMPUTED VALUES ===
  const currentTrack = useMemo((): TrackWithUrl | null => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  const progressKey = useMemo((): string | null => {
    return currentTrack ? `audio-progress-${currentTrack.slug || currentTrack.id}` : null;
  }, [currentTrack]);

  // Context-aware bookmark storage key
  const bookmarkStorageKey = useMemo((): string => {
    if (mode === 'single' && singleTrackSlug) {
      return `audio-bookmarks-section-${singleTrackSlug}`;
    }
    return 'audio-bookmarks'; // Global for full audiobook mode
  }, [mode, singleTrackSlug]);

  const globalBookmarkKey = 'audio-bookmark-global';

  // === UTILITY FUNCTIONS ===
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // === GOLDEN SNIPPET API BRIDGE LOADING ===
  const loadTracks = useCallback(async (): Promise<TrackWithUrl[]> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔍 Loading tracks via Golden Snippet API bridge...');
      
      // Fetch from our golden snippet API route (which uses server-side working pattern)
      const response = await fetch('/api/audio-tracks');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'API returned unsuccessful response');
      }

      let validTracks: TrackWithUrl[] = data.tracks || [];
      
      // If single track mode, filter by slug
      if (singleTrackSlug) {
        validTracks = validTracks.filter(track => track.slug === singleTrackSlug);
        
        if (validTracks.length === 0) {
          throw new Error(`No audio track found with slug "${singleTrackSlug}"`);
        }
      }

      console.log(`✅ Successfully loaded ${validTracks.length} tracks via Golden Snippet API`);
      
      setTracks(validTracks);
      setIsLoading(false);
      return validTracks;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Error loading tracks via API:', err);
      setError(errorMessage);
      setIsLoading(false);
      return [];
    }
  }, [singleTrackSlug]);

  // === BOOKMARK SYSTEM ===
  const loadBookmarks = useCallback((): void => {
    try {
      const stored = localStorage.getItem(bookmarkStorageKey);
      const parsed = stored ? JSON.parse(stored) : [];
      setBookmarks(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      setBookmarks([]);
    }
  }, [bookmarkStorageKey]);

  const saveBookmark = useCallback((): void => {
    if (!audioRef.current || !currentTrack) return;

    const bookmark: AudioBookmark = {
      id: Date.now(),
      trackIndex: currentTrackIndex,
      time: audioRef.current.currentTime,
      trackTitle: currentTrack.title,
      trackSlug: currentTrack.slug,
      sectionSlug: mode === 'single' ? singleTrackSlug : null, // Add section context
      mode: mode, // Store the mode for context reference
      timestamp: new Date().toISOString()
    };

    const newBookmarks = [...bookmarks, bookmark];
    setBookmarks(newBookmarks);
    localStorage.setItem(bookmarkStorageKey, JSON.stringify(newBookmarks));
    
    console.log('✅ Bookmark saved:', bookmark);
  }, [currentTrack, currentTrackIndex, bookmarks, bookmarkStorageKey, mode, singleTrackSlug]);

  const jumpToBookmark = useCallback((bookmark: AudioBookmark): void => {
    if (!bookmark) return;

    try {
      const trackIndex = tracks.findIndex(t => t.slug === bookmark.trackSlug);
      if (trackIndex === -1) {
        throw new Error('Bookmarked track not found');
      }

      setIsPlaying(false);
      
      if (currentTrackIndex === trackIndex) {
        // Same track - just seek to bookmark time
        if (audioRef.current) {
          audioRef.current.currentTime = bookmark.time;
          setCurrentTime(bookmark.time);
        }
        setIsPlaying(true);
      } else {
        // Different track - set flag to jump after track loads
        sessionStorage.setItem('jumpToBookmarkTime', bookmark.time.toString());
        setCurrentTrackIndex(trackIndex);
        setIsPlaying(true);
      }
      
      console.log('✅ Jumped to bookmark:', bookmark);
    } catch (err) {
      console.error('Error jumping to bookmark:', err);
      setError('Unable to jump to bookmark');
    }
  }, [tracks, currentTrackIndex]);

  const deleteBookmark = useCallback((bookmarkId: number): void => {
    try {
      const updatedBookmarks = bookmarks.filter(bookmark => bookmark.id !== bookmarkId);
      setBookmarks(updatedBookmarks);
      localStorage.setItem(bookmarkStorageKey, JSON.stringify(updatedBookmarks));
      console.log('✅ Bookmark deleted:', bookmarkId);
    } catch (err) {
      console.error('Error deleting bookmark:', err);
    }
  }, [bookmarks, bookmarkStorageKey]);

  const clearBookmarks = useCallback((): void => {
    setBookmarks([]);
    localStorage.removeItem(bookmarkStorageKey);
    console.log('✅ All bookmarks cleared');
  }, [bookmarkStorageKey]);

  // === BOOKMARK CONTEXT LOADING ===
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // === PROGRESS PERSISTENCE ===
  const saveProgress = useCallback((): void => {
    if (!audioRef.current || !progressKey) return;
    
    const { currentTime: time, duration: dur } = audioRef.current;
    if (time > 0 && dur > 0 && time < dur - 5 && !isNaN(dur)) { // Don't save if near end
      localStorage.setItem(progressKey, time.toString());
    }
  }, [progressKey]);

  const restoreProgress = useCallback((): void => {
    if (!audioRef.current || !progressKey) return;

    // Check for bookmark jump first
    const jumpToBookmarkTimeStr = sessionStorage.getItem('jumpToBookmarkTime');
    if (jumpToBookmarkTimeStr !== null) {
      const jumpTime = parseFloat(jumpToBookmarkTimeStr);
      sessionStorage.removeItem('jumpToBookmarkTime');
      
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
      }
    }
  }, [progressKey]);

  // === PLAYBACK CONTROLS ===
  const playPause = useCallback((): void => {
    if (!audioRef.current || !currentTrack || !currentTrack.audioUrl) return;
    setIsPlaying(prev => !prev);
  }, [currentTrack]);

  const seek = useCallback((time: number): void => {
    if (!audioRef.current || !currentTrack) return;
    
    const seekTime = Math.max(0, Math.min(duration, time));
    audioRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
    
    if (progressKey) {
      localStorage.setItem(progressKey, seekTime.toString());
    }
  }, [currentTrack, duration, progressKey]);

  const skip = useCallback((seconds: number): void => {
    if (!audioRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    seek(newTime);
  }, [currentTime, duration, seek]);

  const skipForward10 = useCallback((): void => {
    skip(10);
  }, [skip]);

  const skipBackward10 = useCallback((): void => {
    skip(-10);
  }, [skip]);

  const restart = useCallback((): void => {
    seek(0);
  }, [seek]);

  // === TRACK NAVIGATION ===
  const nextTrack = useCallback((): void => {
    if (currentTrackIndex < tracks.length - 1) {
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length, currentTrack, progressKey]);

  const previousTrack = useCallback((): void => {
    if (currentTrackIndex > 0) {
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, currentTrack, progressKey]);

  const playTrackAtIndex = useCallback((index: number): void => {
    if (index >= 0 && index < tracks.length) {
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  }, [tracks.length, currentTrack, progressKey]);

  // === SPEED CONTROL ===
  const changeSpeed = useCallback((): void => {
    const speedOptions = [1, 1.25, 1.5, 2];
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIndex]!; // Safe due to modulo operation
    setSpeed(newSpeed);
  }, [speed]);

  // === VOLUME CONTROL ===
  const setVolumeLevel = useCallback((newVolume: number): void => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
    
    setIsMuted(clampedVolume === 0);
  }, []);

  const toggleMute = useCallback((): void => {
    if (!audioRef.current) return;

    if (isMuted) {
      audioRef.current.volume = volume;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

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
      console.log(`🎵 Loading audio: ${currentTrack.title}`);
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
          console.log(`▶️ Playing: ${currentTrack.title}`);
        })
        .catch(e => {
          console.error("Error attempting to play audio:", e);
          setIsPlaying(false);
          setIsActuallyPlaying(false);
          setError("Playback failed");
        });
    } else {
      audioElement.pause();
      setIsActuallyPlaying(false);
      console.log(`⏸️ Paused: ${currentTrack.title}`);
    }
  }, [isPlaying, currentTrack]);

  // === AUDIO EVENT LISTENERS ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement || !currentTrack) return;

    const handleTimeUpdate = (): void => setCurrentTime(audioElement.currentTime);
    
    const handleLoadedMetadata = (): void => {
      setDuration(audioElement.duration || 0);
      restoreProgress();
      console.log(`📊 Audio metadata loaded: ${formatTime(audioElement.duration || 0)}`);
    };
    
    const handlePlay = (): void => setIsActuallyPlaying(true);
    const handlePause = (): void => setIsActuallyPlaying(false);
    
    const handleEnded = (): void => {
      console.log(`✅ Track completed: ${currentTrack.title}`);
      if (currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
        setIsActuallyPlaying(false);
      }
    };
    
    const handleError = (e: Event): void => {
      console.error("Audio error:", e);
      setError("Audio playback error");
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

    // Start progress save interval
    progressIntervalRef.current = setInterval(saveProgress, 5000);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentTrack, currentTrackIndex, tracks.length, nextTrack, restoreProgress, saveProgress, formatTime]);

  // === INITIAL LOADING ===
  useEffect(() => {
    if (autoLoad) {
      loadTracks();
      loadBookmarks();
    }
  }, [autoLoad, loadTracks, loadBookmarks]);

  // === AUTO PLAY ===
  useEffect(() => {
    if (autoPlay && currentTrack && currentTrack.audioUrl && !isPlaying && !isLoading) {
      setIsPlaying(true);
    }
  }, [autoPlay, currentTrack, isPlaying, isLoading]);

  // === RETURN COMPREHENSIVE API ===
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
    bookmarks,

    // Audio element ref (for advanced usage)
    audioRef,

    // Control functions
    playPause,
    nextTrack,
    previousTrack,
    playTrackAtIndex,
    seek,
    skip,
    skipForward10,
    skipBackward10,
    restart,
    changeSpeed,
    setVolume: setVolumeLevel,
    toggleMute,

    // Bookmark functions
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    loadBookmarks,

    // Utility functions
    loadTracks,
    formatTime,

    // Progress key for external access
    progressKey,
    globalBookmarkKey
  };
}

export default useAudioPlayer;
