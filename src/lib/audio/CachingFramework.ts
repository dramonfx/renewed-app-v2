
// src/lib/audio/CachingFramework.ts
'use client';

/**
 * Caching Framework - Phase 5.1 Foundation
 * 
 * Memory-efficient caching system for track metadata and audio assets.
 * Provides intelligent cache management with LRU eviction, persistence,
 * and performance optimization for cross-track navigation.
 */

import { TrackMetadata } from './TrackRegistry';
import { EnhancedTrack } from './CoreAudioEngine';

// === CACHE TYPES ===

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // bytes
  expiresAt?: number;
  tags?: string[];
}

export interface CacheStats {
  totalEntries: number;
  totalSize: number; // bytes
  hitRate: number; // percentage
  missRate: number; // percentage
  averageAccessTime: number; // ms
  oldestEntry: number; // timestamp
  newestEntry: number; // timestamp
}

export interface CacheConfig {
  maxSize: number; // max entries
  maxMemory: number; // max memory in bytes
  ttl: number; // time to live in ms
  enablePersistence: boolean;
  enableAnalytics: boolean;
  evictionStrategy: 'lru' | 'lfu' | 'ttl';
  compressionEnabled: boolean;
}

// === CACHE MANAGER ===

export class AudioCacheManager {
  private metadataCache: Map<string, CacheEntry<TrackMetadata>> = new Map();
  private trackCache: Map<string, CacheEntry<EnhancedTrack>> = new Map();
  private urlCache: Map<string, CacheEntry<string>> = new Map();
  
  private config: CacheConfig;
  private stats: CacheStats;
  private analyticsData: {
    hits: number;
    misses: number;
    totalRequests: number;
    averageResponseTime: number;
  };

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = {
      maxSize: 100,
      maxMemory: 50 * 1024 * 1024, // 50MB
      ttl: 30 * 60 * 1000, // 30 minutes
      enablePersistence: true,
      enableAnalytics: true,
      evictionStrategy: 'lru',
      compressionEnabled: false,
      ...config
    };

    this.stats = {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      averageAccessTime: 0,
      oldestEntry: Date.now(),
      newestEntry: Date.now()
    };

