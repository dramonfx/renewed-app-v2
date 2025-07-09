// src/lib/reflections.ts
import { supabase } from './supabaseClient';
import type { JournalEntry, MindsetType, ApiResponse } from '@/types';

// Reflection database interfaces
interface ReflectionInsert {
  user_id: string;
  question_text: string;
  answer_text: string;
  tags: string[];
  reflection_type: string;
}

interface ReflectionUpdate {
  question_text?: string;
  answer_text?: string;
  tags?: string[];
  reflection_type?: string;
  updated_at?: string;
}

interface ReflectionQueryOptions {
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
}

interface ReflectionSearchOptions {
  limit?: number;
}

interface ReflectionStats {
  total: number;
  thisWeek: number;
  thisMonth: number;
  averageLength: number;
  naturalMindEntries: number;
  transitionEntries: number;
  spiritualMindEntries: number;
}

interface DateRangeOptions {
  limit?: number;
  orderBy?: string;
  ascending?: boolean;
}

/**
 * Save a reflection (journal entry) to the database
 */
export async function saveReflection(
  questionText: string,
  answerText: string,
  tags: string[] = [],
  reflectionType: string = 'daily_reflection'
): Promise<ApiResponse<JournalEntry>> {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      // For development/mock mode, we'll create a mock user ID
      const mockUserId = 'mock-user-' + Date.now();
      console.warn('No authenticated user found. Using mock user ID for development:', mockUserId);

      // In mock mode, just return success
      return {
        data: {
          id: 'mock-' + Date.now(),
          user_id: mockUserId,
          question_text: questionText,
          answer_text: answerText,
          tags,
          reflection_type: reflectionType,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        status: 200,
      };
    }

    const insertData: ReflectionInsert = {
      user_id: sessionData.session.user.id,
      question_text: questionText,
      answer_text: answerText,
      tags,
      reflection_type: reflectionType,
    };

    const { data, error } = await (supabase as any)
      .from('reflections')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: data as JournalEntry, status: 200 };
  } catch (error) {
    console.error('Error saving reflection:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Get all reflections for the current user
 */
export async function getUserReflections(
  options: ReflectionQueryOptions = {}
): Promise<ApiResponse<JournalEntry[]>> {
  const { limit = 50, orderBy = 'created_at', ascending = false } = options;

  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      // Return empty array for unauthenticated users
      return { data: [], status: 200 };
    }

    const query = (supabase as any)
      .from('reflections')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .order(orderBy, { ascending })
      .limit(limit);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: (data as JournalEntry[]) || [], status: 200 };
  } catch (error) {
    console.error('Error fetching reflections:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Update an existing reflection
 */
export async function updateReflection(
  reflectionId: string,
  updateData: Partial<ReflectionUpdate>
): Promise<ApiResponse<JournalEntry>> {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      throw new Error('User must be authenticated to update reflections');
    }

    const updatePayload: ReflectionUpdate = {
      ...updateData,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await (supabase as any)
      .from('reflections')
      .update(updatePayload)
      .eq('id', reflectionId)
      .eq('user_id', sessionData.session.user.id) // Ensure user can only update their own reflections
      .select()
      .single();

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: data as JournalEntry, status: 200 };
  } catch (error) {
    console.error('Error updating reflection:', error);
    return {
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Delete a reflection
 */
export async function deleteReflection(
  reflectionId: string
): Promise<ApiResponse<{ success: boolean }>> {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      throw new Error('User must be authenticated to delete reflections');
    }

    const { error } = await (supabase as any)
      .from('reflections')
      .delete()
      .eq('id', reflectionId)
      .eq('user_id', sessionData.session.user.id); // Ensure user can only delete their own reflections

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: { success: true }, status: 200 };
  } catch (error) {
    console.error('Error deleting reflection:', error);
    return {
      data: { success: false },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Search reflections by content or title
 */
export async function searchReflections(
  searchTerm: string,
  options: ReflectionSearchOptions = {}
): Promise<ApiResponse<JournalEntry[]>> {
  const { limit = 20 } = options;

  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      return { data: [], status: 200 };
    }

    const { data, error } = await (supabase as any)
      .from('reflections')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .or(`question_text.ilike.%${searchTerm}%,answer_text.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: (data as JournalEntry[]) || [], status: 200 };
  } catch (error) {
    console.error('Error searching reflections:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Get reflection statistics for the current user
 */
export async function getReflectionStats(): Promise<ApiResponse<ReflectionStats>> {
  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      return {
        data: {
          total: 0,
          thisWeek: 0,
          thisMonth: 0,
          averageLength: 0,
          naturalMindEntries: 0,
          transitionEntries: 0,
          spiritualMindEntries: 0,
        },
        status: 200,
      };
    }

    // Get all reflections for stats calculation
    const { data: allReflections, error: allError } = await (supabase as any)
      .from('reflections')
      .select('*')
      .eq('user_id', sessionData.session.user.id);

    if (allError) {
      throw new Error(`Database error: ${allError.message}`);
    }

    const reflections = (allReflections as JournalEntry[]) || [];
    const total = reflections.length;

    // Calculate time-based stats
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = reflections.filter((r) => new Date(r.created_at) >= oneWeekAgo).length;
    const thisMonth = reflections.filter((r) => new Date(r.created_at) >= oneMonthAgo).length;

    // Calculate average content length using answer_text
    const averageLength =
      total > 0
        ? Math.round(reflections.reduce((sum, r) => sum + (r.answer_text?.length || 0), 0) / total)
        : 0;

    return {
      data: {
        total,
        thisWeek,
        thisMonth,
        averageLength,
        naturalMindEntries: 0,
        transitionEntries: 0,
        spiritualMindEntries: 0,
      },
      status: 200,
    };
  } catch (error) {
    console.error('Error getting reflection stats:', error);
    return {
      data: {
        total: 0,
        thisWeek: 0,
        thisMonth: 0,
        averageLength: 0,
        naturalMindEntries: 0,
        transitionEntries: 0,
        spiritualMindEntries: 0,
      },
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Get reflections by date range
 */
export async function getReflectionsByDateRange(
  startDate: Date,
  endDate: Date,
  options: DateRangeOptions = {}
): Promise<ApiResponse<JournalEntry[]>> {
  const { limit = 100, orderBy = 'created_at', ascending = false } = options;

  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      return { data: [], status: 200 };
    }

    const { data, error } = await (supabase as any)
      .from('reflections')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order(orderBy, { ascending })
      .limit(limit);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: (data as JournalEntry[]) || [], status: 200 };
  } catch (error) {
    console.error('Error fetching reflections by date range:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}

/**
 * Get reflections by reflection type
 */
export async function getReflectionsByType(
  reflectionType: string,
  options: ReflectionQueryOptions = {}
): Promise<ApiResponse<JournalEntry[]>> {
  const { limit = 50, orderBy = 'created_at', ascending = false } = options;

  try {
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }

    if (!sessionData?.session?.user) {
      return { data: [], status: 200 };
    }

    const { data, error } = await (supabase as any)
      .from('reflections')
      .select('*')
      .eq('user_id', sessionData.session.user.id)
      .eq('reflection_type', reflectionType)
      .order(orderBy, { ascending })
      .limit(limit);

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    return { data: (data as JournalEntry[]) || [], status: 200 };
  } catch (error) {
    console.error('Error fetching reflections by type:', error);
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      status: 500,
    };
  }
}
