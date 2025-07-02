
// src/hooks/index.ts
'use client';

/**
 * Hooks Index - Enhanced with Phase 5.1 Integration
 * 
 * Central export point for all audio-related hooks including the new
 * Phase 5.1 enhanced audio player hook with cross-track navigation capabilities.
 */

// === CORE HOOKS ===
export { default as useAudioPlayer } from './useAudioPlayer';
export type { UseAudioPlayerReturn, AudioPlayerOptions } from './useAudioPlayer';

// === PHASE 5.1 ENHANCED HOOKS ===
export { default as useAudioPlayerEnhanced } from './useAudioPlayerEnhanced';
export type { 
  UseAudioPlayerEnhancedReturn, 
  AudioPlayerEnhancedOptions,
  CrossTrackNavigationOptions
} from './useAudioPlayerEnhanced';

// === TYPES ===
export * from './types';

// === UTILITY HOOKS ===
// Add any additional utility hooks here as they are created
