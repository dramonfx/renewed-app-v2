'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [currentMindset, setCurrentMindset] = useState('natural'); // natural, transition, spiritual
  const [spiritualMetrics, setSpiritualMetrics] = useState({
    totalReadingTime: 0,
    reflectionsCompleted: 0,
    sectionsCompleted: 0,
    spiritualGrowthScore: 0,
    mindsetEvolution: 'natural'
  });
  const [showDetailedProgress, setShowDetailedProgress] = useState(false);

  // Sacred mindset progression system
  const mindsetStages = {
    natural: {
      title: 'Natural Mind',
      description: 'Beginning your journey of awareness',
      icon: '🌱',
      color: 'bg-emerald-500',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-emerald-600',
      progress: 0,
      characteristics: ['Self-reliant thinking', 'Worldly perspective', 'Limited awareness']
    },
    transition: {
      title: 'Transitional Mind',
      description: 'Awakening to spiritual truth',
      icon: '🦋',
      color: 'bg-amber-500',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-amber-600',
      progress: 50,
      characteristics: ['Questioning worldly patterns', 'Seeking deeper truth', 'Growing awareness']
    },
    spiritual: {
      title: 'Spiritual Mind',
      description: 'Living from divine wisdom',
      icon: '✨',
      color: 'bg-purple-500',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-purple-600',
      progress: 100,
      characteristics: ['Divine perspective', 'Wisdom-guided decisions', 'Sacred awareness']
    }
  };

  useEffect(() => {
    // Check if onboarding is completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (!isCompleted) {
      router.push('/onboarding');
    }

    // Set time-based spiritual greeting
    const hour = new Date().getHours();
    if (hour < 6) setGreeting('Sacred early morning');
    else if (hour < 12) setGreeting('Blessed morning');
    else if (hour < 17) setGreeting('Peaceful afternoon');
    else if (hour < 20) setGreeting('Sacred evening');
    else setGreeting('Tranquil night');

    // Calculate journal metrics from localStorage
    const calculateJournalMetrics = () => {
      try {
        const entries = JSON.parse(localStorage.getItem('sacred_journal_entries') || '[]');
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        const entriesThisWeek = entries.filter(entry => 
          new Date(entry.created_at) >= weekAgo).length;
        const entriesThisMonth = entries.filter(entry => 
          new Date(entry.created_at) >= monthAgo).length;
        
        const audioLinkedEntries = entries.filter(entry => 
          entry.section_id || entry.audio_timestamp).length;
        
        const totalWordCount = entries.reduce((sum, entry) => 
          sum + (entry.word_count || 0), 0);

        // Calculate consistency score (entries per week over last month)
        const weeksSinceFirstEntry = entries.length > 0 ? 
          Math.max(1, Math.ceil((now - new Date(entries[entries.length - 1].created_at)) / (7 * 24 * 60 * 60 * 1000))) : 1;
        const consistencyScore = Math.min(100, (entries.length / weeksSinceFirstEntry) * 25);

        return {
          totalEntries: entries.length,
          entriesThisWeek,
          entriesThisMonth,
          audioLinkedEntries,
          totalWordCount,
          consistencyScore: Math.round(consistencyScore),
          averageWordsPerEntry: entries.length > 0 ? Math.round(totalWordCount / entries.length) : 0
        };
      } catch (error) {
        console.error('Error calculating journal metrics:', error);
        return {
          totalEntries: 0,
          entriesThisWeek: 0,
          entriesThisMonth: 0,
          audioLinkedEntries: 0,
          totalWordCount: 0,
          consistencyScore: 0,
          averageWordsPerEntry: 0
        };
      }
    };

    // Load spiritual metrics from localStorage or calculate from progress
    const loadSpiritualMetrics = () => {
      try {
        const savedMetrics = localStorage.getItem('renewedSpiritualMetrics');
        const onboardingData = localStorage.getItem('renewedOnboardingData');
        const journalMetrics = calculateJournalMetrics();
        
        if (savedMetrics) {
          const existingMetrics = JSON.parse(savedMetrics);
          // Enhance with journal metrics
          setSpiritualMetrics({
            ...existingMetrics,
            ...journalMetrics
          });
        } else {
          // Calculate initial metrics based on mock progress + journal data
          const calculatedMetrics = {
            totalReadingTime: 145, // minutes
            reflectionsCompleted: 8,
            sectionsCompleted: 2,
            spiritualGrowthScore: 25,
            mindsetEvolution: 'transition', // Based on progress
            ...journalMetrics
          };
          setSpiritualMetrics(calculatedMetrics);
          localStorage.setItem('renewedSpiritualMetrics', JSON.stringify(calculatedMetrics));
        }

        // Set current mindset based on progress
        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          const progressLevel = data.assessment?.spiritualReadiness || 'natural';
          setCurrentMindset(progressLevel);
        }
      } catch (error) {
        console.error('Error loading spiritual metrics:', error);
      }
    };

    loadSpiritualMetrics();
  }, [router]);

  // Calculate overall spiritual progress
  const overallProgress = useMemo(() => {
    const { sectionsCompleted, reflectionsCompleted, spiritualGrowthScore } = spiritualMetrics;
    const sectionProgress = (sectionsCompleted / 4) * 30; // 4 sections, 30% weight
    const reflectionProgress = (reflectionsCompleted / 20) * 40; // 20 reflections target, 40% weight
    const growthProgress = (spiritualGrowthScore / 100) * 30; // 30% weight
    return Math.min(100, sectionProgress + reflectionProgress + growthProgress);
  }, [spiritualMetrics]);

  const quickActions = [
    {
      title: 'Sacred Reading',
      description: 'Continue your contemplative study and spiritual learning',
      icon: '📖',
      href: '/book',
      variant: 'primary',
      spiritualContext: 'Deepen your understanding through sacred texts'
    },
    {
      title: 'Audio Meditation',
      description: 'Immerse yourself in guided spiritual audio experiences',
      icon: '🎧',
      href: '/full-audio-player',
      variant: 'gold',
      spiritualContext: 'Let divine wisdom speak to your heart'
    },
    {
      title: 'Spiritual Journal',
      description: 'Reflect and record your sacred insights and growth',
      icon: '📝',
      href: '/journal',
      variant: 'ghost',
      spiritualContext: 'Capture divine revelations and personal transformation'
    },
    {
      title: 'Deep Reflections',
      description: 'Explore profound spiritual questions and contemplations',
      icon: '🤔',
      href: '/reflections',
      variant: 'primary',
      spiritualContext: 'Journey deeper into sacred mysteries'
    },
  ];

  // Spiritual Mindset Tracker Component
  const SpiritualMindsetTracker = () => {
    const currentStage = mindsetStages[currentMindset];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8"
      >
        <SacredCard variant="heavy" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl text-sacred-blue-900">Sacred Mindset Evolution</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetailedProgress(!showDetailedProgress)}
              className="text-sm text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors"
            >
              {showDetailedProgress ? 'Hide Details' : 'View Details'}
            </motion.button>
          </div>

          {/* Current Mindset Display */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`flex h-16 w-16 items-center justify-center rounded-full ${currentStage.color} shadow-lg`}
              >
                <span className="text-2xl text-white">{currentStage.icon}</span>
              </motion.div>
              <div>
                <h3 className="font-serif text-xl text-sacred-blue-900">{currentStage.title}</h3>
                <p className="text-sm text-sacred-blue-600">{currentStage.description}</p>
              </div>
            </div>

            {/* Mindset Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-sacred-blue-700">Evolution Progress</span>
                <span className="text-sacred-blue-600">{Math.round(overallProgress)}%</span>
              </div>
              <div className="h-3 bg-sacred-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className={`h-full bg-gradient-to-r ${currentStage.gradientFrom} ${currentStage.gradientTo} rounded-full`}
                />
              </div>
            </div>
          </div>

          {/* Mindset Stages Timeline */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {Object.entries(mindsetStages).map(([key, stage], index) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className={`text-center p-3 rounded-xl transition-all duration-300 ${
                  key === currentMindset
                    ? 'bg-sacred-gradient text-white shadow-lg'
                    : 'bg-sacred-blue-50 text-sacred-blue-700 hover:bg-sacred-blue-100'
                }`}
              >
                <div className="text-2xl mb-2">{stage.icon}</div>
                <div className="text-sm font-medium">{stage.title}</div>
              </motion.div>
            ))}
          </div>

          {/* Detailed Progress */}
          <AnimatePresence>
            {showDetailedProgress && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-sacred-blue-200 pt-4"
              >
                <h4 className="font-medium text-sacred-blue-900 mb-3">Current Stage Characteristics:</h4>
                <ul className="space-y-2">
                  {currentStage.characteristics.map((characteristic, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center text-sm text-sacred-blue-700"
                    >
                      <span className="mr-2 text-sacred-gold-500">•</span>
                      {characteristic}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </SacredCard>
      </motion.div>
    );
  };

  // Sacred Metrics Dashboard Component
  const SacredMetricsDashboard = () => {
    const metrics = [
      {
        title: 'Reading Time',
        value: spiritualMetrics.totalReadingTime,
        unit: 'minutes',
        icon: '📚',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Sacred study time invested'
      },
      {
        title: 'Journal Entries',
        value: spiritualMetrics.totalEntries || 0,
        unit: 'written',
        icon: '📝',
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-50',
        description: 'Sacred reflections documented'
      },
      {
        title: 'Reflections',
        value: spiritualMetrics.reflectionsCompleted,
        unit: 'completed',
        icon: '💭',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        description: 'Deep spiritual contemplations'
      },
      {
        title: 'Audio Links',
        value: spiritualMetrics.audioLinkedEntries || 0,
        unit: 'connected',
        icon: '🎧',
        color: 'text-teal-600',
        bgColor: 'bg-teal-50',
        description: 'Entries linked to audio moments'
      },
      {
        title: 'Consistency',
        value: spiritualMetrics.consistencyScore || 0,
        unit: '%',
        icon: '🌟',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'Spiritual writing consistency'
      },
      {
        title: 'Words Written',
        value: Math.round((spiritualMetrics.totalWordCount || 0) / 1000 * 10) / 10,
        unit: 'k words',
        icon: '✍️',
        color: 'text-rose-600',
        bgColor: 'bg-rose-50',
        description: 'Sacred words of wisdom captured'
      },
      {
        title: 'Sections',
        value: spiritualMetrics.sectionsCompleted,
        unit: 'of 4',
        icon: '📖',
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
        description: 'Chapters completed'
      },
      {
        title: 'Growth Score',
        value: spiritualMetrics.spiritualGrowthScore,
        unit: '%',
        icon: '✨',
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        description: 'Spiritual development level'
      }
    ];

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">Sacred Growth Metrics</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            >
              <SacredCard variant="glass" className="p-6 text-center">
                <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${metric.bgColor}`}>
                  <span className="text-2xl">{metric.icon}</span>
                </div>
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className={`mb-2 font-serif text-2xl font-bold ${metric.color}`}
                >
                  {metric.value} {metric.unit}
                </motion.div>
                <h3 className="mb-1 text-sm font-medium text-sacred-blue-900">{metric.title}</h3>
                <p className="text-xs text-sacred-blue-600">{metric.description}</p>
              </SacredCard>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  const recentSections = [
    { title: 'Prologue', slug: '00_prologue', progress: 100, spiritualTheme: 'Foundation' },
    { title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps', progress: 75, spiritualTheme: 'Awakening' },
    { title: 'Kingdom Government', slug: '02_kingdom_government', progress: 25, spiritualTheme: 'Transformation' },
    { title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', progress: 0, spiritualTheme: 'Integration' },
  ];

  return (
    <div className="bg-sacred-journey-gradient min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Enhanced Spiritual Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
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
                  {greeting}, {user?.email?.split('@')[0] || 'Sacred Soul'}! 🙏
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="mb-4 text-lg text-sacred-blue-600"
                >
                  Welcome to your sacred transformation sanctuary. Your spiritual journey unfolds here.
                </motion.p>
                
                {/* Quick Spiritual Status */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex items-center space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sacred-gold-500">{mindsetStages[currentMindset].icon}</span>
                    <span className="text-sm text-sacred-blue-700">
                      Current: {mindsetStages[currentMindset].title}
                    </span>
                  </div>
                  <div className="h-1 w-1 rounded-full bg-sacred-blue-300"></div>
                  <div className="text-sm text-sacred-blue-700">
                    Overall Progress: {Math.round(overallProgress)}%
                  </div>
                </motion.div>
              </div>
              
              <div className="hidden md:block">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex h-24 w-24 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
                >
                  <span className="text-4xl text-white">🕊️</span>
                </motion.div>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Spiritual Mindset Tracker */}
        <SpiritualMindsetTracker />

        {/* Sacred Metrics Dashboard */}
        <SacredMetricsDashboard />

        {/* Enhanced Sacred Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">Sacred Actions</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
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
                    
                    <h3 className="mb-2 font-serif text-lg text-sacred-blue-900 group-hover:text-sacred-blue-800">
                      {action.title}
                    </h3>
                    
                    <p className="mb-3 text-sm leading-relaxed text-sacred-blue-600">
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
                        Begin
                      </SacredButton>
                    </motion.div>
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sacred Learning Journey Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">Sacred Learning Journey</h2>
          <SacredCard variant="heavy" className="p-6">
            <div className="space-y-6">
              {recentSections.map((section, index) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                  className="group cursor-pointer rounded-xl bg-white/50 p-6 transition-all duration-300 hover:bg-white/70 hover:shadow-lg"
                  onClick={() => router.push(`/book/${section.slug}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-sacred-gradient shadow-md"
                        >
                          <span className="text-sm font-bold text-white">{index + 1}</span>
                        </motion.div>
                        <div>
                          <h4 className="font-serif text-lg text-sacred-blue-900 group-hover:text-sacred-blue-800">
                            {section.title}
                          </h4>
                          <p className="text-sm text-sacred-blue-600">
                            Theme: {section.spiritualTheme}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-sacred-blue-700">Spiritual Progress</span>
                          <span className="font-medium text-sacred-blue-800">{section.progress}% Complete</span>
                        </div>
                        <div className="h-3 rounded-full bg-sacred-blue-100 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${section.progress}%` }}
                            transition={{ duration: 1, delay: 1 + index * 0.2 }}
                            className="h-full bg-sacred-gradient rounded-full"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-6">
                      <motion.div
                        whileHover={{ y: -2 }}
                        transition={{ duration: 0.2 }}
                      >
                        <SacredButton
                          variant={
                            section.progress === 0
                              ? 'primary'
                              : section.progress === 100
                                ? 'ghost'
                                : 'gold'
                          }
                          size="sm"
                          className="group-hover:shadow-md"
                        >
                          {section.progress === 0
                            ? '🌱 Begin'
                            : section.progress === 100
                              ? '✨ Reflect'
                              : '🦋 Continue'}
                        </SacredButton>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Overall Progress Summary */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="mt-8 pt-6 border-t border-sacred-blue-200"
            >
              <div className="text-center">
                <p className="text-sm text-sacred-blue-600 mb-2">
                  🙏 Your spiritual journey continues with each sacred step
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="text-sacred-blue-700">
                    Total Progress: {Math.round((recentSections.reduce((sum, section) => sum + section.progress, 0) / recentSections.length))}%
                  </span>
                  <div className="h-1 w-1 rounded-full bg-sacred-blue-300"></div>
                  <span className="text-sacred-blue-700">
                    Next Milestone: {mindsetStages[currentMindset === 'natural' ? 'transition' : currentMindset === 'transition' ? 'spiritual' : 'spiritual'].title}
                  </span>
                </div>
              </div>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
