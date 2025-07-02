
// src/hooks/bookmarks/useBookmarkManager.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BookmarkManager, Bookmark, BookmarkCategory, BookmarkManagerConfig } from '../../lib/bookmarks/BookmarkManager';

/**
 * Enhanced Bookmark Manager Hook - Phase 3
 * 
 * React hook for managing bookmarks with real-time synchronization,
 * search capabilities, and state management.
 */

export interface UseBookmarkManagerConfig extends Partial<BookmarkManagerConfig> {
  trackId?: string;
  enableRealTimeSync?: boolean;
  enableLocalStorage?: boolean;
}

export interface BookmarkManagerState {
  bookmarks: Bookmark[];
  categories: BookmarkCategory[];
  isLoading: boolean;
  error: string | null;
  syncStatus: 'idle' | 'syncing' | 'success' | 'error';
  stats: {
    totalBookmarks: number;
    bookmarksByCategory: Record<string, number>;
    bookmarksByTrack: Record<string, number>;
    recentActivity: number;
    syncQueueSize: number;
  } | null;
}

export interface BookmarkManagerActions {
  createBookmark: (
    trackId: string,
    timestamp: number,
    title: string,
    options?: {
      description?: string;
      tags?: string[];
      category?: string;
      isPublic?: boolean;
    }
  ) => Promise<Bookmark>;
  updateBookmark: (
    bookmarkId: string,
    updates: Partial<Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>>
  ) => Promise<Bookmark>;
  deleteBookmark: (bookmarkId: string) => Promise<void>;
  searchBookmarks: (query: string, filters?: any) => Bookmark[];
  getTrackBookmarks: (trackId: string) => Bookmark[];
  exportBookmarks: (format?: 'json' | 'csv' | 'xml') => string;
  importBookmarks: (data: string, format?: 'json' | 'csv') => Promise<number>;
  createCategory: (name: string, color: string, icon: string, description?: string) => Promise<BookmarkCategory>;
  refreshData: () => void;
  clearError: () => void;
}

