
// src/hooks/useAudioPlayerFixed.ts
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSimpleBookmarks } from './useSimpleBookmarks';
import type { SimpleBookmark } from './useSimpleBookmarks';

export interface AudioTrack {
  id: string;
  title: string;
  slug?: string;
  audioUrl?: string;
  duration?: number;
}

export interface UseAudioPlayerOptions {
  autoLoad?: boolean;
  autoPlay?: boolean;
  mode?: 'single' | 'full';
  singleTrackSlug?: string | null;
}

export interface UseAudioPlayerReturn {
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
  bookmarks: SimpleBookmark[];

  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // Control functions
  playPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  playTrackAtIndex: (index: number) => void;
  seek: (time: number) => void;
  skip: (seconds: number) => void;
  skipForward10: () => void;
  skipBackward10: () => void;
  restart: () => void;
  changeSpeed: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Bookmark functions
  saveBookmark: (time?: number, label?: string) => void;
  jumpToBookmark: (bookmark: SimpleBookmark) => void;
  deleteBookmark: (bookmarkId: string) => void;
  clearBookmarks: () => void;
  canSaveBookmark: boolean;

  // Utility functions
  loadTracks: () => Promise<AudioTrack[]>;
  formatTime: (time: number) => string;

  // Progress key for external access
  progressKey: string | null;
}

/**
 * Fixed Audio Player Hook with Simple Bookmark System
 * 
 * Clean implementation that focuses on core functionality:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Simple "Resume from X:XX" functionality
 * - Persistence between sessions
 */
export function useAudioPlayerFixed(options: UseAudioPlayerOptions = {}): UseAudioPlayerReturn {
  const {
    autoLoad = true,
    autoPlay = false,
    mode = 'full',
    singleTrackSlug = null,
  } = options;

  // === CORE STATE MANAGEMENT ===
  const [tracks, setTracks] = useState<AudioTrack[]>([]);
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

  // === REFS ===
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // === COMPUTED VALUES ===
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
  } = useSimpleBookmarks(
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
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // === API LOADING ===
  const loadTracks = useCallback(async (): Promise<AudioTrack[]> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/audio-tracks');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      if (!data.success) {
        throw new Error(data.error || 'API returned unsuccessful response');
      }

      let validTracks: AudioTrack[] = data.tracks || [];

      // If single track mode, filter by slug
      if (singleTrackSlug) {
        validTracks = validTracks.filter((track) => track.slug === singleTrackSlug);

        if (validTracks.length === 0) {
          throw new Error(`No audio track found with slug "${singleTrackSlug}"`);
        }
      }

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

  // === PROGRESS PERSISTENCE ===
  const saveProgress = useCallback((): void => {
    if (!audioRef.current || !progressKey) return;

    const { currentTime: time, duration: dur } = audioRef.current;
    if (time > 0 && dur > 0 && time < dur - 5 && !isNaN(dur)) {
      localStorage.setItem(progressKey, time.toString());
    }
  }, [progressKey]);

  const restoreProgress = useCallback((): void => {
    if (!audioRef.current || !progressKey) return;

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
    setIsPlaying((prev) => !prev);
  }, [currentTrack]);

  const seek = useCallback(
    (time: number): void => {
      if (!audioRef.current || !currentTrack) return;

      const seekTime = Math.max(0, Math.min(duration, time));
      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);

      if (progressKey) {
        localStorage.setItem(progressKey, seekTime.toString());
      }
    },
    [currentTrack, duration, progressKey]
  );

  const skip = useCallback(
    (seconds: number): void => {
      if (!audioRef.current) return;

      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      seek(newTime);
    },
    [currentTime, duration, seek]
  );

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
      setCurrentTrackIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length, currentTrack, progressKey]);

  const previousTrack = useCallback((): void => {
    if (currentTrackIndex > 0) {
      if (currentTrack && progressKey) {
        localStorage.removeItem(progressKey);
      }
      setCurrentTrackIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, currentTrack, progressKey]);

  const playTrackAtIndex = useCallback(
    (index: number): void => {
      if (index >= 0 && index < tracks.length) {
        if (currentTrack && progressKey) {
          localStorage.removeItem(progressKey);
        }
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    },
    [tracks.length, currentTrack, progressKey]
  );

  // === SPEED CONTROL ===
  const changeSpeed = useCallback((): void => {
    const speedOptions = [1, 1.25, 1.5, 2];
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIndex] ?? 1;
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

  // === BOOKMARK FUNCTIONS ===
  const saveBookmark = useCallback((time?: number, label?: string): void => {
    const bookmarkTime = time ?? currentTime;
    if (bookmarkTime > 0) {
      saveBookmarkInternal(bookmarkTime, label);
    }
  }, [currentTime, saveBookmarkInternal]);

  const jumpToBookmark = useCallback((bookmark: SimpleBookmark): void => {
    jumpToBookmarkInternal(bookmark);
  }, [jumpToBookmarkInternal]);

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
      audioElement
        .play()
        .then(() => {
          setIsActuallyPlaying(true);
        })
        .catch((e) => {
          console.error('Error attempting to play audio:', e);
          setIsPlaying(false);
          setIsActuallyPlaying(false);
          setError('Playback failed');
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

    const handleTimeUpdate = (): void => setCurrentTime(audioElement.currentTime);

    const handleLoadedMetadata = (): void => {
      setDuration(audioElement.duration || 0);
      restoreProgress();
    };

    const handlePlay = (): void => setIsActuallyPlaying(true);
    const handlePause = (): void => setIsActuallyPlaying(false);

    const handleEnded = (): void => {
      if (currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
        setIsActuallyPlaying(false);
      }
    };

    const handleError = (e: Event): void => {
      console.error('Audio error:', e);
      setError('Audio playback error');
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
  }, [
    currentTrack,
    currentTrackIndex,
    tracks.length,
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
    canSaveBookmark,

    // Utility functions
    loadTracks,
    formatTime,

    // Progress key for external access
    progressKey,
  };
}

export default useAudioPlayerFixed;
