
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { LoadingSpinner } from '@/components/LoadingSpinner.jsx';
import { MdEmail, MdArrowBack, MdVpnKey } from 'react-icons/md';

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Glassmorphism Card */}
        <div className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-4 shadow-lg">
              <MdVpnKey className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-100/80 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <MdEmail className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium text-sm">
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
            <div className="mb-6 p-4 bg-red-100/80 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError('');
                  }}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg bg-white/50 backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 ${
                    emailError
                      ? 'border-red-300 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
                  }`}
                  placeholder="Enter your email address"
                  disabled={loading}
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-yellow-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <MdEmail className="w-5 h-5 mr-2" />
                  Send Reset Link
                </>
              )}
            </button>
          </form>

          {/* Navigation Links */}
          <div className="mt-8 text-center space-y-3">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-gray-600 hover:text-amber-600 transition-colors duration-200"
            >
              <MdArrowBack className="w-4 h-4 mr-1" />
              Back to Login
            </Link>
            
            <div className="text-sm text-gray-500">
              Don&apos;t have an account?{' '}
              <Link
                href="/signup"
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
              >
                Sign up here
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 leading-relaxed">
            Having trouble? The reset link will expire in 24 hours for security reasons.
            If you don&apos;t receive an email, please check your spam folder or try again.
          </p>
        </div>
      </div>
    </div>
  );
}