'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [justLoggedOut, setJustLoggedOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      try {
        const cmsUser = localStorage.getItem('cmsUser');
        if (cmsUser && cmsUser !== 'null' && cmsUser !== 'undefined') {
          const userData = JSON.parse(cmsUser);
          // Additional validation to ensure user data is valid
          if (userData && userData.email && userData.role) {
            setUser(userData);
          } else {
            // Invalid user data, clear it
            localStorage.removeItem('cmsUser');
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid data
        localStorage.removeItem('cmsUser');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('https://api.certifurb.com/api/cms/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('cmsUser', JSON.stringify(data.data));
        setUser(data.data);
        setJustLoggedOut(false); // Reset logout flag on successful login
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Connection error. Please try again.' };
    }
  };

  const logout = () => {
    // Set logout flag
    setJustLoggedOut(true);
    // Clear localStorage
    localStorage.removeItem('cmsUser');
    // Clear sessionStorage as well to be safe
    sessionStorage.removeItem('cmsUser');
    // Set user to null immediately
    setUser(null);
    // Force a small delay to ensure state is cleared before redirect
    setTimeout(() => {
      router.push('/cms');
    }, 100);
  };

  const value = {
    user,
    loading,
    justLoggedOut,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 