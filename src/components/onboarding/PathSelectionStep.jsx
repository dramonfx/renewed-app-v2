'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const PathSelectionStep = ({ onNext, onBack }) => {
  const [selectedPath, setSelectedPath] = useState(null);

  const paths = [
    {
      id: 'foundation',
      name: 'Foundation Builder',
      icon: '🏗️',
      description: 'Perfect for beginners seeking to establish basic spiritual practices and understanding',
      features: [
        'Daily 10-minute guided meditations',
        'Simple prayer and reflection practices',
        'Basic spiritual principles introduction',
        'Gentle transformation pace'
      ],
      gradient: 'from-green-500 to-emerald-600',
      duration: '4-6 weeks',
      commitment: 'Low to Medium'
    },
    {
      id: 'accelerated',
      name: 'Accelerated Growth',
      icon: '🚀',
      description: 'For those ready to dive deep and make significant spiritual breakthroughs quickly',
      features: [
        'Intensive daily spiritual practices',
        'Advanced meditation and prayer',
        'Deep scriptural study',
        'Rapid transformation focus'
      ],
      gradient: 'from-blue-500 to-indigo-600',
      duration: '2-3 weeks',
      commitment: 'High'
    },
    {
      id: 'sustainable',
      name: 'Sustainable Journey',
      icon: '🌱',
      description: 'Balanced approach for lasting change that fits into your busy life',
      features: [
        'Flexible daily practices',
        'Practical life integration',
        'Steady progress tracking',
        'Life-balance focused'
      ],
      gradient: 'from-amber-500 to-orange-600',
      duration: '6-8 weeks',
      commitment: 'Medium'
    }
  ];

  const handleContinue = () => {
    if (selectedPath) {
      localStorage.setItem('renewedSelectedPath', selectedPath);
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
          <SacredCard variant="heavy" className="p-8 md:p-12">
            {/* Sacred Choice Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-serif sacred-text-enhanced mb-6">
                Choose Your Sacred Path
              </h1>
              <p className="sacred-text-body text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                Every spiritual journey is unique. Select the path that resonates with your current 
                life situation and spiritual readiness. You can always adjust as you grow.
              </p>
            </motion.div>

            {/* Divine Pathways */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid lg:grid-cols-3 gap-8 mb-12"
            >
              {paths.map((path, index) => (
                <motion.div
                  key={path.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + (index * 0.2) }}
                  className={`cursor-pointer ${
                    selectedPath === path.id ? 'transform scale-105' : ''
                  }`}
                  onClick={() => setSelectedPath(path.id)}
                >
                  <SacredCard 
                    variant="enhanced" 
                    className={`p-8 h-full transition-all duration-300 ${
                      selectedPath === path.id 
                        ? 'sacred-selected ring-2 ring-blue-500 shadow-2xl' 
                        : 'hover:shadow-xl hover:scale-102'
                    }`}
                  >
                    <div className="text-center">
                      {/* Path Icon */}
                      <motion.div 
                        className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${path.gradient} flex items-center justify-center shadow-xl`}
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                      >
                        <span className="text-white text-4xl">{path.icon}</span>
                      </motion.div>

                      {/* Path Name */}
                      <h3 className="text-2xl font-serif sacred-text-enhanced mb-4">
                        {path.name}
                      </h3>

                      {/* Path Description */}
                      <p className="sacred-text-body text-sm mb-6 leading-relaxed">
                        {path.description}
                      </p>

                      {/* Path Details */}
                      <div className="text-left space-y-3 mb-6">
                        {path.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                            <span className="sacred-text-body text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Path Metadata */}
                      <div className="border-t border-slate-200 pt-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="sacred-text-muted text-sm">Duration:</span>
                          <span className="sacred-text-body text-sm font-medium">{path.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="sacred-text-muted text-sm">Commitment:</span>
                          <span className="sacred-text-body text-sm font-medium">{path.commitment}</span>
                        </div>
                      </div>
                    </div>
                  </SacredCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Sacred Guidance */}
            {selectedPath && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <SacredCard variant="glass" className="p-6">
                  <p className="sacred-text-body text-base leading-relaxed text-center">
                    <span className="font-semibold">
                      {paths.find(p => p.id === selectedPath)?.name}
                    </span>{' '}
                    is an excellent choice! This path will provide you with the perfect balance 
                    of challenge and support for your spiritual growth journey.
                  </p>
                </SacredCard>
              </motion.div>
            )}

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
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
                disabled={!selectedPath}
                className="px-12 py-3 text-lg font-semibold"
              >
                Begin This Sacred Path →
              </SacredButton>
            </motion.div>

            {!selectedPath && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="sacred-text-muted text-sm mt-4 text-center"
              >
                Please select the path that feels right for your journey
              </motion.p>
            )}
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default PathSelectionStep;