export function useBookmarkManager(
  config: UseBookmarkManagerConfig = {}
): [BookmarkManagerState, BookmarkManagerActions] {
  const managerRef = useRef<BookmarkManager | null>(null);
  const [state, setState] = useState<BookmarkManagerState>({
    bookmarks: [],
    categories: [],
    isLoading: true,
    error: null,
    syncStatus: 'idle',
    stats: null
  });

  // Initialize bookmark manager
  useEffect(() => {
    const manager = new BookmarkManager({
      enableSync: config.enableRealTimeSync ?? true,
      enableCollaboration: false,
      enableAnalytics: true,
      autoSave: true,
      syncInterval: 30000,
      maxBookmarks: 1000,
      enableOfflineMode: true,
      enableExport: true,
      ...config
    });

    managerRef.current = manager;

    // Setup event listeners
    const handleBookmarkCreated = ({ bookmark }: { bookmark: Bookmark }) => {
      setState(prev => ({
        ...prev,
        bookmarks: [...prev.bookmarks, bookmark].sort((a, b) => a.timestamp - b.timestamp)
      }));
      updateStats();
    };

    const handleBookmarkUpdated = ({ bookmark }: { bookmark: Bookmark }) => {
      setState(prev => ({
        ...prev,
        bookmarks: prev.bookmarks.map(b => b.id === bookmark.id ? bookmark : b)
      }));
      updateStats();
    };

    const handleBookmarkDeleted = ({ bookmark }: { bookmark: Bookmark }) => {
      setState(prev => ({
        ...prev,
        bookmarks: prev.bookmarks.filter(b => b.id !== bookmark.id)
      }));
      updateStats();
    };

    const handleCategoryCreated = ({ category }: { category: BookmarkCategory }) => {
      setState(prev => ({
        ...prev,
        categories: [...prev.categories, category].sort((a, b) => a.name.localeCompare(b.name))
      }));
    };

    const handleSyncStarted = () => {
      setState(prev => ({ ...prev, syncStatus: 'syncing' }));
    };

    const handleSyncCompleted = () => {
      setState(prev => ({ ...prev, syncStatus: 'success' }));
      setTimeout(() => {
        setState(prev => ({ ...prev, syncStatus: 'idle' }));
      }, 2000);
    };

    const handleSyncFailed = ({ error }: { error: any }) => {
      setState(prev => ({ 
        ...prev, 
        syncStatus: 'error',
        error: `Sync failed: ${error.message || 'Unknown error'}`
      }));
    };

    const handleNetworkStatusChanged = ({ isOnline }: { isOnline: boolean }) => {
      if (!isOnline) {
        setState(prev => ({ ...prev, error: 'You are offline. Changes will sync when connection is restored.' }));
      } else {
        setState(prev => ({ ...prev, error: null }));
      }
    };

    // Register event listeners
    manager.on('bookmarkCreated', handleBookmarkCreated);
    manager.on('bookmarkUpdated', handleBookmarkUpdated);
    manager.on('bookmarkDeleted', handleBookmarkDeleted);
    manager.on('categoryCreated', handleCategoryCreated);
    manager.on('syncStarted', handleSyncStarted);
    manager.on('syncCompleted', handleSyncCompleted);
    manager.on('syncFailed', handleSyncFailed);
    manager.on('networkStatusChanged', handleNetworkStatusChanged);

    // Load initial data
    loadInitialData();

    return () => {
      // Cleanup
      manager.off('bookmarkCreated', handleBookmarkCreated);
      manager.off('bookmarkUpdated', handleBookmarkUpdated);
      manager.off('bookmarkDeleted', handleBookmarkDeleted);
      manager.off('categoryCreated', handleCategoryCreated);
      manager.off('syncStarted', handleSyncStarted);
      manager.off('syncCompleted', handleSyncCompleted);
      manager.off('syncFailed', handleSyncFailed);
      manager.off('networkStatusChanged', handleNetworkStatusChanged);
      manager.cleanup();
    };
  }, []);

  // Load initial data
  const loadInitialData = useCallback(async () => {
    if (!managerRef.current) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Load from local storage if enabled
      if (config.enableLocalStorage) {
        await loadFromLocalStorage();
      }

      // Load categories
      const categories = managerRef.current.getCategories();
      
      // Load bookmarks (filtered by track if specified)
      const bookmarks = config.trackId 
        ? managerRef.current.getTrackBookmarks(config.trackId)
        : managerRef.current.searchBookmarks();

      setState(prev => ({
        ...prev,
        bookmarks,
        categories,
        isLoading: false
      }));

      updateStats();

    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to load bookmarks'
      }));
    }
  }, [config.trackId, config.enableLocalStorage]);

  // Load from local storage
  const loadFromLocalStorage = useCallback(async () => {
    if (!config.enableLocalStorage || typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem('bookmarks-data');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.bookmarks && managerRef.current) {
          await managerRef.current.importBookmarks(JSON.stringify(data), 'json');
        }
      }
    } catch (error) {
      console.warn('Failed to load bookmarks from local storage:', error);
    }
  }, [config.enableLocalStorage]);

  // Save to local storage
  const saveToLocalStorage = useCallback(() => {
    if (!config.enableLocalStorage || typeof window === 'undefined' || !managerRef.current) return;

    try {
      const data = managerRef.current.exportBookmarks('json');
      localStorage.setItem('bookmarks-data', data);
    } catch (error) {
      console.warn('Failed to save bookmarks to local storage:', error);
    }
  }, [config.enableLocalStorage]);

  // Update statistics
  const updateStats = useCallback(() => {
    if (!managerRef.current) return;

    const stats = managerRef.current.getStats();
    setState(prev => ({ ...prev, stats }));
  }, []);

  // Save to local storage when bookmarks change
  useEffect(() => {
    if (state.bookmarks.length > 0) {
      saveToLocalStorage();
    }
  }, [state.bookmarks, saveToLocalStorage]);

  // Actions
  const createBookmark = useCallback(async (
    trackId: string,
    timestamp: number,
    title: string,
    options: {
      description?: string;
      tags?: string[];
      category?: string;
      isPublic?: boolean;
    } = {}
  ): Promise<Bookmark> => {
    if (!managerRef.current) {
      throw new Error('Bookmark manager not initialized');
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const bookmark = await managerRef.current.createBookmark(trackId, timestamp, title, options);
      return bookmark;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create bookmark';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const updateBookmark = useCallback(async (
    bookmarkId: string,
    updates: Partial<Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Bookmark> => {
    if (!managerRef.current) {
      throw new Error('Bookmark manager not initialized');
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const bookmark = await managerRef.current.updateBookmark(bookmarkId, updates);
      return bookmark;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update bookmark';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const deleteBookmark = useCallback(async (bookmarkId: string): Promise<void> => {
    if (!managerRef.current) {
      throw new Error('Bookmark manager not initialized');
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      await managerRef.current.deleteBookmark(bookmarkId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete bookmark';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const searchBookmarks = useCallback((query: string, filters: any = {}): Bookmark[] => {
    if (!managerRef.current) return [];

    return managerRef.current.searchBookmarks({
      query,
      ...filters
    });
  }, []);

  const getTrackBookmarks = useCallback((trackId: string): Bookmark[] => {
    if (!managerRef.current) return [];

    return managerRef.current.getTrackBookmarks(trackId);
  }, []);

  const exportBookmarks = useCallback((format: 'json' | 'csv' | 'xml' = 'json'): string => {
    if (!managerRef.current) return '';

    return managerRef.current.exportBookmarks(format);
  }, []);

  const importBookmarks = useCallback(async (data: string, format: 'json' | 'csv' = 'json'): Promise<number> => {
    if (!managerRef.current) {
      throw new Error('Bookmark manager not initialized');
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const count = await managerRef.current.importBookmarks(data, format);
      loadInitialData(); // Refresh data after import
      return count;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import bookmarks';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, [loadInitialData]);

  const createCategory = useCallback(async (
    name: string,
    color: string,
    icon: string,
    description?: string
  ): Promise<BookmarkCategory> => {
    if (!managerRef.current) {
      throw new Error('Bookmark manager not initialized');
    }

    setState(prev => ({ ...prev, error: null }));

    try {
      const category = await managerRef.current.createCategory(name, color, icon, description);
      return category;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create category';
      setState(prev => ({ ...prev, error: errorMessage }));
      throw error;
    }
  }, []);

  const refreshData = useCallback(() => {
    loadInitialData();
  }, [loadInitialData]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const actions: BookmarkManagerActions = {
    createBookmark,
    updateBookmark,
    deleteBookmark,
    searchBookmarks,
    getTrackBookmarks,
    exportBookmarks,
    importBookmarks,
    createCategory,
    refreshData,
    clearError
  };

  return [state, actions];
}

export default useBookmarkManager;
