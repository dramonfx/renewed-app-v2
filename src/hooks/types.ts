
// src/hooks/types.ts
'use client';

/**
 * Hook Types - Enhanced with Phase 5.1 Integration
 * 
 * Comprehensive type definitions for audio hooks including enhanced
 * Phase 5.1 types for cross-track navigation and registry integration.
 */

import { TrackWithUrl, AudioBookmark, TrackLoadingState, CrossTrackNavigationError } from '../types/audio';
import { TrackRegistry } from '../lib/audio/TrackRegistry';
import { TrackResolutionEngine } from '../lib/audio/TrackResolutionEngine';
import { AudioCacheManager } from '../lib/audio/CachingFramework';

// === CORE AUDIO PLAYER TYPES ===

export interface AudioPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
  track: TrackWithUrl | null;
  playbackRate: number;
}

export interface AudioPlayerControls {
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  loadTrack: (track: TrackWithUrl) => Promise<void>;
}

export interface AudioPlayerOptions {
  autoPlay?: boolean;
  volume?: number;
  playbackRate?: number;
  preload?: 'none' | 'metadata' | 'auto';
  crossOrigin?: 'anonymous' | 'use-credentials';
  loop?: boolean;
  muted?: boolean;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onError?: (error: string) => void;
  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onVolumeChange?: (volume: number) => void;
  onRateChange?: (rate: number) => void;
}

export interface UseAudioPlayerReturn {
  // State
  state: AudioPlayerState;
  
  // Controls
  controls: AudioPlayerControls;
  
  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>;
  
  // Bookmarks (basic)
  bookmarks: AudioBookmark[];
  addBookmark: (time: number, title?: string) => void;
  removeBookmark: (id: string) => void;
  jumpToBookmark: (id: string) => void;
  
  // Utility
  formatTime: (time: number) => string;
  getProgress: () => number;
}

// === PHASE 5.1 ENHANCED TYPES ===

export interface AudioPlayerEnhancedState extends AudioPlayerState {
  // Enhanced loading states
  loadingState: TrackLoadingState;
  resolutionProgress: number;
  
  // Cross-track navigation
  isNavigatingCrossTrack: boolean;
  navigationTarget: string | null;
  navigationSource: string | null;
  
  // Registry integration
  registryConnected: boolean;
  availableTracks: TrackWithUrl[];
  
  // Performance metrics
  loadTime: number;
  cacheHitRate: number;
}

export interface CrossTrackNavigationOptions {
  targetTrackSlug: string;
  bookmarkId?: string;
  timestamp?: number;
  autoPlay?: boolean;
  fadeTransition?: boolean;
  transitionDuration?: number;
  onNavigationStart?: (targetSlug: string) => void;
  onNavigationComplete?: (targetSlug: string) => void;
  onNavigationError?: (error: CrossTrackNavigationError) => void;
}

export interface AudioPlayerEnhancedControls extends AudioPlayerControls {
  // Enhanced track loading
  loadTrackBySlug: (slug: string) => Promise<void>;
  preloadTrackBySlug: (slug: string) => Promise<void>;
  
  // Cross-track navigation
  jumpToBookmarkCrossTrack: (options: CrossTrackNavigationOptions) => Promise<void>;
  navigateToTrack: (trackSlug: string, options?: Partial<CrossTrackNavigationOptions>) => Promise<void>;
  cancelCrossTrackNavigation: () => void;
  
  // Track resolution
  resolveTrackBySlug: (slug: string) => Promise<TrackWithUrl | null>;
  validateTrackReference: (slug: string) => Promise<boolean>;
  
  // Registry operations
  refreshTrackRegistry: () => Promise<void>;
  getAvailableTracks: () => TrackWithUrl[];
  getTracksBySection: (sectionSlug: string) => Promise<TrackWithUrl[]>;
  
  // Performance and analytics
  getLoadingState: (trackSlug?: string) => TrackLoadingState;
  getCacheStats: () => any;
  getResolutionStats: () => any;
  
  // Batch operations
  preloadTracksBatch: (slugs: string[]) => Promise<void>;
  validateTracksBatch: (slugs: string[]) => Promise<{ [slug: string]: boolean }>;
}

export interface AudioPlayerEnhancedOptions extends AudioPlayerOptions {
  // Registry integration
  enableRegistry?: boolean;
  registryConfig?: any;
  
  // Caching options
  enableCaching?: boolean;
  cacheConfig?: any;
  
  // Resolution options
  resolutionTimeout?: number;
  maxRetryAttempts?: number;
  enableFallbackApi?: boolean;
  
  // Cross-track navigation
  enableCrossTrackNavigation?: boolean;
  defaultTransitionDuration?: number;
  enableFadeTransitions?: boolean;
  
  // Performance options
  enableAnalytics?: boolean;
  enablePreloading?: boolean;
  maxConcurrentResolutions?: number;
  
