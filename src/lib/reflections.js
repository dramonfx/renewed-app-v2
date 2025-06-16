// src/lib/reflections.js
import { supabase } from './supabaseClient';

/**
 * Save a reflection (assessment answer) to the database
 * @param {string} questionId - Unique identifier for the question
 * @param {string} questionText - The question text
 * @param {string} answerText - The selected answer text
 * @returns {Promise<{data, error}>}
 */
export async function saveReflection(questionId, questionText, answerText) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Insert reflection
    const { data, error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        question_id: questionId,
        question_text: questionText,
        answer_text: answerText
      })
      .select()
      .single();

    return { data, error };
  } catch (err) {
    console.error('Error saving reflection:', err);
    return { data: null, error: err.message };
  }
}

/**
 * Get all reflections for the current user
 * @returns {Promise<{data, error}>}
 */
export async function getUserReflections() {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .select('*')
      .order('created_at', { ascending: true });

    return { data, error };
  } catch (err) {
    console.error('Error fetching reflections:', err);
    return { data: null, error: err.message };
  }
}

/**
 * Save multiple reflections in batch
 * @param {Array} reflections - Array of reflection objects
 * @returns {Promise<{data, error}>}
 */
export async function saveReflectionsBatch(reflections) {
  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { data: null, error: 'User not authenticated' };
    }

    // Prepare reflections with user_id
    const reflectionsWithUserId = reflections.map(reflection => ({
      ...reflection,
      user_id: user.id
    }));

    // Insert all reflections
    const { data, error } = await supabase
      .from('reflections')
      .insert(reflectionsWithUserId)
      .select();

    return { data, error };
  } catch (err) {
    console.error('Error saving reflections batch:', err);
    return { data: null, error: err.message };
  }
}