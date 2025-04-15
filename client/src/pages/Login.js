import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Auth from '../components/Auth';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { currentUser, loading, error, loginWithDiscord } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && !loading) {
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);
  
  // Handle Discord login
  const handleDiscordLogin = () => {
    loginWithDiscord();
  };
  
  return (
    <Auth 
      onDiscordLogin={handleDiscordLogin} 
      error={error}
    />
  );
};

export default Login;