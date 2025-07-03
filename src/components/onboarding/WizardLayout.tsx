'use client';

import React, { ReactNode } from 'react';
import type { JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Home, HelpCircle } from 'lucide-react';
import SacredButton from '@/components/ui/sacred-button';
import { usePerformanceMonitor } from '@/lib/performance';
import { ErrorBoundary } from '@/components/ErrorBoundary';

/**
 * Props for the WizardLayout component
 */
export interface WizardLayoutProps {
  /** Content to render inside the wizard */
  children: ReactNode;
  /** Current step number (0-based) */
  currentStep: number;
  /** Total number of steps in the wizard */
  totalSteps: number;
  /** Name/title of the current step */
  stepName?: string;
  /** Progress percentage (0-100) */
  progress: number;
  /** Handler for going to previous step */
  onPrev?: () => void;
  /** Handler for going to home/canceling wizard */
  onHome?: () => void;
  /** Handler for getting help */
  onHelp?: () => void;
  /** Whether the back button should be shown */
  canGoBack?: boolean;
  /** Whether the wizard is currently transitioning between steps */
  isTransitioning?: boolean;
  /** Whether to show the progress bar */
  showProgress?: boolean;
  /** Custom CSS classes */
  className?: string;
  /** Loading state for the current step */
  isLoading?: boolean;
  /** Error state for the current step */
  error?: string | null;
  /** Optional subtitle for the current step */
  stepSubtitle?: string;
  /** Custom background variant */
  backgroundVariant?: 'light' | 'dark' | 'gradient';
  /** Whether to animate step transitions */
  animateTransitions?: boolean;
}

/**
 * Background variants for different moods
 */
const backgroundVariants = {
  light: {
    containerClass: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50',
    elements: [
      'absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl',
      'absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl',
      'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl',
    ],
  },
  dark: {
    containerClass: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900',
    elements: [
      'absolute top-20 left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl',
      'absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl',
      'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl',
    ],
  },
  gradient: {
    containerClass: 'bg-gradient-to-br from-sacred-blue-50 via-sacred-gold-50 to-sacred-blue-100',
    elements: [
      'absolute top-20 left-20 w-64 h-64 bg-sacred-blue-200/30 rounded-full blur-3xl',
      'absolute bottom-20 right-20 w-80 h-80 bg-sacred-gold-200/20 rounded-full blur-3xl',
      'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sacred-blue-100/40 rounded-full blur-3xl',
    ],
  },
};

/**
 * Animation variants for step transitions
 */
const stepAnimationVariants = {
  enter: {
    opacity: 0,
    y: 20,
    scale: 0.95,
  },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 1.05,
  },
};

/**
 * Progress Bar Component
 */
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  stepName?: string;
  stepSubtitle?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  progress,
  stepName,
  stepSubtitle,
}) => (
  <div className="relative z-20 w-full border-b border-white/50 bg-white/80 py-4 backdrop-blur-sm">
    <div className="mx-auto max-w-4xl px-6">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-slate-600">
            Step {currentStep + 1} of {totalSteps}
          </span>
          {stepName && (
            <span className="mt-1 text-lg font-semibold text-slate-800">{stepName}</span>
          )}
          {stepSubtitle && <span className="mt-1 text-sm text-slate-600">{stepSubtitle}</span>}
        </div>
        <span className="text-sm font-medium text-slate-600">{Math.round(progress)}% Complete</span>
      </div>

      <div className="h-2 w-full rounded-full bg-slate-200">
        <motion.div
          className="h-2 rounded-full bg-gradient-to-r from-sacred-blue-500 to-sacred-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Step indicators */}
      <div className="mt-4 flex justify-between">
        {Array.from({ length: totalSteps }, (_, index) => (
          <div
            key={index}
            className={`h-3 w-3 rounded-full transition-colors duration-300 ${
              index <= currentStep
                ? 'bg-sacred-blue-500'
                : index === currentStep + 1
                  ? 'bg-sacred-blue-300'
                  : 'bg-slate-300'
            }`}
          />
        ))}
      </div>
    </div>
  </div>
);

/**
 * Wizard Layout Component
 *
 * A comprehensive layout component for multi-step wizards/onboarding flows.
 * Enhanced with TypeScript, performance monitoring, error boundaries, and
 * accessibility features.
 */
