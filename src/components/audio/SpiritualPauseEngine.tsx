
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import SpiritualPauseSystemExports from '@/components/SpiritualPauseSystem';
const { getRandomQuote } = SpiritualPauseSystemExports;

// Types for spiritual pause configurations
interface SpiritualPauseConfig {
  intervalMinutes: number; // How often to suggest pauses
  minListeningTime: number; // Minimum time before first pause
  maxPausesPerSession: number; // Maximum pauses per listening session
  pauseDuration: number; // Default pause duration in seconds
  enabled: boolean; // Whether pauses are enabled
}

interface SacredBreathMoment {
  id: string;
  triggerTime: number; // Audio timestamp
  message: string;
  category: 'breath' | 'reflection' | 'wisdom';
  duration: number; // How long to show the moment
}

interface SpiritualPauseEngineProps {
  // Audio player integration
  currentTime: number;
  isPlaying: boolean;
  duration: number;
  trackTitle?: string;
  onPauseRequested?: () => void;
  onResumeRequested?: () => void;
  
  // Customization
  config?: Partial<SpiritualPauseConfig>;
  className?: string;
}

// Default configuration based on spiritual stage
const getDefaultConfig = (stage: string): SpiritualPauseConfig => {
  const baseConfig = {
    intervalMinutes: 8, // Every 8 minutes
    minListeningTime: 300, // 5 minutes before first pause
    maxPausesPerSession: 3,
    pauseDuration: 15, // 15 seconds
    enabled: true
  };

  switch (stage) {
    case 'seed':
      return {
        ...baseConfig,
        intervalMinutes: 10, // Less frequent for beginners
        maxPausesPerSession: 2,
        pauseDuration: 10
      };
    case 'growth':
      return {
        ...baseConfig,
        intervalMinutes: 8,
        maxPausesPerSession: 3,
        pauseDuration: 15
      };
    case 'maturity':
      return {
        ...baseConfig,
        intervalMinutes: 6, // More frequent for mature practitioners
        maxPausesPerSession: 4,
        pauseDuration: 20
      };
    case 'mastery':
      return {
        ...baseConfig,
        intervalMinutes: 5, // Most frequent for masters
        maxPausesPerSession: 5,
        pauseDuration: 25
      };
    default:
      return baseConfig;
  }
};

// Predefined sacred breathing moments at common intervals
const createSacredBreathMoments = (duration: number, trackTitle: string): SacredBreathMoment[] => {
  const moments: SacredBreathMoment[] = [];
  
  // Create moments every 8-12 minutes with slight variation
  const intervals = [480, 720, 960, 1200, 1440]; // 8, 12, 16, 20, 24 minutes
  
  intervals.forEach((interval, index) => {
    if (interval < duration - 60) { // Don't create moments too close to the end
      moments.push({
        id: `breath-${index}`,
        triggerTime: interval,
        message: getBreathingMessage(index, trackTitle),
        category: 'breath',
        duration: 15
      });
    }
  });
  
  return moments;
};

// Generate contextual breathing messages
const getBreathingMessage = (index: number, trackTitle: string): string => {
  const messages = [
    `Take three sacred breaths. Let the wisdom of "${trackTitle}" settle in your heart.`,
    `Pause. Breathe. What is your soul hearing in this teaching?`,
    `Sacred breath moment. Feel the presence of divine truth in this moment.`,
    `Breathe deeply. Allow space for the spirit to work within you.`,
    `Gentle pause for reflection. What resonates most deeply with your heart?`,
    `Sacred breathing space. Let these words take root in fertile soil.`,
    `Moment of stillness. Listen for the voice of wisdom beyond words.`,
    `Breathe in peace, breathe out understanding. Rest in this sacred truth.`
  ];
  
  return messages[index % messages.length] || `Sacred breathing moment. Allow the wisdom of "${trackTitle}" to flow through you.`;
};

/**
 * Spiritual Pause Engine - Creates contemplative moments during audio playback
 * Integrates with existing SpiritualPauseSystem and Sacred Simplicity framework
 */
