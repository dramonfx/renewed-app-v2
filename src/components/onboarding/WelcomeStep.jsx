'use client';

import { motion } from 'framer-motion';
import { FiHeart, FiSun, FiArrowRight } from 'react-icons/fi';

export default function WelcomeStep({ onNext, isFirstStep, isLastStep }) {
  return (
    <div className="text-center max-w-3xl mx-auto">
      {/* Animated Logo/Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="relative mx-auto w-24 h-24 bg-gradient-to-br from-brand-blue-medium to-brand-blue-dark rounded-full flex items-center justify-center shadow-2xl">
          <FiSun className="w-12 h-12 text-white" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-brand-gold border-t-transparent rounded-full"
          />
        </div>
      </motion.div>

      {/* Welcome Text */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-blue-dark mb-4">
          Welcome to{' '}
          <span className="text-brand-gold">Renewed</span>
        </h1>
        <p className="text-xl text-brand-text-main font-sans leading-relaxed">
          The New Man Story
        </p>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="mb-12"
      >
        <p className="text-lg text-brand-text-main font-sans leading-relaxed mb-6">
          Embark on a transformative journey from the{' '}
          <span className="font-semibold text-brand-blue-dark">natural mind</span> to the{' '}
          <span className="font-semibold text-brand-blue-dark">spiritual mind</span>.
        </p>
        <p className="text-base text-brand-text-muted font-sans leading-relaxed">
          Discover the path from confusion to clarity, fear to peace, and transactional living to a life that bears lasting fruit.
        </p>
      </motion.div>

      {/* Animated Features */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="grid md:grid-cols-3 gap-6 mb-12"
      >
        {[
          { icon: FiHeart, title: "Spiritual Growth", desc: "Transform your inner life" },
          { icon: FiSun, title: "Clear Guidance", desc: "Step-by-step journey" },
          { icon: FiHeart, title: "Lasting Peace", desc: "Find true fulfillment" }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 + index * 0.2, duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg"
          >
            <feature.icon className="w-8 h-8 text-brand-blue-medium mx-auto mb-3" />
            <h3 className="font-sans font-semibold text-brand-blue-dark mb-2">{feature.title}</h3>
            <p className="text-sm text-brand-text-muted font-sans">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        <button
          onClick={onNext}
          className="group bg-brand-gold hover:bg-yellow-500 text-white font-sans font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          Begin Your Journey
          <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}