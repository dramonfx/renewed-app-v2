// src/lib/audio/AudioAnalytics.ts
'use client';

/**
 * Audio Analytics System - Performance Monitoring & Usage Tracking
 *
 * Comprehensive analytics system for tracking audio player performance,
 * user behavior, and system health with privacy-focused data collection.
 */

export interface AnalyticsConfig {
  enabled: boolean;
  trackPerformance: boolean;
  trackUserBehavior: boolean;
  trackErrors: boolean;
  batchSize: number;
  flushInterval: number; // ms
  maxRetries: number;
  endpoint?: string;
  apiKey?: string;
}

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  type: 'load_time' | 'buffer_health' | 'error_rate' | 'memory_usage' | 'network_speed';
  value: number;
  metadata?: Record<string, any>;
}

export interface UserBehaviorEvent {
  id: string;
  timestamp: number;
  type: 'play' | 'pause' | 'skip' | 'seek' | 'volume_change' | 'track_complete';
  trackId?: string;
  duration?: number;
  position?: number;
  metadata?: Record<string, any>;
}

export interface ErrorEvent {
  id: string;
  timestamp: number;
  type: 'network' | 'decode' | 'playback' | 'system';
  message: string;
  stack?: string;
  trackId?: string;
  userAgent: string;
  metadata?: Record<string, any>;
}

export interface AnalyticsSession {
  sessionId: string;
  startTime: number;
  endTime?: number;
  totalTracks: number;
  totalPlayTime: number;
  averageLoadTime: number;
  errorCount: number;
  userAgent: string;
  networkType?: string;
}

export class AudioAnalytics {
  private config: AnalyticsConfig;
  private session: AnalyticsSession;
  private performanceMetrics: PerformanceMetric[] = [];
  private userBehaviorEvents: UserBehaviorEvent[] = [];
  private errorEvents: ErrorEvent[] = [];
  private flushTimer?: NodeJS.Timeout;
  private retryQueue: any[] = [];

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = {
      enabled: true,
      trackPerformance: true,
      trackUserBehavior: true,
      trackErrors: true,
      batchSize: 50,
      flushInterval: 30000, // 30 seconds
      maxRetries: 3,
      ...config,
    };

    this.session = this.initializeSession();

