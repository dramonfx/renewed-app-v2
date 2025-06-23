
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';

/**
 * Advanced Audio Player Hook - Consolidated audio functionality
 * 
 * Features:
 * - Supabase track loading with signed URLs
 * - Playlist management with automatic progression
 * - Playback speed control (1x, 1.25x, 1.5x, 2x)
 * - Bookmark system with persistence
 * - Progress tracking and restoration
 * - Volume control with mute functionality
 * - Comprehensive error handling
 * - Performance optimized state management
 * 
 * @param {Object} options - Configuration options
 * @param {Array} options.initialTracks - Pre-loaded tracks array
 * @param {boolean} options.autoLoad - Whether to auto-load tracks from Supabase
 * @param {boolean} options.autoPlay - Whether to auto-play when track loads
 * @returns {Object} Complete audio player API
 */
export function useAdvancedAudioPlayer(options = {}) {
  const {
    initialTracks = [],
    autoLoad = true,
    autoPlay = false
  } = options;

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

  // === COMPUTED VALUES ===
  const currentTrack = useMemo(() => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  const progressKey = useMemo(() => {
    return currentTrack ? `audio-progress-${currentTrack.slug || currentTrack.id}` : null;
  }, [currentTrack]);

  const globalBookmarkKey = 'audio-bookmark-global';

  // === UTILITY FUNCTIONS ===
  const formatTime = useCallback((time) => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // === SUPABASE INTEGRATION ===
  const loadTracks = useCallback(async (fetchAll = true) => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('id, title, slug, order, audio_file_path')
        .order('order', { ascending: true });

      if (sectionsError) {
        throw new Error(sectionsError.message);
      }

      const fetchedTracks = [];
      if (sectionsData) {
        for (const section of sectionsData) {
          if (section.audio_file_path) {
            try {
              const { data: signedUrlData, error: audioError } = await supabase.storage
                .from('book-assets')
                .createSignedUrl(section.audio_file_path, 60 * 60);
              
              if (audioError) {
                console.error(`Error creating signed URL for audio ${section.audio_file_path}:`, audioError.message);
                fetchedTracks.push({ 
                  id: section.id, 
                  title: section.title, 
                  slug: section.slug || String(section.id), 
                  audioUrl: null 
                });
              } else {
                fetchedTracks.push({ 
                  id: section.id, 
                  title: section.title, 
                  slug: section.slug || String(section.id), 
                  audioUrl: signedUrlData.signedUrl 
                });
              }
            } catch (urlError) {
              console.error(`Error processing audio for section ${section.id}:`, urlError);
              fetchedTracks.push({ 
                id: section.id, 
                title: section.title, 
                slug: section.slug || String(section.id), 
                audioUrl: null 
              });
            }
          } else {
            fetchedTracks.push({ 
              id: section.id, 
              title: section.title, 
              slug: section.slug || String(section.id), 
              audioUrl: null 
            });
          }
        }
      }

      setTracks(fetchedTracks);
      setIsLoading(false);
      return fetchedTracks;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      console.error('Error fetching audio tracks:', err);
      return [];
    }
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
      setError("Unable to jump to bookmark");
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
    setHasBookmark(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.8;
    }
  }, []);

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
        .then(() => setIsActuallyPlaying(true))
        .catch(e => {
          console.error("Error attempting to play audio:", e);
          setIsPlaying(false);
          setIsActuallyPlaying(false);
          setError("Playback failed");
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
    hasBookmark,

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

    // Progress key for external access
    progressKey,
    globalBookmarkKey
  };
}

export default useAdvancedAudioPlayer;
