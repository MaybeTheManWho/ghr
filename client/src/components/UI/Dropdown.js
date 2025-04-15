import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DropdownContainer = styled.div`
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DropdownLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.medium};
  color: ${({ theme, hasValue }) => hasValue ? theme.colors.text.primary : theme.colors.text.disabled};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
    border-color: ${({ theme }) => theme.colors.border.light};
  }
  
  ${({ isOpen, theme }) => isOpen && css`
    border-color: ${theme.colors.accent};
    box-shadow: 0 0 0 2px ${theme.colors.accent}33;
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
    pointer-events: none;
  `}
`;

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${({ theme }) => theme.transition.fast};
  transform: rotate(${({ isOpen }) => isOpen ? '180deg' : '0deg'});
`;

const DropdownMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: ${({ theme }) => theme.zIndex.dropdown};
  background-color: ${({ theme }) => theme.colors.background.medium};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.light};
  border-radius: ${({ theme }) => theme.border.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  max-height: 240px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.light};
  }
  
  ${({ isActive, theme }) => isActive && css`
    background-color: ${theme.colors.primary};
    color: ${theme.colors.text.primary};
    font-weight: ${theme.typography.fontWeight.medium};
    
    &:hover {
      background-color: ${theme.colors.primary};
    }
  `}
`;

const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.disabled};
  text-align: center;
  font-style: italic;
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

const Dropdown = ({
  id,
  label,
  placeholder = 'Select an option',
  options = [],
  value,
  onChange,
  disabled = false,
  error,
  helperText,
  fullWidth = true,
  required = false,
  emptyMessage = 'No options available',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Find selected option
  const selectedOption = options.find(option => option.value === value);
  
  // Toggle dropdown
  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };
  
  // Handle option selection
  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };
  
  return (
    <DropdownContainer ref={dropdownRef} fullWidth={fullWidth}>
      {label && (
        <DropdownLabel htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </DropdownLabel>
      )}
      
      <DropdownTrigger
        type="button"
        onClick={handleToggle}
        isOpen={isOpen}
        hasValue={!!selectedOption}
        disabled={disabled}
        error={!!error}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronIcon isOpen={isOpen}>
          <FiChevronDown size={18} />
        </ChevronIcon>
      </DropdownTrigger>
      
      <AnimatePresence>
        {isOpen && (
          <DropdownMenu
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {options.length > 0 ? (
              options.map((option) => (
                <DropdownItem
                  key={option.value}
                  isActive={value === option.value}
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </DropdownItem>
              ))
            ) : (
              <EmptyMessage>{emptyMessage}</EmptyMessage>
            )}
          </DropdownMenu>
        )}
      </AnimatePresence>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </DropdownContainer>
  );
};

export default Dropdown;