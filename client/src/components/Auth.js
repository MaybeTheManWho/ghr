import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiLogIn, FiGitlab } from 'react-icons/fi';
import Button from './UI/Button';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.dark};
  padding: ${({ theme }) => theme.spacing.xl};
`;

const AuthCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.medium};
  border-radius: ${({ theme }) => theme.border.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  width: 100%;
  max-width: 400px;
  padding: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoText = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const LogoSubtext = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const Divider = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing.md} 0;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: ${({ theme }) => theme.colors.border.light};
  }
  
  &::before {
    margin-right: ${({ theme }) => theme.spacing.md};
  }
  
  &::after {
    margin-left: ${({ theme }) => theme.spacing.md};
  }
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.status.error}22;
  color: ${({ theme }) => theme.colors.status.error};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.border.radius.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  text-align: center;
  width: 100%;
`;

const Auth = ({ onDiscordLogin, error = null }) => {
  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        ease: "easeOut" 
      } 
    }
  };
  
  return (
    <AuthContainer>
      <AuthCard
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <Logo>
          <LogoText>Ticket Panel</LogoText>
          <LogoSubtext>Staff Management Portal</LogoSubtext>
        </Logo>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <InfoText>
          Sign in with your Discord account to access the ticket management system.
          You must be a staff member to log in.
        </InfoText>
        
        <LoginButton
          onClick={onDiscordLogin}
          icon={<FiGitlab size={20} />}
          fullWidth
        >
          Login with Discord
        </LoginButton>
        
        <Divider>or</Divider>
        
        <InfoText>
          If you need access, please contact your server administrator.
        </InfoText>
      </AuthCard>
    </AuthContainer>
  );
};

export default Auth;