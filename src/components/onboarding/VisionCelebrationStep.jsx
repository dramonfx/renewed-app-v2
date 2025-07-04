
'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const VisionCelebrationStep = ({ onNext, journeyData = {}, data = {} }) => {
  // Use journeyData if available, fallback to data prop
  const safeData = journeyData || data || {};

  const getPathInfo = () => {
    const pathMap = {
      gentle: { 
        name: 'The Gentle Path', 
        icon: '🌱', 
        color: 'sacred-gold',
        description: 'A nurturing approach to spiritual growth with gentle daily practices'
      },
      balanced: { 
        name: 'The Balanced Path', 
        icon: '⚖️', 
        color: 'sacred-blue',
        description: 'A harmonious blend of contemplation and active spiritual practice'
      },
      intensive: { 
        name: 'The Intensive Path', 
        icon: '🔥', 
        color: 'sacred-purple',
        description: 'An immersive journey with deep spiritual practices and commitment'
      },
    };
    return pathMap[safeData.selectedPath] || pathMap.balanced;
  };

  const pathInfo = getPathInfo();
  const intentionCount = safeData.intentions?.length || 0;

  // Get first few intentions to display
  const displayIntentions = safeData.intentions?.slice(0, 3) || [];

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Celebratory Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 shadow-2xl"
          >
            <span className="text-4xl">✨</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6 font-serif text-4xl font-bold text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)' }}
          >
            Your Vision is Set
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mx-auto max-w-2xl text-xl text-white/90 lg:text-2xl"
            style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}
          >
            Your sacred journey of transformation is ready to begin. Everything you need awaits you.
          </motion.p>
        </motion.div>

        {/* Journey Summary */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-white" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
            Your Sacred Journey Summary
          </h2>
          
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Chosen Path */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <SacredCard variant="heavy" className="h-full p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl">
                    <span className="text-3xl text-white">{pathInfo.icon}</span>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-slate-800">Your Chosen Path</h3>
                  <h4 className="mb-4 text-xl font-bold text-blue-600">{pathInfo.name}</h4>
                  <p className="text-slate-600 leading-relaxed">{pathInfo.description}</p>
                </div>
              </SacredCard>
            </motion.div>

            {/* Sacred Intentions */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <SacredCard variant="heavy" className="h-full p-8">
                <div className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-xl">
                    <span className="text-3xl text-white">🎯</span>
                  </div>
                  <h3 className="mb-4 font-serif text-2xl font-semibold text-slate-800">Sacred Intentions</h3>
                  <div className="mb-4">
                    <span className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-lg font-semibold text-purple-800">
                      {intentionCount} {intentionCount === 1 ? 'Intention' : 'Intentions'} Set
                    </span>
                  </div>
                  {displayIntentions.length > 0 && (
                    <div className="space-y-2">
                      {displayIntentions.map((intention, index) => (
                        <div key={index} className="rounded-lg bg-purple-50 px-3 py-2 text-sm text-purple-700">
                          {intention}
                        </div>
                      ))}
                      {intentionCount > 3 && (
                        <div className="text-sm text-slate-500">
                          +{intentionCount - 3} more intentions
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </SacredCard>
            </motion.div>
          </div>
        </motion.div>

        {/* What Awaits You */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mb-12"
        >
          <h2 className="mb-8 text-center font-serif text-3xl font-semibold text-white" style={{ textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)' }}>
            What Awaits You
          </h2>
          
          <SacredCard variant="heavy" className="p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Interactive Book Experience */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.6 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
                  <span className="text-2xl text-white">📖</span>
                </div>
                <h3 className="mb-4 font-serif text-xl font-semibold text-slate-800">Interactive Sacred Book</h3>
                <p className="text-slate-600 leading-relaxed">
                  Immerse yourself in beautifully crafted teachings with audio narration, visual elements, and guided reflections tailored to your path.
                </p>
              </motion.div>

              {/* Personalized Journey */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <span className="text-2xl text-white">🗺️</span>
                </div>
                <h3 className="mb-4 font-serif text-xl font-semibold text-slate-800">Personalized Journey</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your content and practices are specifically curated based on your chosen path and sacred intentions for maximum transformation.
                </p>
              </motion.div>

              {/* Sacred Journal */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 2.0 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <span className="text-2xl text-white">✍️</span>
                </div>
                <h3 className="mb-4 font-serif text-xl font-semibold text-slate-800">Sacred Journal</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track your spiritual growth through guided journaling, reflection prompts, and mindset discernment practices.
                </p>
              </motion.div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          className="text-center"
        >
          <SacredCard variant="heavy" className="p-8 lg:p-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 2.4 }}
            >
              <h3 className="mb-6 font-serif text-2xl font-semibold text-slate-800 lg:text-3xl">
                Your Sacred Journey Begins Now
              </h3>
              <p className="mb-8 text-lg text-slate-600">
                Step into your transformation with confidence. Your personalized spiritual toolkit is ready.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SacredButton
                  onClick={() => {
                    onNext && onNext(safeData);
                  }}
                  variant="gold"
                  size="lg"
                  className="px-12 py-4 text-xl font-bold shadow-2xl"
                >
                  Begin Your Sacred Journey ✨
                </SacredButton>
              </motion.div>
              
              <p className="mt-6 text-sm text-slate-500">
                Your personalized dashboard and spiritual practices await you
              </p>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default VisionCelebrationStep;
