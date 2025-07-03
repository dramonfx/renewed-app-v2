'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  // Check if user is authenticated and redirect accordingly
  useEffect(() => {
    if (user) {
      // Check if onboarding is completed
      const isCompleted = localStorage.getItem('renewedOnboardingCompleted');
      if (!isCompleted) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4">
      {/* Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="left-1/6 absolute top-1/4 h-32 w-32 rounded-full bg-sacred-gold-400/20 blur-2xl"
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
          className="right-1/6 absolute bottom-1/4 h-48 w-48 rounded-full bg-sacred-blue-400/20 blur-2xl"
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

      <div className="mx-auto w-full max-w-4xl text-center">
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
              <h1 className="mb-4 font-serif text-4xl leading-tight text-sacred-blue-900 md:text-5xl lg:text-6xl">
                Renewed: The{' '}
                <span className="bg-sacred-gradient bg-clip-text text-transparent">
                  New Man Story
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-sacred-blue-600 md:text-2xl">
                An interactive guidebook experience for spiritual transformation, personal growth,
                and discovering your renewed self.
              </p>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-10 grid gap-8 md:grid-cols-3"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                  <span className="text-2xl text-white">📖</span>
                </div>
                <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">
                  Interactive Guidebook
                </h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Navigate through spiritual principles and teachings with an immersive reading
                  experience
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gold-gradient shadow-lg">
                  <span className="text-2xl text-white">🎧</span>
                </div>
                <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">Full Audiobook</h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Listen to the complete audiobook experience with high-quality narration and
                  reflection moments
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-purple-gradient shadow-lg">
                  <span className="text-2xl text-white">✨</span>
                </div>
                <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">Personal Journey</h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Track your progress and create a personalized path through your spiritual
                  transformation
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4 text-center"
            >
              {user ? (
                <>
                  <SacredButton
                    onClick={() => router.push('/dashboard')}
                    variant="gold"
                    size="lg"
                    className="mr-4 px-8 py-4 text-lg"
                  >
                    Continue Your Journey ✨
                  </SacredButton>
                  <SacredButton
                    onClick={() => router.push('/book')}
                    variant="primary"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Open Guidebook 📖
                  </SacredButton>
                </>
              ) : (
                <>
                  <Link href="/signup">
                    <SacredButton variant="gold" size="lg" className="mr-4 px-8 py-4 text-lg">
                      Begin Your Journey ✨
                    </SacredButton>
                  </Link>
                  <Link href="/login">
                    <SacredButton variant="primary" size="lg" className="px-8 py-4 text-lg">
                      Continue Reading 📖
                    </SacredButton>
                  </Link>
                </>
              )}
              <p className="mt-4 text-sm text-sacred-blue-600">
                {user
                  ? 'Welcome back! Your spiritual transformation continues.'
                  : 'Join thousands on their journey of spiritual growth and renewal.'}
              </p>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
