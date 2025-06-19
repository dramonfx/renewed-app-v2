
'use client';
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
    </div>
  );
}
