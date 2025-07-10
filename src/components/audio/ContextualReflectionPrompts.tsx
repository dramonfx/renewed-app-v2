
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';

// Types for reflection prompts
interface ReflectionPrompt {
  id: string;
  question: string;
  category: 'contemplation' | 'application' | 'gratitude' | 'surrender' | 'wisdom';
  stage: 'seed' | 'growth' | 'maturity' | 'mastery';
  triggerContext: 'midpoint' | 'transition' | 'completion' | 'pause';
}

interface ContextualReflectionPromptsProps {
  // Audio context
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  trackProgress: number; // 0-1
  trackTitle?: string;
  isPaused?: boolean;
  
  // Customization
  enableAutoPrompts?: boolean;
  className?: string;
}

// Stage-based reflection prompts
const getReflectionPrompts = (stage: string): ReflectionPrompt[] => {
  const basePrompts = {
    seed: [
      {
        id: 'seed-1',
        question: "What is God speaking to your heart through this teaching?",
        category: 'contemplation' as const,
        stage: 'seed' as const,
        triggerContext: 'midpoint' as const
      },
      {
        id: 'seed-2',
        question: "How does this truth bring you peace?",
        category: 'application' as const,
        stage: 'seed' as const,
        triggerContext: 'pause' as const
      },
      {
        id: 'seed-3',
        question: "What are you grateful for in this moment?",
        category: 'gratitude' as const,
        stage: 'seed' as const,
        triggerContext: 'completion' as const
      }
    ],
    growth: [
      {
        id: 'growth-1',
        question: "How might God be calling you to grow through this teaching?",
        category: 'application' as const,
        stage: 'growth' as const,
        triggerContext: 'midpoint' as const
      },
      {
        id: 'growth-2',
        question: "What old patterns is the Spirit inviting you to release?",
        category: 'surrender' as const,
        stage: 'growth' as const,
        triggerContext: 'transition' as const
      },
      {
        id: 'growth-3',
        question: "Where do you see God's faithfulness in your current season?",
        category: 'contemplation' as const,
        stage: 'growth' as const,
        triggerContext: 'pause' as const
      },
      {
        id: 'growth-4',
        question: "What step of obedience is the Lord asking of you?",
        category: 'application' as const,
        stage: 'growth' as const,
        triggerContext: 'completion' as const
      }
    ],
    maturity: [
      {
        id: 'maturity-1',
        question: "How does this truth challenge your understanding of God's character?",
        category: 'contemplation' as const,
        stage: 'maturity' as const,
        triggerContext: 'midpoint' as const
      },
      {
        id: 'maturity-2',
        question: "In what ways is God inviting you into deeper intimacy with Him?",
        category: 'surrender' as const,
        stage: 'maturity' as const,
        triggerContext: 'transition' as const
      },
      {
        id: 'maturity-3',
        question: "How might you share this revelation with others in your sphere?",
        category: 'application' as const,
        stage: 'maturity' as const,
        triggerContext: 'pause' as const
      },
      {
        id: 'maturity-4',
        question: "What areas of your life need to align more fully with this truth?",
        category: 'wisdom' as const,
        stage: 'maturity' as const,
        triggerContext: 'completion' as const
      }
    ],
    mastery: [
      {
        id: 'mastery-1',
        question: "How does this teaching reveal the eternal within the temporal?",
        category: 'wisdom' as const,
        stage: 'mastery' as const,
        triggerContext: 'midpoint' as const
      },
      {
        id: 'mastery-2',
        question: "In what ways can you incarnate this truth for others?",
        category: 'application' as const,
        stage: 'mastery' as const,
        triggerContext: 'transition' as const
      },
      {
        id: 'mastery-3',
        question: "How does this deepen your understanding of divine love?",
        category: 'contemplation' as const,
        stage: 'mastery' as const,
        triggerContext: 'pause' as const
      },
      {
        id: 'mastery-4',
        question: "What is the Spirit saying about your calling through this?",
        category: 'surrender' as const,
        stage: 'mastery' as const,
        triggerContext: 'completion' as const
      }
    ]
  };
  
  return basePrompts[stage as keyof typeof basePrompts] || basePrompts.seed;
};

// Category icons and colors
const getCategoryDisplay = (category: ReflectionPrompt['category']) => {
  const displays = {
    contemplation: { icon: '🤔', color: 'sacred-blue', label: 'Contemplation' },
    application: { icon: '🚶', color: 'sacred-green', label: 'Application' },
    gratitude: { icon: '🙏', color: 'sacred-gold', label: 'Gratitude' },
    surrender: { icon: '🕊️', color: 'sacred-purple', label: 'Surrender' },
    wisdom: { icon: '💎', color: 'sacred-blue', label: 'Wisdom' }
  };
  
  return displays[category];
};

/**
 * Contextual Reflection Prompts - Provides thoughtful questions during audio listening
 * that emerge based on audio context and spiritual stage
 */
