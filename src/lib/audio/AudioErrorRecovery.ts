// src/lib/audio/AudioErrorRecovery.ts
'use client';

/**
 * Audio Error Recovery System - Enhanced Error Handling & Recovery
 *
 * Provides intelligent error recovery mechanisms for audio playback issues,
 * network problems, and resource failures with fallback strategies.
 */

export interface ErrorRecoveryConfig {
  maxRetryAttempts: number;
  retryDelay: number; // ms
  progressiveBackoff: boolean;
  fallbackUrls: string[];
  enableNetworkRecovery: boolean;
  enableResourceRecovery: boolean;
  enableUserNotifications: boolean;
}

export interface AudioError {
  type: 'network' | 'decode' | 'abort' | 'resource' | 'unknown';
  code: number;
  message: string;
  timestamp: number;
  trackId: string;
  url: string;
  recoverable: boolean;
}

export interface RecoveryAttempt {
  attemptNumber: number;
  timestamp: number;
  strategy: string;
  success: boolean;
  error?: string;
}

export interface RecoverySession {
  trackId: string;
  startTime: number;
  endTime?: number;
  totalAttempts: number;
  attempts: RecoveryAttempt[];
  finalOutcome: 'success' | 'failure' | 'abandoned';
  fallbackUsed?: string;
}

export class AudioErrorRecovery {
  private config: ErrorRecoveryConfig;
  private activeSessions: Map<string, RecoverySession> = new Map();
  private eventListeners: Map<string, Function[]> = new Map();

  constructor(config: Partial<ErrorRecoveryConfig> = {}) {
    this.config = {
      maxRetryAttempts: 3,
      retryDelay: 1000,
      progressiveBackoff: true,
      fallbackUrls: [],
      enableNetworkRecovery: true,
      enableResourceRecovery: true,
      enableUserNotifications: true,
      ...config,
    };
  }

  /**
   * Analyze audio error and determine recovery strategy
   */
  public analyzeError(error: Event | Error, audioElement: HTMLAudioElement): AudioError {
    let audioError: AudioError;

    if (error instanceof MediaError || (error as any).target?.error) {
      const mediaError = error instanceof MediaError ? error : (error as any).target.error;

      audioError = {
        type: this.getErrorType(mediaError.code),
        code: mediaError.code,
        message: this.getErrorMessage(mediaError.code),
        timestamp: Date.now(),
        trackId: audioElement.src,
        url: audioElement.src,
        recoverable: this.isRecoverable(mediaError.code),
      };
    } else {
      audioError = {
        type: 'unknown',
        code: 0,
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now(),
        trackId: audioElement.src,
        url: audioElement.src,
        recoverable: true,
      };
    }

    return audioError;
  }

  /**
   * Get error type from media error code
   */
  private getErrorType(code: number): AudioError['type'] {
    switch (code) {
      case MediaError.MEDIA_ERR_NETWORK:
        return 'network';
      case MediaError.MEDIA_ERR_DECODE:
        return 'decode';
      case MediaError.MEDIA_ERR_ABORTED:
        return 'abort';
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return 'resource';
      default:
        return 'unknown';
    }
  }

  /**
   * Get human-readable error message
   */
  private getErrorMessage(code: number): string {
    switch (code) {
      case MediaError.MEDIA_ERR_NETWORK:
        return 'Network error while loading audio';
      case MediaError.MEDIA_ERR_DECODE:
        return 'Audio format not supported or corrupted';
      case MediaError.MEDIA_ERR_ABORTED:
        return 'Audio loading was aborted';
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return 'Audio source not supported';
      default:
        return 'Unknown audio error';
    }
  }

  /**
   * Check if error is recoverable
   */
  private isRecoverable(code: number): boolean {
    switch (code) {
      case MediaError.MEDIA_ERR_NETWORK:
      case MediaError.MEDIA_ERR_ABORTED:
        return true;
      case MediaError.MEDIA_ERR_DECODE:
      case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
        return false;
      default:
        return true;
    }
  }

