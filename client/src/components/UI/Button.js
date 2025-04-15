import React from 'react';
import styled, { css } from 'styled-components';

// Button variants
const variants = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.accent};
    }
  `,
  outline: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.light};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.background.light};
    }
  `,
  text: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.text.primary};
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.background.light};
    }
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.status.error};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.status.error}dd;
    }
  `,
  success: css`
    background-color: ${({ theme }) => theme.colors.status.success};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.status.success}dd;
    }
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.status.warning};
    color: ${({ theme }) => theme.colors.text.primary};
    
    &:hover {
      background-color: ${({ theme }) => theme.colors.status.warning}dd;
    }
  `
};

// Button sizes
const sizes = {
  small: css`
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  `,
  medium: css`
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.typography.fontSize.md};
  `,
  large: css`
    padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  `
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: all ${({ theme }) => theme.transition.fast};
  cursor: pointer;
  border: none;
  outline: none;
  
  /* Apply variants */
  ${({ variant }) => variants[variant]}
  
  /* Apply sizes */
  ${({ size }) => sizes[size]}
  
  /* Apply width */
  ${({ fullWidth }) => fullWidth && css`
    width: 100%;
  `}
  
  /* Apply disabled state */
  ${({ disabled, theme }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
  
  /* Space between icon and text */
  & > svg + span, & > span + svg {
    margin-left: ${({ theme }) => theme.spacing.sm};
  }
`;

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  type = 'button',
  onClick,
  ...props
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      type={type}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children && <span>{children}</span>}
      {icon && iconPosition === 'right' && icon}
    </StyledButton>
  );
};

export default Button;