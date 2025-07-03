// src/contexts/AuthContext.tsx
'use client'; // This context will be used by client components

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

// Auth result interfaces
interface AuthResult {
  user: User | null;
  session: any;
  error: any;
}

interface AuthError {
  error: any;
}

// Context interface
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  login: (email: string, password: string, redirectPath?: string) => Promise<AuthResult>;
  logout: () => Promise<AuthError>;
}

// Provider props interface
interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    // Check for an existing session
    const getSession = async (): Promise<void> => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error.message);
          setLoading(false);
          return;
        }
        setUser((data?.session?.user as User) ?? null);
        setLoading(false);
      } catch (error) {
        console.error('Unexpected error getting session:', error);
        setLoading(false);
      }
    };

    getSession();

    // Listen for changes in auth state (login, logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      setUser((session?.user as User) ?? null);
      setLoading(false); // Ensure loading is false after auth state change

      // Optional: Redirect based on event
      // if (event === 'SIGNED_IN') router.push('/book');
      // if (event === 'SIGNED_OUT') router.push('/');
    });

    // Cleanup listener on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]); // Added router to dependency array

  // Signup function
  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      setLoading(false);
      return {
        user: (data?.user as User) ?? null,
        session: data?.session ?? null,
        error,
      };
    } catch (error) {
      setLoading(false);
      console.error('Error during signup:', error);
      return {
        user: null,
        session: null,
        error,
      };
    }
  };

  // Login function with optional redirect
  const login = async (
    email: string,
    password: string,
    redirectPath?: string
  ): Promise<AuthResult> => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error && data?.user) {
        // Handle redirect after successful login
        const targetPath = redirectPath || '/dashboard';
        setTimeout(() => {
          router.push(targetPath);
        }, 500); // Small delay to show success state
      }

      setLoading(false);
      return {
        user: (data?.user as User) ?? null,
        session: data?.session ?? null,
        error,
      };
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
      return {
        user: null,
        session: null,
        error,
      };
    }
  };

  // Logout function
  const logout = async (): Promise<AuthError> => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null); // Clear user state immediately
      setLoading(false);
      if (error) {
        console.error('Error logging out:', error.message);
      } else {
        router.push('/login'); // Redirect to login after successful logout
      }
      return { error };
    } catch (error) {
      setLoading(false);
      console.error('Unexpected error during logout:', error);
      return { error };
    }
  };

  const value: AuthContextValue = {
    user,
    loading,
    signUp,
    login,
    logout,
  };

  // Don't render children until loading is false (initial session check is done)
  // Or show a loading spinner for the whole app
  return (
    <AuthContext.Provider value={value}>
      {/* We could show a global loading spinner here if `loading` is true */}
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    // Check for null as well
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export types for other files to use
export type { AuthContextValue, AuthProviderProps, AuthResult, AuthError };
