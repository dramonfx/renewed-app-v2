'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiMinus, FiPlus } from 'react-icons/fi';
import TwoTreesVisualization from './TwoTreesVisualization';

const MIND_CONCEPTS = [
  {
    id: 'natural',
    title: 'Natural Mind',
    subtitle: 'The Tree of Knowledge',
    characteristics: [
      'Confusion and uncertainty',
      'Fear-based decisions',
      'Transactional relationships',
      'Striving and doing',
      'External validation'
    ],
    color: 'from-red-400 to-orange-500',
    textColor: 'text-red-700',
    bgColor: 'bg-red-50'
  },
  {
    id: 'spiritual',
    title: 'Spiritual Mind',
    subtitle: 'The Tree of Life',
    characteristics: [
      'Clarity and wisdom',
      'Peace and confidence',
      'Authentic relationships',
      'Being and flowing',
      'Inner fulfillment'
    ],
    color: 'from-green-400 to-emerald-500',
    textColor: 'text-green-700',
    bgColor: 'bg-green-50'
  }
];

export default function TwoMindsStep({ onNext, onPrevious, isFirstStep, isLastStep }) {
  const [selectedMind, setSelectedMind] = useState(null);
  const [showVisualization, setShowVisualization] = useState(false);

  const handleMindSelect = (mindId) => {
    setSelectedMind(mindId);
    setTimeout(() => {
      setShowVisualization(true);
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue-dark mb-4">
          Two Minds, Two Trees
        </h2>
        <p className="text-lg text-brand-text-main font-sans leading-relaxed max-w-2xl mx-auto">
          Understanding the fundamental difference between the natural mind and the spiritual mind is the key to transformation.
        </p>
      </motion.div>

      {/* Two Minds Comparison */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {MIND_CONCEPTS.map((mind, index) => (
          <motion.div
            key={mind.id}
            initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.2, duration: 0.6 }}
            className={`relative overflow-hidden rounded-2xl shadow-xl cursor-pointer transition-all duration-500 ${
              selectedMind === mind.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'
            }`}
            onClick={() => handleMindSelect(mind.id)}
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${mind.color} opacity-10`} />
            
            {/* Content */}
            <div className={`relative p-8 ${mind.bgColor} border-2 ${selectedMind === mind.id ? 'border-current' : 'border-transparent'} ${mind.textColor}`}>
              {/* Icon */}
              <motion.div
                animate={selectedMind === mind.id ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${mind.color} flex items-center justify-center mx-auto shadow-lg`}>
                  {mind.id === 'natural' ? (
                    <FiMinus className="w-8 h-8 text-white" />
                  ) : (
                    <FiPlus className="w-8 h-8 text-white" />
                  )}
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="text-2xl font-serif font-bold text-center mb-2">
                {mind.title}
              </h3>
              <p className="text-sm font-sans text-center mb-6 opacity-80">
                {mind.subtitle}
              </p>

              {/* Characteristics */}
              <ul className="space-y-3">
                {mind.characteristics.map((characteristic, charIndex) => (
                  <motion.li
                    key={charIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + charIndex * 0.1, duration: 0.4 }}
                    className="flex items-center gap-3 font-sans text-sm"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mind.color}`} />
                    {characteristic}
                  </motion.li>
                ))}
              </ul>

              {/* Selection Indicator */}
              <AnimatePresence>
                {selectedMind === mind.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute top-4 right-4 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${mind.color}`} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Visualization */}
      <AnimatePresence>
        {showVisualization && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <TwoTreesVisualization selectedMind={selectedMind} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transformation Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedMind ? 1 : 0.5 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg max-w-2xl mx-auto">
          <h4 className="text-xl font-serif font-bold text-brand-blue-dark mb-3">
            The Journey of Transformation
          </h4>
          <p className="text-brand-text-main font-sans leading-relaxed">
            This app will guide you through the process of moving from the natural mind to the spiritual mind, 
            helping you experience the peace, clarity, and authentic relationships that come with spiritual maturity.
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2 px-6 py-3 text-brand-text-muted hover:text-brand-blue-dark transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <button
          onClick={onNext}
          disabled={!selectedMind}
          className="flex items-center gap-2 bg-brand-blue-medium hover:bg-brand-blue-dark text-white font-sans font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue Journey
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}