'use client';

import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import GlassCard from './GlassCard';

export default function WelcomeScreen({ onNext }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-400 to-amber-400 opacity-20 blur-xl" />
            <div className="relative w-full h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-500 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-600 to-amber-600" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-serif text-gray-800 dark:text-gray-100 mb-6"
        >
          Welcome to the
          <br />
          <span className="bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent font-bold">
            Threshold
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="mb-12"
        >
          <GlassCard className="max-w-2xl mx-auto p-8">
            <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
              You stand at the sacred threshold between two ways of being.
              This journey will guide you from the patterns of the natural mind
              to the freedom of the spiritual mind.
            </p>
            <div className="w-32 h-1 bg-gradient-to-r from-indigo-400 to-amber-400 mx-auto rounded-full" />
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease: "easeOut" }}
          className="mb-8"
        >
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 font-light">
            Take a moment to breathe deeply and set your intention.
            <br />
            When you're ready, step across the threshold.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 2, ease: "easeOut" }}
        >
          <button
            onClick={onNext}
            className="group relative px-8 py-4 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-3">
              Cross the Threshold
              <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
            </span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </button>
        </motion.div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20, -20],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}