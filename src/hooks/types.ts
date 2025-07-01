// src/hooks/types.ts
'use client';

/**
 * Enhanced Type Definitions for Audio Player System
 * 
 * Comprehensive type definitions for the enhanced audio player system
 * including all Phase 2 Core Audio Engine components.
 */

// Re-export core engine types
export type {
  AudioEngineConfig,
  AudioEngineStats,
  AudioSource,
  EnhancedTrack
} from '../lib/audio/CoreAudioEngine';

export type {
  BufferStrategy,
  NetworkCondition,
  BufferState
} from '../lib/audio/AudioBufferManager';

export type {
  AnalyticsConfig,
  PerformanceMetric,
  UserBehaviorEvent,
  ErrorEvent,
  AnalyticsSession
} from '../lib/audio/AudioAnalytics';

export type {
  ErrorRecoveryConfig,
  AudioError,
  RecoveryAttempt,
  RecoverySession
} from '../lib/audio/AudioErrorRecovery';

export type {
  KeyboardShortcut,
  KeyboardShortcutsConfig,
  AudioPlayerControls
} from '../lib/audio/AudioKeyboardShortcuts';

export type {
  UseEnhancedAudioPlayerConfig,
  EnhancedAudioPlayerState,
  EnhancedAudioPlayerControls
} from './useEnhancedAudioPlayer';

// Additional utility types
export interface AudioPlayerTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  accent: string;
  error: string;
  success: string;
  warning: string;
}

export interface AudioPlayerConfig {
  theme?: AudioPlayerTheme;
  showWaveform?: boolean;
  showLyrics?: boolean;
  showBookmarks?: boolean;
  enableKeyboardShortcuts?: boolean;
  enableAnalytics?: boolean;
  enableErrorRecovery?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  shuffle?: boolean;
  crossfade?: boolean;
  gapless?: boolean;
}

export interface PlaylistItem {
  id: string;
  track: EnhancedTrack;
  addedAt: Date;
  addedBy?: string;
  metadata?: Record<string, any>;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  items: PlaylistItem[];
  createdAt: Date;
  updatedAt: Date;
  isPublic: boolean;
  owner: string;
  tags?: string[];
  artwork?: string;
}

export interface AudioBookmark {
  id: string;
  trackId: string;
  timestamp: number;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}

export interface AudioVisualization {
  type: 'waveform' | 'spectrum' | 'bars' | 'circle';
  config: {
    color?: string;
    backgroundColor?: string;
    barCount?: number;
    smoothing?: number;
    sensitivity?: number;
  };
}

export interface AudioLyrics {
  trackId: string;
  lines: {
    timestamp: number;
    text: string;
    duration?: number;
  }[];
  language?: string;
  source?: string;
}

// Event types
export interface AudioPlayerEvent {
  type: string;
  timestamp: number;
  data?: any;
}

export interface TrackChangeEvent extends AudioPlayerEvent {
  type: 'trackChange';
  data: {
    previousTrack: EnhancedTrack | null;
    currentTrack: EnhancedTrack;
  };
}

export interface PlaybackStateEvent extends AudioPlayerEvent {
  type: 'playbackState';
  data: {
    isPlaying: boolean;
    isPaused: boolean;
    currentTime: number;
    duration: number;
  };
}

export interface BufferEvent extends AudioPlayerEvent {
  type: 'buffer';
  data: {
    bufferHealth: number;
    loadingProgress: number;
    networkCondition: string;
  };
}

export interface ErrorEvent extends AudioPlayerEvent {
  type: 'error';
  data: {
    error: AudioError;
    recoveryAttempted: boolean;
    recovered: boolean;
  };
}

// Component prop types
export interface AudioPlayerProps {
  tracks: EnhancedTrack[];
  currentTrackIndex?: number;
  config?: AudioPlayerConfig;
  onTrackChange?: (track: EnhancedTrack, index: number) => void;
  onPlaybackStateChange?: (state: EnhancedAudioPlayerState) => void;
  onError?: (error: AudioError) => void;
  className?: string;
  style?: React.CSSProperties;
}

export interface AudioControlsProps {
  state: EnhancedAudioPlayerState;
  controls: EnhancedAudioPlayerControls;
  config?: AudioPlayerConfig;
  className?: string;
}

export interface AudioProgressProps {
  currentTime: number;
  duration: number;
  buffered?: TimeRanges;
  onSeek: (time: number) => void;
  className?: string;
}

export interface AudioVolumeProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: (muted: boolean) => void;
  className?: string;
}

export interface AudioVisualizerProps {
  audioElement?: HTMLAudioElement;
  visualization: AudioVisualization;
  isPlaying: boolean;
  className?: string;
}

export interface AudioBookmarksProps {
  trackId: string;
  bookmarks: AudioBookmark[];
  currentTime: number;
  onBookmarkAdd: (bookmark: Omit<AudioBookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onBookmarkRemove: (bookmarkId: string) => void;
  onBookmarkSeek: (timestamp: number) => void;
  className?: string;
}

export interface AudioLyricsProps {
  lyrics: AudioLyrics;
  currentTime: number;
  onLineClick?: (timestamp: number) => void;
  className?: string;
}

// Utility types
export type AudioPlayerEventHandler<T extends AudioPlayerEvent = AudioPlayerEvent> = (event: T) => void;

export type AudioPlayerEventMap = {
  trackChange: TrackChangeEvent;
  playbackState: PlaybackStateEvent;
  buffer: BufferEvent;
  error: ErrorEvent;
};

export type AudioPlayerEventType = keyof AudioPlayerEventMap;

// State management types
export interface AudioPlayerStore {
  // Current state
  currentTrack: EnhancedTrack | null;
  playlist: Playlist | null;
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
  
  // UI state
  showPlaylist: boolean;
  showBookmarks: boolean;
  showLyrics: boolean;
  showVisualizer: boolean;
  
  // Actions
  setCurrentTrack: (track: EnhancedTrack) => void;
  setPlaylist: (playlist: Playlist) => void;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  togglePlaylist: () => void;
  toggleBookmarks: () => void;
  toggleLyrics: () => void;
  toggleVisualizer: () => void;
}

// API types
export interface AudioPlayerAPI {
  // Core methods
  loadTrack: (track: EnhancedTrack) => Promise<void>;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  
  // Playlist methods
  loadPlaylist: (playlist: Playlist) => Promise<void>;
  addToPlaylist: (track: EnhancedTrack) => void;
  removeFromPlaylist: (trackId: string) => void;
  
  // Bookmark methods
  addBookmark: (bookmark: Omit<AudioBookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  removeBookmark: (bookmarkId: string) => void;
  getBookmarks: (trackId: string) => AudioBookmark[];
  
  // Analytics methods
  getAnalytics: () => any;
  trackEvent: (event: AudioPlayerEvent) => void;
  
  // Configuration methods
  updateConfig: (config: Partial<AudioPlayerConfig>) => void;
  getConfig: () => AudioPlayerConfig;
  
  // Event methods
  addEventListener: <T extends AudioPlayerEventType>(type: T, handler: AudioPlayerEventHandler<AudioPlayerEventMap[T]>) => void;
  removeEventListener: <T extends AudioPlayerEventType>(type: T, handler: AudioPlayerEventHandler<AudioPlayerEventMap[T]>) => void;
  
  // Cleanup
  destroy: () => void;
}

export default {};