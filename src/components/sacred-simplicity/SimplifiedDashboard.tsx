
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import { FeatureGate } from './FeatureGate';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

interface SimplifiedDashboardProps {
  greeting: string;
  currentMindset: string;
  user: any;
}

const SimplifiedDashboard: React.FC<SimplifiedDashboardProps> = ({
  greeting,
  currentMindset,
  user
}) => {
  const router = useRouter();
  const { 
    currentStage,
    engagement,
    getNextMilestone,
    isSimplicityMode
  } = useSpiritualJourney();
  
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const nextMilestone = getNextMilestone();

  useEffect(() => {
    // Show welcome message for new users
    const hasSeenWelcome = localStorage.getItem('renewedSimplicityWelcome');
    if (!hasSeenWelcome && isSimplicityMode) {
      setShowWelcomeMessage(true);
      localStorage.setItem('renewedSimplicityWelcome', 'true');
    }
  }, [isSimplicityMode]);

  // Core actions available from the start
  const coreActions = [
    {
      title: 'Sacred Audio',
      description: 'Begin with divine wisdom through sound',
      icon: '🎧',
      href: '/full-audio-player',
      variant: 'primary' as const,
      spiritualContext: 'Let the sacred voice guide your heart',
      isAvailable: true
    },
    {
      title: 'Sacred Journal',
      description: 'Capture your first spiritual thoughts',
      icon: '📝',
      href: '/journal',
      variant: 'gold' as const,
      spiritualContext: 'Begin with a single sacred word',
      isAvailable: true
    }
  ];

  // Gentle actions that will unlock progressively
  const gentleActions = [
    {
      title: 'Mindset Awareness',
      description: 'Discover your spiritual perspective',
      icon: '🧠',
      href: '/dashboard#mindset',
      variant: 'ghost' as const,
      spiritualContext: 'Understand where you are on the journey',
      featureKey: 'mindset_tracker'
    },
    {
      title: 'Sacred Bookmarks',
      description: 'Save meaningful moments for reflection',
      icon: '🔖',
      href: '/dashboard#bookmarks',
      variant: 'ghost' as const,
      spiritualContext: 'Mark the moments that speak to your soul',
      featureKey: 'audio_bookmarks'
    }
  ];

  // Stage descriptions
  const stageDescriptions = {
    seed: {
      title: 'Sacred Seed Stage',
      description: 'Every great oak begins as a small acorn. You are planting the first seeds of spiritual transformation.',
      icon: '🌱',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    growth: {
      title: 'Sacred Growth Stage', 
      description: 'Your spiritual roots are deepening. Each practice strengthens your connection to divine truth.',
      icon: '🌿',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    maturity: {
      title: 'Sacred Maturity Stage',
      description: 'Wisdom flowers in your heart. Your consistent practice bears spiritual fruit.',
      icon: '🌳',
      color: 'text-emerald-700',
      bgColor: 'bg-emerald-50'
    },
    mastery: {
      title: 'Sacred Mastery Stage',
      description: 'You have become a beacon of spiritual light, ready to guide others on their journey.',
      icon: '✨',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  };

  const currentStageInfo = stageDescriptions[currentStage];

  return (
    <div className="space-y-8">
      {/* Sacred Welcome Message */}
      <AnimatePresence>
        {showWelcomeMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden"
          >
            <SacredCard variant="heavy" className="p-6 bg-gradient-to-br from-sacred-gold-50 to-sacred-blue-50">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowWelcomeMessage(false)}
                className="absolute top-4 right-4 text-sacred-blue-400 hover:text-sacred-blue-600"
              >
                ✕
              </motion.button>
              
              <div className="text-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mx-auto mb-4 text-6xl"
                >
                  🕊️
                </motion.div>
                
                <h2 className="mb-3 font-serif text-2xl text-sacred-blue-900">
                  Welcome to Sacred Simplicity
                </h2>
                
                <p className="mb-4 text-sacred-blue-700 leading-relaxed">
                  Your spiritual journey begins with gentle steps. Start simple, grow gradually, 
                  and let divine wisdom unfold naturally as you&apos;re ready to receive it.
                </p>
                
                <div className="text-sm text-sacred-blue-600 italic">
                  &ldquo;In simplicity, the soul finds space to breathe and grow.&rdquo;
                </div>
              </div>
            </SacredCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Simplified Sacred Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="heavy" className="p-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mb-3 font-serif text-3xl text-sacred-blue-900 md:text-4xl"
              >
                {greeting}, Sacred Soul! 🙏
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="mb-4 text-lg text-sacred-blue-600"
              >
                Your spiritual journey awaits. Begin with what speaks to your heart.
              </motion.p>
              
              {/* Current Stage Indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 ${currentStageInfo.bgColor}`}
              >
                <span className={`text-xl ${currentStageInfo.color}`}>
                  {currentStageInfo.icon}
                </span>
                <span className={`text-sm font-medium ${currentStageInfo.color}`}>
                  {currentStageInfo.title}
                </span>
              </motion.div>
            </div>
            
            <div className="hidden md:block">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
              >
                <span className="text-4xl text-white">{currentStageInfo.icon}</span>
              </motion.div>
            </div>
          </div>
        </SacredCard>
      </motion.div>

      {/* Current Stage Wisdom */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SacredCard variant="glass" className="p-6">
          <div className="text-center">
            <h2 className="mb-3 font-serif text-xl text-sacred-blue-900">
              Your Sacred Stage
            </h2>
            <p className="text-sacred-blue-700 leading-relaxed">
              {currentStageInfo.description}
            </p>
            
            {/* Progress hint */}
            {nextMilestone && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-4 rounded-lg bg-white/60 p-4"
              >
                <p className="text-sm text-sacred-blue-600 mb-2">
                  🌸 Next Sacred Gift Awaits
                </p>
                <p className="text-sm font-medium text-sacred-blue-800">
                  {nextMilestone.title}
                </p>
                <p className="text-xs text-sacred-blue-600">
                  {nextMilestone.description}
                </p>
              </motion.div>
            )}
          </div>
        </SacredCard>
      </motion.div>

      {/* Core Sacred Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">
          Begin Your Sacred Practice
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {coreActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            >
              <SacredCard
                variant="glass"
                className="group h-full p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <div className="text-center">
                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-lg group-hover:shadow-xl"
                  >
                    <span className="text-3xl text-white">{action.icon}</span>
                  </motion.div>
                  
                  <h3 className="mb-3 font-serif text-xl text-sacred-blue-900 group-hover:text-sacred-blue-800">
                    {action.title}
                  </h3>
                  
                  <p className="mb-4 text-sm leading-relaxed text-sacred-blue-600">
                    {action.description}
                  </p>
                  
                  <div className="mb-4 text-xs text-sacred-blue-500 italic">
                    {action.spiritualContext}
                  </div>
                  
                  <motion.div
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SacredButton 
                      variant={action.variant} 
                      size="sm" 
                      className="w-full group-hover:shadow-md"
                    >
                      Begin Sacred Practice
                    </SacredButton>
                  </motion.div>
                </div>
              </SacredCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Gentle Features (Progressive Disclosure) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">
          Sacred Tools & Guidance
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {gentleActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <FeatureGate 
                featureKey={action.featureKey}
                showHint={true}
                className="h-full"
              >
                <SacredCard
                  variant="glass"
                  className="group h-full p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                  onClick={() => router.push(action.href)}
                >
                  <div className="text-center">
                    <motion.div
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg group-hover:shadow-xl"
                    >
                      <span className="text-2xl text-white">{action.icon}</span>
                    </motion.div>
                    
                    <h3 className="mb-3 font-serif text-lg text-sacred-blue-900 group-hover:text-sacred-blue-800">
                      {action.title}
                    </h3>
                    
                    <p className="mb-4 text-sm leading-relaxed text-sacred-blue-600">
                      {action.description}
                    </p>
                    
                    <div className="mb-4 text-xs text-sacred-blue-500 italic">
                      {action.spiritualContext}
                    </div>
                    
                    <motion.div
                      whileHover={{ y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <SacredButton 
                        variant={action.variant} 
                        size="sm" 
                        className="w-full group-hover:shadow-md"
                      >
                        Explore
                      </SacredButton>
                    </motion.div>
                  </div>
                </SacredCard>
              </FeatureGate>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Essential Metrics (Simplified) */}
      <FeatureGate featureKey="growth_metrics" showHint={true}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">
            Sacred Growth Insights
          </h2>
          
          <div className="grid gap-4 md:grid-cols-3">
            <SacredCard variant="glass" className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <span className="text-2xl">📝</span>
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="mb-2 font-serif text-2xl font-bold text-blue-600"
              >
                {engagement.journalEntries}
              </motion.div>
              <h3 className="mb-1 text-sm font-medium text-sacred-blue-900">Sacred Entries</h3>
              <p className="text-xs text-sacred-blue-600">Words of wisdom captured</p>
            </SacredCard>
            
            <SacredCard variant="glass" className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-50">
                <span className="text-2xl">🎧</span>
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.1 }}
                className="mb-2 font-serif text-2xl font-bold text-purple-600"
              >
                {engagement.audioListeningTime}m
              </motion.div>
              <h3 className="mb-1 text-sm font-medium text-sacred-blue-900">Sacred Listening</h3>
              <p className="text-xs text-sacred-blue-600">Minutes of divine wisdom</p>
            </SacredCard>
            
            <SacredCard variant="glass" className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                <span className="text-2xl">🌟</span>
              </div>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="mb-2 font-serif text-2xl font-bold text-emerald-600"
              >
                {engagement.currentStreak}
              </motion.div>
              <h3 className="mb-1 text-sm font-medium text-sacred-blue-900">Sacred Streak</h3>
              <p className="text-xs text-sacred-blue-600">Days of faithful practice</p>
            </SacredCard>
          </div>
        </motion.div>
      </FeatureGate>

      {/* Sacred Footer Blessing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="pt-8 text-center"
      >
        <p className="text-sm text-sacred-blue-500 italic">
          🙏 &ldquo;Be still and know that sacred transformation unfolds in divine timing&rdquo;
        </p>
      </motion.div>
    </div>
  );
};

export default SimplifiedDashboard;

