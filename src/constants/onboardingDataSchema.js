/**
 * Onboarding Data Schema and Initial State
 * 
 * This file defines the complete structure of onboarding data
 * and provides the initial state with proper defaults.
 */

export const INITIAL_ONBOARDING_DATA = {
  // From TwoMindsStep - which mind the user identifies with most
  selectedMind: '',
  
  // From AssessmentStep - user's current state assessment responses
  assessment: {
    stress_level: '',
    life_satisfaction: '',
    growth_desire: ''
  },
  
  // From IntentionsStep - array of selected intentions (predefined IDs and custom strings)
  intentions: [],
  
  // From PathSelectionStep - selected transformation path
  selectedPath: '',
  
  // Additional metadata for tracking progress
  completedSteps: [],
  startedAt: null,
  completedAt: null
};

/**
 * Helper function to safely update onboarding data
 * Ensures data structure integrity during updates
 */
export const updateOnboardingData = (currentData, newData) => {
  return {
    ...INITIAL_ONBOARDING_DATA,
    ...currentData,
    ...newData,
    // Ensure assessment object is always properly structured
    assessment: {
      ...INITIAL_ONBOARDING_DATA.assessment,
      ...(currentData.assessment || {}),
      ...(newData.assessment || {})
    }
  };
};

/**
 * Validation helpers for each step
 */
export const validateStepData = {
  twoMinds: (data) => Boolean(data.selectedMind),
  assessment: (data) => {
    const assessment = data.assessment || {};
    return Boolean(
      assessment.stress_level && 
      assessment.life_satisfaction && 
      assessment.growth_desire
    );
  },
  intentions: (data) => Array.isArray(data.intentions) && data.intentions.length > 0,
  pathSelection: (data) => Boolean(data.selectedPath)
};

/**
 * Get safe data for each step component
 * Provides fallbacks to prevent undefined errors
 */
export const getSafeStepData = (onboardingData = {}) => ({
  selectedMind: onboardingData.selectedMind || '',
  assessment: onboardingData.assessment || INITIAL_ONBOARDING_DATA.assessment,
  intentions: onboardingData.intentions || [],
  selectedPath: onboardingData.selectedPath || '',
  completedSteps: onboardingData.completedSteps || []
});
