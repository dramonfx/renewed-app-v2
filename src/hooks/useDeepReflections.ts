
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
  saveReflection: (timestamp: number, reflectionText?: string) => void;
  deleteReflection: (reflectionId: string) => void;
  clearAllReflections: () => void;
  canSaveReflection: boolean;
  getReflectionSummary: (reflection: DeepReflection) => string;
  getSpiritualPrompt: () => string;
}

/**
 * Deep Reflections Hook - Spiritual Bookmark System
 * 
 * Transforms basic bookmarks into meaningful spiritual engagement points:
 * - "Deep Reflections" framing for spiritual growth
 * - Section context and spiritual prompts
 * - Intent-based engagement
 * - Limited to 5 total reflections for focused meditation
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
  
  const [reflections, setReflections] = useState<DeepReflection[]>([]);

  // Storage key for global reflections
  const storageKey = 'deep-reflections-v1';

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

  // Load reflections from localStorage
  const loadReflections = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setReflections(Array.isArray(parsed) ? parsed : []);
      } else {
        setReflections([]);
      }
    } catch (error) {
      console.error('Error loading Deep Reflections:', error);
      setReflections([]);
    }
  }, [storageKey]);

  // Save reflections to localStorage
  const saveReflectionsToStorage = useCallback((reflectionsToSave: DeepReflection[]) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reflectionsToSave));
    } catch (error) {
      console.error('Error saving Deep Reflections:', error);
    }
  }, [storageKey]);

  // Load reflections on mount
  useEffect(() => {
    loadReflections();
  }, [loadReflections]);

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

  // Save a new deep reflection
  const saveReflection = useCallback((timestamp: number, reflectionText?: string) => {
    if (!currentTrackSlug || !currentTrackTitle) {
      console.warn('Cannot save reflection: missing track information');
      return;
    }

    const newReflection: DeepReflection = {
      id: `reflection-${Date.now()}`,
      timestamp,
      sectionSlug: currentTrackSlug || '',
      sectionTitle: currentTrackTitle || '',
      reflectionText: reflectionText || getSpiritualPrompt(),
      spiritualPrompt: getSpiritualPrompt(),
      createdAt: new Date().toISOString(),
      isFromFullPlayer: mode === 'full',
    };

    setReflections(prev => {
      let updatedReflections = [...prev];
      
      // Add new reflection
      updatedReflections.push(newReflection);
      
      // Keep only the most recent reflections up to maxReflections
      if (updatedReflections.length > maxReflections) {
        updatedReflections = updatedReflections
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, maxReflections);
      }
      
      saveReflectionsToStorage(updatedReflections);
      return updatedReflections;
    });
  }, [
    mode, 
    currentTrackSlug, 
    currentTrackTitle, 
    maxReflections, 
    getSpiritualPrompt, 
    saveReflectionsToStorage
  ]);

  // Delete a specific reflection
  const deleteReflection = useCallback((reflectionId: string) => {
    setReflections(prev => {
      const updated = prev.filter(reflection => reflection.id !== reflectionId);
      saveReflectionsToStorage(updated);
      return updated;
    });
  }, [saveReflectionsToStorage]);

  // Clear all reflections
  const clearAllReflections = useCallback(() => {
    setReflections([]);
    localStorage.removeItem(storageKey);
  }, [storageKey]);

  // Check if we can save a new reflection
  const canSaveReflection = reflections.length < maxReflections;

  return {
    reflections,
    saveReflection,
    deleteReflection,
    clearAllReflections,
    canSaveReflection,
    getReflectionSummary,
    getSpiritualPrompt,
  };
}

export default useDeepReflections;