export default function WizardLayout({
  children,
  currentStep,
  totalSteps,
  stepName,
  progress,
  onPrev,
  onHome,
  onHelp,
  canGoBack = true,
  isTransitioning = false,
  showProgress = true,
  className = '',
  isLoading = false,
  error = null,
  stepSubtitle,
  backgroundVariant = 'light',
  animateTransitions = true,
}: WizardLayoutProps): JSX.Element {
  // Performance monitoring
  usePerformanceMonitor('WizardLayout');

  // Validate props
  React.useEffect(() => {
    if (currentStep < 0 || currentStep >= totalSteps) {
      console.warn(
        `WizardLayout: currentStep (${currentStep}) is out of bounds for totalSteps (${totalSteps})`
      );
    }

    if (progress < 0 || progress > 100) {
      console.warn(`WizardLayout: progress (${progress}) should be between 0 and 100`);
    }
  }, [currentStep, totalSteps, progress]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isTransitioning) return;

      switch (event.key) {
        case 'Escape':
          if (onHome) {
            event.preventDefault();
            onHome();
          }
          break;
        case 'ArrowLeft':
        case 'Backspace':
          if (canGoBack && onPrev && event.ctrlKey) {
            event.preventDefault();
            onPrev();
          }
          break;
        case 'F1':
          if (onHelp) {
            event.preventDefault();
            onHelp();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [canGoBack, onPrev, onHome, onHelp, isTransitioning]);

  const backgroundConfig = backgroundVariants[backgroundVariant];

  return (
    <ErrorBoundary
      onError={(error) => console.error('WizardLayout error:', error)}
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">Unable to load wizard</h2>
            <p className="text-gray-600">Please refresh the page to try again.</p>
          </div>
        </div>
      }
    >
      <div className={`relative min-h-screen overflow-hidden ${className}`}>
        {/* Background */}
        <div className={`absolute inset-0 ${backgroundConfig.containerClass}`}>
          {/* Soft background elements */}
          {backgroundConfig.elements.map((elementClass, index) => (
            <div key={index} className={elementClass} />
          ))}
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <ProgressBar
            currentStep={currentStep}
            totalSteps={totalSteps}
            progress={progress}
            stepName={stepName}
            stepSubtitle={stepSubtitle}
          />
        )}

        {/* Main Content Area */}
        <div className="relative z-10 min-h-screen pb-16 pt-8">
          <div className="mx-auto max-w-4xl px-6">
            {/* Action Buttons */}
            <div className="mb-8 flex items-center justify-between">
              {/* Back Button */}
              {canGoBack && onPrev ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <SacredButton
                    variant="ghost"
                    onClick={onPrev}
                    disabled={isTransitioning || isLoading}
                    className="flex items-center gap-2"
                    aria-label={`Go back to step ${currentStep}`}
                  >
                    <ArrowLeft className="h-5 w-5" />
                    <span className="font-medium">Back</span>
                  </SacredButton>
                </motion.div>
              ) : (
                <div /> // Spacer
              )}

              {/* Utility Buttons */}
              <div className="flex items-center gap-3">
                {onHelp && (
                  <SacredButton
                    variant="ghost"
                    size="sm"
                    onClick={onHelp}
                    className="flex items-center gap-2"
                    aria-label="Get help"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span className="hidden sm:inline">Help</span>
                  </SacredButton>
                )}

                {onHome && (
                  <SacredButton
                    variant="ghost"
                    size="sm"
                    onClick={onHome}
                    className="flex items-center gap-2"
                    aria-label="Go to homepage"
                  >
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Home</span>
                  </SacredButton>
                )}
              </div>
            </div>

            {/* Content Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={animateTransitions ? stepAnimationVariants.enter : false}
                animate={stepAnimationVariants.center}
                exit={animateTransitions ? stepAnimationVariants.exit : false}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="overflow-hidden rounded-2xl bg-white shadow-xl"
              >
                {/* Error State */}
                {error && (
                  <div className="border-b border-red-200 bg-red-50 p-4">
                    <div className="flex items-center text-red-800">
                      <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-sm font-medium">{error}</span>
                    </div>
                  </div>
                )}

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
                    <div className="flex flex-col items-center space-y-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-sacred-blue-500 border-t-transparent" />
                      <p className="text-sm font-medium text-sacred-blue-600">Loading...</p>
                    </div>
                  </div>
                )}

                {/* Main Content */}
                <div className="relative p-8 md:p-12">{children}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Accessibility announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {stepName ? `Current step: ${stepName}` : `Step ${currentStep + 1} of ${totalSteps}`}
          {progress && `, ${Math.round(progress)}% complete`}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// Export types for external use
export type { WizardLayoutProps as WizardProps };
