'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const PathSelectionStep = ({ onNext, onboardingData = {}, data = {} }) => {
  // Use onboardingData if available, fallback to data prop, then to empty string
  const safeData = onboardingData || data || {};
  const [selectedPath, setSelectedPath] = useState(safeData.selectedPath || '');

  const paths = [
    {
      id: 'gentle',
      title: 'The Gentle Path',
      subtitle: 'Gradual transformation through daily practices',
      icon: '🌱',
      description:
        'Perfect for those who prefer steady, sustainable growth. This path focuses on building small, consistent habits that compound over time.',
      features: [
        'Daily 5-10 minute practices',
        'Gentle guided meditations',
        'Gradual mindset shifts',
        'Sustainable lifestyle changes',
        'Self-compassion focus',
      ],
      color: 'sacred-gold',
    },
    {
      id: 'balanced',
      title: 'The Balanced Path',
      subtitle: 'Structured approach with flexibility',
      icon: '⚖️',
      description:
        'A harmonious blend of structure and adaptability. This path provides clear guidance while allowing you to customize your journey.',
      features: [
        'Weekly structured sessions',
        'Flexible practice schedule',
        'Balanced inner and outer work',
        'Community support',
        'Progress tracking',
      ],
      color: 'sacred-blue',
    },
    {
      id: 'intensive',
      title: 'The Intensive Path',
      subtitle: 'Deep transformation through immersion',
      icon: '🔥',
      description:
        'For those ready for profound change. This path involves deeper practices and more significant lifestyle shifts.',
      features: [
        'Daily intensive practices',
        'Deep shadow work',
        'Lifestyle transformation',
        'Advanced techniques',
        'Accelerated growth',
      ],
      color: 'sacred-purple',
    },
  ];

  const handlePathSelect = (pathId) => {
    setSelectedPath(pathId);
  };

  const handleNext = () => {
    onNext({ selectedPath });
  };

  const getColorClasses = (color, isSelected) => {
    const baseClasses = {
      'sacred-gold': {
        ring: isSelected ? 'ring-2 ring-sacred-gold-400' : '',
        bg: isSelected ? 'bg-sacred-gold-50' : '',
        icon: 'bg-sacred-gold-gradient',
        accent: 'text-sacred-gold-600',
      },
      'sacred-blue': {
        ring: isSelected ? 'ring-2 ring-sacred-blue-400' : '',
        bg: isSelected ? 'bg-sacred-blue-50' : '',
        icon: 'bg-sacred-gradient',
        accent: 'text-sacred-blue-600',
      },
      'sacred-purple': {
        ring: isSelected ? 'ring-2 ring-sacred-purple-400' : '',
        bg: isSelected ? 'bg-sacred-purple-50' : '',
        icon: 'bg-sacred-purple-gradient',
        accent: 'text-sacred-purple-600',
      },
    };
    return baseClasses[color];
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
              Choose Your Sacred{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">Path</span>
            </h2>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-sacred-blue-600">
              Every journey is unique. Select the path that resonates with your current life
              situation and desired pace of transformation.
            </p>
          </SacredCard>
        </motion.div>

        {/* Path Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-10 grid gap-6 lg:grid-cols-3"
        >
          {paths.map((path, index) => {
            const isSelected = selectedPath === path.id;
            const colorClasses = getColorClasses(path.color, isSelected);

            return (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <SacredCard
                  variant="glass"
                  className={`h-full p-8 transition-all duration-300 ${colorClasses.ring} ${colorClasses.bg}`}
                  hover={true}
                  onClick={() => handlePathSelect(path.id)}
                >
                  <div className="text-center">
                    {/* Icon */}
                    <div
                      className={`mx-auto mb-6 h-16 w-16 rounded-full ${colorClasses.icon} flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl text-white">{path.icon}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 font-serif text-2xl text-sacred-blue-900">{path.title}</h3>

                    {/* Subtitle */}
                    <p className={`mb-4 font-medium ${colorClasses.accent}`}>{path.subtitle}</p>

                    {/* Description */}
                    <p className="mb-6 text-sm leading-relaxed text-sacred-blue-600">
                      {path.description}
                    </p>

                    {/* Features */}
                    <ul className="mb-6 space-y-2 text-left">
                      {path.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center text-sm text-sacred-blue-700"
                        >
                          <div
                            className={`h-2 w-2 rounded-full ${colorClasses.icon} mr-3 flex-shrink-0`}
                          ></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-4">
                        <div
                          className={`inline-flex items-center rounded-full px-4 py-2 ${colorClasses.icon} text-sm font-medium text-white`}
                        >
                          <span className="mr-2">✓</span>
                          Selected
                        </div>
                      </motion.div>
                    )}
                  </div>
                </SacredCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Path Description */}
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <SacredCard variant="glass" className="p-6">
              <h4 className="mb-3 font-serif text-lg text-sacred-blue-900">
                You've chosen: {paths.find((p) => p.id === selectedPath)?.title}
              </h4>
              <p className="text-sacred-blue-600">
                This path will be customized based on your intentions and assessment responses. You
                can always adjust your approach as you progress on your journey.
              </p>
            </SacredCard>
          </motion.div>
        )}

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredButton
            onClick={handleNext}
            disabled={!selectedPath}
            variant="primary"
            size="lg"
            className="px-8"
          >
            Continue to Intentions →
          </SacredButton>
        </motion.div>
      </div>
    </div>
  );
};

export default PathSelectionStep;