  // Event handlers for enhanced features
  onTrackResolutionStart?: (slug: string) => void;
  onTrackResolutionComplete?: (slug: string, track: TrackWithUrl) => void;
  onTrackResolutionError?: (slug: string, error: CrossTrackNavigationError) => void;
  onCrossTrackNavigationStart?: (sourceSlug: string | null, targetSlug: string) => void;
  onCrossTrackNavigationComplete?: (sourceSlug: string | null, targetSlug: string) => void;
  onCrossTrackNavigationError?: (error: CrossTrackNavigationError) => void;
  onRegistryUpdate?: (trackCount: number) => void;
  onCacheUpdate?: (stats: any) => void;
}

export interface UseAudioPlayerEnhancedReturn {
  // Enhanced state
  state: AudioPlayerEnhancedState;
  
  // Enhanced controls
  controls: AudioPlayerEnhancedControls;
  
  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>;
  
  // Enhanced bookmarks with cross-track support
  bookmarks: AudioBookmark[];
  addBookmark: (time: number, title?: string, trackSlug?: string) => void;
  removeBookmark: (id: string) => void;
  jumpToBookmark: (id: string) => void;
  jumpToBookmarkCrossTrack: (id: string, options?: Partial<CrossTrackNavigationOptions>) => Promise<void>;
  
  // Cross-track bookmark management
  addCrossTrackBookmark: (trackSlug: string, time: number, title?: string) => void;
  getCrossTrackBookmarks: (trackSlug?: string) => AudioBookmark[];
  
  // Registry access (optional - only available if registry is enabled)
  registry?: TrackRegistry;
  resolutionEngine?: TrackResolutionEngine;
  cache?: AudioCacheManager;
  
  // Utility functions
  formatTime: (time: number) => string;
  getProgress: () => number;
  getLoadingProgress: () => number;
  isTrackAvailable: (slug: string) => boolean;
  getTrackMetadata: (slug: string) => TrackWithUrl | null;
}

// === BOOKMARK TYPES ===

export interface BookmarkManagerState {
  bookmarks: AudioBookmark[];
  isLoading: boolean;
  error: string | null;
  lastSyncTime: number;
}

export interface BookmarkManagerControls {
  addBookmark: (bookmark: Omit<AudioBookmark, 'id' | 'createdAt'>) => void;
  removeBookmark: (id: string) => void;
  updateBookmark: (id: string, updates: Partial<AudioBookmark>) => void;
  jumpToBookmark: (id: string) => Promise<void>;
  syncBookmarks: () => Promise<void>;
  exportBookmarks: () => string;
  importBookmarks: (data: string) => Promise<void>;
}

// === PLAYLIST TYPES ===

export interface PlaylistState {
  tracks: TrackWithUrl[];
  currentIndex: number;
  isShuffled: boolean;
  repeatMode: 'none' | 'one' | 'all';
  isLoading: boolean;
  error: string | null;
}

export interface PlaylistControls {
  addTrack: (track: TrackWithUrl) => void;
  removeTrack: (index: number) => void;
  moveTrack: (fromIndex: number, toIndex: number) => void;
  playTrack: (index: number) => Promise<void>;
  nextTrack: () => Promise<void>;
  previousTrack: () => Promise<void>;
  shuffle: () => void;
  setRepeatMode: (mode: 'none' | 'one' | 'all') => void;
  clearPlaylist: () => void;
}

// === UTILITY TYPES ===

export interface AudioContextState {
  isSupported: boolean;
  sampleRate: number;
  state: 'suspended' | 'running' | 'closed';
}

export interface AudioAnalyzerState {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  volume: number;
  peak: number;
  isAnalyzing: boolean;
}

// === ERROR TYPES ===

export interface AudioPlayerError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
  recoverable: boolean;
}

// === PERFORMANCE TYPES ===

export interface PerformanceMetrics {
  loadTime: number;
  bufferHealth: number;
  dropoutCount: number;
  averageBitrate: number;
  cacheHitRate: number;
  memoryUsage: number;
}

// === EXPORT ALL TYPES ===

export type {
  // Core types
  AudioPlayerState,
  AudioPlayerControls,
  AudioPlayerOptions,
  UseAudioPlayerReturn,
  
  // Enhanced types
  AudioPlayerEnhancedState,
  AudioPlayerEnhancedControls,
  AudioPlayerEnhancedOptions,
  UseAudioPlayerEnhancedReturn,
  CrossTrackNavigationOptions,
  
  // Bookmark types
  BookmarkManagerState,
  BookmarkManagerControls,
  
  // Playlist types
  PlaylistState,
  PlaylistControls,
  
  // Utility types
  AudioContextState,
  AudioAnalyzerState,
  AudioPlayerError,
  PerformanceMetrics
};
