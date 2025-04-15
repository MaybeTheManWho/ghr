import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiPieChart, FiSettings, FiMessageSquare, 
  FiShield, FiArchive, FiSlash, FiLogOut 
} from 'react-icons/fi';
import { motion } from 'framer-motion';

const SidebarContainer = styled.div`
  width: 240px;
  height: 100vh;
  background: linear-gradient(
    180deg,
    ${({ theme }) => theme.colors.background.dark} 0%,
    ${({ theme }) => theme.colors.background.medium} 100%
  );
  border-right: ${({ theme }) => theme.border.width.thin} solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const LogoIcon = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4f8eff, #a349ff);
  border-radius: ${({ theme }) => theme.border.radius.md};
  color: #ffffff;
  font-size: 1.8rem;
  box-shadow: 0 0 15px rgba(79, 142, 255, 0.3);
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  background: linear-gradient(to right, #4f8eff, #a349ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  letter-spacing: -0.5px;
`;

const NavMenu = styled.nav`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  overflow-y: auto;
`;

const NavSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-left: ${({ theme }) => theme.spacing.sm};
  opacity: 0.7;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.border.radius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateX(5px);
    color: ${({ theme }) => theme.colors.text.primary};
  }
  
  &.active {
    background: linear-gradient(90deg, 
      ${({ theme }) => `${theme.colors.primary}99`} 0%, 
      rgba(255, 255, 255, 0.05) 100%
    );
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.md};
  font-size: 1.1rem;
`;

const NavText = styled.span`
  flex: 1;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #4f8eff, #a349ff);
  border-radius: ${({ theme }) => theme.border.radius.sm};
`;

const UserSection = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border-top: ${({ theme }) => theme.border.width.thin} solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.02),
    rgba(255, 255, 255, 0)
  );
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.border.radius.full};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.accent}, ${({ theme }) => theme.colors.primary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.1);
`;

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
`;

const UserName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.7;
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: 50%;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Sidebar = ({ user }) => {
  const location = useLocation();
  
  const mainNavItems = [
    { 
      path: '/dashboard',
      label: 'Tickets Dashboard',
      icon: <FiMessageSquare size={20} />
    },
    { 
      path: '/stats',
      label: 'Stats',
      icon: <FiPieChart size={20} />
    },
    { 
      path: '/site-management',
      label: 'Site Management',
      icon: <FiSettings size={20} />
    },
    { 
      path: '/snippets',
      label: 'Snippets',
      icon: <FiSlash size={20} />
    }
  ];

  const getUserInitials = () => {
    if (!user || !user.username) return '?';
    const names = user.username.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  const handleLogout = () => {
    // Implement logout functionality here
    console.log('Logout clicked');
  };

  return (
    <SidebarContainer>
      <Logo>
        <LogoIcon>
          <FiShield />
        </LogoIcon>
        <LogoText>Sword TL</LogoText>
      </Logo>

      <NavMenu>
        <NavSection>
          <SectionTitle>Main</SectionTitle>
          {mainNavItems.map((item) => (
            <NavItem 
              key={item.path} 
              to={item.path}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              {location.pathname.startsWith(item.path) && (
                <ActiveIndicator layoutId="activeIndicator" />
              )}
              <NavIcon>{item.icon}</NavIcon>
              <NavText>{item.label}</NavText>
            </NavItem>
          ))}
        </NavSection>

        <NavSection>
          <SectionTitle>Archives</SectionTitle>
          <NavItem to="/archives">
            <NavIcon><FiArchive size={20} /></NavIcon>
            <NavText>Archived Tickets</NavText>
          </NavItem>
        </NavSection>
      </NavMenu>

      {user && (
        <UserSection>
          <UserAvatar>{getUserInitials()}</UserAvatar>
          <UserInfo>
            <UserName>{user.username}</UserName>
            <UserRole>{user.role?.name || 'Staff'}</UserRole>
          </UserInfo>
          <LogoutButton onClick={handleLogout} title="Logout">
            <FiLogOut size={18} />
          </LogoutButton>
        </UserSection>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;