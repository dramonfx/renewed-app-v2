// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login, loading } = useAuth(); // Get login function and loading state
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Use the login from context
    const { user, session, error: signInError } = await login(email, password);

    if (signInError) {
      setError(signInError.message);
    } else if (user) {
      router.push('/book'); // Redirect to guidebook home
    } else {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-brand-blue-content-bg">
      <div className="p-8 bg-brand-cream shadow-xl rounded-xl w-full max-w-md">
        <h1 className="text-3xl font-serif text-brand-blue-dark text-center mb-6">
          Log In to Your Account
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-brand-text-main">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-text-main" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-text-main">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-brand-gold focus:border-brand-gold sm:text-sm text-brand-text-main" />
          </div>
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <div>
            <button type="submit" disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-brand-blue-dark bg-brand-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold disabled:opacity-50">
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-brand-text-muted">
          Don't have an account?{' '}
          <Link href="/signup" className="font-medium text-brand-blue-dark hover:text-brand-blue-medium underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}