
'use client';

import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpiritualJourney } from '@/contexts/SpiritualJourneyContext';

interface FeatureGateProps {
  featureKey: string;
  children: ReactNode;
  fallback?: ReactNode;
  showHint?: boolean;
  className?: string;
}

interface SacredHintProps {
  featureKey: string;
  milestone?: string;
  className?: string;
}

// Sacred hint component for locked features
export const SacredHint: React.FC<SacredHintProps> = ({ 
  featureKey, 
  milestone,
  className = ""
}) => {
  const { features, getNextMilestone, milestones } = useSpiritualJourney();
  
  const feature = features.find(f => f.key === featureKey);
  const nextMilestone = getNextMilestone();
  const relevantMilestone = milestone 
    ? milestones.find(m => m.id === milestone)
    : milestones.find(m => m.unlocks.includes(featureKey));

  if (!feature || !relevantMilestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className={`group relative overflow-hidden rounded-xl border-2 border-dashed border-sacred-gold-300 bg-gradient-to-br from-sacred-gold-50 to-sacred-blue-50 p-6 transition-all duration-300 hover:border-sacred-gold-400 hover:shadow-lg ${className}`}
    >
      {/* Sacred background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full bg-gradient-to-br from-sacred-gold-200 via-transparent to-sacred-blue-200"></div>
      </div>
      
      {/* Pulsing sacred glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-xl bg-sacred-gold-200 opacity-20"
      />
      
      <div className="relative">
        <div className="text-center">
          {/* Feature icon with gentle pulse */}
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
          >
            <span className="text-2xl text-white">{feature.icon}</span>
          </motion.div>
          
          {/* Sacred message */}
          <h3 className="mb-2 font-serif text-lg text-sacred-blue-900 group-hover:text-sacred-blue-800">
            {feature.title}
          </h3>
          
          <p className="mb-4 text-sm text-sacred-blue-600 leading-relaxed">
            {feature.description}
          </p>
          
          {/* Gentle guidance */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-lg bg-white/60 p-4 backdrop-blur-sm"
          >
            <p className="text-xs text-sacred-blue-700 italic mb-2">
              🌸 There&apos;s something beautiful waiting here...
            </p>
            
            {relevantMilestone && (
              <div className="text-center">
                <p className="text-sm font-medium text-sacred-blue-800 mb-1">
                  {relevantMilestone.title}
                </p>
                <p className="text-xs text-sacred-blue-600">
                  {relevantMilestone.description}
                </p>
                
                {/* Progress hint */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                  className="mt-3 h-1 bg-sacred-blue-100 rounded-full overflow-hidden"
                >
                  <div className="h-full w-0 bg-sacred-gradient rounded-full animate-pulse"></div>
                </motion.div>
                
                <p className="mt-2 text-xs text-sacred-blue-500">
                  Continue your sacred journey to unlock this gift
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Main feature gate component
export const FeatureGate: React.FC<FeatureGateProps> = ({ 
  featureKey, 
  children, 
  fallback,
  showHint = true,
  className = ""
}) => {
  const { isFeatureUnlocked, isSimplicityMode } = useSpiritualJourney();
  
  // If simplicity mode is off, show everything
  if (!isSimplicityMode) {
    return <>{children}</>;
  }
  
  // If feature is unlocked, show children
  if (isFeatureUnlocked(featureKey)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }
  
  // Feature is locked - show fallback or hint
  return (
    <div className={className}>
      {fallback ? (
        fallback
      ) : showHint ? (
        <SacredHint featureKey={featureKey} />
      ) : null}
    </div>
  );
};

// Higher-order component for feature-gated pages
interface FeaturePageGateProps {
  featureKey: string;
  children: ReactNode;
  redirectTo?: string;
}

export const FeaturePageGate: React.FC<FeaturePageGateProps> = ({
  featureKey,
  children,
  redirectTo = '/dashboard'
}) => {
  const { isFeatureUnlocked, isSimplicityMode } = useSpiritualJourney();
  
  // If simplicity mode is off, show everything
  if (!isSimplicityMode) {
    return <>{children}</>;
  }
  
  // If feature is unlocked, show children
  if (isFeatureUnlocked(featureKey)) {
    return <>{children}</>;
  }
  
  // Feature is locked - show sacred redirection message
  return (
    <div className="min-h-screen bg-sacred-journey-gradient flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-md text-center"
      >
        <SacredHint 
          featureKey={featureKey} 
          className="max-w-sm mx-auto"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <motion.a
            href={redirectTo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center space-x-2 rounded-xl bg-sacred-gradient px-6 py-3 text-white font-medium shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <span>🏛️</span>
            <span>Return to Sacred Sanctuary</span>
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Conditional navigation item component
interface SacredNavItemGateProps {
  featureKey: string;
  children: ReactNode;
  showLocked?: boolean;
}

export const SacredNavItemGate: React.FC<SacredNavItemGateProps> = ({
  featureKey,
  children,
  showLocked = false
}) => {
  const { isFeatureUnlocked, isSimplicityMode, features } = useSpiritualJourney();
  
  // If simplicity mode is off, show everything
  if (!isSimplicityMode) {
    return <>{children}</>;
  }
  
  // If feature is unlocked, show children
  if (isFeatureUnlocked(featureKey)) {
    return <>{children}</>;
  }
  
  // Feature is locked
  if (!showLocked) {
    return null;
  }
  
  // Show locked state with gentle pulse
  const feature = features.find(f => f.key === featureKey);
  
  return (
    <motion.div
      initial={{ opacity: 0.6 }}
      animate={{ 
        opacity: [0.6, 0.8, 0.6]
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="relative"
    >
      <div className="pointer-events-none opacity-60 filter grayscale">
        {children}
      </div>
      
      {/* Sacred lock overlay */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-sacred-gold-200 shadow-sm"
      >
        <span className="text-xs text-sacred-blue-800">🔒</span>
      </motion.div>
      
      {/* Tooltip */}
      <div className="absolute top-full left-0 mt-2 hidden group-hover:block z-10">
        <div className="bg-sacred-blue-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          {feature?.title} - Continue your journey to unlock
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureGate;

