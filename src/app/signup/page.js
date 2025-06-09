// src/app/signup/page.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { signUp, loading } = useAuth(); // Get signUp function and loading state from context
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (password.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    // Use the signUp from context
    const { user, session, error: signUpError } = await signUp(email, password);

    if (signUpError) {
      setError(signUpError.message);
    } else if (user) {
      setSuccessMessage('Signup successful! You will be redirected shortly.');
      setEmail('');
      setPassword('');
      setTimeout(() => {
        router.push('/book'); // Or '/login'
      }, 2000);
    } else {
        setSuccessMessage('Signup initiated. Please follow any further instructions.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-brand-blue-content-bg">
      <div className="p-8 bg-brand-cream shadow-xl rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-serif text-brand-blue-dark text-center mb-6">
          Create Your Account
        </h1>
        <form onSubmit={handleSignup} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-main">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-text-main" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-text-main">Password</label>
            <input id="password" name="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-text-main" />
            <p className="mt-1 text-xs text-brand-text-muted">Password should be at least 6 characters.</p>
          </div>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          {successMessage && <p className="text-sm text-green-600 bg-green-100 p-3 rounded-md">{successMessage}</p>}
          <div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-brand-blue-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50">
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-brand-text-muted">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-brand-blue-dark hover:text-brand-blue-medium underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}