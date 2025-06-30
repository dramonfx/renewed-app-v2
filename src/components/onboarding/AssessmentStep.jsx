'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const AssessmentStep = ({ onNext, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'peace_level',
      text: 'How often do you experience deep, lasting peace in your daily life?',
      options: [
        { value: 'rarely', label: 'Rarely - My mind is often restless and anxious' },
        { value: 'sometimes', label: 'Sometimes - I have moments of peace but they don\'t last' },
        { value: 'often', label: 'Often - I generally feel peaceful with occasional disruptions' },
        { value: 'consistently', label: 'Consistently - I maintain deep peace even in challenges' }
      ]
    },
    {
      id: 'spiritual_connection',
      text: 'How connected do you feel to your spiritual life and divine purpose?',
      options: [
        { value: 'disconnected', label: 'Disconnected - I struggle to sense any spiritual reality' },
        { value: 'seeking', label: 'Seeking - I want connection but find it difficult to maintain' },
        { value: 'growing', label: 'Growing - I feel increasing awareness of divine presence' },
        { value: 'strong', label: 'Strong - I consistently experience divine connection and guidance' }
      ]
    },
    {
      id: 'transformation_readiness',
      text: 'How ready are you to embrace significant changes in your thinking and lifestyle?',
      options: [
        { value: 'hesitant', label: 'Hesitant - Change feels overwhelming and scary' },
        { value: 'cautious', label: 'Cautious - I want change but need support and time' },
        { value: 'ready', label: 'Ready - I\'m prepared to make necessary changes' },
        { value: 'eager', label: 'Eager - I\'m excited to transform and grow spiritually' }
      ]
    }
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Store assessment results
      localStorage.setItem('renewedAssessment', JSON.stringify(answers));
      onNext();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    } else {
      onBack();
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const isAnswered = answers[currentQuestionData.id];
  const progressPercentage = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            {/* Sacred Discovery Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-serif sacred-text-enhanced mb-4">
                Sacred Self-Discovery
              </h1>
              <p className="sacred-text-body text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                These questions will help us understand where you are in your spiritual journey 
                and how to best guide your transformation.
              </p>
              
              {/* Gentle Progress Flow - No Numbers */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index <= currentQuestion 
                          ? 'bg-blue-500 shadow-md' 
                          : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Question */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <SacredCard variant="glass" className="p-6 mb-8">
                <h2 className="text-xl md:text-2xl font-serif sacred-text-enhanced mb-6 text-center">
                  {currentQuestionData.text}
                </h2>
              </SacredCard>

              {/* Answer Options */}
              <div className="space-y-4">
                {currentQuestionData.options.map((option, index) => (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + (index * 0.1) }}
                  >
                    <SacredCard
                      variant="enhanced"
                      className={`p-6 cursor-pointer transition-all duration-300 ${
                        answers[currentQuestionData.id] === option.value
                          ? 'sacred-selected ring-2 ring-blue-400 transform scale-105'
                          : 'hover:shadow-lg hover:scale-102'
                      }`}
                      onClick={() => handleAnswer(currentQuestionData.id, option.value)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          answers[currentQuestionData.id] === option.value
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-slate-300'
                        }`}>
                          {answers[currentQuestionData.id] === option.value && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                              className="w-2 h-2 bg-white rounded-full"
                            />
                          )}
                        </div>
                        <span className="sacred-text-body text-base leading-relaxed">
                          {option.label}
                        </span>
                      </div>
                    </SacredCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-between items-center"
            >
              <SacredButton
                onClick={handlePrevious}
                variant="ghost"
                className="px-8 py-3"
              >
                ← {currentQuestion === 0 ? 'Previous' : 'Previous Question'}
              </SacredButton>
              
              <div className="text-center">
                <SacredButton
                  onClick={handleNext}
                  variant="primary"
                  disabled={!isAnswered}
                  className="px-12 py-3 text-lg font-semibold"
                >
                  {currentQuestion === questions.length - 1 ? 'Continue Journey' : 'Next Question'} →
                </SacredButton>
                
                {!isAnswered && (
                  <p className="sacred-text-muted text-sm mt-2">
                    Please select an answer to continue
                  </p>
                )}
              </div>

              <div className="w-24"> {/* Spacer for alignment */}</div>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentStep;