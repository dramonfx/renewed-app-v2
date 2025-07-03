'use client';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

const WizardLayout = ({
  children,
  currentStep,
  totalSteps,
  stepName,
  progress,
  onPrev,
  canGoBack,
  isTransitioning,
}) => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Light Scenic Background - matching welcome screen */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Soft background elements */}
        <div className="absolute left-20 top-20 h-64 w-64 rounded-full bg-blue-200/30 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-purple-200/20 blur-3xl"></div>
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-indigo-100/40 blur-3xl"></div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 w-full border-b border-white/50 bg-white/80 py-4 backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep} of {totalSteps - 1}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-200">
            <motion.div
              className="h-2 rounded-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pb-16 pt-8">
        <div className="mx-auto max-w-4xl px-6">
          {/* Back Button */}
          {canGoBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={onPrev}
              disabled={isTransitioning}
              className="
                mb-8 flex items-center gap-2 text-slate-600 transition-colors
                duration-200 hover:text-slate-800 disabled:opacity-50
              "
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Back</span>
            </motion.button>
          )}

          {/* White Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="rounded-2xl bg-white p-8 shadow-xl md:p-12"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
