
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';

// Types for sacred breath moments
interface BreathMoment {
  id: string;
  trigger: 'time' | 'transition' | 'completion';
  message: string;
  duration: number; // seconds
  breathPattern?: 'simple' | 'extended' | 'contemplative';
}

interface SacredBreathMomentsProps {
  // Audio context
  currentTime: number;
  isPlaying: boolean;
  trackProgress: number; // 0-1
  trackTitle?: string;
  
  // Customization
  showBreathGuide?: boolean;
  className?: string;
}

// Breathing patterns
const breathPatterns = {
  simple: {
    inhale: 4,
    hold: 2,
    exhale: 4,
    cycles: 3
  },
  extended: {
    inhale: 4,
    hold: 4,
    exhale: 6,
    cycles: 4
  },
  contemplative: {
    inhale: 6,
    hold: 2,
    exhale: 8,
    cycles: 5
  }
};

// Sacred breath messages based on spiritual stage
const getBreathMessages = (stage: string) => {
  const baseMessages = {
    seed: [
      "Take a moment to breathe. Let divine peace fill your heart.",
      "Sacred breath. Feel the presence of the Holy Spirit within you.",
      "Pause and breathe. God's love surrounds you in this moment."
    ],
    growth: [
      "Breathe deeply. Allow the Word to take root in your spirit.",
      "Sacred pause for reflection. What is God speaking to your heart?",
      "Moment of stillness. Let Christ's peace guard your thoughts."
    ],
    maturity: [
      "Contemplative breath. Rest in the depths of divine love.",
      "Sacred breathing space. Feel the eternal within the temporal.",
      "Breathe with intention. Let your soul be refreshed in God's presence."
    ],
    mastery: [
      "Master's breath. Unite your heart with the divine rhythm.",
      "Sacred communion through breath. Be still and know that He is God.",
      "Contemplative union. Breathe in divine wisdom, exhale human striving."
    ]
  };
  
  return baseMessages[stage as keyof typeof baseMessages] || baseMessages.seed;
};

/**
 * Sacred Breath Moments - Gentle invitations to contemplative breathing during audio
 */
