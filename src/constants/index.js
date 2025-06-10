/**
 * Application constants
 */

// API endpoints
export const API_ENDPOINTS = {
  SECTIONS: '/api/sections',
  USERS: '/api/users',
  AUTH: '/api/auth',
};

// Application routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  BOOK: '/book',
  FORGOT_PASSWORD: '/forgot-password',
  FULL_AUDIO_PLAYER: '/full-audio-player',
};

// UI constants
export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: '18rem', // w-72 in Tailwind
  MAX_CONTENT_WIDTH: '1200px',
  ANIMATION_DURATION: '200ms',
};

// Validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_EMAIL_LENGTH: 254,
};

// Error messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`,
  GENERIC_ERROR: 'Something went wrong. Please try again later.',
};