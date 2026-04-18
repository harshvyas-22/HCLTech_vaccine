import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axiosConfig';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      const userData = response.data.data?.user || response.data.user;
      const tokenValue = response.data.token;
      setUser(userData);
      setToken(tokenValue);
      toast.success('Welcome back!');
      return { user: userData, token: tokenValue };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', payload);
      const userData = response.data.data?.user || response.data.user;
      const tokenValue = response.data.token;
      setUser(userData);
      setToken(tokenValue);
      toast.success('Registration successful!');
      return { user: userData, token: tokenValue };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
  };

  const value = useMemo(
    () => ({ user, token, loading, login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
