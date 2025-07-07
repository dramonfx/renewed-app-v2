
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import ProgressiveDiscovery from '@/components/Disneyland/ProgressiveDiscovery';
import MomentumBuilder from '@/components/Disneyland/MomentumBuilder';
import CuriosityDriver from '@/components/Disneyland/CuriosityDriver';

/**
 * Enhanced Dashboard with Disneyland Effect
 * Creates an immersive experience where each corner reveals new features
 * and builds momentum through discovery and engagement
 */
export default function EnhancedDashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [userProgress, setUserProgress] = useState(0);
  const [sessionsCompleted, setSessions] = useState(0);
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  const [activeTab, setActiveTab] = useState('journey');
  const [unlockedFeature, setUnlockedFeature] = useState(null);

  // Simulate user progress (in real app, this would come from API/context)
  useEffect(() => {
    // Check if onboarding is completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (!isCompleted) {
      router.push('/onboarding');
      return;
    }

    // Calculate user progress based on stored data
    const storedProgress = parseInt(localStorage.getItem('userProgress') || '15');
    const storedSessions = parseInt(localStorage.getItem('sessionsCompleted') || '3');
    setUserProgress(storedProgress);
    setSessions(storedSessions);

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');

    // Show welcome animation for new users
    if (storedProgress < 5) {
      setShowWelcomeAnimation(true);
      setTimeout(() => setShowWelcomeAnimation(false), 3000);
    }
  }, [router]);

  // Handle feature unlock celebrations
  const handleFeatureUnlock = (feature) => {
    setUnlockedFeature(feature);
    setTimeout(() => setUnlockedFeature(null), 4000);
  };

  // Simulate progress increase (for demo purposes)
  const simulateProgress = () => {
    const newProgress = Math.min(userProgress + 10, 100);
    setUserProgress(newProgress);
    localStorage.setItem('userProgress', newProgress.toString());
  };

  const quickActions = [
    {
      title: 'Continue Your Journey',
      description: 'Resume reading where you left off',
      icon: '📖',
      href: '/book',
      variant: 'primary',
      glow: userProgress < 25
    },
    {
      title: 'Audio Experience',
      description: 'Immersive listening with enhanced bookmarks',
      icon: '🎧',
      href: '/full-audio-player',
      variant: 'gold',
      glow: userProgress >= 10,
      badge: userProgress >= 10 ? 'Enhanced!' : null
    },
    {
      title: 'Sacred Reflections',
      description: 'Journal your spiritual insights',
      icon: '✨',
      href: '/journal',
      variant: 'ghost',
      glow: userProgress >= 25,
      badge: userProgress >= 25 ? 'Unlocked!' : null
    },
  ];

  const tabs = [
    { id: 'journey', label: 'Your Journey', icon: '🌟' },
    { id: 'discoveries', label: 'Discoveries', icon: '🔍' },
    { id: 'mysteries', label: 'Mysteries', icon: '🗝️' },
  ];

  return (
    <div className="min-h-screen p-6 lg:p-8 bg-gradient-to-br from-sacred-blue-50 via-white to-sacred-gold-50">
      <div className="mx-auto max-w-6xl">
        {/* Welcome Animation */}
        <AnimatePresence>
          {showWelcomeAnimation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-sacred-gradient/20 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <SacredCard variant="heavy" className="p-8 text-center">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ duration: 2 }}
                  >
                    <div className="text-6xl mb-4">🌟</div>
                  </motion.div>
                  <h2 className="text-2xl font-serif text-sacred-blue-900 mb-2">
                    Welcome to Your Transformation
                  </h2>
                  <p className="text-sacred-blue-600">
                    Every corner of this sacred space holds discoveries...
                  </p>
                </SacredCard>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feature Unlock Celebration */}
        <AnimatePresence>
          {unlockedFeature && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40"
            >
              <SacredCard variant="glass" className="p-4 border-2 border-sacred-gold-300">
                <div className="flex items-center space-x-3">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 0.5, repeat: 3 }}
                  >
                    <span className="text-2xl">{unlockedFeature.icon}</span>
                  </motion.div>
                  <div>
                    <h4 className="font-semibold text-sacred-blue-900">
                      {unlockedFeature.title}
                    </h4>
                    <p className="text-sm text-sacred-blue-600">
                      {unlockedFeature.description}
                    </p>
                  </div>
                </div>
              </SacredCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute -top-4 -right-4 w-24 h-24 bg-sacred-gold-400/10 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 bg-sacred-blue-400/10 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            
            <div className="relative flex items-center justify-between">
              <div>
                <motion.h1 
                  className="mb-2 font-serif text-3xl text-sacred-blue-900 md:text-4xl"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {greeting}, {user?.email?.split('@')[0] || 'Sacred Seeker'}! ✨
                </motion.h1>
                <motion.p 
                  className="text-lg text-sacred-blue-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  Your transformation journey continues to unfold...
                </motion.p>
                
                {/* Demo Controls */}
                <motion.div 
                  className="mt-4 flex items-center space-x-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <SacredButton 
                    onClick={simulateProgress} 
                    variant="ghost" 
                    size="sm"
                    className="text-xs opacity-70"
                  >
                    🎯 Simulate Progress (+10%)
                  </SacredButton>
                  <span className="text-xs text-sacred-blue-500">
                    (Demo feature - try clicking to see discovery effects!)
                  </span>
                </motion.div>
              </div>
              
              <motion.div 
                className="hidden md:block"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                  <span className="text-3xl text-white">🕊️</span>
                </div>
              </motion.div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Enhanced Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">Sacred Actions</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
                className="relative"
              >
                <SacredCard
                  variant="glass"
                  className={`h-full p-6 transition-all duration-300 hover:shadow-xl cursor-pointer relative overflow-hidden ${
                    action.glow ? 'ring-2 ring-sacred-gold-300/50' : ''
                  }`}
                  onClick={() => router.push(action.href)}
                >
                  {/* Glow Effect */}
                  {action.glow && (
                    <motion.div
                      className="absolute inset-0 bg-sacred-gradient/5"
                      animate={{ opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  {/* Badge */}
                  {action.badge && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-2 -right-2 bg-sacred-gold-gradient text-white text-xs px-2 py-1 rounded-full shadow-lg"
                    >
                      {action.badge}
                    </motion.div>
                  )}
                  
                  <div className="relative text-center">
                    <motion.div 
                      className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <span className="text-2xl text-white">{action.icon}</span>
                    </motion.div>
                    <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">{action.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-sacred-blue-600">
                      {action.description}
                    </p>
                    <SacredButton variant={action.variant} size="sm" className="w-full">
                      {action.title === 'Continue Your Journey' ? 'Continue Reading' : 
                       action.title === 'Audio Experience' ? 'Start Listening' : 'Open Journal'}
                    </SacredButton>
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Disneyland Effect Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex space-x-1 mb-6 bg-white/50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-sacred-gradient text-white shadow-lg'
                    : 'text-sacred-blue-600 hover:bg-white/70'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'journey' && (
                <MomentumBuilder 
                  userProgress={userProgress} 
                  sessionsCompleted={sessionsCompleted} 
                />
              )}
              {activeTab === 'discoveries' && (
                <ProgressiveDiscovery 
                  userProgress={userProgress} 
                  onUnlock={handleFeatureUnlock} 
                />
              )}
              {activeTab === 'mysteries' && (
                <CuriosityDriver userProgress={userProgress} />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 font-serif text-xl text-sacred-blue-900">
              Ready to Continue Your Transformation?
            </h3>
            <p className="mb-6 text-sacred-blue-600">
              Every step forward reveals new depths of spiritual understanding...
            </p>
            <div className="flex justify-center space-x-4">
              <SacredButton
                onClick={() => router.push('/book')}
                variant="primary"
                size="lg"
              >
                Continue Reading 📖
              </SacredButton>
              <SacredButton
                onClick={() => router.push('/full-audio-player')}
                variant="gold"
                size="lg"
              >
                Listen & Reflect 🎧
              </SacredButton>
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
