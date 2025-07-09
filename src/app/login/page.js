'use client';

import { useState, useEffect, Suspense } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

// Component that uses useSearchParams - needs to be wrapped in Suspense
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const { handleLogin, isLoading, error, validationErrors, clearErrors } = useLogin();
  const { user, loading: authLoading } = useAuth(); // Fixed: Added loading state
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get the return URL from query parameters
  const returnUrl = searchParams.get('returnUrl') || '/dashboard';

  // ENHANCED REDIRECT LOGIC - Only redirect if user was already authenticated on page load
  useEffect(() => {
    // Only redirect when user is authenticated AND we're not loading AND login wasn't just successful
    if (user && !authLoading && !loginSuccess) {
      router.push(returnUrl);
    }
    // If user is null/undefined and not loading, allow access to login page
  }, [user, authLoading, router, returnUrl, loginSuccess]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const result = await handleLogin(email, password, returnUrl);

    if (result.success) {
      setLoginSuccess(true);
      // Clear form
      setEmail('');
      setPassword('');
    }
  };

  // Enhanced error clearing with better UX
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationErrors.email || error) {
      clearErrors();
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (validationErrors.password || error) {
      clearErrors();
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
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="sacred-icon-bg mx-auto mb-6 h-20 w-20"
            role="img"
            aria-label="Sacred return icon"
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
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-sacred mb-3 font-serif text-4xl font-bold"
          >
            Sacred Return
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-sacred-muted text-lg"
          >
            Welcome back to your journey of spiritual transformation
          </motion.p>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: '100%' }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mx-auto mt-4 h-px bg-sacred-gradient"
          />
        </motion.div>

        {/* Enhanced Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <SacredCard variant="heavy" className="relative p-8">
            {/* Spiritual Form Header */}
            <div className="mb-6 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sacred-gradient shadow-lg"
              >
                <span className="text-xl text-white">🔑</span>
              </motion.div>
              <h2 className="mb-2 font-serif text-2xl text-sacred-blue-900">Sacred Access</h2>
              <p className="text-sm text-sacred-blue-600">
                Enter your credentials to continue your spiritual journey
              </p>
            </div>

            {/* ENHANCED Loading Overlay with better accessibility */}
            {isLoading && (
              <div
                className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm"
                role="status"
                aria-label="Signing you in"
              >
                <div className="flex flex-col items-center space-y-3">
                  <LoadingSpinner size="lg" className="text-sacred-blue-500" />
                  <p className="text-sm font-medium text-sacred-blue-600">🕊️ Preparing your sacred space...</p>
                </div>
              </div>
            )}

            {/* ENHANCED Success Message with spiritual context */}
            {loginSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="sacred-success mb-6"
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1 }}
                    className="mr-3"
                  >
                    <span className="text-2xl">🕊️</span>
                  </motion.div>
                  <div>
                    <p className="font-medium text-sacred-blue-900">Sacred access granted!</p>
                    <p className="text-sm text-sacred-blue-600">Preparing your spiritual sanctuary...</p>
                  </div>
                </div>
              </motion.div>
            )}

          <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {/* ENHANCED Email Field with better accessibility */}
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
              disabled={isLoading || loginSuccess}
            />

            {/* ENHANCED Password Field with better accessibility */}
            <SacredInput
              label="Password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              error={validationErrors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              showPasswordToggle
              required
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
              disabled={isLoading || loginSuccess}
            />

            {/* ENHANCED General Error Message with better accessibility */}
            {error && !validationErrors.email && !validationErrors.password && (
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

            {/* Forgot Password Link with enhanced accessibility */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="rounded text-sm text-sacred-blue-600 underline transition-colors duration-200 hover:text-sacred-blue-700 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500 focus:ring-offset-2"
                tabIndex={isLoading || loginSuccess ? -1 : 0}
              >
                Forgot your password?
              </Link>
            </div>

            {/* ENHANCED Submit Button with better loading states */}
            <SacredButton
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading || loginSuccess}
              loading={isLoading}
              className="w-full"
              aria-describedby={isLoading ? 'signing-in-status' : undefined}
            >
              {loginSuccess ? (
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
                'Sign In'
              )}
            </SacredButton>

            {/* ENHANCED Screen reader status for loading */}
            {isLoading && (
              <div id="signing-in-status" className="sr-only" aria-live="polite">
                Signing you in, please wait...
              </div>
            )}
          </form>

            {/* Footer with enhanced spiritual context */}
            <div className="mt-8 text-center">
              <p className="text-sm text-sacred-blue-600">
                New to your spiritual journey?{' '}
                <Link
                  href="/signup"
                  className="rounded font-semibold text-sacred-blue-700 underline transition-colors duration-200 hover:text-sacred-blue-800 focus:outline-none focus:ring-2 focus:ring-sacred-blue-500 focus:ring-offset-2"
                  tabIndex={isLoading || loginSuccess ? -1 : 0}
                >
                  Begin your sacred transformation
                </Link>
              </p>
            </div>
          </SacredCard>
        </motion.div>

        {/* Additional Spiritual Guidance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center"
        >
          <p className="text-sacred-muted text-xs">
            🙏 Every return to the sacred path is a homecoming of the soul.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// Main component that wraps LoginForm in Suspense
export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LoginForm />
    </Suspense>
  );
}
