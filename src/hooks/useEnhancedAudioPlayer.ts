
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDeepReflections } from './useDeepReflections';
import { useGlobalAudioResume } from './useGlobalAudioResume';
import type { DeepReflection } from './useDeepReflections';

export interface AudioTrack {
  id: string;
  title: string;
  slug?: string;
  audioUrl?: string;
  duration?: number;
}

export interface UseEnhancedAudioPlayerOptions {
  autoLoad?: boolean;
  autoPlay?: boolean;
  mode?: 'single' | 'full';
  singleTrackSlug?: string | null;
}

export interface UseEnhancedAudioPlayerReturn {
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

  // Deep Reflections
  reflections: DeepReflection[];
  allReflections: Record<string, DeepReflection[]>;
  canSaveReflection: boolean;
  getSpiritualPrompt: () => string;
  getSectionReflectionCount: (sectionSlug: string) => number;
  getAllSectionsWithReflections: () => Array<{ sectionSlug: string; count: number }>;

  // Global Resume
  hasValidResumeState: boolean;
  getResumeText: () => string | null;

  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement | null>;

  // Control functions
  playPause: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
  playTrackAtIndex: (index: number) => void;
  seek: (time: number) => void;
  skipForward10: () => void;
  skipBackward10: () => void;
  changeSpeed: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;

  // Enhanced Deep Reflection functions
  saveDeepReflection: (timestamp?: number, reflectionText?: string) => void;
  deleteReflection: (reflectionId: string) => void;
  clearAllReflections: () => void;
  navigateToReflection: (reflection: DeepReflection) => void;

  // Global Resume functions
  resumeFromGlobalState: () => void;
  clearResumeState: () => void;

  // Utility functions
  formatTime: (time: number) => string;
}

/**
 * Enhanced Audio Player Hook with Deep Reflections & Global Resume
 * 
 * Combines the audio player functionality with:
 * - Deep Reflections system for spiritual engagement
 * - Global resume state for seamless continuation
 * - Cross-player navigation capabilities
 * - Intent-based spiritual prompting
 */
