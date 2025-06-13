'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiBook, FiHeadphones, FiEdit3, FiCompass } from 'react-icons/fi';
import GlassCard from './GlassCard';

const PATHS = [
  {
    id: 'guided',
    title: 'Guided Transformation',
    subtitle: 'Interactive Book Experience',
    description: 'Journey through the sacred text with interactive elements, reflections, and guided practices. Perfect for those who learn through reading and contemplation.',
    features: [
      'Chapter-by-chapter guidance',
      'Interactive reflection exercises',
      'Progress tracking',
      'Sacred text with commentary',
      'Visual learning aids'
    ],
    icon: FiBook,
    color: 'from-indigo-500 to-purple-600',
    recommended: 'For contemplative learners'
  },
  {
    id: 'audio',
    title: 'Audio + Journaling',
    subtitle: 'Immersive Listening Experience',
    description: 'Listen to the sacred teachings while journaling your insights and reflections. Ideal for auditory learners and those who prefer a more meditative approach.',
    features: [
      'Full audio narration',
      'Integrated journaling tools',
      'Pause and reflect prompts',
      'Background soundscapes',
      'Voice memo recordings'
    ],
    icon: FiHeadphones,
    color: 'from-amber-500 to-orange-600',
    recommended: 'For auditory learners'
  }
];

export default function PathSelection({ onNext, onPrev, onDataUpdate, data }) {
  const [selectedPath, setSelectedPath] = useState(data.selectedPath || null);
  const [hoveredPath, setHoveredPath] = useState(null);

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
  };

  const handleNext = () => {
    if (selectedPath) {
      onDataUpdate({ selectedPath });
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-2xl">
                <FiCompass className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-gray-100 mb-4"
            >
              Choose Your Sacred Path
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              Both paths lead to the same destination—the transformation from the Natural Mind to the Spiritual Mind. 
              Choose the one that resonates with your learning style.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {PATHS.map((path, index) => {
              const Icon = path.icon;
              const isSelected = selectedPath === path.id;
              const isHovered = hoveredPath === path.id;
              
              return (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.2 }}
                  onMouseEnter={() => setHoveredPath(path.id)}
                  onMouseLeave={() => setHoveredPath(null)}
                >
                  <GlassCard
                    className={`p-8 cursor-pointer transition-all duration-500 border-2 ${
                      isSelected
                        ? 'border-indigo-500 shadow-2xl scale-105'
                        : isHovered
                        ? 'border-indigo-300 shadow-xl scale-102'
                        : 'border-transparent hover:shadow-lg'
                    }`}
                    onClick={() => handlePathSelect(path.id)}
                  >
                    <motion.div
                      animate={{
                        scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                        rotate: isSelected ? 5 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="text-center mb-6"
                    >
                      <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${path.color} flex items-center justify-center shadow-lg`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                    </motion.div>

                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-serif text-gray-800 dark:text-gray-100 mb-2">
                        {path.title}
                      </h3>
                      <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-4">
                        {path.subtitle}
                      </p>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                        {path.description}
                      </p>
                      
                      <div className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-amber-100 dark:from-indigo-900/30 dark:to-amber-900/30 rounded-full">
                        <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                          {path.recommended}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {path.features.map((feature, featureIndex) => (
                        <motion.div
                          key={featureIndex}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.2 + featureIndex * 0.1 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-amber-400" />
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: isSelected ? 1 : 0,
                        scale: isSelected ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 text-center"
                    >
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full text-sm font-medium">
                        ✨ Path Selected
                      </div>
                    </motion.div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>

          {selectedPath && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <GlassCard className="max-w-2xl mx-auto p-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  <strong>Remember:</strong> You can always switch between paths during your journey. 
                  The important thing is to begin with the approach that feels most natural to you right now.
                </p>
              </GlassCard>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex justify-between items-center"
          >
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              <FiArrowLeft />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!selectedPath}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                selectedPath
                  ? 'bg-gradient-to-r from-indigo-500 to-amber-500 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Begin Sacred Journey
              <FiArrowRight />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}