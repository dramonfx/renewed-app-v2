'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';

const AssessmentStep = ({ onNext, onBack, formData, setFormData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState(formData.assessment || {});

  const questions = [
    {
      id: 'stress_response',
      question: 'When faced with stress, I typically:',
      options: [
        { value: 'analyze', label: 'Analyze the situation and make a plan' },
        { value: 'feel', label: 'Feel overwhelmed and need space to process' },
        { value: 'both', label: 'Experience both responses depending on the situation' }
      ]
    },
    {
      id: 'decision_making',
      question: 'When making important decisions, I rely more on:',
      options: [
        { value: 'logic', label: 'Logic and careful analysis' },
        { value: 'intuition', label: 'Gut feelings and intuition' },
        { value: 'balance', label: 'A balance of both logic and intuition' }
      ]
    },
    {
      id: 'life_satisfaction',
      question: 'Currently, I feel most challenged by:',
      options: [
        { value: 'overthinking', label: 'Overthinking and mental loops' },
        { value: 'disconnection', label: 'Feeling disconnected from my true self' },
        { value: 'balance', label: 'Finding balance between thinking and being' }
      ]
    }
  ];

  const handleAnswerSelect = (questionId, value) => {
    const newAnswers = { ...selectedAnswers, [questionId]: value };
    setSelectedAnswers(newAnswers);
    setFormData({ ...formData, assessment: newAnswers });
  };

  const canProceed = Object.keys(selectedAnswers).length === questions.length;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-xl mb-6">
            <div className="text-white text-4xl">📝</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-sacred-blue-900 mb-4">
            Self-Assessment
          </h1>
          <p className="text-sacred-blue-700 text-lg">
            Help us understand your current relationship with your two minds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="space-y-8"
        >
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sacred-blue-200">
              <h3 className="text-xl font-serif text-sacred-blue-900 mb-4">
                {index + 1}. {question.question}
              </h3>
              <div className="space-y-3">
                {question.options.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAnswers[question.id] === option.value
                        ? 'bg-sacred-blue-100 border-2 border-sacred-blue-600'
                        : 'bg-white/50 border border-sacred-blue-200 hover:bg-sacred-blue-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={option.value}
                      checked={selectedAnswers[question.id] === option.value}
                      onChange={() => handleAnswerSelect(question.id, option.value)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      selectedAnswers[question.id] === option.value
                        ? 'bg-sacred-blue-600 border-sacred-blue-600'
                        : 'border-sacred-blue-300'
                    }`}>
                      {selectedAnswers[question.id] === option.value && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span className="text-sacred-blue-800">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentStep;