
/**
 * Application constants
 */

// API endpoints
export const API_ENDPOINTS = {
  SECTIONS: '/api/sections',
  USERS: '/api/users',
  AUTH: '/api/auth',
  JOURNAL: '/api/journal',
  AUDIO_TRACKS: '/api/audio-tracks',
} as const;

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  BOOK: '/book',
  JOURNAL: '/journal',
  ONBOARDING: '/onboarding',
  FORGOT_PASSWORD: '/forgot-password',
  FULL_AUDIO_PLAYER: '/full-audio-player',
} as const;

// UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: '18rem', // w-72 in Tailwind
  MAX_CONTENT_WIDTH: '1200px',
  ANIMATION_DURATION: '200ms',
} as const;

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_EMAIL_LENGTH: 254,
  MAX_JOURNAL_CONTENT_LENGTH: 10000,
  MIN_JOURNAL_CONTENT_LENGTH: 10,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
} as const;

// Journal constants
export const JOURNAL_CONSTANTS = {
  REFLECTION_TYPES: [
    { id: 'mind_discernment', name: 'Mind Discernment', color: 'blue' },
    { id: 'gratitude', name: 'Gratitude Practice', color: 'green' },
    { id: 'spiritual_insight', name: 'Spiritual Insight', color: 'purple' },
    { id: 'daily_reflection', name: 'Daily Reflection', color: 'amber' },
    { id: 'prayer_meditation', name: 'Prayer & Meditation', color: 'indigo' },
    { id: 'scripture_study', name: 'Scripture Study', color: 'emerald' },
    { id: 'life_transformation', name: 'Life Transformation', color: 'rose' },
  ],
  SACRED_TAGS: [
    'wisdom', 'peace', 'love', 'growth', 'healing', 'forgiveness',
    'gratitude', 'faith', 'hope', 'joy', 'strength', 'guidance',
    'purpose', 'clarity', 'transformation', 'surrender', 'blessing',
    'prayer', 'meditation', 'scripture'
  ],
  MINDSET_TYPES: {
    NATURAL: 'natural' as const,
    TRANSITION: 'transition' as const,
    SPIRITUAL: 'spiritual' as const,
  },
} as const;

// Audio player constants
export const AUDIO_CONSTANTS = {
  DEFAULT_VOLUME: 0.8,
  SEEK_INTERVAL: 10, // seconds
  AUTO_SAVE_PROGRESS_INTERVAL: 30, // seconds
} as const;

// Type exports for constants
export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];
export type Route = typeof ROUTES[keyof typeof ROUTES];
export type ValidationKey = keyof typeof VALIDATION;
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type MindsetType = typeof JOURNAL_CONSTANTS.MINDSET_TYPES[keyof typeof JOURNAL_CONSTANTS.MINDSET_TYPES];
