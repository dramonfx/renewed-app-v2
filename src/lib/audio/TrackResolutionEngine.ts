
// src/lib/audio/TrackResolutionEngine.ts
'use client';

/**
 * Track Resolution Engine - Phase 5.1 Foundation
 * 
 * Core engine for resolving track references and managing cross-section navigation.
 * Handles track lookup, validation, loading preparation, and resolution state management.
 */

import { TrackRegistry, TrackMetadata, TrackResolutionResult, getTrackRegistry } from './TrackRegistry';
import { AudioCacheManager, getAudioCache } from './CachingFramework';
import { TrackWithUrl, CrossTrackNavigationError } from '../../types/audio';

// === RESOLUTION ENGINE TYPES ===

export interface ResolutionEngineConfig {
  maxConcurrentResolutions: number;
  resolutionTimeout: number;
  retryAttempts: number;
  enableCaching: boolean;
  enableAnalytics: boolean;
  fallbackToApi: boolean;
}

export interface ResolutionContext {
  requestId: string;
  trackSlug: string;
  sectionSlug?: string;
  priority: 'low' | 'normal' | 'high';
  timeout: number;
  retryCount: number;
  startTime: number;
}

export interface ResolutionResult {
  success: boolean;
  track?: TrackWithUrl;
  error?: CrossTrackNavigationError;
  loadTime: number;
  method: 'cache' | 'registry' | 'api';
  fromCache: boolean;
}

export interface ResolutionStats {
  totalRequests: number;
  successfulResolutions: number;
  failedResolutions: number;
  averageLoadTime: number;
  cacheHitRate: number;
  timeoutCount: number;
  retryCount: number;
}

// === RESOLUTION ENGINE ===

export class TrackResolutionEngine {
  private registry: TrackRegistry;
  private cache: AudioCacheManager;
  private config: ResolutionEngineConfig;
  private activeResolutions: Map<string, ResolutionContext> = new Map();
  private stats: ResolutionStats;
  private resolutionQueue: ResolutionContext[] = [];
  private processingQueue: boolean = false;

  constructor(config: Partial<ResolutionEngineConfig> = {}) {
    this.config = {
      maxConcurrentResolutions: 3,
      resolutionTimeout: 30000, // 30 seconds
      retryAttempts: 2,
      enableCaching: true,
      enableAnalytics: true,
      fallbackToApi: true,
      ...config
    };

    this.registry = getTrackRegistry();
    this.cache = getAudioCache();
    
    this.stats = {
      totalRequests: 0,
      successfulResolutions: 0,
      failedResolutions: 0,
      averageLoadTime: 0,
      cacheHitRate: 0,
      timeoutCount: 0,
      retryCount: 0
    };
  }

  // === CORE RESOLUTION METHODS ===

  async resolveTrack(trackSlug: string, priority: 'low' | 'normal' | 'high' = 'normal'): Promise<ResolutionResult> {
    const requestId = this._generateRequestId();
    const startTime = performance.now();

    this.stats.totalRequests++;

    try {
      // Check cache first if enabled
      if (this.config.enableCaching) {
        const cachedTrack = this._getCachedTrack(trackSlug);
        if (cachedTrack) {
          this.stats.successfulResolutions++;
          this.stats.cacheHitRate = (this.stats.cacheHitRate * (this.stats.totalRequests - 1) + 1) / this.stats.totalRequests;
          
          return {
            success: true,
            track: cachedTrack,
            loadTime: performance.now() - startTime,
            method: 'cache',
            fromCache: true
          };
        }
      }

      // Create resolution context
      const context: ResolutionContext = {
        requestId,
        trackSlug,
        priority,
        timeout: this.config.resolutionTimeout,
        retryCount: 0,
        startTime
      };

      // Add to queue or process immediately
      if (this.activeResolutions.size >= this.config.maxConcurrentResolutions) {
        this.resolutionQueue.push(context);
        await this._waitForQueueProcessing(context);
      } else {
        await this._processResolution(context);
      }

      const result = await this._executeResolution(context);
      this._updateStats(result);
      
      return result;

    } catch (error) {
      this.stats.failedResolutions++;
      const loadTime = performance.now() - startTime;
      
      return {
        success: false,
        error: this._createResolutionError('REGISTRY_ERROR', trackSlug, error),
        loadTime,
        method: 'registry',
        fromCache: false
      };
    }
  }

  async resolveBatch(trackSlugs: string[], priority: 'low' | 'normal' | 'high' = 'normal'): Promise<ResolutionResult[]> {
    const promises = trackSlugs.map(slug => this.resolveTrack(slug, priority));
    return Promise.all(promises);
  }

