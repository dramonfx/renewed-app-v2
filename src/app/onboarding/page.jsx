'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const router = useRouter();

  const handleBeginJourney = () => {
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    router.push('/book');
  };

  const features = [
    {
      icon: HeartIcon,
      title: "Peaceful Experience",
      description: "Find tranquility in our serene, distraction-free environment designed for deep reflection and spiritual growth.",
      gradient: "from-sacred-blue-400 to-sacred-purple-400"
    },
    {
      icon: ShieldCheckIcon,
      title: "Sacred Security",
      description: "Your spiritual journey is protected with the highest standards of privacy and data security.",
      gradient: "from-sacred-blue-500 to-sacred-blue-700"
    },
    {
      icon: SparklesIcon,
      title: "Guided Renewal",
      description: "Experience personalized guidance that adapts to your unique path of transformation and renewal.",
      gradient: "from-sacred-purple-400 to-sacred-gold-400"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Serene Mountain Landscape Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(227, 232, 240, 0.9) 0%, rgba(183, 158, 227, 0.8) 50%, rgba(251, 205, 60, 0.7) 100%), url('data:image/svg+xml,${encodeURIComponent(`
            <svg viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#e3e8f0;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#d1dae6;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#8b9bb1;stop-opacity:0.8" />
                  <stop offset="100%" style="stop-color:#5a6b87;stop-opacity:0.9" />
                </linearGradient>
              </defs>
              <rect width="1200" height="600" fill="url(#skyGradient)"/>
              <path d="M0,400 Q200,350 400,380 T800,360 Q1000,340 1200,370 L1200,600 L0,600 Z" fill="url(#mountainGradient)"/>
              <path d="M0,450 Q300,420 600,440 T1200,430 L1200,600 L0,600 Z" fill="url(#mountainGradient)" opacity="0.6"/>
              <circle cx="900" cy="120" r="40" fill="#fbcd3c" opacity="0.8"/>
            </svg>
          `)}')`
        }}
      />

      {/* Glassmorphism Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-sacred-blue-50/30 to-sacred-purple-100/20 backdrop-blur-sm" />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-16"
          >
            {/* Sacred Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-sacred-blue-900 to-sacred-purple-600 flex items-center justify-center shadow-2xl animate-sacred-glow">
                <span className="text-white text-3xl font-serif font-bold">R</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-sacred-blue-900 mb-6 leading-tight"
            >
              Welcome to Your
              <span className="block sacred-text-gradient">Sacred Journey</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="text-xl md:text-2xl text-sacred-blue-700 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Step into a space of transformation where ancient wisdom meets modern understanding. 
              Your path to renewal begins here.
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 1 + (index * 0.2), 
                  ease: 'easeOut' 
                }}
                whileHover={{ 
                  y: -8, 
                  transition: { duration: 0.3 } 
                }}
                className="sacred-card p-8 text-center group cursor-pointer"
              >
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-serif font-semibold text-sacred-blue-900 mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sacred-blue-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
            className="text-center"
          >
            <motion.button
              onClick={handleBeginJourney}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(25, 114, 190, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-sacred-blue-900 to-sacred-purple-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-2xl hover:shadow-sacred-blue-900/30 transition-all duration-300 group"
            >
              Begin Your Journey
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2, ease: 'easeOut' }}
              className="text-sacred-blue-600 mt-6 text-sm"
            >
              Your transformation awaits • No commitment required
            </motion.p>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-20 left-10 w-4 h-4 bg-sacred-gold-400 rounded-full opacity-60"
        />
        
        <motion.div
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-32 right-16 w-3 h-3 bg-sacred-purple-400 rounded-full opacity-50"
        />

        <motion.div
          animate={{ 
            y: [0, -8, 0],
            rotate: [0, 3, 0]
          }}
          transition={{ 
            duration: 7, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 left-20 w-5 h-5 bg-sacred-blue-400 rounded-full opacity-40"
        />
      </div>
    </div>
  );
}