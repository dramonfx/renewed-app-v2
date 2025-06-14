'use client';

import { motion } from 'framer-motion';
import { FiArrowRight, FiArrowLeft, FiStar, FiHeart, FiSun } from 'react-icons/fi';

export default function CallToActionStep({ onNext, onPrevious, isFirstStep, isLastStep }) {
  return (
    <div className="text-center max-w-4xl mx-auto">
      {/* Animated Success Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-brand-gold to-yellow-500 rounded-full flex items-center justify-center shadow-2xl">
          <FiStar className="w-16 h-16 text-white" />
          
          {/* Floating particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-brand-gold rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{
                x: Math.cos(i * 45 * Math.PI / 180) * 60,
                y: Math.sin(i * 45 * Math.PI / 180) * 60,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Main Message */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue-dark mb-6">
          Your Journey Begins{' '}
          <span className="text-brand-gold">Now</span>
        </h2>
        <p className="text-xl text-brand-text-main font-sans leading-relaxed mb-6">
          You're ready to embark on the most important journey of your life—
          the transformation from the natural mind to the spiritual mind.
        </p>
      </motion.div>

      {/* Journey Promise */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {[
          {
            icon: FiHeart,
            title: "Find Peace",
            description: "Move from fear and anxiety to deep, lasting peace"
          },
          {
            icon: FiSun,
            title: "Gain Clarity",
            description: "Transform confusion into crystal-clear understanding"
          },
          {
            icon: FiStar,
            title: "Bear Fruit",
            description: "Live a life of authentic relationships and purpose"
          }
        ].map((promise, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + index * 0.2, duration: 0.5 }}
            className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 bg-gradient-to-r from-brand-blue-medium to-brand-blue-dark rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <promise.icon className="w-6 h-6 text-white" />
            </motion.div>
            <h3 className="text-lg font-serif font-bold text-brand-blue-dark mb-2">
              {promise.title}
            </h3>
            <p className="text-sm text-brand-text-muted font-sans leading-relaxed">
              {promise.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Encouragement */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.6 }}
        className="bg-gradient-to-r from-brand-blue-light via-brand-blue-content-bg to-brand-cream rounded-2xl p-8 mb-12"
      >
        <blockquote className="text-lg font-serif italic text-brand-blue-dark mb-4">
          "The journey of a thousand miles begins with a single step. 
          Your step toward spiritual transformation starts here, today."
        </blockquote>
        <p className="text-brand-text-main font-sans">
          Every great spiritual journey begins with a decision to grow. 
          You've already taken the first step by being here.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        className="space-y-6"
      >
        <button
          onClick={onNext}
          className="group bg-gradient-to-r from-brand-gold to-yellow-500 hover:from-yellow-500 hover:to-brand-gold text-white font-sans font-bold text-lg px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-4 mx-auto transform hover:scale-105"
        >
          <span>Enter the Renewed Journey</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <FiArrowRight className="w-6 h-6" />
          </motion.div>
        </button>

        <p className="text-sm text-brand-text-muted font-sans">
          Begin your transformation with the interactive guidebook and audiobook experience
        </p>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1, duration: 0.6 }}
        className="flex justify-between items-center mt-12"
      >
        <button
          onClick={onPrevious}
          disabled={isFirstStep}
          className="flex items-center gap-2 px-6 py-3 text-brand-text-muted hover:text-brand-blue-dark transition-colors font-sans disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowLeft className="w-4 h-4" />
          Previous
        </button>

        <div className="text-sm text-brand-text-muted font-sans">
          Ready to transform your life?
        </div>
      </motion.div>
    </div>
  );
}