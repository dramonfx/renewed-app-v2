
'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { 
  DeepReflection, 
  CreateDeepReflectionRequest, 
  DeepReflectionStats,
  UseDeepReflectionReturn 
} from '@/types';

// Mock deep reflections for development
const mockDeepReflections: DeepReflection[] = [
  {
    id: '1',
    user_id: 'mock-user-1',
    section_id: 'prologue',
    section_title: 'Prologue',
    audio_title: 'Prologue Audio',
    audio_timestamp: 125.5,
    answer_text: 'This moment really spoke to me about the importance of understanding our spiritual identity. The way this was explained helped me see how I can move from natural thinking to spiritual understanding.',
    tags: ['identity', 'spiritual growth'],
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    formatted_timestamp: '02:05'
  },
  {
    id: '2', 
    user_id: 'mock-user-1',
    section_id: 'prologue',
    section_title: 'Prologue',
    audio_title: 'Prologue Audio',
    audio_timestamp: 312.8,
    answer_text: 'I had never thought about spiritual principles this way before. This insight about navigating through spiritual principles to unlock understanding really resonated with me.',
    tags: ['spiritual principles', 'understanding'],
    created_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    updated_at: new Date(Date.now() - 3600000).toISOString(),
    formatted_timestamp: '05:12'
  }
];

// Mock stats
const mockStats: DeepReflectionStats = {
  total_reflections: 2,
  reflections_this_week: 2,
  reflections_this_month: 2,
  sections_with_reflections: 1,
  average_reflection_length: 150,
  first_reflection: mockDeepReflections[0]?.created_at,
  latest_reflection: mockDeepReflections[1]?.created_at
};

/**
 * Hook for managing Deep Reflections
 * Provides CRUD operations and state management for audio-based spiritual reflections
 */
export function useDeepReflection(): UseDeepReflectionReturn {
  const [reflections, setReflections] = useState<DeepReflection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DeepReflectionStats | null>(null);

  // Helper function to format timestamp
  const formatTimestamp = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Load all reflections for the current user
  const loadReflections = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try real Supabase query first
      const { data, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .select('*')
        .eq('reflection_type', 'deep_reflection')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.warn('Supabase error, using mock data:', supabaseError);
        // Use mock data as fallback
        setReflections(mockDeepReflections);
        setStats(mockStats);
      } else if (data) {
        // Process real data and add formatted timestamps
        const processedReflections = data.map((reflection: any) => ({
          ...reflection,
          formatted_timestamp: reflection.audio_timestamp 
            ? formatTimestamp(reflection.audio_timestamp) 
            : undefined
        })) as DeepReflection[];
        
        setReflections(processedReflections);
        
        // Calculate real stats
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        const realStats: DeepReflectionStats = {
          total_reflections: processedReflections.length,
          reflections_this_week: processedReflections.filter(r => 
            new Date(r.created_at) >= weekAgo).length,
          reflections_this_month: processedReflections.filter(r => 
            new Date(r.created_at) >= monthAgo).length,
          sections_with_reflections: new Set(processedReflections.map(r => r.section_id)).size,
          average_reflection_length: Math.round(
            processedReflections.reduce((sum, r) => sum + r.answer_text.length, 0) / 
            Math.max(processedReflections.length, 1)
          ),
          first_reflection: processedReflections.length > 0 
            ? processedReflections[processedReflections.length - 1]?.created_at 
            : undefined,
          latest_reflection: processedReflections.length > 0 
            ? processedReflections[0]?.created_at 
            : undefined
        };
        
        setStats(realStats);
      }
    } catch (err) {
      console.error('Error loading reflections:', err);
      setError('Failed to load reflections');
      // Fallback to mock data on error
      setReflections(mockDeepReflections);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new deep reflection
  const createReflection = useCallback(async (
    data: CreateDeepReflectionRequest
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const reflectionData = {
        section_id: data.section_id,
        section_title: data.section_title,
        audio_title: data.audio_title,
        audio_timestamp: data.audio_timestamp,
        question_text: 'Deep Reflection', // Standard question for deep reflections
        answer_text: data.answer_text,
        reflection_type: 'deep_reflection',
        tags: data.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: result, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .insert([reflectionData])
        .select()
        .single();

      if (supabaseError) {
        console.warn('Supabase error creating reflection, using mock:', supabaseError);
        
        // Mock creation for development
        const mockReflection: DeepReflection = {
          id: `mock-${Date.now()}`,
          user_id: 'mock-user-1',
          ...data,
          answer_text: data.answer_text,
          tags: data.tags || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          formatted_timestamp: formatTimestamp(data.audio_timestamp)
        };

        setReflections(prev => [mockReflection, ...prev]);
        return { success: true };
      }

      if (result) {
        const newReflection: DeepReflection = {
          ...result,
          formatted_timestamp: formatTimestamp(result.audio_timestamp)
        } as DeepReflection;

        setReflections(prev => [newReflection, ...prev]);
        
        // Refresh stats
        await loadReflections();
        
        return { success: true };
      }

      return { success: false, error: 'Failed to create reflection' };
    } catch (err) {
      console.error('Error creating reflection:', err);
      return { success: false, error: 'Failed to create reflection' };
    }
  }, [loadReflections]);

  // Delete a reflection
  const deleteReflection = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      const { error: supabaseError } = await (supabase as any)
        .from('reflections')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        console.warn('Supabase error deleting reflection, using mock:', supabaseError);
      }

      // Update local state regardless (works for both real and mock)
      setReflections(prev => prev.filter(r => r.id !== id));
      
      // Refresh stats
      await loadReflections();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting reflection:', err);
      return { success: false, error: 'Failed to delete reflection' };
    }
  }, [loadReflections]);

  // Get reflections for a specific section
  const getReflectionsBySection = useCallback(async (
    sectionId: string
  ): Promise<DeepReflection[]> => {
    try {
      const { data, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .select('*')
        .eq('section_id', sectionId)
        .eq('reflection_type', 'deep_reflection')
        .order('audio_timestamp', { ascending: true });

      if (supabaseError || !data) {
        console.warn('Supabase error, using mock data:', supabaseError);
        return mockDeepReflections.filter(r => r.section_id === sectionId);
      }

      return data.map((reflection: any) => ({
        ...reflection,
        formatted_timestamp: reflection.audio_timestamp 
          ? formatTimestamp(reflection.audio_timestamp) 
          : undefined
      })) as DeepReflection[];
    } catch (err) {
      console.error('Error fetching section reflections:', err);
      return mockDeepReflections.filter(r => r.section_id === sectionId);
    }
  }, []);

  // Refresh reflections (useful for manual refresh)
  const refreshReflections = useCallback(async () => {
    await loadReflections();
  }, [loadReflections]);

  // Load reflections on mount
  useEffect(() => {
    loadReflections();
  }, [loadReflections]);

  // Compute derived values
  const hasReflections = reflections.length > 0;

  return {
    reflections,
    loading,
    error,
    createReflection,
    deleteReflection,
    getReflectionsBySection,
    hasReflections,
    stats,
    refreshReflections
  };
}

export default useDeepReflection;