export const SacredBreathMoments: React.FC<SacredBreathMomentsProps> = ({
  currentTime,
  isPlaying,
  trackProgress,
  trackTitle = 'this teaching',
  showBreathGuide = true,
  className = ''
}) => {
  const { currentStage, isFeatureUnlocked } = useSpiritualJourney();
  
  // State
  const [activeBreathMoment, setActiveBreathMoment] = useState<BreathMoment | null>(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCycle, setBreathCycle] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [breathPhase, setBreathPhase] = useState(0);
  
  // Get stage-appropriate messages
  const breathMessages = getBreathMessages(currentStage);
  
  // Create breath moments at natural transition points
  const createBreathMoment = (trigger: BreathMoment['trigger'], customMessage?: string): BreathMoment => {
    const defaultMessage = breathMessages[Math.floor(Math.random() * breathMessages.length)] || 
                          "Sacred pause. Take a moment to breathe and reflect.";
    
    return {
      id: `breath-${Date.now()}`,
      trigger,
      message: customMessage || defaultMessage,
      duration: 20,
      breathPattern: currentStage === 'seed' ? 'simple' : 
                   currentStage === 'growth' ? 'extended' : 'contemplative'
    };
  };
  
  // Check for natural breath moment opportunities
  useEffect(() => {
    if (!isPlaying || !isFeatureUnlocked('basic_audio')) return;
    
    // Breath moments at 25%, 50%, 75% of track
    const progressMilestones = [0.25, 0.5, 0.75];
    
    progressMilestones.forEach(milestone => {
      const tolerance = 0.02; // 2% tolerance
      if (Math.abs(trackProgress - milestone) <= tolerance && !activeBreathMoment) {
        const moment = createBreathMoment('transition', 
          `Sacred pause at ${Math.round(milestone * 100)}% through "${trackTitle}". Take a moment to breathe and reflect.`);
        
        // Delay slightly to avoid interrupting important content
        setTimeout(() => {
          if (!activeBreathMoment) { // Only show if no other moment is active
            setActiveBreathMoment(moment);
          }
        }, 2000);
      }
    });
  }, [trackProgress, isPlaying, trackTitle, activeBreathMoment, isFeatureUnlocked, currentStage, breathMessages]);
  
  // Handle breath moment acceptance
  const startBreathing = () => {
    if (!activeBreathMoment) return;
    
    setIsBreathing(true);
    setCycleCount(0);
    setBreathCycle('inhale');
    setBreathPhase(0);
    
    const pattern = breathPatterns[activeBreathMoment.breathPattern || 'simple'];
    let currentCycle = 0;
    let currentPhase = 0;
    let phaseType: 'inhale' | 'hold' | 'exhale' = 'inhale';
    
    const breathTimer = setInterval(() => {
      currentPhase++;
      
      // Determine current breathing phase
      if (currentPhase <= pattern.inhale) {
        phaseType = 'inhale';
      } else if (currentPhase <= pattern.inhale + pattern.hold) {
        phaseType = 'hold';
      } else if (currentPhase <= pattern.inhale + pattern.hold + pattern.exhale) {
        phaseType = 'exhale';
      } else {
        // Complete cycle
        currentCycle++;
        currentPhase = 0;
        phaseType = 'inhale';
        
        if (currentCycle >= pattern.cycles) {
          // Complete breathing session
          clearInterval(breathTimer);
          setIsBreathing(false);
          dismissBreathMoment();
          return;
        }
      }
      
      setBreathCycle(phaseType);
      setBreathPhase(currentPhase);
      setCycleCount(currentCycle);
    }, 1000);
    
    // Cleanup timer when component unmounts or moment changes
    return () => clearInterval(breathTimer);
  };
  
  // Dismiss breath moment
  const dismissBreathMoment = () => {
    setActiveBreathMoment(null);
    setIsBreathing(false);
    setCycleCount(0);
    setBreathPhase(0);
  };
  
  // Don't render if feature not unlocked
  if (!isFeatureUnlocked('basic_audio')) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`}>
      {/* Breath Moment Invitation */}
      <AnimatePresence>
        {activeBreathMoment && !isBreathing && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="bg-gradient-to-br from-white via-sacred-blue-50 to-sacred-gold-50 border border-sacred-blue-200 rounded-2xl p-6 shadow-xl max-w-sm">
              {/* Gentle breathing animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center mb-4"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-sacred-blue-400 to-sacred-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">🫁</span>
                </div>
              </motion.div>
              
              <p className="text-center text-sm text-sacred-blue-800 mb-4 leading-relaxed">
                {activeBreathMoment.message}
              </p>
              
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startBreathing}
                  className="flex-1 bg-sacred-gradient text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  🧘 Breathe
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={dismissBreathMoment}
                  className="px-4 py-2 bg-white border border-sacred-blue-200 text-sacred-blue-600 rounded-lg text-sm"
                >
                  Later
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Breathing Guide */}
      <AnimatePresence>
        {isBreathing && activeBreathMoment && showBreathGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-white to-sacred-blue-50 rounded-3xl p-8 shadow-2xl max-w-md mx-4"
            >
              {/* Breathing visualization */}
              <div className="text-center mb-6">
                <motion.div
                  animate={{ 
                    scale: breathCycle === 'inhale' ? [1, 1.3] : 
                           breathCycle === 'hold' ? 1.3 : 
                           [1.3, 1]
                  }}
                  transition={{ 
                    duration: breathCycle === 'inhale' ? 4 : 
                             breathCycle === 'hold' ? 0 : 6,
                    ease: "easeInOut" 
                  }}
                  className="mx-auto w-24 h-24 bg-sacred-gradient rounded-full flex items-center justify-center mb-4"
                >
                  <span className="text-white text-3xl">🌸</span>
                </motion.div>
                
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">
                  {breathCycle === 'inhale' ? 'Breathe In' : 
                   breathCycle === 'hold' ? 'Hold' : 'Breathe Out'}
                </h3>
                
                <p className="text-sacred-blue-600 text-sm">
                  Cycle {cycleCount + 1} of {breathPatterns[activeBreathMoment.breathPattern || 'simple'].cycles}
                </p>
              </div>
              
              {/* Breathing instruction */}
              <p className="text-center text-sacred-blue-700 mb-6">
                {breathCycle === 'inhale' && 'Draw in peace and divine presence'}
                {breathCycle === 'hold' && 'Rest in sacred stillness'}
                {breathCycle === 'exhale' && 'Release all that burdens your soul'}
              </p>
              
              {/* Progress indicator */}
              <div className="flex justify-center space-x-2">
                {Array.from({ length: breathPatterns[activeBreathMoment.breathPattern || 'simple'].cycles }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      i <= cycleCount ? 'bg-sacred-blue-400' : 'bg-sacred-blue-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SacredBreathMoments;
