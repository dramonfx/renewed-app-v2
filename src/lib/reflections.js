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