export function useEnhancedAudioPlayer(options: UseEnhancedAudioPlayerOptions = {}): UseEnhancedAudioPlayerReturn {
  const {
    autoLoad = true,
    autoPlay = false,
    mode = 'full',
    singleTrackSlug = null,
  } = options;

  const router = useRouter();

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
  const globalStateUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // === COMPUTED VALUES ===
  const currentTrack = useMemo((): AudioTrack | null => {
    return tracks[currentTrackIndex] || null;
  }, [tracks, currentTrackIndex]);

  // === ENHANCED SYSTEMS ===
  
  // Deep Reflections System
  const {
    reflections,
    allReflections,
    saveReflection,
    deleteReflection,
    clearAllReflections,
    clearSectionReflections,
    canSaveReflection,
    getSpiritualPrompt,
    getSectionReflectionCount,
    getAllSectionsWithReflections,
  } = useDeepReflections(
    {
      mode,
      currentTrackSlug: currentTrack?.slug,
      currentTrackTitle: currentTrack?.title,
      maxReflections: 5,
    },
    (reflection: DeepReflection) => {
      // Handle navigation to reflection (will be implemented below)
      navigateToReflection(reflection);
    }
  );

  // Global Resume System
  const {
    globalState,
    updateGlobalState,
    clearGlobalState,
    getResumeText,
    hasValidResumeState,
  } = useGlobalAudioResume();

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

  // === GLOBAL RESUME FUNCTIONALITY ===
  
  // Resume from global state (for full player)
  const resumeFromGlobalState = useCallback(() => {
    if (!globalState || mode !== 'full') return;

    // Find the track by slug
    const trackIndex = tracks.findIndex(track => track.slug === globalState.currentSectionSlug);
    if (trackIndex >= 0) {
      setCurrentTrackIndex(trackIndex);
      // The time will be restored when the track loads
      setTimeout(() => {
        if (audioRef.current && globalState.currentTimestamp > 10) {
          audioRef.current.currentTime = globalState.currentTimestamp;
          setCurrentTime(globalState.currentTimestamp);
        }
      }, 100);
    }
  }, [globalState, mode, tracks]);

  // Update global state periodically (for full player)
  const updateGlobalStateIfNeeded = useCallback(() => {
    if (mode === 'full' && currentTrack && currentTime > 10) {
      updateGlobalState(
        currentTrack.slug || currentTrack.id,
        currentTrack.title,
        currentTime,
        isPlaying
      );
    }
  }, [mode, currentTrack, currentTime, isPlaying, updateGlobalState]);

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

      // Update global state immediately for seek operations
      updateGlobalStateIfNeeded();
    },
    [currentTrack, duration, updateGlobalStateIfNeeded]
  );

  const skipForward10 = useCallback((): void => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime + 10));
    seek(newTime);
  }, [currentTime, duration, seek]);

  const skipBackward10 = useCallback((): void => {
    if (!audioRef.current) return;
    const newTime = Math.max(0, Math.min(duration, currentTime - 10));
    seek(newTime);
  }, [currentTime, duration, seek]);

  // === TRACK NAVIGATION ===
  const nextTrack = useCallback((): void => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex, tracks.length]);

  const previousTrack = useCallback((): void => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  }, [currentTrackIndex]);

  const playTrackAtIndex = useCallback(
    (index: number): void => {
      if (index >= 0 && index < tracks.length) {
        setCurrentTrackIndex(index);
        setIsPlaying(true);
      }
    },
    [tracks.length]
  );

  // === SPEED & VOLUME CONTROL ===
  const changeSpeed = useCallback((): void => {
    const speedOptions = [1, 1.25, 1.5, 2];
    const currentIndex = speedOptions.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speedOptions.length;
    const newSpeed = speedOptions[nextIndex] ?? 1;
    setSpeed(newSpeed);
  }, [speed]);

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

  // === DEEP REFLECTION FUNCTIONS ===
  const saveDeepReflection = useCallback((timestamp?: number, reflectionText?: string): void => {
    const reflectionTime = timestamp ?? currentTime;
    if (reflectionTime > 0) {
      saveReflection(reflectionTime, reflectionText);
    }
  }, [currentTime, saveReflection]);

  const navigateToReflection = useCallback((reflection: DeepReflection): void => {
    if (mode === 'full') {
      // Navigate from full player to single player at specific timestamp
      const url = `/book/${reflection.sectionSlug}?t=${Math.floor(reflection.timestamp)}`;
      router.push(url);
    } else {
      // Jump to timestamp in current single player
      seek(reflection.timestamp);
    }
  }, [mode, router, seek]);

  const clearResumeState = useCallback(() => {
    clearGlobalState();
  }, [clearGlobalState]);

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
      
      // Auto-resume for full player if we have global state
      if (mode === 'full' && globalState && 
          currentTrack.slug === globalState.currentSectionSlug &&
          globalState.currentTimestamp > 10) {
        audioElement.currentTime = globalState.currentTimestamp;
        setCurrentTime(globalState.currentTimestamp);
      }
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

    // Start global state update interval for full player
    if (mode === 'full') {
      globalStateUpdateIntervalRef.current = setInterval(updateGlobalStateIfNeeded, 5000);
    }

    return () => {
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);

      if (globalStateUpdateIntervalRef.current) {
        clearInterval(globalStateUpdateIntervalRef.current);
      }
    };
  }, [
    currentTrack,
    currentTrackIndex,
    tracks.length,
    nextTrack,
    mode,
    globalState,
    updateGlobalStateIfNeeded,
  ]);

  // === INITIAL LOADING ===
  useEffect(() => {
    if (autoLoad) {
      loadTracks().catch((err) => {
        console.error('Failed to load tracks in useEffect:', err);
        setError('Failed to load audio tracks');
        setIsLoading(false);
      });
      
      // Fallback timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.warn('Audio loading timeout - forcing loading to false');
        setIsLoading(false);
      }, 10000); // 10 second timeout
      
      return () => clearTimeout(timeoutId);
    }
    // Return empty cleanup function when autoLoad is false
    return () => {};
  }, [autoLoad, loadTracks]);

  // === AUTO-RESUME FOR FULL PLAYER ===
  useEffect(() => {
    if (mode === 'full' && tracks.length > 0 && hasValidResumeState) {
      resumeFromGlobalState();
    }
  }, [mode, tracks.length, hasValidResumeState, resumeFromGlobalState]);

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

    // Deep Reflections
    reflections,
    allReflections,
    canSaveReflection,
    getSpiritualPrompt,
    getSectionReflectionCount,
    getAllSectionsWithReflections,

    // Global Resume
    hasValidResumeState,
    getResumeText,

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
    setVolume: setVolumeLevel,
    toggleMute,

    // Enhanced Deep Reflection functions
    saveDeepReflection,
    deleteReflection,
    clearAllReflections,
    navigateToReflection,

    // Global Resume functions
    resumeFromGlobalState,
    clearResumeState,

    // Utility functions
    formatTime,
  };
}

export default useEnhancedAudioPlayer;
