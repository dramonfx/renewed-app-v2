
// src/hooks/useLogin.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  
  const { login } = useAuth();
  const router = useRouter();

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = (email, password) => {
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
    
    return errors;
  };

  // Enhanced error message mapping
  const getErrorMessage = (error) => {
    if (!error) return null;
    
    const errorMessage = error.message?.toLowerCase() || '';
    
    if (errorMessage.includes('invalid login credentials') || 
        errorMessage.includes('invalid email or password')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    
    if (errorMessage.includes('email not confirmed')) {
      return 'Please check your email and click the confirmation link before logging in.';
    }
    
    if (errorMessage.includes('too many requests')) {
      return 'Too many login attempts. Please wait a moment before trying again.';
    }
    
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
      return 'Connection issue. Please check your internet connection and try again.';
    }
    
    if (errorMessage.includes('user not found')) {
      return 'No account found with this email address. Please check your email or sign up.';
    }
    
    // Default fallback
    return 'Something went wrong. Please try again or contact support if the issue persists.';
  };

  const handleLogin = async (email, password, redirectPath = '/book') => {
    // Clear previous errors
    setError(null);
    setValidationErrors({});
    
    // Validate form
    const formErrors = validateForm(email, password);
    if (Object.keys(formErrors).length > 0) {
      setValidationErrors(formErrors);
      return { success: false, errors: formErrors };
    }
    
    setIsLoading(true);
    
    try {
      const { user, session, error: loginError } = await login(email.trim(), password);
      
      if (loginError) {
        const friendlyError = getErrorMessage(loginError);
        setError(friendlyError);
        return { success: false, error: friendlyError };
      }
      
      if (user && session) {
        // Small delay to show success state before redirect
        setTimeout(() => {
          router.push(redirectPath);
        }, 500);
        
        return { success: true, user, session };
      }
      
      // Fallback error
      setError('Login failed. Please try again.');
      return { success: false, error: 'Login failed. Please try again.' };
      
    } catch (err) {
      console.error('Login error:', err);
      const friendlyError = 'An unexpected error occurred. Please try again.';
      setError(friendlyError);
      return { success: false, error: friendlyError };
    } finally {
      setIsLoading(false);
    }
  };

  const clearErrors = () => {
    setError(null);
    setValidationErrors({});
  };

  return {
    handleLogin,
    isLoading,
    error,
    validationErrors,
    clearErrors,
    validateEmail,
  };
};
