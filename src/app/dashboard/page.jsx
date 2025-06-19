
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

  useEffect(() => {
    // Check if onboarding is completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (!isCompleted) {
      router.push('/onboarding');
    }

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, [router]);

  const quickActions = [
    {
      title: 'Continue Reading',
      description: 'Pick up where you left off in your spiritual journey',
      icon: '📖',
      href: '/book',
      variant: 'primary'
    },
    {
      title: 'Audio Experience',
      description: 'Listen to the full audiobook with guided reflections',
      icon: '🎧',
      href: '/full-audio-player',
      variant: 'gold'
    },
    {
      title: 'Journey Progress',
      description: 'Track your spiritual growth and transformation',
      icon: '📊',
      href: '#',
      variant: 'ghost'
    }
  ];

  const recentSections = [
    { title: 'Prologue', slug: '00_prologue', progress: 100 },
    { title: 'Introduction Through Next Steps', slug: '01_intro_through_next_steps', progress: 75 },
    { title: 'Kingdom Government', slug: '02_kingdom_government', progress: 25 },
    { title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', progress: 0 },
  ];

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
          <SacredCard variant="heavy" className="p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-2">
                  {greeting}, {user?.email?.split('@')[0] || 'Fellow Traveler'}!
                </h1>
                <p className="text-sacred-blue-600 text-lg">
                  Welcome to your spiritual transformation dashboard. Your journey continues here.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-20 h-20 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl">🕊️</span>
                </div>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Quick Actions</h2>
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
                  className="p-6 h-full hover:shadow-xl transition-all duration-300"
                  hover={!!action.href}
                  onClick={action.href !== '#' ? () => router.push(action.href) : undefined}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">{action.icon}</span>
                    </div>
                    <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">
                      {action.title}
                    </h3>
                    <p className="text-sacred-blue-600 mb-4 text-sm leading-relaxed">
                      {action.description}
                    </p>
                    {action.href !== '#' && (
                      <SacredButton
                        variant={action.variant}
                        size="sm"
                        className="w-full"
                      >
                        {action.title === 'Continue Reading' ? 'Open Guidebook' : 
                         action.title === 'Audio Experience' ? 'Start Listening' : 'View Progress'}
                      </SacredButton>
                    )}
                    {action.href === '#' && (
                      <div className="bg-sacred-blue-100 rounded-lg p-3">
                        <div className="text-sm text-sacred-blue-700">
                          Coming soon...
                        </div>
                      </div>
                    )}
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Reading Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Your Reading Progress</h2>
          <SacredCard variant="heavy" className="p-6">
            <div className="space-y-4">
              {recentSections.map((section, index) => (
                <motion.div
                  key={section.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors cursor-pointer"
                  onClick={() => router.push(`/book/${section.slug}`)}
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-serif text-sacred-blue-900 mb-1">
                      {section.title}
                    </h4>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-sacred-blue-100 rounded-full h-2">
                        <div 
                          className="bg-sacred-gradient h-2 rounded-full transition-all duration-500"
                          style={{ width: `${section.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-sacred-blue-600 font-medium">
                        {section.progress}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <SacredButton
                      variant={section.progress === 0 ? 'primary' : section.progress === 100 ? 'ghost' : 'gold'}
                      size="sm"
                    >
                      {section.progress === 0 ? 'Start' : section.progress === 100 ? 'Review' : 'Continue'}
                    </SacredButton>
                  </div>
                </motion.div>
              ))}
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
