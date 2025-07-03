'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const IntentionsStep = ({ onNext, onboardingData = {}, data = {} }) => {
  // Use onboardingData if available, fallback to data prop, then to empty array
  const safeData = onboardingData || data || {};
  const [intentions, setIntentions] = useState(safeData.intentions || []);
  const [customIntention, setCustomIntention] = useState('');

  const predefinedIntentions = [
    { id: 'peace', label: 'Find inner peace and calm', icon: '🕊️' },
    { id: 'purpose', label: 'Discover my life purpose', icon: '🎯' },
    { id: 'relationships', label: 'Improve my relationships', icon: '💝' },
    { id: 'confidence', label: 'Build self-confidence', icon: '💪' },
    { id: 'mindfulness', label: 'Develop mindfulness practice', icon: '🧘' },
    { id: 'creativity', label: 'Unlock my creativity', icon: '🎨' },
    { id: 'health', label: 'Improve physical and mental health', icon: '🌱' },
    { id: 'abundance', label: 'Cultivate abundance mindset', icon: '✨' },
    { id: 'forgiveness', label: 'Practice forgiveness', icon: '🤲' },
    { id: 'gratitude', label: 'Develop gratitude practice', icon: '🙏' },
  ];

  const toggleIntention = (intentionId) => {
    setIntentions((prev) =>
      prev.includes(intentionId) ? prev.filter((id) => id !== intentionId) : [...prev, intentionId]
    );
  };

  const addCustomIntention = () => {
    if (customIntention.trim() && !intentions.includes(customIntention.trim())) {
      setIntentions((prev) => [...prev, customIntention.trim()]);
      setCustomIntention('');
    }
  };

  const removeCustomIntention = (intention) => {
    setIntentions((prev) => prev.filter((i) => i !== intention));
  };

  const handleNext = () => {
    onNext({ intentions });
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
              Set Your Sacred{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">Intentions</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-sacred-blue-600">
              Intentions are the compass for your journey. Choose what resonates with your heart and
              guides your transformation.
            </p>
          </SacredCard>
        </motion.div>

        {/* Predefined Intentions Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-6 text-center font-serif text-xl text-sacred-blue-900">
              Choose Your Intentions
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {predefinedIntentions.map((intention, index) => (
                <motion.div
                  key={intention.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`
                    cursor-pointer rounded-xl border-2 p-4 shadow-sm transition-all duration-300
                    ${
                      intentions.includes(intention.id)
                        ? 'border-sacred-gold-400 bg-sacred-gold-50'
                        : 'border-gray-200 bg-white/50 hover:border-sacred-gold-200 hover:bg-white/80 hover:shadow-md'
                    }
                  `}
                  onClick={() => toggleIntention(intention.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{intention.icon}</span>
                    <span className="flex-1 font-medium text-sacred-blue-700">
                      {intention.label}
                    </span>
                    {intentions.includes(intention.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex h-5 w-5 items-center justify-center rounded-full bg-sacred-gold-400"
                      >
                        <span className="text-xs text-white">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </SacredCard>
        </motion.div>

        {/* Custom Intention Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <SacredCard variant="glass" className="p-6">
            <h3 className="mb-4 font-serif text-xl text-sacred-blue-900">Add Your Own Intention</h3>
            <div className="flex space-x-3">
              <input
                type="text"
                value={customIntention}
                onChange={(e) => setCustomIntention(e.target.value)}
                placeholder="Write your personal intention..."
                className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus:border-sacred-blue-400 focus:outline-none"
                onKeyPress={(e) => e.key === 'Enter' && addCustomIntention()}
              />
              <SacredButton
                onClick={addCustomIntention}
                disabled={!customIntention.trim()}
                variant="primary"
                size="md"
              >
                Add
              </SacredButton>
            </div>
          </SacredCard>
        </motion.div>

        {/* Selected Custom Intentions */}
        {intentions.some((i) => !predefinedIntentions.find((p) => p.id === i)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <SacredCard variant="glass" className="p-6">
              <h4 className="mb-4 font-serif text-lg text-sacred-blue-900">
                Your Personal Intentions:
              </h4>
              <div className="flex flex-wrap gap-3">
                {intentions
                  .filter((i) => !predefinedIntentions.find((p) => p.id === i))
                  .map((intention, index) => (
                    <motion.div
                      key={intention}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-2 rounded-full bg-sacred-purple-100 px-4 py-2 text-sacred-purple-700"
                    >
                      <span>{intention}</span>
                      <button
                        onClick={() => removeCustomIntention(intention)}
                        className="text-sacred-purple-500 hover:text-sacred-purple-700"
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
              </div>
            </SacredCard>
          </motion.div>
        )}

        {/* Selected Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-8 text-center"
        >
          <SacredCard variant="glass" className="p-4">
            <p className="text-sm text-sacred-blue-600">
              {intentions.length} intention{intentions.length !== 1 ? 's' : ''} selected
            </p>
          </SacredCard>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <SacredButton
            onClick={handleNext}
            disabled={intentions.length === 0}
            variant="primary"
            size="lg"
            className="px-8"
          >
            Complete Sacred Journey Setup →
          </SacredButton>
        </motion.div>
      </div>
    </div>
  );
};

export default IntentionsStep;
