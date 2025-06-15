'use client';
import { motion } from 'framer-motion';

const TwoMindsStep = ({ onNext, onBack, formData, setFormData }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="w-32 h-32 mx-auto rounded-full bg-sacred-gradient flex items-center justify-center shadow-xl mb-6">
            <div className="text-white text-6xl">🧠</div>
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="text-4xl md:text-5xl font-serif text-sacred-blue-900 mb-6"
        >
          Understanding Your <span className="text-sacred-purple-600">Two Minds</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="text-sacred-blue-700 text-lg md:text-xl mb-8 leading-relaxed"
        >
          Within you exist two distinct ways of experiencing reality. The analytical mind that plans and judges, 
          and the intuitive mind that feels and flows. Understanding both is key to your transformation.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
          className="grid md:grid-cols-2 gap-8 mb-10"
        >
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sacred-blue-200">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-serif text-sacred-blue-900 mb-3">Analytical Mind</h3>
            <p className="text-sacred-blue-700">Plans, analyzes, judges, and seeks control through understanding.</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sacred-purple-200">
            <div className="text-4xl mb-4">🌊</div>
            <h3 className="text-xl font-serif text-sacred-purple-600 mb-3">Intuitive Mind</h3>
            <p className="text-sacred-blue-700">Feels, flows, trusts, and experiences life directly.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TwoMindsStep;