'use client';

import { HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  const features = [
    {
      icon: HeartIcon,
      title: "Peaceful Experience",
      description: "Find tranquility in your daily spiritual practice with guided meditations and calming exercises."
    },
    {
      icon: ShieldCheckIcon,
      title: "Sacred Security",
      description: "Your spiritual journey is protected with privacy-first design and secure, encrypted data."
    },
    {
      icon: SparklesIcon,
      title: "Guided Renewal",
      description: "Experience transformation through personalized spiritual guidance and meaningful insights."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sacred-blue-50 via-sacred-blue-100 to-sacred-purple-100">
      {/* Mountain Background SVG */}
      <div className="absolute inset-0 z-0">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 800"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYEnd slice"
        >
          {/* Sky Gradient */}
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#e3e8f0" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#b8c7d9" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1972be" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="mountainGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4a5b79" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1972be" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="mountainGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5a6b87" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7a8ba3" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="mountainGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6a7b95" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8b9bb1" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          
          {/* Background Mountains - Far */}
          <path
            d="M0 600 L200 400 L400 450 L600 350 L800 400 L1000 300 L1200 350 L1200 800 L0 800 Z"
            fill="url(#mountainGradient3)"
          />
          
          {/* Background Mountains - Mid */}
          <path
            d="M0 650 L150 500 L350 550 L550 450 L750 500 L950 400 L1200 450 L1200 800 L0 800 Z"
            fill="url(#mountainGradient2)"
          />
          
          {/* Foreground Mountains */}
          <path
            d="M0 700 L100 550 L300 600 L500 500 L700 550 L900 450 L1200 500 L1200 800 L0 800 Z"
            fill="url(#mountainGradient1)"
          />
        </svg>
      </div>

      {/* Floating Light Orbs */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute top-20 left-20 w-4 h-4 bg-sacred-gold-400 rounded-full opacity-60 animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-sacred-purple-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-sacred-gold-300 rounded-full opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-40 right-20 w-5 h-5 bg-sacred-purple-300 rounded-full opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-60 left-16 w-3 h-3 bg-sacred-gold-400 rounded-full opacity-50 animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-sacred-blue-900 mb-6 leading-tight">
            Welcome to Your
            <span className="block bg-gradient-to-r from-sacred-blue-900 via-sacred-purple-600 to-sacred-gold-400 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl lg:text-2xl text-sacred-blue-700 mb-12 max-w-3xl mx-auto font-sans leading-relaxed">
            Discover a peaceful path to renewal, spiritual growth, and inner transformation through guided practices and sacred wisdom.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-6 lg:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/25"
              >
                {/* Card Glow Effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sacred-gold-400/10 to-sacred-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-br from-sacred-blue-600 to-sacred-purple-600 shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl lg:text-2xl font-serif font-semibold text-sacred-blue-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sacred-blue-700 font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex justify-center">
            <button className="group relative px-8 py-4 lg:px-12 lg:py-5 bg-gradient-to-r from-sacred-blue-600 to-sacred-purple-600 hover:from-sacred-blue-700 hover:to-sacred-purple-700 text-white font-sans font-semibold text-lg lg:text-xl rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-sacred-blue-300">
              {/* Button Glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sacred-gold-400/20 to-sacred-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <span className="relative z-10 flex items-center">
                Begin Your Journey
                <SparklesIcon className="w-6 h-6 ml-2 group-hover:animate-pulse" />
              </span>
            </button>
          </div>

          {/* Subtle Footer Text */}
          <p className="mt-8 text-sacred-blue-600 font-sans text-sm opacity-75">
            Join thousands on their path to spiritual renewal
          </p>
        </div>
      </div>

      {/* Additional Ambient Elements */}
      <div className="absolute inset-0 z-5 pointer-events-none">
        {/* Subtle gradient overlays for depth */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-sacred-blue-50/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-sacred-blue-100/30 to-transparent"></div>
      </div>
    </div>
  );
}