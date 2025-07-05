// src/hooks/useAudioPlayerFixed.ts
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBookmarks } from './useBookmarks';
import type { Bookmark } from './useBookmarks';

export interface AudioTrack {
  id: string;
  title: string;
  slug?: string;
  audioUrl?: string;
  duration?: number;
  description?: string;
  order?: number;
}

export interface UseAudioPlayerFixedOptions {
  mode: 'single' | 'full';
  singleTrackSlug?: string | null;
  autoLoad?: boolean;
  autoPlay?: boolean;
  saveProgress?: boolean;
  restoreProgress?: boolean;
}

export interface UseAudioPlayerFixedReturn {
  // State values
  tracks: AudioTrack[];
  currentTrack: AudioTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  isActuallyPlaying: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  bookmarks: Bookmark[];

  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>;

  // Control functions
  playPause: () => void;
  play: () => void;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setSpeed: (speed: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  selectTrack: (index: number) => void;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  toggleMute: () => void;

  // Bookmark functions
  saveBookmark: (time?: number, label?: string) => void;
  jumpToBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (bookmarkId: string) => void;
  clearBookmarks: () => void;
  canSaveBookmark: boolean;

  // Utility functions
  formatTime: (time: number) => string;
  loadTracks: () => Promise<void>;
  restoreProgress: () => void;
  saveProgress: () => void;
}

/**
 * Fixed Audio Player Hook with Simple Bookmark System
 * 
 * Features:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Progress saving/restoration
 * - Clean error handling
 * - Professional implementation
 */
export function useAudioPlayerFixed(
  options: UseAudioPlayerFixedOptions = { mode: 'full' }
): UseAudioPlayerFixedReturn {
  const {
    mode = 'full',
    singleTrackSlug = null,
    autoLoad = true,
    autoPlay = false,
    saveProgress: shouldSaveProgress = true,
    restoreProgress: shouldRestoreProgress = true,
  } = options;

  // === CORE STATE ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isActuallyPlaying, setIsActuallyPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(1);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // === DERIVED STATE ===
  const currentTrack = useMemo((): AudioTrack | null => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  const progressKey = useMemo((): string | null => {
    return currentTrack ? `audio-progress-${currentTrack.slug || currentTrack.id}` : null;
  }, [currentTrack]);

  // === BOOKMARK SYSTEM ===
  const {
    bookmarks,
    saveBookmark: saveBookmarkInternal,
    jumpToBookmark: jumpToBookmarkInternal,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,
  } = useBookmarks(
    {
      mode,
      trackId: mode === 'single' ? singleTrackSlug || undefined : currentTrack?.id,
      maxBookmarks: mode === 'single' ? 1 : 2,
    },
    (time: number) => {
      // Handle jump to bookmark time
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    }
  );

  // === UTILITY FUNCTIONS ===
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // === TRACK LOADING ===
  const loadTracks = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      if (mode === 'single' && singleTrackSlug) {
        // Single mode: load one track
        const response = await fetch(`/api/book/sections?slug=${singleTrackSlug}`);
        if (!response.ok) {
          throw new Error(`Failed to load track: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.section && data.section.audio_url) {
          const track: AudioTrack = {
            id: data.section.id || singleTrackSlug,
            title: data.section.title || 'Audio Track',
            slug: data.section.slug || singleTrackSlug,
            audioUrl: data.section.audio_url,
            duration: data.section.duration,
            description: data.section.description,
            order: data.section.order || 1,
          };
          setTracks([track]);
          setCurrentTrackIndex(0);
        } else {
          throw new Error('No audio URL found for this section');
        }
      } else {
        // Full mode: load all tracks
        const response = await fetch('/api/book/sections');
        if (!response.ok) {
          throw new Error(`Failed to load tracks: ${response.statusText}`);
        }
        const data = await response.json();
        
        if (data.sections && Array.isArray(data.sections)) {
          const audioTracks: AudioTrack[] = data.sections
            .filter((section: any) => section.audio_url)
            .map((section: any) => ({
              id: section.id,
              title: section.title,
              slug: section.slug,
              audioUrl: section.audio_url,
              duration: section.duration,
              description: section.description,
              order: section.order || 0,
            }))
            .sort((a: AudioTrack, b: AudioTrack) => (a.order || 0) - (b.order || 0));
          
          setTracks(audioTracks);
          if (audioTracks.length > 0) {
            setCurrentTrackIndex(0);
          }
        } else {
          throw new Error('No sections found');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load audio tracks';
      setError(errorMessage);
      console.error('Error loading tracks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [mode, singleTrackSlug]);

  // === PROGRESS MANAGEMENT ===
  const saveProgress = useCallback((): void => {
    if (shouldSaveProgress && progressKey && currentTime > 0) {
      try {
        localStorage.setItem(progressKey, currentTime.toString());
      } catch (error) {
        console.warn('Failed to save progress:', error);
      }
    }
  }, [shouldSaveProgress, progressKey, currentTime]);

  const restoreProgress = useCallback((): void => {
    if (shouldRestoreProgress && progressKey) {
      try {
        const savedProgress = localStorage.getItem(progressKey);
        if (savedProgress) {
          const progress = parseFloat(savedProgress);
          if (!isNaN(progress) && progress > 0 && audioRef.current) {
            audioRef.current.currentTime = progress;
            setCurrentTime(progress);
          }
        }
      } catch (error) {
        console.warn('Failed to restore progress:', error);
      }
    }
  }, [shouldRestoreProgress, progressKey]);

  // === PLAYBACK CONTROLS ===
  const play = useCallback(async (): Promise<void> => {
    if (audioRef.current && currentTrack?.audioUrl) {
      try {
        setError(null);
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to play audio';
        setError(errorMessage);
        setIsPlaying(false);
        console.error('Play error:', err);
      }
    }
  }, [currentTrack]);

  const pause = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const stop = useCallback((): void => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, []);

  const playPause = useCallback((): void => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number): void => {
    if (audioRef.current && !isNaN(time) && time >= 0) {
      audioRef.current.currentTime = Math.min(time, duration || 0);
      setCurrentTime(time);
    }
  }, [duration]);

  const skipForward = useCallback((seconds: number = 15): void => {
    seek(currentTime + seconds);
  }, [currentTime, seek]);

  const skipBackward = useCallback((seconds: number = 15): void => {
    seek(Math.max(0, currentTime - seconds));
  }, [currentTime, seek]);

  const nextTrack = useCallback((): void => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
    }
  }, [currentTrackIndex, tracks.length]);

  const previousTrack = useCallback((): void => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
    }
  }, [currentTrackIndex]);

  const selectTrack = useCallback((index: number): void => {
    if (index >= 0 && index < tracks.length) {
      setCurrentTrackIndex(index);
    }
  }, [tracks.length]);

  const toggleMute = useCallback((): void => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  }, [isMuted, volume]);

  // === BOOKMARK FUNCTIONS ===
  const saveBookmark = useCallback((time?: number, label?: string): void => {
    const bookmarkTime = time ?? currentTime;
    if (bookmarkTime > 0) {
      // Pass the current section slug for cross-section navigation
      const currentSectionSlug = mode === 'single' ? singleTrackSlug : currentTrack?.slug;
      saveBookmarkInternal(bookmarkTime, label, currentSectionSlug || undefined);
    }
  }, [currentTime, saveBookmarkInternal, mode, singleTrackSlug, currentTrack]);

  const jumpToBookmark = useCallback((bookmark: Bookmark): void => {
    jumpToBookmarkInternal(bookmark);
  }, [jumpToBookmarkInternal]);

  // === AUDIO ELEMENT LIFECYCLE ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audioElement.duration || 0);
    };

    const handlePlay = () => {
      setIsActuallyPlaying(true);
    };

    const handlePause = () => {
      setIsActuallyPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsActuallyPlaying(false);
      if (mode === 'full' && currentTrackIndex < tracks.length - 1) {
        nextTrack();
      }
    };

    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('durationchange', handleDurationChange);
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('durationchange', handleDurationChange);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
    };
  }, [mode, currentTrackIndex, tracks.length, nextTrack]);

  // === TRACK CHANGE EFFECTS ===
  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement && currentTrack?.audioUrl) {
      // Save progress before changing tracks
      saveProgress();
      
      // Load new track
      audioElement.src = currentTrack.audioUrl;
      audioElement.playbackRate = speed;
      audioElement.volume = isMuted ? 0 : volume;
      
      // Reset state
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      
      // Restore progress after a short delay
      const restoreTimer = setTimeout(() => {
        restoreProgress();
      }, 100);
      
      return () => clearTimeout(restoreTimer);
    }
  }, [currentTrack, speed, volume, isMuted, saveProgress, restoreProgress]);

  // === SPEED AND VOLUME EFFECTS ===
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // === PROGRESS SAVING ===
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && currentTime > 0) {
        saveProgress();
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, currentTime, saveProgress]);

  // === KEYBOARD SHORTCUTS ===
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return; // Don't interfere with form inputs
      }

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          playPause();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          event.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          event.preventDefault();
          if (mode === 'full') previousTrack();
          break;
        case 'ArrowDown':
          event.preventDefault();
          if (mode === 'full') nextTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    playPause,
    skipBackward,
    skipForward,
    previousTrack,
    nextTrack,
    restoreProgress,
    saveProgress,
  ]);

  // === INITIAL LOADING ===
  useEffect(() => {
    if (autoLoad) {
      loadTracks();
    }
  }, [autoLoad, loadTracks]);

  // === AUTO PLAY ===
  useEffect(() => {
    if (autoPlay && currentTrack && currentTrack.audioUrl && !isPlaying && !isLoading) {
      setIsPlaying(true);
    }
  }, [autoPlay, currentTrack, isPlaying, isLoading]);

  // === PENDING BOOKMARK NAVIGATION ===
  useEffect(() => {
    const checkPendingBookmark = () => {
      const pendingTime = sessionStorage.getItem('pendingBookmarkTime');
      if (pendingTime && audioRef.current) {
        const time = parseFloat(pendingTime);
        if (!isNaN(time) && time > 0) {
          // Small delay to ensure audio is ready
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.currentTime = time;
              setCurrentTime(time);
              sessionStorage.removeItem('pendingBookmarkTime');
            }
          }, 500);
        }
      }
    };

    // Check on mount and when current track changes
    if (currentTrack) {
      checkPendingBookmark();
    }
  }, [currentTrack]);

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

    // Audio element ref
    audioRef,

    // Control functions
    playPause,
    play,
    pause,
    stop,
    seek,
    setSpeed,
    setVolume,
    toggleMute,
    nextTrack,
    previousTrack,
    selectTrack,
    skipForward,
    skipBackward,

    // Bookmark functions
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,

    // Utility functions
    formatTime,
    loadTracks,
    restoreProgress,
    saveProgress,
  };
}
