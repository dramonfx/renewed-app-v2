'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiEye, FiHeart } from 'react-icons/fi';
import GlassCard from './GlassCard';

const ASSESSMENT_QUESTIONS = [
  {
    id: 'daily-reactions',
    question: 'When faced with unexpected challenges, I typically...',
    options: [
      { text: 'React with frustration and try to control the situation', mind: 'natural', weight: 3 },
      { text: 'Feel stressed but try to find a logical solution', mind: 'natural', weight: 2 },
      { text: 'Take a breath and look for the lesson or opportunity', mind: 'spiritual', weight: 2 },
      { text: 'Trust that everything happens for a reason and flow with it', mind: 'spiritual', weight: 3 }
    ]
  },
  {
    id: 'self-worth',
    question: 'My sense of worth comes primarily from...',
    options: [
      { text: 'What others think of me and my achievements', mind: 'natural', weight: 3 },
      { text: 'Comparing myself to others and coming out ahead', mind: 'natural', weight: 3 },
      { text: 'My inner knowing and connection to something greater', mind: 'spiritual', weight: 3 },
      { text: 'The love I give and receive, regardless of circumstances', mind: 'spiritual', weight: 3 }
    ]
  },
  {
    id: 'relationships',
    question: 'In relationships, I tend to...',
    options: [
      { text: 'Judge others and try to change them', mind: 'natural', weight: 3 },
      { text: 'Keep score of who gives more in the relationship', mind: 'natural', weight: 2 },
      { text: 'Accept others as they are while maintaining boundaries', mind: 'spiritual', weight: 2 },
      { text: 'See the divine in everyone, even when they hurt me', mind: 'spiritual', weight: 3 }
    ]
  },
  {
    id: 'decision-making',
    question: 'When making important decisions, I...',
    options: [
      { text: 'Analyze every possible outcome and try to control results', mind: 'natural', weight: 3 },
      { text: 'Worry about making the "wrong" choice', mind: 'natural', weight: 2 },
      { text: 'Listen to my intuition and trust my inner guidance', mind: 'spiritual', weight: 2 },
      { text: 'Surrender to divine will and trust the process', mind: 'spiritual', weight: 3 }
    ]
  },
  {
    id: 'suffering',
    question: 'When I experience pain or suffering, I...',
    options: [
      { text: 'Ask "Why me?" and feel like a victim', mind: 'natural', weight: 3 },
      { text: 'Try to fix or escape the situation quickly', mind: 'natural', weight: 2 },
      { text: 'Look for the growth opportunity in the experience', mind: 'spiritual', weight: 2 },
      { text: 'Accept it as part of my spiritual journey and find peace within it', mind: 'spiritual', weight: 3 }
    ]
  }
];

export default function CurrentStateAssessment({ onNext, onPrev, onDataUpdate, data }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState(data.assessmentAnswers || []);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedOption;
      setAnswers(newAnswers);
      
      if (currentQuestion < ASSESSMENT_QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(newAnswers[currentQuestion + 1] || null);
      } else {
        calculateResult(newAnswers);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(answers[currentQuestion - 1] || null);
    } else {
      onPrev();
    }
  };

  const calculateResult = (finalAnswers) => {
    let naturalScore = 0;
    let spiritualScore = 0;
    
    finalAnswers.forEach(answer => {
      if (answer.mind === 'natural') {
        naturalScore += answer.weight;
      } else {
        spiritualScore += answer.weight;
      }
    });
    
    const dominantMind = naturalScore > spiritualScore ? 'natural' : 'spiritual';
    const balance = Math.abs(naturalScore - spiritualScore);
    
    onDataUpdate({
      assessmentAnswers: finalAnswers,
      currentMind: dominantMind,
      mindBalance: { natural: naturalScore, spiritual: spiritualScore, balance }
    });
    
    onNext();
  };

  const question = ASSESSMENT_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / ASSESSMENT_QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-serif text-gray-800 dark:text-gray-100 mb-4"
            >
              Sacred Self-Reflection
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600 dark:text-gray-400 mb-6"
            >
              Honestly reflect on your current patterns. There are no right or wrong answers.
            </motion.p>
            
            <div className="w-full max-w-md mx-auto bg-white/20 dark:bg-black/20 rounded-full h-2 mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Question {currentQuestion + 1} of {ASSESSMENT_QUESTIONS.length}
            </p>
          </div>

          <GlassCard className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h3 className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-100 mb-8 text-center leading-relaxed">
                  {question.question}
                </h3>

                <div className="space-y-4 mb-8">
                  {question.options.map((option, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleOptionSelect(option)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedOption === option
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 shadow-lg'
                          : 'border-transparent bg-white/50 dark:bg-white/5 hover:bg-white/70 dark:hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-1 transition-all duration-300 ${
                          selectedOption === option
                            ? 'border-indigo-500 bg-indigo-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedOption === option && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-3 h-3 rounded-full bg-white"
                            />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {option.text}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            {option.mind === 'natural' ? (
                              <FiEye className="w-4 h-4 text-orange-500" />
                            ) : (
                              <FiHeart className="w-4 h-4 text-indigo-500" />
                            )}
                            <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                              {option.mind} mind
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={handlePrevQuestion}
                    className="flex items-center gap-2 px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300"
                  >
                    <FiArrowLeft />
                    Back
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedOption}
                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                      selectedOption
                        ? 'bg-gradient-to-r from-indigo-500 to-amber-500 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {currentQuestion === ASSESSMENT_QUESTIONS.length - 1 ? 'Complete Assessment' : 'Next'}
                    <FiArrowRight />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}