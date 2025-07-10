
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import SacredCard from '@/components/ui/sacred-card';

interface ProgressiveFeatureProps {
  featureKey: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  unlockMessage?: string;
  className?: string;
}

export const ProgressiveFeature: React.FC<ProgressiveFeatureProps> = ({
  featureKey,
  children,
  fallback,
  unlockMessage,
  className = ''
}) => {
  const { isFeatureUnlocked, features } = useSpiritualJourney();
  const [showUnlockHint, setShowUnlockHint] = useState(false);
  
  const isUnlocked = isFeatureUnlocked(featureKey);
  const feature = features.find(f => f.key === featureKey);

  if (isUnlocked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  if (fallback) {
    return (
      <div className={className}>
        {fallback}
      </div>
    );
  }

  return (
    <motion.div
      className={`relative ${className}`}
      onHoverStart={() => setShowUnlockHint(true)}
      onHoverEnd={() => setShowUnlockHint(false)}
    >
      {/* Blurred/hidden content */}
      <div className="filter blur-sm opacity-30 pointer-events-none">
        {children}
      </div>
      
      {/* Overlay with unlock hint */}
      <AnimatePresence>
        {showUnlockHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <SacredCard variant="glass" className="p-4 text-center max-w-xs">
              <div className="text-2xl mb-2">🔒</div>
              <h3 className="font-medium text-sacred-blue-900 mb-1">
                {feature?.title || 'Sacred Feature'}
              </h3>
              <p className="text-sm text-sacred-blue-600 mb-2">
                {feature?.description || 'Continue your spiritual journey to unlock'}
              </p>
              {unlockMessage && (
                <p className="text-xs text-sacred-gold-600 italic">
                  ✨ {unlockMessage}
                </p>
              )}
            </SacredCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface SimplicitySwitchProps {
  className?: string;
}

export const SimplicitySwitch: React.FC<SimplicitySwitchProps> = ({ className = '' }) => {
  const { isSimplicityMode, toggleSimplicityMode } = useSpiritualJourney();

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center space-x-3 ${className}`}
    >
      <span className="text-sm text-sacred-blue-700 font-medium">
        {isSimplicityMode ? 'Simple Path' : 'Full Journey'}
      </span>
      
      <button
        onClick={toggleSimplicityMode}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300
          ${isSimplicityMode 
            ? 'bg-sacred-gradient' 
            : 'bg-sacred-blue-200 hover:bg-sacred-blue-300'
          }
        `}
        aria-label="Toggle Sacred Simplicity Mode"
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white shadow-md
            ${isSimplicityMode ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
      
      <span className="text-xs text-sacred-blue-500">
        {isSimplicityMode ? '🌱' : '🌟'}
      </span>
    </motion.div>
  );
};

interface SpiritualProgressBarProps {
  stage: string;
  progress: number;
  className?: string;
}

export const SpiritualProgressBar: React.FC<SpiritualProgressBarProps> = ({
  stage,
  progress,
  className = ''
}) => {
  const stageColors = {
    seed: 'from-emerald-400 to-emerald-600',
    growth: 'from-amber-400 to-amber-600',
    maturity: 'from-blue-400 to-blue-600',
    mastery: 'from-purple-400 to-purple-600'
  };

  const stageIcons = {
    seed: '🌱',
    growth: '🌿',
    maturity: '🌸',
    mastery: '✨'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <span className="text-lg">
            {stageIcons[stage as keyof typeof stageIcons] || '🌱'}
          </span>
          <span className="font-medium text-sacred-blue-900 capitalize">
            {stage} Stage
          </span>
        </div>
        <span className="text-sacred-blue-600 font-medium">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="h-3 bg-sacred-blue-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className={`
            h-full bg-gradient-to-r rounded-full shadow-sm
            ${stageColors[stage as keyof typeof stageColors] || stageColors.seed}
          `}
        />
      </div>
    </div>
  );
};

export default {
  ProgressiveFeature,
  SimplicitySwitch,
  SpiritualProgressBar
};
