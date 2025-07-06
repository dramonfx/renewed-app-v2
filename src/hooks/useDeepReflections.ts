
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

export interface DeepReflection {
  id: string;
  timestamp: number;
  sectionSlug: string;
  sectionTitle: string;
  reflectionText?: string;
  spiritualPrompt?: string;
  createdAt: string;
  isFromFullPlayer: boolean;
}

export interface UseDeepReflectionsOptions {
  mode: 'single' | 'full';
  currentTrackSlug?: string;
  currentTrackTitle?: string;
  maxReflections?: number;
}

export interface UseDeepReflectionsReturn {
  reflections: DeepReflection[];
  allReflections: Record<string, DeepReflection[]>;
  saveReflection: (timestamp: number, reflectionText?: string) => void;
  deleteReflection: (reflectionId: string) => void;
  clearAllReflections: () => void;
  clearSectionReflections: (sectionSlug: string) => void;
  canSaveReflection: boolean;
  getReflectionSummary: (reflection: DeepReflection) => string;
  getSpiritualPrompt: () => string;
  getSectionReflectionCount: (sectionSlug: string) => number;
  getAllSectionsWithReflections: () => Array<{ sectionSlug: string; count: number }>;
}

/**
 * Deep Reflections Hook - Section-Specific Spiritual Bookmark System
 * 
 * Transforms basic bookmarks into meaningful spiritual engagement points:
 * - "Deep Reflections" framing for spiritual growth
 * - Section-specific context and spiritual prompts
 * - Intent-based engagement
 * - Limited to 5 reflections per section for focused meditation
 */
