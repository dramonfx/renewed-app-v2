'use client';
import { motion } from 'framer-motion';

const ProgressBar = ({ currentStep, totalSteps, stepTitles }) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-sacred-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-sacred-blue-800">
            Step {currentStep + 1} of {totalSteps}
          </div>
          <div className="text-sm text-sacred-blue-700">
            {stepTitles[currentStep]}
          </div>
        </div>
        
        <div className="w-full bg-sacred-blue-100 rounded-full h-2 overflow-hidden">
          <motion.div
            className="h-full bg-sacred-gradient rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          {stepTitles.map((title, index) => (
            <div
              key={index}
              className={`text-xs transition-colors duration-300 ${
                index <= currentStep
                  ? 'text-sacred-blue-900 font-medium'
                  : 'text-sacred-blue-400'
              }`}
            >
              {index < stepTitles.length - 1 && (
                <div className={`w-2 h-2 rounded-full mx-auto mb-1 ${
                  index <= currentStep
                    ? 'bg-sacred-blue-600'
                    : 'bg-sacred-blue-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;