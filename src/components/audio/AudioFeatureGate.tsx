
'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import { FeatureGate, SacredHint } from '@/components/sacred-simplicity/FeatureGate';

// Audio-specific feature definitions
export const audioFeatureMap = {
  // SEED STAGE - Basic audio functionality (always available)
  basic_playback: {
    key: 'basic_audio',
    title: 'Sacred Audio Playback',
    description: 'Listen to spiritual teachings with basic controls',
    stage: 'seed',
    isCore: true
  },
  
  // SEED STAGE - First unlockable features
  volume_control: {
    key: 'audio_volume_control',
    title: 'Volume Control',
    description: 'Adjust audio volume to your comfort',
    stage: 'seed',
    isCore: false,
    unlockMessage: 'Volume control unlocked! Create your perfect listening environment.'
  },
  
  speed_control: {
    key: 'audio_speed_control', 
    title: 'Playback Speed',
    description: 'Adjust listening speed for deeper contemplation',
    stage: 'seed',
    isCore: false,
    unlockMessage: 'Speed control unlocked! Listen at your contemplative pace.'
  },

  // GROWTH STAGE - Enhanced audio features
  bookmark_system: {
    key: 'audio_bookmarks',
    title: 'Sacred Bookmarks',
    description: 'Mark meaningful moments for reflection',
    stage: 'growth',
    isCore: false,
    unlockMessage: 'Audio bookmarks unlocked! Capture sacred moments in your journey.'
  },
  
  progress_tracking: {
    key: 'audio_progress_tracking',
    title: 'Progress Memory',
    description: 'Resume listening where you left off',
    stage: 'growth',
    isCore: false, 
    unlockMessage: 'Progress tracking unlocked! Your listening journey is remembered.'
  },
  
  skip_controls: {
    key: 'audio_skip_controls',
    title: 'Skip Navigation',
    description: '10-second forward/backward navigation',
    stage: 'growth',
    isCore: false,
    unlockMessage: 'Skip controls unlocked! Navigate with precision through teachings.'
  },

  // MATURITY STAGE - Advanced audio features
  track_navigation: {
    key: 'audio_track_navigation',
    title: 'Track Navigation',
    description: 'Navigate between multiple audio sections',
    stage: 'maturity',
    isCore: false,
    unlockMessage: 'Track navigation unlocked! Journey through complete teachings.'
  },
  
  cross_track_bookmarks: {
    key: 'audio_cross_track_bookmarks',
    title: 'Cross-Track Bookmarks',
    description: 'Save bookmarks across different sections',
    stage: 'maturity',
    isCore: false,
    unlockMessage: 'Advanced bookmarks unlocked! Connect insights across all teachings.'
  },
  
  audio_analytics: {
    key: 'audio_analytics',
    title: 'Listening Analytics',
    description: 'Track your spiritual audio journey',
    stage: 'maturity',
    isCore: false,
    unlockMessage: 'Audio analytics unlocked! See your growth through sacred sound.'
  },

  // MASTERY STAGE - Master-level features
  spiritual_sharing: {
    key: 'audio_spiritual_sharing',
    title: 'Sacred Sharing',
    description: 'Share meaningful audio moments with others',
    stage: 'mastery',
    isCore: false,
    unlockMessage: 'Sacred sharing unlocked! Spread wisdom to fellow seekers.'
  },
  
  advanced_controls: {
    key: 'audio_advanced_controls',
    title: 'Master Controls',
    description: 'Complete audio mastery tools',
    stage: 'mastery',
    isCore: false,
    unlockMessage: 'Master controls unlocked! Full dominion over your audio experience.'
  }
};

// Props for audio feature gates
interface AudioFeatureGateProps {
  feature: keyof typeof audioFeatureMap;
  children: ReactNode;
  fallback?: ReactNode;
  showHint?: boolean;
  className?: string;
}

/**
 * Audio-specific feature gate that wraps audio controls
 * based on spiritual progression and Sacred Simplicity principles
 */
export const AudioFeatureGate: React.FC<AudioFeatureGateProps> = ({ 
  feature, 
  children, 
  fallback,
  showHint = true,
  className = ""
}) => {
  const featureConfig = audioFeatureMap[feature];
  
  if (!featureConfig) {
    console.warn(`AudioFeatureGate: Unknown feature "${feature}"`);
    return <>{children}</>;
  }

  // Core features (like basic playback) are always available
  if (featureConfig.isCore === true) {
    return <>{children}</>;
  }

  return (
    <FeatureGate
      featureKey={featureConfig.key}
      fallback={fallback}
      showHint={showHint}
      className={className}
    >
      {children}
    </FeatureGate>
  );
};

/**
 * Sacred Audio Hint specifically designed for audio features
 */
interface SacredAudioHintProps {
  feature: keyof typeof audioFeatureMap;
  milestone?: string;
  className?: string;
}

export const SacredAudioHint: React.FC<SacredAudioHintProps> = ({ 
  feature, 
  milestone,
  className = ""
}) => {
  const { milestones } = useSpiritualJourney();
  const featureConfig = audioFeatureMap[feature];
  
  if (!featureConfig) return null;
  
  const relevantMilestone = milestone 
    ? milestones.find(m => m.id === milestone)
    : milestones.find(m => m.unlocks.includes(featureConfig.key));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-xl border-2 border-dashed border-sacred-blue-300 bg-gradient-to-br from-sacred-blue-50 to-sacred-gold-50 p-4 transition-all duration-300 hover:border-sacred-blue-400 hover:shadow-lg ${className}`}
    >
      {/* Audio-specific sacred pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-sacred-blue-200 via-transparent to-sacred-gold-200"></div>
      </div>
      
      {/* Gentle audio pulse */}
      <motion.div
        animate={{ 
          scale: [1, 1.02, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-xl bg-sacred-blue-200 opacity-20"
      />
      
      <div className="relative text-center">
        {/* Audio feature icon */}
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-sacred-blue-500 to-sacred-blue-600 shadow-lg"
        >
          <span className="text-lg text-white">🎧</span>
        </motion.div>
        
        {/* Feature details */}
        <h4 className="mb-2 font-serif text-base text-sacred-blue-900 group-hover:text-sacred-blue-800">
          {featureConfig.title}
        </h4>
        
        <p className="mb-3 text-xs text-sacred-blue-600 leading-relaxed">
          {featureConfig.description}
        </p>
        
        {/* Sacred guidance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-lg bg-white/50 p-3 backdrop-blur-sm"
        >
          <p className="text-xs text-sacred-blue-700 italic mb-2">
            🎵 Sacred sounds await your readiness...
          </p>
          
          {relevantMilestone && (
            <div className="text-center">
              <p className="text-xs font-medium text-sacred-blue-800 mb-1">
                {relevantMilestone.title}
              </p>
              <p className="text-xs text-sacred-blue-600">
                {relevantMilestone.description}
              </p>
              
              {/* Audio-themed progress indicator */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, delay: 0.6 }}
                className="mt-2 h-1 bg-sacred-blue-100 rounded-full overflow-hidden"
              >
                <motion.div
                  animate={{ 
                    x: ['-100%', '100%']
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="h-full w-1/3 bg-gradient-to-r from-transparent via-sacred-blue-400 to-transparent"
                />
              </motion.div>
              
              <p className="mt-2 text-xs text-sacred-blue-500">
                Continue listening to unlock this sacred gift
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Wrapper for entire audio player with progressive disclosure
 */
interface ProgressiveAudioPlayerProps {
  children: ReactNode;
  mode?: 'single' | 'full';
  className?: string;
}

export const ProgressiveAudioPlayer: React.FC<ProgressiveAudioPlayerProps> = ({
  children,
  mode = 'full',
  className = ""
}) => {
  const { isSimplicityMode, currentStage } = useSpiritualJourney();

  // If simplicity mode is off, show full player
  if (!isSimplicityMode) {
    return <div className={className}>{children}</div>;
  }

  // Show progressive revelation based on spiritual stage
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative ${className}`}
    >
      {/* Stage indicator for audio */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-2 -right-2 z-10"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sacred-blue-500 text-xs text-white shadow-lg">
          {currentStage === 'seed' && '🌱'}
          {currentStage === 'growth' && '🌿'}
          {currentStage === 'maturity' && '🏛️'}
          {currentStage === 'mastery' && '✨'}
        </div>
      </motion.div>
      
      {children}
    </motion.div>
  );
};

export default AudioFeatureGate;
