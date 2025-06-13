'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiEye, FiHeart } from 'react-icons/fi';
import GlassCard from './GlassCard';

const EXPLANATION_STEPS = [
  {
    id: 'introduction',
    title: 'Two Minds, Two Trees',
    content: 'Within each of us exist two distinct ways of perceiving and experiencing reality. These are represented by two sacred trees in the garden of consciousness.',
    visual: 'trees'
  },
  {
    id: 'natural-mind',
    title: 'The Natural Mind',
    subtitle: 'Tree of Knowledge of Good and Evil',
    content: 'This mind operates through judgment, comparison, and the constant evaluation of right and wrong. It seeks control through understanding and creates separation through analysis.',
    characteristics: [
      'Judges and compares constantly',
      'Seeks to control outcomes',
      'Creates separation and division',
      'Operates from fear and scarcity',
      'Focuses on external validation'
    ],
    visual: 'natural-tree',
    icon: FiEye,
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'spiritual-mind',
    title: 'The Spiritual Mind',
    subtitle: 'Tree of Life',
    content: 'This mind operates through love, acceptance, and unity. It trusts in the flow of life and creates connection through understanding our shared essence.',
    characteristics: [
      'Accepts what is with love',
      'Trusts in divine timing',
      'Sees unity in all things',
      'Operates from love and abundance',
      'Finds validation within'
    ],
    visual: 'life-tree',
    icon: FiHeart,
    color: 'from-indigo-500 to-amber-500'
  },
  {
    id: 'transformation',
    title: 'The Sacred Transformation',
    content: 'The journey from the Natural Mind to the Spiritual Mind is not about destroying the old, but about choosing which mind to feed and follow. This is the path of renewal.',
    visual: 'transformation'
  }
];

export default function TwoMindsExplanation({ onNext, onPrev }) {
  const [currentExplanationStep, setCurrentExplanationStep] = useState(0);
  const currentStep = EXPLANATION_STEPS[currentExplanationStep];

  const nextExplanationStep = () => {
    if (currentExplanationStep < EXPLANATION_STEPS.length - 1) {
      setCurrentExplanationStep(currentExplanationStep + 1);
    } else {
      onNext();
    }
  };

  const prevExplanationStep = () => {
    if (currentExplanationStep > 0) {
      setCurrentExplanationStep(currentExplanationStep - 1);
    } else {
      onPrev();
    }
  };

  const renderVisual = () => {
    switch (currentStep.visual) {
      case 'trees':
        return (
          <div className="flex justify-center items-center space-x-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center">
                <FiEye className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Natural Mind</p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-400 to-amber-400 flex items-center justify-center"
            >
              <div className="w-8 h-8 rounded-full bg-white/30 backdrop-blur-sm" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center">
                <FiHeart className="w-8 h-8 text-white" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Spiritual Mind</p>
            </motion.div>
          </div>
        );
      
      case 'natural-tree':
      case 'life-tree':
        const Icon = currentStep.icon;
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <div className={`w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-2xl`}>
              <Icon className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-3">
              {currentStep.characteristics.map((char, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="flex items-center justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-amber-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">{char}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      
      case 'transformation':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center items-center space-x-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 rounded-full bg-gradient-to-br from-red-400 to-orange-500 flex items-center justify-center opacity-60"
              >
                <FiEye className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 20 }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                className="text-4xl text-indigo-500"
              >
                →
              </motion.div>
              
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-amber-500 flex items-center justify-center shadow-lg"
              >
                <FiHeart className="w-10 h-10 text-white" />
              </motion.div>
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentExplanationStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8 md:p-12 text-center">
              {renderVisual()}
              
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-gray-100 mb-4"
              >
                {currentStep.title}
              </motion.h2>
              
              {currentStep.subtitle && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-indigo-600 dark:text-indigo-400 mb-6 font-medium"
                >
                  {currentStep.subtitle}
                </motion.h3>
              )}
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl mx-auto"
              >
                {currentStep.content}
              </motion.p>
              
              <div className="flex justify-center space-x-2 mb-8">
                {EXPLANATION_STEPS.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentExplanationStep
                        ? 'bg-gradient-to-r from-indigo-500 to-amber-500 scale-125'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={prevExplanationStep}
                  className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
                >
                  <FiArrowLeft />
                  Back
                </button>
                
                <button
                  onClick={nextExplanationStep}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-amber-500 text-white rounded-full font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  {currentExplanationStep === EXPLANATION_STEPS.length - 1 ? 'Continue Journey' : 'Next'}
                  <FiArrowRight />
                </button>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}