// src/hooks/useEnhancedAudioPlayer.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { CoreAudioEngine, type AudioEngineConfig, type EnhancedTrack } from '../lib/audio/CoreAudioEngine';
import { AudioBufferManager } from '../lib/audio/AudioBufferManager';
import { AudioAnalytics } from '../lib/audio/AudioAnalytics';
import { AudioErrorRecovery } from '../lib/audio/AudioErrorRecovery';
import { AudioKeyboardShortcuts } from '../lib/audio/AudioKeyboardShortcuts';

export interface UseEnhancedAudioPlayerConfig {
  engine?: Partial<AudioEngineConfig>;
  analytics?: boolean;
  keyboardShortcuts?: boolean;
  errorRecovery?: boolean;
  autoPlay?: boolean;
  volume?: number;
}

export interface EnhancedAudioPlayerState {
  // Core playback state
  currentTrack: EnhancedTrack | null;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  
  // Enhanced state
  bufferHealth: number;
  loadingProgress: number;
  errorState: string | null;
  networkCondition: string;
  
  // Engine stats
  engineStats: {
    bufferHealth: number;
    loadingSpeed: number;
    errorCount: number;
    totalPlayTime: number;
    averageLoadTime: number;
    memoryUsage: number;
  };
}

export interface EnhancedAudioPlayerControls {
  // Core controls
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  
  // Enhanced controls
  loadTrack: (track: EnhancedTrack) => Promise<void>;
  preloadTrack: (track: EnhancedTrack) => Promise<void>;
  skipForward: (seconds?: number) => void;
  skipBackward: (seconds?: number) => void;
  
  // Engine controls
  getEngineStats: () => any;
  updateConfig: (config: Partial<AudioEngineConfig>) => void;
  cleanup: () => void;
}

