
'use client';

import { useState, useEffect, useCallback } from 'react';

export interface GlobalAudioState {
  currentSectionSlug: string;
  currentSectionTitle: string;
  currentTimestamp: number;
  isPlaying: boolean;
  lastUpdated: string;
}

export interface UseGlobalAudioResumeReturn {
  globalState: GlobalAudioState | null;
  updateGlobalState: (
    sectionSlug: string, 
    sectionTitle: string, 
    timestamp: number, 
    isPlaying: boolean
  ) => void;
  clearGlobalState: () => void;
  getResumeText: () => string | null;
  hasValidResumeState: boolean;
}

/**
 * Global Audio Resume Hook
 * 
 * Tracks the user's progress across the full audio player to enable
 * seamless resume functionality and prevent always starting from Prologue.
 * 
 * Features:
 * - Global state persistence across sessions
 * - Auto-resume capability for full audio player
 * - Human-friendly resume text
 * - Validation of resume state
 */
export function useGlobalAudioResume(): UseGlobalAudioResumeReturn {
  const [globalState, setGlobalState] = useState<GlobalAudioState | null>(null);
  
  const storageKey = 'global-audio-resume-v1';

  // Format time for display
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || time === Infinity || time <= 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Load global state from localStorage
  const loadGlobalState = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate the stored data structure
        if (parsed && 
            typeof parsed.currentSectionSlug === 'string' &&
            typeof parsed.currentSectionTitle === 'string' &&
            typeof parsed.currentTimestamp === 'number' &&
            typeof parsed.isPlaying === 'boolean' &&
            typeof parsed.lastUpdated === 'string') {
          setGlobalState(parsed);
        } else {
          console.warn('Invalid global audio state structure, clearing...');
          localStorage.removeItem(storageKey);
          setGlobalState(null);
        }
      } else {
        setGlobalState(null);
      }
    } catch (error) {
      console.error('Error loading global audio state:', error);
      setGlobalState(null);
    }
  }, [storageKey]);

  // Save global state to localStorage
  const saveGlobalState = useCallback((state: GlobalAudioState) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.error('Error saving global audio state:', error);
    }
  }, [storageKey]);

  // Load global state on mount
  useEffect(() => {
    loadGlobalState();
  }, [loadGlobalState]);

  // Update global state
  const updateGlobalState = useCallback((
    sectionSlug: string,
    sectionTitle: string,
    timestamp: number,
    isPlaying: boolean
  ) => {
    // Only update if we have meaningful progress (more than 10 seconds)
    if (timestamp < 10) return;

    const newState: GlobalAudioState = {
      currentSectionSlug: sectionSlug,
      currentSectionTitle: sectionTitle,
      currentTimestamp: timestamp,
      isPlaying,
      lastUpdated: new Date().toISOString(),
    };

    setGlobalState(newState);
    saveGlobalState(newState);
  }, [saveGlobalState]);

  // Clear global state
  const clearGlobalState = useCallback(() => {
    setGlobalState(null);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Get human-friendly resume text
  const getResumeText = useCallback((): string | null => {
    if (!globalState || globalState.currentTimestamp < 10) return null;
    
    const timeStr = formatTime(globalState.currentTimestamp);
    return `Resume from "${globalState.currentSectionTitle}" at ${timeStr}`;
  }, [globalState, formatTime]);

  // Check if we have a valid resume state
  const hasValidResumeState = Boolean(
    globalState && 
    globalState.currentSectionSlug && 
    globalState.currentTimestamp > 10
  );

  return {
    globalState,
    updateGlobalState,
    clearGlobalState,
    getResumeText,
    hasValidResumeState,
  };
}

export default useGlobalAudioResume;