  async resolveBySection(sectionSlug: string): Promise<TrackWithUrl[]> {
    try {
      await this.registry.initialize();
      const sectionTracks = await this.registry.resolveTracksBySection(sectionSlug);
      
      const resolutionPromises = sectionTracks.map(metadata => 
        this.resolveTrack(metadata.slug, 'normal')
      );
      
      const results = await Promise.all(resolutionPromises);
      
      return results
        .filter(result => result.success && result.track)
        .map(result => result.track!)
        .sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error(`Failed to resolve tracks for section ${sectionSlug}:`, error);
      return [];
    }
  }

  // === VALIDATION METHODS ===

  async validateTrackReference(trackSlug: string): Promise<boolean> {
    try {
      const result = await this.registry.resolveTrack(trackSlug);
      return result.found;
    } catch {
      return false;
    }
  }

  async validateBatchReferences(trackSlugs: string[]): Promise<{ [slug: string]: boolean }> {
    const results: { [slug: string]: boolean } = {};
    
    const validationPromises = trackSlugs.map(async slug => {
      results[slug] = await this.validateTrackReference(slug);
    });
    
    await Promise.all(validationPromises);
    return results;
  }

  // === QUEUE MANAGEMENT ===

  async _processResolution(context: ResolutionContext): Promise<void> {
    this.activeResolutions.set(context.requestId, context);
    
    try {
      await this._executeResolution(context);
    } finally {
      this.activeResolutions.delete(context.requestId);
      this._processNextInQueue();
    }
  }

  private _processNextInQueue(): void {
    if (this.resolutionQueue.length === 0 || this.processingQueue) return;
    
    if (this.activeResolutions.size < this.config.maxConcurrentResolutions) {
      const nextContext = this.resolutionQueue.shift();
      if (nextContext) {
        this._processResolution(nextContext);
      }
    }
  }

  private async _waitForQueueProcessing(context: ResolutionContext): Promise<void> {
    return new Promise((resolve) => {
      const checkQueue = () => {
        if (!this.resolutionQueue.includes(context)) {
          resolve();
        } else {
          setTimeout(checkQueue, 100);
        }
      };
      checkQueue();
    });
  }

  // === RESOLUTION EXECUTION ===

  private async _executeResolution(context: ResolutionContext): Promise<ResolutionResult> {
    const startTime = performance.now();
    
    try {
      // Try registry resolution first
      const registryResult = await this._resolveFromRegistry(context);
      if (registryResult.success) {
        return registryResult;
      }

      // Fallback to API if enabled and registry failed
      if (this.config.fallbackToApi) {
        const apiResult = await this._resolveFromApi(context);
        if (apiResult.success) {
          return apiResult;
        }
      }

      // All methods failed
      return {
        success: false,
        error: this._createResolutionError('TRACK_NOT_FOUND', context.trackSlug),
        loadTime: performance.now() - startTime,
        method: 'registry',
        fromCache: false
      };

    } catch (error) {
      return {
        success: false,
        error: this._createResolutionError('REGISTRY_ERROR', context.trackSlug, error),
        loadTime: performance.now() - startTime,
        method: 'registry',
        fromCache: false
      };
    }
  }

  private async _resolveFromRegistry(context: ResolutionContext): Promise<ResolutionResult> {
    const startTime = performance.now();
    
    try {
      await this.registry.initialize();
      const result = await this.registry.resolveTrack(context.trackSlug);
      
      if (!result.found || !result.entry) {
        return {
          success: false,
          error: this._createResolutionError('TRACK_NOT_FOUND', context.trackSlug),
          loadTime: performance.now() - startTime,
          method: 'registry',
          fromCache: false
        };
      }

      const track = this._convertMetadataToTrackWithUrl(result.entry.metadata);
      
      // Cache the result if caching is enabled
      if (this.config.enableCaching) {
        this.cache.setTrackMetadata(context.trackSlug, result.entry.metadata, ['resolved']);
      }

      return {
        success: true,
        track,
        loadTime: performance.now() - startTime,
        method: 'registry',
        fromCache: false
      };

    } catch (error) {
      return {
        success: false,
        error: this._createResolutionError('REGISTRY_ERROR', context.trackSlug, error),
        loadTime: performance.now() - startTime,
        method: 'registry',
        fromCache: false
      };
    }
  }