  /**
   * Attempt to recover from audio error
   */
  public async attemptRecovery(
    audioError: AudioError,
    audioElement: HTMLAudioElement,
    trackId: string
  ): Promise<boolean> {
    if (!audioError.recoverable) {
      this.emit('recoveryFailed', {
        trackId,
        error: audioError,
        reason: 'Error not recoverable',
      });
      return false;
    }

    // Get or create recovery session
    let session = this.activeSessions.get(trackId);
    if (!session) {
      session = {
        trackId,
        startTime: Date.now(),
        totalAttempts: 0,
        attempts: [],
        finalOutcome: 'failure',
      };
      this.activeSessions.set(trackId, session);
    }

    // Check if we've exceeded max attempts
    if (session.totalAttempts >= this.config.maxRetryAttempts) {
      session.finalOutcome = 'failure';
      session.endTime = Date.now();
      this.emit('recoveryFailed', {
        trackId,
        error: audioError,
        reason: 'Max attempts exceeded',
        session,
      });
      return false;
    }

    session.totalAttempts++;

    // Determine recovery strategy based on error type
    const strategy = this.selectRecoveryStrategy(audioError, session.totalAttempts);

    const attempt: RecoveryAttempt = {
      attemptNumber: session.totalAttempts,
      timestamp: Date.now(),
      strategy,
      success: false,
    };

    try {
      // Calculate delay with progressive backoff
      const delay = this.calculateDelay(session.totalAttempts);

      this.emit('recoveryAttempt', {
        trackId,
        attempt: session.totalAttempts,
        strategy,
        delay,
      });

      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Execute recovery strategy
      const success = await this.executeRecoveryStrategy(
        strategy,
        audioElement,
        audioError,
        session
      );

      attempt.success = success;
      session.attempts.push(attempt);

      if (success) {
        session.finalOutcome = 'success';
        session.endTime = Date.now();
        this.activeSessions.delete(trackId);

        this.emit('recoverySuccess', {
          trackId,
          strategy,
          attempts: session.totalAttempts,
          session,
        });

        return true;
      }

      // If this strategy failed, try again with a different strategy
      return this.attemptRecovery(audioError, audioElement, trackId);
    } catch (error) {
      attempt.error = error instanceof Error ? error.message : 'Unknown recovery error';
      session.attempts.push(attempt);

      this.emit('recoveryError', {
        trackId,
        strategy,
        error: attempt.error,
      });

      return false;
    }
  }

  /**
   * Select appropriate recovery strategy
   */
  private selectRecoveryStrategy(audioError: AudioError, attemptNumber: number): string {
    switch (audioError.type) {
      case 'network':
        if (attemptNumber === 1) return 'reload';
        if (attemptNumber === 2) return 'fallback-url';
        return 'network-recovery';

      case 'abort':
        return 'reload';

      case 'resource':
        if (attemptNumber === 1) return 'fallback-url';
        return 'format-detection';

      case 'decode':
        return 'fallback-url';

      default:
        return 'reload';
    }
  }

  /**
   * Execute specific recovery strategy
   */
  private async executeRecoveryStrategy(
    strategy: string,
    audioElement: HTMLAudioElement,
    audioError: AudioError,
    session: RecoverySession
  ): Promise<boolean> {
    switch (strategy) {
      case 'reload':
        return this.executeReload(audioElement);

      case 'fallback-url':
        return this.executeFallbackUrl(audioElement, session);

      case 'network-recovery':
        return this.executeNetworkRecovery(audioElement);

      case 'format-detection':
        return this.executeFormatDetection(audioElement);

      default:
        throw new Error(`Unknown recovery strategy: ${strategy}`);
    }
  }

  /**
   * Execute reload strategy
   */
  private async executeReload(audioElement: HTMLAudioElement): Promise<boolean> {
    return new Promise((resolve) => {
      const currentSrc = audioElement.src;
      const currentTime = audioElement.currentTime;

      const onLoadedData = () => {
        audioElement.removeEventListener('loadeddata', onLoadedData);
        audioElement.removeEventListener('error', onError);

        // Restore playback position
        audioElement.currentTime = currentTime;
        resolve(true);
      };

      const onError = () => {
        audioElement.removeEventListener('loadeddata', onLoadedData);
        audioElement.removeEventListener('error', onError);
        resolve(false);
      };

      audioElement.addEventListener('loadeddata', onLoadedData);
      audioElement.addEventListener('error', onError);

      // Force reload by clearing and setting src
      audioElement.src = '';
      audioElement.load();
      audioElement.src = currentSrc;
      audioElement.load();
    });
  }

