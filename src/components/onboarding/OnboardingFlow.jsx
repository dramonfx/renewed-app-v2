'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeStep from './WelcomeStep';
import TwoMindsStep from './TwoMindsStep';
import GuidedTourStep from './GuidedTourStep';
import CallToActionStep from './CallToActionStep';
import ProgressIndicator from './ProgressIndicator';

const ONBOARDING_STEPS = [
  { id: 'welcome', component: WelcomeStep },
  { id: 'two-minds', component: TwoMindsStep },
  { id: 'guided-tour', component: GuidedTourStep },
  { id: 'call-to-action', component: CallToActionStep },
];

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    // Store completion in localStorage
    localStorage.setItem('onboarding_completed', 'true');
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    handleComplete();
  };

  const CurrentStepComponent = ONBOARDING_STEPS[currentStep].component;

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-brand-blue-light via-brand-blue-content-bg to-brand-cream"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-blue-medium rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-gold rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-brand-blue-dark rounded-full blur-3xl"></div>
      </div>

      {/* Skip Button */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleSkip}
        className="absolute top-6 right-6 z-10 px-4 py-2 text-brand-text-muted hover:text-brand-blue-dark transition-colors font-sans text-sm"
      >
        Skip Tour
      </motion.button>

      {/* Progress Indicator */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
        <ProgressIndicator 
          currentStep={currentStep} 
          totalSteps={ONBOARDING_STEPS.length} 
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <CurrentStepComponent
                onNext={handleNext}
                onPrevious={handlePrevious}
                onSkip={handleSkip}
                isFirstStep={currentStep === 0}
                isLastStep={currentStep === ONBOARDING_STEPS.length - 1}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}