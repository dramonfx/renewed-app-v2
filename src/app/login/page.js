
'use client';

import { useState, useEffect } from 'react';
import { useLogin } from '@/hooks/useLogin';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);
  
  const { handleLogin, isLoading, error, validationErrors, clearErrors } = useLogin();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in (but wait for auth loading to complete)
  useEffect(() => {
    if (user && !authLoading) {
      router.push('/book');
    }
  }, [user, authLoading, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const result = await handleLogin(email, password);
    
    if (result.success) {
      setLoginSuccess(true);
      // Clear form
      setEmail('');
      setPassword('');
    }
  };

  // Clear errors when user starts typing
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

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 sacred-icon-bg mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-sacred mb-2">
            Welcome Back
          </h2>
          <p className="text-sacred-muted">
            Continue your journey of spiritual transformation
          </p>
        </div>

        {/* Login Form */}
        <SacredCard variant="heavy" className="p-8 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
              <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="lg" className="text-sacred-blue-500" />
                <p className="text-sm text-sacred-blue-600 font-medium">Signing you in...</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {loginSuccess && (
            <div className="mb-6 sacred-success">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">Welcome back! Redirecting you now...</p>
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Email Field */}
            <SacredInput
              label="Email Address"
              type="email"
              value={email}
              onChange={handleEmailChange}
              error={validationErrors.email}
              placeholder="Enter your email"
              autoComplete="email"
              required
            />

            {/* Password Field */}
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
            />

            {/* General Error Message */}
            {error && !validationErrors.email && !validationErrors.password && (
              <div className="sacred-error-message">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Forgot Password Link */}
            <div className="text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-sacred-blue-600 hover:text-sacred-blue-700 underline transition-colors duration-200"
              >
                Forgot your password?
              </Link>
            </div>

            {/* Submit Button */}
            <SacredButton
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading || loginSuccess}
              loading={isLoading}
              className="w-full"
            >
              {loginSuccess ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success!
                </>
              ) : (
                'Sign In'
              )}
            </SacredButton>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-sacred-blue-600">
              New to your spiritual journey?{' '}
              <Link 
                href="/signup" 
                className="font-semibold text-sacred-blue-700 hover:text-sacred-blue-800 underline transition-colors duration-200"
              >
                Create an account
              </Link>
            </p>
          </div>
        </SacredCard>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-sacred-muted">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
