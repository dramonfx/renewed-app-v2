'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useDeepReflection } from '@/hooks/useDeepReflection';

// Define interfaces
interface LayoutProps {
  children: ReactNode;
}

interface Section {
  id: number;
  title: string;
  slug: string;
  order: number;
  spiritualTheme?: string;
}

export default function Layout({ children }: LayoutProps): React.ReactElement {
  const pathname = usePathname();
  const [sections, setSections] = useState<Section[]>([]);
  const { user, logout, loading } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentMindset, setCurrentMindset] = useState('natural');
  const [spiritualProgress, setSpiritualProgress] = useState(0);
  const [isNavExpanded, setIsNavExpanded] = useState(true);
  
  // Get reflections status for conditional navigation
  const { hasReflections } = useDeepReflection();

  // Sacred navigation items with spiritual context
  const sacredNavigation = [
    {
      title: 'Sacred Sanctuary',
      href: '/dashboard',
      icon: '🏛️',
      description: 'Your spiritual transformation dashboard',
      spiritualContext: 'Center of your sacred journey'
    },
    {
      title: 'Sacred Journal',
      href: '/journal',
      icon: '📖',
      description: 'Record your spiritual insights and growth',
      spiritualContext: 'Capture divine revelations'
    },
    {
      title: 'Deep Reflections',
      href: '/reflections',
      icon: '✨',
      description: 'Profound spiritual contemplations',
      spiritualContext: 'Journey into sacred mysteries',
      conditional: hasReflections
    },
    {
      title: 'Sacred Texts',
      href: '/book',
      icon: '📚',
      description: 'Explore the spiritual guidebook',
      spiritualContext: 'Wisdom for transformation'
    },
    {
      title: 'Audio Sanctuary',
      href: '/full-audio-player',
      icon: '🎧',
      description: 'Immersive spiritual audio experience',
      spiritualContext: 'Let divine wisdom speak to your heart',
      featured: true
    }
  ];

  // Mindset progression indicators
  const mindsetStages = {
    natural: { icon: '🌱', title: 'Natural Mind', color: 'text-emerald-600' },
    transition: { icon: '🦋', title: 'Transitional Mind', color: 'text-amber-600' },
    spiritual: { icon: '✨', title: 'Spiritual Mind', color: 'text-purple-600' }
  };

  // Check if current page should have full-screen layout (no sidebar)
  const isFullScreenPage =
    pathname === '/onboarding' ||
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/forgot-password';

  // Handle logout
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    // Only fetch sections if not on a full-screen page
    if (!isFullScreenPage) {
      // Enhanced sections with spiritual themes
      const mockSections: Section[] = [
        { id: 1, title: 'Prologue', slug: '00_prologue', order: 1, spiritualTheme: 'Foundation' },
        {
          id: 2,
          title: 'Introduction Through Next Steps',
          slug: '01_intro_through_next_steps',
          order: 2,
          spiritualTheme: 'Awakening'
        },
        { id: 3, title: 'Kingdom Government', slug: '02_kingdom_government', order: 3, spiritualTheme: 'Authority' },
        { id: 4, title: 'Elephant in the Kingdom', slug: '03_elephant_in_the_kingdom', order: 4, spiritualTheme: 'Truth' },
        {
          id: 5,
          title: 'Characteristics of Principles',
          slug: '04_characteristics_of_principles',
          order: 5,
          spiritualTheme: 'Wisdom'
        },
        { id: 6, title: 'Approved', slug: '05_approved', order: 6, spiritualTheme: 'Validation' },
        { id: 7, title: '30 Key Principles (01–10)', slug: '06_key_principles_01-10', order: 7, spiritualTheme: 'Foundation' },
        { id: 8, title: '30 Key Principles (11–20)', slug: '06_key_principles_11-20', order: 8, spiritualTheme: 'Growth' },
        { id: 9, title: '30 Key Principles (21–30)', slug: '06_key_principles_21-30', order: 9, spiritualTheme: 'Mastery' },
        { id: 10, title: 'Conclusion', slug: '07_conclusion', order: 10, spiritualTheme: 'Integration' },
      ];
      setSections(mockSections);

      // Load spiritual metrics
      try {
        const savedMetrics = localStorage.getItem('renewedSpiritualMetrics');
        const onboardingData = localStorage.getItem('renewedOnboardingData');
        
        if (savedMetrics) {
          const metrics = JSON.parse(savedMetrics);
          setSpiritualProgress(metrics.spiritualGrowthScore || 0);
          setCurrentMindset(metrics.mindsetEvolution || 'natural');
        }

        if (onboardingData) {
          const data = JSON.parse(onboardingData);
          const progressLevel = data.assessment?.spiritualReadiness || 'natural';
          setCurrentMindset(progressLevel);
        }
      } catch (error) {
        console.error('Error loading spiritual metrics:', error);
      }
    }
  }, [isFullScreenPage]);

  // Enhanced navigation item component
  const SacredNavItem = ({ item, index }: { item: any; index: number }) => {
    const isActive = pathname === item.href;
    const shouldShow = item.conditional !== false && (item.conditional === undefined || item.conditional);
    
    if (!shouldShow) return null;

    return (
      <motion.li
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Link
          href={item.href}
          className={`group block rounded-xl border transition-all duration-300 ${
            isActive
              ? 'border-sacred-gold-300 bg-sacred-gold-100 text-sacred-blue-900 shadow-md'
              : item.featured
                ? 'border-sacred-gold-200 bg-sacred-gold-50 text-sacred-blue-900 hover:border-sacred-gold-300 hover:bg-sacred-gold-100 hover:shadow-lg'
                : 'border-transparent text-sacred-blue-800 hover:border-sacred-blue-200 hover:bg-white/60 hover:text-sacred-blue-900 hover:shadow-md'
          } ${isNavExpanded ? 'p-4' : 'p-3'}`}
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
              {isNavExpanded && (
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
      </motion.li>
    );
  };

  // Full-screen layout for onboarding and auth pages
  if (isFullScreenPage) {
    return <>{children}</>;
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-sacred-journey-gradient"
    >
      <div className="flex flex-1">
        {/* Enhanced Sacred Journey Sidebar */}
        <motion.aside
          initial={{ x: -320 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`fixed left-0 top-0 z-10 h-full overflow-y-auto border-r border-sacred-blue-200 bg-brand-blue-sidebar shadow-2xl transition-all duration-300 ${
            isNavExpanded ? 'w-80' : 'w-20'
          }`}
        >
          <div className="p-6">
            {/* Enhanced Sacred Journey Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <AnimatePresence>
                  {isNavExpanded && (
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
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsNavExpanded(!isNavExpanded)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-sacred-gold-100 text-sacred-blue-900 transition-colors duration-200 hover:bg-sacred-gold-200"
                  title={isNavExpanded ? 'Collapse navigation' : 'Expand navigation'}
                >
                  <motion.div
                    animate={{ rotate: isNavExpanded ? 0 : 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </motion.div>
                </motion.button>
              </div>

              {/* Spiritual Progress Indicator */}
              <AnimatePresence>
                {isNavExpanded && (
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
                        <p className="text-xs text-sacred-blue-700">Current Mindset</p>
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Enhanced Sacred Journey Navigation */}
            <nav>
              <AnimatePresence>
                {isNavExpanded && (
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mb-4 px-2 font-serif text-sm font-medium text-sacred-blue-700"
                  >
                    Sacred Journey
                  </motion.h2>
                )}
              </AnimatePresence>

              <ul className="space-y-3">
                {sacredNavigation.map((item, index) => (
                  <SacredNavItem key={item.href} item={item} index={index} />
                ))}
              </ul>

              {/* Sacred Divider */}
              <motion.div
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="my-6 h-px bg-sacred-gold-200"
              />

              {/* Sacred Sections */}
              <AnimatePresence>
                {isNavExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="mb-4 px-2 font-serif text-sm font-medium text-sacred-blue-700">
                      Sacred Texts & Teachings
                    </h3>
                    
                    <ul className="space-y-2">
                      {sections.map((section, index) => (
                        <motion.li
                          key={section.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                        >
                          <Link
                            href={`/book/${section.slug}`}
                            className={`group block rounded-lg border border-transparent p-3 transition-all duration-300 hover:border-sacred-blue-200 hover:bg-white/50 hover:shadow-sm ${
                              pathname === `/book/${section.slug}` 
                                ? 'border-sacred-blue-200 bg-white/50 shadow-sm' 
                                : ''
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sacred-gradient text-xs font-bold text-white shadow-sm">
                                {section.order}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-sacred-blue-900 truncate group-hover:text-sacred-blue-800">
                                  {section.title}
                                </h4>
                                {section.spiritualTheme && (
                                  <p className="text-xs text-sacred-blue-600 truncate">
                                    Theme: {section.spiritualTheme}
                                  </p>
                                )}
                              </div>
                            </div>
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </nav>

            {/* Enhanced User Profile Section */}
            {user && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 border-t border-sacred-gold-200 pt-6"
              >
                <AnimatePresence>
                  {isNavExpanded ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-2 pb-4"
                    >
                      <div className="mb-4 rounded-xl bg-white/10 p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <motion.div
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            transition={{ duration: 0.2 }}
                            className="flex h-12 w-12 items-center justify-center rounded-full bg-sacred-gold-200 shadow-sm"
                          >
                            <svg
                              className="h-6 w-6 text-sacred-blue-900"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-sacred-blue-900">
                              {user.email?.split('@')[0] || 'Sacred Soul'}
                            </p>
                            <p className="text-xs text-sacred-blue-700">Sacred Journey Member</p>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="flex w-full items-center justify-center rounded-lg border border-sacred-blue-300 bg-white/50 px-4 py-3 text-sm font-medium text-sacred-blue-700 transition-all duration-200 hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isLoggingOut ? (
                            <>
                              <LoadingSpinner size="sm" className="mr-2" />
                              Returning to Sacred Portal...
                            </>
                          ) : (
                            <>
                              <svg
                                className="mr-2 h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                />
                              </svg>
                              Sacred Departure
                            </>
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-2 pb-4 text-center"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-700 transition-colors duration-200 hover:bg-red-200 disabled:opacity-50"
                        title="Sacred Departure"
                      >
                        {isLoggingOut ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.aside>

        {/* Enhanced Sacred Journey Main Content Area */}
        <motion.main
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={`flex-1 overflow-y-auto p-4 transition-all duration-300 ${
            isNavExpanded ? 'ml-80' : 'ml-20'
          } lg:p-6`}
        >
          {/* Sacred Journey Content Container with Enhanced Background */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="min-h-full rounded-2xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl sm:p-8 md:p-10 border border-white/20"
          >
            {/* Spiritual Breadcrumb Navigation */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-6 flex items-center space-x-2 text-sm"
            >
              <Link
                href="/dashboard"
                className="text-sacred-blue-600 hover:text-sacred-blue-800 transition-colors duration-200"
              >
                Sacred Sanctuary
              </Link>
              {pathname !== '/dashboard' && (
                <>
                  <span className="text-sacred-blue-400">🕊️</span>
                  <span className="text-sacred-blue-800 font-medium">
                    {pathname === '/journal' && 'Sacred Journal'}
                    {pathname === '/reflections' && 'Deep Reflections'}
                    {pathname === '/book' && 'Sacred Texts'}
                    {pathname === '/full-audio-player' && 'Audio Sanctuary'}
                    {pathname.startsWith('/book/') && 'Sacred Learning'}
                    {!pathname.match(/\/(journal|reflections|book|full-audio-player)/) && 'Sacred Path'}
                  </span>
                </>
              )}
            </motion.div>

            {/* Sacred Content with Spiritual Wrapper */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="sacred-content-wrapper"
            >
              {children}
            </motion.div>

            {/* Sacred Footer Blessing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-12 pt-6 border-t border-sacred-blue-100 text-center"
            >
              <p className="text-xs text-sacred-blue-500 italic">
                🙏 May this sacred journey bring you closer to divine truth and inner transformation
              </p>
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
}

// Export prop types
export type { LayoutProps, Section };
