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
    const initAuth = async () => {
      const savedToken = localStorage.getItem('retrievo_token');
      const savedUser = localStorage.getItem('retrievo_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            const decoded = decodeJwtPayload(savedToken);
            if (decoded) setUser({ email: decoded.sub, fullName: decoded.fullName || decoded.sub.split('@')[0], role: decoded.role || 'USER' });
          }
        }

        // Fetch fresh profile from database to ensure exact real name
        try {
          const res = await axiosClient.get(API_ENDPOINTS.ME);
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('retrievo_user', JSON.stringify(res.data));
          }
        } catch (err) {
          // Token may be invalid/expired
          console.warn('Could not sync user profile:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const response = await axiosClient.post(API_ENDPOINTS.LOGIN, { email, password });
    const { token: receivedToken, fullName, role } = response.data;

    localStorage.setItem('retrievo_token', receivedToken);
    setToken(receivedToken);

    const userData = {
      email: response.data.email || email,
      fullName: fullName || email.split('@')[0],
      role: role || 'USER',
    };

    localStorage.setItem('retrievo_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (registrationData) => {
    await axiosClient.post(API_ENDPOINTS.REGISTER, registrationData);
    const userData = await login(registrationData.email, registrationData.password);
    if (registrationData.fullName) {
      userData.fullName = registrationData.fullName;
      localStorage.setItem('retrievo_user', JSON.stringify(userData));
      setUser({ ...userData });
    }
    return userData;
  };

  const updateProfile = async (profileData) => {
    const response = await axiosClient.put(API_ENDPOINTS.UPDATE_PROFILE, profileData);
    const updatedUser = response.data;
    localStorage.setItem('retrievo_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return updatedUser;
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
    updateProfile,
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
