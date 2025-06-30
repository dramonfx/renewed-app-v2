'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Temporarily commenting out new architecture for debugging
// import SacredTransition from '@/components/sacred-journey/SacredTransition';
// import SacredProgress from '@/components/sacred-journey/SacredProgress';
// import { useSacredJourney } from '@/hooks/useSacredJourney';
import { INITIAL_ONBOARDING_DATA, updateOnboardingData } from '@/constants/onboardingDataSchema';

// Original Onboarding Steps (for testing)
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsStep from '@/components/onboarding/TwoMindsStep';
import AssessmentStep from '@/components/onboarding/AssessmentStep';
import PathSelectionStep from '@/components/onboarding/PathSelectionStep';
import IntentionsStep from '@/components/onboarding/IntentionsStep';
import CompletionStep from '@/components/onboarding/CompletionStep';

/**
 * Sacred Journey Onboarding - Completely Reimagined
 * A spiritually immersive transformation experience from natural mind to spiritual mind
 */
export default function SacredJourneyPage() {
  const router = useRouter();
  const [direction, setDirection] = useState('forward');
  const [currentStep, setCurrentStep] = useState(0);
  const [journeyData, setJourneyData] = useState(INITIAL_ONBOARDING_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Simple helper functions
  const goToNextStep = (stepData = {}) => {
    setJourneyData(prev => updateOnboardingData(prev, stepData));
    setCurrentStep(prev => prev + 1);
  };

  const goToPreviousStep = () => {
    setCurrentStep(prev => Math.max(0, prev - 1));
  };

  const completeJourney = async (finalData = {}) => {
    setJourneyData(prev => updateOnboardingData(prev, finalData));
    return true;
  };

  // Sacred Journey Steps Configuration (using original components for testing)
  const sacredSteps = [
    {
      component: WelcomeScreen,
      title: 'Welcome Portal',
      description: 'Sacred threshold between ordinary and extraordinary consciousness'
    },
    {
      component: TwoMindsStep,
      title: 'Consciousness Awakening',
      description: 'Deep spiritual education about dual nature of mind'
    },
    {
      component: AssessmentStep,
      title: 'Inner Landscape',
      description: 'Sacred self-examination and honest reflection'
    },
    {
      component: PathSelectionStep,
      title: 'Path Consecration',
      description: 'Sacred commitment to transformation approach'
    },
    {
      component: IntentionsStep,
      title: 'Sacred Intentions',
      description: 'Formal setting of spiritual intentions as sacred vows'
    },
    {
      component: CompletionStep,
      title: 'Journey Begins',
      description: 'Sacred celebration and official beginning of transformed life'
    }
  ];

  // Handle navigation with smooth transitions
  const handleNext = async (stepData = {}) => {
    if (currentStep === sacredSteps.length - 1) {
      // Complete the sacred journey
      const success = await completeJourney(stepData);
      if (success) {
        // Smooth transition to dashboard instead of hard redirect
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000); // Allow time for celebration
      }
    } else {
      setDirection('forward');
      goToNextStep(stepData);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setDirection('backward');
      goToPreviousStep();
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sacred-journey-gradient">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-sacred-gold-200"></div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-sacred-gold-500"
            ></motion.div>
          </div>
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">
            Preparing Your Sacred Journey
          </h3>
          <p className="text-sacred-blue-600">
            Creating a spiritually immersive experience...
          </p>
        </motion.div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sacred-journey-gradient p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center bg-white/80 backdrop-blur-md rounded-2xl p-8 border border-white/30 shadow-lg"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-sacred-rose-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-4">
            Sacred Journey Pause
          </h3>
          <p className="text-sacred-blue-600 mb-6">
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-sacred-gradient text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Continue Journey
          </button>
        </motion.div>
      </div>
    );
  }

  const CurrentStepComponent = sacredSteps[currentStep]?.component;

  if (!CurrentStepComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sacred-journey-gradient">
        <div className="text-center text-sacred-blue-900">
          Sacred journey step not found. Please refresh to continue.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-sacred-journey-gradient">
      {/* Simple Progress Indicator */}
      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border border-white/30 shadow-lg">
          <p className="text-white text-sm">
            Step {currentStep + 1} of {sacredSteps.length}: {sacredSteps[currentStep].title}
          </p>
        </div>
      </div>

      {/* Simple Step Content */}
      <CurrentStepComponent
        onNext={handleNext}
        onBack={handleBack}
        journeyData={journeyData}
        data={journeyData}
        currentStep={currentStep}
        totalSteps={sacredSteps.length}
        canGoBack={currentStep > 0}
        stepInfo={sacredSteps[currentStep]}
      />

      {/* Sacred Ambient Sound Toggle (Optional) - commented out for debugging */}
      {/* <SacredAmbientControls /> */}
    </div>
  );
}

/**
 * Sacred Ambient Controls
 * Optional ambient sound and visual controls for enhanced immersion
 */
const SacredAmbientControls = () => {
  const [isAmbientEnabled, setIsAmbientEnabled] = useState(false);
  const [isSoundsEnabled, setIsSoundsEnabled] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/30 shadow-lg"
      >
        <div className="flex space-x-3">
          {/* Ambient Visuals Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAmbientEnabled(!isAmbientEnabled)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isAmbientEnabled 
                ? 'bg-sacred-gold-500 text-white shadow-lg' 
                : 'bg-white/30 text-sacred-blue-700 hover:bg-white/50'
            }`}
            title="Toggle ambient visuals"
          >
            ✨
          </motion.button>

          {/* Ambient Sounds Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSoundsEnabled(!isSoundsEnabled)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isSoundsEnabled 
                ? 'bg-sacred-purple-500 text-white shadow-lg' 
                : 'bg-white/30 text-sacred-blue-700 hover:bg-white/50'
            }`}
            title="Toggle ambient sounds"
          >
            🎵
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};