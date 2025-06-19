
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
          className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-sacred-blue-400/20 rounded-full blur-2xl"
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
                Renewed: The{' '}
                <span className="bg-sacred-gradient bg-clip-text text-transparent">
                  New Man Story
                </span>
              </h1>
              <p className="text-sacred-blue-600 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto">
                An interactive guidebook experience for spiritual transformation, personal growth, and discovering your renewed self.
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
                  <span className="text-white text-2xl">📖</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Interactive Guidebook</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Navigate through spiritual principles and teachings with an immersive reading experience
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-gold-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">🎧</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Full Audiobook</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Listen to the complete audiobook experience with high-quality narration and reflection moments
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sacred-purple-gradient flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl">✨</span>
                </div>
                <h3 className="text-xl font-serif text-sacred-blue-900 mb-2">Personal Journey</h3>
                <p className="text-sacred-blue-600 text-sm leading-relaxed">
                  Track your progress and create a personalized path through your spiritual transformation
                </p>
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center space-y-4"
            >
              {user ? (
                <>
                  <SacredButton
                    onClick={() => router.push('/dashboard')}
                    variant="gold"
                    size="lg"
                    className="px-8 py-4 text-lg mr-4"
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
                    <SacredButton
                      variant="gold"
                      size="lg"
                      className="px-8 py-4 text-lg mr-4"
                    >
                      Begin Your Journey ✨
                    </SacredButton>
                  </Link>
                  <Link href="/login">
                    <SacredButton
                      variant="primary"
                      size="lg"
                      className="px-8 py-4 text-lg"
                    >
                      Continue Reading 📖
                    </SacredButton>
                  </Link>
                </>
              )}
              <p className="text-sacred-blue-600 text-sm mt-4">
                {user 
                  ? "Welcome back! Your spiritual transformation continues."
                  : "Join thousands on their journey of spiritual growth and renewal."
                }
              </p>
            </motion.div>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
}
