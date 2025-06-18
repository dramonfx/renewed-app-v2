
'use client';
import { motion } from 'framer-motion';
import { Heart, Shield, Star } from 'lucide-react';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Soft Mountain Background is handled by globals.css body styles */}
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-5xl mx-auto text-center">
          
          {/* Main Title - Sacred Blue Gradient */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight scenic-text"
          >
            Welcome to Your{' '}
            <span className="bg-gradient-to-r from-sacred-blue-400 to-sacred-blue-600 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </motion.h1>

          {/* Subtitle with Sacred Blue highlights */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed scenic-text-muted"
          >
            Discover a path of{' '}
            <span className="text-sacred-blue-300 font-medium">transformation</span>,{' '}
            <span className="text-sacred-blue-300 font-medium">peace</span>, and{' '}
            <span className="text-sacred-blue-300 font-medium">renewal</span>{' '}
            designed specifically for your spiritual growth.
          </motion.p>

          {/* Three Glassmorphism Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            
            {/* Peaceful Experience Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-icon-bg flex items-center justify-center">
                <Heart className="w-8 h-8 text-sacred-blue-600" />
              </div>
              <h3 className="text-2xl font-serif mb-4 scenic-text">
                Peaceful Experience
              </h3>
              <p className="scenic-text-muted text-lg leading-relaxed">
                Find tranquility through guided meditations and calming spiritual practices
              </p>
            </motion.div>

            {/* Sacred Security Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-icon-bg flex items-center justify-center">
                <Shield className="w-8 h-8 text-sacred-blue-600" />
              </div>
              <h3 className="text-2xl font-serif mb-4 scenic-text">
                Sacred Security
              </h3>
              <p className="scenic-text-muted text-lg leading-relaxed">
                Build confidence in your spiritual journey with trusted guidance and support
              </p>
            </motion.div>

            {/* Guided Renewal Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="glass-card p-8"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full glass-icon-bg flex items-center justify-center">
                <Star className="w-8 h-8 text-sacred-blue-600" />
              </div>
              <h3 className="text-2xl font-serif mb-4 scenic-text">
                Guided Renewal
              </h3>
              <p className="scenic-text-muted text-lg leading-relaxed">
                Transform your life with structured pathways to personal and spiritual growth
              </p>
            </motion.div>
          </div>

          {/* Begin Your Journey Sacred Blue Glassmorphism Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={onNext}
            className="glass-btn text-xl px-8 py-4"
          >
            Begin Your Journey ✨
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
