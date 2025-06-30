'use client';
import { motion } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
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

          </SacredCard>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-serif text-sacred-blue-900 mb-6">Sacred Journey Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🕊️</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Peaceful Experience</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Find tranquility through guided meditations and calming spiritual practices that nurture your soul
                </p>
              </SacredCard>
            </motion.div>
              
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🛡️</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Sacred Security</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Build confidence in your spiritual journey with trusted guidance and unwavering support
                </p>
              </SacredCard>
            </motion.div>
              
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <SacredCard variant="glass" className="p-6 h-full text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Guided Renewal</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Transform your life with structured pathways to personal and spiritual enlightenment
                </p>
              </SacredCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <SacredCard variant="glass" className="p-8">
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
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;