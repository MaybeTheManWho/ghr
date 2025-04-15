import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.accent}33;
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.disabled};
  }
  
  ${({ hasLeftIcon, theme }) => hasLeftIcon && css`
    padding-left: ${theme.spacing.xl};
  `}
  
  ${({ hasRightIcon, theme }) => hasRightIcon && css`
    padding-right: ${theme.spacing.xl};
  `}
  
  ${({ error, theme }) => error && css`
    border-color: ${theme.colors.status.error};
    
    &:focus {
      box-shadow: 0 0 0 2px ${theme.colors.status.error}33;
    }
  `}
  
  ${({ disabled, theme }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    background-color: ${theme.colors.background.light};
  `}
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  ${({ position, theme }) => position === 'left' && css`
    left: ${theme.spacing.sm};
  `}
  
  ${({ position, theme }) => position === 'right' && css`
    right: ${theme.spacing.sm};
  `}
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.status.error};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const HelperText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Input = forwardRef(({
  id,
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  required = false,
  error,
  helperText,
  fullWidth = true,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  return (
    <InputWrapper fullWidth={fullWidth}>
      {label && (
        <InputLabel htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </InputLabel>
      )}
      
      <InputContainer>
        {leftIcon && (
          <IconWrapper position="left">
            {leftIcon}
          </IconWrapper>
        )}
        
        <StyledInput
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          hasLeftIcon={!!leftIcon}
          hasRightIcon={!!rightIcon}
          error={!!error}
          ref={ref}
          {...props}
        />
        
        {rightIcon && (
          <IconWrapper position="right">
            {rightIcon}
          </IconWrapper>
        )}
      </InputContainer>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </InputWrapper>
  );
});

export default Input;