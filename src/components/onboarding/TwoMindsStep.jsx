'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const TwoMindsStep = ({ onNext, data = {} }) => {
  const [selectedMind, setSelectedMind] = useState(data.selectedMind || '');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleNext = () => {
    onNext({ selectedMind });
  };

  const handleMindSelection = (mindType) => {
    setSelectedMind(mindType);
  };

  return (
    <div className="min-h-screen p-6 lg:p-8 relative overflow-hidden">
      {/* Sacred Atmosphere with Contrasting Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Shadow Realm - Left Side (Old Mind) */}
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full"
          style={{
            background: 'linear-gradient(135deg, rgba(107, 114, 128, 0.15) 0%, rgba(75, 85, 99, 0.1) 50%, transparent 100%)',
          }}
          animate={{
            opacity: selectedMind === 'old' ? [0.2, 0.4, 0.2] : [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Light Realm - Right Side (New Mind) */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full"
          style={{
            background: 'linear-gradient(225deg, rgba(250, 207, 81, 0.2) 0%, rgba(14, 165, 233, 0.15) 50%, transparent 100%)',
          }}
          animate={{
            opacity: selectedMind === 'new' ? [0.3, 0.6, 0.3] : [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />

        {/* Sacred Energy Flow Between Realms */}
        {mounted && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-32"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(147, 51, 234, 0.6) 50%, transparent 100%)',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.4)',
            }}
            animate={{
              scaleY: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        )}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Sacred Teaching Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <SacredCard variant="heavy" className="p-10 md:p-16 sacred-breathing">
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-serif sacred-text-enhanced mb-6 leading-tight"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Understanding the{' '}
              <motion.span 
                className="bg-gradient-to-r from-gray-600 via-purple-600 to-amber-500 bg-clip-text text-transparent"
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: 'linear' 
                }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Two Minds
              </motion.span>
            </motion.h2>
            <motion.p 
              className="sacred-text-body text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Within each soul exists two distinct ways of being. This sacred choice between limitation and 
              divine possibility shapes every moment of your spiritual journey.
            </motion.p>
          </SacredCard>
        </motion.div>

        {/* Sacred Contrast - Two Minds */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-2 gap-8 mb-12"
        >
          {/* The Old Mind - Shadow Realm */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative"
          >
            <SacredCard
              variant="enhanced"
              className={`p-10 h-full transition-all duration-500 cursor-pointer group ${
                selectedMind === 'old' 
                  ? 'sacred-selected ring-4 ring-gray-400/30 scale-105' 
                  : 'hover:scale-102'
              }`}
              hover={true}
              onClick={() => handleMindSelection('old')}
            >
              {/* Shadow Visual Effects */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-500/5 to-gray-700/10 pointer-events-none" />
              
              <div className="text-center relative z-10">
                <motion.div 
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-2xl group-hover:shadow-3xl"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  animate={selectedMind === 'old' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-4xl">🌫️</span>
                </motion.div>
                
                <h3 className="text-3xl font-serif sacred-text-enhanced mb-6">The Natural Mind</h3>
                <p className="sacred-text-body text-lg leading-relaxed mb-6">
                  Operating from fear, scarcity, and reactive patterns. Bound to the past and anxious about the future, 
                  seeking validation from the world and limited by earthly perspective.
                </p>
                
                <div className="grid grid-cols-1 gap-3 text-left mb-6">
                  {[
                    '⚡ Fear-driven choices',
                    '⚡ Reactive responses',
                    '⚡ External validation dependency',
                    '⚡ Scarcity and limitation mindset'
                  ].map((trait, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center sacred-text-muted text-base"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    >
                      {trait}
                    </motion.div>
                  ))}
                </div>

                {selectedMind === 'old' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 text-white text-lg font-semibold shadow-xl"
                  >
                    <span className="mr-3 text-xl">✓</span>
                    Currently Selected
                  </motion.div>
                )}
              </div>
            </SacredCard>
          </motion.div>

          {/* The New Mind - Light Realm */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="relative"
          >
            <SacredCard
              variant="enhanced"
              className={`p-10 h-full transition-all duration-500 cursor-pointer group ${
                selectedMind === 'new' 
                  ? 'sacred-selected-gold ring-4 ring-amber-400/30 scale-105' 
                  : 'hover:scale-102'
              }`}
              hover={true}
              onClick={() => handleMindSelection('new')}
            >
              {/* Light Visual Effects */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-200/10 to-blue-200/10 pointer-events-none" />
              
              <div className="text-center relative z-10">
                <motion.div 
                  className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-2xl group-hover:shadow-3xl"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  animate={selectedMind === 'new' ? { scale: [1, 1.05, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-white text-4xl">✨</span>
                </motion.div>
                
                <h3 className="text-3xl font-serif sacred-text-enhanced mb-6">The Spiritual Mind</h3>
                <p className="sacred-text-body text-lg leading-relaxed mb-6">
                  Rooted in divine love, abundance, and conscious wisdom. Living in the present moment, 
                  guided by inner truth and operating from infinite possibility and sacred purpose.
                </p>
                
                <div className="grid grid-cols-1 gap-3 text-left mb-6">
                  {[
                    '✨ Love-centered decisions',
                    '✨ Conscious, mindful responses',
                    '✨ Divine wisdom guidance',
                    '✨ Abundance and possibility mindset'
                  ].map((trait, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center sacred-text-muted text-base"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.1) }}
                    >
                      {trait}
                    </motion.div>
                  ))}
                </div>

                {selectedMind === 'new' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-white text-lg font-semibold shadow-xl"
                  >
                    <span className="mr-3 text-xl">✓</span>
                    Currently Selected
                  </motion.div>
                )}
              </div>
            </SacredCard>
          </motion.div>
        </motion.div>

        {/* Sacred Discernment Question */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="text-center mb-10"
        >
          <SacredCard variant="enhanced" className="p-8 md:p-10 sacred-breathing">
            <motion.p 
              className="sacred-text-enhanced text-2xl md:text-3xl mb-6 font-serif"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              Which mind do you find yourself operating from most often in daily life?
            </motion.p>
            
            {selectedMind && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sacred-text-body text-lg"
              >
                <p>You've chosen to acknowledge: <strong className="sacred-text-enhanced">
                  {selectedMind === 'old' ? 'The Natural Mind' : 'The Spiritual Mind'}
                </strong></p>
                <p className="text-base mt-2 sacred-text-muted">
                  {selectedMind === 'old' 
                    ? 'Honest recognition is the first step toward transformation.' 
                    : 'Beautiful! Your journey continues from a place of spiritual awareness.'}
                </p>
              </motion.div>
            )}
          </SacredCard>
        </motion.div>

        {/* Sacred Progression */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SacredButton
              onClick={handleNext}
              disabled={!selectedMind}
              variant="primary"
              size="lg"
              className="px-12 py-5 text-xl font-semibold shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {selectedMind ? 'Continue Sacred Journey →' : 'Select Your Current State First'}
            </SacredButton>
          </motion.div>
          
          {selectedMind && (
            <motion.p 
              className="sacred-text-muted text-base mt-6 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              Your spiritual transformation journey will guide you toward living increasingly from the renewed mind
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TwoMindsStep;