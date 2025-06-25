// src/contexts/AuthContext.js
'use client'; // This context will be used by client components

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Adjust path if needed
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const router = useRouter();

  useEffect(() => {
    // Check for an existing session
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
        setLoading(false);
        return;
      }
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Listen for changes in auth state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setUser(session?.user ?? null);
        setLoading(false); // Ensure loading is false after auth state change
        
        // Optional: Redirect based on event
        // if (event === 'SIGNED_IN') router.push('/book');
        // if (event === 'SIGNED_OUT') router.push('/');
      }
    );

    // Cleanup listener on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, [router]); // Added router to dependency array

  // Signup function
  const signUp = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    return { user: data.user, session: data.session, error };
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { user: data.user, session: data.session, error };
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setUser(null); // Clear user state immediately
    setLoading(false);
    if (error) {
      console.error('Error logging out:', error.message);
    }
    router.push('/'); // Redirect to home page after logout
    return { error };
  };

  const value = {
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
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { // Check for null as well
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};