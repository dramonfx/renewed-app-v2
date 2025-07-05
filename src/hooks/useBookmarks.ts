// src/hooks/useBookmarks.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export interface Bookmark {
  id: string;
  time: number;
  label?: string;
  trackId?: string;
  trackTitle?: string;
  createdAt: string;
  sectionSlug?: string;
}

export interface UseBookmarksOptions {
  mode: 'single' | 'full';
  trackId?: string;
  maxBookmarks?: number;
}

export interface UseBookmarksReturn {
  bookmarks: Bookmark[];
  saveBookmark: (time: number, label?: string, sectionSlug?: string) => void;
  jumpToBookmark: (bookmark: Bookmark) => void;
  deleteBookmark: (bookmarkId: string) => void;
  clearBookmarks: () => void;
  canSaveBookmark: boolean;
}

/**
 * Clean Bookmark Hook - Professional Implementation
 * 
 * Features:
 * - Direct Next.js router navigation for cross-section bookmarks
 * - localStorage persistence
 * - Mode-aware bookmark limits (1 for single, 2 for full)
 * - Clean error handling
 * - Professional code structure
 */
export function useBookmarks(
  options: UseBookmarksOptions,
  onJumpToTime?: (time: number) => void
): UseBookmarksReturn {
  const { mode, trackId, maxBookmarks = mode === 'single' ? 1 : 2 } = options;
  const router = useRouter();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  // Generate storage key based on mode and track
  const storageKey = mode === 'single' && trackId 
    ? `bookmarks-single-${trackId}`
    : 'bookmarks-full';

  // Load bookmarks from localStorage
  const loadBookmarks = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setBookmarks(Array.isArray(parsed) ? parsed : []);
      } else {
        setBookmarks([]);
      }
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      setBookmarks([]);
    }
  }, [storageKey]);

  // Save bookmarks to localStorage
  const saveBookmarksToStorage = useCallback((bookmarksToSave: Bookmark[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(bookmarksToSave));
    } catch (error) {
      console.error('Error saving bookmarks:', error);
    }
  }, [storageKey]);

  // Load bookmarks on mount and when storage key changes
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  // Save a new bookmark
  const saveBookmark = useCallback((time: number, label?: string, sectionSlug?: string) => {
    const newBookmark: Bookmark = {
      id: `bookmark-${Date.now()}`,
      time,
      label: label || `Bookmark at ${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`,
      trackId,
      sectionSlug,
      createdAt: new Date().toISOString(),
    };

    setBookmarks(prev => {
      let updatedBookmarks = [...prev];
      
      // For single mode, replace existing bookmark
      if (mode === 'single') {
        updatedBookmarks = [newBookmark];
      } else {
        // For full mode, add new bookmark and keep only maxBookmarks
        updatedBookmarks.push(newBookmark);
        if (updatedBookmarks.length > maxBookmarks) {
          // Remove oldest bookmark
          updatedBookmarks = updatedBookmarks
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, maxBookmarks);
        }
      }
      
      saveBookmarksToStorage(updatedBookmarks);
      return updatedBookmarks;
    });
  }, [mode, maxBookmarks, trackId, saveBookmarksToStorage]);

  // Jump to bookmark with cross-section navigation
  const jumpToBookmark = useCallback((bookmark: Bookmark) => {
    try {
      // If bookmark has a section slug, check if we need to navigate
      if (bookmark.sectionSlug) {
        const currentPath = window.location.pathname;
        const targetPath = `/book/${bookmark.sectionSlug}`;
        
        if (currentPath !== targetPath) {
          // Store the timestamp in sessionStorage for pickup after navigation
          sessionStorage.setItem('pendingBookmarkTime', bookmark.time.toString());
          
          // Navigate to the correct section
          router.push(targetPath);
          
          // For App Router, we'll use a different approach to detect navigation completion
          // The audio player will check for pendingBookmarkTime on mount/section change
          return;
        }
      }
      
      // If we're on the same section or no section specified, just jump to time
      if (onJumpToTime) {
        onJumpToTime(bookmark.time);
      }
    } catch (error) {
      console.error('Error jumping to bookmark:', error);
      // Fallback to time jump if navigation fails
      if (onJumpToTime) {
        onJumpToTime(bookmark.time);
      }
    }
  }, [router, onJumpToTime]);

  // Delete a specific bookmark
  const deleteBookmark = useCallback((bookmarkId: string) => {
    setBookmarks(prev => {
      const updated = prev.filter(bookmark => bookmark.id !== bookmarkId);
      saveBookmarksToStorage(updated);
      return updated;
    });
  }, [saveBookmarksToStorage]);

  // Clear all bookmarks
  const clearBookmarks = useCallback(() => {
    setBookmarks([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Check if we can save a new bookmark
  const canSaveBookmark = mode === 'single' || bookmarks.length < maxBookmarks;

  return {
    bookmarks,
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,
  };
}
