'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiHeart, FiEye } from 'react-icons/fi';
import GlassCard from './GlassCard';

const INTENTION_PROMPTS = {
  natural: {
    title: 'From Judgment to Love',
    subtitle: 'Your assessment reveals a primary pattern of the Natural Mind',
    description: 'You often find yourself caught in cycles of judgment, control, and separation. This is not wrong—it\'s simply where you are now. The journey ahead will gently guide you toward the peace of the Spiritual Mind.',
    icon: FiEye,
    color: 'from-orange-500 to-red-500',
    prompts: [
      'What would it feel like to release the need to control outcomes?',
      'How might your relationships change if you stopped judging others?',
      'What would peace look like in your daily life?'
    ]
  },
  spiritual: {
    title: 'Deepening Your Connection',
    subtitle: 'Your assessment reveals a primary pattern of the Spiritual Mind',
    description: 'You already operate from love and acceptance much of the time. This journey will help you deepen this connection and maintain it even in challenging moments.',
    icon: FiHeart,
    color: 'from-indigo-500 to-amber-500',
    prompts: [
      'How can you maintain your spiritual center during difficult times?',
      'What would it look like to trust even more deeply?',
      'How might you share this peace with others?'
    ]
  }
};

export default function IntentionSetting({ onNext, onPrev, onDataUpdate, data }) {
  const [intention, setIntention] = useState(data.intention || '');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [isWriting, setIsWriting] = useState(false);

  const currentMind = data.currentMind || 'natural';
  const mindData = INTENTION_PROMPTS[currentMind];
  const Icon = mindData.icon;

  const handlePromptSelect = (prompt) => {
    setSelectedPrompt(prompt);
    setIsWriting(true);
    if (!intention) {
      setIntention(`Reflecting on: ${prompt}\n\n`);
    }
  };

  const handleIntentionChange = (e) => {
    setIntention(e.target.value);
  };

  const handleNext = () => {
    if (intention.trim()) {
      onDataUpdate({ intention: intention.trim() });
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${mindData.color} flex items-center justify-center shadow-2xl`}>
                <Icon className="w-12 h-12 text-white" />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-gray-100 mb-2"
            >
              {mindData.title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-indigo-600 dark:text-indigo-400 mb-4"
            >
              {mindData.subtitle}
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed"
            >
              {mindData.description}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-6">
                Sacred Reflection Prompts
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Choose a prompt that resonates with you, or write your own intention.
              </p>
              
              <div className="space-y-3">
                {mindData.prompts.map((prompt, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    onClick={() => handlePromptSelect(prompt)}
                    className={`w-full p-4 text-left rounded-lg transition-all duration-300 border-2 ${
                      selectedPrompt === prompt
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-transparent bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10'
                    }`}
                  >
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {prompt}
                    </p>
                  </motion.button>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100 mb-6">
                Your Sacred Intention
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                Write from your heart. What do you truly desire from this journey?
              </p>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <textarea
                  value={intention}
                  onChange={handleIntentionChange}
                  onFocus={() => setIsWriting(true)}
                  placeholder="I set the intention to..."
                  className="w-full h-64 p-4 bg-white/50 dark:bg-white/5 border-2 border-transparent focus:border-indigo-500 rounded-lg resize-none text-gray-700 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-300 focus:outline-none"
                />
                
                {isWriting && intention.length > 10 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg"
                  >
                    <p className="text-green-700 dark:text-green-300 text-sm">
                      ✨ Beautiful. Your intention is being held in sacred space.
                    </p>
                  </motion.div>
                )}
              </motion.div>
            </GlassCard>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-between items-center mt-8"
          >
            <button
              onClick={onPrev}
              className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
            >
              <FiArrowLeft />
              Back
            </button>
            
            <button
              onClick={handleNext}
              disabled={!intention.trim()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                intention.trim()
                  ? 'bg-gradient-to-r from-indigo-500 to-amber-500 text-white hover:shadow-lg hover:scale-105'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Continue Journey
              <FiArrowRight />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}