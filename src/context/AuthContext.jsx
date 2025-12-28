import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Mock login - replace with actual API call
    const mockUser = {
      id: 1,
      email,
      firstName: email === 'admin@mitra.com' ? 'Admin' : 
                 email === 'hr@mitra.com' ? 'Sarah' : 'John',
      lastName: email === 'admin@mitra.com' ? 'User' : 
                email === 'hr@mitra.com' ? 'Johnson' : 'Doe',
      role: email === 'admin@mitra.com' ? 'ADMIN' : 
            email === 'hr@mitra.com' ? 'HR' : 'INTERVIEWER',
      profilePicture: null,
    };
    setUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return Promise.resolve(mockUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
