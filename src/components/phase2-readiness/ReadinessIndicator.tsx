
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePhase2Readiness } from '@/hooks/useAnalytics';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

interface ReadinessIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export const ReadinessIndicator: React.FC<ReadinessIndicatorProps> = ({
  showDetails = false,
  className = ''
}) => {
  const { checkReadiness, isReadyForCommunity, getReadinessScore } = usePhase2Readiness();
  const [readiness, setReadiness] = useState<any>(null);
  const [showFullReport, setShowFullReport] = useState(false);

  useEffect(() => {
    const metrics = checkReadiness();
    setReadiness(metrics);
  }, [checkReadiness]);

  if (!readiness) {
    return (
      <div className={`animate-pulse ${className}`}>
        <div className="h-16 bg-sacred-blue-100 rounded-lg"></div>
      </div>
    );
  }

  const isReady = isReadyForCommunity();
  const scores = getReadinessScore();

  return (
    <div className={className}>
      <SacredCard variant="glass" className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                ${isReady 
                  ? 'bg-green-500 text-white' 
                  : 'bg-amber-500 text-white'
                }
              `}
            >
              {isReady ? '🌟' : '🌱'}
            </motion.div>
            
            <div>
              <h3 className="font-serif text-lg text-sacred-blue-900">
                Phase 2 Readiness
              </h3>
              <p className="text-sm text-sacred-blue-600">
                {isReady 
                  ? 'Ready for Community Features' 
                  : 'Continue Your Spiritual Journey'
                }
              </p>
            </div>
          </div>
          
          {showDetails && (
            <SacredButton
              variant="ghost"
              size="sm"
              onClick={() => setShowFullReport(!showFullReport)}
            >
              {showFullReport ? 'Hide' : 'Details'}
            </SacredButton>
          )}
        </div>

        {/* Progress Indicators */}
        <div className="space-y-3">
          {Object.entries(scores).map(([key, score]) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-sacred-blue-700 capitalize">{key}</span>
                <span className="text-sacred-blue-800 font-medium">{score}%</span>
              </div>
              <div className="h-2 bg-sacred-blue-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`
                    h-full rounded-full
                    ${score >= 70 
                      ? 'bg-green-500' 
                      : score >= 40 
                        ? 'bg-amber-500' 
                        : 'bg-red-400'
                    }
                  `}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Status Message */}
        <div className="mt-4 p-3 rounded-lg bg-sacred-blue-50 border border-sacred-blue-200">
          <p className="text-sm text-sacred-blue-700">
            {isReady ? (
              <>
                🎉 <strong>Congratulations!</strong> You&apos;re ready for community features. 
                Your spiritual growth and consistent practice have prepared you to connect 
                with and guide fellow seekers.
              </>
            ) : (
              <>
                🌱 <strong>Keep Growing!</strong> Continue your spiritual practices - journal 
                regularly, listen to teachings, and complete milestones to unlock community features.
              </>
            )}
          </p>
        </div>

        {/* Detailed Report */}
        {showFullReport && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 pt-4 border-t border-sacred-blue-200"
          >
            <h4 className="font-medium text-sacred-blue-900 mb-3">
              Spiritual Maturity Assessment
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-sacred-blue-600">Current Stage:</span>
                <p className="font-medium text-sacred-blue-900 capitalize">
                  {readiness.spiritualMaturity}
                </p>
              </div>
              
              <div>
                <span className="text-sacred-blue-600">Community Ready:</span>
                <p className={`font-medium ${isReady ? 'text-green-600' : 'text-amber-600'}`}>
                  {isReady ? 'Yes' : 'Not Yet'}
                </p>
              </div>
              
              <div>
                <span className="text-sacred-blue-600">Social Potential:</span>
                <p className="font-medium text-sacred-blue-900">
                  {readiness.socialInteractionPotential}%
                </p>
              </div>
              
              <div>
                <span className="text-sacred-blue-600">Guidance Ability:</span>
                <p className="font-medium text-sacred-blue-900">
                  {readiness.guidanceCapability}%
                </p>
              </div>
            </div>
            
            <div className="mt-3 text-xs text-sacred-blue-500 italic">
              Phase 2 will introduce community features including sacred circles, 
              guided group meditations, and opportunities to guide newer seekers.
            </div>
          </motion.div>
        )}
      </SacredCard>
    </div>
  );
};

export default ReadinessIndicator;
