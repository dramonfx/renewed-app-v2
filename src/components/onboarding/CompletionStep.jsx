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

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-2xl mx-auto text-center relative z-10"
      >
        {/* Sacred Symbol */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-sacred-gold-500/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-sacred-gold-400/30">
            <span className="text-4xl">{pathInfo.icon}</span>
          </div>
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Your Sacred Journey
          </h1>
          <p className="text-xl text-sacred-gold-200 mb-6">
            Your transformation begins now
          </p>
        </motion.div>

        {/* Path Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20"
        >
          <h2 className="text-2xl font-semibold text-white mb-6">
            Your Sacred Path Summary
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 text-left">
            {/* Selected Path */}
            <div className="bg-sacred-gold-500/10 rounded-xl p-4 border border-sacred-gold-400/20">
              <h3 className="text-lg font-medium text-sacred-gold-200 mb-2">
                Chosen Path
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{pathInfo.icon}</span>
                <span className="text-white font-medium">{pathInfo.name}</span>
              </div>
            </div>

            {/* Intentions Count */}
            <div className="bg-sacred-purple-500/10 rounded-xl p-4 border border-sacred-purple-400/20">
              <h3 className="text-lg font-medium text-sacred-purple-200 mb-2">
                Sacred Intentions
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-white font-medium">
                  {intentionCount} {intentionCount === 1 ? 'Intention' : 'Intentions'} Set
                </span>
              </div>
            </div>

            {/* Personal Info */}
            {safeData.name && (
              <div className="bg-sacred-teal-500/10 rounded-xl p-4 border border-sacred-teal-400/20">
                <h3 className="text-lg font-medium text-sacred-teal-200 mb-2">
                  Sacred Name
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <span className="text-white font-medium">{safeData.name}</span>
                </div>
              </div>
            )}

            {/* Experience Level */}
            {safeData.experience && (
              <div className="bg-sacred-rose-500/10 rounded-xl p-4 border border-sacred-rose-400/20">
                <h3 className="text-lg font-medium text-sacred-rose-200 mb-2">
                  Experience Level
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌟</span>
                  <span className="text-white font-medium capitalize">{safeData.experience}</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            What Happens Next?
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl mb-2">📚</div>
              <div className="text-sacred-gold-200 font-medium mb-1">Personalized Content</div>
              <div className="text-white/70">Receive teachings tailored to your path</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl mb-2">📝</div>
              <div className="text-sacred-gold-200 font-medium mb-1">Sacred Journal</div>
              <div className="text-white/70">Track your spiritual growth journey</div>
            </div>
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-sacred-gold-200 font-medium mb-1">Guided Practice</div>
              <div className="text-white/70">Daily exercises for transformation</div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <button
            onClick={() => {
              // Store completion in localStorage
              if (typeof window !== 'undefined') {
                localStorage.setItem('renewed_onboarding_complete', 'true');
                localStorage.setItem('renewed_onboarding_data', JSON.stringify(safeData));
                // Redirect to dashboard
                window.location.href = '/dashboard';
              }
            }}
            className="bg-sacred-gold-500 hover:bg-sacred-gold-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Begin Your Sacred Journey
          </button>
        </motion.div>
      </motion.div>

      {/* Ambient Background Effects */}
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