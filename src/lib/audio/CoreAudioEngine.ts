// src/lib/audio/CoreAudioEngine.ts
'use client';

/**
 * Core Audio Engine - Phase 2 Enhancement
 * 
 * Advanced audio processing and management system that extends the existing
 * useAudioPlayer hook with intelligent buffering, performance optimization,
 * and enhanced error handling capabilities.
 */

export interface AudioEngineConfig {
  // Buffering settings
  bufferAhead: number; // seconds to buffer ahead
  preloadNextTrack: boolean;
  adaptiveBuffering: boolean;
  
  // Performance settings
  memoryManagement: boolean;
  performanceMonitoring: boolean;
  errorRetryAttempts: number;
  
  // Analytics settings
  trackListening: boolean;
  trackPerformance: boolean;
  
  // Audio settings
  crossfadeDuration: number; // ms
  gaplessPlayback: boolean;
  audioQualityOptimization: boolean;
}

export interface AudioEngineStats {
  bufferHealth: number; // 0-100%
  loadingSpeed: number; // kbps
  errorCount: number;
  totalPlayTime: number; // seconds
  averageLoadTime: number; // ms
  memoryUsage: number; // MB
}

export interface AudioSource {
  url: string;
  format: string;
  quality: 'low' | 'medium' | 'high';
  size: number; // bytes
  duration: number; // seconds
}

export interface EnhancedTrack {
  id: string;
  title: string;
  slug: string;
  sources: AudioSource[];
  metadata?: {
    artist?: string;
    album?: string;
    year?: number;
    genre?: string;
    bitrate?: number;
  };
  preloaded: boolean;
  bufferProgress: number; // 0-100%
  loadError?: string;
}

