
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
      // Sacred Journey Design System
      colors: {
        // Glassmorphism transparency levels
        'glass': {
          'white': 'rgba(255, 255, 255, 0.25)',
          'white-light': 'rgba(255, 255, 255, 0.15)',
          'white-heavy': 'rgba(255, 255, 255, 0.35)',
        },
        
        // Sacred background overlays
        'sacred': {
          'overlay': 'rgba(14, 165, 233, 0.06)',
          'text': 'rgba(255, 255, 255, 0.95)',
          'text-muted': 'rgba(255, 255, 255, 0.8)',
        },
        
        // Sacred Blue color palette
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
        
        // Sacred Gold accent color
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

        // Sacred Purple for accents
        'sacred-purple': {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
      },
      
      // Sacred Typography
      fontFamily: {
        'sacred-serif': ['Playfair Display', 'serif'],
        'sacred-sans': ['Nunito Sans', 'sans-serif'],
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Nunito Sans', 'sans-serif'],
      },
      
      // Sacred Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },

      // Sacred Gradients
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
        'sacred-gold-gradient': 'linear-gradient(135deg, #FACF51 0%, #f59e0b 100%)',
        'sacred-purple-gradient': 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
        'sacred-blue-gradient': 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #bae6fd 100%)',
      },
      
      // Sacred Animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'sacred-glow': 'sacredGlow 2s ease-in-out infinite alternate',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        sacredGlow: {
          '0%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)' },
        },
      },
      
      // Sacred Backdrop Blur
      backdropBlur: {
        'sacred': '16px',
      },
    },
  },
  plugins: [],
};
