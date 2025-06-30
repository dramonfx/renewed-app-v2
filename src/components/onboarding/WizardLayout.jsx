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
      {/* Sacred Threshold Background - No Distracting Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gentle Sacred Atmosphere */}
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-200/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100/25 rounded-full blur-3xl"></div>
      </div>

      {/* NO PROGRESS BAR - Clean Sacred Threshold Experience */}

      {/* Main Content Area */}
      <div className="relative z-10 min-h-screen pt-8 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button - Clean and Minimal */}
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
                bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm
                hover:bg-white/90 hover:shadow-md
              "
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </motion.button>
          )}

          {/* Sacred Threshold Content Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WizardLayout;