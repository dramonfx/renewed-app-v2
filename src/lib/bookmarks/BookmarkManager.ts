// src/lib/bookmarks/BookmarkManager.ts
'use client';

/**
 * Bookmark Manager - Phase 3 Core System
 * 
 * Advanced bookmark management system with real-time synchronization,
 * search capabilities, and collaborative features.
 */

export interface Bookmark {
  id: string;
  trackId: string;
  timestamp: number;
  title: string;
  description?: string;
  tags: string[];
  category: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  metadata?: {
    trackTitle?: string;
    trackArtist?: string;
    trackDuration?: number;
    waveformData?: number[];
    thumbnailUrl?: string;
  };
}

export interface BookmarkCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  isDefault: boolean;
  createdAt: Date;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  bookmarks: string[]; // bookmark IDs
  isPublic: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  collaborators?: string[];
}

export interface BookmarkSearchOptions {
  query?: string;
  tags?: string[];
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  trackId?: string;
  userId?: string;
  isPublic?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'timestamp' | 'title';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface BookmarkManagerConfig {
  enableSync: boolean;
  enableCollaboration: boolean;
  enableAnalytics: boolean;
  autoSave: boolean;
  syncInterval: number; // ms
  maxBookmarks: number;
  enableOfflineMode: boolean;
  enableExport: boolean;
}

export class BookmarkManager {
  private config: BookmarkManagerConfig;
  private bookmarks: Map<string, Bookmark> = new Map();
  private categories: Map<string, BookmarkCategory> = new Map();
  private collections: Map<string, BookmarkCollection> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();
  private syncQueue: Set<string> = new Set();
  private isOnline: boolean = true;
  private syncTimer?: NodeJS.Timeout;

  constructor(config: Partial<BookmarkManagerConfig> = {}) {
    this.config = {
      enableSync: true,
      enableCollaboration: false,
      enableAnalytics: true,
      autoSave: true,
      syncInterval: 30000, // 30 seconds
      maxBookmarks: 1000,
      enableOfflineMode: true,
      enableExport: true,
      ...config
    };

    this.initializeDefaultCategories();
    this.setupNetworkMonitoring();
    
    if (this.config.enableSync) {
      this.startSyncTimer();
    }
  }

  /**
   * Initialize default bookmark categories
   */
  private initializeDefaultCategories(): void {
    const defaultCategories: BookmarkCategory[] = [
      {
        id: 'favorites',
        name: 'Favorites',
        color: '#ef4444',
        icon: '❤️',
        description: 'Your favorite moments',
        isDefault: true,
        createdAt: new Date()
      },
      {
        id: 'important',
        name: 'Important',
        color: '#f59e0b',
        icon: '⭐',
        description: 'Important sections',
        isDefault: true,
        createdAt: new Date()
      },
      {
        id: 'notes',
        name: 'Notes',
        color: '#3b82f6',
        icon: '📝',
        description: 'Personal notes',
        isDefault: true,
        createdAt: new Date()
      },
      {
        id: 'share',
        name: 'To Share',
        color: '#10b981',
        icon: '🔗',
        description: 'Moments to share',
        isDefault: true,
        createdAt: new Date()
      }
    ];

    defaultCategories.forEach(category => {
      this.categories.set(category.id, category);
    });
  }

  /**
   * Setup network monitoring for offline support
   */
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    this.isOnline = navigator.onLine;

    window.addEventListener('online', () => {
      this.isOnline = true;
      this.emit('networkStatusChanged', { isOnline: true });
      this.processSyncQueue();
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.emit('networkStatusChanged', { isOnline: false });
    });
  }

