
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Spiritual Journey Stages
export type SpiritualStage = 'seed' | 'growth' | 'maturity' | 'mastery';

// Spiritual Milestones for unlocking features
export interface SpiritualMilestone {
  id: string;
  title: string;
  description: string;
  stage: SpiritualStage;
  unlocks: string[]; // Feature keys that get unlocked
  requirement: {
    type: 'journal_entries' | 'audio_time' | 'reflections' | 'consistency' | 'sections_read';
    value: number;
    timeframe?: 'day' | 'week' | 'month' | 'all_time';
  };
  achieved: boolean;
  achievedAt?: Date;
  celebration?: {
    title: string;
    message: string;
    icon: string;
  };
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
  isCore: boolean; // Core features always available
  unlockMessage?: string;
}

// Spiritual Engagement Metrics
export interface SpiritualEngagement {
  // Core engagement
  journalEntries: number;
  journalDaysActive: number;
  totalReflectionTime: number; // minutes
  audioListeningTime: number; // minutes
  sectionsRead: number;
  
  // Quality metrics
  averageJournalDepth: number; // based on word count and reflection quality
  consistencyScore: number; // 0-100
  mindfulnessScore: number; // 0-100
  
  // Time-based metrics
  lastActiveDate: Date;
  currentStreak: number; // days
  longestStreak: number; // days
  
  // Stage progression
  currentStage: SpiritualStage;
  stageProgress: number; // 0-100 within current stage
}

// Context Interface
interface SpiritualJourneyContextType {
  // Core state
  currentStage: SpiritualStage;
  engagement: SpiritualEngagement;
  milestones: SpiritualMilestone[];
  features: SacredFeature[];
  
  // Simplicity mode
  isSimplicityMode: boolean;
  toggleSimplicityMode: () => void;
  
  // Feature management
  isFeatureUnlocked: (featureKey: string) => boolean;
  getUnlockedFeatures: () => SacredFeature[];
  getNextMilestone: () => SpiritualMilestone | null;
  
  // Progress tracking
  updateEngagement: (metrics: Partial<SpiritualEngagement>) => void;
  checkMilestones: () => SpiritualMilestone[];
  calculateStageProgress: () => number;
  
  // Celebration
  showCelebration: (milestone: SpiritualMilestone) => void;
  dismissCelebration: () => void;
  pendingCelebration: SpiritualMilestone | null;
}

// Create context
const SpiritualJourneyContext = createContext<SpiritualJourneyContextType | undefined>(undefined);

