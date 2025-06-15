'use client';

import { HeartIcon, ShieldCheckIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function OnboardingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-sacred-blue-50 via-sacred-blue-100 to-sacred-purple-100">
      {/* Mountain Landscape Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Sky Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200/30 via-blue-300/20 to-sacred-blue-100/40"></div>
        
        {/* Mountain Silhouettes */}
        <svg className="absolute bottom-0 w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYEnd slice">
          {/* Back Mountains */}
          <path d="M0,600 L200,400 L400,450 L600,350 L800,400 L1000,300 L1200,350 L1200,800 L0,800 Z" 
                fill="rgba(25, 114, 190, 0.15)" />
          
          {/* Middle Mountains */}
          <path d="M0,650 L150,500 L350,520 L550,420 L750,480 L950,380 L1200,420 L1200,800 L0,800 Z" 
                fill="rgba(25, 114, 190, 0.25)" />
          
          {/* Front Mountains */}
          <path d="M0,700 L100,580 L300,600 L500,520 L700,560 L900,480 L1200,520 L1200,800 L0,800 Z" 
                fill="rgba(25, 114, 190, 0.35)" />
        </svg>
        
        {/* Floating Light Orbs */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-sacred-gold-400/60 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-sacred-purple-400/50 rounded-full animate-float blur-sm" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-sacred-gold-300/70 rounded-full animate-float blur-sm" style={{animationDelay: '4s'}}></div>
        <div className="absolute top-32 right-1/4 w-5 h-5 bg-sacred-blue-400/40 rounded-full animate-float blur-sm" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-80 right-20 w-3 h-3 bg-sacred-purple-300/60 rounded-full animate-float blur-sm" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-sacred-blue-900 mb-6 leading-tight">
            Welcome to Your
            <br />
            <span className="bg-gradient-to-r from-sacred-blue-900 via-sacred-purple-600 to-sacred-gold-500 bg-clip-text text-transparent">
              Sacred Journey
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-sacred-blue-700 mb-12 max-w-3xl mx-auto font-sans leading-relaxed">
            Discover a peaceful path to renewal, guided by wisdom and illuminated by hope. 
            Your transformation begins with a single sacred step.
          </p>

          {/* Primary Button */}
          <button className="group relative inline-flex items-center justify-center px-12 py-4 mb-16 text-xl font-semibold text-white bg-gradient-to-r from-sacred-blue-600 to-sacred-purple-600 rounded-full shadow-2xl hover:shadow-sacred-blue-500/25 transition-all duration-300 hover:scale-105 hover:from-sacred-blue-700 hover:to-sacred-purple-700">
            <span className="relative z-10">Begin Your Journey</span>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-sacred-gold-400/20 to-sacred-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            
            {/* Card 1: Peaceful Experience */}
            <div className="group relative">
              {/* Glassmorphism Card */}
              <div className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/25">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sacred-blue-100/30 to-sacred-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-sacred-purple-400 to-sacred-purple-600 rounded-full shadow-lg group-hover:animate-sacred-pulse">
                    <HeartIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-sacred-blue-900 mb-4">
                    Peaceful Experience
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sacred-blue-700 font-sans leading-relaxed">
                    Find tranquility in every moment as you embark on a journey designed to bring inner peace and spiritual harmony to your daily life.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Sacred Security */}
            <div className="group relative">
              {/* Glassmorphism Card */}
              <div className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/25">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sacred-blue-100/30 to-sacred-gold-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-sacred-blue-500 to-sacred-blue-700 rounded-full shadow-lg group-hover:animate-sacred-pulse">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-sacred-blue-900 mb-4">
                    Sacred Security
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sacred-blue-700 font-sans leading-relaxed">
                    Rest assured in a protected space where your spiritual growth is nurtured with the highest care, privacy, and sacred intention.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Guided Renewal */}
            <div className="group relative">
              {/* Glassmorphism Card */}
              <div className="relative backdrop-blur-md bg-white/20 border border-white/30 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/25">
                {/* Gradient Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sacred-gold-100/30 to-sacred-purple-100/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-gradient-to-br from-sacred-gold-400 to-sacred-gold-600 rounded-full shadow-lg group-hover:animate-sacred-glow">
                    <SparklesIcon className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-serif font-bold text-sacred-blue-900 mb-4">
                    Guided Renewal
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sacred-blue-700 font-sans leading-relaxed">
                    Experience transformation through carefully crafted guidance that illuminates your path toward renewal, growth, and spiritual awakening.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Ambient Elements */}
          <div className="mt-16 relative">
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-sacred-gold-400/50 to-transparent rounded-full"></div>
          </div>

        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute bottom-40 left-10 w-6 h-6 bg-sacred-gold-300/40 rounded-full animate-float blur-sm" style={{animationDelay: '5s'}}></div>
      <div className="absolute bottom-60 right-16 w-4 h-4 bg-sacred-purple-400/50 rounded-full animate-float blur-sm" style={{animationDelay: '6s'}}></div>
      <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-sacred-blue-300/60 rounded-full animate-float blur-sm" style={{animationDelay: '7s'}}></div>
    </div>
  );
}