  /**
   * Start automatic sync timer
   */
  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      if (this.isOnline && this.syncQueue.size > 0) {
        this.processSyncQueue();
      }
    }, this.config.syncInterval);
  }

  /**
   * Create a new bookmark
   */
  public async createBookmark(
    trackId: string,
    timestamp: number,
    title: string,
    options: {
      description?: string;
      tags?: string[];
      category?: string;
      isPublic?: boolean;
      metadata?: Bookmark['metadata'];
    } = {}
  ): Promise<Bookmark> {
    if (this.bookmarks.size >= this.config.maxBookmarks) {
      throw new Error(`Maximum bookmark limit (${this.config.maxBookmarks}) reached`);
    }

    const bookmark: Bookmark = {
      id: this.generateId(),
      trackId,
      timestamp,
      title,
      description: options.description,
      tags: options.tags || [],
      category: options.category || 'notes',
      isPublic: options.isPublic || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata: options.metadata
    };

    this.bookmarks.set(bookmark.id, bookmark);
    
    if (this.config.autoSave) {
      this.queueForSync(bookmark.id);
    }

    this.emit('bookmarkCreated', { bookmark });
    return bookmark;
  }

  /**
   * Update an existing bookmark
   */
  public async updateBookmark(
    bookmarkId: string,
    updates: Partial<Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Bookmark> {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (!bookmark) {
      throw new Error(`Bookmark ${bookmarkId} not found`);
    }

    const updatedBookmark: Bookmark = {
      ...bookmark,
      ...updates,
      updatedAt: new Date()
    };

    this.bookmarks.set(bookmarkId, updatedBookmark);
    
    if (this.config.autoSave) {
      this.queueForSync(bookmarkId);
    }

    this.emit('bookmarkUpdated', { bookmark: updatedBookmark, previousBookmark: bookmark });
    return updatedBookmark;
  }

  /**
   * Delete a bookmark
   */
  public async deleteBookmark(bookmarkId: string): Promise<void> {
    const bookmark = this.bookmarks.get(bookmarkId);
    if (!bookmark) {
      throw new Error(`Bookmark ${bookmarkId} not found`);
    }

    this.bookmarks.delete(bookmarkId);
    
    if (this.config.autoSave) {
      this.queueForSync(bookmarkId, 'delete');
    }

    this.emit('bookmarkDeleted', { bookmark });
  }

  /**
   * Get bookmark by ID
   */
  public getBookmark(bookmarkId: string): Bookmark | null {
    return this.bookmarks.get(bookmarkId) || null;
  }

  /**
   * Get all bookmarks for a track
   */
  public getTrackBookmarks(trackId: string): Bookmark[] {
    return Array.from(this.bookmarks.values())
      .filter(bookmark => bookmark.trackId === trackId)
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Search bookmarks with advanced filtering
   */
  public searchBookmarks(options: BookmarkSearchOptions = {}): Bookmark[] {
    let results = Array.from(this.bookmarks.values());

    // Filter by query (title, description, tags)
    if (options.query) {
      const query = options.query.toLowerCase();
      results = results.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query) ||
        bookmark.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by tags
    if (options.tags && options.tags.length > 0) {
      results = results.filter(bookmark =>
        options.tags!.some(tag => bookmark.tags.includes(tag))
      );
    }

    // Filter by categories
    if (options.categories && options.categories.length > 0) {
      results = results.filter(bookmark =>
        options.categories!.includes(bookmark.category)
      );
    }

    // Filter by date range
    if (options.dateRange) {
      results = results.filter(bookmark =>
        bookmark.createdAt >= options.dateRange!.start &&
        bookmark.createdAt <= options.dateRange!.end
      );
    }

    // Filter by track ID
    if (options.trackId) {
      results = results.filter(bookmark => bookmark.trackId === options.trackId);
    }

    // Filter by user ID
    if (options.userId) {
      results = results.filter(bookmark => bookmark.userId === options.userId);
    }

    // Filter by public status
    if (options.isPublic !== undefined) {
      results = results.filter(bookmark => bookmark.isPublic === options.isPublic);
    }

    // Sort results
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'desc';
    
    results.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
        case 'updatedAt':
          aValue = a[sortBy].getTime();
          bValue = b[sortBy].getTime();
          break;
        case 'timestamp':
          aValue = a.timestamp;
          bValue = b.timestamp;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Apply pagination
    if (options.offset || options.limit) {
      const start = options.offset || 0;
      const end = options.limit ? start + options.limit : undefined;
      results = results.slice(start, end);
    }

    return results;
  }

  /**
   * Create a new category
   */
  public async createCategory(
    name: string,
    color: string,
    icon: string,
    description?: string
  ): Promise<BookmarkCategory> {
    const category: BookmarkCategory = {
      id: this.generateId(),
      name,
      color,
      icon,
      description,
      isDefault: false,
      createdAt: new Date()
    };

    this.categories.set(category.id, category);
    this.emit('categoryCreated', { category });
    return category;
  }

  /**
   * Get all categories
   */
  public getCategories(): BookmarkCategory[] {
    return Array.from(this.categories.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Create a new collection
   */
  public async createCollection(
    name: string,
    description?: string,
    isPublic: boolean = false
  ): Promise<BookmarkCollection> {
    const collection: BookmarkCollection = {
      id: this.generateId(),
      name,
      description,
      bookmarks: [],
      isPublic,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      collaborators: []
    };

    this.collections.set(collection.id, collection);
    this.emit('collectionCreated', { collection });
    return collection;
  }

  /**
   * Add bookmark to collection
   */
  public async addToCollection(collectionId: string, bookmarkId: string): Promise<void> {
    const collection = this.collections.get(collectionId);
    if (!collection) {
      throw new Error(`Collection ${collectionId} not found`);
    }

    if (!this.bookmarks.has(bookmarkId)) {
      throw new Error(`Bookmark ${bookmarkId} not found`);
    }

    if (!collection.bookmarks.includes(bookmarkId)) {
      collection.bookmarks.push(bookmarkId);
      collection.updatedAt = new Date();
      this.emit('bookmarkAddedToCollection', { collection, bookmarkId });
    }
  }

  /**
   * Export bookmarks in various formats
   */
  public exportBookmarks(format: 'json' | 'csv' | 'xml' = 'json'): string {
    const bookmarks = Array.from(this.bookmarks.values());
    
    switch (format) {
      case 'json':
        return JSON.stringify({
          bookmarks,
          categories: Array.from(this.categories.values()),
          collections: Array.from(this.collections.values()),
          exportedAt: new Date().toISOString(),
          version: '1.0'
        }, null, 2);
        
      case 'csv':
        const headers = ['ID', 'Track ID', 'Timestamp', 'Title', 'Description', 'Tags', 'Category', 'Created At'];
        const rows = bookmarks.map(bookmark => [
          bookmark.id,
          bookmark.trackId,
          bookmark.timestamp.toString(),
          bookmark.title,
          bookmark.description || '',
          bookmark.tags.join(';'),
          bookmark.category,
          bookmark.createdAt.toISOString()
        ]);
        
        return [headers, ...rows].map(row => 
          row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');
        
      case 'xml':
        const xmlBookmarks = bookmarks.map(bookmark => `
    <bookmark>
      <id>${bookmark.id}</id>
      <trackId>${bookmark.trackId}</trackId>
      <timestamp>${bookmark.timestamp}</timestamp>
      <title><![CDATA[${bookmark.title}]]></title>
      <description><![CDATA[${bookmark.description || ''}]]></description>
      <tags>${bookmark.tags.map(tag => `<tag>${tag}</tag>`).join('')}</tags>
      <category>${bookmark.category}</category>
      <createdAt>${bookmark.createdAt.toISOString()}</createdAt>
    </bookmark>`).join('');
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<bookmarks>
  <exportedAt>${new Date().toISOString()}</exportedAt>
  <version>1.0</version>${xmlBookmarks}
</bookmarks>`;
        
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Import bookmarks from various formats
   */
  public async importBookmarks(data: string, format: 'json' | 'csv' = 'json'): Promise<number> {
    let importedCount = 0;
    
    try {
      switch (format) {
        case 'json':
          const jsonData = JSON.parse(data);
          if (jsonData.bookmarks && Array.isArray(jsonData.bookmarks)) {
            for (const bookmarkData of jsonData.bookmarks) {
              const bookmark: Bookmark = {
                ...bookmarkData,
                id: this.generateId(), // Generate new ID to avoid conflicts
                createdAt: new Date(bookmarkData.createdAt),
                updatedAt: new Date(bookmarkData.updatedAt || bookmarkData.createdAt)
              };
              
              this.bookmarks.set(bookmark.id, bookmark);
              importedCount++;
            }
          }
          break;
          
        case 'csv':
          const lines = data.split('\n');
          const headers = lines[0]?.split(',').map(h => h.replace(/"/g, '')) || [];
          
          for (let i = 1; i < lines.length; i++) {
            if (!lines[i]?.trim()) continue;
            
            const values = lines[i]?.split(',').map(v => v.replace(/"/g, '')) || [];
            const bookmark: Bookmark = {
              id: this.generateId(),
              trackId: values[1] || '',
              timestamp: parseFloat(values[2] || '0') || 0,
              title: values[3] || '',
              description: values[4] || undefined,
              tags: values[5] ? values[5].split(';') : [],
              category: values[6] || 'notes',
              isPublic: false,
              createdAt: new Date(values[7] || Date.now()),
              updatedAt: new Date()
            };
            
            this.bookmarks.set(bookmark.id, bookmark);
            importedCount++;
          }
          break;
          
        default:
          throw new Error(`Unsupported import format: ${format}`);
      }
      
      this.emit('bookmarksImported', { count: importedCount });
      return importedCount;
      
    } catch (error) {
      throw new Error(`Import failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Queue bookmark for synchronization
   */
  private queueForSync(bookmarkId: string, operation: 'create' | 'update' | 'delete' = 'update'): void {
    if (this.config.enableSync) {
      this.syncQueue.add(`${operation}:${bookmarkId}`);
    }
  }

  /**
   * Process synchronization queue
   */
  private async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.syncQueue.size === 0) return;

    const operations = Array.from(this.syncQueue);
    this.syncQueue.clear();

    try {
      // Here you would implement actual sync with your backend
      // For now, we'll just emit events
      this.emit('syncStarted', { operations });
      
      // Simulate sync delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.emit('syncCompleted', { operations });
    } catch (error) {
      // Re-queue failed operations
      operations.forEach(op => this.syncQueue.add(op));
      this.emit('syncFailed', { error, operations });
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `bookmark_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Event system
   */
  public on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(listener);
  }

  public off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  }

  /**
   * Get statistics
   */
  public getStats(): {
    totalBookmarks: number;
    bookmarksByCategory: Record<string, number>;
    bookmarksByTrack: Record<string, number>;
    recentActivity: number;
    syncQueueSize: number;
  } {
    const bookmarks = Array.from(this.bookmarks.values());
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);

    const bookmarksByCategory: Record<string, number> = {};
    const bookmarksByTrack: Record<string, number> = {};

    bookmarks.forEach(bookmark => {
      bookmarksByCategory[bookmark.category] = (bookmarksByCategory[bookmark.category] || 0) + 1;
      bookmarksByTrack[bookmark.trackId] = (bookmarksByTrack[bookmark.trackId] || 0) + 1;
    });

    const recentActivity = bookmarks.filter(bookmark => 
      bookmark.createdAt.getTime() > dayAgo || bookmark.updatedAt.getTime() > dayAgo
    ).length;

    return {
      totalBookmarks: bookmarks.length,
      bookmarksByCategory,
      bookmarksByTrack,
      recentActivity,
      syncQueueSize: this.syncQueue.size
    };
  }

  /**
   * Cleanup
   */
  public cleanup(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
    this.eventListeners.clear();
    this.syncQueue.clear();
  }
}

export default BookmarkManager;