  private async _resolveFromApi(context: ResolutionContext): Promise<ResolutionResult> {
    const startTime = performance.now();
    
    try {
      const response = await fetch(`/api/audio-tracks?slug=${encodeURIComponent(context.trackSlug)}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        return {
          success: false,
          error: this._createResolutionError('TRACK_NOT_FOUND', context.trackSlug),
          loadTime: performance.now() - startTime,
          method: 'api',
          fromCache: false
        };
      }

      const trackData = data.tracks?.find((t: any) => t.slug === context.trackSlug);
      if (!trackData) {
        return {
          success: false,
          error: this._createResolutionError('TRACK_NOT_FOUND', context.trackSlug),
          loadTime: performance.now() - startTime,
          method: 'api',
          fromCache: false
        };
      }

      const track = this._convertApiDataToTrackWithUrl(trackData);
      
      // Cache the result if caching is enabled
      if (this.config.enableCaching) {
        const metadata = this._convertApiDataToMetadata(trackData);
        this.cache.setTrackMetadata(context.trackSlug, metadata, ['api-resolved']);
      }

      return {
        success: true,
        track,
        loadTime: performance.now() - startTime,
        method: 'api',
        fromCache: false
      };

    } catch (error) {
      return {
        success: false,
        error: this._createResolutionError('REGISTRY_ERROR', context.trackSlug, error),
        loadTime: performance.now() - startTime,
        method: 'api',
        fromCache: false
      };
    }
  }

  // === HELPER METHODS ===

  private _getCachedTrack(trackSlug: string): TrackWithUrl | null {
    if (!this.config.enableCaching) return null;
    
    const metadata = this.cache.getTrackMetadata(trackSlug);
    return metadata ? this._convertMetadataToTrackWithUrl(metadata) : null;
  }

  private _convertMetadataToTrackWithUrl(metadata: TrackMetadata): TrackWithUrl {
    return {
      id: metadata.id,
      title: metadata.title,
      slug: metadata.slug,
      audioUrl: metadata.audioUrl || '',
      sectionSlug: metadata.sectionSlug,
      sectionTitle: metadata.sectionTitle,
      duration: metadata.audioDuration,
      order: metadata.order
    };
  }

  private _convertApiDataToTrackWithUrl(data: any): TrackWithUrl {
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      audioUrl: data.audioUrl || data.audio_url || '',
      sectionSlug: data.sectionSlug || data.section_slug,
      sectionTitle: data.sectionTitle || data.section_title,
      duration: data.audioDuration || data.audio_duration,
      order: data.order || data.order_index || 0
    };
  }

  private _convertApiDataToMetadata(data: any): TrackMetadata {
    return {
      id: data.id,
      slug: data.slug,
      title: data.title,
      sectionSlug: data.sectionSlug || data.section_slug || 'unknown',
      sectionTitle: data.sectionTitle || data.section_title || data.title,
      audioUrl: data.audioUrl || data.audio_url,
      audioDuration: data.audioDuration || data.audio_duration,
      order: data.order || data.order_index || 0,
      isPublished: data.isPublished ?? data.is_published ?? true,
      lastUpdated: data.updated_at || data.updatedAt || new Date().toISOString()
    };
  }

  private _createResolutionError(
    code: 'TRACK_NOT_FOUND' | 'SECTION_NOT_LOADED' | 'LOADING_TIMEOUT' | 'REGISTRY_ERROR',
    trackSlug: string,
    originalError?: any
  ): CrossTrackNavigationError {
    const error = new Error() as CrossTrackNavigationError;
    error.code = code;
    error.trackSlug = trackSlug;
    error.context = originalError;
    
    switch (code) {
      case 'TRACK_NOT_FOUND':
        error.message = `Track not found: ${trackSlug}`;
        break;
      case 'SECTION_NOT_LOADED':
        error.message = `Section not loaded for track: ${trackSlug}`;
        break;
      case 'LOADING_TIMEOUT':
        error.message = `Timeout loading track: ${trackSlug}`;
        break;
      case 'REGISTRY_ERROR':
        error.message = `Registry error for track: ${trackSlug}`;
        break;
    }
    
    return error;
  }

  private _generateRequestId(): string {
    return `resolution-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private _updateStats(result: ResolutionResult): void {
    if (result.success) {
      this.stats.successfulResolutions++;
    } else {
      this.stats.failedResolutions++;
    }

    // Update average load time
    const totalResolutions = this.stats.successfulResolutions + this.stats.failedResolutions;
    this.stats.averageLoadTime = (
      (this.stats.averageLoadTime * (totalResolutions - 1)) + result.loadTime
    ) / totalResolutions;
  }

  // === ANALYTICS AND MONITORING ===

  getStats(): ResolutionStats {
    return { ...this.stats };
  }

  getActiveResolutions(): ResolutionContext[] {
    return Array.from(this.activeResolutions.values());
  }

  getQueueLength(): number {
    return this.resolutionQueue.length;
  }

  // === CLEANUP ===

  cancelAllResolutions(): void {
    this.activeResolutions.clear();
    this.resolutionQueue.length = 0;
  }

  destroy(): void {
    this.cancelAllResolutions();
  }
}

// === SINGLETON INSTANCE ===

let engineInstance: TrackResolutionEngine | null = null;

export function getTrackResolutionEngine(config?: Partial<ResolutionEngineConfig>): TrackResolutionEngine {
  if (!engineInstance) {
    engineInstance = new TrackResolutionEngine(config);
  }
  return engineInstance;
}

export function resetTrackResolutionEngine(): void {
  if (engineInstance) {
    engineInstance.destroy();
    engineInstance = null;
  }
}

export default TrackResolutionEngine;
