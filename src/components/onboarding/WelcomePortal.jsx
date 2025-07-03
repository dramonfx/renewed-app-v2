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
    <div className=&quot;relative flex min-h-screen items-center justify-center overflow-hidden p-4&quot;>
      {/* Sacred Portal Background */}
      <div className=&quot;pointer-events-none absolute inset-0&quot;>
        <PortalBackground phase={portalPhase} />
      </div>

      <div className=&quot;relative z-10 mx-auto w-full max-w-5xl text-center&quot;>
        {/* Approach Phase */}
        {portalPhase === 'approach' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-12 md:p-16&quot;>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                <div className=&quot;relative mx-auto mb-8 h-32 w-32&quot;>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className=&quot;absolute inset-0 rounded-full border-4 border-sacred-gold-300/30&quot;
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                    className=&quot;absolute inset-2 rounded-full border-2 border-sacred-purple-300/40&quot;
                  />
                  <div className=&quot;absolute inset-6 flex items-center justify-center rounded-full bg-sacred-gradient shadow-2xl&quot;>
                    <span className=&quot;text-4xl text-white&quot;>🌟</span>
                  </div>
                </div>
                <h1 className=&quot;mb-4 font-serif text-4xl leading-tight text-sacred-blue-900 md:text-6xl&quot;>
                  You Stand Before the{' '}
                  <span className=&quot;bg-sacred-gradient bg-clip-text text-transparent&quot;>
                    Sacred Portal
                  </span>
                </h1>
                <p className=&quot;text-xl leading-relaxed text-sacred-blue-600 md:text-2xl&quot;>
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
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-12 md:p-16&quot;>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className=&quot;animate-sacred-pulse mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-sacred-gradient shadow-2xl&quot;>
                  <span className=&quot;text-3xl text-white&quot;>✨</span>
                </div>
                <h2 className=&quot;mb-6 font-serif text-3xl text-sacred-blue-900 md:text-4xl&quot;>
                  This Journey Will Transform You
                </h2>
                <div className=&quot;mb-10 grid gap-8 md:grid-cols-3&quot;>
                  <SacredPromise
                    icon=&quot;🕊️&quot;
                    title=&quot;Find Peace&quot;
                    description=&quot;Release the burdens of your old mind and discover tranquility within&quot;
                    delay={0.1}
                  />
                  <SacredPromise
                    icon=&quot;🛡️&quot;
                    title=&quot;Gain Clarity&quot;
                    description=&quot;See through illusion and connect with your authentic truth&quot;
                    delay={0.3}
                  />
                  <SacredPromise
                    icon=&quot;⭐&quot;
                    title=&quot;Embrace Renewal&quot;
                    description=&quot;Step into the fullness of your spiritual potential&quot;
                    delay={0.5}
                  />
                </div>
                <p className=&quot;text-lg leading-relaxed text-sacred-blue-600&quot;>
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
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-12 md:p-16&quot;>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className=&quot;relative mx-auto mb-8 h-28 w-28&quot;>
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
                    className=&quot;absolute inset-0 rounded-full bg-sacred-gradient shadow-2xl&quot;
                  />
                  <div className=&quot;absolute inset-0 flex items-center justify-center&quot;>
                    <span className=&quot;text-4xl text-white&quot;>🚪</span>
                  </div>
                </div>

                <h2 className=&quot;mb-6 font-serif text-3xl text-sacred-blue-900 md:text-4xl&quot;>
                  Are You Ready to Cross the Threshold?
                </h2>

                <p className=&quot;mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-sacred-blue-600&quot;>
                  This sacred journey will guide you through the deepest questions of existence,
                  help you choose your path of transformation, and set intentions that will
                  illuminate your way forward.
                </p>

                <SacredCommitment />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className=&quot;mt-10&quot;
                >
                  <SacredButton
                    onClick={handleCrossThreshold}
                    disabled={!isReady}
                    variant=&quot;primary&quot;
                    size=&quot;lg&quot;
                    className=&quot;px-12 py-4 text-xl shadow-2xl&quot;
                  >
                    Cross the Sacred Threshold ✨
                  </SacredButton>
                  <p className=&quot;mt-4 text-sm text-sacred-blue-500&quot;>
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
            className=&quot;text-center&quot;
          >
            <SacredCard variant=&quot;heavy&quot; className=&quot;p-16&quot;>
              <div className=&quot;mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-sacred-gradient shadow-2xl&quot;>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  className=&quot;text-5xl text-white&quot;
                >
                  ✨
                </motion.span>
              </div>
              <h2 className=&quot;mb-4 font-serif text-3xl text-sacred-blue-900&quot;>
                Crossing Into Sacred Space...
              </h2>
              <p className=&quot;text-lg text-sacred-blue-600&quot;>
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
    <SacredCard variant=&quot;glass&quot; className=&quot;h-full p-6 text-center&quot;>
      <div className=&quot;mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg&quot;>
        <span className=&quot;text-2xl text-white&quot;>{icon}</span>
      </div>
      <h3 className=&quot;mb-3 font-serif text-xl text-sacred-blue-900&quot;>{title}</h3>
      <p className=&quot;text-sm leading-relaxed text-sacred-blue-600&quot;>{description}</p>
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
    <SacredCard variant=&quot;glass&quot; className=&quot;mx-auto mb-8 max-w-2xl p-6&quot;>
      <h4 className=&quot;mb-4 font-serif text-lg text-sacred-blue-900&quot;>Sacred Commitment</h4>
      <p className=&quot;text-sm italic leading-relaxed text-sacred-blue-600&quot;>
        &quot;I open my heart to transformation. I release my attachment to old patterns and embrace the
        wisdom that awaits. I trust in this sacred process and commit to walking this path with
        courage and authenticity.&quot;
      </p>
    </SacredCard>
  </motion.div>
);

// Portal Background Component
const PortalBackground = ({ phase }) => {
  return (
    <div className=&quot;absolute inset-0 overflow-hidden&quot;>
      {/* Sacred geometry that responds to phase */}
      <motion.div
        className=&quot;absolute inset-0&quot;
        animate={{
          opacity: phase === 'threshold' ? 0.3 : 0.1,
          scale: phase === 'crossing' ? 1.5 : 1,
        }}
        transition={{ duration: 2 }}
      >
        {/* Sacred circles */}
        <div className=&quot;absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform&quot;>
          {Array.from({ length: 5 }, (_, i) => (
            <motion.div
              key={i}
              className=&quot;absolute rounded-full border border-sacred-gold-300/20&quot;
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
          className=&quot;absolute inset-0 bg-sacred-gradient&quot;
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
