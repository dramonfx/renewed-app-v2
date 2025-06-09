/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", // Keep this line even if you don't have a pages dir yet
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
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
      },
      fontFamily: {
        serif: ['Merriweather', 'serif'],
        sans: ['Nunito Sans', 'sans-serif'],
      },
      backgroundImage: {
        // Example if you want to add your sky background later via Tailwind
        // 'sky-background': "url('/images/sky-background.jpg')", // Ensure path is relative to public folder
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'), // <<< THIS LINE IS ADDED/ENSURED
  ],
};