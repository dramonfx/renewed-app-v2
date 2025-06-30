
// src/hooks/types.ts
import type { AudioTrack, BookSection, JournalEntry, MindsetType } from '@/types';

// useSection hook types
export interface UseSectionReturn {
  data: SectionWithContent | null;
  loading: boolean;
  error: string | null;
}

export interface SectionWithContent extends BookSection {
  audioUrl: string | null | undefined;
  markdownContent: string;
}

// useVisuals hook types
export interface Visual {
  id: number;
  section_id: number;
  file_path: string;
  caption: string;
  display_order: number;
  markdown_tag: string;
  displayUrl: string | null;
  error?: string;
}

export interface UseVisualsReturn {
  data: Visual[];
  loading: boolean;
  error: string | null;
  visualsMap: Map<string, Visual>;
}

// useAudioPlayer hook types
export interface AudioPlayerOptions {
  autoLoad?: boolean;
  autoPlay?: boolean;
  singleTrackSlug?: string | null;
  mode?: 'full' | 'single';
}

export interface AudioBookmark {
  id: number;
  trackIndex: number;
  time: number;
  trackTitle: string;
  trackSlug: string;
  sectionSlug?: string | null;
  mode?: string;
  timestamp: string;
}

export interface TrackWithUrl extends AudioTrack {
  audioUrl: string;
  slug: string;
}

export interface UseAudioPlayerReturn {
  // State values
  tracks: TrackWithUrl[];
  currentTrack: TrackWithUrl | null;
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
  bookmarks: AudioBookmark[];

  // Audio element ref
  audioRef: React.RefObject<HTMLAudioElement>;

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
  saveBookmark: () => void;
  jumpToBookmark: (bookmark: AudioBookmark) => void;
  deleteBookmark: (bookmarkId: number) => void;
  clearBookmarks: () => void;
  loadBookmarks: () => void;

  // Utility functions
  loadTracks: () => Promise<TrackWithUrl[]>;
  formatTime: (time: number) => string;

  // Progress keys
  progressKey: string | null;
  globalBookmarkKey: string;
}

// useLogin hook types
export interface LoginValidationErrors {
  email?: string;
  password?: string;
}

export interface LoginResult {
  success: boolean;
  user?: any;
  session?: any;
  error?: string;
  errors?: LoginValidationErrors;
}

export interface UseLoginReturn {
  handleLogin: (email: string, password: string, redirectPath?: string) => Promise<LoginResult>;
  isLoading: boolean;
  error: string | null;
  validationErrors: LoginValidationErrors;
  clearErrors: () => void;
  validateEmail: (email: string) => boolean;
}
