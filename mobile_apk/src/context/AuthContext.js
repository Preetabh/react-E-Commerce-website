import React, { createContext, useState, useEffect } from 'react';
import { getAuthData, saveAuthData, clearAuthData } from '../utils/storage';
import axiosClient from '../api/axiosClient';
import { ENDPOINTS } from '../api/config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // 'user' | 'owner' | null
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialAuth();
  }, []);

  const loadInitialAuth = async () => {
    try {
      const auth = await getAuthData();
      if (auth.token && auth.role) {
        setToken(auth.token);
        setRole(auth.role);
        setUser(auth.userInfo);
        fetchProfile(auth.role);
      }
    } catch (err) {
      console.error('Failed to load initial auth', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (currentRole) => {
    try {
      const endpoint = currentRole === 'owner' ? ENDPOINTS.OWNER_PROFILE : ENDPOINTS.USER_PROFILE;
      const res = await axiosClient.get(endpoint);
      if (res.data) {
        const userData = res.data.user || res.data.owner || res.data;
        setUser(userData);
      }
    } catch (err) {
      console.warn('Could not refresh profile data');
    }
  };

  const loginUser = async (authToken, userData) => {
    setToken(authToken);
    setRole('user');
    setUser(userData);
    await saveAuthData(authToken, 'user', userData);
  };

  const loginOwner = async (authToken, ownerData) => {
    setToken(authToken);
    setRole('owner');
    setUser(ownerData);
    await saveAuthData(authToken, 'owner', ownerData);
  };

  const logout = async () => {
    try {
      if (role === 'owner') {
        await axiosClient.post(ENDPOINTS.OWNER_LOGOUT);
      } else if (role === 'user') {
        await axiosClient.post(ENDPOINTS.USER_LOGOUT);
      }
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setRole(null);
      setUser(null);
      await clearAuthData();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        user,
        loading,
        loginUser,
        loginOwner,
        logout,
        setUser,
        refreshProfile: () => fetchProfile(role),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
