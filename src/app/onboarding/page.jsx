'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  HeartIcon, 
  ShieldCheckIcon, 
  SparklesIcon,
  ArrowRightIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const nextStep = () => {
    localStorage.setItem('renewedOnboardingCompleted', 'true');
    router.push('/book');
  };

  const features = [
    {
      icon: HeartIcon,
      title: "Peaceful Experience",
      description: "Immerse yourself in a serene digital sanctuary designed to calm your mind and nurture your spirit through every interaction.",
      gradient: "from-sacred-blue-50 to-sacred-purple-100",
      iconColor: "text-sacred-purple-600",
      glowColor: "shadow-sacred-purple-400/20"
    },
    {
      icon: ShieldCheckIcon,
      title: "Sacred Security",
      description: "Your spiritual journey is protected with enterprise-grade security, ensuring your personal growth remains private and secure.",
      gradient: "from-sacred-blue-50 to-sacred-blue-200",
      iconColor: "text-sacred-blue-900",
      glowColor: "shadow-sacred-blue-400/20"
    },
    {
      icon: SparklesIcon,
      title: "Guided Renewal",
      description: "Experience transformative guidance through carefully curated content that adapts to your unique path of spiritual discovery.",
      gradient: "from-sacred-gold-50 to-sacred-gold-200",
      iconColor: "text-sacred-gold-600",
      glowColor: "shadow-sacred-gold-400/20"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-sacred-blue-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-sacred-blue-900 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Mountain Landscape Background */}
      <div className="absolute inset-0 bg-sacred-blue-gradient">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-sacred-blue-50/30 to-sacred-blue-100/50" />
        
        {/* Mountain Silhouettes */}
        <svg className="absolute bottom-0 w-full h-64 text-sacred-blue-200/40" viewBox="0 0 1200 300" fill="currentColor">
          <path d="M0,300 L0,200 L200,100 L400,150 L600,80 L800,120 L1000,60 L1200,100 L1200,300 Z" />
        </svg>
        <svg className="absolute bottom-0 w-full h-48 text-sacred-blue-300/30" viewBox="0 0 1200 250" fill="currentColor">
          <path d="M0,250 L0,180 L150,120 L350,140 L550,90 L750,110 L950,70 L1200,90 L1200,250 Z" />
        </svg>
        
        {/* Floating Sacred Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 8}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5
              }}
            >
              <StarIcon className="w-6 h-6 text-sacred-gold-400/40" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-center justify-center px-4 py-12"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-16 max-w-4xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.4 }}
              className="mb-8"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-sacred-gradient shadow-2xl shadow-sacred-blue-900/30 mb-6">
                <SparklesIcon className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-serif font-bold text-sacred-blue-900 mb-6 leading-tight"
            >
              Welcome to Your
              <span className="block bg-sacred-gradient bg-clip-text text-transparent">
                Sacred Journey
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-sacred-blue-700 leading-relaxed max-w-3xl mx-auto font-light"
            >
              Embark on a transformative path of spiritual discovery, where ancient wisdom meets modern technology 
              to guide you toward inner peace and renewal.
            </motion.p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            variants={containerVariants}
            className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mb-16"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover="hover"
                className="group relative"
              >
                {/* Glassmorphism Card */}
                <div className={`
                  relative p-8 rounded-3xl backdrop-blur-xl bg-white/20 border border-white/30
                  shadow-2xl ${feature.glowColor} hover:shadow-3xl
                  transition-all duration-500 ease-out
                  bg-gradient-to-br ${feature.gradient}
                  hover:bg-white/30
                `}>
                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="relative z-10 mb-6"
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/40 backdrop-blur-sm ${feature.iconColor} shadow-lg`}>
                      <feature.icon className="w-8 h-8" />
                    </div>
                  </motion.div>
                  
                  {/* Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-serif font-bold text-sacred-blue-900 mb-4 group-hover:text-sacred-blue-800 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sacred-blue-700 leading-relaxed text-lg font-light">
                      {feature.description}
                    </p>
                  </div>
                  
                  {/* Decorative Elements */}
                  <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                    <StarIcon className="w-6 h-6 text-sacred-gold-400" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            variants={itemVariants}
            className="text-center"
          >
            <motion.button
              onClick={nextStep}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center px-12 py-4 text-xl font-semibold text-white rounded-full bg-sacred-gradient shadow-2xl shadow-sacred-blue-900/30 hover:shadow-3xl transition-all duration-300 overflow-hidden"
            >
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-sacred-blue-600 to-sacred-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full" />
              
              <span className="relative z-10 mr-3">Begin Your Journey</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="relative z-10"
              >
                <ArrowRightIcon className="w-6 h-6" />
              </motion.div>
              
              {/* Ripple Effect */}
              <motion.div
                className="absolute inset-0 rounded-full"
                initial={{ scale: 0, opacity: 0.5 }}
                whileHover={{
                  scale: 1.2,
                  opacity: 0,
                  transition: { duration: 0.6 }
                }}
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)'
                }}
              />
            </motion.button>
            
            <motion.p
              variants={itemVariants}
              className="mt-6 text-sacred-blue-600 text-lg font-light"
            >
              Your transformation awaits • No commitment required
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer
          variants={itemVariants}
          className="relative z-10 text-center py-8 px-4"
        >
          <div className="flex items-center justify-center space-x-2 text-sacred-blue-500">
            <StarIcon className="w-5 h-5 text-sacred-gold-400" />
            <span className="text-sm font-light">Crafted with intention for your spiritual growth</span>
            <StarIcon className="w-5 h-5 text-sacred-gold-400" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
}