// src/lib/audio/AudioBufferManager.ts
'use client';

import type { EnhancedTrack, AudioEngineConfig } from './CoreAudioEngine';

/**
 * Audio Buffer Manager - Smart Buffering System
 * 
 * Manages intelligent audio buffering with network awareness,
 * adaptive strategies, and performance optimization.
 */

export interface BufferStrategy {
  name: string;
  bufferAhead: number; // seconds
  preloadNext: boolean;
  aggressiveness: 'low' | 'medium' | 'high';
}

export interface NetworkCondition {
  type: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
  downlink: number; // Mbps
  effectiveType: string;
  rtt: number; // ms
}

export interface BufferState {
  buffered: TimeRanges | null;
  bufferHealth: number; // 0-100%
  isBuffering: boolean;
  bufferProgress: number; // 0-100%
  estimatedTotal: number; // seconds
}

export class AudioBufferManager {
  private config: AudioEngineConfig;
  private strategies: Map<string, BufferStrategy>;
  private currentStrategy: BufferStrategy;
  private networkInfo: NetworkCondition | null = null;
  private bufferStates: Map<string, BufferState> = new Map();

  constructor(config: AudioEngineConfig) {
    this.config = config;
    this.strategies = this.initializeStrategies();
    this.currentStrategy = this.strategies.get('balanced')!;
    this.initializeNetworkMonitoring();
  }

  /**
   * Initialize buffering strategies
   */
  private initializeStrategies(): Map<string, BufferStrategy> {
    const strategies = new Map<string, BufferStrategy>();

    strategies.set('conservative', {
      name: 'Conservative',
      bufferAhead: 10,
      preloadNext: false,
      aggressiveness: 'low'
    });

    strategies.set('balanced', {
      name: 'Balanced',
      bufferAhead: 30,
      preloadNext: true,
      aggressiveness: 'medium'
    });

    strategies.set('aggressive', {
      name: 'Aggressive',
      bufferAhead: 60,
      preloadNext: true,
      aggressiveness: 'high'
    });

    strategies.set('wifi-optimized', {
      name: 'WiFi Optimized',
      bufferAhead: 120,
      preloadNext: true,
      aggressiveness: 'high'
    });

    return strategies;
  }

