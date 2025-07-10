
'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import type { SpiritualMilestone } from '@/contexts/SpiritualJourneyContext';

interface MilestoneCelebrationProps {
  milestone: SpiritualMilestone;
  onDismiss: () => void;
}

const MilestoneCelebration: React.FC<MilestoneCelebrationProps> = ({
  milestone,
  onDismiss
}) => {
  const [showUnlocks, setShowUnlocks] = useState(false);
  const { features } = useSpiritualJourney();
  
  // Auto-show unlocks after celebration animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowUnlocks(true);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const unlockedFeatures = features.filter(f => 
    milestone.unlocks.includes(f.key)
  );
  
  if (!milestone.celebration) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onDismiss}
    >
      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sacred background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-sacred-gold-50 via-white to-sacred-blue-50">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-sacred-gradient opacity-20"
          />
        </div>
        
        <div className="relative p-8 text-center">
          {/* Celebration Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.2,
              type: "spring",
              stiffness: 200,
              damping: 20
            }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-xl"
          >
            <motion.span
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-3xl text-white"
            >
              {milestone.celebration.icon}
            </motion.span>
          </motion.div>
          
          {/* Celebration Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4 font-serif text-2xl text-sacred-blue-900"
          >
            {milestone.celebration.title}
          </motion.h2>
          
          {/* Celebration Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-6 text-sacred-blue-700 leading-relaxed"
          >
            {milestone.celebration.message}
          </motion.p>
          
          {/* Unlocked Features */}
          <AnimatePresence>
            {showUnlocks && unlockedFeatures.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 rounded-xl bg-sacred-gold-50 p-4"
              >
                <h3 className="mb-3 font-medium text-sacred-blue-900">
                  ✨ New Sacred Gifts Unlocked
                </h3>
                
                <div className="space-y-2">
                  {unlockedFeatures.map((feature, index) => (
                    <motion.div
                      key={feature.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      className="flex items-center space-x-3 rounded-lg bg-white/60 p-3"
                    >
                      <span className="text-lg">{feature.icon}</span>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-sacred-blue-900">
                          {feature.title}
                        </p>
                        <p className="text-xs text-sacred-blue-600">
                          {feature.unlockMessage || feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Dawn Breaking Animation */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ 
              delay: 1.2,
              duration: 1.5,
              ease: "easeOut"
            }}
            className="mb-6 h-1 bg-sacred-gradient rounded-full"
          />
          
          {/* Gentle Blessing */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="mb-6 text-xs text-sacred-blue-500 italic"
          >
            &ldquo;Every step forward is a step closer to your true self&rdquo;
          </motion.p>
          
          {/* Continue Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDismiss}
            className="rounded-xl bg-sacred-gradient px-8 py-3 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            Continue Sacred Journey
          </motion.button>
        </div>
        
        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              scale: 0, 
              x: Math.random() * 400 - 200,
              y: Math.random() * 600 - 300
            }}
            animate={{
              scale: [0, 1, 0],
              y: [0, -100, -200],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeOut"
            }}
            className="absolute text-sacred-gold-400 pointer-events-none"
          >
            ✨
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// Global celebration manager component
export const SacredCelebrationManager: React.FC = () => {
  const { pendingCelebration, dismissCelebration } = useSpiritualJourney();
  
  return (
    <AnimatePresence>
      {pendingCelebration && (
        <MilestoneCelebration
          milestone={pendingCelebration}
          onDismiss={dismissCelebration}
        />
      )}
    </AnimatePresence>
  );
};

export default MilestoneCelebration;

