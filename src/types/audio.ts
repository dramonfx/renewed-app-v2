
// src/types/audio.ts
'use client';

/**
 * Audio Types - Enhanced with Phase 5.1 Integration
 * 
 * Comprehensive type definitions for the audio system including enhanced
 * types for cross-track navigation, registry integration, and caching.
 */

// === CORE AUDIO TYPES ===

export interface AudioTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration?: number;
  metadata?: {
    artist?: string;
    album?: string;
    genre?: string;
    year?: number;
    [key: string]: any;
  };
}

// Enhanced track interface with URL and section information
export interface TrackWithUrl extends AudioTrack {
  slug: string;
  sectionSlug?: string;
  sectionTitle?: string;
  order?: number;
  isPublished?: boolean;
  lastUpdated?: string;
}

// === BOOKMARK TYPES ===

export interface AudioBookmark {
  id: string;
  timestamp: number; // seconds
  title?: string;
  description?: string;
  trackSlug?: string; // For cross-track bookmarks
  sectionSlug?: string;
  createdAt: string;
  updatedAt?: string;
  tags?: string[];
  isPublic?: boolean;
  sourceTrack?: string | null; // Track where bookmark was created
}

// === PHASE 5.1 ENHANCED TYPES ===

// Loading states for track resolution and loading
export type TrackLoadingState = 
  | 'idle'
  | 'resolving'  // Finding track in registry
  | 'loading'    // Loading audio data
  | 'loaded'     // Ready to play
  | 'error';     // Failed to load

// Cross-track navigation error types
export interface CrossTrackNavigationError extends Error {
  code: 'TRACK_NOT_FOUND' | 'SECTION_NOT_LOADED' | 'LOADING_TIMEOUT' | 'REGISTRY_ERROR';
  trackSlug?: string;
  sectionSlug?: string;
  context?: any;
}

// Enhanced bookmark with cross-track capabilities
export interface EnhancedAudioBookmark extends AudioBookmark {
  // Cross-track navigation metadata
  targetTrackSlug?: string;
  targetSectionSlug?: string;
  navigationContext?: {
    sourcePosition?: number;
    targetPosition?: number;
    transitionType?: 'jump' | 'fade' | 'crossfade';
    autoPlay?: boolean;
  };
  
  // Performance tracking
  accessCount?: number;
  lastAccessed?: string;
  averageLoadTime?: number;
  
  // User experience
  userNotes?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  importance?: 'low' | 'medium' | 'high';
}

// === REGISTRY AND RESOLUTION TYPES ===

// Track metadata for registry system
export interface TrackMetadata {
  id: string;
  slug: string;
  title: string;
  sectionSlug: string;
  sectionTitle: string;
  audioUrl?: string;
  audioDuration?: number;
  order: number;
  isPublished: boolean;
  lastUpdated: string;
  
  // Additional metadata
  description?: string;
  tags?: string[];
  difficulty?: string;
  prerequisites?: string[];
  relatedTracks?: string[];
}

// Track resolution result
export interface TrackResolutionResult {
  success: boolean;
  track?: TrackWithUrl;
  metadata?: TrackMetadata;
  loadTime: number;
  method: 'cache' | 'registry' | 'api';
  fromCache: boolean;
  error?: CrossTrackNavigationError;
}

// === PLAYER STATE TYPES ===

// Enhanced player state with Phase 5.1 features
export interface EnhancedPlayerState {
  // Core playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackRate: number;
  
  // Loading and resolution state
  isLoading: boolean;
  loadingState: TrackLoadingState;
  resolutionProgress: number; // 0-100
  
  // Current track information
  track: TrackWithUrl | null;
  trackMetadata?: TrackMetadata;
  
  // Cross-track navigation state
  isNavigatingCrossTrack: boolean;
  navigationTarget: string | null;
  navigationSource: string | null;
  
  // Registry and caching state
  registryConnected: boolean;
  cacheEnabled: boolean;
  availableTracks: TrackWithUrl[];
  
  // Error state
  error: string | null;
  lastError?: CrossTrackNavigationError;
  
  // Performance metrics
  loadTime: number;
  cacheHitRate: number;
  bufferHealth: number;
}

// === CONFIGURATION TYPES ===

// Player configuration options
export interface AudioPlayerConfig {
  // Basic options
  autoPlay?: boolean;
  volume?: number;
  playbackRate?: number;
  preload?: 'none' | 'metadata' | 'auto';
  
  // Phase 5.1 options
  enableRegistry?: boolean;
  enableCaching?: boolean;
  enableCrossTrackNavigation?: boolean;
  enableAnalytics?: boolean;
  
