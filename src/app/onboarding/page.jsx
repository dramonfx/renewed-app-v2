'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Import all onboarding components
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsStep from '@/components/onboarding/TwoMindsStep';
import AssessmentStep from '@/components/onboarding/AssessmentStep';
import PathSelectionStep from '@/components/onboarding/PathSelectionStep';
import IntentionsStep from '@/components/onboarding/IntentionsStep';
import CompletionStep from '@/components/onboarding/CompletionStep';
import WizardLayout from '@/components/onboarding/WizardLayout';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Sacred Threshold Steps - No Welcome Screen in Wizard Layout
  const steps = [
    { component: WelcomeScreen, name: 'Welcome', useWizard: false },
    { component: TwoMindsStep, name: 'Two Minds', useWizard: true },
    { component: AssessmentStep, name: 'Assessment', useWizard: true },
    { component: PathSelectionStep, name: 'Path Selection', useWizard: true },
    { component: IntentionsStep, name: 'Intentions', useWizard: true },
    { component: CompletionStep, name: 'Completion', useWizard: false },
  ];

  useEffect(() => {
    // Check if already completed
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (isCompleted) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev + 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(prev => prev - 1);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const currentStepData = steps[currentStep];
  const CurrentComponent = currentStepData.component;
  
  // Calculate progress (exclude welcome and completion from progress)
  const progressSteps = steps.filter(step => step.useWizard);
  const currentProgressStep = steps.slice(0, currentStep + 1).filter(step => step.useWizard).length;
  const progress = currentStepData.useWizard 
    ? (currentProgressStep / progressSteps.length) * 100 
    : 0;

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {currentStepData.useWizard ? (
            <WizardLayout
              currentStep={currentProgressStep}
              totalSteps={progressSteps.length + 1}
              stepName={currentStepData.name}
              progress={progress}
              onPrev={handlePrev}
              canGoBack={currentStep > 0}
              isTransitioning={isTransitioning}
            >
              <CurrentComponent 
                onNext={handleNext} 
                onBack={handlePrev}
              />
            </WizardLayout>
          ) : (
            <CurrentComponent 
              onNext={handleNext} 
              onBack={currentStep > 0 ? handlePrev : undefined}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingPage;