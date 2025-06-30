import React from 'react';
import { SacredCard } from '../ui/sacred-card';
import { SacredButton } from '../ui/sacred-button';
import { Sparkles, Star } from 'lucide-react';

const WelcomeScreen = ({ onNext }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Star className="absolute top-20 left-20 w-4 h-4 text-yellow-300 opacity-60 animate-pulse" />
        <Star className="absolute top-32 right-32 w-3 h-3 text-blue-300 opacity-40" />
        <Star className="absolute bottom-40 left-40 w-5 h-5 text-purple-300 opacity-50 animate-pulse" />
        <Star className="absolute bottom-20 right-20 w-4 h-4 text-pink-300 opacity-60" />
        <Star className="absolute top-1/2 left-10 w-3 h-3 text-cyan-300 opacity-40 animate-pulse" />
        <Star className="absolute top-1/3 right-10 w-4 h-4 text-yellow-300 opacity-50" />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl mx-auto">
        <SacredCard className="text-center space-y-8 p-12">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <Sparkles className="w-16 h-16 text-yellow-400 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent leading-tight">
              Welcome to Your Sacred Journey
            </h1>
            <p className="text-xl text-gray-200 leading-relaxed max-w-lg mx-auto">
              Step into a realm of transformation where your deepest aspirations become reality
            </p>
          </div>

          {/* Description */}
          <div className="space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              This is more than an app—it's your personal sanctuary for growth, manifestation, and spiritual awakening. 
              Every feature has been crafted with intention to support your journey toward your highest self.
            </p>
            
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-400/30">
              <p className="text-gray-200 font-medium">
                ✨ Ready to begin your transformation? Let's create something magical together.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="pt-4">
            <SacredButton 
              onClick={onNext}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-12 py-4 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Begin My Sacred Journey
            </SacredButton>
          </div>
        </SacredCard>
      </div>
    </div>
  );
};

export default WelcomeScreen;