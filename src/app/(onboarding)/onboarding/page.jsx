'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsExplanation from '@/components/onboarding/TwoMindsExplanation';
import CurrentStateAssessment from '@/components/onboarding/CurrentStateAssessment';
import IntentionSetting from '@/components/onboarding/IntentionSetting';
import PathSelection from '@/components/onboarding/PathSelection';
import CompletionScreen from '@/components/onboarding/CompletionScreen';

// Define the onboarding steps
const ONBOARDING_STEPS = [
  { component: WelcomeScreen, name: 'Welcome' },
  { component: TwoMindsExplanation, name: 'Two Minds' },
  { component: CurrentStateAssessment, name: 'Assessment' },
  { component: IntentionSetting, name: 'Intentions' },
  { component: PathSelection, name: 'Path Selection' },
  { component: CompletionScreen, name: 'Completion' }
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
      }, 2000);
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

  // Get current step component
  const CurrentStepComponent = ONBOARDING_STEPS[currentStep]?.component;
  const totalSteps = ONBOARDING_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  if (!CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-sacred-blue-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sacred-blue-gradient dark:bg-gradient-to-br dark:from-sacred-blue-950 dark:via-slate-900 dark:to-sacred-purple-950 overflow-hidden relative">
      {/* Progress Bar */}
      {currentStep > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20"
        >
          <div className="max-w-4xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sacred-blue-900 dark:text-sacred-blue-100">
                Step {currentStep + 1} of {totalSteps}
              </span>
              <span className="text-sm text-sacred-blue-400 dark:text-sacred-blue-300">
                {ONBOARDING_STEPS[currentStep]?.name}
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                className="bg-sacred-gradient h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Navigation Buttons */}
      {currentStep > 0 && currentStep < totalSteps - 1 && (
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={prevStep}
          disabled={isTransitioning}
          className="
            fixed left-4 top-1/2 transform -translate-y-1/2 z-50
            bg-white/20 backdrop-blur-md border border-white/30
            rounded-full p-3 text-sacred-blue-900 dark:text-sacred-blue-100
            hover:bg-white/30 transition-all duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </motion.button>
      )}

      {/* Main Content */}
      <div className={`${currentStep > 0 ? 'pt-20' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <CurrentStepComponent
              onNext={nextStep}
              onPrev={prevStep}
              onGoToStep={goToStep}
              currentStep={currentStep}
              totalSteps={totalSteps}
              onboardingData={onboardingData}
              isTransitioning={isTransitioning}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-sacred-gold-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sacred-purple-400/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
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
