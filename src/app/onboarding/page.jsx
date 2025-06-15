'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// Import all step components
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
import TwoMindsStep from '@/components/onboarding/TwoMindsStep';
import AssessmentStep from '@/components/onboarding/AssessmentStep';
import GoalsStep from '@/components/onboarding/GoalsStep';
import CompletionStep from '@/components/onboarding/CompletionStep';

// Import navigation components
import ProgressBar from '@/components/onboarding/ProgressBar';
import NavigationButtons from '@/components/onboarding/NavigationButtons';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    assessment: {},
    goals: [],
    preferences: {}
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Step configuration
  const steps = [
    {
      component: WelcomeScreen,
      title: 'Welcome',
      showNavigation: false, // Welcome screen has its own navigation
      showProgress: false
    },
    {
      component: TwoMindsStep,
      title: 'Two Minds Concept',
      showNavigation: true,
      showProgress: true,
      nextButtonText: 'I Understand'
    },
    {
      component: AssessmentStep,
      title: 'Self Assessment',
      showNavigation: true,
      showProgress: true,
      nextButtonText: 'Continue to Goals',
      validation: () => {
        const assessment = formData.assessment || {};
        return Object.keys(assessment).length >= 3; // Ensure all questions answered
      }
    },
    {
      component: GoalsStep,
      title: 'Goal Selection',
      showNavigation: true,
      showProgress: true,
      nextButtonText: 'Set My Goals',
      validation: () => {
        const goals = formData.goals || [];
        return goals.length > 0; // At least one goal selected
      }
    },
    {
      component: CompletionStep,
      title: 'Journey Begins',
      showNavigation: false, // Completion screen has its own navigation
      showProgress: true
    }
  ];

  const stepTitles = steps.map(step => step.title);
  const totalSteps = steps.length;
  const currentStepConfig = steps[currentStep];

  // Navigation functions
  const nextStep = async () => {
    // Validate current step if validation function exists
    if (currentStepConfig.validation && !currentStepConfig.validation()) {
      return; // Don't proceed if validation fails
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
    
    setIsLoading(false);
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Check if user can proceed to next step
  const canProceed = () => {
    if (currentStepConfig.validation) {
      return currentStepConfig.validation();
    }
    return true;
  };

  // Handle welcome screen navigation (special case)
  const handleWelcomeNext = () => {
    setCurrentStep(1);
  };

  // Render current step component
  const renderCurrentStep = () => {
    const StepComponent = currentStepConfig.component;
    
    const stepProps = {
      onNext: currentStep === 0 ? handleWelcomeNext : nextStep,
      onBack: prevStep,
      formData,
      setFormData,
      currentStep,
      totalSteps
    };

    return <StepComponent {...stepProps} />;
  };

  // Animation variants for step transitions
  const stepVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="min-h-screen bg-sacred-blue-gradient overflow-hidden relative">
      {/* Progress Bar */}
      {currentStepConfig.showProgress && (
        <ProgressBar 
          currentStep={currentStep}
          totalSteps={totalSteps}
          stepTitles={stepTitles}
        />
      )}

      {/* Main Content Area */}
      <div className={`${currentStepConfig.showProgress ? 'pt-24' : ''} ${currentStepConfig.showNavigation ? 'pb-24' : ''}`}>
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div
            key={currentStep}
            custom={currentStep}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.4 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold && currentStep < totalSteps - 1 && canProceed()) {
                nextStep();
              } else if (swipe > swipeConfidenceThreshold && currentStep > 0) {
                prevStep();
              }
            }}
            className="w-full"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      {currentStepConfig.showNavigation && (
        <NavigationButtons
          currentStep={currentStep}
          totalSteps={totalSteps}
          onNext={nextStep}
          onBack={prevStep}
          canProceed={canProceed()}
          nextButtonText={currentStepConfig.nextButtonText}
          isLoading={isLoading}
        />
      )}

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 60, repeat: Infinity, ease: "linear" },
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -top-32 -right-32 w-64 h-64 bg-sacred-gold-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: -360,
            scale: [1, 1.2, 1],
          }}
          transition={{
            rotate: { duration: 45, repeat: Infinity, ease: "linear" },
            scale: { duration: 12, repeat: Infinity, ease: "easeInOut" }
          }}
          className="absolute -bottom-32 -left-32 w-96 h-96 bg-sacred-purple-400/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  );
}