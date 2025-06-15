'use client';
import { motion } from 'framer-motion';

const NavigationButtons = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onBack, 
  canProceed = true,
  nextButtonText = "Continue",
  isLoading = false 
}) => {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-t border-sacred-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: isFirstStep ? 0.5 : 1, x: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onBack}
            disabled={isFirstStep || isLoading}
            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
              isFirstStep
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white text-sacred-blue-700 border-2 border-sacred-blue-200 hover:border-sacred-blue-400 hover:bg-sacred-blue-50'
            }`}
          >
            ← Back
          </motion.button>

          <div className="flex items-center space-x-4">
            {!isLastStep && (
              <div className="text-sm text-sacred-blue-600">
                {currentStep + 1} of {totalSteps}
              </div>
            )}
            
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: canProceed ? 1 : 0.5, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onNext}
              disabled={!canProceed || isLoading}
              className={`px-8 py-3 rounded-full font-bold transition-all duration-300 transform ${
                canProceed && !isLoading
                  ? 'bg-sacred-gradient text-white hover:shadow-xl hover:-translate-y-1'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  {isLastStep ? 'Complete Journey' : nextButtonText}
                  {!isLastStep && ' →'}
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationButtons;