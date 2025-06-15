'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const GoalsStep = ({ onNext, onBack, formData, setFormData }) => {
  const [selectedGoals, setSelectedGoals] = useState(formData.goals || []);

  const goalOptions = [
    {
      id: 'reduce_anxiety',
      title: 'Reduce Anxiety & Overthinking',
      description: 'Learn to quiet the analytical mind and find inner peace',
      icon: '🧘‍♀️',
      color: 'sacred-blue'
    },
    {
      id: 'increase_intuition',
      title: 'Strengthen Intuition',
      description: 'Develop trust in your inner wisdom and gut feelings',
      icon: '✨',
      color: 'sacred-purple'
    },
    {
      id: 'emotional_balance',
      title: 'Emotional Balance',
      description: 'Create harmony between thinking and feeling',
      icon: '⚖️',
      color: 'sacred-gold'
    },
    {
      id: 'authentic_self',
      title: 'Connect with Authentic Self',
      description: 'Discover and express your true nature',
      icon: '🌟',
      color: 'sacred-purple'
    },
    {
      id: 'mindful_living',
      title: 'Mindful Daily Living',
      description: 'Bring presence and awareness to everyday activities',
      icon: '🌱',
      color: 'sacred-blue'
    },
    {
      id: 'creative_flow',
      title: 'Creative Expression',
      description: 'Unlock your creative potential and flow states',
      icon: '🎨',
      color: 'sacred-gold'
    }
  ];

  const handleGoalToggle = (goalId) => {
    const newGoals = selectedGoals.includes(goalId)
      ? selectedGoals.filter(id => id !== goalId)
      : [...selectedGoals, goalId];
    
    setSelectedGoals(newGoals);
    setFormData({ ...formData, goals: newGoals });
  };

  const canProceed = selectedGoals.length > 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-sacred-gold-gradient flex items-center justify-center shadow-xl mb-6">
            <div className="text-white text-4xl">🎯</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-sacred-blue-900 mb-4">
            Your Sacred Goals
          </h1>
          <p className="text-sacred-blue-700 text-lg">
            Select the areas where you'd like to experience transformation
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {goalOptions.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index, ease: 'easeOut' }}
              className={`relative cursor-pointer transition-all duration-300 ${
                selectedGoals.includes(goal.id)
                  ? 'transform scale-105'
                  : 'hover:transform hover:scale-102'
              }`}
              onClick={() => handleGoalToggle(goal.id)}
            >
              <div className={`bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${
                selectedGoals.includes(goal.id)
                  ? `border-${goal.color}-600 bg-${goal.color}-50/80`
                  : 'border-sacred-blue-200 hover:border-sacred-blue-300'
              }`}>
                <div className="text-4xl mb-4">{goal.icon}</div>
                <h3 className="text-lg font-serif text-sacred-blue-900 mb-2">
                  {goal.title}
                </h3>
                <p className="text-sacred-blue-700 text-sm">
                  {goal.description}
                </p>
                
                {selectedGoals.includes(goal.id) && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-sacred-blue-600 rounded-full flex items-center justify-center"
                  >
                    <div className="text-white text-sm">✓</div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {selectedGoals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-sacred-blue-700 mb-4">
              You've selected {selectedGoals.length} goal{selectedGoals.length !== 1 ? 's' : ''} for your journey
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GoalsStep;