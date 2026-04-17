import React, { createContext, useState, useEffect } from 'react';
import { login as authLogin, logout as authLogout, getRole } from '../services/auth.service';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists on initial load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setRole(getRole());
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await authLogin(username, password);
    setToken(data.token);
    setRole(getRole());
    return data;
  };

  const logout = () => {
    authLogout();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, isAuthenticated: !!token, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
