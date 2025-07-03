'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';

const mindsetData = {
  Natural: {
    title: 'Natural Mind',
    description:
      'Grounded in earthly thoughts and daily experiences. Present moment awareness without spiritual overlay.',
    guidance:
      'Focus on practical insights, life lessons, and authentic reactions to your experiences.',
    icon: '🌱',
    color: 'from-emerald-500 to-green-600',
    bgGradient: 'from-emerald-50 to-green-50',
    borderColor: 'border-emerald-200',
    prompts: [
      'What did I learn about myself today?',
      'How did I respond to challenges?',
      'What patterns do I notice in my behavior?',
    ],
  },
  Transition: {
    title: 'In Transition',
    description:
      'Between states of being. Questioning, exploring, and discovering new perspectives on life.',
    guidance: 'Embrace uncertainty and explore the questions arising in your consciousness.',
    icon: '🌊',
    color: 'from-blue-500 to-cyan-600',
    bgGradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-blue-200',
    prompts: [
      'What questions am I holding right now?',
      'How are my perspectives shifting?',
      'What feels like it wants to emerge?',
    ],
  },
  Spiritual: {
    title: 'Spiritual Mind',
    description:
      'Connected to deeper meaning and purpose. Aware of the sacred dimension of experience.',
    guidance: 'Reflect on connection, purpose, and the deeper currents moving through your life.',
    icon: '✨',
    color: 'from-purple-500 to-indigo-600',
    bgGradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-purple-200',
    prompts: [
      'How did I sense the sacred today?',
      'What feels divinely guided in my life?',
      'How am I being called to serve or grow?',
    ],
  },
};

export default function MindsetDiscernmentCards({
  selectedMindset,
  onMindsetSelect,
  onPromptsUpdate,
}) {
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardClick = (mindset) => {
    if (selectedMindset === mindset) {
      // If already selected, expand/collapse
      setExpandedCard(expandedCard === mindset ? null : mindset);
    } else {
      // Select new mindset
      onMindsetSelect(mindset);
      setExpandedCard(mindset);

      // Update prompts in parent
      if (onPromptsUpdate) {
        onPromptsUpdate(mindsetData[mindset].prompts);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="mb-6 text-center">
        <h3 className="text-sacred-dark mb-2 text-xl font-semibold">Mindset Discernment</h3>
        <p className="text-sacred-medium text-sm">
          Which consciousness are you writing from today?
        </p>
      </div>

      {Object.entries(mindsetData).map(([key, data]) => {
        const isSelected = selectedMindset === key;
        const isExpanded = expandedCard === key;

        return (
          <motion.div key={key} layout className="relative">
            <SacredCard
              variant="glass"
              hover={true}
              onClick={() => handleCardClick(key)}
              className={`p-4 transition-all duration-300 ${
                isSelected
                  ? `bg-gradient-to-br ring-2 ring-blue-400 ${data.bgGradient} border ${data.borderColor}`
                  : 'hover:shadow-lg'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${data.color} flex items-center justify-center text-xl text-white shadow-lg`}
                >
                  {data.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sacred-dark text-sm font-semibold">{data.title}</h4>
                  <p className="text-sacred-medium mt-1 line-clamp-2 text-xs">{data.description}</p>
                </div>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500"
                  >
                    <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 overflow-hidden border-t border-gray-200 pt-4"
                  >
                    <div className="space-y-3">
                      <div>
                        <h5 className="text-sacred-dark mb-1 text-xs font-semibold">Guidance</h5>
                        <p className="text-sacred-medium text-xs">{data.guidance}</p>
                      </div>

                      <div>
                        <h5 className="text-sacred-dark mb-2 text-xs font-semibold">
                          Reflection Prompts
                        </h5>
                        <div className="space-y-1">
                          {data.prompts.map((prompt, index) => (
                            <div
                              key={index}
                              className="text-sacred-medium flex items-start space-x-2 text-xs"
                            >
                              <span className="mt-0.5 text-blue-400">•</span>
                              <span>{prompt}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </SacredCard>
          </motion.div>
        );
      })}

      {selectedMindset && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4"
        >
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-400"></div>
            <p className="text-xs font-medium text-blue-700">
              Writing from {mindsetData[selectedMindset].title} consciousness
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