export function useEnhancedAudioPlayer(
  config: UseEnhancedAudioPlayerConfig = {}
): [EnhancedAudioPlayerState, EnhancedAudioPlayerControls] {
  // Core engine instances
  const engineRef = useRef<CoreAudioEngine | null>(null);
  const bufferManagerRef = useRef<AudioBufferManager | null>(null);
  const analyticsRef = useRef<AudioAnalytics | null>(null);
  const errorRecoveryRef = useRef<AudioErrorRecovery | null>(null);
  const keyboardShortcutsRef = useRef<AudioKeyboardShortcuts | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  // State management
  const [state, setState] = useState<EnhancedAudioPlayerState>({
    currentTrack: null,
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentTime: 0,
    duration: 0,
    volume: config.volume || 1,
    muted: false,
    playbackRate: 1,
    bufferHealth: 100,
    loadingProgress: 0,
    errorState: null,
    networkCondition: 'unknown',
    engineStats: {
      bufferHealth: 100,
      loadingSpeed: 0,
      errorCount: 0,
      totalPlayTime: 0,
      averageLoadTime: 0,
      memoryUsage: 0
    }
  });
  
  // Initialize engines
  useEffect(() => {
    const engineConfig: AudioEngineConfig = {
      bufferAhead: 30,
      preloadNextTrack: true,
      adaptiveBuffering: true,
      memoryManagement: true,
      performanceMonitoring: true,
      errorRetryAttempts: 3,
      trackListening: true,
      trackPerformance: true,
      crossfadeDuration: 1000,
      gaplessPlayback: true,
      audioQualityOptimization: true,
      ...config.engine
    };
    
    // Initialize core engine
    engineRef.current = new CoreAudioEngine(engineConfig);
    
    // Initialize buffer manager
    bufferManagerRef.current = new AudioBufferManager(engineConfig);
    
    // Initialize analytics if enabled
    if (config.analytics !== false) {
      analyticsRef.current = new AudioAnalytics({
        enabled: true,
        trackPerformance: true,
        trackUserBehavior: true,
        trackErrors: true
      });
    }
    
    // Initialize error recovery if enabled
    if (config.errorRecovery !== false) {
      errorRecoveryRef.current = new AudioErrorRecovery({
        maxRetryAttempts: 3,
        retryDelay: 1000,
        progressiveBackoff: true,
        enableNetworkRecovery: true,
        enableResourceRecovery: true
      });
    }
    
    // Initialize keyboard shortcuts if enabled
    if (config.keyboardShortcuts !== false) {
      keyboardShortcutsRef.current = new AudioKeyboardShortcuts({
        enabled: true,
        preventDefaultOnInputs: true,
        showNotifications: false
      });
    }
    
    // Create audio element
    audioElementRef.current = new Audio();
    audioElementRef.current.preload = 'auto';
    
    // Set initial volume
    if (config.volume !== undefined) {
      audioElementRef.current.volume = config.volume;
    }
    
    // Setup event listeners
    setupEventListeners();
    
    return () => {
      cleanup();
    };
  }, []);
  
  // Setup event listeners
  const setupEventListeners = useCallback(() => {
    if (!audioElementRef.current) return;
    
    const audio = audioElementRef.current;
    
    // Core audio events
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('progress', handleProgress);
    audio.addEventListener('volumechange', handleVolumeChange);
    
    // Setup keyboard shortcuts
    if (keyboardShortcutsRef.current) {
      keyboardShortcutsRef.current.setControls({
        playPause: () => state.isPlaying ? pause() : play(),
        skipForward: (seconds) => skipForward(seconds),
        skipBackward: (seconds) => skipBackward(seconds),
        volumeUp: () => setVolume(Math.min(1, state.volume + 0.1)),
        volumeDown: () => setVolume(Math.max(0, state.volume - 0.1)),
        mute: () => setMuted(!state.muted),
        seek: (time) => seek(time)
      });
    }
  }, [state.isPlaying, state.volume, state.muted]);
  
  // Event handlers
  const handleLoadStart = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: true, loadingProgress: 0 }));
    analyticsRef.current?.trackUserBehavior('play', state.currentTrack?.id);
  }, [state.currentTrack]);
  
  const handleLoadedMetadata = useCallback(() => {
    if (!audioElementRef.current) return;
    setState(prev => ({ 
      ...prev, 
      duration: audioElementRef.current!.duration,
      loadingProgress: 50
    }));
  }, []);
  
  const handleCanPlay = useCallback(() => {
    setState(prev => ({ ...prev, isLoading: false, loadingProgress: 100 }));
  }, []);
  
  const handlePlay = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: true, isPaused: false }));
    analyticsRef.current?.trackUserBehavior('play', state.currentTrack?.id);
  }, [state.currentTrack]);
  
  const handlePause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: true }));
    analyticsRef.current?.trackUserBehavior('pause', state.currentTrack?.id);
  }, [state.currentTrack]);
  
  const handleEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false }));
    analyticsRef.current?.trackUserBehavior('track_complete', state.currentTrack?.id, state.duration);
  }, [state.currentTrack, state.duration]);
  
  const handleError = useCallback((event: Event) => {
    if (!audioElementRef.current || !errorRecoveryRef.current) return;
    
    const audioError = errorRecoveryRef.current.analyzeError(event, audioElementRef.current);
    setState(prev => ({ ...prev, errorState: audioError.message, isLoading: false }));
    
    analyticsRef.current?.trackError('playback', audioError.message, state.currentTrack?.id);
    
    // Attempt recovery
    if (state.currentTrack) {
      errorRecoveryRef.current.attemptRecovery(
        audioError,
        audioElementRef.current,
        state.currentTrack.id
      );
    }
  }, [state.currentTrack]);
  
  const handleTimeUpdate = useCallback(() => {
    if (!audioElementRef.current) return;
    setState(prev => ({ ...prev, currentTime: audioElementRef.current!.currentTime }));
  }, []);
  
  const handleProgress = useCallback(() => {
    if (!audioElementRef.current || !bufferManagerRef.current || !state.currentTrack) return;
    
    const bufferState = bufferManagerRef.current.monitorBufferHealth(
      state.currentTrack.id,
      audioElementRef.current
    );
    
    setState(prev => ({ ...prev, bufferHealth: bufferState.bufferHealth }));
    analyticsRef.current?.trackBufferHealth(state.currentTrack.id, bufferState.bufferHealth);
  }, [state.currentTrack]);
  
  const handleVolumeChange = useCallback(() => {
    if (!audioElementRef.current) return;
    setState(prev => ({ 
      ...prev, 
      volume: audioElementRef.current!.volume,
      muted: audioElementRef.current!.muted
    }));
  }, []);
  
  // Control functions
  const loadTrack = useCallback(async (track: EnhancedTrack) => {
    if (!audioElementRef.current) throw new Error('Audio element not initialized');
    
    setState(prev => ({ ...prev, currentTrack: track, errorState: null }));
    
    // Use engine for intelligent loading
    if (engineRef.current) {
      try {
        await engineRef.current.preloadAudio(track);
        const cachedUrl = engineRef.current.getCachedAudioUrl(track.id);
        audioElementRef.current.src = cachedUrl || track.sources[0]?.url || '';
      } catch (error) {
        // Fallback to direct URL
        audioElementRef.current.src = track.sources[0]?.url || '';
      }
    } else {
      audioElementRef.current.src = track.sources[0]?.url || '';
    }
    
    audioElementRef.current.load();
  }, []);
  
  const play = useCallback(async () => {
    if (!audioElementRef.current) throw new Error('Audio element not initialized');
    
    try {
      await audioElementRef.current.play();
    } catch (error) {
      setState(prev => ({ ...prev, errorState: 'Failed to play audio' }));
      throw error;
    }
  }, []);
  
  const pause = useCallback(() => {
    if (!audioElementRef.current) return;
    audioElementRef.current.pause();
  }, []);
  
  const stop = useCallback(() => {
    if (!audioElementRef.current) return;
    audioElementRef.current.pause();
    audioElementRef.current.currentTime = 0;
    setState(prev => ({ ...prev, isPlaying: false, isPaused: false, currentTime: 0 }));
  }, []);
  
  const seek = useCallback((time: number) => {
    if (!audioElementRef.current) return;
    audioElementRef.current.currentTime = Math.max(0, Math.min(time, state.duration));
    analyticsRef.current?.trackUserBehavior('seek', state.currentTrack?.id, undefined, time);
  }, [state.duration, state.currentTrack]);
  
  const setVolume = useCallback((volume: number) => {
    if (!audioElementRef.current) return;
    const clampedVolume = Math.max(0, Math.min(1, volume));
    audioElementRef.current.volume = clampedVolume;
    analyticsRef.current?.trackUserBehavior('volume_change', state.currentTrack?.id, undefined, clampedVolume);
  }, [state.currentTrack]);
  
  const setMuted = useCallback((muted: boolean) => {
    if (!audioElementRef.current) return;
    audioElementRef.current.muted = muted;
  }, []);
  
  const setPlaybackRate = useCallback((rate: number) => {
    if (!audioElementRef.current) return;
    const clampedRate = Math.max(0.25, Math.min(4, rate));
    audioElementRef.current.playbackRate = clampedRate;
    setState(prev => ({ ...prev, playbackRate: clampedRate }));
  }, []);
  
  const preloadTrack = useCallback(async (track: EnhancedTrack) => {
    if (!engineRef.current) return;
    
    try {
      await engineRef.current.preloadAudio(track);
    } catch (error) {
      console.warn('Preload failed:', error);
    }
  }, []);
  
  const skipForward = useCallback((seconds: number = 10) => {
    seek(state.currentTime + seconds);
  }, [state.currentTime, seek]);
  
  const skipBackward = useCallback((seconds: number = 10) => {
    seek(state.currentTime - seconds);
  }, [state.currentTime, seek]);
  
  const getEngineStats = useCallback(() => {
    return {
      engine: engineRef.current?.getStats(),
      buffer: bufferManagerRef.current?.getBufferStats(),
      analytics: analyticsRef.current?.getSummary(),
      errorRecovery: errorRecoveryRef.current?.getRecoveryStats()
    };
  }, []);
  
  const updateConfig = useCallback((newConfig: Partial<AudioEngineConfig>) => {
    engineRef.current?.updateConfig(newConfig);
  }, []);
  
  const cleanup = useCallback(() => {
    engineRef.current?.cleanup();
    bufferManagerRef.current?.clearBufferStates();
    analyticsRef.current?.cleanup();
    errorRecoveryRef.current?.clearSessions();
    keyboardShortcutsRef.current?.cleanup();
    
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.src = '';
    }
  }, []);
  
  // Update engine stats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (engineRef.current) {
        const stats = engineRef.current.getStats();
        setState(prev => ({ ...prev, engineStats: stats }));
      }
      
      if (bufferManagerRef.current) {
        const networkCondition = bufferManagerRef.current.getNetworkCondition();
        setState(prev => ({ 
          ...prev, 
          networkCondition: networkCondition?.effectiveType || 'unknown'
        }));
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const controls: EnhancedAudioPlayerControls = {
    play,
    pause,
    stop,
    seek,
    setVolume,
    setMuted,
    setPlaybackRate,
    loadTrack,
    preloadTrack,
    skipForward,
    skipBackward,
    getEngineStats,
    updateConfig,
    cleanup
  };
  
  return [state, controls];
}

export default useEnhancedAudioPlayer;