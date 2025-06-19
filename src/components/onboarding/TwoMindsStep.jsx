
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const TwoMindsStep = ({ onNext, data = {} }) => {
  const [selectedMind, setSelectedMind] = useState(data.selectedMind || '');

  const handleNext = () => {
    onNext({ selectedMind });
  };

  return (
    <div className="text-center">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
          Understanding the{' '}
          <span className="bg-sacred-gradient bg-clip-text text-transparent">
            Two Minds
          </span>
        </h2>
        <p className="text-sacred-blue-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Within each of us exists two distinct ways of being. Understanding these minds is the first step toward transformation.
        </p>
      </motion.div>

      {/* Two Minds Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid md:grid-cols-2 gap-8 mb-10"
      >
        {/* Old Mind */}
        <motion.div
          className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            selectedMind === 'old' 
              ? 'border-sacred-purple-400 bg-sacred-purple-50' 
              : 'border-gray-200 bg-white/50 hover:border-sacred-purple-200'
          }`}
          onClick={() => setSelectedMind('old')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-400 flex items-center justify-center">
            <span className="text-white text-2xl">🌫️</span>
          </div>
          <h3 className="text-2xl font-serif text-sacred-blue-900 mb-4">The Old Mind</h3>
          <p className="text-sacred-blue-600 leading-relaxed mb-4">
            Driven by fear, scarcity, and reactive patterns. Lives in the past or future, 
            seeking external validation and operating from limitation.
          </p>
          <ul className="text-sm text-sacred-blue-500 space-y-2">
            <li>• Fear-based decisions</li>
            <li>• Reactive responses</li>
            <li>• External validation seeking</li>
            <li>• Scarcity mindset</li>
          </ul>
        </motion.div>

        {/* New Mind */}
        <motion.div
          className={`p-8 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
            selectedMind === 'new' 
              ? 'border-sacred-gold-400 bg-sacred-gold-50' 
              : 'border-gray-200 bg-white/50 hover:border-sacred-gold-200'
          }`}
          onClick={() => setSelectedMind('new')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sacred-gradient flex items-center justify-center">
            <span className="text-white text-2xl">✨</span>
          </div>
          <h3 className="text-2xl font-serif text-sacred-blue-900 mb-4">The New Mind</h3>
          <p className="text-sacred-blue-600 leading-relaxed mb-4">
            Rooted in love, abundance, and conscious choice. Lives in the present moment, 
            guided by inner wisdom and operating from possibility.
          </p>
          <ul className="text-sm text-sacred-blue-500 space-y-2">
            <li>• Love-based decisions</li>
            <li>• Conscious responses</li>
            <li>• Inner wisdom guidance</li>
            <li>• Abundance mindset</li>
          </ul>
        </motion.div>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mb-8"
      >
        <p className="text-sacred-blue-700 text-lg mb-6">
          Which mind do you find yourself operating from most often?
        </p>
        {selectedMind && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sacred-blue-600 text-sm"
          >
            You've selected: <strong>{selectedMind === 'old' ? 'The Old Mind' : 'The New Mind'}</strong>
          </motion.p>
        )}
      </motion.div>

      {/* Next Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        onClick={handleNext}
        disabled={!selectedMind}
        className={`
          px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
          ${selectedMind 
            ? 'bg-sacred-gradient text-white hover:shadow-xl hover:-translate-y-1' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
        whileHover={selectedMind ? { scale: 1.05 } : {}}
        whileTap={selectedMind ? { scale: 0.95 } : {}}
      >
        Continue Your Journey →
      </motion.button>
    </div>
  );
};

export default TwoMindsStep;
