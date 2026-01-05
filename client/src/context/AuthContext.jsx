import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updateUser = (userData) => {
    setUser(userData);
  };
  
  // New function to refresh user data from the server
  const refreshUser = async () => {
    const token = localStorage.getItem('token');
    if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/users/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          return true;
        } catch (err) {
          console.error('Failed to refresh user:', err);
          setUser(null);
          localStorage.removeItem('token');
          return false;
        }
    }
    return false;
  };
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;