'use client';
import { useState, useEffect, useCallback } from 'react';
import { SacredJourneyStorage } from '@/lib/sacredJourneyStorage';
import { INITIAL_ONBOARDING_DATA, updateOnboardingData } from '@/constants/onboardingDataSchema';

/**
 * Sacred Journey Hook
 * Manages the complete spiritual journey state with robust persistence
 */
export const useSacredJourney = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [journeyData, setJourneyData] = useState(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load journey data on mount
  useEffect(() => {
    const loadJourneyState = async () => {
      try {
        setIsLoading(true);

        // Try to load existing journey data
        const savedData = SacredJourneyStorage.loadJourneyData();
        const tempData = SacredJourneyStorage.loadTempData();

        if (savedData) {
          setJourneyData(savedData);
        } else if (tempData?.stepData) {
          setJourneyData(tempData.stepData);
          setCurrentStep(tempData.stepIndex || 0);
        }

        setError(null);
      } catch (err) {
        console.error('Failed to load journey state:', err);
        setError('Failed to load your previous progress. Starting fresh.');
      } finally {
        setIsLoading(false);
      }
    };

    loadJourneyState();
  }, []);

  // Auto-save temporary data when journey data changes
  useEffect(() => {
    if (!isLoading && journeyData !== INITIAL_ONBOARDING_DATA) {
      const saveTemp = () => {
        try {
          SacredJourneyStorage.saveTempData(journeyData, currentStep);
          setHasUnsavedChanges(false);
        } catch (err) {
          console.error('Failed to auto-save:', err);
        }
      };

      const debounce = setTimeout(saveTemp, 1000); // Debounce auto-save
      return () => clearTimeout(debounce);
    }
  }, [journeyData, currentStep, isLoading]);

  // Update journey data with validation
  const updateJourneyData = useCallback((newData) => {
    try {
      setJourneyData((prev) => {
        const updated = updateOnboardingData(prev, newData);
        setHasUnsavedChanges(true);
        return updated;
      });
      setError(null);
    } catch (err) {
      console.error('Failed to update journey data:', err);
      setError('Failed to save your progress. Please try again.');
    }
  }, []);

  // Navigate to next step
  const goToNextStep = useCallback(
    (stepData = {}) => {
      updateJourneyData(stepData);
      setCurrentStep((prev) => prev + 1);
    },
    [updateJourneyData]
  );

  // Navigate to previous step
  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  // Complete the sacred journey
  const completeJourney = useCallback(
    async (finalData = {}) => {
      try {
        setIsLoading(true);

        const finalJourneyData = updateOnboardingData(journeyData, finalData);
        const success = SacredJourneyStorage.markJourneyComplete(finalJourneyData);

        if (success) {
          setJourneyData(finalJourneyData);
          setHasUnsavedChanges(false);
          setError(null);
          return true;
        } else {
          throw new Error('Failed to save completion');
        }
      } catch (err) {
        console.error('Failed to complete journey:', err);
        setError('Failed to save your sacred journey completion. Please try again.');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [journeyData, updateJourneyData]
  );

  // Save journey progress manually
  const saveProgress = useCallback(async () => {
    try {
      const success = SacredJourneyStorage.saveJourneyData(journeyData);
      if (success) {
        setHasUnsavedChanges(false);
        setError(null);
        return true;
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      console.error('Failed to save progress:', err);
      setError('Failed to save your progress. Please try again.');
      return false;
    }
  }, [journeyData]);

  // Reset journey (for testing or restart)
  const resetJourney = useCallback(() => {
    try {
      SacredJourneyStorage.clearJourneyData();
      setJourneyData(INITIAL_ONBOARDING_DATA);
      setCurrentStep(0);
      setHasUnsavedChanges(false);
      setError(null);
    } catch (err) {
      console.error('Failed to reset journey:', err);
      setError('Failed to reset journey. Please refresh the page.');
    }
  }, []);

  // Check if journey is complete
  const isJourneyComplete = useCallback(() => {
    return SacredJourneyStorage.isJourneyComplete();
  }, []);

  return {
    // State
    currentStep,
    journeyData,
    isLoading,
    error,
    hasUnsavedChanges,

    // Actions
    updateJourneyData,
    goToNextStep,
    goToPreviousStep,
    completeJourney,
    saveProgress,
    resetJourney,

    // Utilities
    isJourneyComplete,

    // Direct step setters for advanced use
    setCurrentStep,
    setJourneyData,
  };
};

export default useSacredJourney;
