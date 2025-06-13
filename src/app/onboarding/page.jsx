'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsExplanation from '@/components/onboarding/TwoMindsExplanation';
import CurrentStateAssessment from '@/components/onboarding/CurrentStateAssessment';
import IntentionSetting from '@/components/onboarding/IntentionSetting';
import PathSelection from '@/components/onboarding/PathSelection';
import CompletionScreen from '@/components/onboarding/CompletionScreen';

const ONBOARDING_STEPS = [
  'welcome',
  'two-minds',
  'assessment',
  'intention',
  'path-selection',
  'completion'
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({
    currentMind: null,
    intention: '',
    selectedPath: null,
    assessmentAnswers: []
  });
  const router = useRouter();

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateOnboardingData = (data) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const completeOnboarding = () => {
    localStorage.setItem('renewedOnboardingData', JSON.stringify(onboardingData));
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    
    if (onboardingData.selectedPath === 'guided') {
      router.push('/book');
    } else {
      router.push('/full-audio-player');
    }
  };

  const renderCurrentStep = () => {
    const stepName = ONBOARDING_STEPS[currentStep];
    
    switch (stepName) {
      case 'welcome':
        return <WelcomeScreen onNext={nextStep} />;
      case 'two-minds':
        return <TwoMindsExplanation onNext={nextStep} onPrev={prevStep} />;
      case 'assessment':
        return (
          <CurrentStateAssessment
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateOnboardingData}
            data={onboardingData}
          />
        );
      case 'intention':
        return (
          <IntentionSetting
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateOnboardingData}
            data={onboardingData}
          />
        );
      case 'path-selection':
        return (
          <PathSelection
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateOnboardingData}
            data={onboardingData}
          />
        );
      case 'completion':
        return (
          <CompletionScreen
            onComplete={completeOnboarding}
            onPrev={prevStep}
            data={onboardingData}
          />
        );
      default:
        return <WelcomeScreen onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950 overflow-hidden">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/20 dark:bg-black/20 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-indigo-500 to-amber-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / ONBOARDING_STEPS.length) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="w-full h-full"
        >
          {renderCurrentStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}