--- START OF FILE tailwind.config.js ---

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Keep this line even if you don't have a pages dir yet
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand-blue-light': '#E0E7FF',      // A very light, almost lavender blue
        'brand-blue-sidebar': '#D6E2F3',    // Sidebar blue from mock-up
        'brand-blue-content-bg': '#F0F5FA', // Main content area background (very light blue/off-white)
        'brand-blue-medium': '#6B90C8',     // Calm medium blue for player, UI elements
        'brand-blue-dark': '#3A5A8A',       // Deeper blue for text, headings (like "Conclusion")
        'brand-cream': '#FAF7F2',           // Off-white/cream for cards
        'brand-gold': '#FACC15',            // A nice gold/yellow for buttons/accents (Tailwind yellow-400)
        'brand-text-main': '#1F2937',       // Dark grey for primary text (Tailwind gray-800)
        'brand-text-muted': '#6B7280',      // Lighter grey for secondary text (Tailwind gray-500)
        
        // Sacred Blue Theme - Primary Color Palette
        'sacred-blue': {
          50: '#e3e8f0',   // Primary Background - soft blue-gray
          100: '#d1dae6',
          200: '#b8c7d9',
          300: '#9fb4cc',
          400: '#8b9bb1',  // Secondary Blue - muted blue for text
          500: '#7a8ba3',
          600: '#6a7b95',
          700: '#5a6b87',
          800: '#4a5b79',
          900: '#1972be',  // Primary Blue - deep blue for headings
          950: '#0f4a7a'
        },
        
        // Sacred Golden Accent
        'sacred-gold': {
          50: '#fefbf0',
          100: '#fef7e0',
          200: '#fdecc0',
          300: '#fce1a0',
          400: '#fbcd3c',  // Golden Accent - golden star icons
          500: '#f0b90b',
          600: '#d19e0a',
          700: '#b28309',
          800: '#936808',
          900: '#744d07'
        },
        
        // Sacred Purple Accent
        'sacred-purple': {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#b79ee3',  // Light Purple - soft purple gradients
          500: '#a78bfa',
          600: '#824ae0',  // Purple Accent - purple heart icons
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6'
        },

        // Enhanced spiritual color palette (keeping existing for compatibility)
        'sacred': {
          'indigo': {
            50: '#e3e8f0',   // Using Sacred Blue primary background
            100: '#d1dae6',
            200: '#b8c7d9',
            300: '#9fb4cc',
            400: '#8b9bb1',  // Using Sacred Blue secondary
            500: '#7a8ba3',
            600: '#1972be',  // Using Sacred Blue primary
            700: '#0f4a7a',
            800: '#0d3d66',
            900: '#0a3052',
            950: '#082640'
          },
          'amber': {
            50: '#fefbf0',
            100: '#fef7e0',
            200: '#fdecc0',
            300: '#fce1a0',
            400: '#fbcd3c',  // Using Sacred Gold
            500: '#f0b90b',
            600: '#d19e0a',
            700: '#b28309',
            800: '#936808',
            900: '#744d07',
            950: '#451a03'
          },
          'gold': {
            50: '#fefbf0',
            100: '#fef7e0',
            200: '#fdecc0',
            300: '#fce1a0',
            400: '#fbcd3c',  // Sacred Golden Accent
            500: '#f0b90b',
            600: '#d19e0a',
            700: '#b28309',
            800: '#854d0e',
            900: '#713f12',
            950: '#422006'
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Merriweather', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, #1972be 0%, #824ae0 100%)',
        'sacred-blue-gradient': 'linear-gradient(135deg, #e3e8f0 0%, #d1dae6 100%)',
        'sacred-gold-gradient': 'linear-gradient(135deg, #fbcd3c 0%, #f0b90b 100%)',
        'sacred-purple-gradient': 'linear-gradient(135deg, #b79ee3 0%, #824ae0 100%)',
        'spiritual-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'divine-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'sacred-peaceful': 'linear-gradient(135deg, #e3e8f0 0%, #b79ee3 50%, #fbcd3c 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sacred-pulse': 'sacred-pulse 3s ease-in-out infinite',
        'sacred-glow': 'sacred-glow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(25, 114, 190, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(25, 114, 190, 0.8)' },
        },
        'sacred-pulse': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        'sacred-glow': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(251, 205, 60, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(251, 205, 60, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};