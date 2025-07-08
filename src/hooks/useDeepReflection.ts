
'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { 
  DeepReflection, 
  CreateDeepReflectionRequest, 
  DeepReflectionStats,
  UseDeepReflectionReturn 
} from '@/types';

// No more mock data - using real database only

/**
 * Hook for managing Deep Reflections
 * Provides CRUD operations and state management for audio-based spiritual reflections
 */
export function useDeepReflection(): UseDeepReflectionReturn {
  const [reflections, setReflections] = useState<DeepReflection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DeepReflectionStats | null>(null);
  const pathname = usePathname();

  // Helper function to extract section slug from pathname
  const extractSectionSlug = (path: string): string => {
    // Extract slug from /book/[sectionSlug] pattern
    const match = path.match(/\/book\/([^\/]+)/);
    return match && match[1] ? match[1] : 'unknown';
  };

  // Helper function to generate question_id from section slug
  const generateQuestionId = (sectionSlug: string): string => {
    return `section_${sectionSlug}_reflection`;
  };

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

      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error during reflection loading:', sessionError);
        setError(`Authentication error: ${sessionError.message}`);
        setReflections([]);
        setStats(null);
        setLoading(false);
        return;
      }

      if (!sessionData?.session?.user) {
        // No user logged in - return empty state
        setReflections([]);
        setStats(null);
        setLoading(false);
        return;
      }

      // Query Supabase for deep reflections (RLS will automatically filter by user_id)
      const { data, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .select('*')
        .eq('reflection_type', 'deep_reflection')
        .order('created_at', { ascending: false });

      if (supabaseError) {
        console.error('Supabase error loading reflections:', supabaseError);
        setError(`Failed to load reflections: ${supabaseError.message}`);
        setReflections([]);
        setStats(null);
        return;
      }

      // Process data and add formatted timestamps
      const processedReflections = (data || []).map((reflection: any) => ({
        ...reflection,
        formatted_timestamp: reflection.audio_timestamp 
          ? formatTimestamp(reflection.audio_timestamp) 
          : undefined
      })) as DeepReflection[];
      
      setReflections(processedReflections);
      
      // Calculate stats
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const stats: DeepReflectionStats = {
        total_reflections: processedReflections.length,
        reflections_this_week: processedReflections.filter(r => 
          new Date(r.created_at) >= weekAgo).length,
        reflections_this_month: processedReflections.filter(r => 
          new Date(r.created_at) >= monthAgo).length,
        sections_with_reflections: new Set(processedReflections.map(r => r.section_id)).size,
        average_reflection_length: processedReflections.length > 0 ? Math.round(
          processedReflections.reduce((sum, r) => sum + r.answer_text.length, 0) / 
          processedReflections.length
        ) : 0,
        first_reflection: processedReflections.length > 0 
          ? processedReflections[processedReflections.length - 1]?.created_at 
          : undefined,
        latest_reflection: processedReflections.length > 0 
          ? processedReflections[0]?.created_at 
          : undefined
      };
      
      setStats(stats);
    } catch (err) {
      console.error('Error loading reflections:', err);
      setError('Failed to load reflections. Please check your connection.');
      setReflections([]);
      setStats(null);
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

      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error during reflection creation:', sessionError);
        return { success: false, error: `Authentication error: ${sessionError.message}` };
      }

      if (!sessionData?.session?.user) {
        return { success: false, error: 'You must be logged in to save reflections' };
      }

      // Extract section slug from current pathname and generate question_id
      const sectionSlug = extractSectionSlug(pathname);
      const questionId = generateQuestionId(sectionSlug);

      const reflectionData = {
        user_id: sessionData.session.user.id, // ✅ CRITICAL FIX: Add missing user_id
        section_id: data.section_id,
        section_title: data.section_title,
        audio_title: data.audio_title,
        audio_timestamp: data.audio_timestamp,
        question_text: 'Deep Reflection', // Standard question for deep reflections
        answer_text: data.answer_text,
        question_id: questionId, // ✅ CRITICAL FIX: Add missing question_id
        reflection_type: 'deep_reflection',
        tags: data.tags || []
        // ✅ REMOVED: created_at and updated_at - let database handle these with defaults
      };

      const { data: result, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .insert([reflectionData])
        .select()
        .single();

      if (supabaseError) {
        console.error('Supabase error creating reflection:', supabaseError);
        return { success: false, error: `Failed to save reflection: ${supabaseError.message}` };
      }

      if (result) {
        const newReflection: DeepReflection = {
          ...result,
          formatted_timestamp: formatTimestamp(result.audio_timestamp)
        } as DeepReflection;

        // Update local state immediately (optimistic update)
        setReflections(prev => [newReflection, ...prev]);
        
        // Update stats without full reload
        setStats(prevStats => {
          if (!prevStats) return null;
          
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          const reflectionDate = new Date(newReflection.created_at);
          
          return {
            ...prevStats,
            total_reflections: prevStats.total_reflections + 1,
            reflections_this_week: reflectionDate >= weekAgo ? prevStats.reflections_this_week + 1 : prevStats.reflections_this_week,
            reflections_this_month: reflectionDate >= monthAgo ? prevStats.reflections_this_month + 1 : prevStats.reflections_this_month,
            latest_reflection: newReflection.created_at
          };
        });
        
        return { success: true };
      }

      return { success: false, error: 'Failed to create reflection' };
    } catch (err) {
      console.error('Error creating reflection:', err);
      return { success: false, error: 'Failed to create reflection' };
    }
  }, [pathname]);

  // Delete a reflection
  const deleteReflection = useCallback(async (
    id: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setError(null);

      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error during reflection deletion:', sessionError);
        return { success: false, error: `Authentication error: ${sessionError.message}` };
      }

      if (!sessionData?.session?.user) {
        return { success: false, error: 'You must be logged in to delete reflections' };
      }

      // Find the reflection to delete for stats calculation
      const reflectionToDelete = reflections.find(r => r.id === id);

      // Delete reflection (RLS will ensure user can only delete their own)
      const { error: supabaseError } = await (supabase as any)
        .from('reflections')
        .delete()
        .eq('id', id);

      if (supabaseError) {
        console.error('Supabase error deleting reflection:', supabaseError);
        return { success: false, error: `Failed to delete reflection: ${supabaseError.message}` };
      }

      // Update local state immediately (optimistic update)
      setReflections(prev => prev.filter(r => r.id !== id));
      
      // Update stats without full reload
      if (reflectionToDelete) {
        setStats(prevStats => {
          if (!prevStats) return null;
          
          const now = new Date();
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          const reflectionDate = new Date(reflectionToDelete.created_at);
          
          const updatedReflections = reflections.filter(r => r.id !== id);
          
          return {
            ...prevStats,
            total_reflections: Math.max(0, prevStats.total_reflections - 1),
            reflections_this_week: reflectionDate >= weekAgo ? Math.max(0, prevStats.reflections_this_week - 1) : prevStats.reflections_this_week,
            reflections_this_month: reflectionDate >= monthAgo ? Math.max(0, prevStats.reflections_this_month - 1) : prevStats.reflections_this_month,
            sections_with_reflections: new Set(updatedReflections.map(r => r.section_id)).size,
            average_reflection_length: updatedReflections.length > 0 ? Math.round(
              updatedReflections.reduce((sum, r) => sum + r.answer_text.length, 0) / 
              updatedReflections.length
            ) : 0,
            first_reflection: updatedReflections.length > 0 
              ? updatedReflections[updatedReflections.length - 1]?.created_at 
              : undefined,
            latest_reflection: updatedReflections.length > 0 
              ? updatedReflections[0]?.created_at 
              : undefined
          };
        });
      }
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting reflection:', err);
      return { success: false, error: 'Failed to delete reflection' };
    }
  }, [reflections]);

  // Get reflections for a specific section
  const getReflectionsBySection = useCallback(async (
    sectionId: string
  ): Promise<DeepReflection[]> => {
    try {
      // Get current user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        console.error('Session error during section reflections fetch:', sessionError);
        return [];
      }

      if (!sessionData?.session?.user) {
        return []; // No user logged in
      }

      const { data, error: supabaseError } = await (supabase as any)
        .from('reflections')
        .select('*')
        .eq('section_id', sectionId)
        .eq('reflection_type', 'deep_reflection')
        .order('audio_timestamp', { ascending: true });

      if (supabaseError) {
        console.error('Supabase error fetching section reflections:', supabaseError);
        return [];
      }

      return (data || []).map((reflection: any) => ({
        ...reflection,
        formatted_timestamp: reflection.audio_timestamp 
          ? formatTimestamp(reflection.audio_timestamp) 
          : undefined
      })) as DeepReflection[];
    } catch (err) {
      console.error('Error fetching section reflections:', err);
      return [];
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
