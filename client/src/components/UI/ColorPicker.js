import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const ColorPickerContainer = styled.div`
  position: relative;
  width: ${({ fullWidth }) => fullWidth ? '100%' : 'auto'};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const ColorPickerLabel = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const ColorPickerTrigger = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.medium};
  color: ${({ theme }) => theme.colors.text.primary};
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
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background-color: ${({ color }) => color || '#CCCCCC'};
  margin-right: ${({ theme }) => theme.spacing.sm};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ColorValue = styled.span`
  flex: 1;
`;

const ChevronIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform ${({ theme }) => theme.transition.fast};
  transform: rotate(${({ isOpen }) => isOpen ? '180deg' : '0deg'});
`;

const ColorPickerPopup = styled(motion.div)`
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
  padding: ${({ theme }) => theme.spacing.md};
`;

const ColorInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.light};
  color: ${({ theme }) => theme.colors.text.primary};
  border: ${({ theme }) => theme.border.width.thin} solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.border.radius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.accent};
  }
`;

const ColorPresets = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ColorPreset = styled.button`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  background-color: ${({ color }) => color};
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
  
  ${({ isSelected }) => isSelected && css`
    box-shadow: 0 0 0 2px white, 0 0 0 4px #000;
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

// Preset colors
const presetColors = [
  // Row 1 - Primary Colors
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3', '#FF1493',
  // Row 2 - Pastel Colors
  '#FFB6C1', '#FFD700', '#98FB98', '#ADD8E6', '#DDA0DD', '#F0E68C', '#E6E6FA', '#B0E0E6',
  // Row 3 - Dark Colors
  '#800000', '#8B4513', '#006400', '#191970', '#4B0082', '#800080', '#A52A2A', '#2F4F4F',
  // Row 4 - Grayscale
  '#000000', '#333333', '#666666', '#999999', '#CCCCCC', '#DDDDDD', '#EEEEEE', '#FFFFFF',
];

const ColorPicker = ({
  id,
  label,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const colorPickerRef = useRef(null);
  
  // Update input value when value prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);
  
  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Toggle color picker
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  
  // Apply color change
  const handleApplyColor = () => {
    if (isValidHexColor(inputValue)) {
      onChange(inputValue);
    }
  };
  
  // Handle preset color selection
  const handlePresetSelect = (color) => {
    setInputValue(color);
    onChange(color);
  };
  
  // Check if color is valid hex
  const isValidHexColor = (color) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return regex.test(color);
  };
  
  // Handle input blur
  const handleInputBlur = () => {
    handleApplyColor();
  };
  
  // Handle input key down
  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleApplyColor();
    }
  };
  
  return (
    <ColorPickerContainer ref={colorPickerRef} fullWidth={fullWidth}>
      {label && (
        <ColorPickerLabel htmlFor={id}>
          {label}
          {required && <span style={{ color: 'red' }}> *</span>}
        </ColorPickerLabel>
      )}
      
      <ColorPickerTrigger
        type="button"
        onClick={handleToggle}
        isOpen={isOpen}
        error={!!error}
      >
        <ColorSwatch color={value} />
        <ColorValue>{value || 'Select a color'}</ColorValue>
        <ChevronIcon isOpen={isOpen}>
          <FiChevronDown size={18} />
        </ChevronIcon>
      </ColorPickerTrigger>
      
      <AnimatePresence>
        {isOpen && (
          <ColorPickerPopup
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ColorInput
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              placeholder="#RRGGBB"
            />
            
            <ColorPresets>
              {presetColors.map((color) => (
                <ColorPreset
                  key={color}
                  color={color}
                  isSelected={value === color}
                  onClick={() => handlePresetSelect(color)}
                  aria-label={`Color ${color}`}
                />
              ))}
            </ColorPresets>
          </ColorPickerPopup>
        )}
      </AnimatePresence>
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </ColorPickerContainer>
  );
};

export default ColorPicker;