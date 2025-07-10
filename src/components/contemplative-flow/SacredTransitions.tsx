
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SacredTransitionProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  variant?: 'gentle' | 'peaceful' | 'divine' | 'serene';
  className?: string;
}

// Contemplative animation variants
const contemplativeVariants = {
  gentle: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.8 }
  },
  peaceful: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: { duration: 1.0 }
  },
  divine: {
    initial: { opacity: 0, y: 30, rotateX: -15 },
    animate: { opacity: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, y: -15, rotateX: 10 },
    transition: { duration: 1.2 }
  },
  serene: {
    initial: { opacity: 0, x: -20, filter: 'blur(4px)' },
    animate: { opacity: 1, x: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, x: 20, filter: 'blur(2px)' },
    transition: { duration: 0.9 }
  }
};

export const SacredTransition: React.FC<SacredTransitionProps> = ({
  children,
  delay = 0,
  duration,
  variant = 'gentle',
  className = ''
}) => {
  const variantConfig = contemplativeVariants[variant];
  const customTransition = duration 
    ? { ...variantConfig.transition, duration } 
    : variantConfig.transition;

  return (
    <motion.div
      initial={variantConfig.initial}
      animate={variantConfig.animate}
      exit={variantConfig.exit}
      transition={{ ...customTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface SacredPageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export const SacredPageTransition: React.FC<SacredPageTransitionProps> = ({
  children,
  isVisible
}) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: 0.6,
            staggerChildren: 0.1
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SacredStaggerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const SacredStagger: React.FC<SacredStaggerProps> = ({
  children,
  staggerDelay = 0.1,
  className = ''
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.2
          }
        }
      }}
      className={className}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Sacred breathing animation for moments of pause
interface BreathingOrbProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'blue' | 'purple';
  className?: string;
}

export const BreathingOrb: React.FC<BreathingOrbProps> = ({
  size = 'md',
  color = 'gold',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const colorClasses = {
    gold: 'bg-sacred-gold-400',
    blue: 'bg-sacred-blue-400',
    purple: 'bg-purple-400'
  };

  return (
    <motion.div
      className={`rounded-full ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.6, 1, 0.6]
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Sacred loading with contemplative timing
interface SacredLoadingProps {
  message?: string;
  showBreathing?: boolean;
}

export const SacredLoading: React.FC<SacredLoadingProps> = ({
  message = "Sacred moment of preparation...",
  showBreathing = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-6 p-8"
    >
      {showBreathing && (
        <div className="flex space-x-2">
          <BreathingOrb color="gold" />
          <BreathingOrb color="blue" />
          <BreathingOrb color="purple" />
        </div>
      )}
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-sacred-blue-600 text-center italic"
      >
        {message}
      </motion.p>
    </motion.div>
  );
};

export default {
  SacredTransition,
  SacredPageTransition,
  SacredStagger,
  BreathingOrb,
  SacredLoading
};