export class CoreAudioEngine {
  private config: AudioEngineConfig;
  private stats: AudioEngineStats;
  private audioCache: Map<string, ArrayBuffer> = new Map();
  private preloadPromises: Map<string, Promise<void>> = new Map();
  private performanceObserver?: PerformanceObserver;
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<AudioEngineConfig> = {}) {
    this.config = {
      bufferAhead: 30,
      preloadNextTrack: true,
      adaptiveBuffering: true,
      memoryManagement: true,
      performanceMonitoring: true,
      errorRetryAttempts: 3,
      trackListening: true,
      trackPerformance: true,
      crossfadeDuration: 1000,
      gaplessPlayback: true,
      audioQualityOptimization: true,
      ...config
    };

    this.stats = {
      bufferHealth: 100,
      loadingSpeed: 0,
      errorCount: 0,
      totalPlayTime: 0,
      averageLoadTime: 0,
      memoryUsage: 0
    };

    this.initializePerformanceMonitoring();
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (!this.config.performanceMonitoring || typeof window === 'undefined') return;

    try {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('audio-load')) {
            this.updateLoadTimeStats(entry.duration);
          }
        });
      });

      this.performanceObserver.observe({ entryTypes: ['measure'] });
    } catch (error) {
      console.warn('Performance monitoring not available:', error);
    }
  }

  /**
   * Detect optimal audio format for current browser
   */
  public detectOptimalFormat(sources: AudioSource[]): AudioSource | null {
    if (!sources.length) return null;

    const audio = new Audio();
    const supportedFormats = sources.filter(source => {
      const canPlay = audio.canPlayType(this.getMimeType(source.format));
      return canPlay === 'probably' || canPlay === 'maybe';
    });

    if (!supportedFormats.length) return sources[0] || null; // Fallback to first source

    // Prefer higher quality if available
    return supportedFormats.reduce((best, current) => {
      const qualityScore = this.getQualityScore(current.quality);
      const bestScore = this.getQualityScore(best.quality);
      return qualityScore > bestScore ? current : best;
    });
  }

  /**
   * Get MIME type for audio format
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'ogg': 'audio/ogg',
      'aac': 'audio/aac',
      'flac': 'audio/flac',
      'm4a': 'audio/mp4'
    };
    return mimeTypes[format.toLowerCase()] || 'audio/*';
  }

  /**
   * Get quality score for comparison
   */
  private getQualityScore(quality: string): number {
    const scores = { low: 1, medium: 2, high: 3 };
    return scores[quality as keyof typeof scores] || 1;
  }

  /**
   * Intelligent preloading with network awareness
   */
  public async preloadAudio(track: EnhancedTrack): Promise<void> {
    if (track.preloaded || this.preloadPromises.has(track.id)) {
      return this.preloadPromises.get(track.id) || Promise.resolve();
    }

    const optimalSource = this.detectOptimalFormat(track.sources);
    if (!optimalSource) {
      throw new Error(`No compatible audio source found for track: ${track.title}`);
    }

    const preloadPromise = this.performPreload(track, optimalSource);
    this.preloadPromises.set(track.id, preloadPromise);

    return preloadPromise;
  }

  /**
   * Perform actual preloading with progress tracking
   */
  private async performPreload(track: EnhancedTrack, source: AudioSource): Promise<void> {
    const startTime = performance.now();
    performance.mark(`audio-load-start-${track.id}`);

    try {
      // Check if already cached
      if (this.audioCache.has(track.id)) {
        track.preloaded = true;
        track.bufferProgress = 100;
        return;
      }

      // Fetch with progress tracking
      const response = await fetch(source.url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio: ${response.status}`);
      }

      const contentLength = parseInt(response.headers.get('Content-Length') || '0');
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body reader available');

      const chunks: Uint8Array[] = [];

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        chunks.push(value);
        loaded += value.length;

        // Update progress
        if (contentLength > 0) {
          track.bufferProgress = Math.round((loaded / contentLength) * 100);
          this.emit('bufferProgress', { trackId: track.id, progress: track.bufferProgress });
        }
      }

      // Combine chunks
      const arrayBuffer = new ArrayBuffer(loaded);
      const uint8Array = new Uint8Array(arrayBuffer);
      let offset = 0;
      for (const chunk of chunks) {
        uint8Array.set(chunk, offset);
        offset += chunk.length;
      }

      // Cache the audio data
      this.audioCache.set(track.id, arrayBuffer);
      track.preloaded = true;
      track.bufferProgress = 100;

      // Performance tracking
      const endTime = performance.now();
      performance.mark(`audio-load-end-${track.id}`);
      performance.measure(`audio-load-${track.id}`, `audio-load-start-${track.id}`, `audio-load-end-${track.id}`);

      this.updateLoadTimeStats(endTime - startTime);
      this.emit('preloadComplete', { trackId: track.id, loadTime: endTime - startTime });

    } catch (error) {
      track.loadError = error instanceof Error ? error.message : 'Unknown preload error';
      this.stats.errorCount++;
      this.emit('preloadError', { trackId: track.id, error: track.loadError });
      throw error;
    }
  }

  /**
   * Smart buffer management with adaptive strategies
   */
  public async manageBuffer(currentTrack: EnhancedTrack, nextTrack?: EnhancedTrack): Promise<void> {
    // Preload current track if not already loaded
    if (!currentTrack.preloaded) {
      await this.preloadAudio(currentTrack);
    }

    // Preload next track if enabled and available
    if (this.config.preloadNextTrack && nextTrack && !nextTrack.preloaded) {
      // Non-blocking preload
      this.preloadAudio(nextTrack).catch(error => {
        console.warn('Next track preload failed:', error);
      });
    }

    // Memory management
    if (this.config.memoryManagement) {
      this.performMemoryCleanup();
    }
  }

  /**
   * Memory cleanup to prevent memory leaks
   */
  private performMemoryCleanup(): void {
    const maxCacheSize = 50 * 1024 * 1024; // 50MB limit
    let currentSize = 0;

    // Calculate current cache size
    for (const buffer of this.audioCache.values()) {
      currentSize += buffer.byteLength;
    }

    // Clean up if over limit
    if (currentSize > maxCacheSize) {
      const entries = Array.from(this.audioCache.entries());
      const sortedEntries = entries.sort((a, b) => b[1].byteLength - a[1].byteLength);

      // Remove largest entries until under limit
      while (currentSize > maxCacheSize && sortedEntries.length > 0) {
        const [trackId, buffer] = sortedEntries.shift()!;
        currentSize -= buffer.byteLength;
        this.audioCache.delete(trackId);
        this.emit('cacheCleanup', { trackId, freedBytes: buffer.byteLength });
      }
    }

    this.stats.memoryUsage = currentSize / (1024 * 1024); // Convert to MB
  }

  /**
   * Update loading time statistics
   */
  private updateLoadTimeStats(loadTime: number): void {
    const currentAvg = this.stats.averageLoadTime;
    const count = this.stats.errorCount + 1; // Approximate load count
    this.stats.averageLoadTime = (currentAvg * (count - 1) + loadTime) / count;
  }

  /**
   * Get cached audio blob URL for a track
   */
  public getCachedAudioUrl(trackId: string): string | null {
    const buffer = this.audioCache.get(trackId);
    if (!buffer) return null;

    const blob = new Blob([buffer], { type: 'audio/mpeg' });
    return URL.createObjectURL(blob);
  }

  /**
   * Event system for engine notifications
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
   * Get current engine statistics
   */
  public getStats(): AudioEngineStats {
    return { ...this.stats };
  }

  /**
   * Update engine configuration
   */
  public updateConfig(newConfig: Partial<AudioEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Cleanup engine resources
   */
  public cleanup(): void {
    // Clear caches
    this.audioCache.clear();
    this.preloadPromises.clear();

    // Cleanup performance observer
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
    }

    // Clear event listeners
    this.eventListeners.clear();
  }
}

export default CoreAudioEngine;