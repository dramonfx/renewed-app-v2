'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [spiritualStep, setSpiritualStep] = useState(0); // Track spiritual preparation steps

  const { signUp, user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Sacred preparation steps for spiritual context
  const spiritualPreparation = [
    {
      title: "Sacred Intention",
      description: "Set your heart toward transformation",
      icon: "🕊️",
      message: "Every spiritual journey begins with a sacred intention. You are about to embark on a path of profound inner transformation."
    },
    {
      title: "Open Heart",
      description: "Approach with humility and readiness",
      icon: "💎",
      message: "True spiritual growth requires an open heart, ready to receive wisdom and willing to be transformed by divine truth."
    },
    {
      title: "Sacred Commitment",
      description: "Commit to the journey of renewal",
      icon: "✨",
      message: "This is more than creating an account—it's beginning a sacred journey toward spiritual renewal and authentic transformation."
    }
  ];

  // ENHANCED REDIRECT LOGIC - Fixed to check loading state
  useEffect(() => {
    // Only redirect when user is authenticated AND we're not loading
    if (user && !authLoading) {
      router.push('/book');
    }
    // If user is null/undefined and not loading, allow access to signup page
  }, [user, authLoading, router]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    return errors;
  };

  // ENHANCED error message function
  const getErrorMessage = (error) => {
    if (!error) return null;

    const errorMessage = error.message?.toLowerCase() || '';

    if (errorMessage.includes('user already registered')) {
      return 'An account with this email already exists. Please try logging in instead.';
    }

    if (errorMessage.includes('invalid email')) {
      return 'Please enter a valid email address.';
    }

    if (errorMessage.includes('password')) {
      return 'Password must be at least 6 characters long.';
    }

    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Connection issue. Please check your internet connection and try again.';
    }

    return 'Something went wrong. Please try again or contact support if the issue persists.';
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setValidationErrors({});

    // Validate form
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return;
    }

    setIsLoading(true);

    try {
      const { user, session, error: signUpError } = await signUp(email.trim(), password);

      if (signUpError) {
        const friendlyError = getErrorMessage(signUpError);
        setError(friendlyError);
      } else if (user) {
        setSuccessMessage('🕊️ Sacred account created! Preparing your spiritual journey...');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        // Clear any existing onboarding completion to ensure fresh start
        localStorage.removeItem('renewedOnboardingCompleted');
        localStorage.removeItem('renewedOnboardingData');
        
        // Redirect to onboarding for spiritual preparation
        setTimeout(() => {
          router.push('/onboarding');
        }, 2000);
      } else {
        setSuccessMessage(
          '🙏 Sacred journey initiated. Please check your email for confirmation instructions.'
        );
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced spiritual preparation display
  const showSpiritualPreparation = () => {
    const currentStep = spiritualPreparation[spiritualStep];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <SacredCard variant="glass" className="p-6 text-center">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
          >
            <span className="text-2xl">{currentStep.icon}</span>
          </motion.div>
          <h3 className="mb-2 font-serif text-xl text-sacred-blue-900">{currentStep.title}</h3>
          <p className="mb-4 text-sm text-sacred-blue-600">{currentStep.description}</p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-sm leading-relaxed text-sacred-blue-700"
          >
            {currentStep.message}
          </motion.p>
          
          <div className="mt-6 flex justify-center space-x-2">
            {spiritualPreparation.map((_, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8 }}
                animate={{ scale: index === spiritualStep ? 1.2 : 1 }}
                className={`h-3 w-3 rounded-full ${
                  index === spiritualStep ? 'bg-sacred-gold-500' : 'bg-sacred-blue-200'
                }`}
              />
            ))}
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            {spiritualStep > 0 && (
              <SacredButton
                variant="ghost"
                size="sm"
                onClick={() => setSpiritualStep(spiritualStep - 1)}
              >
                Previous
              </SacredButton>
            )}
            {spiritualStep < spiritualPreparation.length - 1 ? (
              <SacredButton
                variant="primary"
                size="sm"
                onClick={() => setSpiritualStep(spiritualStep + 1)}
              >
                Continue
              </SacredButton>
            ) : (
              <SacredButton
                variant="gold"
                size="sm"
                onClick={() => setSpiritualStep(-1)} // Hide spiritual preparation
              >
                Begin Sacred Registration
              </SacredButton>
            )}
          </div>
        </SacredCard>
      </motion.div>
    );
  };

  // ENHANCED input change handlers with better error clearing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationErrors.email || error) {
      setValidationErrors((prev) => ({ ...prev, email: '' }));
      setError(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (validationErrors.password || error) {
      setValidationErrors((prev) => ({ ...prev, password: '' }));
      setError(null);
    }
    // Real-time password matching validation
    if (confirmPassword && e.target.value !== confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (confirmPassword && e.target.value === confirmPassword) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (validationErrors.confirmPassword || error) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
      setError(null);
    }
    // Real-time password matching validation
    if (password && e.target.value !== password) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: 'Passwords do not match' }));
    } else if (password && e.target.value === password) {
      setValidationErrors((prev) => ({ ...prev, confirmPassword: '' }));
    }
  };

  // ENHANCED: Show loading spinner while auth state is being determined
  if (authLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        role="status"
        aria-label="Loading authentication state"
      >
        <div className="flex flex-col items-center space-y-4">
          <LoadingSpinner size="lg" className="text-sacred-blue-500" />
          <p className="text-sacred-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sacred-journey-gradient min-h-screen px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-8">
        {/* Enhanced Spiritual Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="sacred-icon-bg-gold mx-auto mb-6 h-20 w-20"
            role="img"
            aria-label="Sacred transformation icon"
          >
            <svg
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sacred mb-3 font-serif text-4xl font-bold"
          >
            Sacred Journey Begins
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sacred-muted text-lg"
          >
            Welcome to your spiritual transformation portal
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-4 h-px bg-sacred-gradient"
          />
        </motion.div>

        {/* Show Spiritual Preparation or Registration Form */}
        {spiritualStep >= 0 && spiritualStep < spiritualPreparation.length ? (
          showSpiritualPreparation()
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SacredCard variant="heavy" className="relative p-8">
              <div className="mb-6 text-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
                >
                  <span className="text-xl text-white">🕊️</span>
                </motion.div>
                <h2 className="mb-2 font-serif text-2xl text-sacred-blue-900">Sacred Registration</h2>
                <p className="text-sm text-sacred-blue-600">
                  Complete your sacred account creation to begin your journey
                </p>
              </div>
          {/* ENHANCED Loading Overlay with better accessibility */}
          {isLoading && (
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
              role="status"
              aria-label="Creating your account"
            >
              <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="lg" className="text-sacred-blue-500" />
                <p className="text-sm font-medium text-sacred-blue-600">Creating your account...</p>
              </div>
            </div>
          )}

          {/* ENHANCED Success Message with better accessibility */}
          {successMessage && (
            <div className="sacred-success mb-6" role="alert" aria-live="polite">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6" noValidate>
            {/* ENHANCED Email Field */}
            <SacredInput
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={validationErrors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
              disabled={isLoading || !!successMessage}
            />

            {/* ENHANCED Password Field */}
            <div>
              <SacredInput
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                error={validationErrors.password}
                placeholder="Create a password"
                autoComplete="new-password"
                showPasswordToggle
                required
                aria-describedby={validationErrors.password ? 'password-error' : 'password-help'}
                disabled={isLoading || !!successMessage}
              />
              {!validationErrors.password && (
                <p id="password-help" className="mt-1 text-xs text-sacred-blue-600">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* ENHANCED Confirm Password Field with real-time validation */}
            <SacredInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={validationErrors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
              showPasswordToggle
              required
              aria-describedby={
                validationErrors.confirmPassword ? 'confirm-password-error' : undefined
              }
              disabled={isLoading || !!successMessage}
            />

            {/* ENHANCED General Error Message */}
            {error && !Object.values(validationErrors).some(Boolean) && (
              <div className="sacred-error-message" role="alert" aria-live="polite">
                <div className="flex items-start">
                  <svg
                    className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* ENHANCED Submit Button with improved disabled state logic */}
            <SacredButton
              type="submit"
              variant="gold"
              size="lg"
              disabled={
                isLoading || !!successMessage || Object.values(validationErrors).some(Boolean)
              }
              loading={isLoading}
              className="w-full"
              aria-describedby={isLoading ? 'creating-account-status' : undefined}
            >
              {successMessage ? (
                <>
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Success!
                </>
              ) : (
                'Create Account'
              )}
            </SacredButton>

            {/* ENHANCED Screen reader status for loading */}
            {isLoading && (
              <div id="creating-account-status" className="sr-only" aria-live="polite">
                Creating your account, please wait...
              </div>
            )}
          </form>

          {/* Footer with enhanced spiritual context */}
          <div className="mt-8 text-center">
            <p className="text-sm text-sacred-blue-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="rounded font-semibold text-sacred-blue-700 underline transition-colors duration-200 hover:text-sacred-blue-800 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500 focus:ring-offset-2"
                tabIndex={isLoading || !!successMessage ? -1 : 0}
              >
                Continue your journey
              </Link>
            </p>
          </div>
        </SacredCard>
      </motion.div>
    )}

        {/* Additional Spiritual Guidance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sacred-muted text-xs">
            🙏 By creating an account, you enter into a sacred covenant of transformation and growth.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
