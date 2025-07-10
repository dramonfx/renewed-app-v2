
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Spiritual Journey Stages
export type SpiritualStage = 'seed' | 'growth' | 'maturity' | 'mastery';

// Spiritual Engagement Metrics
export interface SpiritualEngagement {
  journalEntries: number;
  journalDaysActive: number;
  totalReflectionTime: number;
  audioListeningTime: number;
  sectionsRead: number;
  currentStage: SpiritualStage;
  stageProgress: number;
}

// Available Features that can be unlocked
export interface SacredFeature {
  key: string;
  title: string;
  description: string;
  path?: string;
  icon: string;
  stage: SpiritualStage;
  isUnlocked: boolean;
  isCore: boolean;
  unlockMessage?: string;
}

// Context Interface
interface SpiritualJourneyContextType {
  // Core state
  currentStage: SpiritualStage;
  engagement: SpiritualEngagement;
  features: SacredFeature[];
  
  // Simplicity mode
  isSimplicityMode: boolean;
  toggleSimplicityMode: () => void;
  
  // Feature management
  isFeatureUnlocked: (featureKey: string) => boolean;
  getUnlockedFeatures: () => SacredFeature[];
}

// Create context
const SpiritualJourneyContext = createContext<SpiritualJourneyContextType | undefined>(undefined);

// Default features configuration
const defaultFeatures: SacredFeature[] = [
  {
    key: 'basic_audio',
    title: 'Sacred Audio',
    description: 'Listen to spiritual teachings',
    path: '/full-audio-player',
    icon: '🎧',
    stage: 'seed',
    isUnlocked: true,
    isCore: true
  },
  {
    key: 'basic_journal',
    title: 'Sacred Journal',
    description: 'Record your spiritual thoughts',
    path: '/journal',
    icon: '📝',
    stage: 'seed',
    isUnlocked: true,
    isCore: true
  },
  {
    key: 'deep_reflections',
    title: 'Deep Reflections',
    description: 'Profound spiritual contemplations',
    path: '/reflections',
    icon: '🤔',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Deep reflections unlocked! Dive into sacred mysteries.'
  }
];

// Provider Component
interface SpiritualJourneyProviderProps {
  children: ReactNode;
}

export const SpiritualJourneyProvider: React.FC<SpiritualJourneyProviderProps> = ({ children }) => {
  // Core state
  const [currentStage, setCurrentStage] = useState<SpiritualStage>('seed');
  const [isSimplicityMode, setIsSimplicityMode] = useState(true);
  
  // Initialize state from localStorage or defaults
  const [engagement, setEngagement] = useState<SpiritualEngagement>({
    journalEntries: 0,
    journalDaysActive: 0,
    totalReflectionTime: 0,
    audioListeningTime: 0,
    sectionsRead: 0,
    currentStage: 'seed',
    stageProgress: 0
  });
  
  const [features, setFeatures] = useState<SacredFeature[]>(defaultFeatures);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      // Load simplicity mode preference
      const savedSimplicity = localStorage.getItem('renewedSimplicityMode');
      if (savedSimplicity !== null) {
        setIsSimplicityMode(JSON.parse(savedSimplicity));
      }

      // Calculate current engagement from existing localStorage data
      const journalEntries = JSON.parse(localStorage.getItem('sacred_journal_entries') || '[]');
      const journalCount = journalEntries.length;
      
      // Calculate days active
      const uniqueDates = [...new Set(journalEntries.map((entry: any) => 
        new Date(entry.created_at).toDateString()
      ))];
      const daysActive = uniqueDates.length;
      
      // Audio time from metrics
      const savedMetrics = localStorage.getItem('renewedSpiritualMetrics');
      const existingMetrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      const audioTime = existingMetrics.totalReadingTime || 0;
      
      const newEngagement: SpiritualEngagement = {
        journalEntries: journalCount,
        journalDaysActive: daysActive,
        totalReflectionTime: 0,
        audioListeningTime: audioTime,
        sectionsRead: existingMetrics.sectionsCompleted || 0,
        currentStage: journalCount > 5 ? 'growth' : 'seed',
        stageProgress: Math.min((journalCount / 10) * 100, 100)
      };
      
      setEngagement(newEngagement);
      setCurrentStage(newEngagement.currentStage);
      
      // Unlock features based on progress
      const updatedFeatures = features.map(feature => {
        if (feature.key === 'deep_reflections' && journalCount >= 3) {
          return { ...feature, isUnlocked: true };
        }
        return feature;
      });
      setFeatures(updatedFeatures);
      
    } catch (error) {
      console.error('Error loading spiritual journey state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('renewedSimplicityMode', JSON.stringify(isSimplicityMode));
    } catch (error) {
      console.error('Error saving spiritual journey state:', error);
    }
  }, [isSimplicityMode]);

  // Feature management functions
  const isFeatureUnlocked = (featureKey: string): boolean => {
    const feature = features.find(f => f.key === featureKey);
    return feature ? (feature.isCore || feature.isUnlocked) : false;
  };

  const getUnlockedFeatures = (): SacredFeature[] => {
    return features.filter(f => f.isCore || f.isUnlocked);
  };

  // Simplicity mode toggle
  const toggleSimplicityMode = () => {
    setIsSimplicityMode(!isSimplicityMode);
  };

  const contextValue: SpiritualJourneyContextType = {
    // Core state
    currentStage,
    engagement,
    features,
    
    // Simplicity mode
    isSimplicityMode,
    toggleSimplicityMode,
    
    // Feature management
    isFeatureUnlocked,
    getUnlockedFeatures
  };

  return (
    <SpiritualJourneyContext.Provider value={contextValue}>
      {children}
    </SpiritualJourneyContext.Provider>
  );
};

// Hook for using the context
export const useSpiritualJourney = (): SpiritualJourneyContextType => {
  const context = useContext(SpiritualJourneyContext);
  if (context === undefined) {
    throw new Error('useSpiritualJourney must be used within a SpiritualJourneyProvider');
  }
  return context;
};

// Export types for use in other components
export type { SpiritualJourneyContextType };
