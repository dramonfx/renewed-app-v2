'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import WizardLayout from '@/components/onboarding/WizardLayout';
import TwoMindsStep from '@/components/onboarding/TwoMindsStep';
import AssessmentStep from '@/components/onboarding/AssessmentStep';
import IntentionsStep from '@/components/onboarding/IntentionsStep';
import PathSelectionStep from '@/components/onboarding/PathSelectionStep';
import CompletionStep from '@/components/onboarding/CompletionStep';

// Define the onboarding steps
const ONBOARDING_STEPS = [
  { component: WelcomeScreen, name: 'Welcome', useWizardLayout: false },
  { component: TwoMindsStep, name: 'Two Minds', useWizardLayout: true },
  { component: AssessmentStep, name: 'Assessment', useWizardLayout: true },
  { component: IntentionsStep, name: 'Intentions', useWizardLayout: true },
  { component: PathSelectionStep, name: 'Path Selection', useWizardLayout: true },
  { component: CompletionStep, name: 'Completion', useWizardLayout: false }
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Check if onboarding is already completed
  useEffect(() => {
    const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
    if (isCompleted === 'true') {
      router.push('/book');
    }
  }, [router]);

  // Navigation functions
  const nextStep = async (stepData = {}) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Save step data
    const updatedData = { ...onboardingData, ...stepData };
    setOnboardingData(updatedData);
    
    // If this is the last step, complete onboarding
    if (currentStep >= ONBOARDING_STEPS.length - 1) {
      localStorage.setItem('renewedOnboardingCompleted', 'true');
      localStorage.setItem('renewedOnboardingData', JSON.stringify(updatedData));
      
      // Delay navigation to allow completion animation
      setTimeout(() => {
        router.push('/book');
      }, 3000);
      return;
    }
    
    // Move to next step
    setTimeout(() => {
      setCurrentStep(prev => prev + 1);
      setIsTransitioning(false);
    }, 300);
  };

  const prevStep = () => {
    if (isTransitioning || currentStep <= 0) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentStep(prev => prev - 1);
      setIsTransitioning(false);
    }, 300);
  };

  const goToStep = (stepIndex) => {
    if (isTransitioning || stepIndex < 0 || stepIndex >= ONBOARDING_STEPS.length) return;
    
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentStep(stepIndex);
      setIsTransitioning(false);
    }, 300);
  };

  // Get current step component and configuration
  const currentStepConfig = ONBOARDING_STEPS[currentStep];
  const CurrentStepComponent = currentStepConfig?.component;
  const useWizardLayout = currentStepConfig?.useWizardLayout;
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (!CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-600 animate-spin flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-white border-t-transparent"></div>
          </div>
          <h1 className="text-2xl font-serif text-slate-800 mb-4">Loading Your Sacred Journey...</h1>
        </div>
      </div>
    );
  }

  // Render step with or without wizard layout
  const renderStep = () => {
    const stepProps = {
      onNext: nextStep,
      onPrev: prevStep,
      onGoToStep: goToStep,
      currentStep,
      totalSteps,
      onboardingData,
      isTransitioning
    };

    if (useWizardLayout) {
      return (
        <WizardLayout
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepName={currentStepConfig.name}
          progress={progress}
          onPrev={prevStep}
          canGoBack={currentStep > 0}
          isTransitioning={isTransitioning}
        >
          <CurrentStepComponent {...stepProps} />
        </WizardLayout>
      );
    }

    return <CurrentStepComponent {...stepProps} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden relative">
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>

      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200/15 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
      </div>
    </div>
  );
}