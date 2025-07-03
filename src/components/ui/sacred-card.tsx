'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import type { SacredCardProps, CardVariant } from './types';

const SacredCard = forwardRef<HTMLDivElement, SacredCardProps>(
  ({ children, variant = 'glass', className = '', onClick, hover = true, ...props }, ref) => {
    const baseClasses = 'relative overflow-hidden';

    const variantClasses: Record<CardVariant, string> = {
      glass: 'sacred-glass',
      heavy: 'sacred-glass-heavy',
      solid: 'bg-white border border-sacred-blue-100 rounded-2xl shadow-xl',
    };

    const hoverClasses = hover && onClick ? 'cursor-pointer' : '';

    const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;

    const cardContent = (
      <div className={combinedClasses} onClick={onClick} {...props} ref={ref}>
        {variant === 'glass' && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        )}
        <div className="relative z-10">{children}</div>
      </div>
    );

    if (hover && onClick) {
      return (
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          {cardContent}
        </motion.div>
      );
    }

    return cardContent;
  }
);

SacredCard.displayName = 'SacredCard';

export default SacredCard;
