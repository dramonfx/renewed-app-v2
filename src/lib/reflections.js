
// src/lib/reflections.js
import { supabase } from './supabaseClient';

/**
 * Save a reflection (question and answer) to the database
 * @param {string} questionText - The question that was asked
 * @param {string} answerText - The user's answer/response
 * @returns {Promise<Object>} - The saved reflection data or error
 */
export async function saveReflection(questionText, answerText) {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
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
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        error: null
      };
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: session.user.id,
        question_text: questionText,
        answer_text: answerText
      })
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { data, error: null };
    
  } catch (error) {
    console.error('Error saving reflection:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Get all reflections for the current user
 * @param {Object} options - Query options
 * @param {number} options.limit - Maximum number of reflections to return
 * @param {string} options.orderBy - Field to order by (default: 'created_at')
 * @param {boolean} options.ascending - Sort order (default: false for newest first)
 * @returns {Promise<Object>} - Array of reflections or error
 */
export async function getUserReflections(options = {}) {
  const {
    limit = 50,
    orderBy = 'created_at',
    ascending = false
  } = options;
  
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      // Return empty array for unauthenticated users
      return { data: [], error: null };
    }
    
    let query = supabase
      .from('reflections')
      .select('*')
      .eq('user_id', session.user.id)
      .order(orderBy, { ascending })
      .limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { data: data || [], error: null };
    
  } catch (error) {
    console.error('Error fetching reflections:', error);
    return { data: [], error: error.message };
  }
}

/**
 * Update an existing reflection
 * @param {string} reflectionId - The ID of the reflection to update
 * @param {string} answerText - The new answer text
 * @returns {Promise<Object>} - The updated reflection data or error
 */
export async function updateReflection(reflectionId, answerText) {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      throw new Error('User must be authenticated to update reflections');
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .update({
        answer_text: answerText,
        updated_at: new Date().toISOString()
      })
      .eq('id', reflectionId)
      .eq('user_id', session.user.id) // Ensure user can only update their own reflections
      .select()
      .single();
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { data, error: null };
    
  } catch (error) {
    console.error('Error updating reflection:', error);
    return { data: null, error: error.message };
  }
}

/**
 * Delete a reflection
 * @param {string} reflectionId - The ID of the reflection to delete
 * @returns {Promise<Object>} - Success status or error
 */
export async function deleteReflection(reflectionId) {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      throw new Error('User must be authenticated to delete reflections');
    }
    
    const { error } = await supabase
      .from('reflections')
      .delete()
      .eq('id', reflectionId)
      .eq('user_id', session.user.id); // Ensure user can only delete their own reflections
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { success: true, error: null };
    
  } catch (error) {
    console.error('Error deleting reflection:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Search reflections by question or answer text
 * @param {string} searchTerm - The term to search for
 * @param {Object} options - Search options
 * @param {number} options.limit - Maximum number of results
 * @returns {Promise<Object>} - Array of matching reflections or error
 */
export async function searchReflections(searchTerm, options = {}) {
  const { limit = 20 } = options;
  
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', session.user.id)
      .or(`question_text.ilike.%${searchTerm}%,answer_text.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { data: data || [], error: null };
    
  } catch (error) {
    console.error('Error searching reflections:', error);
    return { data: [], error: error.message };
  }
}

/**
 * Get reflection statistics for the current user
 * @returns {Promise<Object>} - Statistics object or error
 */
export async function getReflectionStats() {
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      return { 
        data: { 
          total: 0, 
          thisWeek: 0, 
          thisMonth: 0,
          averageLength: 0 
        }, 
        error: null 
      };
    }
    
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('reflections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id);
    
    if (totalError) {
      throw new Error(`Database error: ${totalError.message}`);
    }
    
    // Get this week's count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: thisWeek, error: weekError } = await supabase
      .from('reflections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', oneWeekAgo.toISOString());
    
    if (weekError) {
      throw new Error(`Database error: ${weekError.message}`);
    }
    
    // Get this month's count
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { count: thisMonth, error: monthError } = await supabase
      .from('reflections')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', session.user.id)
      .gte('created_at', oneMonthAgo.toISOString());
    
    if (monthError) {
      throw new Error(`Database error: ${monthError.message}`);
    }
    
    // Get average answer length
    const { data: reflections, error: avgError } = await supabase
      .from('reflections')
      .select('answer_text')
      .eq('user_id', session.user.id);
    
    if (avgError) {
      throw new Error(`Database error: ${avgError.message}`);
    }
    
    const averageLength = reflections && reflections.length > 0
      ? Math.round(reflections.reduce((sum, r) => sum + (r.answer_text?.length || 0), 0) / reflections.length)
      : 0;
    
    return {
      data: {
        total: total || 0,
        thisWeek: thisWeek || 0,
        thisMonth: thisMonth || 0,
        averageLength
      },
      error: null
    };
    
  } catch (error) {
    console.error('Error getting reflection stats:', error);
    return { 
      data: { 
        total: 0, 
        thisWeek: 0, 
        thisMonth: 0,
        averageLength: 0 
      }, 
      error: error.message 
    };
  }
}

/**
 * Get reflections by date range
 * @param {Date} startDate - Start date for the range
 * @param {Date} endDate - End date for the range
 * @param {Object} options - Query options
 * @returns {Promise<Object>} - Array of reflections or error
 */
export async function getReflectionsByDateRange(startDate, endDate, options = {}) {
  const { limit = 100, orderBy = 'created_at', ascending = false } = options;
  
  try {
    // Get current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      throw new Error(`Session error: ${sessionError.message}`);
    }
    
    if (!session?.user) {
      return { data: [], error: null };
    }
    
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .eq('user_id', session.user.id)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order(orderBy, { ascending })
      .limit(limit);
    
    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }
    
    return { data: data || [], error: null };
    
  } catch (error) {
    console.error('Error fetching reflections by date range:', error);
    return { data: [], error: error.message };
  }
}
