
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SacredCard from '@/components/ui/sacred-card';
import SacredButton from '@/components/ui/sacred-button';

/**
 * Momentum Builder Component
 * Creates engagement through achievements, streaks, and milestone celebrations
 */
export default function MomentumBuilder({ userProgress = 0, sessionsCompleted = 0 }) {
  const [achievements, setAchievements] = useState([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [motivationalQuote, setMotivationalQuote] = useState('');

  // Achievement definitions
  const achievementList = [
    {
      id: 'first_step',
      title: 'First Step Taken',
      description: 'Begun your transformation journey',
      icon: '👣',
      threshold: 1,
      type: 'progress',
      rarity: 'common'
    },
    {
      id: 'consistent_reader',
      title: 'Consistent Seeker',
      description: 'Read for 3 consecutive days',
      icon: '📚',
      threshold: 3,
      type: 'streak',
      rarity: 'uncommon'
    },
    {
      id: 'quarter_journey',
      title: 'Quarter Transformed',
      description: 'Completed 25% of your journey',
      icon: '🌱',
      threshold: 25,
      type: 'progress',
      rarity: 'rare'
    },
    {
      id: 'audio_explorer',
      title: 'Audio Explorer',
      description: 'Listened to 5 audio sessions',
      icon: '🎧',
      threshold: 5,
      type: 'sessions',
      rarity: 'uncommon'
    },
    {
      id: 'wisdom_seeker',
      title: 'Wisdom Seeker',
      description: 'Reached the halfway point',
      icon: '🧠',
      threshold: 50,
      type: 'progress',
      rarity: 'epic'
    },
    {
      id: 'transformation_master',
      title: 'Transformation Master',
      description: 'Completed 90% of the journey',
      icon: '🏆',
      threshold: 90,
      type: 'progress',
      rarity: 'legendary'
    }
  ];

  // Motivational quotes based on progress
  const motivationalQuotes = {
    0: "Every journey begins with a single step. Welcome, brave soul.",
    10: "You've planted the seeds of change. Watch them grow.",
    25: "Quarter of the way there! Your dedication is inspiring.",
    50: "Halfway through your transformation. The light grows brighter.",
    75: "You're in the final stretch. Your renewed self awaits.",
    90: "So close to completion. Your transformation is remarkable.",
    100: "Journey complete! You are truly renewed."
  };

  // Load achievements and streak data
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userAchievements') || '[]');
    setAchievements(stored);

    const storedStreak = parseInt(localStorage.getItem('readingStreak') || '0');
    setCurrentStreak(storedStreak);

    // Set motivational quote based on progress
    const progressMilestones = Object.keys(motivationalQuotes).map(Number).sort((a, b) => b - a);
    const currentMilestone = progressMilestones.find(milestone => userProgress >= milestone);
    setMotivationalQuote(motivationalQuotes[currentMilestone || 0]);
  }, [userProgress]);

  // Check for new achievements
  useEffect(() => {
    achievementList.forEach(achievement => {
      if (!achievements.some(a => a.id === achievement.id)) {
        let shouldUnlock = false;

        switch (achievement.type) {
          case 'progress':
            shouldUnlock = userProgress >= achievement.threshold;
            break;
          case 'sessions':
            shouldUnlock = sessionsCompleted >= achievement.threshold;
            break;
          case 'streak':
            shouldUnlock = currentStreak >= achievement.threshold;
            break;
        }

        if (shouldUnlock) {
          const newAchievement = { ...achievement, unlockedAt: Date.now() };
          const updatedAchievements = [...achievements, newAchievement];
          setAchievements(updatedAchievements);
          localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
          
          // Trigger celebration
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
      }
    });
  }, [userProgress, sessionsCompleted, currentStreak, achievements]);

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100';
      case 'uncommon': return 'text-green-600 bg-green-100';
      case 'rare': return 'text-blue-600 bg-blue-100';
      case 'epic': return 'text-purple-600 bg-purple-100';
      case 'legendary': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <SacredCard variant="heavy" className="p-8 text-center max-w-md mx-4">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  <div className="text-6xl mb-4">🎉</div>
                </motion.div>
                <h2 className="text-2xl font-serif text-sacred-blue-900 mb-2">
                  Achievement Unlocked!
                </h2>
                <p className="text-sacred-blue-600 mb-4">
                  Your dedication to transformation has been recognized!
                </p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <SacredButton
                    onClick={() => setShowCelebration(false)}
                    variant="gold"
                  >
                    Continue Journey ✨
                  </SacredButton>
                </motion.div>
              </SacredCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Motivation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-sacred-gradient shadow-lg mb-3">
              <span className="text-2xl text-white">🌟</span>
            </div>
          </div>
          <h3 className="font-serif text-xl text-sacred-blue-900 mb-2">Your Journey Progress</h3>
          <p className="text-sacred-blue-700 italic mb-4">"{motivationalQuote}"</p>
          
          {/* Progress Visualization */}
          <div className="relative w-full h-3 bg-sacred-blue-100 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-sacred-gradient rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${userProgress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-0 left-0 h-full w-full bg-white/30 rounded-full"
              animate={{ x: [`${userProgress - 10}%`, `${userProgress + 10}%`, `${userProgress - 10}%`] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <p className="text-sm text-sacred-blue-600">
            {userProgress}% Complete • {currentStreak} day streak
          </p>
        </SacredCard>
      </motion.div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="mb-4 font-serif text-xl text-sacred-blue-900">
            🏆 Your Achievements ({achievements.length})
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.slice(-4).reverse().map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <SacredCard variant="glass" className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-sacred-blue-900 text-sm">
                          {achievement.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${getRarityColor(achievement.rarity)}`}>
                          {achievement.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-sacred-blue-600 mb-2">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-sacred-blue-500">
                        Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </SacredCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Streak Momentum */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <SacredCard variant="glass" className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🔥</div>
              <div>
                <h4 className="font-semibold text-sacred-blue-900">Reading Streak</h4>
                <p className="text-sm text-sacred-blue-600">
                  {currentStreak} consecutive days
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-sacred-blue-900">
                {currentStreak}
              </div>
              <p className="text-xs text-sacred-blue-600">
                {currentStreak >= 7 ? 'On fire!' : currentStreak >= 3 ? 'Building momentum!' : 'Keep going!'}
              </p>
            </div>
          </div>
        </SacredCard>
      </motion.div>
    </div>
  );
}
