'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email.trim()) {
      setError('Email address is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (resetError) {
        if (resetError.message.includes('rate limit')) {
          setError('Too many reset attempts. Please wait before trying again.');
        } else {
          setError('Unable to send reset email. Please try again or contact support.');
        }
      } else {
        setIsSuccess(true);
        setMessage('Check your email for a password reset link. The link will expire in 24 hours.');
        setEmail('');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="sacred-icon-bg mx-auto mb-6 h-16 w-16">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h2 className="text-sacred mb-2 font-serif text-3xl font-bold">Reset Password</h2>
          <p className="text-sacred-muted">
            Enter your email address and we&apos;ll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <SacredCard variant="heavy" className="relative p-8">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm">
              <div className="flex flex-col items-center space-y-3">
                <LoadingSpinner size="lg" className="text-sacred-blue-500" />
                <p className="text-sm font-medium text-sacred-blue-600">Sending reset link...</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isSuccess && message && (
            <div className="sacred-success mb-6">
              <div className="flex items-start">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <p className="font-medium text-green-800">Email sent successfully!</p>
                  <p className="mt-1 text-sm text-green-700">{message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="sacred-error-message mb-6">
              <div className="flex items-start">
                <svg
                  className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
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

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <SacredInput
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email address"
                autoComplete="email"
                required
              />

              {/* Submit Button */}
              <SacredButton
                type="submit"
                variant="gold"
                size="lg"
                disabled={isLoading}
                loading={isLoading}
                className="w-full"
              >
                Send Reset Link
              </SacredButton>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Resend Button */}
              <SacredButton
                onClick={() => {
                  setIsSuccess(false);
                  setMessage('');
                }}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Send Another Reset Link
              </SacredButton>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-sacred-blue-600">
              Remember your password?{' '}
              <Link
                href="/login"
                className="font-semibold text-sacred-blue-700 underline transition-colors duration-200 hover:text-sacred-blue-800"
              >
                Back to Sign In
              </Link>
            </p>
          </div>
        </SacredCard>

        {/* Additional Help */}
        <div className="text-center">
          <p className="text-sacred-muted text-xs">
            Didn&apos;t receive the email? Check your spam folder or contact support.
          </p>
        </div>
      </div>
    </div>
  );
}
