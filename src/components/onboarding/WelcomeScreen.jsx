'use client';
import { motion } from 'framer-motion';
import { HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Landscape Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-sacred-blue-200 via-sacred-blue-100 to-sacred-blue-50">
        {/* Mountain Silhouettes */}
        <svg className="absolute bottom-0 w-full h-64" viewBox="0 0 1200 300" preserveAspectRatio="none">
          <path d="M0,300 L0,200 L200,100 L400,150 L600,80 L800,120 L1000,60 L1200,100 L1200,300 Z" 
                fill="rgba(25, 114, 190, 0.1)" />
          <path d="M0,300 L0,220 L150,140 L350,180 L550,120 L750,160 L950,100 L1200,140 L1200,300 Z" 
                fill="rgba(25, 114, 190, 0.15)" />
          <path d="M0,300 L0,240 L100,180 L300,200 L500,160 L700,180 L900,140 L1200,180 L1200,300 Z" 
                fill="rgba(25, 114, 190, 0.2)" />
        </svg>
      </div>

      {/* Floating Light Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 w-4 h-4 bg-sacred-gold-400 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            x: [10, -10, 10],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-40 right-32 w-3 h-3 bg-sacred-purple-400 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute bottom-40 left-1/3 w-5 h-5 bg-sacred-gold-300 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [10, -10, 10],
            x: [-8, 8, -8],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute top-60 right-20 w-2 h-2 bg-sacred-purple-300 rounded-full blur-sm"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 pt-16">
        <div className="text-center max-w-6xl mx-auto">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-sacred-blue-900 mb-6 leading-tight"
          >
            Welcome to Your{' '}
            <span className="bg-gradient-to-r from-sacred-blue-900 to-sacred-purple-600 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            className="text-sacred-blue-700 text-xl md:text-2xl mb-12 font-sans max-w-3xl mx-auto leading-relaxed"
          >
            Discover a peaceful path to renewal, guided by wisdom and supported by sacred security
          </motion.p>

          {/* Feature Cards Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
          >
            {/* Card 1: Peaceful Experience */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sacred-gold-400 to-sacred-gold-500 rounded-full flex items-center justify-center shadow-lg">
                <HeartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Peaceful Experience</h3>
              <p className="text-sacred-blue-700 font-sans leading-relaxed">
                Find tranquility in a serene environment designed for inner reflection and growth
              </p>
            </motion.div>

            {/* Card 2: Sacred Security */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sacred-purple-500 to-sacred-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <ShieldCheckIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Sacred Security</h3>
              <p className="text-sacred-blue-700 font-sans leading-relaxed">
                Your journey is protected with the highest standards of privacy and spiritual care
              </p>
            </motion.div>

            {/* Card 3: Guided Renewal */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.3 }}
              className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-sacred-blue-600 to-sacred-blue-700 rounded-full flex items-center justify-center shadow-lg">
                <SparklesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Guided Renewal</h3>
              <p className="text-sacred-blue-700 font-sans leading-relaxed">
                Experience transformation through carefully crafted practices and gentle guidance
              </p>
            </motion.div>
          </motion.div>

          {/* Primary Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={onNext}
              className="bg-gradient-to-r from-sacred-blue-600 to-sacred-purple-600 text-white font-serif text-xl px-12 py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/20 backdrop-blur-sm"
            >
              Begin Your Journey
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="ml-2 inline-block"
              >
                →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Additional Floating Elements for Ambiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute top-10 right-10 w-32 h-32 bg-sacred-gold-400/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute bottom-20 left-10 w-48 h-48 bg-sacred-purple-400/5 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
};

export default WelcomeScreen;