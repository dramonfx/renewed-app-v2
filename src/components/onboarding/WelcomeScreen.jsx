
'use client';
import { motion } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/6 w-32 h-32 bg-sacred-gold-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-sacred-purple-400/20 rounded-full blur-2xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <div className="w-full max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <SacredCard variant="heavy" className="p-12 md:p-16">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-sacred-blue-900 mb-4 leading-tight">
                Welcome to Your{' '}
                <span className="bg-sacred-gradient bg-clip-text text-transparent">
                  Sacred Journey
                </span>
              </h1>
              <p className="text-sacred-blue-600 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
                Discover a path of transformation, peace, and renewal designed specifically for your spiritual growth and inner awakening.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid md:grid-cols-3 gap-8 mb-10"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🕊️</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Peaceful Experience</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Find tranquility through guided meditations and calming spiritual practices that nurture your soul
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Sacred Security</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Build confidence in your spiritual journey with trusted guidance and unwavering support
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Guided Renewal</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Transform your life with structured pathways to personal and spiritual enlightenment
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center"
            >
              <SacredButton
                onClick={onNext}
                variant="primary"
                size="lg"
                className="px-8 py-4 text-lg"
              >
                Begin Your Journey ✨
              </SacredButton>
              <p className="text-sacred-blue-600 text-sm mt-4">
                Embrace the transformation from your old self to your renewed self
              </p>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
