'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

/**
 * Welcome Portal - Enhanced Welcome Experience
 * Sacred threshold between ordinary and extraordinary consciousness
 */
const WelcomePortal = ({ onNext, journeyData = {} }) => {
  const [portalPhase, setPortalPhase] = useState('approach');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Portal opening sequence
    const sequence = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPortalPhase('invitation');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPortalPhase('threshold');
      setIsReady(true);
    };
    sequence();
  }, []);

  const handleCrossThreshold = () => {
    setPortalPhase('crossing');
    setTimeout(() => {
      onNext({ startedAt: new Date().toISOString() });
    }, 1500);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Sacred Portal Background */}
      <div className="pointer-events-none absolute inset-0">
        <PortalBackground phase={portalPhase} />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl text-center">
        {/* Approach Phase */}
        {portalPhase === 'approach' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <SacredCard variant="heavy" className="p-12 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className="relative mx-auto mb-8 h-32 w-32">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-sacred-gold-300/30"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-2 border-sacred-purple-300/40"
                  />
                  <div className="absolute inset-6 flex items-center justify-center rounded-full bg-sacred-gradient shadow-2xl">
                    <span className="text-4xl text-white">🌟</span>
                  </div>
                </div>
                <h1 className="mb-4 font-serif text-4xl leading-tight text-sacred-blue-900 md:text-6xl">
                  You Stand Before the{' '}
                  <span className="bg-sacred-gradient bg-clip-text text-transparent">
                    Sacred Portal
                  </span>
                </h1>
                <p className="text-xl leading-relaxed text-sacred-blue-600 md:text-2xl">
                  A threshold between who you have been and who you are becoming
                </p>
              </motion.div>
            </SacredCard>
          </motion.div>
        )}

        {/* Invitation Phase */}
        {portalPhase === 'invitation' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          >
            <SacredCard variant="heavy" className="p-12 md:p-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="animate-sacred-pulse mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sacred-gradient shadow-2xl">
                  <span className="text-3xl text-white">✨</span>
                </div>
                <h2 className="mb-6 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                  This Journey Will Transform You
                </h2>
                <div className="mb-10 grid gap-8 md:grid-cols-3">
                  <SacredPromise
                    icon="🕊️"
                    title="Find Peace"
                    description="Release the burdens of your old mind and discover tranquility within"
                    delay={0.1}
                  />
                  <SacredPromise
                    icon="🛡️"
                    title="Gain Clarity"
                    description="See through illusion and connect with your authentic truth"
                    delay={0.3}
                  />
                  <SacredPromise
                    icon="⭐"
                    title="Embrace Renewal"
                    description="Step into the fullness of your spiritual potential"
                    delay={0.5}
                  />
                </div>
                <p className="text-lg leading-relaxed text-sacred-blue-600">
                  Beyond this portal lies a journey of sacred transformation— from the reactive
                  patterns of the natural mind to the conscious wisdom of the spiritual mind.
                </p>
              </motion.div>
            </SacredCard>
          </motion.div>
        )}

        {/* Threshold Phase */}
        {portalPhase === 'threshold' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <SacredCard variant="heavy" className="p-12 md:p-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="relative mx-auto mb-8 h-28 w-28">
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute inset-0 rounded-full bg-sacred-gradient shadow-2xl"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl text-white">🚪</span>
                  </div>
                </div>

                <h2 className="mb-6 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                  Are You Ready to Cross the Threshold?
                </h2>

                <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-sacred-blue-600">
                  This sacred journey will guide you through the deepest questions of existence,
                  help you choose your path of transformation, and set intentions that will
                  illuminate your way forward.
                </p>

                <SacredCommitment />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="mt-10"
                >
                  <SacredButton
                    onClick={handleCrossThreshold}
                    disabled={!isReady}
                    variant="primary"
                    size="lg"
                    className="px-12 py-4 text-xl shadow-2xl"
                  >
                    Cross the Sacred Threshold ✨
                  </SacredButton>
                  <p className="mt-4 text-sm text-sacred-blue-500">
                    Your transformation begins with a single sacred step
                  </p>
                </motion.div>
              </motion.div>
            </SacredCard>
          </motion.div>
        )}

        {/* Crossing Phase */}
        {portalPhase === 'crossing' && (
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="text-center"
          >
            <SacredCard variant="heavy" className="p-16">
              <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-sacred-gradient shadow-2xl">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className="text-5xl text-white"
                >
                  ✨
                </motion.span>
              </div>
              <h2 className="mb-4 font-serif text-3xl text-sacred-blue-900">
                Crossing Into Sacred Space...
              </h2>
              <p className="text-lg text-sacred-blue-600">
                Your journey of transformation begins now
              </p>
            </SacredCard>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Sacred Promise Component
const SacredPromise = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
  >
    <SacredCard variant="glass" className="h-full p-6 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
        <span className="text-2xl text-white">{icon}</span>
      </div>
      <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">{title}</h3>
      <p className="text-sm leading-relaxed text-sacred-blue-600">{description}</p>
    </SacredCard>
  </motion.div>
);

// Sacred Commitment Component
const SacredCommitment = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.5 }}
  >
    <SacredCard variant="glass" className="mx-auto mb-8 max-w-2xl p-6">
      <h4 className="mb-4 font-serif text-lg text-sacred-blue-900">Sacred Commitment</h4>
      <p className="text-sm italic leading-relaxed text-sacred-blue-600">
        "I open my heart to transformation. I release my attachment to old patterns and embrace the
        wisdom that awaits. I trust in this sacred process and commit to walking this path with
        courage and authenticity."
      </p>
    </SacredCard>
  </motion.div>
);

// Portal Background Component
const PortalBackground = ({ phase }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sacred geometry that responds to phase */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: phase === 'threshold' ? 0.3 : 0.1,
          scale: phase === 'crossing' ? 1.5 : 1,
        }}
        transition={{ duration: 2 }}
      >
        {/* Sacred circles */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-sacred-gold-300/20"
              style={{
                width: `${100 + i * 100}px`,
                height: `${100 + i * 100}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 20 + i * 5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Portal energy */}
      {phase === 'threshold' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="absolute inset-0 bg-sacred-gradient"
          style={{
            background:
              'radial-gradient(circle at center, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
          }}
        />
      )}
    </div>
  );
};

export default WelcomePortal;
