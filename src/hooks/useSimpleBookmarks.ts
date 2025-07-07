
// src/hooks/useSimpleBookmarks.ts
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface SimpleBookmark {
  id: string;
  time: number;
  label?: string;
  trackId?: string;
  trackTitle?: string;
  createdAt: string;
}

export interface UseSimpleBookmarksOptions {
  mode: 'single' | 'full';
  trackId?: string;
  maxBookmarks?: number;
}

export interface UseSimpleBookmarksReturn {
  bookmarks: SimpleBookmark[];
  saveBookmark: (time: number, label?: string) => void;
  jumpToBookmark: (bookmark: SimpleBookmark) => void;
  deleteBookmark: (bookmarkId: string) => void;
  clearBookmarks: () => void;
  canSaveBookmark: boolean;
}

/**
 * Simple Bookmark Hook - Clean Implementation
 * 
 * Requirements:
 * - Single Player: 1 bookmark per chapter
 * - Full Player: 2 bookmarks max
 * - Simple "Resume from X:XX" functionality
 * - Persistence between sessions
 */
export function useSimpleBookmarks(
  options: UseSimpleBookmarksOptions,
  onJumpToTime?: (time: number) => void
): UseSimpleBookmarksReturn {
  const { mode, trackId, maxBookmarks = mode === 'single' ? 1 : 2 } = options;
  
  const [bookmarks, setBookmarks] = useState<SimpleBookmark[]>([]);

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
  const saveBookmarksToStorage = useCallback((bookmarksToSave: SimpleBookmark[]) => {
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
  const saveBookmark = useCallback((time: number, label?: string) => {
    const newBookmark: SimpleBookmark = {
      id: `bookmark-${Date.now()}`,
      time,
      label: label || `Bookmark at ${Math.floor(time / 60)}:${String(Math.floor(time % 60)).padStart(2, '0')}`,
      trackId,
      createdAt: new Date().toISOString(),
    };

    setBookmarks(prev => {
      let updatedBookmarks = [...prev];
      
      // For single mode, replace existing bookmark
      if (mode === 'single') {
        updatedBookmarks = [newBookmark];
      } else {
        // For full mode, enforce per-track limits (up to maxBookmarks per track)
        if (trackId) {
          // Get existing bookmarks for this specific track
          const trackBookmarks = updatedBookmarks.filter(b => b.trackId === trackId);
          const otherBookmarks = updatedBookmarks.filter(b => b.trackId !== trackId);
          
          // Add new bookmark to this track's bookmarks
          const newTrackBookmarks = [...trackBookmarks, newBookmark];
          
          // Keep only maxBookmarks for this track (remove oldest if needed)
          const limitedTrackBookmarks = newTrackBookmarks.length > maxBookmarks
            ? newTrackBookmarks
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, maxBookmarks)
            : newTrackBookmarks;
          
          // Combine with bookmarks from other tracks
          updatedBookmarks = [...otherBookmarks, ...limitedTrackBookmarks];
        } else {
          // Fallback to old behavior if no trackId
          updatedBookmarks.push(newBookmark);
          if (updatedBookmarks.length > maxBookmarks) {
            updatedBookmarks = updatedBookmarks
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, maxBookmarks);
          }
        }
      }
      
      saveBookmarksToStorage(updatedBookmarks);
      return updatedBookmarks;
    });
  }, [mode, maxBookmarks, trackId, saveBookmarksToStorage]);

  // Jump to bookmark
  const jumpToBookmark = useCallback((bookmark: SimpleBookmark) => {
    if (onJumpToTime) {
      onJumpToTime(bookmark.time);
    }
  }, [onJumpToTime]);

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
  const canSaveBookmark = useMemo(() => {
    if (mode === 'single') {
      return true; // Single mode always allows saving (replaces existing)
    }
    
    // For full mode, check per-track limits
    if (trackId) {
      const trackBookmarks = bookmarks.filter(b => b.trackId === trackId);
      return trackBookmarks.length < maxBookmarks;
    }
    
    // Fallback to global limit if no trackId
    return bookmarks.length < maxBookmarks;
  }, [mode, trackId, bookmarks, maxBookmarks]);

  return {
    bookmarks,
    saveBookmark,
    jumpToBookmark,
    deleteBookmark,
    clearBookmarks,
    canSaveBookmark,
  };
}
