
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
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
              Understanding the{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">Two Minds</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-sacred-blue-600">
              Within each of us exists two distinct ways of being. Understanding these minds is the
              first step toward transformation.
            </p>
          </SacredCard>
        </motion.div>

        {/* Two Minds Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 grid gap-6 md:grid-cols-2"
        >
          {/* Old Mind */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <SacredCard
              variant="glass"
              className={`h-full p-8 transition-all duration-300 border border-sacred-gold-100 ${
                selectedMind === 'old' ? 'bg-sacred-purple-50 ring-2 ring-sacred-gold-400 shadow-lg shadow-sacred-gold-200/50' : 'hover:border-sacred-gold-200'
              }`}
              hover={true}
              onClick={() => setSelectedMind('old')}
            >
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-lg ring-4 ring-sacred-gold-300">
                  <img 
                    src="https://www.svgrepo.com/show/404878/brain.svg" 
                    alt="Multicolored brain" 
                    className="h-8 w-8 filter brightness-0 invert"
                  />
                </div>
                <h3 className="mb-4 font-serif text-2xl text-sacred-blue-900 border-b-2 border-sacred-gold-300 pb-2">The Old Mind</h3>
                <p className="mb-4 leading-relaxed text-sacred-blue-600">
                  Driven by fear, scarcity, and reactive patterns. Lives in the past or future,
                  seeking external validation and operating from limitation.
                </p>
                <ul className="space-y-2 text-left text-sm text-sacred-blue-500">
                  <li>• Fear-based decisions</li>
                  <li>• Reactive responses</li>
                  <li>• External validation seeking</li>
                  <li>• Scarcity mindset</li>
                </ul>
                {selectedMind === 'old' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 inline-flex items-center rounded-full bg-sacred-purple-gradient px-4 py-2 text-sm font-medium text-white"
                  >
                    <span className="mr-2">✓</span>
                    Selected
                  </motion.div>
                )}
              </div>
            </SacredCard>
          </motion.div>

          {/* New Mind - Fixed to Sacred Blue with Gold Accents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <SacredCard
              variant="glass"
              className={`h-full p-8 transition-all duration-300 border border-sacred-gold-200 ${
                selectedMind === 'new' ? 'bg-sacred-gold-50 ring-2 ring-sacred-gold-400 shadow-lg shadow-sacred-gold-200/50' : 'hover:border-sacred-gold-300'
              }`}
              hover={true}
              onClick={() => setSelectedMind('new')}
            >
              <div className="text-center">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sacred-blue-500 to-sacred-blue-600 shadow-lg ring-4 ring-sacred-gold-300">
                  <span className="text-2xl text-white">✨</span>
                </div>
                <h3 className="mb-4 font-serif text-2xl text-sacred-blue-900 border-b-2 border-sacred-gold-300 pb-2">The New Mind</h3>
                <p className="mb-4 leading-relaxed text-sacred-blue-600">
                  Rooted in love, abundance, and conscious choice. Lives in the present moment,
                  guided by inner wisdom and operating from possibility.
                </p>
                <ul className="space-y-2 text-left text-sm text-sacred-blue-500">
                  <li>• Love-based decisions</li>
                  <li>• Conscious responses</li>
                  <li>• Inner wisdom guidance</li>
                  <li>• Abundance mindset</li>
                </ul>
                {selectedMind === 'new' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 inline-flex items-center rounded-full bg-sacred-gold-gradient px-4 py-2 text-sm font-medium text-white"
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
          className="mb-8 text-center"
        >
          <SacredCard variant="glass" className="p-6">
            <p className="mb-4 text-lg text-sacred-blue-700">
              Which mind do you find yourself operating from most often?
            </p>
            {selectedMind && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-sacred-blue-600"
              >
                You've selected:{' '}
                <strong>{selectedMind === 'old' ? 'The Old Mind' : 'The New Mind'}</strong>
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
