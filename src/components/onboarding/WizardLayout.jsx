
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
  isTransitioning 
}) => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Light Scenic Background - matching welcome screen */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Soft background elements */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/40 rounded-full blur-3xl"></div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-20 w-full bg-white/80 backdrop-blur-sm border-b border-white/50 py-4">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Step {currentStep} of {totalSteps - 1}
            </span>
            <span className="text-sm font-medium text-slate-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <motion.div
              className="bg-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          {canGoBack && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              onClick={onPrev}
              disabled={isTransitioning}
              className="
                mb-8 flex items-center gap-2 text-slate-600 hover:text-slate-800
                transition-colors duration-200 disabled:opacity-50
              "
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>
          )}

          {/* White Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;
