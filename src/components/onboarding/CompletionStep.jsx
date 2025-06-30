'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const CompletionStep = ({ onBack }) => {
  const router = useRouter();
  const [userData, setUserData] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Gather all onboarding data
    const mindChoice = localStorage.getItem('renewedMindChoice');
    const assessment = JSON.parse(localStorage.getItem('renewedAssessment') || '{}');
    const selectedPath = localStorage.getItem('renewedSelectedPath');
    const intentions = JSON.parse(localStorage.getItem('renewedIntentions') || '{}');

    setUserData({
      mindChoice,
      assessment,
      selectedPath,
      intentions
    });
  }, []);

  const handleEnterSanctuary = () => {
    // Mark onboarding as completed
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    
    // Navigate to dashboard (Sanctuary)
    router.push('/dashboard');
  };

  const pathNames = {
    foundation: 'Foundation Builder',
    accelerated: 'Accelerated Growth',
    sustainable: 'Sustainable Journey'
  };

  const celebrationElements = [
    { icon: '✨', delay: 0.2 },
    { icon: '🌟', delay: 0.4 },
    { icon: '💫', delay: 0.6 },
    { icon: '⭐', delay: 0.8 },
    { icon: '🌙', delay: 1.0 }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Celebratory Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {mounted && celebrationElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
            }}
            initial={{ opacity: 0, scale: 0, rotate: 0 }}
            animate={{ 
              opacity: [0, 1, 0.8, 0],
              scale: [0, 1.2, 1, 0.8],
              rotate: [0, 180, 360],
              y: [0, -50, -100]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: element.delay,
              ease: 'easeOut',
            }}
          >
            {element.icon}
          </motion.div>
        ))}

        {/* Golden Light of Completion */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(250, 207, 81, 0.3) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 100%)',
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="w-full max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <SacredCard variant="heavy" className="p-12 md:p-20">
            {/* Triumphant Arrival Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <motion.div
                className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl"
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <span className="text-white text-6xl">👑</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif sacred-text-enhanced mb-6 leading-tight">
                Sacred Threshold{' '}
                <motion.span 
                  className="bg-gradient-to-r from-amber-500 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: 'linear' 
                  }}
                  style={{ backgroundSize: '200% 200%' }}
                >
                  Crossed!
                </motion.span>
              </h1>
              
              <motion.p 
                className="sacred-text-body text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Congratulations! You have successfully crossed the sacred threshold. 
                Your spiritual journey is now perfectly aligned and ready to unfold.
              </motion.p>
            </motion.div>

            {/* Sacred Journey Summary */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="grid md:grid-cols-2 gap-8 mb-12"
            >
              {/* Your Sacred Path */}
              <SacredCard variant="enhanced" className="p-8 text-left">
                <h3 className="text-2xl font-serif sacred-text-enhanced mb-6 text-center">
                  Your Sacred Path
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="sacred-text-muted">Chosen Path:</span>
                    <span className="sacred-text-enhanced font-semibold">
                      {pathNames[userData.selectedPath] || 'Foundation Builder'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="sacred-text-muted">Mind Focus:</span>
                    <span className="sacred-text-enhanced font-semibold capitalize">
                      {userData.mindChoice === 'spiritual' ? 'Spiritual Mind' : 'Natural Mind'} → Spiritual Mind
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="sacred-text-muted">Readiness Level:</span>
                    <span className="sacred-text-enhanced font-semibold capitalize">
                      {userData.assessment?.transformation_readiness || 'Ready'}
                    </span>
                  </div>
                </div>
              </SacredCard>

              {/* Your Sacred Intentions */}
              <SacredCard variant="enhanced" className="p-8 text-left">
                <h3 className="text-2xl font-serif sacred-text-enhanced mb-6 text-center">
                  Your Sacred Intentions
                </h3>
                <div className="space-y-4">
                  <div>
                    <span className="sacred-text-muted text-sm">Primary Intention:</span>
                    <p className="sacred-text-body text-sm mt-1 leading-relaxed">
                      {userData.intentions?.primaryIntention || 'To grow spiritually and find peace'}
                    </p>
                  </div>
                  <div>
                    <span className="sacred-text-muted text-sm">Daily Commitment:</span>
                    <p className="sacred-text-body text-sm mt-1 leading-relaxed">
                      {userData.intentions?.dailyCommitment || 'Daily meditation and prayer'}
                    </p>
                  </div>
                </div>
              </SacredCard>
            </motion.div>

            {/* Sacred Transition Message */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mb-12"
            >
              <SacredCard variant="glass" className="p-8">
                <h3 className="text-2xl font-serif sacred-text-enhanced mb-4">
                  Welcome to Your Sacred Sanctuary
                </h3>
                <p className="sacred-text-body text-lg leading-relaxed">
                  You are now ready to enter your personal spiritual sanctuary – a sacred space where 
                  you will practice, study, and continue your transformation. This is your home base 
                  for the infinite journey of spiritual growth that lies ahead.
                </p>
              </SacredCard>
            </motion.div>

            {/* Enter Sanctuary */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SacredButton
                  onClick={handleEnterSanctuary}
                  variant="primary"
                  size="lg"
                  className="px-16 py-6 text-2xl font-semibold shadow-2xl hover:shadow-3xl bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  Enter Your Sacred Sanctuary 🏛️
                </SacredButton>
              </motion.div>
              
              <motion.p 
                className="sacred-text-muted text-base mt-6 max-w-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                Your transformation continues in the sanctuary – a place of peace, practice, and ongoing renewal
              </motion.p>

              {/* Alternative Back Option */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.5 }}
                className="mt-8"
              >
                <SacredButton
                  onClick={onBack}
                  variant="ghost"
                  className="px-6 py-2 text-sm"
                >
                  ← Review Intentions
                </SacredButton>
              </motion.div>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionStep;