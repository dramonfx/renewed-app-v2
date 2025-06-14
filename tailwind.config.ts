
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sacred-serif': ['Playfair Display', 'serif'],
        'clean-sans': ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'sacred-mountains': 'url("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        'serene-water': 'url("https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
        'soft-sky': 'url("https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        // Sacred Blue Palette
        'sacred-blue': {
          50: '#f0f7ff',   // Soft sky blue
          100: '#e0f0ff',  // Light misty
          200: '#bae0ff',  // Misty slate
          300: '#7cc7ff',  // Sky blue
          400: '#36a9ff',  // Bright blue
          500: '#0c8ce9',  // Primary blue
          600: '#0066cc',  // Dawnlight navy
          700: '#0052a3',  // Deep navy
          800: '#003d7a',  // Darker navy
          900: '#002851',  // Deepest navy
        },
        'sacred-gold': {
          50: '#fffdf0',   // Lightest gold
          100: '#fff9d6',  // Soft gold light
          200: '#fff2ad',  // Light gold
          300: '#ffe066',  // Soft gold
          400: '#ffcc33',  // Medium gold
          500: '#e6b800',  // Primary gold
          600: '#cc9900',  // Deeper gold
          700: '#b37700',  // Dark gold
          800: '#995500',  // Darker gold
          900: '#663300',  // Deepest gold
        },
        'sacred-lavender': {
          50: '#faf7ff',   // Lightest lavender
          100: '#f0e6ff',  // Light lavender
          200: '#e0ccff',  // Soft lavender
          300: '#c299ff',  // Medium lavender
          400: '#a366ff',  // Lavender
          500: '#8533ff',  // Primary lavender
          600: '#6600cc',  // Deep lavender
          700: '#5200a3',  // Darker lavender
          800: '#3d007a',  // Dark purple
          900: '#290051',  // Deepest purple
        },
        'sacred-indigo': {
          50: '#f0f4ff',   // Lightest indigo
          100: '#e0e7ff',  // Light indigo
          200: '#c7d2fe',  // Soft indigo
          300: '#a5b4fc',  // Medium indigo
          400: '#818cf8',  // Indigo
          500: '#6366f1',  // Primary indigo
          600: '#4f46e5',  // Deep indigo
          700: '#4338ca',  // Darker indigo
          800: '#3730a3',  // Dark indigo
          900: '#312e81',  // Deepest indigo
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
        'slide-in-left': 'slide-in-left 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
