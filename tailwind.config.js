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
        
        // Enhanced spiritual color palette
        'sacred': {
          'indigo': {
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
            950: '#1e1b4b'
          },
          'amber': {
            50: '#fffbeb',
            100: '#fef3c7',
            200: '#fde68a',
            300: '#fcd34d',
            400: '#fbbf24',
            500: '#f59e0b',
            600: '#d97706',
            700: '#b45309',
            800: '#92400e',
            900: '#78350f',
            950: '#451a03'
          },
          'gold': {
            50: '#fefce8',
            100: '#fef9c3',
            200: '#fef08a',
            300: '#fde047',
            400: '#facc15',
            500: '#eab308',
            600: '#ca8a04',
            700: '#a16207',
            800: '#854d0e',
            900: '#713f12',
            950: '#422006'
          }
        }
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
      backgroundImage: {
        'sacred-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'spiritual-gradient': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'divine-gradient': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'sacred-pulse': 'sacred-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)' },
        },
        'sacred-pulse': {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};