  // Performance options
  maxConcurrentResolutions?: number;
  resolutionTimeout?: number;
  cacheSize?: number;
  preloadDistance?: number; // Number of tracks to preload ahead
  
  // UI options
  showLoadingIndicators?: boolean;
  enableKeyboardShortcuts?: boolean;
  theme?: 'light' | 'dark' | 'auto';
}

// Registry configuration
export interface RegistryConfig {
  apiEndpoint?: string;
  cacheSize?: number;
  autoRefresh?: boolean;
  refreshInterval?: number;
  enablePersistence?: boolean;
  enableAnalytics?: boolean;
}

// Cache configuration
export interface CacheConfig {
  maxSize: number; // max entries
  maxMemory: number; // max memory in bytes
  ttl: number; // time to live in ms
  enablePersistence: boolean;
  enableAnalytics: boolean;
  evictionStrategy: 'lru' | 'lfu' | 'ttl';
}

// === EVENT TYPES ===

// Player event handlers
export interface AudioPlayerEventHandlers {
  // Playback events
  onPlay?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number) => void;
  onDurationChange?: (duration: number) => void;
  onVolumeChange?: (volume: number) => void;
  onRateChange?: (rate: number) => void;
  
  // Loading events
  onLoadStart?: () => void;
  onLoadedData?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onLoadingStateChange?: (state: TrackLoadingState) => void;
  
  // Track events
  onTrackChange?: (track: TrackWithUrl) => void;
  onTrackLoad?: (track: TrackWithUrl) => void;
  onTrackError?: (error: CrossTrackNavigationError) => void;
  
  // Phase 5.1 events
  onCrossTrackNavigationStart?: (sourceTrack: string | null, targetTrack: string) => void;
  onCrossTrackNavigationComplete?: (sourceTrack: string | null, targetTrack: string) => void;
  onCrossTrackNavigationError?: (error: CrossTrackNavigationError) => void;
  onRegistryUpdate?: (trackCount: number) => void;
  onCacheUpdate?: (stats: any) => void;
  
  // Bookmark events
  onBookmarkAdd?: (bookmark: AudioBookmark) => void;
  onBookmarkRemove?: (bookmarkId: string) => void;
  onBookmarkJump?: (bookmark: AudioBookmark) => void;
  
  // Error events
  onError?: (error: string | CrossTrackNavigationError) => void;
}

// === ANALYTICS TYPES ===

// Performance analytics
export interface PerformanceAnalytics {
  // Load times
  averageLoadTime: number;
  fastestLoadTime: number;
  slowestLoadTime: number;
  
  // Cache performance
  cacheHitRate: number;
  cacheMissRate: number;
  cacheSize: number;
  
  // Resolution performance
  resolutionSuccessRate: number;
  averageResolutionTime: number;
  resolutionRetryRate: number;
  
  // User behavior
  totalPlayTime: number;
  averageSessionLength: number;
  bookmarkUsageRate: number;
  crossTrackNavigationRate: number;
  
  // Error tracking
  errorRate: number;
  commonErrors: { [errorCode: string]: number };
  errorRecoveryRate: number;
}

// Usage analytics
export interface UsageAnalytics {
  // Track usage
  mostPlayedTracks: { trackSlug: string; playCount: number }[];
  leastPlayedTracks: { trackSlug: string; playCount: number }[];
  averageCompletionRate: number;
  
  // Feature usage
  bookmarkCreationRate: number;
  crossTrackNavigationUsage: number;
  playbackSpeedUsage: { [rate: string]: number };
  
  // Time-based analytics
  peakUsageHours: number[];
  sessionDuration: {
    average: number;
    median: number;
    longest: number;
  };
}

// === UTILITY TYPES ===

// Time range for analytics
export interface TimeRange {
  start: Date;
  end: Date;
}

// Pagination for large datasets
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search and filter options
export interface SearchOptions {
  query?: string;
  tags?: string[];
  sectionSlug?: string;
  difficulty?: string;
  dateRange?: TimeRange;
  sortBy?: 'title' | 'date' | 'duration' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  pagination?: Pagination;
}

// === EXPORT ALL TYPES ===

export type {
  // Core types
  AudioTrack,
  TrackWithUrl,
  AudioBookmark,
  
  // Enhanced types
  TrackLoadingState,
  CrossTrackNavigationError,
  EnhancedAudioBookmark,
  TrackMetadata,
  TrackResolutionResult,
  EnhancedPlayerState,
  
  // Configuration types
  AudioPlayerConfig,
  RegistryConfig,
  CacheConfig,
  
  // Event types
  AudioPlayerEventHandlers,
  
  // Analytics types
  PerformanceAnalytics,
  UsageAnalytics,
  
  // Utility types
  TimeRange,
  Pagination,
  SearchOptions
};
