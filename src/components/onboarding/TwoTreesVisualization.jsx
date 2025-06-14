'use client';

import { motion } from 'framer-motion';
import { FiMinus, FiPlus } from 'react-icons/fi';

export default function TwoTreesVisualization({ selectedMind }) {
  const treeVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const leafVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: 1 + i * 0.1, duration: 0.5 }
    })
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif font-bold text-brand-blue-dark mb-2">
          The Two Trees
        </h3>
        <p className="text-brand-text-muted font-sans">
          A visual representation of the spiritual journey
        </p>
      </div>

      <div className="relative">
        <svg
          viewBox="0 0 800 400"
          className="w-full h-64 md:h-80"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E0E7FF" />
              <stop offset="100%" stopColor="#F0F5FA" />
            </linearGradient>
            <linearGradient id="groundGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B7355" />
              <stop offset="100%" stopColor="#6B5B47" />
            </linearGradient>
          </defs>

          {/* Sky */}
          <rect width="800" height="300" fill="url(#skyGradient)" />
          
          {/* Ground */}
          <rect y="300" width="800" height="100" fill="url(#groundGradient)" />

          {/* Tree of Knowledge (Left) */}
          <g className={selectedMind === 'natural' ? 'opacity-100' : 'opacity-60'}>
            {/* Trunk */}
            <motion.path
              d="M 180 300 L 180 200 L 175 200 L 175 300"
              fill="#8B4513"
              variants={treeVariants}
              initial="hidden"
              animate="visible"
            />
            
            {/* Branches */}
            <motion.path
              d="M 180 220 Q 150 200 120 210 M 180 240 Q 210 220 240 230 M 180 200 Q 160 180 140 190 M 180 200 Q 200 180 220 190"
              stroke="#8B4513"
              strokeWidth="4"
              fill="none"
              variants={treeVariants}
              initial="hidden"
              animate="visible"
            />

            {/* Withered Leaves */}
            {[...Array(8)].map((_, i) => (
              <motion.circle
                key={i}
                cx={120 + i * 15}
                cy={190 + Math.sin(i) * 20}
                r="6"
                fill="#CD853F"
                variants={leafVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              />
            ))}

            {/* Forbidden Fruit */}
            <motion.circle
              cx="140"
              cy="190"
              r="8"
              fill="#DC143C"
              variants={leafVariants}
              initial="hidden"
              animate="visible"
              custom={4}
            />
          </g>

          {/* Tree of Life (Right) */}
          <g className={selectedMind === 'spiritual' ? 'opacity-100' : 'opacity-60'}>
            {/* Trunk */}
            <motion.path
              d="M 620 300 L 620 180 L 615 180 L 615 300"
              fill="#228B22"
              variants={treeVariants}
              initial="hidden"
              animate="visible"
            />
            
            {/* Branches */}
            <motion.path
              d="M 620 200 Q 590 180 560 190 M 620 220 Q 650 200 680 210 M 620 180 Q 600 160 580 170 M 620 180 Q 640 160 660 170 M 620 240 Q 590 220 570 230 M 620 240 Q 650 220 670 230"
              stroke="#228B22"
              strokeWidth="5"
              fill="none"
              variants={treeVariants}
              initial="hidden"
              animate="visible"
            />

            {/* Flourishing Leaves */}
            {[...Array(12)].map((_, i) => (
              <motion.circle
                key={i}
                cx={560 + i * 12}
                cy={170 + Math.sin(i) * 25}
                r="8"
                fill="#32CD32"
                variants={leafVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              />
            ))}

            {/* Life-giving Fruit */}
            {[...Array(6)].map((_, i) => (
              <motion.circle
                key={i}
                cx={570 + i * 18}
                cy={180 + Math.cos(i) * 15}
                r="6"
                fill="#FFD700"
                variants={leafVariants}
                initial="hidden"
                animate="visible"
                custom={i + 6}
              />
            ))}
          </g>

          {/* Path between trees */}
          <motion.path
            d="M 280 350 Q 400 320 520 350"
            stroke="#D4AF37"
            strokeWidth="6"
            fill="none"
            strokeDasharray="10,5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ delay: 2.5, duration: 1.5 }}
          />

          {/* Arrow indicating transformation */}
          <motion.polygon
            points="500,345 520,350 500,355"
            fill="#D4AF37"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          />

          {/* Labels */}
          <motion.text
            x="180"
            y="380"
            textAnchor="middle"
            className="fill-red-700 font-serif font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Natural Mind
          </motion.text>

          <motion.text
            x="620"
            y="380"
            textAnchor="middle"
            className="fill-green-700 font-serif font-bold text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            Spiritual Mind
          </motion.text>

          <motion.text
            x="400"
            y="340"
            textAnchor="middle"
            className="fill-yellow-600 font-sans font-semibold text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
            Transformation Journey
          </motion.text>
        </svg>

        {/* Interactive Elements */}
        <div className="absolute top-4 left-4 flex gap-4">
          <motion.div
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
              selectedMind === 'natural' 
                ? 'bg-red-100 text-red-700 shadow-lg' 
                : 'bg-gray-100 text-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <FiMinus className="w-4 h-4" />
            <span className="text-sm font-sans">Tree of Knowledge</span>
          </motion.div>

          <motion.div
            className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
              selectedMind === 'spiritual' 
                ? 'bg-green-100 text-green-700 shadow-lg' 
                : 'bg-gray-100 text-gray-500'
            }`}
            whileHover={{ scale: 1.05 }}
          >
            <FiPlus className="w-4 h-4" />
            <span className="text-sm font-sans">Tree of Life</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}