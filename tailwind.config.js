
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
      // Sacred Blue + Gold Glassmorphism Design System
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
        
        // Sacred Blue color palette (refined)
        'sacred-blue': {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',  // Primary Sacred Blue
          600: '#0284c7',  // Deeper Sacred Blue
          700: '#0369a1',  // Dark Sacred Blue
          800: '#075985',  // Navy Sacred Blue
          900: '#0c4a6e',  // Deep Sacred Blue
        },
        
        // Sacred Gold accent color (as requested #FACF51)
        'sacred-gold': {
          50: '#fffef7',
          100: '#fffbeb',
          200: '#fef3c7',
          300: '#fed6a3',
          400: '#fcb673',
          500: '#FACF51',  // Primary Sacred Gold
          600: '#f59e0b',
          700: '#d97706',
          800: '#b45309',
          900: '#92400e',
        },
        
        // Additional Sacred tones
        'sacred-indigo': {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
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
      
      // Sacred Blue + Gold glassmorphism shadows
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-hover': '0 12px 40px rgba(0, 0, 0, 0.15)',
        'glass-inset': 'inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'sacred-glow': '0 4px 20px rgba(14, 165, 233, 0.3)',
        'sacred-glow-hover': '0 8px 30px rgba(14, 165, 233, 0.4)',
        'gold-glow': '0 4px 20px rgba(250, 207, 81, 0.3)',
        'gold-glow-hover': '0 8px 30px rgba(250, 207, 81, 0.4)',
      },
      
      // Background image utilities
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, rgba(14, 165, 233, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
        'sacred-blue-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        'sacred-gold-gradient': 'linear-gradient(135deg, #FACF51 0%, #f59e0b 100%)',
      },
      
      // Animation for glassmorphism
      animation: {
        'glass-float': 'glassFloat 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
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
        glowPulse: {
          '0%, 100%': { boxShadow: '0 4px 20px rgba(14, 165, 233, 0.3)' },
          '50%': { boxShadow: '0 8px 30px rgba(14, 165, 233, 0.5)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
