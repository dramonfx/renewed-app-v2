
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  
  const { signUp, user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/book');
    }
  }, [user, router]);

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
        setSuccessMessage('Account created successfully! You will be redirected shortly.');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/book');
        }, 2000);
      } else {
        setSuccessMessage('Account creation initiated. Please check your email for confirmation instructions.');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear errors when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (validationErrors.email || error) {
      setValidationErrors(prev => ({ ...prev, email: '' }));
      setError(null);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (validationErrors.password || error) {
      setValidationErrors(prev => ({ ...prev, password: '' }));
      setError(null);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (validationErrors.confirmPassword || error) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
      setError(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 sacred-icon-bg-gold mb-6">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-sacred mb-2">
            Begin Your Journey
          </h2>
          <p className="text-sacred-muted">
            Create your account to start your spiritual transformation
          </p>
        </div>

        {/* Signup Form */}
        <SacredCard variant="heavy" className="p-8 relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
              <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="lg" className="text-sacred-blue-500" />
                <p className="text-sm text-sacred-blue-600 font-medium">Creating your account...</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 sacred-success">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
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
              />
              {!validationErrors.password && (
                <p className="mt-1 text-xs text-sacred-blue-600">Password must be at least 6 characters</p>
              )}
            </div>

            {/* Confirm Password Field */}
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
            />

            {/* General Error Message */}
            {error && !Object.values(validationErrors).some(Boolean) && (
              <div className="sacred-error-message">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <SacredButton
              type="submit"
              variant="gold"
              size="lg"
              disabled={isLoading || !!successMessage}
              loading={isLoading}
              className="w-full"
            >
              {successMessage ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Success!
                </>
              ) : (
                'Create Account'
              )}
            </SacredButton>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-sacred-blue-600">
              Already have an account?{' '}
              <Link 
                href="/login" 
                className="font-semibold text-sacred-blue-700 hover:text-sacred-blue-800 underline transition-colors duration-200"
              >
                Sign in
              </Link>
            </p>
          </div>
        </SacredCard>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-xs text-sacred-muted">
            By creating an account, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  );
}
