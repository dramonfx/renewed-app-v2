'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

const IntentionsStep = ({ onNext, onBack }) => {
  const [intentions, setIntentions] = useState({
    primaryIntention: '',
    dailyCommitment: '',
    transformationGoal: ''
  });

  const handleInputChange = (field, value) => {
    setIntentions(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    // Store intentions
    localStorage.setItem('renewedIntentions', JSON.stringify(intentions));
    onNext();
  };

  const isFormValid = intentions.primaryIntention.trim() && 
                     intentions.dailyCommitment.trim() && 
                     intentions.transformationGoal.trim();

  const intentionPrompts = [
    {
      field: 'primaryIntention',
      label: 'Primary Sacred Intention',
      placeholder: 'What is your deepest desire for this spiritual journey?',
      guidance: 'Express your heart\'s truest longing for transformation and growth'
    },
    {
      field: 'dailyCommitment',
      label: 'Daily Sacred Commitment',
      placeholder: 'How will you honor this journey each day?',
      guidance: 'Describe the daily practices you\'re willing to embrace'
    },
    {
      field: 'transformationGoal',
      label: 'Vision of Transformation',
      placeholder: 'Who do you aspire to become through this journey?',
      guidance: 'Paint a picture of your renewed spiritual self'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            {/* Sacred Ceremony Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif sacred-text-enhanced mb-6">
                Sacred Intention Ceremony
              </h1>
              <p className="sacred-text-body text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                In this sacred moment, you will declare your intentions and commit your heart 
                to the transformative journey ahead. These words will guide and anchor your path.
              </p>
            </motion.div>

            {/* Ceremonial Light Elements */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex justify-center mb-8"
            >
              <div className="flex space-x-6">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-8 bg-gradient-to-t from-amber-400 to-amber-200 rounded-full"
                    animate={{
                      scaleY: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Sacred Intentions Form */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="space-y-8 mb-12"
            >
              {intentionPrompts.map((prompt, index) => (
                <motion.div
                  key={prompt.field}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + (index * 0.2) }}
                >
                  <SacredCard variant="glass" className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-serif sacred-text-enhanced mb-2">
                          {prompt.label}
                        </h3>
                        <p className="sacred-text-muted text-sm mb-4">
                          {prompt.guidance}
                        </p>
                      </div>
                      
                      <SacredInput
                        value={intentions[prompt.field]}
                        onChange={(e) => handleInputChange(prompt.field, e.target.value)}
                        placeholder={prompt.placeholder}
                        className="min-h-[80px] resize-none"
                        multiline
                      />
                    </div>
                  </SacredCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Sacred Affirmation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="mb-8"
            >
              <SacredCard variant="enhanced" className="p-6 text-center">
                <p className="sacred-text-body text-base leading-relaxed italic">
                  "I commit to this sacred journey with an open heart and willing spirit. 
                  I trust in the divine process of transformation and welcome the growth 
                  that awaits me. May these intentions guide my steps and strengthen my resolve."
                </p>
              </SacredCard>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
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
                disabled={!isFormValid}
                className="px-12 py-3 text-lg font-semibold"
              >
                Seal Sacred Intentions ✨
              </SacredButton>
            </motion.div>

            {!isFormValid && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.8 }}
                className="sacred-text-muted text-sm mt-4 text-center"
              >
                Please complete all intention fields to continue
              </motion.p>
            )}
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default IntentionsStep;