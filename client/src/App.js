import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyle from './styles/globalStyles';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TicketProvider } from './context/TicketContext';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import Stats from './pages/Stats';
import SiteManagement from './pages/SiteManagement';
import Snippets from './pages/Snippets';

// Protected Route component
const ProtectedRoute = ({ children, requiredPermission = null }) => {
  const { currentUser, loading, hasPermission } = useAuth();
  
  // Show loading state
  if (loading) {
    return <div>Loading...</div>;
  }
  
  // Check if user is authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  // Check if user has required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Layout component for authenticated routes
const AuthenticatedLayout = ({ children }) => {
  return (
    <Layout>
      {children}
    </Layout>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <TicketProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requiredPermission="tickets">
                    <AuthenticatedLayout>
                      <Dashboard />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Ticket Detail Route */}
              <Route 
                path="/tickets/:ticketId" 
                element={
                  <ProtectedRoute requiredPermission="tickets">
                    <AuthenticatedLayout>
                      <TicketDetail />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/stats" 
                element={
                  <ProtectedRoute requiredPermission="stats">
                    <AuthenticatedLayout>
                      <Stats />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/site-management" 
                element={
                  <ProtectedRoute requiredPermission="siteManagement">
                    <AuthenticatedLayout>
                      <SiteManagement />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/snippets" 
                element={
                  <ProtectedRoute requiredPermission="snippets">
                    <AuthenticatedLayout>
                      <Snippets />
                    </AuthenticatedLayout>
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect to dashboard by default */}
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Routes>
          </Router>
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;