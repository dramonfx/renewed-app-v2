
'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children }) => {
  return (
    <a
      href={href}
      className="
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-sacred-gold-500 text-white px-4 py-2 rounded-lg font-medium
        shadow-lg z-50 transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-sacred-gold-300
      "
    >
      {children}
    </a>
  );
};

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center rounded-lg font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: "bg-sacred-gradient text-white hover:shadow-lg focus:ring-sacred-blue-300",
    secondary: "border border-sacred-blue-300 bg-white text-sacred-blue-700 hover:bg-sacred-blue-50 focus:ring-sacred-blue-300",
    ghost: "text-sacred-blue-700 hover:bg-sacred-blue-50 focus:ring-sacred-blue-300"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[36px]",
    md: "px-4 py-2 text-base min-h-[40px]",
    lg: "px-6 py-3 text-lg min-h-[48px]"
  };

  // Filter out Framer Motion conflicting props
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onAnimationIteration,
    onDrag,
    onDragEnd,
    onDragStart,
    onTransitionEnd,
    ...filteredProps 
  } = props;

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...filteredProps}
    >
      {loading ? (
        <>
          <svg
            className="w-4 h-4 mr-2 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
};

interface LiveRegionProps {
  level?: 'polite' | 'assertive' | 'off';
  children: React.ReactNode;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  level = 'polite',
  children,
  className = ''
}) => {
  return (
    <div
      aria-live={level}
      aria-atomic="true"
      className={className}
    >
      {children}
    </div>
  );
};

interface FocusTrapProps {
  children: React.ReactNode;
  disabled?: boolean;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({ children, disabled = false }) => {
  const [trapRef, setTrapRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (disabled || !trapRef) return;

    const focusableElements = trapRef.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    trapRef.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      trapRef.removeEventListener('keydown', handleKeyDown);
    };
  }, [trapRef, disabled]);

  return (
    <div ref={setTrapRef} className="focus-trap">
      {children}
    </div>
  );
};

interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AccessibleModal: React.FC<AccessibleModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md'
}) => {
  const [titleId] = useState(`modal-title-${Math.random().toString(36).substr(2, 9)}`);
  const [descriptionId] = useState(`modal-description-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <FocusTrap disabled={!isOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className={`
            relative w-full mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden
            ${sizeClasses[size]}
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sacred-blue-100">
            <h2 id={titleId} className="text-xl font-serif text-sacred-blue-900">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="
                p-2 text-sacred-blue-400 hover:text-sacred-blue-600 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-sacred-blue-300
                transition-colors duration-200
              "
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          
          {/* Description */}
          {description && (
            <div className="px-6 pt-2">
              <p id={descriptionId} className="text-sm text-sacred-blue-600">
                {description}
              </p>
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </FocusTrap>
    </div>
  );
};

// High contrast mode detection and support
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion detection
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

export default {
  SkipLink,
  AccessibleButton,
  LiveRegion,
  FocusTrap,
  AccessibleModal,
  useHighContrast,
  useReducedMotion
};
