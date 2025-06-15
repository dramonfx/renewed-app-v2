'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const CompletionStep = ({ onNext, onBack, formData, setFormData }) => {
  const router = useRouter();

  const handleComplete = () => {
    // Save onboarding completion to localStorage
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    localStorage.setItem('renewedOnboardingData', JSON.stringify(formData));
    
    // Navigate to the main app
    router.push('/book');
  };

  const getPersonalizedMessage = () => {
    const goals = formData.goals || [];
    const assessment = formData.assessment || {};
    
    if (goals.includes('reduce_anxiety')) {
      return "Your journey toward inner peace and mental clarity begins now.";
    } else if (goals.includes('increase_intuition')) {
      return "Trust in your inner wisdom will guide you forward.";
    } else if (goals.includes('authentic_self')) {
      return "Your authentic self is ready to emerge and shine.";
    }
    
    return "Your sacred transformation journey begins now.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center shadow-2xl mb-6 animate-sacred-glow">
            <div className="text-white text-6xl">🌟</div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-serif text-sacred-blue-900 mb-6"
        >
          Welcome to Your <span className="text-sacred-purple-600">Sacred Journey</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
          className="text-sacred-blue-700 text-lg md:text-xl mb-8 leading-relaxed"
        >
          {getPersonalizedMessage()}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: 'easeOut' }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-sacred-blue-200 mb-8"
        >
          <h3 className="text-xl font-serif text-sacred-blue-900 mb-4">Your Journey Summary</h3>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div>
              <h4 className="font-semibold text-sacred-blue-800 mb-2">Selected Goals:</h4>
              <ul className="text-sacred-blue-700 space-y-1">
                {(formData.goals || []).map((goalId) => {
                  const goalTitles = {
                    'reduce_anxiety': 'Reduce Anxiety & Overthinking',
                    'increase_intuition': 'Strengthen Intuition',
                    'emotional_balance': 'Emotional Balance',
                    'authentic_self': 'Connect with Authentic Self',
                    'mindful_living': 'Mindful Daily Living',
                    'creative_flow': 'Creative Expression'
                  };
                  return <li key={goalId}>• {goalTitles[goalId]}</li>;
                })}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sacred-blue-800 mb-2">What's Next:</h4>
              <ul className="text-sacred-blue-700 space-y-1">
                <li>• Access your personalized content</li>
                <li>• Begin with guided practices</li>
                <li>• Track your transformation</li>
                <li>• Connect with your inner wisdom</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: 'easeOut' }}
          onClick={handleComplete}
          className="bg-sacred-gradient text-white font-bold px-12 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
        >
          Begin Your Sacred Journey ✨
        </motion.button>
      </div>
    </div>
  );
};

export default CompletionStep;