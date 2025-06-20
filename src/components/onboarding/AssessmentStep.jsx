
'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

const AssessmentStep = ({ onNext, onboardingData = {}, data = {} }) => {
  // Use onboardingData if available, fallback to data prop, then to empty object
  const safeData = onboardingData.assessment || data.assessment || {};
  const [responses, setResponses] = useState(safeData);

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
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-serif text-sacred-blue-900 mb-4">
              Current State{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">
                Assessment
              </span>
            </h2>
            <p className="text-sacred-blue-600 text-lg leading-relaxed">
              Understanding where you are now helps us guide you toward where you want to be.
            </p>
          </SacredCard>
        </motion.div>

        {/* Questions */}
        <div className="space-y-6 mb-10">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SacredCard variant="glass" className="p-6">
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-6">
                  {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <motion.label
                      key={option.value}
                      className={`
                        flex items-center p-4 rounded-xl cursor-pointer transition-all duration-300 shadow-sm
                        ${responses[question.id] === option.value
                          ? 'bg-sacred-blue-100 border-2 border-sacred-blue-400'
                          : 'bg-white/50 border-2 border-gray-200 hover:bg-white/80 hover:border-sacred-blue-200'
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
              </SacredCard>
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
          <SacredCard variant="glass" className="p-4">
            <p className="text-sacred-blue-600 text-sm">
              {Object.keys(responses).length} of {questions.length} questions completed
            </p>
          </SacredCard>
        </motion.div>

        {/* Next Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredButton
            onClick={handleNext}
            disabled={!allQuestionsAnswered}
            variant="primary"
            size="lg"
            className="px-8"
          >
            Continue to Path Selection →
          </SacredButton>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentStep;
