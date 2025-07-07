
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

/**
 * Progressive Discovery Component
 * Reveals features and content gradually based on user progress and interactions
 */
export default function ProgressiveDiscovery({ userProgress = 0, onUnlock }) {
  const [discoveredFeatures, setDiscoveredFeatures] = useState([]);
  const [showSurprise, setShowSurprise] = useState(false);
  const [dailyInsight, setDailyInsight] = useState(null);

  // Spiritual insights that rotate daily
  const spiritualInsights = [
    "🌱 'The seed of transformation lies dormant until watered by intention.'",
    "✨ 'Every moment of awareness is a step closer to your renewed self.'",
    "🕊️ 'In stillness, we hear the whisper of our true nature.'",
    "🌅 'Each dawn brings the possibility of spiritual awakening.'",
    "💎 'Your struggles are the pressure that creates spiritual diamonds.'",
    "🌊 'Flow with grace, resist with wisdom, transform with love.'",
    "🔥 'The fire of transformation burns away what no longer serves.'",
    "🌟 'You are both the seeker and the light you seek.'"
  ];

  // Features that unlock based on progress
  const progressiveFeatures = [
    {
      id: 'audio_bookmarks',
      threshold: 10,
      title: 'Audio Bookmarks Discovered!',
      description: 'Save your favorite moments in any audio section',
      icon: '🔖',
      hint: 'Listen to audio for a few minutes to unlock bookmark features...'
    },
    {
      id: 'journey_insights',
      threshold: 25,
      title: 'Journey Insights Unlocked!',
      description: 'Personalized reflections based on your reading progress',
      icon: '💡',
      hint: 'Continue reading to unlock deeper insights...'
    },
    {
      id: 'transformation_tracker',
      threshold: 50,
      title: 'Transformation Tracker Activated!',
      description: 'Visualize your spiritual growth journey',
      icon: '📈',
      hint: 'Reach 50% progress to unlock transformation tracking...'
    },
    {
      id: 'wisdom_vault',
      threshold: 75,
      title: 'Wisdom Vault Accessible!',
      description: 'Archive of your key learnings and revelations',
      icon: '🗝️',
      hint: 'Advanced features await at 75% completion...'
    },
    {
      id: 'renewed_circle',
      threshold: 90,
      title: 'Renewed Circle Invitation!',
      description: 'Connect with fellow travelers on the transformation path',
      icon: '👥',
      hint: 'Something special awaits near journey\'s completion...'
    }
  ];

  // Set daily insight based on date
  useEffect(() => {
    const today = new Date().getDate();
    const insightIndex = today % spiritualInsights.length;
    setDailyInsight(spiritualInsights[insightIndex]);
  }, []);

  // Check for newly unlocked features
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('discoveredFeatures') || '[]');
    setDiscoveredFeatures(stored);

    progressiveFeatures.forEach(feature => {
      if (userProgress >= feature.threshold && !stored.includes(feature.id)) {
        // Feature just unlocked!
        const newDiscovered = [...stored, feature.id];
        setDiscoveredFeatures(newDiscovered);
        localStorage.setItem('discoveredFeatures', JSON.stringify(newDiscovered));
        
        // Trigger unlock celebration
        setTimeout(() => {
          onUnlock?.(feature);
          setShowSurprise(true);
          setTimeout(() => setShowSurprise(false), 3000);
        }, 1000);
      }
    });
  }, [userProgress, onUnlock]);

  // Find next feature to unlock
  const nextFeature = progressiveFeatures.find(f => 
    userProgress < f.threshold && !discoveredFeatures.includes(f.id)
  );

  const unlockedFeatures = progressiveFeatures.filter(f => 
    discoveredFeatures.includes(f.id)
  );

  return (
    <div className="space-y-6">
      {/* Daily Spiritual Insight */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="glass" className="p-4">
          <div className="text-center">
            <h3 className="mb-2 font-serif text-lg text-sacred-blue-900">Today's Insight</h3>
            <p className="text-sacred-blue-700 italic leading-relaxed">
              {dailyInsight}
            </p>
          </div>
        </SacredCard>
      </motion.div>

      {/* Surprise Unlock Animation */}
      <AnimatePresence>
        {showSurprise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <SacredCard variant="heavy" className="p-8 text-center max-w-md mx-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 0.6 }}
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-serif text-sacred-blue-900 mb-2">
                  New Feature Unlocked!
                </h2>
                <p className="text-sacred-blue-600">
                  Your spiritual journey has revealed new possibilities...
                </p>
              </motion.div>
            </SacredCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Feature Hint */}
      {nextFeature && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SacredCard variant="glass" className="p-4 border border-sacred-gold-300/50">
            <div className="flex items-center space-x-4">
              <div className="text-2xl opacity-50">{nextFeature.icon}</div>
              <div className="flex-1">
                <p className="text-sm text-sacred-blue-600 italic">
                  {nextFeature.hint}
                </p>
                <div className="mt-2 h-1 bg-sacred-blue-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sacred-gold-gradient"
                    initial={{ width: 0 }}
                    animate={{ width: `${(userProgress / nextFeature.threshold) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      )}

      {/* Unlocked Features Showcase */}
      {unlockedFeatures.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-4 font-serif text-xl text-sacred-blue-900">
            ✨ Discovered Features
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {unlockedFeatures.map((feature, index) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <SacredCard 
                  variant="glass" 
                  className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  hover
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">{feature.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sacred-blue-900 text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-sacred-blue-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Easter Egg Discovery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center"
      >
        <SacredCard variant="glass" className="p-3">
          <details className="cursor-pointer">
            <summary className="text-sm text-sacred-blue-600 hover:text-sacred-blue-800">
              🔍 Something hidden here...
            </summary>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 p-3 bg-sacred-gradient/10 rounded-lg"
            >
              <p className="text-xs text-sacred-blue-700 italic">
                "The curious soul discovers treasures hidden in plain sight. 
                Your willingness to explore reveals the deeper mysteries of transformation."
              </p>
              <div className="mt-2 text-lg">🎭✨🗝️</div>
            </motion.div>
          </details>
        </SacredCard>
      </motion.div>
    </div>
  );
}
