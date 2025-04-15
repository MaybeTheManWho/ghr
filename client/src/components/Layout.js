import React from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 240px; /* Same as Sidebar width */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.background.dark};
`;

const Layout = ({ children }) => {
  const { currentUser } = useAuth();
  
  return (
    <LayoutContainer>
      <Sidebar user={currentUser} />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;