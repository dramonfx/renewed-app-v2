
'use client';

import { useState } from 'react';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsStep from '@/components/onboarding/TwoMindsStep';
import AssessmentStep from '@/components/onboarding/AssessmentStep';
import PathSelectionStep from '@/components/onboarding/PathSelectionStep';
import IntentionsStep from '@/components/onboarding/IntentionsStep';
import CompletionStep from '@/components/onboarding/CompletionStep';
import { INITIAL_ONBOARDING_DATA, updateOnboardingData } from '@/constants/onboardingDataSchema';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState(INITIAL_ONBOARDING_DATA);

  const steps = [
    { component: WelcomeScreen, title: 'Welcome' },
    { component: TwoMindsStep, title: 'Understanding Your Mind' },
    { component: AssessmentStep, title: 'Current State Assessment' },
    { component: PathSelectionStep, title: 'Choose Your Path' },
    { component: IntentionsStep, title: 'Set Your Intentions' },
    { component: CompletionStep, title: 'Journey Begins' }
  ];

  const handleNext = (data = {}) => {
    setOnboardingData(prev => updateOnboardingData(prev, data));
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen">
      <CurrentStepComponent 
        onNext={handleNext}
        onBack={handleBack}
        data={onboardingData}
        onboardingData={onboardingData}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </div>
  );
}
