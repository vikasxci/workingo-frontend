import React, { createContext, useState, useEffect } from 'react';
import { login, register, getCurrentUser } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth error:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const signIn = async (credentials) => {
    const { token, user } = await login(credentials);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const signUp = async (userData) => {
    const { token, user } = await register(userData);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const signOut = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};