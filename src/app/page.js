'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBook, FiHeadphones, FiCompass, FiStar } from 'react-icons/fi';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

export default function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has completed onboarding
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    setShowOnboarding(!onboardingCompleted);
    setIsLoading(false);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
  };

  const handleStartOnboarding = () => {
    localStorage.removeItem('onboarding_completed');
    setShowOnboarding(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-brand-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (showOnboarding) {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-blue-dark mb-6">
          Welcome to{' '}
          <span className="text-brand-gold">Renewed</span>
        </h1>
        <p className="text-xl text-brand-text-main font-sans leading-relaxed mb-8 max-w-2xl mx-auto">
          Your journey from the natural mind to the spiritual mind begins here. 
          Experience transformation through interactive guidance and profound wisdom.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStartOnboarding}
            className="bg-brand-gold hover:bg-yellow-500 text-white font-sans font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <FiStar className="w-5 h-5" />
            Take the Tour
          </motion.button>
          
          <motion.a
            href="/book"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-brand-blue-medium hover:bg-brand-blue-dark text-white font-sans font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3"
          >
            <FiBook className="w-5 h-5" />
            Start Reading
          </motion.a>
        </div>
      </motion.div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {[
          {
            icon: FiBook,
            title: "Interactive Guidebook",
            description: "Navigate through carefully crafted sections that guide your spiritual transformation journey.",
            href: "/book",
            color: "from-blue-400 to-blue-600"
          },
          {
            icon: FiHeadphones,
            title: "Full Audiobook",
            description: "Listen to the complete audiobook with synchronized text and immersive audio controls.",
            href: "/full-audio-player",
            color: "from-purple-400 to-purple-600"
          },
          {
            icon: FiCompass,
            title: "Spiritual Journey",
            description: "Track your progress and receive personalized insights based on your spiritual growth.",
            href: "/book",
            color: "from-green-400 to-green-600"
          }
        ].map((feature, index) => (
          <motion.a
            key={index}
            href={feature.href}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 block"
          >
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 mx-auto shadow-lg group-hover:shadow-xl transition-shadow`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-serif font-bold text-brand-blue-dark mb-4 text-center">
              {feature.title}
            </h3>
            <p className="text-brand-text-muted font-sans leading-relaxed text-center">
              {feature.description}
            </p>
          </motion.a>
        ))}
      </div>

      {/* Transformation Quote */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-brand-blue-light via-brand-blue-content-bg to-brand-cream rounded-2xl p-12 text-center"
      >
        <blockquote className="text-2xl md:text-3xl font-serif italic text-brand-blue-dark mb-6">
          "The journey from the natural mind to the spiritual mind is the most important transformation you will ever experience."
        </blockquote>
        <p className="text-brand-text-main font-sans text-lg">
          Begin your journey today and discover the peace, clarity, and authentic relationships that await.
        </p>
      </motion.div>
    </div>
  );
}