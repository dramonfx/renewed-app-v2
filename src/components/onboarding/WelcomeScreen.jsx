'use client';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const WelcomeScreen = ({ onNext }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Enhanced Sacred Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary Divine Light */}
        <motion.div
          className="absolute top-1/4 left-1/6 w-40 h-40 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(250, 207, 81, 0.4) 0%, rgba(14, 165, 233, 0.2) 50%, transparent 100%)',
          }}
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 0.8, 0.4],
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Secondary Sacred Glow */}
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-56 h-56 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(147, 51, 234, 0.2) 50%, transparent 100%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Sacred Particles */}
        {mounted && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `radial-gradient(circle, rgba(250, 207, 81, 0.8) 0%, transparent 70%)`,
              left: `${20 + (i * 10)}%`,
              top: `${30 + (i * 5)}%`,
            }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 6 + (i * 0.5),
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-5xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
        >
          <SacredCard variant="heavy" className="p-12 md:p-20 sacred-breathing">
            {/* Sacred Threshold Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12"
            >
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif sacred-text-enhanced mb-6 leading-tight">
                Welcome to Your{' '}
                <motion.span 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 bg-clip-text text-transparent"
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
                  Sacred Journey
                </motion.span>
              </h1>
              <motion.p 
                className="sacred-text-body text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Step through this sacred threshold into a transformative experience of peace, renewal, 
                and spiritual awakening designed to guide you from limitation to divine possibility.
              </motion.p>
            </motion.div>

            {/* Sacred Pillars - Enhanced with Living Glassmorphism */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid md:grid-cols-3 gap-8 mb-12"
            >
              {[
                {
                  icon: '🕊️',
                  title: 'Divine Peace',
                  description: 'Experience profound tranquility through sacred practices that quiet the mind and open the heart to divine presence',
                  gradient: 'from-blue-500 to-cyan-400',
                  delay: 0.1
                },
                {
                  icon: '🛡️', 
                  title: 'Sacred Security',
                  description: 'Find unshakeable confidence in your spiritual identity, rooted in divine love and eternal promises',
                  gradient: 'from-amber-500 to-orange-400',
                  delay: 0.2
                },
                {
                  icon: '⭐',
                  title: 'Living Transformation',
                  description: 'Embrace the ongoing renewal of your mind and spirit through structured pathways to divine enlightenment',
                  gradient: 'from-purple-500 to-pink-400',
                  delay: 0.3
                }
              ].map((pillar, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: pillar.delay }}
                >
                  <SacredCard variant="enhanced" className="p-8 h-full text-center group">
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${pillar.gradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <span className="text-white text-3xl">{pillar.icon}</span>
                    </motion.div>
                    <h3 className="text-2xl font-serif sacred-text-enhanced mb-4">{pillar.title}</h3>
                    <p className="sacred-text-body text-sm leading-relaxed">
                      {pillar.description}
                    </p>
                  </SacredCard>
                </motion.div>
              ))}
            </motion.div>

            {/* Sacred Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <SacredButton
                  onClick={onNext}
                  variant="primary"
                  size="lg"
                  className="px-12 py-5 text-xl font-semibold shadow-2xl hover:shadow-3xl"
                >
                  Cross the Sacred Threshold ✨
                </SacredButton>
              </motion.div>
              <motion.p 
                className="sacred-text-muted text-base mt-6 max-w-lg mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                Your journey from the natural mind of limitation to the spiritual mind of divine possibility begins here
              </motion.p>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;