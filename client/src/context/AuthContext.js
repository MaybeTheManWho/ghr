import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

// Set to true for local development (bypass Discord OAuth); set to false for production
const DEV_MODE = true;

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);

        // Development mode: bypass backend and set mock user
        if (DEV_MODE) {
          const mockUser = {
            id: "dev-user-123",
            username: "Development User",
            role: {
              id: "admin-role",
              name: "Administrator",
              color: "#FF0000",
              permissions: {
                tickets: true,
                stats: true,
                snippets: true,
                siteManagement: true
              }
            }
          };
          setCurrentUser(mockUser);
          setLoading(false);
          return;
        }

        // Normal authentication flow for production
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }
        
        api.setToken(token);
        const userData = await api.get('/auth/me');
        setCurrentUser(userData);
      } catch (err) {
        console.error('Failed to load user:', err);
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);
  
  // Login with Discord
  const loginWithDiscord = () => {
    const width = 500;
    const height = 800;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      `${process.env.REACT_APP_API_URL}/auth/discord`,
      'discord-login',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    const checkPopup = setInterval(() => {
      if (!popup || popup.closed) {
        clearInterval(checkPopup);
        fetchUser();
      }
    }, 500);
  };
  
  // Fetch user data
  const fetchUser = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setLoading(false);
        return;
      }
      
      api.setToken(token);
      const userData = await api.get('/auth/me');
      setCurrentUser(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user:', err);
      setError('Failed to retrieve user information.');
    } finally {
      setLoading(false);
    }
  };
  
  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    api.setToken(null);
    setCurrentUser(null);
  };
  
  // Check if user has permission
  const hasPermission = (permission) => {
    if (DEV_MODE) return true; // Grant all permissions in development mode

    if (!currentUser || !currentUser.role || !currentUser.role.permissions) {
      return false;
    }
    
    return currentUser.role.permissions[permission] === true;
  };
  
  const value = {
    currentUser,
    loading,
    error,
    loginWithDiscord,
    logout,
    hasPermission,
    setError
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