// Default milestones configuration
const defaultMilestones: SpiritualMilestone[] = [
  // SEED STAGE - First spiritual steps
  {
    id: 'first_journal',
    title: 'First Sacred Word',
    description: 'Write your first journal entry',
    stage: 'seed',
    unlocks: ['journal_rich_editor'],
    requirement: { type: 'journal_entries', value: 1 },
    achieved: false,
    celebration: {
      title: '🌱 First Sacred Word',
      message: 'You have taken your first step into sacred reflection. The journey of a thousand miles begins with a single word.',
      icon: '🌱'
    }
  },
  {
    id: 'three_journal_entries',
    title: 'Sacred Rhythm',
    description: 'Complete 3 journal entries',
    stage: 'seed',
    unlocks: ['mindset_tracker'],
    requirement: { type: 'journal_entries', value: 3 },
    achieved: false,
    celebration: {
      title: '🎵 Sacred Rhythm Found',
      message: 'A rhythm of reflection is forming. Your heart is learning the language of the spirit.',
      icon: '🎵'
    }
  },
  {
    id: 'audio_first_moments',
    title: 'First Sacred Sounds',
    description: 'Listen to audio for 3 minutes',
    stage: 'seed',
    unlocks: ['audio_volume_control'],
    requirement: { type: 'audio_time', value: 3 },
    achieved: false,
    celebration: {
      title: '🔊 First Sacred Sounds',
      message: 'You have begun to attune your ears to divine wisdom. Volume control is now yours.',
      icon: '🔊'
    }
  },
  {
    id: 'audio_contemplative_pace',
    title: 'Finding Your Pace',
    description: 'Listen to audio for 5 minutes',
    stage: 'seed',
    unlocks: ['audio_speed_control'],
    requirement: { type: 'audio_time', value: 5 },
    achieved: false,
    celebration: {
      title: '⚡ Sacred Pace',
      message: 'Every soul has its own rhythm of understanding. Speed control unlocked for your contemplative journey.',
      icon: '⚡'
    }
  },
  {
    id: 'audio_first_session',
    title: 'Sacred Listening',
    description: 'Listen to audio for 10 minutes',
    stage: 'seed',
    unlocks: ['audio_bookmarks'],
    requirement: { type: 'audio_time', value: 10 },
    achieved: false,
    celebration: {
      title: '👂 Sacred Listening',
      message: 'You have opened your heart to divine wisdom through sacred sound.',
      icon: '👂'
    }
  },
  
  // GROWTH STAGE - Developing spiritual habits
  {
    id: 'week_consistency',
    title: 'Weekly Sacred Discipline',
    description: 'Journal for 3 days in a week',
    stage: 'growth',
    unlocks: ['growth_metrics', 'reflection_prompts'],
    requirement: { type: 'consistency', value: 3, timeframe: 'week' },
    achieved: false,
    celebration: {
      title: '🌿 Sacred Discipline',
      message: 'Consistency breeds transformation. Your faithful practice is building spiritual strength.',
      icon: '🌿'
    }
  },
  {
    id: 'first_reflection',
    title: 'Deep Contemplation',
    description: 'Complete your first deep reflection',
    stage: 'growth',
    unlocks: ['deep_reflections', 'sacred_questions'],
    requirement: { type: 'reflections', value: 1 },
    achieved: false,
    celebration: {
      title: '🤔 Deep Contemplation',
      message: 'You have dived beneath the surface. Sacred mysteries await those who seek with sincere hearts.',
      icon: '🤔'
    }
  },
  {
    id: 'audio_dedicated_listening',
    title: 'Dedicated Listening',
    description: 'Listen to audio for 20 minutes',
    stage: 'growth',
    unlocks: ['audio_progress_tracking'],
    requirement: { type: 'audio_time', value: 20 },
    achieved: false,
    celebration: {
      title: '📍 Sacred Memory',
      message: 'Your dedication is noticed. Your listening progress will now be remembered across sessions.',
      icon: '📍'
    }
  },
  {
    id: 'audio_deeper_engagement',
    title: 'Deeper Audio Engagement',
    description: 'Listen to audio for 30 minutes',
    stage: 'growth',
    unlocks: ['audio_skip_controls'],
    requirement: { type: 'audio_time', value: 30 },
    achieved: false,
    celebration: {
      title: '⏯️ Precise Navigation',
      message: 'You seek to understand with precision. Skip controls are now available for your focused study.',
      icon: '⏯️'
    }
  },
  {
    id: 'audio_hour',
    title: 'Hour of Sacred Sound',
    description: 'Listen to one hour of audio content',
    stage: 'growth',
    unlocks: ['progress_charts'],
    requirement: { type: 'audio_time', value: 60 },
    achieved: false,
    celebration: {
      title: '🎧 Hour of Sacred Sound',
      message: 'An hour of divine wisdom has flowed through your consciousness. Let it take root.',
      icon: '🎧'
    }
  },
  
  // MATURITY STAGE - Deepening spiritual practice
  {
    id: 'month_consistency',
    title: 'Sacred Faithfulness',
    description: 'Journal consistently for a month',
    stage: 'maturity',
    unlocks: ['milestone_celebrations', 'wisdom_insights'],
    requirement: { type: 'consistency', value: 20, timeframe: 'month' },
    achieved: false,
    celebration: {
      title: '🏛️ Sacred Faithfulness',
      message: 'A month of faithfulness has built a temple of wisdom in your heart.',
      icon: '🏛️'
    }
  },
  {
    id: 'audio_mastery_listening',
    title: 'Audio Mastery Path',
    description: 'Listen to audio for 90 minutes total',
    stage: 'maturity',
    unlocks: ['audio_track_navigation'],
    requirement: { type: 'audio_time', value: 90 },
    achieved: false,
    celebration: {
      title: '🗺️ Audio Navigation Master',
      message: 'You have shown dedication to sacred sound. Navigation between teachings is now yours.',
      icon: '🗺️'
    }
  },
  {
    id: 'section_completion',
    title: 'Sacred Learning',
    description: 'Complete reading 2 sections',
    stage: 'maturity',
    unlocks: ['learning_analytics', 'audio_cross_track_bookmarks'],
    requirement: { type: 'sections_read', value: 2 },
    achieved: false,
    celebration: {
      title: '📚 Sacred Learning',
      message: 'Sacred texts are revealing their secrets to your prepared heart.',
      icon: '📚'
    }
  },
  {
    id: 'audio_deep_analytics',
    title: 'Audio Wisdom Tracker',
    description: 'Listen to audio for 2 hours total',
    stage: 'maturity',
    unlocks: ['audio_analytics'],
    requirement: { type: 'audio_time', value: 120 },
    achieved: false,
    celebration: {
      title: '📈 Audio Wisdom Unveiled',
      message: 'Your listening patterns reveal the depths of your spiritual hunger. Analytics unlocked.',
      icon: '📈'
    }
  },
  
  // MASTERY STAGE - Full spiritual engagement
  {
    id: 'spiritual_mastery',
    title: 'Spiritual Mastery',
    description: 'Achieve comprehensive spiritual engagement',
    stage: 'mastery',
    unlocks: ['advanced_analytics', 'audio_spiritual_sharing', 'audio_advanced_controls'],
    requirement: { type: 'journal_entries', value: 30 },
    achieved: false,
    celebration: {
      title: '✨ Spiritual Mastery',
      message: 'You have walked the path with dedication. Now you may guide others in their sacred journey.',
      icon: '✨'
    }
  }
];