  /**
   * Execute fallback URL strategy
   */
  private async executeFallbackUrl(
    audioElement: HTMLAudioElement,
    session: RecoverySession
  ): Promise<boolean> {
    if (!this.config.fallbackUrls.length) {
      return false;
    }

    const usedFallbacks = session.attempts
      .filter((attempt) => attempt.strategy === 'fallback-url' && attempt.success)
      .map((attempt) => session.fallbackUsed);

    const availableFallbacks = this.config.fallbackUrls.filter(
      (url) => !usedFallbacks.includes(url)
    );

    if (!availableFallbacks.length) {
      return false;
    }

    const fallbackUrl = availableFallbacks[0];
    if (!fallbackUrl) {
      return false;
    }
    session.fallbackUsed = fallbackUrl;

    return new Promise((resolve) => {
      const currentTime = audioElement.currentTime;

      const onLoadedData = () => {
        audioElement.removeEventListener('loadeddata', onLoadedData);
        audioElement.removeEventListener('error', onError);

        // Restore playback position
        audioElement.currentTime = currentTime;
        resolve(true);
      };

      const onError = () => {
        audioElement.removeEventListener('loadeddata', onLoadedData);
        audioElement.removeEventListener('error', onError);
        resolve(false);
      };

      audioElement.addEventListener('loadeddata', onLoadedData);
      audioElement.addEventListener('error', onError);

      audioElement.src = fallbackUrl;
      audioElement.load();
    });
  }

  /**
   * Execute network recovery strategy
   */
  private async executeNetworkRecovery(audioElement: HTMLAudioElement): Promise<boolean> {
    if (!this.config.enableNetworkRecovery) {
      return false;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      return new Promise((resolve) => {
        const onOnline = () => {
          window.removeEventListener('online', onOnline);
          resolve(this.executeReload(audioElement));
        };

        window.addEventListener('online', onOnline);

        // Timeout after 30 seconds
        setTimeout(() => {
          window.removeEventListener('online', onOnline);
          resolve(false);
        }, 30000);
      });
    }

    return this.executeReload(audioElement);
  }

  /**
   * Execute format detection strategy
   */
  private async executeFormatDetection(audioElement: HTMLAudioElement): Promise<boolean> {
    // Try to detect if the browser supports the current audio format
    const currentUrl = audioElement.src;
    const fileExtension = currentUrl.split('.').pop()?.toLowerCase();

    if (!fileExtension) {
      return false;
    }

    const mimeType = this.getMimeTypeFromExtension(fileExtension);
    const canPlay = audioElement.canPlayType(mimeType);

    if (canPlay === 'probably' || canPlay === 'maybe') {
      return this.executeReload(audioElement);
    }

    return false;
  }

  /**
   * Get MIME type from file extension
   */
  private getMimeTypeFromExtension(extension: string): string {
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      aac: 'audio/aac',
      m4a: 'audio/mp4',
      flac: 'audio/flac',
    };

    return mimeTypes[extension] || 'audio/*';
  }

  /**
   * Calculate retry delay with progressive backoff
   */
  private calculateDelay(attemptNumber: number): number {
    if (!this.config.progressiveBackoff) {
      return this.config.retryDelay;
    }

    // Exponential backoff: delay * 2^(attempt - 1)
    return this.config.retryDelay * Math.pow(2, attemptNumber - 1);
  }

  /**
   * Get recovery statistics
   */
  public getRecoveryStats(): {
    activeSessions: number;
    totalSessions: number;
    successRate: number;
    averageAttempts: number;
    commonErrors: Array<{ type: string; count: number }>;
  } {
    const allSessions = Array.from(this.activeSessions.values());
    const completedSessions = allSessions.filter((session) => session.endTime);

    const successfulSessions = completedSessions.filter(
      (session) => session.finalOutcome === 'success'
    );

    const successRate =
      completedSessions.length > 0
        ? (successfulSessions.length / completedSessions.length) * 100
        : 0;

    const averageAttempts =
      completedSessions.length > 0
        ? completedSessions.reduce((sum, session) => sum + session.totalAttempts, 0) /
          completedSessions.length
        : 0;

    // This would need to be tracked separately in a real implementation
    const commonErrors: Array<{ type: string; count: number }> = [];

    return {
      activeSessions: this.activeSessions.size,
      totalSessions: allSessions.length,
      successRate,
      averageAttempts,
      commonErrors,
    };
  }

  /**
   * Event system for recovery notifications
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
      listeners.forEach((listener) => listener(data));
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(newConfig: Partial<ErrorRecoveryConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Clear all active sessions
   */
  public clearSessions(): void {
    this.activeSessions.clear();
  }

  /**
   * Get active recovery session for a track
   */
  public getActiveSession(trackId: string): RecoverySession | null {
    return this.activeSessions.get(trackId) || null;
  }
}

export default AudioErrorRecovery;
