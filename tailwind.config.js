
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // Sacred Blue Glassmorphism Design System
      colors: {
        // Glassmorphism transparency levels
        'glass': {
          'white': 'rgba(255, 255, 255, 0.25)',      // Semi-transparent white
          'white-light': 'rgba(255, 255, 255, 0.15)', // Even more transparent
          'white-heavy': 'rgba(255, 255, 255, 0.35)',  // Less transparent
        },
        
        // Sacred background overlays
        'sacred': {
          'overlay': 'rgba(61, 169, 252, 0.08)',     // Sacred Blue overlay
          'text': 'rgba(255, 255, 255, 0.95)',       // High contrast text on sacred bg
          'text-muted': 'rgba(255, 255, 255, 0.8)',  // Muted text on sacred bg
        },
        
        // Sacred Blue color palette
        'sacred-blue': {
          50: '#eff6ff',
          100: '#dbeafe', 
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3da9fc',  // Primary Sacred Blue
          600: '#2563eb',  // Darker Sacred Blue
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        
        // Sacred accent colors
        'sacred-navy': '#1e293b',     // Deep navy for text
        'sacred-gold': '#fbbf24',     // Gold accent for special elements
      },
      
      // Typography for sacred backgrounds
      fontFamily: {
        'heading': ['Playfair Display', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'sans': ['Inter', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
      },
      
      // Glassmorphism effects
      backdropBlur: {
        'glass': '20px',    // Main glass blur effect
        'glass-light': '12px', // Lighter blur  
        'glass-heavy': '30px', // Heavier blur
      },
      
      // Sacred Blue glassmorphism shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'sacred-glow': '0 4px 20px rgba(61, 169, 252, 0.3)',
        'sacred-glow-hover': '0 8px 30px rgba(61, 169, 252, 0.4)',
      },
      
      // Background image utilities
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, rgba(61, 169, 252, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
      },
      
      // Animation for glassmorphism
      animation: {
        'glass-float': 'glassFloat 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      
      keyframes: {
        glassFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
