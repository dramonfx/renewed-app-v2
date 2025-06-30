'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const TwoMindsStep = ({ onNext, onBack }) => {
  const [selectedMind, setSelectedMind] = useState(null);

  const handleContinue = () => {
    if (selectedMind) {
      // Store the choice
      localStorage.setItem('renewedMindChoice', selectedMind);
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SacredCard variant="heavy" className="p-8 md:p-12 text-center">
            {/* Sacred Contrast Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif sacred-text-enhanced mb-6">
                The Sacred Choice Before You
              </h1>
              <p className="sacred-text-body text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Every moment presents a fundamental choice between two ways of thinking. 
                Understanding this choice is the first step toward transformation.
              </p>
            </motion.div>

            {/* The Two Minds - Clear Contrast */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Natural Mind */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`cursor-pointer ${
                  selectedMind === 'natural' ? 'transform scale-105' : ''
                }`}
                onClick={() => setSelectedMind('natural')}
              >
                <SacredCard 
                  variant="enhanced" 
                  className={`p-8 h-full transition-all duration-300 ${
                    selectedMind === 'natural' 
                      ? 'sacred-selected ring-2 ring-blue-400' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-4xl">🌫️</span>
                    </div>
                    <h3 className="text-2xl font-serif sacred-text-enhanced mb-4">
                      Natural Mind
                    </h3>
                    <div className="space-y-3 text-left">
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                        Sees limitations and scarcity
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                        Focuses on problems and obstacles
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                        Operates from fear and uncertainty
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-slate-400 rounded-full mr-3"></span>
                        Seeks external validation
                      </p>
                    </div>
                  </div>
                </SacredCard>
              </motion.div>

              {/* Spiritual Mind */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className={`cursor-pointer ${
                  selectedMind === 'spiritual' ? 'transform scale-105' : ''
                }`}
                onClick={() => setSelectedMind('spiritual')}
              >
                <SacredCard 
                  variant="enhanced" 
                  className={`p-8 h-full transition-all duration-300 ${
                    selectedMind === 'spiritual' 
                      ? 'sacred-selected-gold ring-2 ring-blue-500' 
                      : 'hover:shadow-xl'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                      <span className="text-white text-4xl">✨</span>
                    </div>
                    <h3 className="text-2xl font-serif sacred-text-enhanced mb-4">
                      Spiritual Mind
                    </h3>
                    <div className="space-y-3 text-left">
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Sees infinite possibilities
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Focuses on solutions and growth
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Operates from love and faith
                      </p>
                      <p className="sacred-text-body text-sm flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        Finds strength in divine connection
                      </p>
                    </div>
                  </div>
                </SacredCard>
              </motion.div>
            </motion.div>

            {/* Sacred Understanding */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="mb-8"
            >
              <SacredCard variant="glass" className="p-6">
                <p className="sacred-text-body text-base leading-relaxed">
                  This journey will help you recognize these thought patterns and gradually shift 
                  from the natural mind's limitations to the spiritual mind's divine possibilities. 
                  Choose which mindset feels more familiar to you right now.
                </p>
              </SacredCard>
            </motion.div>

            {/* Navigation */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                <SacredButton
                  onClick={onBack}
                  variant="ghost"
                  className="px-8 py-3"
                >
                  ← Previous
                </SacredButton>
                
                <SacredButton
                  onClick={handleContinue}
                  variant="primary"
                  disabled={!selectedMind}
                  className="px-12 py-3 text-lg font-semibold"
                >
                  Continue Sacred Journey →
                </SacredButton>
              </motion.div>

              {!selectedMind && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                  className="sacred-text-muted text-sm text-center"
                >
                  Please select the mindset that feels most familiar to you
                </motion.p>
              )}
            </div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default TwoMindsStep;