export const ContextualReflectionPrompts: React.FC<ContextualReflectionPromptsProps> = ({
  currentTime,
  isPlaying,
  duration,
  trackProgress,
  trackTitle = 'this teaching',
  isPaused = false,
  enableAutoPrompts = true,
  className = ''
}) => {
  const { currentStage, isFeatureUnlocked } = useSpiritualJourney();
  
  // State
  const [currentPrompt, setCurrentPrompt] = useState<ReflectionPrompt | null>(null);
  const [shownPrompts, setShownPrompts] = useState<Set<string>>(new Set());
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  
  // Get stage-appropriate prompts
  const availablePrompts = getReflectionPrompts(currentStage);
  
  // Trigger contexts based on audio state
  const getCurrentContext = useCallback((): ReflectionPrompt['triggerContext'] | null => {
    if (isPaused) return 'pause';
    if (trackProgress >= 0.95) return 'completion';
    if (trackProgress >= 0.4 && trackProgress <= 0.6) return 'midpoint';
    if (trackProgress >= 0.7 && trackProgress <= 0.8) return 'transition';
    return null;
  }, [trackProgress, isPaused]);
  
  // Find appropriate prompt for current context
  const findContextualPrompt = useCallback((): ReflectionPrompt | null => {
    const context = getCurrentContext();
    if (!context || !enableAutoPrompts) return null;
    
    const contextPrompts = availablePrompts.filter(p => 
      p.triggerContext === context && !shownPrompts.has(p.id)
    );
    
    if (contextPrompts.length === 0) return null;
    
    // Return random prompt from available context prompts
    return contextPrompts[Math.floor(Math.random() * contextPrompts.length)] || null;
  }, [getCurrentContext, availablePrompts, shownPrompts, enableAutoPrompts]);
  
  // Check for prompt opportunities
  useEffect(() => {
    if (!isFeatureUnlocked('basic_audio') || currentPrompt) return;
    
    const prompt = findContextualPrompt();
    if (prompt) {
      // Delay slightly to avoid interrupting flow
      const timer = setTimeout(() => {
        setCurrentPrompt(prompt);
        setIsPromptVisible(true);
        setShownPrompts(prev => new Set([...prev, prompt.id]));
      }, 1500);
      
      return () => clearTimeout(timer);
    }
    // Explicitly return undefined when no cleanup is needed
    return undefined;
  }, [trackProgress, isPaused, findContextualPrompt, isFeatureUnlocked, currentPrompt]);
  
  // Auto-hide prompts when audio state changes significantly
  useEffect(() => {
    if (currentPrompt && !isPaused && isPlaying) {
      const timer = setTimeout(() => {
        setIsPromptVisible(false);
        setTimeout(() => setCurrentPrompt(null), 500);
      }, 12000); // Show for 12 seconds
      
      return () => clearTimeout(timer);
    }
    // Explicitly return undefined when no cleanup is needed
    return undefined;
  }, [currentPrompt, isPaused, isPlaying]);
  
  // Reset shown prompts when track changes
  useEffect(() => {
    setShownPrompts(new Set());
    setCurrentPrompt(null);
    setIsPromptVisible(false);
  }, [trackTitle]);
  
  // Handle prompt dismissal
  const dismissPrompt = () => {
    setIsPromptVisible(false);
    setTimeout(() => setCurrentPrompt(null), 300);
  };
  
  // Handle opening journal for reflection
  const openReflection = () => {
    // This would integrate with the journal system
    dismissPrompt();
    // Navigate to journal with pre-filled reflection context
    window.open(`/journal?reflection=${encodeURIComponent(currentPrompt?.question || '')}&context=${encodeURIComponent(trackTitle)}`, '_blank');
  };
  
  if (!isFeatureUnlocked('basic_audio')) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`}>
      <AnimatePresence>
        {currentPrompt && isPromptVisible && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-32 left-1/2 transform -translate-x-1/2 z-30 max-w-md"
          >
            <div className="bg-gradient-to-br from-white via-sacred-blue-50 to-sacred-gold-50 border-2 border-sacred-blue-200 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              {/* Category indicator */}
              <div className="flex items-center justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2 bg-white bg-opacity-80 rounded-full px-3 py-1"
                >
                  <span className="text-lg">
                    {getCategoryDisplay(currentPrompt.category).icon}
                  </span>
                  <span className="text-xs font-medium text-sacred-blue-700">
                    {getCategoryDisplay(currentPrompt.category).label}
                  </span>
                </motion.div>
              </div>
              
              {/* Reflection question */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mb-6"
              >
                <h4 className="text-lg font-serif text-sacred-blue-900 mb-2">
                  Pause for Reflection
                </h4>
                <p className="text-sacred-blue-800 leading-relaxed">
                  {currentPrompt.question}
                </p>
              </motion.div>
              
              {/* Context note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-xs text-sacred-blue-600 text-center mb-4 italic"
              >
                Reflecting on &quot;{trackTitle}&quot;
              </motion.p>
              
              {/* Action buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex space-x-3"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={openReflection}
                  className="flex-1 bg-sacred-gradient text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg"
                >
                  📝 Journal This
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={dismissPrompt}
                  className="px-4 py-2 bg-white border border-sacred-blue-200 text-sacred-blue-700 rounded-lg text-sm font-medium"
                >
                  Later
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ContextualReflectionPrompts;
