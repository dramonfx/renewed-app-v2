
'use client';
import { motion } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
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
              <h1 className="mb-4 font-serif text-4xl leading-tight text-sacred-blue-900 md:text-5xl lg:text-6xl">
                Welcome to Your{' '}
                <span className="bg-sacred-gradient bg-clip-text text-transparent">
                  Sacred Journey
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-sacred-blue-600 md:text-2xl">
                Discover a path of transformation, peace, and renewal designed specifically for your
                spiritual growth and inner awakening.
              </p>
            </motion.div>
          </SacredCard>
        </motion.div>

        {/* Features - Unified Tile Approach */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8">
            <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900 text-center">Sacred Journey Features</h2>
            <div className="grid gap-6 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <SacredCard variant="glass" className="h-full p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                    <span className="text-2xl text-white">🕊️</span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">
                    Peaceful Experience
                  </h3>
                  <p className="text-sm leading-relaxed text-sacred-blue-600">
                    Find tranquility through guided meditations and calming spiritual practices that
                    nurture your soul
                  </p>
                </SacredCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
              >
                <SacredCard variant="glass" className="h-full p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gold-gradient shadow-lg">
                    <span className="text-2xl text-white">🛡️</span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">Sacred Security</h3>
                  <p className="text-sm leading-relaxed text-sacred-blue-600">
                    Build confidence in your spiritual journey with trusted guidance and unwavering
                    support
                  </p>
                </SacredCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
              >
                <SacredCard variant="glass" className="h-full p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-purple-gradient shadow-lg">
                    <span className="text-2xl text-white">⭐</span>
                  </div>
                  <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">Guided Renewal</h3>
                  <p className="text-sm leading-relaxed text-sacred-blue-600">
                    Transform your life with structured pathways to personal and spiritual
                    enlightenment
                  </p>
                </SacredCard>
              </motion.div>
            </div>
          </SacredCard>
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
            <p className="mt-4 text-sm text-sacred-blue-600">
              Embrace the transformation from your old self to your renewed self
            </p>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
