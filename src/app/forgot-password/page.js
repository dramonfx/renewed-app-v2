
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { LoadingSpinner } from '@/components/LoadingSpinner.jsx';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  // Email validation function
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    // Reset previous states
    setError('');
    setEmailError('');
    setSuccess(false);

    // Validate email
    if (!email.trim()) {
      setEmailError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });

      if (error) {
        throw error;
      }

      // Show success message regardless of whether email exists (security best practice)
      setSuccess(true);
      setEmail(''); // Clear the form
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 sacred-icon-bg mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-serif font-bold text-sacred mb-2">
            Forgot Password?
          </h1>
          <p className="text-sacred-muted text-sm leading-relaxed">
            No worries! Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Main Card */}
        <SacredCard variant="heavy" className="p-8 mb-6">
          {/* Success Message */}
          {success && (
            <div className="mb-6 sacred-success">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="font-medium text-green-800">
                    Reset link sent!
                  </p>
                  <p className="text-green-700 text-xs mt-1">
                    If an account with that email exists, a password reset link has been sent. Please check your inbox and spam folder.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 sacred-error-message">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <SacredInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
              error={emailError}
              placeholder="Enter your email address"
              disabled={loading}
              required
            />

            <SacredButton
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              loading={loading}
              className="w-full"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Reset Link
            </SacredButton>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-sacred-blue-600 hover:text-sacred-blue-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Login
            </Link>
            
            <div className="text-sm text-sacred-blue-600">
              Don't have an account?{' '}
              <Link
                href="/signup"
                className="text-sacred-blue-700 hover:text-sacred-blue-800 font-medium transition-colors duration-200"
              >
                Sign up here
              </Link>
            </div>
          </div>
        </SacredCard>

        {/* Additional Help Text */}
        <div className="text-center">
          <p className="text-xs text-sacred-muted leading-relaxed">
            Having trouble? The reset link will expire in 24 hours for security reasons.
            If you don't receive an email, please check your spam folder or try again.
          </p>
        </div>
      </div>
    </div>
  );
}