    this.analyticsData = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      averageResponseTime: 0
    };

    this._initializeFromStorage();
  }

  // === METADATA CACHING ===

  setTrackMetadata(key: string, metadata: TrackMetadata, tags?: string[]): void {
    const entry = this._createEntry(key, metadata, tags);
    this.metadataCache.set(key, entry);
    this._updateStats();
    this._enforceMemoryLimits();
    
    if (this.config.enablePersistence) {
      this._persistMetadataCache();
    }
  }

  getTrackMetadata(key: string): TrackMetadata | null {
    const startTime = performance.now();
    const entry = this.metadataCache.get(key);
    
    if (!entry) {
      this._recordMiss();
      return null;
    }

    if (this._isExpired(entry)) {
      this.metadataCache.delete(key);
      this._recordMiss();
      return null;
    }

    // Update access info
    entry.lastAccessed = Date.now();
    entry.accessCount++;
    
    this._recordHit();
    this._updateResponseTime(performance.now() - startTime);
    
    return entry.data;
  }

  // === TRACK CACHING ===

  setTrack(key: string, track: EnhancedTrack, tags?: string[]): void {
    const entry = this._createEntry(key, track, tags);
    this.trackCache.set(key, entry);
    this._updateStats();
    this._enforceMemoryLimits();
  }

  getTrack(key: string): EnhancedTrack | null {
    const startTime = performance.now();
    const entry = this.trackCache.get(key);
    
    if (!entry) {
      this._recordMiss();
      return null;
    }

    if (this._isExpired(entry)) {
      this.trackCache.delete(key);
      this._recordMiss();
      return null;
    }

    entry.lastAccessed = Date.now();
    entry.accessCount++;
    
    this._recordHit();
    this._updateResponseTime(performance.now() - startTime);
    
    return entry.data;
  }

  // === URL CACHING ===

  setAudioUrl(trackSlug: string, url: string, ttl?: number): void {
    const entry = this._createEntry(trackSlug, url);
    if (ttl) {
      entry.expiresAt = Date.now() + ttl;
    }
    this.urlCache.set(trackSlug, entry);
    this._updateStats();
  }

  getAudioUrl(trackSlug: string): string | null {
    const entry = this.urlCache.get(trackSlug);
    
    if (!entry) {
      this._recordMiss();
      return null;
    }

    if (this._isExpired(entry)) {
      this.urlCache.delete(trackSlug);
      this._recordMiss();
      return null;
    }

    entry.lastAccessed = Date.now();
    entry.accessCount++;
    
    this._recordHit();
    return entry.data;
  }

  // === CACHE OPERATIONS ===

  has(key: string, cacheType: 'metadata' | 'track' | 'url' = 'metadata'): boolean {
    const cache = this._getCache(cacheType);
    const entry = cache.get(key);
    return entry !== undefined && !this._isExpired(entry);
  }

  delete(key: string, cacheType: 'metadata' | 'track' | 'url' = 'metadata'): boolean {
    const cache = this._getCache(cacheType);
    const result = cache.delete(key);
    if (result) {
      this._updateStats();
    }
    return result;
  }

  clear(cacheType?: 'metadata' | 'track' | 'url'): void {
    if (cacheType) {
      this._getCache(cacheType).clear();
    } else {
      this.metadataCache.clear();
      this.trackCache.clear();
      this.urlCache.clear();
    }
    this._updateStats();
  }

  // === CACHE MANAGEMENT ===

  prune(): number {
    let removedCount = 0;
    const now = Date.now();
    
    // Remove expired entries
    [this.metadataCache, this.trackCache, this.urlCache].forEach(cache => {
      for (const [key, entry] of cache.entries()) {
        if (this._isExpired(entry)) {
          cache.delete(key);
          removedCount++;
        }
      }
    });

    this._updateStats();
    return removedCount;
  }

  optimize(): void {
    this.prune();
    this._enforceMemoryLimits();
    
    if (this.config.enablePersistence) {
      this._persistMetadataCache();
    }
  }

  // === ANALYTICS ===

  getStats(): CacheStats {
    this._updateStats();
    return { ...this.stats };
  }

  getAnalytics(): any {
    return {
      ...this.analyticsData,
      hitRate: this.stats.hitRate,
      missRate: this.stats.missRate,
      cacheEfficiency: this._calculateEfficiency(),
      memoryUsage: this._calculateMemoryUsage(),
      recommendations: this._generateRecommendations()
    };
  }

  resetAnalytics(): void {
    this.analyticsData = {
      hits: 0,
      misses: 0,
      totalRequests: 0,
      averageResponseTime: 0
    };
  }

  // === PRIVATE METHODS ===

  private _createEntry<T>(key: string, data: T, tags?: string[]): CacheEntry<T> {
    const now = Date.now();
    return {
      key,
      data,
      timestamp: now,
      lastAccessed: now,
      accessCount: 1,
      size: this._estimateSize(data),
      expiresAt: now + this.config.ttl,
      tags
    };
  }

  private _getCache(type: 'metadata' | 'track' | 'url'): Map<string, CacheEntry<any>> {
    switch (type) {
      case 'metadata': return this.metadataCache;
      case 'track': return this.trackCache;
      case 'url': return this.urlCache;
      default: return this.metadataCache;
    }
  }

  private _isExpired(entry: CacheEntry<any>): boolean {
    if (!entry.expiresAt) return false;
    return Date.now() > entry.expiresAt;
  }

  private _estimateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // rough estimate
    } catch {
      return 1024; // default size
    }
  }

  private _updateStats(): void {
    const allCaches = [this.metadataCache, this.trackCache, this.urlCache];
    
    this.stats.totalEntries = allCaches.reduce((sum, cache) => sum + cache.size, 0);
    this.stats.totalSize = this._calculateTotalSize();
    
    if (this.analyticsData.totalRequests > 0) {
      this.stats.hitRate = (this.analyticsData.hits / this.analyticsData.totalRequests) * 100;
      this.stats.missRate = (this.analyticsData.misses / this.analyticsData.totalRequests) * 100;
    }

    // Update oldest/newest entry times
    const allEntries: CacheEntry<any>[] = [];
    allCaches.forEach(cache => {
      for (const entry of cache.values()) {
        allEntries.push(entry as CacheEntry<any>);
      }
    });
    if (allEntries.length > 0) {
      this.stats.oldestEntry = Math.min(...allEntries.map(e => e.timestamp));
      this.stats.newestEntry = Math.max(...allEntries.map(e => e.timestamp));
    }
  }

  private _calculateTotalSize(): number {
    const allCaches = [this.metadataCache, this.trackCache, this.urlCache];
    return allCaches.reduce((total, cache) => {
      let cacheSize = 0;
      for (const entry of cache.values()) {
        cacheSize += (entry as CacheEntry<any>).size;
      }
      return total + cacheSize;
    }, 0);
  }

  private _enforceMemoryLimits(): void {
    // Check memory limit
    if (this.stats.totalSize > this.config.maxMemory) {
      this._evictByStrategy();
    }
    
    // Check entry count limit
    if (this.stats.totalEntries > this.config.maxSize) {
      this._evictByStrategy();
    }
  }

  private _evictByStrategy(): void {
    const allEntries = this._getAllEntriesWithCacheInfo();
    
    switch (this.config.evictionStrategy) {
      case 'lru':
        allEntries.sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);
        break;
      case 'lfu':
        allEntries.sort((a, b) => a.entry.accessCount - b.entry.accessCount);
        break;
      case 'ttl':
        allEntries.sort((a, b) => (a.entry.expiresAt || 0) - (b.entry.expiresAt || 0));
        break;
    }

    // Remove oldest entries until we're under limits
    const targetSize = Math.floor(this.config.maxSize * 0.8);
    const targetMemory = Math.floor(this.config.maxMemory * 0.8);
    
    for (const { entry, cache } of allEntries) {
      if (this.stats.totalEntries <= targetSize && this.stats.totalSize <= targetMemory) {
        break;
      }
      cache.delete(entry.key);
      this._updateStats();
    }
  }

  private _getAllEntriesWithCacheInfo(): Array<{ entry: CacheEntry<any>, cache: Map<string, CacheEntry<any>> }> {
    const result: Array<{ entry: CacheEntry<any>, cache: Map<string, CacheEntry<any>> }> = [];
    
    [this.metadataCache, this.trackCache, this.urlCache].forEach(cache => {
      for (const entry of cache.values()) {
        result.push({ entry: entry as CacheEntry<any>, cache });
      }
    });
    
    return result;
  }

  private _recordHit(): void {
    this.analyticsData.hits++;
    this.analyticsData.totalRequests++;
  }

  private _recordMiss(): void {
    this.analyticsData.misses++;
    this.analyticsData.totalRequests++;
  }

  private _updateResponseTime(time: number): void {
    const total = this.analyticsData.totalRequests;
    this.analyticsData.averageResponseTime = 
      ((this.analyticsData.averageResponseTime * (total - 1)) + time) / total;
  }

  private _calculateEfficiency(): number {
    if (this.analyticsData.totalRequests === 0) return 0;
    return (this.analyticsData.hits / this.analyticsData.totalRequests) * 100;
  }

  private _calculateMemoryUsage(): { used: number, available: number, percentage: number } {
    return {
      used: this.stats.totalSize,
      available: this.config.maxMemory,
      percentage: (this.stats.totalSize / this.config.maxMemory) * 100
    };
  }

  private _generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.stats.hitRate < 50) {
      recommendations.push('Consider increasing cache size or TTL for better hit rate');
    }
    
    if (this.stats.totalSize > this.config.maxMemory * 0.9) {
      recommendations.push('Memory usage is high, consider increasing max memory or reducing TTL');
    }
    
    if (this.analyticsData.averageResponseTime > 10) {
      recommendations.push('Average response time is high, consider optimizing cache access patterns');
    }
    
    return recommendations;
  }

  // === PERSISTENCE ===

  private _initializeFromStorage(): void {
    if (!this.config.enablePersistence) return;
    
    try {
      const stored = localStorage.getItem('audio-cache-metadata');
      if (stored) {
        const data = JSON.parse(stored);
        // Only restore metadata, not the actual cached objects
        Object.entries(data).forEach(([key, entryData]: [string, any]) => {
          if (entryData.metadata) {
            this.setTrackMetadata(key, entryData.metadata, entryData.tags);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  private _persistMetadataCache(): void {
    if (!this.config.enablePersistence) return;
    
    try {
      const dataToStore: Record<string, any> = {};
      
      this.metadataCache.forEach((entry, key) => {
        dataToStore[key] = {
          metadata: entry.data,
          tags: entry.tags,
          timestamp: entry.timestamp,
          lastAccessed: entry.lastAccessed
        };
      });
      
      localStorage.setItem('audio-cache-metadata', JSON.stringify(dataToStore));
    } catch (error) {
      console.warn('Failed to persist cache to storage:', error);
    }
  }

  // === CLEANUP ===

  destroy(): void {
    if (this.config.enablePersistence) {
      this._persistMetadataCache();
    }
    
    this.metadataCache.clear();
    this.trackCache.clear();
    this.urlCache.clear();
  }
}

// === SINGLETON INSTANCE ===

let cacheInstance: AudioCacheManager | null = null;

export function getAudioCache(config?: Partial<CacheConfig>): AudioCacheManager {
  if (!cacheInstance) {
    cacheInstance = new AudioCacheManager(config);
  }
  return cacheInstance;
}

export function resetAudioCache(): void {
  if (cacheInstance) {
    cacheInstance.destroy();
    cacheInstance = null;
  }
}

export default AudioCacheManager;
