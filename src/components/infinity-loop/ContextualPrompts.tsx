
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';

interface PromptAction {
  title: string;
  description: string;
  path: string;
  icon: string;
  variant: 'primary' | 'secondary' | 'accent';
}

interface ContextualPromptsProps {
  context: 'completion' | 'milestone' | 'engagement' | 'transition';
  data?: any;
  onAction?: (action: string) => void;
}

export const ContextualPrompts: React.FC<ContextualPromptsProps> = ({
  context,
  data,
  onAction
}) => {
  const router = useRouter();
  const { engagement, currentStage } = useSpiritualJourney();

  const getPrompts = (): PromptAction[] => {
    switch (context) {
      case 'completion':
        return [
          {
            title: 'Reflect in Journal',
            description: 'Capture insights from this experience',
            path: '/journal',
            icon: '📝',
            variant: 'primary'
          },
          {
            title: 'Continue Learning',
            description: 'Explore more sacred teachings',
            path: '/book',
            icon: '📚',
            variant: 'secondary'
          }
        ];
        
      case 'milestone':
        return [
          {
            title: 'Celebrate Progress',
            description: 'View your spiritual growth',
            path: '/dashboard',
            icon: '🎉',
            variant: 'accent'
          },
          {
            title: 'Deep Reflection',
            description: 'Contemplate this achievement',
            path: '/reflections',
            icon: '✨',
            variant: 'primary'
          }
        ];
        
      case 'engagement':
        if (engagement.journalEntries === 0) {
          return [
            {
              title: 'Start Journaling',
              description: 'Begin recording your spiritual insights',
              path: '/journal',
              icon: '🌱',
              variant: 'primary'
            }
          ];
        } else if (engagement.audioListeningTime < 5) {
          return [
            {
              title: 'Listen to Wisdom',
              description: 'Experience spiritual teachings through audio',
              path: '/full-audio-player',
              icon: '🎧',
              variant: 'primary'
            }
          ];
        }
        return [];
        
      case 'transition':
        return [
          {
            title: 'Return to Sanctuary',
            description: 'View your spiritual progress',
            path: '/dashboard',
            icon: '🏛️',
            variant: 'secondary'
          },
          {
            title: 'Continue Journey',
            description: 'Explore next spiritual practice',
            path: data?.nextPath || '/journal',
            icon: '🚶‍♂️',
            variant: 'primary'
          }
        ];
        
      default:
        return [];
    }
  };

  const prompts = getPrompts();

  if (prompts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-wrap gap-3 justify-center"
    >
      {prompts.map((prompt, index) => (
        <motion.button
          key={prompt.title}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            onAction?.(prompt.title);
            router.push(prompt.path);
          }}
          className={`
            inline-flex items-center space-x-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200
            ${prompt.variant === 'primary' 
              ? 'bg-sacred-gradient text-white shadow-md hover:shadow-lg' 
              : prompt.variant === 'accent'
              ? 'bg-sacred-gold-500 text-white shadow-md hover:shadow-lg hover:bg-sacred-gold-600'
              : 'border border-sacred-blue-300 bg-white text-sacred-blue-700 hover:bg-sacred-blue-50'
            }
          `}
        >
          <span>{prompt.icon}</span>
          <span>{prompt.title}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

export default ContextualPrompts;
