// src/types/bookmark.ts

/**
 * Clean TypeScript interfaces for bookmark data structures
 */

export interface BookmarkData {
  id: string;
  time: number;
  label?: string;
  trackId?: string;
  trackTitle?: string;
  sectionSlug?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface BookmarkStorage {
  version: string;
  bookmarks: BookmarkData[];
  lastUpdated: string;
}

export interface BookmarkConfig {
  mode: 'single' | 'full';
  maxBookmarks: number;
  enableCrossSectionNavigation: boolean;
  enablePersistence: boolean;
}

export interface BookmarkEvents {
  onBookmarkSaved: (bookmark: BookmarkData) => void;
  onBookmarkDeleted: (bookmarkId: string) => void;
  onBookmarkJumped: (bookmark: BookmarkData) => void;
  onBookmarksCleared: () => void;
}

export type BookmarkMode = 'single' | 'full';

export interface BookmarkMetadata {
  totalBookmarks: number;
  lastBookmarkTime?: number;
  mostRecentBookmark?: BookmarkData;
  oldestBookmark?: BookmarkData;
}
