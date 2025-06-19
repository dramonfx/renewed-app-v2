
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const AssessmentStep = ({ onNext, onboardingData }) => {
  const [responses, setResponses] = useState(onboardingData.assessment || {});

  const questions = [
    {
      id: 'stress_level',
      question: 'How would you rate your current stress level?',
      options: [
        { value: 'low', label: 'Low - I feel generally calm and balanced' },
        { value: 'moderate', label: 'Moderate - Some stress but manageable' },
        { value: 'high', label: 'High - Often feeling overwhelmed' },
        { value: 'extreme', label: 'Extreme - Constantly stressed and anxious' }
      ]
    },
    {
      id: 'life_satisfaction',
      question: 'How satisfied are you with your current life direction?',
      options: [
        { value: 'very_satisfied', label: 'Very satisfied - Living with purpose' },
        { value: 'satisfied', label: 'Satisfied - Generally on the right track' },
        { value: 'unsatisfied', label: 'Unsatisfied - Something feels missing' },
        { value: 'very_unsatisfied', label: 'Very unsatisfied - Need significant change' }
      ]
    },
    {
      id: 'growth_desire',
      question: 'How strong is your desire for personal transformation?',
      options: [
        { value: 'curious', label: 'Curious - Exploring possibilities' },
        { value: 'interested', label: 'Interested - Ready to learn more' },
        { value: 'committed', label: 'Committed - Ready to take action' },
        { value: 'desperate', label: 'Desperate - Need change urgently' }
      ]
    }
  ];

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleNext = () => {
    onNext({ assessment: responses });
  };

  const allQuestionsAnswered = questions.every(q => responses[q.id]);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
          Current State{' '}
          <span className="bg-sacred-gradient bg-clip-text text-transparent">
            Assessment
          </span>
        </h2>
        <p className="text-sacred-blue-600 text-lg leading-relaxed">
          Understanding where you are now helps us guide you toward where you want to be.
        </p>
      </motion.div>

      {/* Questions */}
      <div className="space-y-8 mb-10">
        {questions.map((question, index) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white/50 rounded-2xl p-6 border border-white/30"
          >
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-6">
              {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option) => (
                <motion.label
                  key={option.value}
                  className={`
                    flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300
                    ${responses[question.id] === option.value
                      ? 'bg-sacred-blue-100 border-2 border-sacred-blue-400'
                      : 'bg-white/70 border-2 border-transparent hover:bg-white/90'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name={question.id}
                    value={option.value}
                    checked={responses[question.id] === option.value}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    className="sr-only"
                  />
                  <div className={`
                    w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center
                    ${responses[question.id] === option.value
                      ? 'border-sacred-blue-500 bg-sacred-blue-500'
                      : 'border-gray-300'
                    }
                  `}>
                    {responses[question.id] === option.value && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-sacred-blue-700 flex-1">
                    {option.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-center mb-8"
      >
        <p className="text-sacred-blue-600 text-sm">
          {Object.keys(responses).length} of {questions.length} questions completed
        </p>
      </motion.div>

      {/* Next Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center"
      >
        <button
          onClick={handleNext}
          disabled={!allQuestionsAnswered}
          className={`
            px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300
            ${allQuestionsAnswered 
              ? 'bg-sacred-gradient text-white hover:shadow-xl hover:-translate-y-1' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Continue to Intentions →
        </button>
      </motion.div>
    </div>
  );
};

export default AssessmentStep;
