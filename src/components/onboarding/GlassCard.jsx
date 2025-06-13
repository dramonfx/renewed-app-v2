'use client';

import { motion } from 'framer-motion';

export default function GlassCard({ children, className = '', onClick, ...props }) {
  return (
    <motion.div
      className={`
        relative backdrop-blur-md bg-white/20 dark:bg-white/5
        border border-white/30 dark:border-white/10
        rounded-2xl shadow-xl
        transition-all duration-300
        ${onClick ? 'cursor-pointer hover:bg-white/30 dark:hover:bg-white/10' : ''}
        ${className}
      `}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      {...props}
    >
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}