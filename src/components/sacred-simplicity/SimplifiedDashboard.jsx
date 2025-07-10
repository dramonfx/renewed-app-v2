
'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';

export default function SimplifiedDashboard({ greeting, currentMindset, user }) {
  const router = useRouter();

  const mindsetIcons = {
    natural: '🌱',
    transition: '🦋', 
    spiritual: '✨'
  };

  const mindsetTitles = {
    natural: 'Natural Mind',
    transition: 'Transitional Mind',
    spiritual: 'Spiritual Mind'
  };

  const coreActions = [
    {
      title: 'Sacred Reading',
      icon: '📖',
      href: '/book',
      description: 'Continue your spiritual study'
    },
    {
      title: 'Audio Journey',
      icon: '🎧',
      href: '/full-audio-player',
      description: 'Immerse in guided meditation'
    },
    {
      title: 'Journal',
      icon: '📝',
      href: '/journal',
      description: 'Record your reflections'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Simple Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <SacredCard variant="heavy" className="p-8 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <span className="text-6xl">{mindsetIcons[currentMindset] || '🌱'}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-2 font-serif text-3xl text-sacred-blue-900"
          >
            {greeting}, {user?.email?.split('@')[0] || 'Sacred Soul'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-lg text-sacred-blue-600"
          >
            Your {mindsetTitles[currentMindset] || 'Spiritual Journey'} continues
          </motion.p>
        </SacredCard>
      </motion.div>

      {/* Core Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="mb-6 font-serif text-2xl text-sacred-blue-900 text-center">
          Choose Your Path
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {coreActions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
            >
              <SacredCard
                variant="glass"
                className="group h-full p-8 text-center transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <motion.div
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                  className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sacred-gradient shadow-lg group-hover:shadow-xl"
                >
                  <span className="text-3xl text-white">{action.icon}</span>
                </motion.div>
                
                <h3 className="mb-3 font-serif text-xl text-sacred-blue-900 group-hover:text-sacred-blue-800">
                  {action.title}
                </h3>
                
                <p className="mb-6 text-sacred-blue-600">
                  {action.description}
                </p>
                
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <SacredButton 
                    variant="primary" 
                    size="lg" 
                    className="w-full group-hover:shadow-md"
                  >
                    Begin
                  </SacredButton>
                </motion.div>
              </SacredCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Simple Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <p className="text-sacred-blue-600 mb-4">
            🙏 Your sacred journey is unfolding perfectly
          </p>
          <SacredButton 
            variant="ghost" 
            onClick={() => router.push('/dashboard')}
            className="text-sm"
          >
            View Full Dashboard
          </SacredButton>
        </SacredCard>
      </motion.div>
    </div>
  );
}
