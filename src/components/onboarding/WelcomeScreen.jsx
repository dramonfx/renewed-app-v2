'use client';
import { motion } from 'framer-motion';
import GlassCard from './GlassCard';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <GlassCard className="p-12 md:p-16">
            {/* Logo/Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="mb-8"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl md:text-4xl font-serif font-bold">R</span>
              </div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              className="text-3xl md:text-4xl lg:text-5xl font-serif text-sacred-blue-900 dark:text-sacred-blue-100 mb-6 leading-tight"
            >
              Welcome to the{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">
                Threshold
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
              className="text-sacred-blue-400 dark:text-sacred-blue-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              You stand at the sacred threshold between two ways of being. 
              Begin your journey of transformation and renewal.
            </motion.p>

            {/* CTA Button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
              onClick={onNext}
              className="
                bg-sacred-gradient text-white font-semibold 
                px-8 py-4 rounded-full 
                hover:shadow-xl transition-all duration-300 
                transform hover:-translate-y-1 hover:scale-105
                focus:outline-none focus:ring-4 focus:ring-sacred-blue-200
                text-lg
              "
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cross the Threshold →
            </motion.button>
          </GlassCard>
        </motion.div>

        {/* Additional Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
          className="grid md:grid-cols-3 gap-6"
        >
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center">
              <span className="text-white text-xl">✨</span>
            </div>
            <h3 className="font-serif text-lg text-sacred-blue-900 dark:text-sacred-blue-100 mb-2">
              Transform
            </h3>
            <p className="text-sacred-blue-400 dark:text-sacred-blue-300 text-sm">
              Discover your authentic self through guided reflection
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center">
              <span className="text-white text-xl">🎯</span>
            </div>
            <h3 className="font-serif text-lg text-sacred-blue-900 dark:text-sacred-blue-100 mb-2">
              Focus
            </h3>
            <p className="text-sacred-blue-400 dark:text-sacred-blue-300 text-sm">
              Set clear intentions for your personal growth journey
            </p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center">
              <span className="text-white text-xl">🌟</span>
            </div>
            <h3 className="font-serif text-lg text-sacred-blue-900 dark:text-sacred-blue-100 mb-2">
              Renew
            </h3>
            <p className="text-sacred-blue-400 dark:text-sacred-blue-300 text-sm">
              Embrace a renewed way of living with purpose and clarity
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;