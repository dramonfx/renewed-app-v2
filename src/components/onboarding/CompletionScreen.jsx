'use client';

import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiHeart, FiStar, FiSun } from 'react-icons/fi';
import GlassCard from './GlassCard';

const PATH_DESCRIPTIONS = {
  guided: {
    title: 'Interactive Book Experience',
    description: 'You\'ll journey through the sacred text with guided reflections and interactive elements.',
    nextStep: 'Begin reading the first chapter'
  },
  audio: {
    title: 'Audio + Journaling Experience', 
    description: 'You\'ll listen to the teachings while journaling your insights and reflections.',
    nextStep: 'Start your first audio session'
  }
};

const MIND_SUMMARIES = {
  natural: {
    current: 'You currently operate primarily from the Natural Mind—patterns of judgment, control, and separation.',
    journey: 'Your journey will gently guide you toward the peace and freedom of the Spiritual Mind.',
    encouragement: 'Remember, there is nothing wrong with where you are. This is simply your starting point for transformation.'
  },
  spiritual: {
    current: 'You already operate primarily from the Spiritual Mind—patterns of love, acceptance, and unity.',
    journey: 'Your journey will help you deepen this connection and maintain it even in challenging moments.',
    encouragement: 'Your heart is already open. This journey will help you trust even more deeply in the divine flow.'
  }
};

export default function CompletionScreen({ onComplete, onPrev, data }) {
  const selectedPath = data.selectedPath || 'guided';
  const currentMind = data.currentMind || 'natural';
  const pathInfo = PATH_DESCRIPTIONS[selectedPath];
  const mindInfo = MIND_SUMMARIES[currentMind];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="mb-8"
            >
              <div className="relative">
                <div className="absolute inset-0 w-32 h-32 mx-auto">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-16 bg-gradient-to-t from-transparent to-amber-400 opacity-30"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '0 32px',
                        transform: `rotate(${i * 45}deg) translateX(-0.5px)`
                      }}
                      animate={{
                        opacity: [0.3, 0.7, 0.3],
                        scaleY: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                
                <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 flex items-center justify-center shadow-2xl">
                  <FiSun className="w-16 h-16 text-white" />
                </div>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="text-4xl md:text-6xl font-serif text-gray-800 dark:text-gray-100 mb-6"
            >
              Sacred Journey
              <br />
              <span className="bg-gradient-to-r from-indigo-600 to-amber-600 bg-clip-text text-transparent">
                Begun
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed"
            >
              You have completed the sacred preparation. Your journey of renewal begins now.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <FiHeart className="w-6 h-6 text-indigo-500" />
                  <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-100">
                    Your Sacred Journey
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Current State
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {mindInfo.current}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      Your Path Forward
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {mindInfo.journey}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/20 dark:border-black/20">
                    <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium italic">
                      {mindInfo.encouragement}
                    </p>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <GlassCard className="p-8 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <FiStar className="w-6 h-6 text-amber-500" />
                  <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-100">
                    Your Chosen Path
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                      {pathInfo.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {pathInfo.description}
                    </p>
                  </div>
                  
                  {data.intention && (
                    <div>
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">
                        Your Sacred Intention
                      </h4>
                      <div className="bg-white/30 dark:bg-white/5 rounded-lg p-4">
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                          "{data.intention.substring(0, 150)}{data.intention.length > 150 ? '...' : ''}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="text-center mb-8"
          >
            <GlassCard className="max-w-3xl mx-auto p-8">
              <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-6">
                Sacred Blessing for Your Journey
              </h3>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic">
                "May you walk gently from judgment to love, from fear to trust, from separation to unity. 
                May each step on this sacred path bring you closer to the truth of who you really are. 
                The light within you is already perfect—this journey simply helps you remember."
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-amber-400 mx-auto mt-6 rounded-full" />
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              <FiArrowLeft />
              Back
            </button>
            
            <motion.button
              onClick={onComplete}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-12 py-4 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full font-medium text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <span className="flex items-center gap-3">
                {pathInfo.nextStep}
                <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
            </motion.button>
          </motion.div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-gradient-to-r from-indigo-400 to-amber-400 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}