export function useDeepReflections(
  options: UseDeepReflectionsOptions,
  onNavigateToReflection?: (reflection: DeepReflection) => void
): UseDeepReflectionsReturn {
  const { 
    mode, 
    currentTrackSlug, 
    currentTrackTitle, 
    maxReflections = 5 
  } = options;
  
  // State for all reflections (section-keyed) and current section reflections
  const [allReflections, setAllReflections] = useState<Record<string, DeepReflection[]>>({});
  const [reflections, setReflections] = useState<DeepReflection[]>([]);

  // Storage key for section-keyed reflections
  const storageKey = 'deep-reflections-v2';

  // Spiritual prompts for intent-based engagement
  const spiritualPrompts = useMemo(() => [
    "What revelation is the Spirit highlighting in this moment?",
    "How is this truth transforming your understanding?",
    "What specific area of your life does this illuminate?",
    "How can you apply this divine wisdom today?",
    "What prayer or meditation does this inspire?",
    "How does this connect to your spiritual journey?",
    "What mindset shift is being invited here?",
    "How is this renewing your thinking?",
  ], []);

  // Load all reflections from localStorage
  const loadAllReflections = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Handle migration from old format (v1) to new format (v2)
        if (Array.isArray(parsed)) {
          // Migrate old global array to section-keyed structure
          const migrated: Record<string, DeepReflection[]> = {};
          parsed.forEach((reflection: DeepReflection) => {
            const sectionKey = reflection.sectionSlug || 'unknown';
            if (!migrated[sectionKey]) {
              migrated[sectionKey] = [];
            }
            migrated[sectionKey].push(reflection);
          });
          setAllReflections(migrated);
          // Save migrated format
          localStorage.setItem(storageKey, JSON.stringify(migrated));
        } else if (typeof parsed === 'object' && parsed !== null) {
          setAllReflections(parsed);
        } else {
          setAllReflections({});
        }
      } else {
        setAllReflections({});
      }
    } catch (error) {
      console.error('Error loading Deep Reflections:', error);
      setAllReflections({});
    }
  }, [storageKey]);

  // Save all reflections to localStorage
  const saveAllReflectionsToStorage = useCallback((allReflectionsToSave: Record<string, DeepReflection[]>) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(allReflectionsToSave));
    } catch (error) {
      console.error('Error saving Deep Reflections:', error);
    }
  }, [storageKey]);

  // Load all reflections on mount
  useEffect(() => {
    loadAllReflections();
  }, [loadAllReflections]);

  // Filter reflections for current section
  useEffect(() => {
    if (currentTrackSlug && allReflections[currentTrackSlug]) {
      setReflections(allReflections[currentTrackSlug]);
    } else {
      setReflections([]);
    }
  }, [currentTrackSlug, allReflections]);

  // Get random spiritual prompt for engagement
  const getSpiritualPrompt = useCallback((): string => {
    return spiritualPrompts[Math.floor(Math.random() * spiritualPrompts.length)];
  }, [spiritualPrompts]);

  // Format time for display
  const formatTime = useCallback((time: number): string => {
    if (isNaN(time) || time === Infinity) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }, []);

  // Get reflection summary for display
  const getReflectionSummary = useCallback((reflection: DeepReflection): string => {
    const timeStr = formatTime(reflection.timestamp);
    return `${reflection.sectionTitle} - ${timeStr} - Deep Reflection`;
  }, [formatTime]);

  // Save a new deep reflection (section-specific)
  const saveReflection = useCallback((timestamp: number, reflectionText?: string) => {
    if (!currentTrackSlug || !currentTrackTitle) {
      console.warn('Cannot save reflection: missing track information');
      return;
    }

    const newReflection: DeepReflection = {
      id: `reflection-${Date.now()}`,
      timestamp,
      sectionSlug: currentTrackSlug,
      sectionTitle: currentTrackTitle,
      reflectionText: reflectionText || getSpiritualPrompt(),
      spiritualPrompt: getSpiritualPrompt(),
      createdAt: new Date().toISOString(),
      isFromFullPlayer: mode === 'full',
    };

    setAllReflections(prev => {
      const updated = { ...prev };
      const sectionKey = currentTrackSlug!; // TypeScript-safe assignment (we already checked above)
      const sectionReflections = updated[sectionKey] || [];
      
      // Add new reflection
      let updatedSectionReflections = [...sectionReflections, newReflection];
      
      // Keep only the most recent reflections up to maxReflections per section
      if (updatedSectionReflections.length > maxReflections) {
        updatedSectionReflections = updatedSectionReflections
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, maxReflections);
      }
      
      updated[sectionKey] = updatedSectionReflections;
      saveAllReflectionsToStorage(updated);
      return updated;
    });
  }, [
    mode, 
    currentTrackSlug, 
    currentTrackTitle, 
    maxReflections, 
    getSpiritualPrompt, 
    saveAllReflectionsToStorage
  ]);

  // Delete a specific reflection (section-aware)
  const deleteReflection = useCallback((reflectionId: string) => {
    if (!currentTrackSlug) return;

    setAllReflections(prev => {
      const updated = { ...prev };
      const sectionKey = currentTrackSlug!; // TypeScript-safe assignment (we already checked above)
      const sectionReflections = updated[sectionKey] || [];
      updated[sectionKey] = sectionReflections.filter(reflection => reflection.id !== reflectionId);
      
      // Remove section key if no reflections left
      if (updated[sectionKey].length === 0) {
        delete updated[sectionKey];
      }
      
      saveAllReflectionsToStorage(updated);
      return updated;
    });
  }, [currentTrackSlug, saveAllReflectionsToStorage]);

  // Clear all reflections across all sections
  const clearAllReflections = useCallback(() => {
    setAllReflections({});
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Clear reflections for a specific section
  const clearSectionReflections = useCallback((sectionSlug: string) => {
    setAllReflections(prev => {
      const updated = { ...prev };
      delete updated[sectionSlug];
      saveAllReflectionsToStorage(updated);
      return updated;
    });
  }, [saveAllReflectionsToStorage]);

  // Get reflection count for a specific section
  const getSectionReflectionCount = useCallback((sectionSlug: string): number => {
    return allReflections[sectionSlug]?.length || 0;
  }, [allReflections]);

  // Get all sections that have reflections with their counts
  const getAllSectionsWithReflections = useCallback((): Array<{ sectionSlug: string; count: number }> => {
    return Object.entries(allReflections).map(([sectionSlug, sectionReflections]) => ({
      sectionSlug,
      count: sectionReflections.length,
    }));
  }, [allReflections]);

  // Check if we can save a new reflection (section-specific)
  const canSaveReflection = reflections.length < maxReflections;

  return {
    reflections,
    allReflections,
    saveReflection,
    deleteReflection,
    clearAllReflections,
    clearSectionReflections,
    canSaveReflection,
    getReflectionSummary,
    getSpiritualPrompt,
    getSectionReflectionCount,
    getAllSectionsWithReflections,
  };
}

export default useDeepReflections;
