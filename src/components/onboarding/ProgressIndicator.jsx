'use client';

import { motion } from 'framer-motion';

export default function ProgressIndicator({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="flex items-center gap-4">
      {/* Step Indicators */}
      <div className="flex items-center gap-2">
        {[...Array(totalSteps)].map((_, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-brand-gold shadow-lg' 
                : 'bg-white/50 border-2 border-brand-gold/30'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-32 h-2 bg-white/30 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-brand-gold to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Step Counter */}
      <div className="text-sm font-sans text-brand-text-muted">
        <span className="font-semibold text-brand-blue-dark">{currentStep + 1}</span>
        <span className="mx-1">/</span>
        <span>{totalSteps}</span>
      </div>
    </div>
  );
}