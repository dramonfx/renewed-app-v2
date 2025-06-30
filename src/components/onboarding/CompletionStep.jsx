'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const CompletionStep = ({ onboardingData = {}, data = {} }) => {
  // Use onboardingData if available, fallback to data prop
  const safeData = onboardingData || data || {};

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
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <div className="flex items-center justify-between">
              <div className="text-center w-full">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl">{pathInfo.icon}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
                  Welcome to Your{' '}
                  <span className="bg-sacred-gradient bg-clip-text text-transparent">
                    Sacred Journey
                  </span>
                </h1>
                <p className="text-sacred-blue-600 text-lg">
                  Your transformation begins now. You're ready to embark on this sacred path of renewal.
                </p>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Path Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Your Sacred Path Summary</h2>
          <SacredCard variant="heavy" className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Selected Path */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="p-4 rounded-lg bg-sacred-gold-50 border border-sacred-gold-200"
              >
                <h3 className="text-lg font-serif text-sacred-blue-900 mb-3">
                  Chosen Path
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">{pathInfo.icon}</span>
                  </div>
                  <span className="text-sacred-blue-900 font-medium">{pathInfo.name}</span>
                </div>
              </motion.div>

              {/* Intentions Count */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="p-4 rounded-lg bg-sacred-purple-50 border border-sacred-purple-200"
              >
                <h3 className="text-lg font-serif text-sacred-blue-900 mb-3">
                  Sacred Intentions
                </h3>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🎯</span>
                  </div>
                  <span className="text-sacred-blue-900 font-medium">
                    {intentionCount} {intentionCount === 1 ? 'Intention' : 'Intentions'} Set
                  </span>
                </div>
              </motion.div>

              {/* Personal Info - only if data exists */}
              {safeData.name && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="p-4 rounded-lg bg-sacred-teal-50 border border-sacred-teal-200"
                >
                  <h3 className="text-lg font-serif text-sacred-blue-900 mb-3">
                    Sacred Name
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sacred-teal-gradient flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">✨</span>
                    </div>
                    <span className="text-sacred-blue-900 font-medium">{safeData.name}</span>
                  </div>
                </motion.div>
              )}

              {/* Experience Level */}
              {safeData.experience && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="p-4 rounded-lg bg-sacred-rose-50 border border-sacred-rose-200"
                >
                  <h3 className="text-lg font-serif text-sacred-blue-900 mb-3">
                    Experience Level
                  </h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-sacred-rose-gradient flex items-center justify-center shadow-lg">
                      <span className="text-white text-xl">🌟</span>
                    </div>
                    <span className="text-sacred-blue-900 font-medium capitalize">{safeData.experience}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </SacredCard>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Personalized Content</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Receive teachings and content tailored specifically to your chosen path and spiritual journey
                </p>
              </SacredCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Sacred Journal</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Track your spiritual growth and transformation through guided journaling and reflection
                </p>
              </SacredCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Guided Practice</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Daily exercises and practices designed to support your spiritual transformation goals
                </p>
              </SacredCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredCard variant="glass" className="p-8">
            <SacredButton
              onClick={() => {
                // Store completion in localStorage
                if (typeof window !== 'undefined') {
                  localStorage.setItem('renewedOnboardingCompleted', 'true');
                  localStorage.setItem('renewedOnboardingData', JSON.stringify(safeData));
                  // Redirect to dashboard
                  window.location.href = '/dashboard';
                }
              }}
              variant="gold"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Begin Your Sacred Journey ✨
            </SacredButton>
            <p className="text-sacred-blue-600 text-sm mt-4">
              Your personalized dashboard and spiritual toolkit await you.
            </p>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionStep;