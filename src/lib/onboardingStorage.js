
/**
 * Sacred Path localStorage Management System
 * 
 * Minimal utility for persisting Sacred Path onboarding data
 * following established project storage patterns.
 */

// Storage keys
const STORAGE_KEYS = {
  SACRED_PATH: 'sacred_path_selection',
  ONBOARDING_COMPLETED: 'sacred_onboarding_completed',
  ONBOARDING_DATA: 'sacred_onboarding_data'
}

// Safe JSON operations with error handling
const safeJSONParse = (data, fallback = null) => {
  try {
    return JSON.parse(data) || fallback
  } catch (error) {
    console.warn('Failed to parse JSON data:', error)
    return fallback
  }
}

const safeJSONStringify = (data) => {
  try {
    return JSON.stringify(data)
  } catch (error) {
    console.error('Failed to stringify data:', error)
    throw new Error('Failed to save data')
  }
}

// Check localStorage availability
const checkStorageAvailability = () => {
  try {
    const testKey = '__sacred_path_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch (error) {
    console.error('localStorage not available:', error)
    return false
  }
}

/**
 * Sacred Path Storage Operations
 */
export const onboardingStorage = {
  
  /**
   * Save Sacred Path selection and onboarding data
   */
  saveSacredPath: (onboardingData) => {
    if (!checkStorageAvailability()) {
      console.warn('Storage not available - Sacred Path will not persist')
      return false
    }
    
    try {
      const pathData = {
        selectedPath: onboardingData.selectedPath,
        intentions: onboardingData.intentions || [],
        selectedMind: onboardingData.selectedMind,
        completed_at: new Date().toISOString()
      }
      
      // Save individual components
      localStorage.setItem(STORAGE_KEYS.SACRED_PATH, onboardingData.selectedPath || '')
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true')
      localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, safeJSONStringify(pathData))
      
      return true
    } catch (error) {
      console.error('Failed to save Sacred Path:', error)
      return false
    }
  },
  
  /**
   * Get Sacred Path selection
   */
  getSacredPath: () => {
    if (!checkStorageAvailability()) {
      return null
    }
    
    try {
      return localStorage.getItem(STORAGE_KEYS.SACRED_PATH) || null
    } catch (error) {
      console.error('Failed to retrieve Sacred Path:', error)
      return null
    }
  },
  
  /**
   * Get complete onboarding data
   */
  getSacredPathInfo: () => {
    if (!checkStorageAvailability()) {
      return null
    }
    
    try {
      return safeJSONParse(localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA), null)
    } catch (error) {
      console.error('Failed to retrieve Sacred Path info:', error)
      return null
    }
  },
  
  /**
   * Check if onboarding has been completed
   */
  isOnboardingCompleted: () => {
    if (!checkStorageAvailability()) {
      return false
    }
    
    try {
      return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED) === 'true'
    } catch (error) {
      console.error('Failed to check onboarding status:', error)
      return false
    }
  },
  
  /**
   * Clear onboarding data (for testing/reset)
   */
  clearOnboardingData: () => {
    if (!checkStorageAvailability()) {
      return false
    }
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SACRED_PATH)
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_COMPLETED)
      localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA)
      return true
    } catch (error) {
      console.error('Failed to clear onboarding data:', error)
      return false
    }
  }
}

// Export default for easy import
export default onboardingStorage
