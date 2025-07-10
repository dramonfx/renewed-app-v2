
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, HeartIcon, SunIcon } from '@heroicons/react/24/outline';

// Sacred quotes from spiritual masters
const sacredQuotes = [
  // Renewed: The New Man Story
  {
    text: "The natural man sees only what is visible, but the spiritual man perceives the eternal within the temporal.",
    source: "Renewed: The New Man Story",
    category: "transformation"
  },
  {
    text: "True renewal begins when we cease striving in our own strength and learn to rest in divine grace.",
    source: "Renewed: The New Man Story", 
    category: "surrender"
  },
  {
    text: "Every moment holds the possibility of awakening, if only we have eyes to see.",
    source: "Renewed: The New Man Story",
    category: "awareness"
  },
  
  // Thomas à Kempis
  {
    text: "Be not angry that you cannot make others as you wish them to be, since you cannot make yourself as you wish to be.",
    source: "Thomas à Kempis",
    category: "patience"
  },
  {
    text: "If you cannot recollect yourself continuously, do so once a day at least, namely, in the morning or in the evening.",
    source: "Thomas à Kempis",
    category: "practice"
  },
  {
    text: "Love feels no burden, thinks nothing of trouble, attempts what is above its strength.",
    source: "Thomas à Kempis", 
    category: "love"
  },

  // Teresa of Ávila  
  {
    text: "Let nothing disturb you, all things pass away. God never changes.",
    source: "Teresa of Ávila",
    category: "peace"
  },
  {
    text: "We need no wings to go in search of Him, but have only to find a place where we can be alone and look upon Him present within us.",
    source: "Teresa of Ávila",
    category: "presence"
  },
  {
    text: "The soul is like a castle made of diamond where His Majesty dwells.",
    source: "Teresa of Ávila",
    category: "divine"
  }
];

// Get random quote by category or general
const getRandomQuote = (category = null) => {
  const filteredQuotes = category 
    ? sacredQuotes.filter(q => q.category === category)
    : sacredQuotes;
  
  if (filteredQuotes.length === 0) return sacredQuotes[0];
  
  return filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
};

// Contemplative Loading Component
export function ContemplativeLoading({ 
  text = "Preparing your sacred space...", 
  category = null,
  showQuote = true 
}) {
  const [currentQuote, setCurrentQuote] = useState(null);

  useEffect(() => {
    if (showQuote) {
      setCurrentQuote(getRandomQuote(category));
    }
  }, [category, showQuote]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex min-h-[400px] flex-col items-center justify-center p-8"
    >
      {/* Contemplative Animation */}
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
        className="mb-6"
      >
        <SparklesIcon className="h-16 w-16 text-blue-500" />
      </motion.div>

      {/* Loading Text */}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 text-lg text-blue-700 text-center"
      >
        {text}
      </motion.p>

      {/* Sacred Quote */}
      {showQuote && currentQuote && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="max-w-md text-center"
        >
          <blockquote className="italic text-blue-600 mb-3 text-sm leading-relaxed">
            "{currentQuote.text}"
          </blockquote>
          <cite className="text-xs text-blue-500 font-medium">
            — {currentQuote.source}
          </cite>
        </motion.div>
      )}

      {/* Breathing Space */}
      <motion.div
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="mt-8 w-2 h-2 bg-blue-400 rounded-full"
      />
    </motion.div>
  );
}

// Spiritual Pause Moment - appears during natural pauses
export function SpiritualPause({ 
  trigger = "click", 
  duration = 3000,
  category = null
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(null);

  const showPause = () => {
    setCurrentQuote(getRandomQuote(category));
    setIsVisible(true);
    
    setTimeout(() => {
      setIsVisible(false);
    }, duration);
  };

  useEffect(() => {
    if (trigger === "auto") {
      // Auto-trigger after component mounts
      const timer = setTimeout(showPause, 1000);
      return () => clearTimeout(timer);
    }
  }, [trigger, duration]);

  return (
    <>
      {trigger === "click" && (
        <button
          onClick={showPause}
          className="group p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
          title="Take a spiritual pause"
        >
          <HeartIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
        </button>
      )}

      <AnimatePresence>
        {isVisible && currentQuote && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="max-w-lg bg-white rounded-2xl p-8 shadow-2xl"
            >
              {/* Pause Icon */}
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center mb-6"
              >
                <SunIcon className="h-12 w-12 text-amber-500" />
              </motion.div>

              {/* Quote */}
              <blockquote className="text-center italic text-gray-700 mb-4 text-lg leading-relaxed">
                "{currentQuote.text}"
              </blockquote>
              
              <cite className="block text-center text-sm text-gray-500 font-medium">
                — {currentQuote.source}
              </cite>

              {/* Breathing Indicator */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="flex justify-center mt-6"
              >
                <div className="w-3 h-3 bg-blue-400 rounded-full" />
              </motion.div>

              {/* Close instruction */}
              <p className="text-center text-xs text-gray-400 mt-4">
                This moment of reflection will close automatically...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Gentle Milestone Celebration
export function MilestoneCelebration({ 
  milestone, 
  isVisible, 
  onClose 
}) {
  const celebrationQuote = getRandomQuote("transformation");

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            className="max-w-md bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-2xl border border-blue-200"
          >
            {/* Celebration Animation */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1, 
                repeat: 3, 
                ease: "easeInOut" 
              }}
              className="flex justify-center mb-6"
            >
              <SparklesIcon className="h-16 w-16 text-blue-500" />
            </motion.div>

            <h3 className="text-2xl font-serif text-blue-900 text-center mb-4">
              Sacred Milestone Achieved! 🌟
            </h3>
            
            <p className="text-blue-700 text-center mb-6">
              {milestone}
            </p>

            {/* Wisdom for the journey */}
            <blockquote className="text-center italic text-blue-600 mb-4 text-sm leading-relaxed border-t border-blue-200 pt-4">
              "{celebrationQuote.text}"
            </blockquote>
            
            <cite className="block text-center text-xs text-blue-500 font-medium mb-6">
              — {celebrationQuote.source}
            </cite>

            <div className="text-center">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Continue Journey
              </button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>
    );
}

export default {
  ContemplativeLoading,
  SpiritualPause, 
  MilestoneCelebration,
  getRandomQuote
};
