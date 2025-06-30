
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '../../utils';
import type { SacredButtonProps, ButtonVariant, ButtonSize } from './types';

const SacredButton = forwardRef<HTMLButtonElement, SacredButtonProps>(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}, ref) => {
  const baseClasses = "font-semibold transition-all duration-300 cursor-pointer inline-flex items-center justify-center";
  
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "sacred-button",
    gold: "sacred-gold-button",
    ghost: "bg-transparent text-sacred-blue-600 hover:bg-sacred-blue-50 border-2 border-sacred-blue-200 hover:border-sacred-blue-300"
  };
  
  const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-sm rounded-xl",
    lg: "px-8 py-4 text-base rounded-xl"
  };

  const combinedClasses = cn(baseClasses, variantClasses[variant], sizeClasses[size], className);

  // Extract conflicting props and only pass safe ones
  const safeProps = { ...props };

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={combinedClasses}
      whileHover={!disabled && !loading ? { y: -2 } : {}}
      whileTap={!disabled && !loading ? { y: 0 } : {}}
      {...safeProps}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </motion.button>
  );
});

SacredButton.displayName = 'SacredButton';

export default SacredButton;
