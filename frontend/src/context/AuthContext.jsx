import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create a global Context Object to share auth state across all components in the React app
export const AuthContext = createContext();

// Configure the default root URL path for all Axios HTTP requests
axios.defaults.baseURL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  // Setup reactive state variables for logged in user data, active JWT tokens, loading screen overlays, and errors
  const [user, setUser] = useState(null); // stores user metadata: id, role, department, semester, name
  const [token, setToken] = useState(localStorage.getItem('token') || null); // retrieves saved token on refresh
  const [loading, setLoading] = useState(true); // blocks dashboard rendering while recovering active user profile
  const [error, setError] = useState(null); // stores error message strings from backend APIs

  // Hook that fires whenever the active session token changes (e.g. login or logout)
  useEffect(() => {
    if (token) {
      // If token exists, inject the Authorization Header into all subsequent Axios HTTP requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProfile(); // Retrieve the logged-in user profile from MongoDB
    } else {
      // If token doesn't exist, remove headers, clear state, and stop loading spinner
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  // Queries the backend to fetch full details of the user profile based on the decoded token
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/auth/me');
      
      // Save user record metadata alongside their structural role
      setUser(res.data.user ? { ...res.data.user, role: res.data.role } : null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      logout(); // Force logout if the token has expired or is invalid
    } finally {
      setLoading(false); // Finished checking profile
    }
  };

  // Triggers when user clicks 'Log In'
  const login = async (role, identifierValue, password) => {
    try {
      setError(null);
      const payload = { role, password };
      
      if (role === 'admin') payload.username = identifierValue;
      else if (role === 'teacher') payload.name = identifierValue; // Sends teacher Name to the backend
      else if (role === 'student') payload.name = identifierValue; // Sends student Name to the backend

      const res = await axios.post('/auth/login', payload);
      
      const { token: userToken, user: userData } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      setUser(userData);
      return userData;
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(errMsg);
      throw new Error(errMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put('/auth/change-password', { currentPassword, newPassword });
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, updatePassword, setError }}>
      {children}
    </AuthContext.Provider>
  );
};
