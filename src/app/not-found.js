
'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute bottom-1/4 right-1/6 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="w-full max-w-2xl mx-auto text-center">
        <div className="sacred-glass-heavy p-12 md:p-16">
          {/* Sacred Mountain Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <span className="text-white text-4xl">🏔️</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif text-blue-900 mb-4 leading-tight">
              Path{' '}
              <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
                Not Found
              </span>
            </h1>
            <p className="text-blue-700 text-xl md:text-2xl leading-relaxed max-w-xl mx-auto mb-2">
              The path you seek has wandered into uncharted territory.
            </p>
            <p className="text-blue-600 text-lg leading-relaxed max-w-lg mx-auto">
              Every journey has unexpected turns. Let us guide you back to your sacred path of transformation and renewal.
            </p>
          </div>

          {/* Journey Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                <span className="text-white text-lg">🧭</span>
              </div>
              <h3 className="text-lg font-serif text-blue-900 mb-1">Find Direction</h3>
              <p className="text-blue-600 text-sm leading-relaxed">
                Return to your spiritual compass
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                <span className="text-white text-lg">📖</span>
              </div>
              <h3 className="text-lg font-serif text-blue-900 mb-1">Continue Reading</h3>
              <p className="text-blue-600 text-sm leading-relaxed">
                Your guidebook awaits
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <span className="text-white text-lg">✨</span>
              </div>
              <h3 className="text-lg font-serif text-blue-900 mb-1">Resume Journey</h3>
              <p className="text-blue-600 text-sm leading-relaxed">
                Your transformation continues
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/"
                className="sacred-gold-button px-8 py-4 text-lg"
              >
                Return Home 🏠
              </Link>
              <Link 
                href="/dashboard"
                className="sacred-button px-8 py-4 text-lg"
              >
                Continue Journey ✨
              </Link>
            </div>
            
            <p className="text-blue-600 text-sm mt-6 italic">
              &ldquo;Not all who wander are lost, but all who seek shall find their way.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
