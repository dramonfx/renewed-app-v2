
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';

export interface AudioContext {
  isAudioContext: boolean;
  sectionId: string | null;
  sectionTitle: string | null;
  audioTitle: string | null;
  currentTimestamp: number | null;
  formattedTimestamp: string | null;
}

/**
 * Hook to detect and provide audio context for journal entries
 * Automatically detects if user is in an audio section and provides context
 */
export function useAudioContext(): AudioContext {
  const [audioContext, setAudioContext] = useState<AudioContext>({
    isAudioContext: false,
    sectionId: null,
    sectionTitle: null,
    audioTitle: null,
    currentTimestamp: null,
    formattedTimestamp: null,
  });

  const pathname = usePathname();

  // Helper function to format timestamp
  const formatTimestamp = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Extract section information from URL
  const extractSectionInfo = useCallback((path: string) => {
    // Check if we're in a book section page (/book/[sectionSlug])
    const sectionMatch = path.match(/\/book\/([^\/]+)/);
    if (sectionMatch) {
      const sectionSlug = sectionMatch[1];
      return {
        isAudioContext: true,
        sectionId: sectionSlug || null,
        sectionTitle: sectionSlug ? sectionSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Unknown Section',
      };
    }

    // Check if we're in the full audio player
    if (path.includes('/full-audio-player')) {
      return {
        isAudioContext: true,
        sectionId: 'audio-player',
        sectionTitle: 'Audio Player',
      };
    }

    return {
      isAudioContext: false,
      sectionId: null,
      sectionTitle: null,
    };
  }, []);

  // Get current audio state from any active audio players
  const getCurrentAudioState = useCallback(() => {
    try {
      // Check for active audio elements
      const audioElements = document.querySelectorAll('audio');
      for (const audio of audioElements) {
        if (!audio.paused && audio.currentTime > 0) {
          return {
            currentTimestamp: audio.currentTime,
            formattedTimestamp: formatTimestamp(audio.currentTime),
          };
        }
      }

      // Check localStorage for any saved audio state
      const savedAudioState = localStorage.getItem('currentAudioState');
      if (savedAudioState) {
        try {
          const state = JSON.parse(savedAudioState);
          if (state.currentTime && state.currentTime > 0) {
            return {
              currentTimestamp: state.currentTime,
              formattedTimestamp: formatTimestamp(state.currentTime),
            };
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    } catch (error) {
      console.warn('Failed to get current audio state:', error);
    }

    return {
      currentTimestamp: null,
      formattedTimestamp: null,
    };
  }, [formatTimestamp]);

  // Update audio context when pathname changes
  useEffect(() => {
    const sectionInfo = extractSectionInfo(pathname);
    const audioState = getCurrentAudioState();

    // Get audio title from document title or section
    let audioTitle = null;
    if (sectionInfo.isAudioContext) {
      audioTitle = document.title?.includes('RENEWED') ? document.title : 'RENEWED Audio Experience';
    }

    setAudioContext({
      ...sectionInfo,
      audioTitle,
      ...audioState,
    });
  }, [pathname, extractSectionInfo, getCurrentAudioState]);

  // Update timestamp periodically if in audio context
  useEffect(() => {
    if (!audioContext.isAudioContext) return;

    const interval = setInterval(() => {
      const audioState = getCurrentAudioState();
      if (audioState.currentTimestamp !== audioContext.currentTimestamp) {
        setAudioContext(prev => ({
          ...prev,
          ...audioState,
        }));
      }
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [audioContext.isAudioContext, audioContext.currentTimestamp, getCurrentAudioState]);

  return audioContext;
}

export default useAudioContext;
