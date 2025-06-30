/**
 * Sacred Journey Storage - Robust data persistence for the spiritual journey
 * Handles all onboarding data with error-safe serialization and validation
 */

// Safe JSON stringify that handles circular references and undefined values
const safeStringify = (obj) => {
  try {
    return JSON.stringify(obj, (key, value) => {
      // Remove circular references and undefined values
      if (value === undefined || value === null) return null;
      if (typeof value === 'function') return null;
      if (typeof value === 'object' && value !== null) {
        // Check for circular reference
        try {
          JSON.stringify(value);
          return value;
        } catch (e) {
          return '[Circular Reference]';
        }
      }
      return value;
    });
  } catch (error) {
    console.warn('Safe stringify fallback:', error);
    return JSON.stringify({ error: 'Serialization failed', timestamp: new Date().toISOString() });
  }
};

// Safe JSON parse with fallback
const safeParse = (str, fallback = {}) => {
  try {
    if (!str || str === 'undefined' || str === 'null') return fallback;
    const parsed = JSON.parse(str);
    return parsed || fallback;
  } catch (error) {
    console.warn('Safe parse fallback:', error);
    return fallback;
  }
};

// Validate onboarding data structure
const validateOnboardingData = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Basic structure validation
  const requiredFields = ['selectedMind', 'assessment', 'intentions', 'selectedPath'];
  return requiredFields.every(field => data.hasOwnProperty(field));
};

// Clean onboarding data for safe storage
const cleanDataForStorage = (data) => {
  return {
    selectedMind: data.selectedMind || '',
    assessment: {
      stress_level: data.assessment?.stress_level || '',
      life_satisfaction: data.assessment?.life_satisfaction || '',
      growth_desire: data.assessment?.growth_desire || ''
    },
    intentions: Array.isArray(data.intentions) ? data.intentions : [],
    selectedPath: data.selectedPath || '',
    completedSteps: Array.isArray(data.completedSteps) ? data.completedSteps : [],
    startedAt: data.startedAt || new Date().toISOString(),
    completedAt: data.completedAt || null,
    journeyId: data.journeyId || `journey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    lastUpdated: new Date().toISOString()
  };
};

// Storage keys
const STORAGE_KEYS = {
  ONBOARDING_DATA: 'renewed_sacred_journey_data',
  ONBOARDING_COMPLETE: 'renewed_sacred_journey_complete',
  JOURNEY_PROGRESS: 'renewed_sacred_journey_progress',
  TEMPORARY_DATA: 'renewed_sacred_journey_temp'
};

// Sacred Journey Storage API
export const SacredJourneyStorage = {
  // Save journey data with validation and error handling
  saveJourneyData: (data) => {
    try {
      if (typeof window === 'undefined') return false;
      
      const cleanedData = cleanDataForStorage(data);
      if (!validateOnboardingData(cleanedData)) {
        console.warn('Invalid onboarding data structure');
        return false;
      }
      
      const serializedData = safeStringify(cleanedData);
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, serializedData);
      localStorage.setItem(STORAGE_KEYS.JOURNEY_PROGRESS, cleanedData.completedSteps?.length || 0);
      
      return true;
    } catch (error) {
      console.error('Failed to save journey data:', error);
      return false;
    }
  },

  // Load journey data with fallback
  loadJourneyData: () => {
    try {
      if (typeof window === 'undefined') return null;
      
      const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
      const parsed = safeParse(data);
      
      if (validateOnboardingData(parsed)) {
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.error('Failed to load journey data:', error);
      return null;
    }
  },

  // Save temporary step data (auto-save as user progresses)
  saveTempData: (stepData, stepIndex) => {
    try {
      if (typeof window === 'undefined') return false;
      
      const tempData = {
        stepData: cleanDataForStorage(stepData),
        stepIndex,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.TEMPORARY_DATA, safeStringify(tempData));
      return true;
    } catch (error) {
      console.error('Failed to save temp data:', error);
      return false;
    }
  },

  // Load temporary data
  loadTempData: () => {
    try {
      if (typeof window === 'undefined') return null;
      
      const data = localStorage.getItem(STORAGE_KEYS.TEMPORARY_DATA);
      return safeParse(data);
    } catch (error) {
      console.error('Failed to load temp data:', error);
      return null;
    }
  },

  // Mark journey as complete
  markJourneyComplete: (finalData) => {
    try {
      if (typeof window === 'undefined') return false;
      
      const success = SacredJourneyStorage.saveJourneyData({
        ...finalData,
        completedAt: new Date().toISOString()
      });
      
      if (success) {
        localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
      }
      
      return success;
    } catch (error) {
      console.error('Failed to mark journey complete:', error);
      return false;
    }
  },

  // Check if journey is complete
  isJourneyComplete: () => {
    try {
      if (typeof window === 'undefined') return false;
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
    } catch (error) {
      return false;
    }
  },

  // Clear all journey data (for testing or restart)
  clearJourneyData: () => {
    try {
      if (typeof window === 'undefined') return false;
      
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      
      return true;
    } catch (error) {
      console.error('Failed to clear journey data:', error);
      return false;
    }
  },

  // Get journey progress percentage
  getJourneyProgress: () => {
    try {
      if (typeof window === 'undefined') return 0;
      
      const progress = localStorage.getItem(STORAGE_KEYS.JOURNEY_PROGRESS);
      return parseInt(progress) || 0;
    } catch (error) {
      return 0;
    }
  }
};

export default SacredJourneyStorage;