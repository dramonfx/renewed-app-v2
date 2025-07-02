
// src/lib/audio/TrackRegistry.ts
'use client';

/**
 * TrackRegistry Service - Phase 5.1 Foundation
 * 
 * Core service for managing track metadata, resolution, and cross-section navigation.
 * Provides the foundation for cross-track bookmark navigation by maintaining a
 * comprehensive registry of all available tracks across sections.
 */

import { EnhancedTrack } from './CoreAudioEngine';

// === REGISTRY TYPES ===

export interface TrackMetadata {
  id: string;
  slug: string;
  title: string;
  sectionSlug: string;
  sectionTitle: string;
  audioUrl?: string;
  audioDuration?: number;
  order: number;
  isPublished: boolean;
  lastUpdated: string;
}

export interface TrackRegistryEntry {
  metadata: TrackMetadata;
  isLoaded: boolean;
  loadedTrack?: EnhancedTrack;
  loadingState: 'idle' | 'loading' | 'loaded' | 'error';
  lastAccessed: string;
  error?: string;
}

export interface TrackResolutionResult {
  found: boolean;
  entry?: TrackRegistryEntry;
  requiresLoading: boolean;
  sectionSlug?: string;
  error?: string;
}

export interface TrackRegistryConfig {
  cacheSize: number;
  autoPreload: boolean;
  enableAnalytics: boolean;
  persistToStorage: boolean;
}

// === REGISTRY SERVICE ===

export class TrackRegistry {
  private registry: Map<string, TrackRegistryEntry> = new Map();
  private sectionIndex: Map<string, string[]> = new Map(); // sectionSlug -> trackSlugs[]
  private config: TrackRegistryConfig;
  private isInitialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  
  constructor(config: Partial<TrackRegistryConfig> = {}) {
    this.config = {
      cacheSize: 100,
      autoPreload: false,
      enableAnalytics: true,
      persistToStorage: true,
      ...config
    };
  }

