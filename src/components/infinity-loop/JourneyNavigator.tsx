
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

interface JourneyStep {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: string;
  spiritualContext: string;
  priority: number;
  completionCheck?: () => boolean;
}

interface JourneyNavigatorProps {
  currentContext?: 'reading' | 'listening' | 'writing' | 'reflecting' | 'dashboard';
  showAsCard?: boolean;
  className?: string;
}

export const JourneyNavigator: React.FC<JourneyNavigatorProps> = ({
  currentContext = 'dashboard',
  showAsCard = true,
  className = ''
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { currentStage, engagement, isFeatureUnlocked } = useSpiritualJourney();

  // Define the spiritual journey flow
  const journeySteps: JourneyStep[] = [
    {
      id: 'onboarding',
      title: 'Begin Sacred Journey',
      description: 'Discover your spiritual foundation',
      path: '/onboarding',
      icon: '🌱',
      spiritualContext: 'Foundation of transformation',
      priority: 1,
      completionCheck: () => {
        return localStorage.getItem('renewedOnboardingCompleted') === 'true';
      }
    },
    {
      id: 'dashboard',
      title: 'Sacred Sanctuary',
      description: 'Your spiritual transformation center',
      path: '/dashboard',
      icon: '🏛️',
      spiritualContext: 'Center of your sacred practice',
      priority: 2
    },
    {
      id: 'journal',
      title: 'Sacred Journal',
      description: 'Record your spiritual insights',
      path: '/journal',
      icon: '📖',
      spiritualContext: 'Capture divine revelations',
      priority: 3
    },
    {
      id: 'reading',
      title: 'Sacred Texts',
      description: 'Study spiritual teachings',
      path: '/book',
      icon: '📚',
      spiritualContext: 'Wisdom for transformation',
      priority: 4
    },
    {
      id: 'audio',
      title: 'Audio Sanctuary',
      description: 'Immersive spiritual listening',
      path: '/full-audio-player',
      icon: '🎧',
      spiritualContext: 'Divine wisdom through sacred sound',
      priority: 5
    },
    {
      id: 'reflections',
      title: 'Deep Reflections',
      description: 'Profound spiritual contemplations',
      path: '/reflections',
      icon: '✨',
      spiritualContext: 'Journey into sacred mysteries',
      priority: 6,
      completionCheck: () => isFeatureUnlocked('deep_reflections')
    }
  ];

  // Get next suggested steps based on current context and engagement
  const getNextSteps = (): JourneyStep[] => {
    const currentStep = journeySteps.find(step => pathname?.startsWith(step.path));
    
    // Filter available steps based on spiritual progress
    const availableSteps = journeySteps.filter(step => {
      if (step.completionCheck) {
        return step.completionCheck();
      }
      return true;
    });

    // Context-based suggestions
    const suggestions: JourneyStep[] = [];

    switch (currentContext) {
      case 'reading':
        // After reading, suggest journaling or audio
        suggestions.push(
          ...availableSteps.filter(step => 
            ['journal', 'audio', 'reflections'].includes(step.id)
          ).slice(0, 2)
        );
        break;
        
      case 'listening':
        // After audio, suggest journaling or reading
        suggestions.push(
          ...availableSteps.filter(step => 
            ['journal', 'reading', 'dashboard'].includes(step.id)
          ).slice(0, 2)
        );
        break;
        
      case 'writing':
        // After journaling, suggest audio or reading
        suggestions.push(
          ...availableSteps.filter(step => 
            ['audio', 'reading', 'reflections'].includes(step.id)
          ).slice(0, 2)
        );
        break;
        
      case 'reflecting':
        // After reflection, suggest journaling or return to sanctuary
        suggestions.push(
          ...availableSteps.filter(step => 
            ['journal', 'dashboard', 'audio'].includes(step.id)
          ).slice(0, 2)
        );
        break;
        
      default:
        // From dashboard, suggest based on engagement patterns
        if (engagement.journalEntries < 3) {
          suggestions.push(...availableSteps.filter(step => step.id === 'journal'));
        }
        if (engagement.audioListeningTime < 10) {
          suggestions.push(...availableSteps.filter(step => step.id === 'audio'));
        }
        if (engagement.sectionsRead < 1) {
          suggestions.push(...availableSteps.filter(step => step.id === 'reading'));
        }
        
        // If user is engaged, suggest advanced features
        if (engagement.journalEntries >= 3 && isFeatureUnlocked('deep_reflections')) {
          suggestions.push(...availableSteps.filter(step => step.id === 'reflections'));
        }
        break;
    }

    // Remove current page and ensure we have suggestions
    const filtered = suggestions.filter(step => !pathname?.startsWith(step.path));
    
    // If no context-specific suggestions, return general next steps
    if (filtered.length === 0) {
      return availableSteps
        .filter(step => !pathname?.startsWith(step.path))
        .sort((a, b) => a.priority - b.priority)
        .slice(0, 2);
    }
    
    return filtered.slice(0, 2);
  };

  const nextSteps = getNextSteps();

  if (nextSteps.length === 0) {
    return null;
  }

  const NavigationContent = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-serif text-lg text-sacred-blue-900 mb-2">
            Continue Your Sacred Journey
          </h3>
          <p className="text-sm text-sacred-blue-600">
            🕊️ Let the spirit guide your next steps
          </p>
        </motion.div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {nextSteps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <div
              className="group cursor-pointer rounded-xl border border-sacred-blue-200 bg-white/70 p-4 transition-all duration-300 hover:border-sacred-gold-300 hover:bg-sacred-gold-50 hover:shadow-lg"
              onClick={() => router.push(step.path)}
            >
              <div className="flex items-center space-x-3 mb-3">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-sacred-gradient shadow-sm"
                >
                  <span className="text-lg text-white">{step.icon}</span>
                </motion.div>
                <div className="flex-1">
                  <h4 className="font-medium text-sacred-blue-900 group-hover:text-sacred-blue-800">
                    {step.title}
                  </h4>
                  <p className="text-sm text-sacred-blue-600">
                    {step.description}
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-sacred-blue-500 italic mb-3">
                {step.spiritualContext}
              </p>
              
              <motion.div
                whileHover={{ y: -1 }}
                transition={{ duration: 0.2 }}
              >
                <SacredButton
                  variant="primary"
                  size="sm"
                  className="w-full group-hover:shadow-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(step.path);
                  }}
                >
                  Continue Sacred Path ✨
                </SacredButton>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center pt-4 border-t border-sacred-blue-100"
      >
        <p className="text-xs text-sacred-blue-500">
          🙏 Each step deepens your spiritual transformation
        </p>
      </motion.div>
    </div>
  );

  if (showAsCard) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        <SacredCard variant="glass" className="p-6">
          <NavigationContent />
        </SacredCard>
      </motion.div>
    );
  }

  return (
    <div className={className}>
      <NavigationContent />
    </div>
  );
};

export default JourneyNavigator;
