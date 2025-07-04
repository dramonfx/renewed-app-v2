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
        { value: 'extreme', label: 'Extreme - Constantly stressed and anxious' },
      ],
    },
    {
      id: 'life_satisfaction',
      question: 'How satisfied are you with your current life direction?',
      options: [
        { value: 'very_satisfied', label: 'Very satisfied - Living with purpose' },
        { value: 'satisfied', label: 'Satisfied - Generally on the right track' },
        { value: 'unsatisfied', label: 'Unsatisfied - Something feels missing' },
        { value: 'very_unsatisfied', label: 'Very unsatisfied - Need significant change' },
      ],
    },
    {
      id: 'growth_desire',
      question: 'How strong is your desire for personal transformation?',
      options: [
        { value: 'curious', label: 'Curious - Exploring possibilities' },
        { value: 'interested', label: 'Interested - Ready to learn more' },
        { value: 'committed', label: 'Committed - Ready to take action' },
        { value: 'desperate', label: 'Desperate - Need change urgently' },
      ],
    },
  ];

  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    onNext({ assessment: responses });
  };

  const allQuestionsAnswered = questions.every((q) => responses[q.id]);

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12 border border-sacred-gold-200 shadow-lg shadow-sacred-gold-100/30">
            <h2 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl border-b border-sacred-gold-200 pb-3">
              Current State{' '}
              <span className="bg-sacred-gradient bg-clip-text text-transparent">Assessment</span>
            </h2>
            <p className="text-lg leading-relaxed text-sacred-blue-600">
              Understanding where you are now helps us guide you toward where you want to be.
            </p>
          </SacredCard>
        </motion.div>

        {/* Questions */}
        <div className="mb-10 space-y-6">
          {questions.map((question, index) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <SacredCard variant="glass" className="p-6 border border-sacred-gold-100 hover:border-sacred-gold-200 transition-all duration-300">
                <h3 className="mb-6 font-serif text-xl text-sacred-blue-900 border-b border-sacred-gold-100 pb-2">
                  {question.question}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <motion.label
                      key={option.value}
                      className={`
                        flex cursor-pointer items-center rounded-xl p-4 shadow-sm transition-all duration-300
                        ${
                          responses[question.id] === option.value
                            ? 'border-2 border-sacred-gold-400 bg-sacred-gold-50 shadow-md shadow-sacred-gold-200/50'
                            : 'border-2 border-sacred-gold-100 bg-white/50 hover:border-sacred-gold-200 hover:bg-sacred-gold-50/30'
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
                      <div
                        className={`
                        mr-4 flex h-5 w-5 items-center justify-center rounded-full border-2
                        ${
                          responses[question.id] === option.value
                            ? 'border-sacred-gold-500 bg-sacred-gold-500'
                            : 'border-sacred-gold-300'
                        }
                      `}
                      >
                        {responses[question.id] === option.value && (
                          <div className="h-2 w-2 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="flex-1 text-sacred-blue-700">{option.label}</span>
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
          className="mb-8 text-center"
        >
          <SacredCard variant="glass" className="p-4">
            <p className="text-sm text-sacred-blue-600">
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
