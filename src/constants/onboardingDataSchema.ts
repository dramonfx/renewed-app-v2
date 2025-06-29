/**
 * Onboarding Data Schema and Initial State
 * 
 * This file defines the complete structure of onboarding data
 * and provides the initial state with proper defaults.
 */

// TypeScript interfaces for onboarding data
export interface AssessmentData {
  stress_level: string;
  life_satisfaction: string;
  growth_desire: string;
}

export interface OnboardingData {
  selectedMind: string;
  assessment: AssessmentData;
  intentions: string[];
  selectedPath: string;
  completedSteps: string[];
  startedAt: string | null;
  completedAt: string | null;
}

export interface StepValidationResult {
  isValid: boolean;
  errors?: string[];
}

export type OnboardingStepKey = 'twoMinds' | 'assessment' | 'intentions' | 'pathSelection';

// Initial onboarding data with proper typing
export const INITIAL_ONBOARDING_DATA: OnboardingData = {
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
export function updateOnboardingData(
  currentData: Partial<OnboardingData>, 
  newData: Partial<OnboardingData>
): OnboardingData {
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
}

/**
 * Validation helpers for each step
 */
export const validateStepData: Record<OnboardingStepKey, (data: Partial<OnboardingData>) => boolean> = {
  twoMinds: (data: Partial<OnboardingData>): boolean => Boolean(data.selectedMind),
  
  assessment: (data: Partial<OnboardingData>): boolean => {
    const assessment = data.assessment;
    return Boolean(
      assessment?.stress_level && 
      assessment?.life_satisfaction && 
      assessment?.growth_desire
    );
  },
  
  intentions: (data: Partial<OnboardingData>): boolean => {
    return Array.isArray(data.intentions) && data.intentions.length > 0;
  },
  
  pathSelection: (data: Partial<OnboardingData>): boolean => Boolean(data.selectedPath)
};

/**
 * Get safe data for each step component
 * Provides fallbacks to prevent undefined errors
 */
export function getSafeStepData(onboardingData: Partial<OnboardingData> = {}): OnboardingData {
  return {
    selectedMind: onboardingData.selectedMind || '',
    assessment: onboardingData.assessment || INITIAL_ONBOARDING_DATA.assessment,
    intentions: onboardingData.intentions || [],
    selectedPath: onboardingData.selectedPath || '',
    completedSteps: onboardingData.completedSteps || [],
    startedAt: onboardingData.startedAt || null,
    completedAt: onboardingData.completedAt || null
  };
}

/**
 * Check if a specific step is completed
 */
export function isStepCompleted(stepKey: OnboardingStepKey, data: Partial<OnboardingData>): boolean {
  return validateStepData[stepKey](data);
}

/**
 * Get the next incomplete step
 */
export function getNextIncompleteStep(data: Partial<OnboardingData>): OnboardingStepKey | null {
  const stepOrder: OnboardingStepKey[] = ['twoMinds', 'assessment', 'intentions', 'pathSelection'];
  
  for (const step of stepOrder) {
    if (!isStepCompleted(step, data)) {
      return step;
    }
  }
  
  return null; // All steps completed
}

/**
 * Calculate onboarding progress percentage
 */
export function calculateOnboardingProgress(data: Partial<OnboardingData>): number {
  const totalSteps = 4;
  const completedSteps = Object.keys(validateStepData).filter(step => 
    validateStepData[step as OnboardingStepKey](data)
  ).length;
  
  return Math.round((completedSteps / totalSteps) * 100);
}