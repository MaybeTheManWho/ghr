import React from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-bottom: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.dark};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.elevated};
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-right: ${({ theme }) => theme.spacing.xl};
`;

const NavTabs = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex: 1;
`;

const NavTab = styled.button`
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.border.radius.md};
  color: ${({ theme, active }) => active ? theme.colors.text.primary : theme.colors.text.secondary};
  font-weight: ${({ theme, active }) => active ? theme.typography.fontWeight.bold : theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transition.fast};
  position: relative;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background.light};
  }
  
  ${({ active, theme }) => active && css`
    background-color: ${theme.colors.primary};
    
    &:hover {
      background-color: ${theme.colors.primary};
    }
  `}
`;

const TabText = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TabIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const TabBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.border.radius.full};
  background-color: ${({ theme, active }) => active ? theme.colors.accent : theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -${({ theme }) => theme.spacing.xs};
  left: 0;
  right: 0;
  height: 3px;
  background-color: ${({ theme }) => theme.colors.accent};
  border-radius: ${({ theme }) => theme.border.radius.md};
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TopNav = ({ title, currentTab, tabs, onTabChange, rightContent }) => {
  return (
    <NavContainer>
      {title && <Title>{title}</Title>}
      
      {tabs && tabs.length > 0 && (
        <NavTabs>
          {tabs.map((tab) => (
            <NavTab
              key={tab.id}
              active={currentTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            >
              <TabText>
                {tab.icon && <TabIcon>{tab.icon}</TabIcon>}
                {tab.label}
                {tab.count !== undefined && (
                  <TabBadge active={currentTab === tab.id}>
                    {tab.count}
                  </TabBadge>
                )}
              </TabText>
              
              {currentTab === tab.id && (
                <ActiveIndicator layoutId="activeTabIndicator" />
              )}
            </NavTab>
          ))}
        </NavTabs>
      )}
      
      {rightContent && (
        <RightSection>
          {rightContent}
        </RightSection>
      )}
    </NavContainer>
  );
};

export default TopNav;