
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
    { id: 'gratitude', label: 'Develop gratitude practice', icon: '🙏' }
  ];

  const toggleIntention = (intentionId) => {
    setIntentions(prev => 
      prev.includes(intentionId)
        ? prev.filter(id => id !== intentionId)
        : [...prev, intentionId]
    );
  };

  const addCustomIntention = () => {
    if (customIntention.trim() && !intentions.includes(customIntention.trim())) {
      setIntentions(prev => [...prev, customIntention.trim()]);
      setCustomIntention('');
    }
  };

  const removeCustomIntention = (intention) => {
    setIntentions(prev => prev.filter(i => i !== intention));
  };

  const handleNext = () => {
    onNext({ intentions });
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
              Set Your Sacred{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">
                Intentions
              </span>
            </h2>
            <p className="text-sacred-blue-600 text-lg leading-relaxed max-w-2xl mx-auto">
              Intentions are the compass for your journey. Choose what resonates with your heart and guides your transformation.
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
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-6 text-center">
              Choose Your Intentions
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {predefinedIntentions.map((intention, index) => (
                <motion.div
                  key={intention.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`
                    p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 shadow-sm
                    ${intentions.includes(intention.id)
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
                    <span className="text-sacred-blue-700 font-medium flex-1">
                      {intention.label}
                    </span>
                    {intentions.includes(intention.id) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-5 h-5 rounded-full bg-sacred-gold-400 flex items-center justify-center"
                      >
                        <span className="text-white text-xs">✓</span>
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
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-4">
              Add Your Own Intention
            </h3>
            <div className="flex space-x-3">
              <input
                type="text"
                value={customIntention}
                onChange={(e) => setCustomIntention(e.target.value)}
                placeholder="Write your personal intention..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-sacred-blue-400 focus:outline-none bg-white shadow-sm"
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
        {intentions.some(i => !predefinedIntentions.find(p => p.id === i)) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <SacredCard variant="glass" className="p-6">
              <h4 className="text-lg font-serif text-sacred-blue-900 mb-4">Your Personal Intentions:</h4>
              <div className="flex flex-wrap gap-3">
                {intentions
                  .filter(i => !predefinedIntentions.find(p => p.id === i))
                  .map((intention, index) => (
                    <motion.div
                      key={intention}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-sacred-purple-100 text-sacred-purple-700 px-4 py-2 rounded-full flex items-center space-x-2"
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
          className="text-center mb-8"
        >
          <SacredCard variant="glass" className="p-4">
            <p className="text-sacred-blue-600 text-sm">
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