  /**
   * Initialize network condition monitoring
   */
  private initializeNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    try {
      // @ts-ignore - Navigator connection API
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      
      if (connection) {
        this.updateNetworkCondition(connection);
        
        connection.addEventListener('change', () => {
          this.updateNetworkCondition(connection);
          this.adaptBufferingStrategy();
        });
      }
    } catch (error) {
      console.warn('Network monitoring not available:', error);
    }
  }

  /**
   * Update network condition information
   */
  private updateNetworkCondition(connection: any): void {
    this.networkInfo = {
      type: connection.type || 'unknown',
      downlink: connection.downlink || 0,
      effectiveType: connection.effectiveType || 'unknown',
      rtt: connection.rtt || 0
    };
  }

  /**
   * Adapt buffering strategy based on network conditions
   */
  private adaptBufferingStrategy(): void {
    if (!this.config.adaptiveBuffering || !this.networkInfo) return;

    let strategyName = 'balanced';

    // Determine strategy based on network condition
    if (this.networkInfo.effectiveType === 'slow-2g' || this.networkInfo.downlink < 0.5) {
      strategyName = 'conservative';
    } else if (this.networkInfo.effectiveType === '4g' || this.networkInfo.downlink > 5) {
      strategyName = 'aggressive';
    } else if (this.networkInfo.type === 'wifi') {
      strategyName = 'wifi-optimized';
    }

    const newStrategy = this.strategies.get(strategyName);
    if (newStrategy && newStrategy !== this.currentStrategy) {
      this.currentStrategy = newStrategy;
      console.log(`🔄 Switched to ${newStrategy.name} buffering strategy`);
    }
  }

  /**
   * Get optimal buffer ahead time for current conditions
   */
  public getOptimalBufferAhead(): number {
    return this.currentStrategy.bufferAhead;
  }

  /**
   * Check if next track should be preloaded
   */
  public shouldPreloadNext(): boolean {
    return this.currentStrategy.preloadNext;
  }

  /**
   * Monitor buffer health for an audio element
   */
  public monitorBufferHealth(trackId: string, audioElement: HTMLAudioElement): BufferState {
    const buffered = audioElement.buffered;
    const currentTime = audioElement.currentTime;
    const duration = audioElement.duration || 0;

    let bufferHealth = 100;
    let bufferProgress = 0;
    let bufferedAhead = 0;

    if (buffered.length > 0 && duration > 0) {
      // Find the buffered range that contains current time
      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i);
        const end = buffered.end(i);

        if (currentTime >= start && currentTime <= end) {
          bufferedAhead = end - currentTime;
          break;
        }
      }

      // Calculate buffer health (how much is buffered ahead)
      const optimalBuffer = this.getOptimalBufferAhead();
      bufferHealth = Math.min(100, (bufferedAhead / optimalBuffer) * 100);

      // Calculate overall buffer progress
      const totalBuffered = buffered.length > 0 ? buffered.end(buffered.length - 1) : 0;
      bufferProgress = (totalBuffered / duration) * 100;
    }

    const bufferState: BufferState = {
      buffered,
      bufferHealth,
      isBuffering: audioElement.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA,
      bufferProgress,
      estimatedTotal: duration
    };

    this.bufferStates.set(trackId, bufferState);
    return bufferState;
  }

  /**
   * Check if buffering is needed
   */
  public needsBuffering(trackId: string): boolean {
    const state = this.bufferStates.get(trackId);
    if (!state) return true;

    const healthThreshold = this.getBufferHealthThreshold();
    return state.bufferHealth < healthThreshold;
  }

  /**
   * Get buffer health threshold based on current strategy
   */
  private getBufferHealthThreshold(): number {
    switch (this.currentStrategy.aggressiveness) {
      case 'low': return 20;
      case 'medium': return 40;
      case 'high': return 60;
      default: return 40;
    }
  }

  /**
   * Estimate loading time for a track
   */
  public estimateLoadTime(trackSizeBytes: number): number {
    if (!this.networkInfo || this.networkInfo.downlink === 0) {
      return 5000; // Default 5 second estimate
    }

    const downloadSpeedBps = this.networkInfo.downlink * 1024 * 1024 / 8; // Convert Mbps to bytes/sec
    const estimatedTime = (trackSizeBytes / downloadSpeedBps) * 1000; // Convert to ms

    // Add RTT and safety margin
    return estimatedTime + this.networkInfo.rtt + 1000;
  }

  /**
   * Get current buffer state for a track
   */
  public getBufferState(trackId: string): BufferState | null {
    return this.bufferStates.get(trackId) || null;
  }

  /**
   * Get current network condition
   */
  public getNetworkCondition(): NetworkCondition | null {
    return this.networkInfo;
  }

  /**
   * Get current buffering strategy
   */
  public getCurrentStrategy(): BufferStrategy {
    return this.currentStrategy;
  }

  /**
   * Set buffering strategy manually
   */
  public setStrategy(strategyName: string): boolean {
    const strategy = this.strategies.get(strategyName);
    if (strategy) {
      this.currentStrategy = strategy;
      return true;
    }
    return false;
  }

  /**
   * Get available strategies
   */
  public getAvailableStrategies(): BufferStrategy[] {
    return Array.from(this.strategies.values());
  }

  /**
   * Manage buffer for current and next track
   */
  public async manageBuffer(currentTrack: any, nextTrack?: any): Promise<void> {
    // This method provides buffer management coordination
    // It could trigger preloading and buffer optimization strategies
    console.log('Managing buffer for tracks:', currentTrack?.id, nextTrack?.id);
  }

  /**
   * Clear buffer states
   */
  public clearBufferStates(): void {
    this.bufferStates.clear();
  }

  /**
   * Get buffer statistics
   */
  public getBufferStats(): {
    currentStrategy: string;
    networkType: string;
    downlink: number;
    averageBufferHealth: number;
  } {
    const states = Array.from(this.bufferStates.values());
    const averageBufferHealth = states.length > 0
      ? states.reduce((sum, state) => sum + state.bufferHealth, 0) / states.length
      : 100;

    return {
      currentStrategy: this.currentStrategy.name,
      networkType: this.networkInfo?.effectiveType || 'unknown',
      downlink: this.networkInfo?.downlink || 0,
      averageBufferHealth
    };
  }
}

export default AudioBufferManager;