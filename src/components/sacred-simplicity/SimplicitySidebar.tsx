
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';
import { FeatureGate, SacredNavItemGate } from './FeatureGate';

interface SimplicitySidebarProps {
  isExpanded: boolean;
  onToggleExpanded: () => void;
  currentMindset: string;
  spiritualProgress: number;
}

const SimplicitySidebar: React.FC<SimplicitySidebarProps> = ({
  isExpanded,
  onToggleExpanded,
  currentMindset,
  spiritualProgress
}) => {
  const pathname = usePathname();
  const { 
    isSimplicityMode, 
    toggleSimplicityMode,
    currentStage,
    getNextMilestone
  } = useSpiritualJourney();
  
  const nextMilestone = getNextMilestone();
  
  // Sacred navigation items with simplicity awareness
  const coreNavigation = [
    {
      title: 'Sacred Sanctuary',
      href: '/dashboard',
      icon: '🏛️',
      description: 'Your spiritual transformation center',
      spiritualContext: 'Center of your sacred journey',
      featureKey: 'basic_dashboard' // Always available
    },
    {
      title: 'Sacred Journal',
      href: '/journal',
      icon: '📝',
      description: 'Record your spiritual thoughts',
      spiritualContext: 'Capture divine revelations',
      featureKey: 'basic_journal'
    },
    {
      title: 'Sacred Audio',
      href: '/full-audio-player',
      icon: '🎧',
      description: 'Immersive spiritual audio',
      spiritualContext: 'Let divine wisdom speak',
      featureKey: 'basic_audio'
    }
  ];
  
  const advancedNavigation = [
    {
      title: 'Deep Reflections',
      href: '/reflections',
      icon: '🤔',
      description: 'Profound spiritual contemplations',
      spiritualContext: 'Journey into sacred mysteries',
      featureKey: 'deep_reflections'
    },
    {
      title: 'Sacred Texts',
      href: '/book',
      icon: '📚',
      description: 'Explore spiritual guidebook',
      spiritualContext: 'Wisdom for transformation',
      featureKey: 'sacred_texts'
    }
  ];

  // Stage progression indicators
  const mindsetStages = {
    natural: { icon: '🌱', title: 'Natural Mind', color: 'text-emerald-600' },
    transition: { icon: '🦋', title: 'Transitional Mind', color: 'text-amber-600' },
    spiritual: { icon: '✨', title: 'Spiritual Mind', color: 'text-purple-600' }
  };

  const SacredNavItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = pathname === item.href;
    
    return (
      <motion.li
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <SacredNavItemGate featureKey={item.featureKey} showLocked={true}>
          <Link
            href={item.href}
            className={`group block rounded-xl border transition-all duration-300 ${
              isActive
                ? 'border-sacred-gold-300 bg-sacred-gold-100 text-sacred-blue-900 shadow-md'
                : 'border-transparent text-sacred-blue-800 hover:border-sacred-blue-200 hover:bg-white/60 hover:text-sacred-blue-900 hover:shadow-md'
            } ${isExpanded ? 'p-4' : 'p-3'}`}
            title={item.description}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-sacred-gradient shadow-sm"
              >
                <span className="text-lg text-white">{item.icon}</span>
              </motion.div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-1 min-w-0"
                  >
                    <h3 className="font-medium truncate">{item.title}</h3>
                    <p className="text-xs opacity-75 truncate">{item.spiritualContext}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {isActive && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-2 h-1 bg-sacred-gold-400 rounded-full"
              />
            )}
          </Link>
        </SacredNavItemGate>
      </motion.li>
    );
  };

  return (
    <motion.aside
      initial={{ x: -320 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed left-0 top-0 z-10 h-full overflow-y-auto border-r border-sacred-blue-200 bg-brand-blue-sidebar shadow-2xl transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-20'
      }`}
    >
      <div className="p-6">
        {/* Sacred Journey Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-center flex-1"
                >
                  <Link
                    href="/"
                    className="font-serif text-2xl font-bold text-sacred-blue-900 transition-colors duration-300 hover:text-sacred-gold-600"
                  >
                    Renewed
                  </Link>
                  <p className="mt-1 font-sans text-xs uppercase tracking-wider text-sacred-blue-700">
                    THE NEW MAN STORY
                  </p>
                  
                  {/* Simplicity mode indicator */}
                  {isSimplicityMode && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 text-xs text-sacred-gold-600 italic"
                    >
                      Sacred Simplicity Mode
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex flex-col space-y-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onToggleExpanded}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-sacred-gold-100 text-sacred-blue-900 transition-colors duration-200 hover:bg-sacred-gold-200"
                title={isExpanded ? 'Collapse navigation' : 'Expand navigation'}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 0 : 180 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.div>
              </motion.button>
              
              {/* Simplicity toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleSimplicityMode}
                className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200 ${
                  isSimplicityMode 
                    ? 'bg-sacred-blue-100 text-sacred-blue-900 hover:bg-sacred-blue-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isSimplicityMode ? 'Disable Sacred Simplicity' : 'Enable Sacred Simplicity'}
              >
                {isSimplicityMode ? '🌱' : '🌿'}
              </motion.button>
            </div>
          </div>

          {/* Spiritual Progress Indicator */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 rounded-xl bg-white/20 p-4"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className={`text-2xl ${mindsetStages[currentMindset as keyof typeof mindsetStages]?.color}`}>
                    {mindsetStages[currentMindset as keyof typeof mindsetStages]?.icon}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-sacred-blue-900">
                      {mindsetStages[currentMindset as keyof typeof mindsetStages]?.title}
                    </h4>
                    <p className="text-xs text-sacred-blue-700">
                      Stage: {currentStage.charAt(0).toUpperCase() + currentStage.slice(1)}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-sacred-blue-700">Spiritual Progress</span>
                    <span className="text-sacred-blue-800 font-medium">{spiritualProgress}%</span>
                  </div>
                  <div className="h-2 bg-sacred-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${spiritualProgress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-sacred-gradient rounded-full"
                    />
                  </div>
                </div>
                
                {/* Next milestone hint */}
                {nextMilestone && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-3 text-xs text-sacred-blue-600 italic"
                  >
                    Next: {nextMilestone.title}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Core Navigation */}
        <nav>
          <AnimatePresence>
            {isExpanded && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 px-2 font-serif text-sm font-medium text-sacred-blue-700"
              >
                Essential Journey
              </motion.h2>
            )}
          </AnimatePresence>

          <ul className="space-y-3">
            {coreNavigation.map((item, index) => (
              <SacredNavItem key={item.href} item={item} index={index} />
            ))}
          </ul>

          {/* Advanced Features (Progressive Disclosure) */}
          <FeatureGate featureKey="deep_reflections" showHint={false}>
            <motion.div
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5 }}
              className="my-6 h-px bg-sacred-gold-200"
            />
            
            <AnimatePresence>
              {isExpanded && (
                <motion.h2
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-4 px-2 font-serif text-sm font-medium text-sacred-blue-700"
                >
                  Advanced Practice
                </motion.h2>
              )}
            </AnimatePresence>

            <ul className="space-y-3">
              {advancedNavigation.map((item, index) => (
                <SacredNavItem key={item.href} item={item} index={index + 3} />
              ))}
            </ul>
          </FeatureGate>
        </nav>
      </div>
    </motion.aside>
  );
};

export default SimplicitySidebar;

