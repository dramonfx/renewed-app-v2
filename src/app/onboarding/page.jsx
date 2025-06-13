'use client';

import { motion } from 'framer-motion';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-5xl md:text-6xl font-serif text-gray-800 mb-8"
        >
          Welcome to Your{' '}
          <span className="text-amber-600 font-bold">Renewal</span>
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="w-24 h-1 bg-gradient-to-r from-blue-400 to-amber-400 mx-auto rounded-full"
        />
      </div>
    </div>
  );
}