    if (this.config.enabled) {
      this.startFlushTimer();
      this.setupUnloadHandler();
    }
  }

  /**
   * Initialize analytics session
   */
  private initializeSession(): AnalyticsSession {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      totalTracks: 0,
      totalPlayTime: 0,
      averageLoadTime: 0,
      errorCount: 0,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown',
      networkType: this.getNetworkType(),
    };
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get network type information
   */
  private getNetworkType(): string | undefined {
    if (typeof navigator === 'undefined') return undefined;

    try {
      // Navigator connection API - cast to any for browser compatibility
      const nav = navigator as any;
      const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
      return connection?.effectiveType || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  /**
   * Track performance metric
   */
  public trackPerformance(
    type: PerformanceMetric['type'],
    value: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enabled || !this.config.trackPerformance) return;

    const metric: PerformanceMetric = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type,
      value,
      metadata,
    };

    this.performanceMetrics.push(metric);
    this.checkFlushConditions();
  }

  /**
   * Track user behavior event
   */
  public trackUserBehavior(
    type: UserBehaviorEvent['type'],
    trackId?: string,
    duration?: number,
    position?: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enabled || !this.config.trackUserBehavior) return;

    const event: UserBehaviorEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type,
      trackId,
      duration,
      position,
      metadata,
    };

    this.userBehaviorEvents.push(event);

    // Update session stats
    if (type === 'play') {
      this.session.totalTracks++;
    }
    if (type === 'track_complete' && duration) {
      this.session.totalPlayTime += duration;
    }

    this.checkFlushConditions();
  }

  /**
   * Track error event
   */
  public trackError(
    type: ErrorEvent['type'],
    message: string,
    trackId?: string,
    stack?: string,
    metadata?: Record<string, any>
  ): void {
    if (!this.config.enabled || !this.config.trackErrors) return;

    const error: ErrorEvent = {
      id: this.generateEventId(),
      timestamp: Date.now(),
      type,
      message,
      stack,
      trackId,
      userAgent: this.session.userAgent,
      metadata,
    };

    this.errorEvents.push(error);
    this.session.errorCount++;

    this.checkFlushConditions();
  }

  /**
   * Track audio loading performance
   */
  public trackLoadTime(trackId: string, loadTime: number, metadata?: Record<string, any>): void {
    this.trackPerformance('load_time', loadTime, { trackId, ...metadata });

    // Update session average
    const currentAvg = this.session.averageLoadTime;
    const count = this.session.totalTracks;
    this.session.averageLoadTime =
      count > 0 ? (currentAvg * (count - 1) + loadTime) / count : loadTime;
  }

  /**
   * Track buffer health
   */
  public trackBufferHealth(
    trackId: string,
    bufferHealth: number,
    metadata?: Record<string, any>
  ): void {
    this.trackPerformance('buffer_health', bufferHealth, { trackId, ...metadata });
  }

  /**
   * Track memory usage
   */
  public trackMemoryUsage(memoryUsage: number, metadata?: Record<string, any>): void {
    this.trackPerformance('memory_usage', memoryUsage, metadata);
  }

  /**
   * Track network speed
   */
  public trackNetworkSpeed(speed: number, metadata?: Record<string, any>): void {
    this.trackPerformance('network_speed', speed, metadata);
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if data should be flushed
   */
  private checkFlushConditions(): void {
    const totalEvents =
      this.performanceMetrics.length + this.userBehaviorEvents.length + this.errorEvents.length;

    if (totalEvents >= this.config.batchSize) {
      this.flush();
    }
  }

  /**
   * Start automatic flush timer
   */
  private startFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  /**
   * Setup page unload handler to flush data
   */
  private setupUnloadHandler(): void {
    if (typeof window === 'undefined') return;

    const handleUnload = () => {
      this.endSession();
      this.flush(true); // Force synchronous flush
    };

    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('pagehide', handleUnload);
  }

  /**
   * Flush analytics data
   */
  public async flush(synchronous: boolean = false): Promise<void> {
    if (!this.config.enabled || !this.config.endpoint) {
      // Clear data even if not sending
      this.clearLocalData();
      return;
    }

    const payload = this.preparePayload();
    if (!payload || this.isEmpty(payload)) return;

    try {
      if (synchronous && typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        // Use sendBeacon for synchronous sending during page unload
        const success = navigator.sendBeacon(this.config.endpoint, JSON.stringify(payload));

        if (success) {
          this.clearLocalData();
        } else {
          this.addToRetryQueue(payload);
        }
      } else {
        // Use fetch for normal async sending
        await this.sendData(payload);
        this.clearLocalData();
      }
    } catch (error) {
      console.warn('Analytics flush failed:', error);
      this.addToRetryQueue(payload);
    }
  }

  /**
   * Prepare analytics payload
   */
  private preparePayload(): any {
    return {
      session: this.session,
      timestamp: Date.now(),
      performance: [...this.performanceMetrics],
      userBehavior: [...this.userBehaviorEvents],
      errors: [...this.errorEvents],
    };
  }

  /**
   * Check if payload is empty
   */
  private isEmpty(payload: any): boolean {
    return (
      payload.performance.length === 0 &&
      payload.userBehavior.length === 0 &&
      payload.errors.length === 0
    );
  }

  /**
   * Send data to analytics endpoint
   */
  private async sendData(payload: any): Promise<void> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['Authorization'] = `Bearer ${this.config.apiKey}`;
    }

    const response = await fetch(this.config.endpoint!, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Analytics request failed: ${response.status}`);
    }
  }

  /**
   * Add failed payload to retry queue
   */
  private addToRetryQueue(payload: any): void {
    this.retryQueue.push({
      payload,
      attempts: 0,
      timestamp: Date.now(),
    });

    // Process retry queue
    this.processRetryQueue();
  }

  /**
   * Process retry queue
   */
  private async processRetryQueue(): Promise<void> {
    const now = Date.now();
    const retryDelay = 5000; // 5 seconds

    for (let i = this.retryQueue.length - 1; i >= 0; i--) {
      const item = this.retryQueue[i];

      if (item.attempts >= this.config.maxRetries) {
        this.retryQueue.splice(i, 1);
        continue;
      }

      if (now - item.timestamp >= retryDelay) {
        try {
          await this.sendData(item.payload);
          this.retryQueue.splice(i, 1);
        } catch (error) {
          item.attempts++;
          item.timestamp = now;
        }
      }
    }
  }

  /**
   * Clear local analytics data
   */
  private clearLocalData(): void {
    this.performanceMetrics = [];
    this.userBehaviorEvents = [];
    this.errorEvents = [];
  }

  /**
   * End current session
   */
  public endSession(): void {
    this.session.endTime = Date.now();
  }

  /**
   * Get current session data
   */
  public getSession(): AnalyticsSession {
    return { ...this.session };
  }

  /**
   * Get analytics summary
   */
  public getSummary(): {
    session: AnalyticsSession;
    pendingEvents: number;
    retryQueueSize: number;
  } {
    return {
      session: this.getSession(),
      pendingEvents:
        this.performanceMetrics.length + this.userBehaviorEvents.length + this.errorEvents.length,
      retryQueueSize: this.retryQueue.length,
    };
  }

  /**
   * Update analytics configuration
   */
  public updateConfig(newConfig: Partial<AnalyticsConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.config.enabled) {
      this.startFlushTimer();
    } else if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  /**
   * Cleanup analytics system
   */
  public cleanup(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    this.endSession();
    this.flush(true);
    this.clearLocalData();
    this.retryQueue = [];
  }
}

export default AudioAnalytics;
