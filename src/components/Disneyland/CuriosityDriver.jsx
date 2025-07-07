
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

/**
 * Curiosity Driver Component
 * Creates intrigue and anticipation through previews, mysteries, and interactive discoveries
 */
export default function CuriosityDriver({ userProgress = 0 }) {
  const [mysteryUnlocked, setMysteryUnlocked] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [interactiveRevealed, setInteractiveRevealed] = useState(false);
  const [comingSoonHint, setComingSoonHint] = useState('');

  // Mysterious elements that unlock at different stages
  const mysteries = [
    {
      id: 'hidden_wisdom',
      threshold: 20,
      title: '🗝️ Hidden Wisdom Chamber',
      hint: 'Ancient teachings await the dedicated seeker...',
      preview: 'Unlock secret interpretations and deeper meanings behind each chapter.',
      reward: 'Access to commentary from spiritual masters'
    },
    {
      id: 'meditation_garden',
      threshold: 40,
      title: '🧘 Sacred Meditation Garden',
      hint: 'A space for inner reflection emerges...',
      preview: 'Guided meditations that complement your reading journey.',
      reward: 'Personalized meditation sessions'
    },
    {
      id: 'transformation_mirror',
      threshold: 60,
      title: '🪞 Transformation Mirror',
      hint: 'See how far you\'ve truly come...',
      preview: 'Visual representation of your spiritual evolution.',
      reward: 'Personal growth timeline and insights'
    },
    {
      id: 'wisdom_sharing',
      threshold: 80,
      title: '💬 Wisdom Sharing Circle',
      hint: 'Your voice joins the eternal conversation...',
      preview: 'Share insights and learn from fellow travelers.',
      reward: 'Community features and shared wisdom'
    }
  ];

  // Coming soon hints based on progress
  const comingSoonHints = {
    0: "🌟 Special features await those who embark on the journey...",
    10: "🎭 Interactive elements are stirring in the depths...",
    30: "🔮 Advanced insights are gathering power...",
    50: "🌀 Transformation tools are aligning with your progress...",
    70: "✨ The final mysteries prepare to reveal themselves...",
    90: "🎉 The ultimate revelation approaches..."
  };

  // Interactive elements
  const [clickCount, setClickCount] = useState(0);
  const [secretRevealed, setSecretRevealed] = useState(false);

  useEffect(() => {
    // Check for newly unlocked mysteries
    const stored = JSON.parse(localStorage.getItem('mysteryUnlocked') || '[]');
    setMysteryUnlocked(stored);

    mysteries.forEach(mystery => {
      if (userProgress >= mystery.threshold && !stored.includes(mystery.id)) {
        const newUnlocked = [...stored, mystery.id];
        setMysteryUnlocked(newUnlocked);
        localStorage.setItem('mysteryUnlocked', JSON.stringify(newUnlocked));
        setShowPreview(true);
        setTimeout(() => setShowPreview(false), 5000);
      }
    });

    // Set coming soon hint
    const progressMilestones = Object.keys(comingSoonHints).map(Number).sort((a, b) => b - a);
    const currentMilestone = progressMilestones.find(milestone => userProgress >= milestone);
    setComingSoonHint(comingSoonHints[currentMilestone || 0]);
  }, [userProgress]);

  const handleInteractiveClick = () => {
    setClickCount(prev => prev + 1);
    if (clickCount >= 7 && !secretRevealed) {
      setSecretRevealed(true);
      setInteractiveRevealed(true);
    }
  };

  const nextMystery = mysteries.find(m => 
    userProgress < m.threshold && !mysteryUnlocked.includes(m.id)
  );

  const availableMysteries = mysteries.filter(m => 
    mysteryUnlocked.includes(m.id)
  );

  return (
    <div className="space-y-6">
      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && nextMystery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SacredCard variant="heavy" className="p-8 text-center max-w-md mx-4 border-2 border-sacred-gold-300">
                <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                    filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="text-4xl mb-4">🌟</div>
                  <h2 className="text-xl font-serif text-sacred-blue-900 mb-3">
                    Mystery Revealed!
                  </h2>
                  <h3 className="text-lg text-sacred-gold-700 mb-2">
                    {nextMystery.title}
                  </h3>
                  <p className="text-sm text-sacred-blue-600 mb-4">
                    {nextMystery.preview}
                  </p>
                  <div className="p-3 bg-sacred-gold-100 rounded-lg mb-4">
                    <p className="text-xs text-sacred-gold-800">
                      🎁 Reward: {nextMystery.reward}
                    </p>
                  </div>
                </motion.div>
                <SacredButton
                  onClick={() => setShowPreview(false)}
                  variant="gold"
                >
                  Explore Later ✨
                </SacredButton>
              </SacredCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coming Soon Teasers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="glass" className="p-4 border border-sacred-gold-200">
          <div className="text-center">
            <h3 className="font-serif text-lg text-sacred-blue-900 mb-2">
              ✨ What Awaits You
            </h3>
            <p className="text-sm text-sacred-blue-600 italic">
              {comingSoonHint}
            </p>
          </div>
        </SacredCard>
      </motion.div>

      {/* Next Mystery Preview */}
      {nextMystery && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SacredCard 
            variant="glass" 
            className="p-4 border border-dashed border-sacred-gold-300 bg-gradient-to-r from-sacred-blue-50 to-sacred-gold-50"
          >
            <div className="flex items-center space-x-4">
              <div className="text-2xl opacity-60">🔒</div>
              <div className="flex-1">
                <h4 className="font-semibold text-sacred-blue-900 mb-1">
                  {nextMystery.title}
                </h4>
                <p className="text-sm text-sacred-blue-600 italic mb-2">
                  {nextMystery.hint}
                </p>
                <div className="flex items-center space-x-2">
                  <div className="h-1 flex-1 bg-sacred-blue-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-sacred-gold-gradient"
                      initial={{ width: 0 }}
                      animate={{ width: `${(userProgress / nextMystery.threshold) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs text-sacred-blue-600">
                    {Math.round((userProgress / nextMystery.threshold) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </SacredCard>
        </motion.div>
      )}

      {/* Available Mysteries */}
      {availableMysteries.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="mb-4 font-serif text-xl text-sacred-blue-900">
            🗝️ Unlocked Mysteries
          </h3>
          <div className="space-y-3">
            {availableMysteries.map((mystery, index) => (
              <motion.div
                key={mystery.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <SacredCard 
                  variant="glass" 
                  className="p-4 hover:shadow-lg transition-all duration-300 cursor-pointer border border-sacred-gold-200"
                  hover
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-xl">🔓</div>
                      <div>
                        <h4 className="font-semibold text-sacred-blue-900">
                          {mystery.title}
                        </h4>
                        <p className="text-sm text-sacred-blue-600">
                          {mystery.preview}
                        </p>
                      </div>
                    </div>
                    <SacredButton variant="ghost" size="sm">
                      Explore →
                    </SacredButton>
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Interactive Secret Discovery */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <SacredCard variant="glass" className="p-4">
          <div className="text-center">
            <motion.div
              className="inline-block cursor-pointer"
              onClick={handleInteractiveClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={clickCount > 0 ? {
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              } : {}}
            >
              <div className="text-3xl mb-2">
                {secretRevealed ? '🎭' : '🪬'}
              </div>
            </motion.div>
            <p className="text-sm text-sacred-blue-600">
              {secretRevealed 
                ? "You've discovered the hidden truth: Persistence reveals all mysteries! 🌟"
                : clickCount > 0 
                  ? `Something stirs... (${clickCount}/8)`
                  : "Something seems mysterious about this symbol..."
              }
            </p>
            
            <AnimatePresence>
              {interactiveRevealed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-3 bg-sacred-gradient/10 rounded-lg"
                >
                  <p className="text-xs text-sacred-blue-700">
                    🎉 <strong>Secret Achievement Unlocked:</strong> "The Persistent Seeker"
                    <br />
                    <em>Your curiosity and determination have revealed a hidden blessing!</em>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </SacredCard>
      </motion.div>
    </div>
  );
}
