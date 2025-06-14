'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiBook, FiHeadphones, FiCompass, FiHeart } from 'react-icons/fi';

const TOUR_FEATURES = [
  {
    id: 'guidebook',
    icon: FiBook,
    title: 'Interactive Guidebook',
    description: 'Navigate through carefully crafted sections that guide your spiritual transformation journey.',
    preview: 'Read profound insights and practical wisdom for each stage of your growth.',
    color: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'audio',
    icon: FiHeadphones,
    title: 'Full Audiobook Experience',
    description: 'Listen to the complete audiobook with synchronized text and immersive audio controls.',
    preview: 'Perfect for meditation, commuting, or quiet reflection time.',
    color: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: 'journey',
    icon: FiCompass,
    title: 'Personalized Journey',
    description: 'Track your progress and receive personalized insights based on your spiritual growth.',
    preview: 'See how far you\'ve come and what lies ahead on your path.',
    color: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'transformation',
    icon: FiHeart,
    title: 'Transformation Tools',
    description: 'Access practical exercises, reflections, and tools to deepen your spiritual understanding.',
    preview: 'Apply the teachings in your daily life with guided practices.',
    color: 'from-red-400 to-red-600',
    bgColor: 'bg-red-50'
  }
];

export default function GuidedTourStep({ onNext, onPrevious, isFirstStep, isLastStep }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const handleFeatureSelect = (index) => {
    setActiveFeature(index);
  };

  const currentFeature = TOUR_FEATURES[activeFeature];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-blue-dark mb-4">
          Your Spiritual Journey Toolkit
        </h2>
        <p className="text-lg text-brand-text-main font-sans leading-relaxed max-w-2xl mx-auto">
          Discover the powerful features designed to support and guide your transformation from the natural mind to the spiritual mind.
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        {/* Feature List */}
        <div className="space-y-4">
          {TOUR_FEATURES.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
              className={`cursor-pointer transition-all duration-300 ${
                activeFeature === index ? 'scale-105' : 'hover:scale-102'
              }`}
              onClick={() => handleFeatureSelect(index)}
            >
              <div className={`relative overflow-hidden rounded-xl p-6 border-2 transition-all ${
                activeFeature === index 
                  ? 'border-current shadow-xl' 
                  : 'border-transparent shadow-lg hover:shadow-xl'
              } ${feature.bgColor}`}>
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-10`} />
                
                {/* Content */}
                <div className="relative flex items-start gap-4">
                  {/* Icon */}
                  <motion.div
                    animate={activeFeature === index ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center shadow-lg`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </motion.div>

                  {/* Text */}
                  <div className="flex-1">
                    <h3 className="text-xl font-serif font-bold text-brand-blue-dark mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-brand-text-main font-sans text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  {/* Selection Indicator */}
                  <AnimatePresence>
                    {activeFeature === index && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                      >
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${feature.color}`} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:sticky lg:top-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              {/* Feature Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="mb-6"
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentFeature.color} flex items-center justify-center mx-auto shadow-2xl`}>
                  <currentFeature.icon className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              {/* Feature Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-center"
              >
                <h3 className="text-2xl font-serif font-bold text-brand-blue-dark mb-4">
                  {currentFeature.title}
                </h3>
                <p className="text-brand-text-main font-sans leading-relaxed mb-6">
                  {currentFeature.preview}
                </p>

                {/* Mock Interface */}
                <div className={`${currentFeature.bgColor} rounded-xl p-6 border-2 border-gray-200`}>
                  <div className="space-y-3">
                    <div className="h-3 bg-gray-300 rounded-full w-3/4 mx-auto" />
                    <div className="h-3 bg-gray-300 rounded-full w-1/2 mx-auto" />
                    <div className="h-3 bg-gray-300 rounded-full w-2/3 mx-auto" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`mt-4 w-8 h-8 rounded-full bg-gradient-to-r ${currentFeature.color} mx-auto`}
                  />
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Journey Preview */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="bg-gradient-to-r from-brand-blue-light to-brand-cream rounded-2xl p-8 mb-8 text-center"
      >
        <h3 className="text-xl font-serif font-bold text-brand-blue-dark mb-3">
          Ready to Begin Your Transformation?
        </h3>
        <p className="text-brand-text-main font-sans leading-relaxed max-w-2xl mx-auto">
          These tools will accompany you every step of the way as you move from confusion to clarity, 
          fear to peace, and transactional living to a life that bears lasting spiritual fruit.
        </p>
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
          className="flex items-center gap-2 bg-brand-blue-medium hover:bg-brand-blue-dark text-white font-sans font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Start My Journey
          <FiArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}