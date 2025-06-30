'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [greeting, setGreeting] = useState('');
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Check if onboarding is completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (!isCompleted) {
      router.push('/onboarding');
      return;
    }

    // Gather user journey data
    const mindChoice = localStorage.getItem('renewedMindChoice');
    const selectedPath = localStorage.getItem('renewedSelectedPath');
    const intentions = JSON.parse(localStorage.getItem('renewedIntentions') || '{}');
    
    setUserData({ mindChoice, selectedPath, intentions });

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [router]);

  const pathNames = {
    foundation: 'Foundation Builder',
    accelerated: 'Accelerated Growth',
    sustainable: 'Sustainable Journey'
  };

  const quickActions = [
    {
      title: 'Continue Reading',
      description: 'Pick up where you left off in your spiritual journey',
      icon: '📖',
      href: '/book',
      variant: 'primary',
      bgGradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Audio Experience',
      description: 'Listen to the full audiobook with guided reflections',
      icon: '🎧',
      href: '/full-audio-player',
      variant: 'gold',
      bgGradient: 'from-amber-500 to-amber-600'
    },
    {
      title: 'Journal Reflection',
      description: 'Record your thoughts and spiritual insights',
      icon: '📝',
      href: '/journal',
      variant: 'primary',
      bgGradient: 'from-purple-500 to-purple-600'
    }
  ];

  const recentSections = [
    { title: 'Prologue', slug: '00_prologue', progress: 100 },
    { title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps', progress: 75 },
    { title: 'Kingdom Government', slug: '02_kingdom_government', progress: 25 },
    { title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', progress: 0 },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Sanctuary Background - Calm and Stable */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50">
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header - Vibrant Sanctuary Colors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <SacredCard variant="heavy" className="p-8 bg-white/95">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-2">
                    {greeting}, {user?.email?.split('@')[0] || 'Fellow Traveler'}!
                  </h1>
                  <p className="text-sacred-blue-600 text-lg mb-4">
                    Welcome to your sacred sanctuary. Your transformation continues here.
                  </p>
                  
                  {/* Journey Reminder */}
                  {userData.selectedPath && (
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="px-4 py-2 bg-blue-100 rounded-lg">
                        <span className="text-sm font-medium text-sacred-blue-700">
                          Path: {pathNames[userData.selectedPath]}
                        </span>
                      </div>
                      <div className="px-4 py-2 bg-amber-100 rounded-lg">
                        <span className="text-sm font-medium text-amber-700">
                          Mind: {userData.mindChoice === 'spiritual' ? 'Spiritual' : 'Natural'} → Spiritual
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-3xl">🏛️</span>
                  </div>
                </div>
              </div>
            </SacredCard>
          </motion.div>

          {/* Quick Actions - Vibrant Colors */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Sacred Actions</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                >
                  <SacredCard 
                    variant="glass" 
                    className="p-6 h-full hover:shadow-xl transition-all duration-300 cursor-pointer group"
                    onClick={() => router.push(action.href)}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${action.bgGradient} flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-300`}>
                        <span className="text-white text-2xl">{action.icon}</span>
                      </div>
                      <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">
                        {action.title}
                      </h3>
                      <p className="text-sacred-blue-600 mb-4 text-sm leading-relaxed">
                        {action.description}
                      </p>
                      <SacredButton
                        variant={action.variant}
                        size="sm"
                        className="w-full"
                      >
                        {action.title === 'Continue Reading' ? 'Open Guidebook' : 
                         action.title === 'Audio Experience' ? 'Start Listening' : 
                         action.title === 'Journal Reflection' ? 'Write Reflection' : 'Begin'}
                      </SacredButton>
                    </div>
                  </SacredCard>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Reading Progress - Gold & Blue Accents */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Your Reading Progress</h2>
            <SacredCard variant="heavy" className="p-6 bg-white/95">
              <div className="space-y-4">
                {recentSections.map((section, index) => (
                  <motion.div
                    key={section.slug}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/70 hover:bg-white/90 transition-colors cursor-pointer group"
                    onClick={() => router.push(`/book/${section.slug}`)}
                  >
                    <div className="flex-1">
                      <h4 className="text-lg font-serif text-sacred-blue-900 mb-1 group-hover:text-blue-700 transition-colors">
                        {section.title}
                      </h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
                          <motion.div 
                            className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${section.progress}%` }}
                            transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                          />
                        </div>
                        <span className="text-sm text-sacred-blue-600 font-medium min-w-[3rem]">
                          {section.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <SacredButton
                        variant={section.progress === 0 ? 'primary' : section.progress === 100 ? 'ghost' : 'gold'}
                        size="sm"
                        className="group-hover:scale-105 transition-transform"
                      >
                        {section.progress === 0 ? 'Start' : section.progress === 100 ? 'Review' : 'Continue'}
                      </SacredButton>
                    </div>
                  </motion.div>
                ))}
              </div>
            </SacredCard>
          </motion.div>

          {/* Sacred Intentions Reminder */}
          {userData.intentions?.primaryIntention && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Your Sacred Intention</h2>
              <SacredCard variant="glass" className="p-6 bg-gradient-to-r from-amber-50 to-blue-50">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                    <span className="text-white text-xl">✨</span>
                  </div>
                  <p className="text-sacred-blue-700 text-lg leading-relaxed italic">
                    "{userData.intentions.primaryIntention}"
                  </p>
                </div>
              </SacredCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}