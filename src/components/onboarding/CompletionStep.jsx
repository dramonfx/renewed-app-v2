
'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const CompletionStep = ({ onboardingData = {}, data = {} }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Use onboardingData if available, fallback to data prop
  const safeData = onboardingData || data || {};

  useEffect(() => {
    setShowConfetti(true);
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const getPathInfo = () => {
    const pathMap = {
      gentle: { name: 'The Gentle Path', icon: '🌱', color: 'sacred-gold' },
      balanced: { name: 'The Balanced Path', icon: '⚖️', color: 'sacred-blue' },
      intensive: { name: 'The Intensive Path', icon: '🔥', color: 'sacred-purple' }
    };
    return pathMap[safeData.selectedPath] || pathMap.balanced;
  };

  const pathInfo = getPathInfo();
  const intentionCount = safeData.intentions?.length || 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-sacred-blue-gradient relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && typeof window !== 'undefined' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-sacred-gold-400 rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: -10,
                rotate: 0,
              }}
              animate={{
                y: (typeof window !== 'undefined' ? window.innerHeight : 800) + 10,
                rotate: 360,
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                ease: 'linear',
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      <div className="w-full max-w-4xl mx-auto text-center">
        {/* Main Completion Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-3xl p-12 md:p-16 shadow-2xl mb-8"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-24 h-24 md:w-32 md:h-32 mx-auto mb-8 rounded-full bg-sacred-gradient flex items-center justify-center shadow-2xl"
          >
            <span className="text-white text-4xl md:text-5xl">✨</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif text-sacred-blue-900 mb-6 leading-tight"
          >
            Your Sacred Journey{' '}
            <span className="bg-sacred-gradient bg-clip-text text-transparent">
              Begins Now
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-sacred-blue-600 text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Congratulations! You've taken the first sacred step toward transformation. 
            Your personalized journey awaits.
          </motion.p>

          {/* Journey Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="bg-sacred-blue-50 rounded-2xl p-8 mb-8"
          >
            <h3 className="text-2xl font-serif text-sacred-blue-900 mb-6">Your Sacred Path Summary</h3>
            
            <div className="grid md:grid-cols-3 gap-6 text-center">
              {/* Selected Path */}
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center">
                  <span className="text-white text-2xl">{pathInfo.icon}</span>
                </div>
                <h4 className="font-serif text-lg text-sacred-blue-900 mb-2">Your Path</h4>
                <p className="text-sacred-blue-600">{pathInfo.name}</p>
              </div>

              {/* Intentions Count */}
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h4 className="font-serif text-lg text-sacred-blue-900 mb-2">Intentions Set</h4>
                <p className="text-sacred-blue-600">{intentionCount} Sacred Intentions</p>
              </div>

              {/* Mind Choice */}
              <div>
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center">
                  <span className="text-white text-2xl">
                    {safeData.selectedMind === 'new' ? '✨' : '🌫️'}
                  </span>
                </div>
                <h4 className="font-serif text-lg text-sacred-blue-900 mb-2">Mind Focus</h4>
                <p className="text-sacred-blue-600">
                  {safeData.selectedMind === 'new' ? 'New Mind' : 'Old Mind'} Awareness
                </p>
              </div>
            </div>
          </motion.div>

          {/* Inspiring Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="bg-gradient-to-r from-sacred-gold-50 to-sacred-purple-50 rounded-2xl p-6 border border-sacred-gold-200"
          >
            <p className="text-sacred-blue-700 text-lg italic leading-relaxed">
              "The journey of a thousand miles begins with one step. You have taken that step. 
              Trust the process, embrace the transformation, and remember that every moment 
              is a new opportunity to choose the New Mind."
            </p>
          </motion.div>
        </motion.div>

        {/* Auto-redirect Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="text-center"
        >
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/40">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="w-6 h-6 rounded-full bg-sacred-gradient animate-pulse"></div>
              <span className="text-sacred-blue-700 font-medium">
                Preparing your personalized experience...
              </span>
            </div>
            <p className="text-sacred-blue-600 text-sm">
              You'll be redirected to your sacred journey in a few moments
            </p>
          </div>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-sacred-gold-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-sacred-purple-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </div>
  );
};

export default CompletionStep;
