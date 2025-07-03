&apos;use client&apos;;
import { motion } from &apos;framer-motion&apos;;
import { useEffect, useState } from &apos;react&apos;;
import SacredCard from &apos;@/components/ui/sacred-card&apos;;
import SacredButton from &apos;@/components/ui/sacred-button&apos;;

const CompletionStep = ({ onboardingData = {}, data = {} }) => {
  // Use onboardingData if available, fallback to data prop
  const safeData = onboardingData || data || {};

  const getPathInfo = () => {
    const pathMap = {
      gentle: { name: &apos;The Gentle Path&apos;, icon: &apos;🌱&apos;, color: &apos;sacred-gold&apos; },
      balanced: { name: &apos;The Balanced Path&apos;, icon: &apos;⚖️&apos;, color: &apos;sacred-blue&apos; },
      intensive: { name: &apos;The Intensive Path&apos;, icon: &apos;🔥&apos;, color: &apos;sacred-purple&apos; },
    };
    return pathMap[safeData.selectedPath] || pathMap.balanced;
  };

  const pathInfo = getPathInfo();
  const intentionCount = safeData.intentions?.length || 0;

  return (
    <div className="min-h-screen p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <SacredCard variant="heavy" className="p-8 md:p-12">
            <div className="flex items-center justify-between">
              <div className="w-full text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                  <span className="text-3xl text-white">{pathInfo.icon}</span>
                </div>
                <h1 className="mb-4 font-serif text-3xl text-sacred-blue-900 md:text-4xl">
                  Welcome to Your{&apos; &apos;}
                  <span className="bg-sacred-gradient bg-clip-text text-transparent">
                    Sacred Journey
                  </span>
                </h1>
                <p className="text-lg text-sacred-blue-600">
                  Your transformation begins now. You&apos;re ready to embark on this sacred path of
                  renewal.
                </p>
              </div>
            </div>
          </SacredCard>
        </motion.div>

        {/* Path Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">
            Your Sacred Path Summary
          </h2>
          <SacredCard variant="heavy" className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Selected Path */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="rounded-lg border border-sacred-gold-200 bg-sacred-gold-50 p-4"
              >
                <h3 className="mb-3 font-serif text-lg text-sacred-blue-900">Chosen Path</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                    <span className="text-xl text-white">{pathInfo.icon}</span>
                  </div>
                  <span className="font-medium text-sacred-blue-900">{pathInfo.name}</span>
                </div>
              </motion.div>

              {/* Intentions Count */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="rounded-lg border border-sacred-purple-200 bg-sacred-purple-50 p-4"
              >
                <h3 className="mb-3 font-serif text-lg text-sacred-blue-900">Sacred Intentions</h3>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sacred-purple-gradient shadow-lg">
                    <span className="text-xl text-white">🎯</span>
                  </div>
                  <span className="font-medium text-sacred-blue-900">
                    {intentionCount} {intentionCount === 1 ? &apos;Intention&apos; : &apos;Intentions&apos;} Set
                  </span>
                </div>
              </motion.div>

              {/* Personal Info - only if data exists */}
              {safeData.name && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="bg-sacred-teal-50 border-sacred-teal-200 rounded-lg border p-4"
                >
                  <h3 className="mb-3 font-serif text-lg text-sacred-blue-900">Sacred Name</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-sacred-teal-gradient flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                      <span className="text-xl text-white">✨</span>
                    </div>
                    <span className="font-medium text-sacred-blue-900">{safeData.name}</span>
                  </div>
                </motion.div>
              )}

              {/* Experience Level */}
              {safeData.experience && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="bg-sacred-rose-50 border-sacred-rose-200 rounded-lg border p-4"
                >
                  <h3 className="mb-3 font-serif text-lg text-sacred-blue-900">Experience Level</h3>
                  <div className="flex items-center gap-3">
                    <div className="bg-sacred-rose-gradient flex h-12 w-12 items-center justify-center rounded-full shadow-lg">
                      <span className="text-xl text-white">🌟</span>
                    </div>
                    <span className="font-medium capitalize text-sacred-blue-900">
                      {safeData.experience}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </SacredCard>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900">What Happens Next?</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <SacredCard variant="glass" className="h-full p-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg">
                  <span className="text-2xl text-white">📚</span>
                </div>
                <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">
                  Personalized Content
                </h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Receive teachings and content tailored specifically to your chosen path and
                  spiritual journey
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
                  <span className="text-2xl text-white">📝</span>
                </div>
                <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">Sacred Journal</h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Track your spiritual growth and transformation through guided journaling and
                  reflection
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
                  <span className="text-2xl text-white">🎯</span>
                </div>
                <h3 className="mb-3 font-serif text-xl text-sacred-blue-900">Guided Practice</h3>
                <p className="text-sm leading-relaxed text-sacred-blue-600">
                  Daily exercises and practices designed to support your spiritual transformation
                  goals
                </p>
              </SacredCard>
            </motion.div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <SacredCard variant="glass" className="p-8">
            <SacredButton
              onClick={() => {
                // Store completion in localStorage
                if (typeof window !== &apos;undefined&apos;) {
                  localStorage.setItem(&apos;renewedOnboardingCompleted&apos;, &apos;true&apos;);
                  localStorage.setItem(&apos;renewedOnboardingData&apos;, JSON.stringify(safeData));
                  // Redirect to dashboard
                  window.location.href = &apos;/dashboard&apos;;
                }
              }}
              variant="gold"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              Begin Your Sacred Journey ✨
            </SacredButton>
            <p className="mt-4 text-sm text-sacred-blue-600">
              Your personalized dashboard and spiritual toolkit await you.
            </p>
          </SacredCard>
        </motion.div>
      </div>
    </div>
  );
};

export default CompletionStep;
