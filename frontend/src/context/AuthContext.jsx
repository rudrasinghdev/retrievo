import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { API_ENDPOINTS } from '../api/apiEndpoints';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to decode JWT payload safely
  const decodeJwtPayload = (jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('retrievo_token');
    const savedUser = localStorage.getItem('retrievo_user');

    if (savedToken) {
      setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          const decoded = decodeJwtPayload(savedToken);
          if (decoded) setUser({ email: decoded.sub, role: decoded.role || 'USER' });
        }
      } else {
        const decoded = decodeJwtPayload(savedToken);
        if (decoded) setUser({ email: decoded.sub, role: decoded.role || 'USER' });
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token: receivedToken } = response.data;

    localStorage.setItem('retrievo_token', receivedToken);
    setToken(receivedToken);

    const decoded = decodeJwtPayload(receivedToken);
    const userData = {
      email: decoded?.sub || email,
      fullName: email.split('@')[0],
      role: decoded?.role || 'USER',
    };

    localStorage.setItem('retrievo_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (registrationData) => {
    const response = await axiosClient.post(API_ENDPOINTS.REGISTER, registrationData);
    // After registration, log the user in automatically
    return await login(registrationData.email, registrationData.password);
  };

  const logout = () => {
    localStorage.removeItem('retrievo_token');
    localStorage.removeItem('retrievo_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
