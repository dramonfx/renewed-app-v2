'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/onboarding/WelcomeScreen';
// We will add the other components later

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  const nextStep = () => {
    // For now, this will just complete the flow
    // In the future, it will go to the next step
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    router.push('/book');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-amber-50 dark:from-indigo-950 dark:via-slate-900 dark:to-amber-950 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <WelcomeScreen onNext={nextStep} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}