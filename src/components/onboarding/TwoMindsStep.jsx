
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const TwoMindsStep = ({ onNext, data = {} }) => {
  const [selectedMind, setSelectedMind] = useState(data.selectedMind || '');

  const handleNext = () => {
    onNext({ selectedMind });
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
              Understanding the{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">
                Two Minds
              </span>
            </h2>
            <p className="text-sacred-blue-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Within each of us exists two distinct ways of being. Understanding these minds is the first step toward transformation.
            </p>
          </SacredCard>
        </motion.div>

        {/* Two Minds Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6 mb-10"
        >
          {/* Old Mind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SacredCard
              variant="glass"
              className={`p-8 h-full transition-all duration-300 ${
                selectedMind === 'old' 
                  ? 'ring-2 ring-sacred-purple-400 bg-sacred-purple-50' 
                  : ''
              }`}
              hover={true}
              onClick={() => setSelectedMind('old')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gray-400 flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🌫️</span>
                </div>
                <h3 className="text-2xl font-serif text-sacred-blue-900 mb-4">The Old Mind</h3>
                <p className="text-sacred-blue-600 leading-relaxed mb-4">
                  Driven by fear, scarcity, and reactive patterns. Lives in the past or future, 
                  seeking external validation and operating from limitation.
                </p>
                <ul className="text-sm text-sacred-blue-500 space-y-2 text-left">
                  <li>• Fear-based decisions</li>
                  <li>• Reactive responses</li>
                  <li>• External validation seeking</li>
                  <li>• Scarcity mindset</li>
                </ul>
                {selectedMind === 'old' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-sacred-purple-gradient text-white text-sm font-medium"
                  >
                    <span className="mr-2">✓</span>
                    Selected
                  </motion.div>
                )}
              </div>
            </SacredCard>
          </motion.div>

          {/* New Mind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SacredCard
              variant="glass"
              className={`p-8 h-full transition-all duration-300 ${
                selectedMind === 'new' 
                  ? 'ring-2 ring-sacred-gold-400 bg-sacred-gold-50' 
                  : ''
              }`}
              hover={true}
              onClick={() => setSelectedMind('new')}
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h3 className="text-2xl font-serif text-sacred-blue-900 mb-4">The New Mind</h3>
                <p className="text-sacred-blue-600 leading-relaxed mb-4">
                  Rooted in love, abundance, and conscious choice. Lives in the present moment, 
                  guided by inner wisdom and operating from possibility.
                </p>
                <ul className="text-sm text-sacred-blue-500 space-y-2 text-left">
                  <li>• Love-based decisions</li>
                  <li>• Conscious responses</li>
                  <li>• Inner wisdom guidance</li>
                  <li>• Abundance mindset</li>
                </ul>
                {selectedMind === 'new' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-sacred-gradient text-white text-sm font-medium"
                  >
                    <span className="mr-2">✓</span>
                    Selected
                  </motion.div>
                )}
              </div>
            </SacredCard>
          </motion.div>
        </motion.div>

        {/* Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <SacredCard variant="glass" className="p-6">
            <p className="text-sacred-blue-700 text-lg mb-4">
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
          </SacredCard>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredButton
            onClick={handleNext}
            disabled={!selectedMind}
            variant="primary"
            size="lg"
            className="px-8"
          >
            Continue Your Journey →
          </SacredButton>
        </motion.div>
      </div>
    </div>
  );
};

export default TwoMindsStep;
