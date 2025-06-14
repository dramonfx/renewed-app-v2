'use client';
import { motion } from 'framer-motion';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-indigo-600 flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-serif">R</span>
          </div>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-serif text-slate-800 dark:text-slate-100 mb-4"
        >
          Welcome to the <span className="text-indigo-600">Threshold</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="text-slate-600 dark:text-slate-300 text-lg md:text-xl mb-10"
        >
          You stand at the sacred threshold between two ways of being.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
          onClick={onNext}
          className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-full hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          Cross the Threshold →
        </motion.button>
      </div>
    </div>
  );
};

export default WelcomeScreen;