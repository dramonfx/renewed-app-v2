'use client';

import { motion } from 'framer-motion';
import { forwardRef, useEffect, useState } from 'react';
import type { SacredCardProps, CardVariant } from './types';

const SacredCard = forwardRef<HTMLDivElement, SacredCardProps>(({ 
  children, 
  variant = 'glass', 
  className = '', 
  onClick,
  hover = true,
  ...props 
}, ref) => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);
  
  // Generate floating particles for atmospheric effect
  useEffect(() => {
    if (variant === 'glass' || variant === 'enhanced') {
      const particleCount = Math.floor(Math.random() * 3) + 2; // 2-4 particles
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 8
      }));
      setParticles(newParticles);
    }
  }, [variant]);

  const baseClasses = "relative overflow-hidden";
  
  const variantClasses: Record<CardVariant, string> = {
    glass: "sacred-glass",
    enhanced: "sacred-glass-enhanced", 
    heavy: "sacred-glass-heavy",
    solid: "bg-white border border-sacred-blue-100 rounded-2xl shadow-xl"
  };
  
  const hoverClasses = hover && onClick ? "cursor-pointer" : "";
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

  const cardContent = (
    <div className={combinedClasses} onClick={onClick} {...props} ref={ref}>
      {/* Sacred Gradient Overlay for Atmospheric Depth */}
      {(variant === 'glass' || variant === 'enhanced') && (
        <div className="sacred-gradient-overlay" />
      )}
      
      {/* Enhanced Gradient Effect for all glass variants */}
      {(variant === 'glass' || variant === 'enhanced' || variant === 'heavy') && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/8 to-transparent pointer-events-none" />
      )}

      {/* Floating Sacred Particles */}
      {(variant === 'glass' || variant === 'enhanced') && particles.map((particle) => (
        <div
          key={particle.id}
          className="sacred-floating-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`
          }}
        />
      ))}

      {/* Sacred Light Rays for enhanced spiritual atmosphere */}
      {variant === 'enhanced' && (
        <>
          <div 
            className="sacred-light-ray" 
            style={{ 
              left: '20%', 
              top: '-50px',
              animationDelay: '1s' 
            }} 
          />
          <div 
            className="sacred-light-ray" 
            style={{ 
              right: '30%', 
              top: '-50px',
              animationDelay: '3s' 
            }} 
          />
        </>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

  if (hover && onClick) {
    return (
      <motion.div
        whileHover={{ 
          scale: variant === 'heavy' ? 1.01 : 1.02,
          y: variant === 'heavy' ? -3 : -2
        }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.3, 
          ease: 'easeOut'
        }}
      >
        {cardContent}
      </motion.div>
    );
  }

  // Add breathing animation for non-interactive cards
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={variant !== 'solid' ? 'sacred-breathing' : ''}
    >
      {cardContent}
    </motion.div>
  );
});

SacredCard.displayName = 'SacredCard';

export default SacredCard;