export const SpiritualPauseEngine: React.FC<SpiritualPauseEngineProps> = ({
  currentTime,
  isPlaying,
  duration,
  trackTitle = 'this teaching',
  onPauseRequested,
  onResumeRequested,
  config: userConfig = {},
  className = ''
}) => {
  const { currentStage, isFeatureUnlocked } = useSpiritualJourney();
  
  // State management
  const [config, setConfig] = useState<SpiritualPauseConfig>(getDefaultConfig(currentStage));
  const [sessionPauses, setSessionPauses] = useState<number>(0);
  const [lastPauseTime, setLastPauseTime] = useState<number>(0);
  const [sacredMoments, setSacredMoments] = useState<SacredBreathMoment[]>([]);
  const [activeMoment, setActiveMoment] = useState<SacredBreathMoment | null>(null);
  const [isAutoPauseActive, setIsAutoPauseActive] = useState<boolean>(false);
  const [showBreathPrompt, setShowBreathPrompt] = useState<boolean>(false);
  
  // Refs for tracking
  const sessionStartRef = useRef<number>(Date.now());
  const momentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize configuration
  useEffect(() => {
    const mergedConfig = { ...getDefaultConfig(currentStage), ...userConfig };
    setConfig(mergedConfig);
  }, [currentStage, userConfig]);
  
  // Create sacred moments when duration is available
  useEffect(() => {
    if (duration > 0 && trackTitle) {
      const moments = createSacredBreathMoments(duration, trackTitle);
      setSacredMoments(moments);
    }
  }, [duration, trackTitle]);
  
  // Reset session when track changes
  useEffect(() => {
    setSessionPauses(0);
    setLastPauseTime(0);
    sessionStartRef.current = Date.now();
    setActiveMoment(null);
    setIsAutoPauseActive(false);
  }, [trackTitle]);
  
  // Check for spiritual pause opportunities
  const checkForPauseOpportunity = useCallback(() => {
    if (!config.enabled || !isPlaying || sessionPauses >= config.maxPausesPerSession) {
      return false;
    }
    
    // Must have been listening for minimum time
    if (currentTime < config.minListeningTime) {
      return false;
    }
    
    // Check if enough time has passed since last pause
    const timeSinceLastPause = currentTime - lastPauseTime;
    const intervalSeconds = config.intervalMinutes * 60;
    
    return timeSinceLastPause >= intervalSeconds;
  }, [config, isPlaying, sessionPauses, currentTime, lastPauseTime]);
  
  // Check for sacred breath moments
  const checkForSacredMoment = useCallback(() => {
    if (!isPlaying || activeMoment) return;
    
    const moment = sacredMoments.find(m => 
      Math.abs(currentTime - m.triggerTime) <= 2 && // Within 2 seconds
      !activeMoment // No active moment already
    );
    
    if (moment) {
      setActiveMoment(moment);
      setShowBreathPrompt(true);
      
      // Auto-hide after duration
      momentTimeoutRef.current = setTimeout(() => {
        setShowBreathPrompt(false);
        setActiveMoment(null);
      }, moment.duration * 1000);
    }
  }, [currentTime, sacredMoments, activeMoment, isPlaying]);
  
  // Main effect for pause monitoring
  useEffect(() => {
    if (!isPlaying) return;
    
    // Check for natural pause opportunities
    if (checkForPauseOpportunity()) {
      // Show breathing prompt instead of auto-pausing
      setShowBreathPrompt(true);
      setLastPauseTime(currentTime);
      setSessionPauses(prev => prev + 1);
      
      // Auto-hide after a moment
      setTimeout(() => {
        setShowBreathPrompt(false);
      }, 8000);
    }
    
    // Check for sacred breath moments
    checkForSacredMoment();
  }, [currentTime, isPlaying, checkForPauseOpportunity, checkForSacredMoment]);
  
  // Handle manual pause acceptance
  const handleAcceptPause = useCallback(() => {
    setIsAutoPauseActive(true);
    setShowBreathPrompt(false);
    onPauseRequested?.();
    
    // Auto-resume after pause duration
    setTimeout(() => {
      setIsAutoPauseActive(false);
      onResumeRequested?.();
    }, config.pauseDuration * 1000);
  }, [config.pauseDuration, onPauseRequested, onResumeRequested]);
  
  // Handle dismissing pause prompt
  const handleDismissPause = useCallback(() => {
    setShowBreathPrompt(false);
    if (activeMoment) {
      setActiveMoment(null);
    }
  }, [activeMoment]);
  
  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (momentTimeoutRef.current) {
        clearTimeout(momentTimeoutRef.current);
      }
    };
  }, []);
  
  // Don't show anything if spiritual pauses aren't unlocked
  if (!isFeatureUnlocked('basic_audio')) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`}>
      {/* Sacred Breath Prompt */}
      <AnimatePresence>
        {showBreathPrompt && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-sacred-blue-50 to-sacred-gold-50 border-2 border-sacred-blue-200 rounded-2xl p-6 shadow-2xl backdrop-blur-sm max-w-md">
              {/* Sacred breathing icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center mb-4"
              >
                <div className="w-12 h-12 bg-sacred-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🫁</span>
                </div>
              </motion.div>
              
              {/* Sacred message */}
              <p className="text-center text-sm text-sacred-blue-800 mb-4 leading-relaxed">
                {activeMoment?.message || `Sacred pause invitation. Take three deep breaths and reflect on what you've received.`}
              </p>
              
              {/* Action buttons */}
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAcceptPause}
                  className="flex-1 bg-sacred-gradient text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg transition-all hover:shadow-xl"
                >
                  🕯️ Sacred Pause
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDismissPause}
                  className="px-4 py-2 bg-white border border-sacred-blue-200 text-sacred-blue-700 rounded-lg text-sm font-medium transition-colors hover:bg-sacred-blue-50"
                >
                  Continue
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Auto-pause overlay */}
      <AnimatePresence>
        {isAutoPauseActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-sacred-blue-50 rounded-2xl p-8 shadow-2xl max-w-md mx-4"
            >
              {/* Sacred pause animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center mb-6"
              >
                <div className="w-16 h-16 bg-sacred-gradient rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🧘</span>
                </div>
              </motion.div>
              
              <h3 className="text-center text-xl font-serif text-sacred-blue-900 mb-4">
                Sacred Breathing Space
              </h3>
              
              <p className="text-center text-sacred-blue-700 mb-6 leading-relaxed">
                Breathe deeply. Feel the presence of divine wisdom in this moment of stillness.
              </p>
              
              {/* Breathing rhythm indicator */}
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center"
              >
                <div className="w-4 h-4 bg-sacred-blue-400 rounded-full" />
              </motion.div>
              
              <p className="text-center text-xs text-sacred-blue-500 mt-4">
                Resuming automatically in a moment...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpiritualPauseEngine;