// Default features configuration
const defaultFeatures: SacredFeature[] = [
  // CORE FEATURES (always available in simplicity mode)
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
    key: 'basic_bookmarks',
    title: 'Sacred Bookmarks',
    description: 'Save meaningful moments',
    icon: '🔖',
    stage: 'seed',
    isUnlocked: true,
    isCore: true
  },
  
  // SEED STAGE - First unlockable features
  {
    key: 'journal_rich_editor',
    title: 'Enhanced Journal Editor',
    description: 'Rich text editing for deeper expression',
    icon: '✍️',
    stage: 'seed',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Rich text editing unlocked! Express yourself with deeper formatting.'
  },
  {
    key: 'mindset_tracker',
    title: 'Mindset Tracker',
    description: 'Track your spiritual mindset evolution',
    icon: '🧠',
    stage: 'seed',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Mindset tracking unlocked! Monitor your spiritual transformation.'
  },
  {
    key: 'audio_volume_control',
    title: 'Audio Volume Control',
    description: 'Adjust audio volume to your comfort',
    icon: '🔊',
    stage: 'seed',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Volume control unlocked! Create your perfect listening environment.'
  },
  {
    key: 'audio_speed_control',
    title: 'Audio Speed Control',
    description: 'Adjust listening speed for deeper contemplation',
    icon: '⚡',
    stage: 'seed',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Speed control unlocked! Listen at your contemplative pace.'
  },
  
  // GROWTH STAGE - Enhanced spiritual features
  {
    key: 'audio_bookmarks',
    title: 'Audio Bookmarks',
    description: 'Save meaningful audio moments',
    icon: '🎯',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Audio bookmarks unlocked! Mark sacred moments for reflection.'
  },
  {
    key: 'audio_progress_tracking',
    title: 'Audio Progress Memory',
    description: 'Resume listening where you left off',
    icon: '📍',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Progress tracking unlocked! Your listening journey is remembered.'
  },
  {
    key: 'audio_skip_controls',
    title: 'Audio Skip Navigation',
    description: '10-second forward/backward navigation',
    icon: '⏯️',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Skip controls unlocked! Navigate with precision through teachings.'
  },
  {
    key: 'growth_metrics',
    title: 'Growth Metrics',
    description: 'Track your spiritual development',
    icon: '📊',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Growth metrics unlocked! See your spiritual progress unfold.'
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
  },
  {
    key: 'sacred_questions',
    title: 'Sacred Questions',
    description: 'Guided spiritual inquiries',
    icon: '❓',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Sacred questions unlocked! Let divine curiosity guide you.'
  },
  {
    key: 'progress_charts',
    title: 'Progress Charts',
    description: 'Visual journey mapping',
    icon: '📈',
    stage: 'growth',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Progress charts unlocked! Visualize your sacred journey.'
  },
  
  // MATURITY STAGE - Advanced spiritual features
  {
    key: 'audio_track_navigation',
    title: 'Audio Track Navigation',
    description: 'Navigate between multiple audio sections',
    icon: '🗺️',
    stage: 'maturity',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Track navigation unlocked! Journey through complete teachings.'
  },
  {
    key: 'audio_cross_track_bookmarks',
    title: 'Cross-Track Audio Bookmarks',
    description: 'Save bookmarks across different sections',
    icon: '🌐',
    stage: 'maturity',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Advanced bookmarks unlocked! Connect insights across all teachings.'
  },
  {
    key: 'audio_analytics',
    title: 'Audio Analytics',
    description: 'Track your spiritual audio journey',
    icon: '📈',
    stage: 'maturity',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Audio analytics unlocked! See your growth through sacred sound.'
  },
  {
    key: 'milestone_celebrations',
    title: 'Milestone Celebrations',
    description: 'Celebrate spiritual achievements',
    icon: '🎉',
    stage: 'maturity',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Milestone celebrations unlocked! Honor your spiritual victories.'
  },
  {
    key: 'learning_analytics',
    title: 'Learning Analytics',
    description: 'Deep insights into your study patterns',
    icon: '🔍',
    stage: 'maturity',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Learning analytics unlocked! Understand your learning journey.'
  },
  
  // MASTERY STAGE - Master-level features
  {
    key: 'audio_spiritual_sharing',
    title: 'Sacred Audio Sharing',
    description: 'Share meaningful audio moments with others',
    icon: '🤝',
    stage: 'mastery',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Sacred sharing unlocked! Spread wisdom to fellow seekers.'
  },
  {
    key: 'audio_advanced_controls',
    title: 'Master Audio Controls',
    description: 'Complete audio mastery tools',
    icon: '🎛️',
    stage: 'mastery',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Master controls unlocked! Full dominion over your audio experience.'
  },
  {
    key: 'advanced_analytics',
    title: 'Advanced Analytics',
    description: 'Comprehensive spiritual insights',
    icon: '🧙',
    stage: 'mastery',
    isUnlocked: false,
    isCore: false,
    unlockMessage: 'Advanced analytics unlocked! Master-level insights await.'
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
  const [pendingCelebration, setPendingCelebration] = useState<SpiritualMilestone | null>(null);
  
  // Initialize state from localStorage or defaults
  const [engagement, setEngagement] = useState<SpiritualEngagement>({
    journalEntries: 0,
    journalDaysActive: 0,
    totalReflectionTime: 0,
    audioListeningTime: 0,
    sectionsRead: 0,
    averageJournalDepth: 0,
    consistencyScore: 0,
    mindfulnessScore: 0,
    lastActiveDate: new Date(),
    currentStreak: 0,
    longestStreak: 0,
    currentStage: 'seed',
    stageProgress: 0
  });
  
  const [milestones, setMilestones] = useState<SpiritualMilestone[]>(defaultMilestones);
  const [features, setFeatures] = useState<SacredFeature[]>(defaultFeatures);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      // Load simplicity mode preference
      const savedSimplicity = localStorage.getItem('renewedSimplicityMode');
      if (savedSimplicity !== null) {
        setIsSimplicityMode(JSON.parse(savedSimplicity));
      }

      // Load spiritual journey state
      const savedJourney = localStorage.getItem('renewedSpiritualJourney');
      if (savedJourney) {
        const journeyData = JSON.parse(savedJourney);
        
        if (journeyData.engagement) {
          setEngagement({
            ...journeyData.engagement,
            lastActiveDate: new Date(journeyData.engagement.lastActiveDate)
          });
        }
        
        if (journeyData.currentStage) {
          setCurrentStage(journeyData.currentStage);
        }
        
        if (journeyData.milestones) {
          setMilestones(journeyData.milestones.map((m: any) => ({
            ...m,
            achievedAt: m.achievedAt ? new Date(m.achievedAt) : undefined
          })));
        }
        
        if (journeyData.features) {
          setFeatures(journeyData.features);
        }
      }

      // Calculate current engagement from existing data
      calculateCurrentEngagement();
    } catch (error) {
      console.error('Error loading spiritual journey state:', error);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      const journeyData = {
        currentStage,
        engagement,
        milestones,
        features
      };
      localStorage.setItem('renewedSpiritualJourney', JSON.stringify(journeyData));
      localStorage.setItem('renewedSimplicityMode', JSON.stringify(isSimplicityMode));
    } catch (error) {
      console.error('Error saving spiritual journey state:', error);
    }
  }, [currentStage, engagement, milestones, features, isSimplicityMode]);

  // Calculate current engagement from existing localStorage data
  const calculateCurrentEngagement = () => {
    try {
      // Journal metrics
      const journalEntries = JSON.parse(localStorage.getItem('sacred_journal_entries') || '[]');
      const journalCount = journalEntries.length;
      
      // Calculate days active (unique dates)
      const uniqueDates = [...new Set(journalEntries.map((entry: any) => 
        new Date(entry.created_at).toDateString()
      ))];
      const daysActive = uniqueDates.length;
      
      // Calculate consistency score
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentEntries = journalEntries.filter((entry: any) => 
        new Date(entry.created_at) >= weekAgo
      );
      const consistencyScore = Math.min(100, (recentEntries.length / 7) * 100);
      
      // Calculate total word count for depth
      const totalWords = journalEntries.reduce((sum: number, entry: any) => 
        sum + (entry.word_count || 0), 0
      );
      const averageDepth = journalCount > 0 ? totalWords / journalCount : 0;
      
      // Audio time (mock for now, would be tracked by audio system)
      const savedMetrics = localStorage.getItem('renewedSpiritualMetrics');
      const existingMetrics = savedMetrics ? JSON.parse(savedMetrics) : {};
      const audioTime = existingMetrics.totalReadingTime || 0;
      
      // Sections read
      const sectionsRead = existingMetrics.sectionsCompleted || 0;
      
      // Calculate current streak
      const currentStreak = calculateCurrentStreak(journalEntries);
      
      const newEngagement: SpiritualEngagement = {
        journalEntries: journalCount,
        journalDaysActive: daysActive,
        totalReflectionTime: 0, // Would be calculated from reflection system
        audioListeningTime: audioTime,
        sectionsRead,
        averageJournalDepth: averageDepth,
        consistencyScore,
        mindfulnessScore: Math.min(100, (consistencyScore + (audioTime > 0 ? 50 : 0)) / 2),
        lastActiveDate: journalCount > 0 ? new Date(journalEntries[0].created_at) : new Date(),
        currentStreak,
        longestStreak: Math.max(currentStreak, engagement.longestStreak || 0),
        currentStage: currentStage,
        stageProgress: 0
      };
      
      setEngagement(newEngagement);
      
      // Check for newly achieved milestones
      checkMilestonesWithEngagement(newEngagement);
    } catch (error) {
      console.error('Error calculating engagement:', error);
    }
  };

  // Calculate current streak
  const calculateCurrentStreak = (entries: any[]): number => {
    if (entries.length === 0) return 0;
    
    // Sort entries by date (newest first)
    const sortedEntries = entries.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    for (const entry of sortedEntries) {
      const entryDate = new Date(entry.created_at);
      entryDate.setHours(0, 0, 0, 0);
      
      if (entryDate.getTime() === currentDate.getTime()) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else if (entryDate.getTime() < currentDate.getTime()) {
        break;
      }
    }
    
    return streak;
  };

  // Feature management functions
  const isFeatureUnlocked = (featureKey: string): boolean => {
    const feature = features.find(f => f.key === featureKey);
    return feature ? (feature.isCore || feature.isUnlocked) : false;
  };

  const getUnlockedFeatures = (): SacredFeature[] => {
    return features.filter(f => f.isCore || f.isUnlocked);
  };

  const getNextMilestone = (): SpiritualMilestone | null => {
    const unachieved = milestones.filter(m => !m.achieved);
    return unachieved.length > 0 ? (unachieved[0] || null) : null;
  };

  // Progress tracking functions
  const updateEngagement = (metrics: Partial<SpiritualEngagement>) => {
    const updated = { ...engagement, ...metrics };
    setEngagement(updated);
    checkMilestonesWithEngagement(updated);
  };

  const checkMilestones = (): SpiritualMilestone[] => {
    return checkMilestonesWithEngagement(engagement);
  };

  const checkMilestonesWithEngagement = (eng: SpiritualEngagement): SpiritualMilestone[] => {
    const achievedMilestones: SpiritualMilestone[] = [];
    
    const updatedMilestones = milestones.map(milestone => {
      if (milestone.achieved) return milestone;
      
      let isAchieved = false;
      
      switch (milestone.requirement.type) {
        case 'journal_entries':
          isAchieved = eng.journalEntries >= milestone.requirement.value;
          break;
        case 'audio_time':
          isAchieved = eng.audioListeningTime >= milestone.requirement.value;
          break;
        case 'reflections':
          isAchieved = eng.totalReflectionTime >= milestone.requirement.value;
          break;
        case 'consistency':
          if (milestone.requirement.timeframe === 'week') {
            isAchieved = eng.currentStreak >= milestone.requirement.value;
          } else if (milestone.requirement.timeframe === 'month') {
            isAchieved = eng.journalDaysActive >= milestone.requirement.value;
          }
          break;
        case 'sections_read':
          isAchieved = eng.sectionsRead >= milestone.requirement.value;
          break;
      }
      
      if (isAchieved && !milestone.achieved) {
        const achieved = {
          ...milestone,
          achieved: true,
          achievedAt: new Date()
        };
        achievedMilestones.push(achieved);
        
        // Unlock associated features
        const updatedFeatures = features.map(feature => {
          if (milestone.unlocks.includes(feature.key)) {
            return { ...feature, isUnlocked: true };
          }
          return feature;
        });
        setFeatures(updatedFeatures);
        
        // Show celebration
        if (milestone.celebration) {
          setPendingCelebration(achieved);
        }
        
        return achieved;
      }
      
      return milestone;
    });
    
    setMilestones(updatedMilestones);
    return achievedMilestones;
  };

  const calculateStageProgress = (): number => {
    const stageMillestones = milestones.filter(m => m.stage === currentStage);
    const achievedInStage = stageMillestones.filter(m => m.achieved).length;
    return stageMillestones.length > 0 ? (achievedInStage / stageMillestones.length) * 100 : 0;
  };

  // Simplicity mode toggle
  const toggleSimplicityMode = () => {
    setIsSimplicityMode(!isSimplicityMode);
  };

  // Celebration functions
  const showCelebration = (milestone: SpiritualMilestone) => {
    setPendingCelebration(milestone);
  };

  const dismissCelebration = () => {
    setPendingCelebration(null);
  };

  const contextValue: SpiritualJourneyContextType = {
    // Core state
    currentStage,
    engagement,
    milestones,
    features,
    
    // Simplicity mode
    isSimplicityMode,
    toggleSimplicityMode,
    
    // Feature management
    isFeatureUnlocked,
    getUnlockedFeatures,
    getNextMilestone,
    
    // Progress tracking
    updateEngagement,
    checkMilestones,
    calculateStageProgress,
    
    // Celebration
    showCelebration,
    dismissCelebration,
    pendingCelebration
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

