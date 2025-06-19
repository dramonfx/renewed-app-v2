
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { LoadingSpinner } from '@/components/LoadingSpinner.jsx';
import SacredButton from '@/components/ui/sacred-button';
import SacredCard from '@/components/ui/sacred-card';
import SacredInput from '@/components/ui/sacred-input';
import { KeyIcon, ArrowLeftIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

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
            <KeyIcon className="w-8 h-8" />
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
                <EnvelopeIcon className="w-5 h-5 text-green-600 mr-2" />
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
              <EnvelopeIcon className="w-5 h-5 mr-2" />
              Send Reset Link
            </SacredButton>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-sacred-blue-600 hover:text-sacred-blue-700 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-1" />
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