  // === INITIALIZATION ===

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initializationPromise) return this.initializationPromise;

    this.initializationPromise = this._performInitialization();
    await this.initializationPromise;
    this.isInitialized = true;
  }

  private async _performInitialization(): Promise<void> {
    try {
      console.log('📚 Initializing TrackRegistry...');
      
      // Load track metadata from API
      const response = await fetch('/api/audio-tracks');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to load track metadata');
      }

      if (!data.success || !data.tracks) {
        throw new Error('Invalid API response format');
      }

      // Build registry from API data
      this._buildRegistryFromApiData(data.tracks);
      
      // Load from local storage if enabled
      if (this.config.persistToStorage) {
        this._loadFromStorage();
      }

      console.log(`✅ TrackRegistry initialized with ${this.registry.size} tracks`);
    } catch (error) {
      console.error('❌ TrackRegistry initialization failed:', error);
      throw error;
    }
  }

  private _buildRegistryFromApiData(tracks: any[]): void {
    tracks.forEach(track => {
      const metadata: TrackMetadata = {
        id: track.id,
        slug: track.slug,
        title: track.title,
        sectionSlug: track.sectionSlug || track.section_slug || 'unknown',
        sectionTitle: track.sectionTitle || track.section_title || track.title,
        audioUrl: track.audioUrl || track.audio_url,
        audioDuration: track.audioDuration || track.audio_duration,
        order: track.order || track.order_index || 0,
        isPublished: track.isPublished ?? track.is_published ?? true,
        lastUpdated: track.updated_at || track.updatedAt || new Date().toISOString()
      };

      const entry: TrackRegistryEntry = {
        metadata,
        isLoaded: false,
        loadingState: 'idle',
        lastAccessed: new Date().toISOString()
      };

      this.registry.set(track.slug, entry);
      
      // Build section index
      const sectionTracks = this.sectionIndex.get(metadata.sectionSlug) || [];
      sectionTracks.push(track.slug);
      this.sectionIndex.set(metadata.sectionSlug, sectionTracks);
    });
  }

  // === TRACK RESOLUTION ===

  async resolveTrack(trackSlug: string): Promise<TrackResolutionResult> {
    await this.initialize();

    const entry = this.registry.get(trackSlug);
    
    if (!entry) {
      return {
        found: false,
        requiresLoading: false,
        error: `Track not found: ${trackSlug}`
      };
    }

    // Update last accessed time
    entry.lastAccessed = new Date().toISOString();

    return {
      found: true,
      entry,
      requiresLoading: !entry.isLoaded,
      sectionSlug: entry.metadata.sectionSlug
    };
  }

  async resolveTracksBySection(sectionSlug: string): Promise<TrackMetadata[]> {
    await this.initialize();

    const trackSlugs = this.sectionIndex.get(sectionSlug) || [];
    const tracks: TrackMetadata[] = [];

    trackSlugs.forEach(slug => {
      const entry = this.registry.get(slug);
      if (entry) {
        tracks.push(entry.metadata);
      }
    });

    // Sort by order
    return tracks.sort((a, b) => a.order - b.order);
  }

  // === TRACK LOADING PREPARATION ===

  async prepareTrackForLoading(trackSlug: string): Promise<TrackMetadata | null> {
    const result = await this.resolveTrack(trackSlug);
    
    if (!result.found || !result.entry) {
      return null;
    }

    const entry = result.entry;
    entry.loadingState = 'loading';
    
    return entry.metadata;
  }

  markTrackAsLoaded(trackSlug: string, loadedTrack: EnhancedTrack): void {
    const entry = this.registry.get(trackSlug);
    if (entry) {
      entry.isLoaded = true;
      entry.loadedTrack = loadedTrack;
      entry.loadingState = 'loaded';
      entry.lastAccessed = new Date().toISOString();
    }
  }

  markTrackAsError(trackSlug: string, error: string): void {
    const entry = this.registry.get(trackSlug);
    if (entry) {
      entry.loadingState = 'error';
      entry.error = error;
    }
  }

  // === REGISTRY QUERIES ===

  getAllTracks(): TrackMetadata[] {
    return Array.from(this.registry.values())
      .map(entry => entry.metadata)
      .sort((a, b) => a.order - b.order);
  }

  getTracksBySections(sectionSlugs: string[]): TrackMetadata[] {
    const tracks: TrackMetadata[] = [];
    
    sectionSlugs.forEach(sectionSlug => {
      const sectionTracks = this.sectionIndex.get(sectionSlug) || [];
      sectionTracks.forEach(trackSlug => {
        const entry = this.registry.get(trackSlug);
        if (entry) {
          tracks.push(entry.metadata);
        }
      });
    });

    return tracks.sort((a, b) => a.order - b.order);
  }

  getLoadedTracks(): EnhancedTrack[] {
    return Array.from(this.registry.values())
      .filter(entry => entry.isLoaded && entry.loadedTrack)
      .map(entry => entry.loadedTrack!);
  }

  // === SECTION QUERIES ===

  getAllSections(): string[] {
    return Array.from(this.sectionIndex.keys());
  }

  getSectionTrackCount(sectionSlug: string): number {
    return this.sectionIndex.get(sectionSlug)?.length || 0;
  }

  // === CACHE MANAGEMENT ===

  clearCache(): void {
    this.registry.forEach(entry => {
      entry.isLoaded = false;
      entry.loadedTrack = undefined;
      entry.loadingState = 'idle';
      delete entry.error;
    });
  }

  optimizeCache(): void {
    if (this.registry.size <= this.config.cacheSize) return;

    // Get entries sorted by last accessed (oldest first)
    const entries = Array.from(this.registry.entries())
      .filter(([_, entry]) => entry.isLoaded)
      .sort(([_, a], [__, b]) => 
        new Date(a.lastAccessed).getTime() - new Date(b.lastAccessed).getTime()
      );

    // Remove oldest loaded tracks until we're under the cache size
    const toRemove = entries.length - this.config.cacheSize;
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      const entryPair = entries[i];
      if (entryPair) {
        const [slug, entry] = entryPair;
        entry.isLoaded = false;
        entry.loadedTrack = undefined;
        entry.loadingState = 'idle';
      }
    }
  }

  // === STORAGE PERSISTENCE ===

  private _loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('track-registry-cache');
      if (!stored) return;

      const data = JSON.parse(stored);
      
      // Only restore metadata and loading states, not actual loaded tracks
      Object.entries(data).forEach(([slug, storedEntry]: [string, any]) => {
        const entry = this.registry.get(slug);
        if (entry && storedEntry.lastAccessed) {
          entry.lastAccessed = storedEntry.lastAccessed;
        }
      });
    } catch (error) {
      console.warn('Failed to load TrackRegistry from storage:', error);
    }
  }

  private _saveToStorage(): void {
    if (!this.config.persistToStorage) return;

    try {
      const dataToStore: Record<string, any> = {};
      
      this.registry.forEach((entry, slug) => {
        dataToStore[slug] = {
          lastAccessed: entry.lastAccessed,
          loadingState: entry.loadingState
        };
      });

      localStorage.setItem('track-registry-cache', JSON.stringify(dataToStore));
    } catch (error) {
      console.warn('Failed to save TrackRegistry to storage:', error);
    }
  }

  // === CLEANUP ===

  destroy(): void {
    if (this.config.persistToStorage) {
      this._saveToStorage();
    }
    this.registry.clear();
    this.sectionIndex.clear();
    this.isInitialized = false;
    this.initializationPromise = null;
  }
}

// === SINGLETON INSTANCE ===

let registryInstance: TrackRegistry | null = null;

export function getTrackRegistry(config?: Partial<TrackRegistryConfig>): TrackRegistry {
  if (!registryInstance) {
    registryInstance = new TrackRegistry(config);
  }
  return registryInstance;
}

export function resetTrackRegistry(): void {
  if (registryInstance) {
    registryInstance.destroy();
    registryInstance = null;
  }
}

export default TrackRegistry;
