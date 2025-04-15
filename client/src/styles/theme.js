const theme = {
    colors: {
      // Main color palette
      primary: '#2B3A67',    // Dark blue
      secondary: '#3E5C76',  // Medium blue
      accent: '#5886A5',     // Light blue
      highlight: '#7D9DB8',  // Pale blue
      
      // UI colors
      background: {
        dark: '#0F1A2A',     // Very dark blue (main background)
        medium: '#1A2A3A',   // Dark blue (cards, containers)
        light: '#2A3A4A'     // Medium blue (hover states)
      },
      
      // Text colors
      text: {
        primary: '#FFFFFF',  // White text
        secondary: '#D0D0D0', // Light gray text
        disabled: '#808080'  // Gray text
      },
      
      // Status colors
      status: {
        success: '#4CAF50',  // Green
        warning: '#FF9800',  // Yellow/Orange
        error: '#F44336',    // Red
        info: '#2196F3'      // Blue
      },
      
      // Priority colors
      priority: {
        low: '#4CAF50',      // Green
        medium: '#FF9800',   // Yellow/Orange
        urgent: '#F44336'    // Red
      },
      
      // Border colors
      border: {
        light: '#3A4A5A',
        medium: '#2A3A4A',
        dark: '#1A2A3A'
      }
    },
    
    // Typography
    typography: {
      fontFamily: "'Inter', 'Roboto', 'Helvetica Neue', sans-serif",
      fontSize: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        md: '1rem',       // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem',// 30px
        '4xl': '2.25rem'  // 36px
      },
      fontWeight: {
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    
    // Spacing
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '2.5rem',  // 40px
      '3xl': '3rem'     // 48px
    },
    
    // Borders
    border: {
      radius: {
        sm: '0.125rem',  // 2px
        md: '0.25rem',   // 4px
        lg: '0.5rem',    // 8px
        xl: '1rem',      // 16px
        full: '9999px'   // Circle
      },
      width: {
        thin: '1px',
        medium: '2px',
        thick: '4px'
      }
    },
    
    // Shadows
    shadow: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px rgba(0, 0, 0, 0.15)'
    },
    
    // Transitions
    transition: {
      fast: '0.15s ease',
      medium: '0.3s ease',
      slow: '0.5s ease'
    },
    
    // Z-index
    zIndex: {
      base: 0,
      elevated: 10,
      dropdown: 100,
      modal: 1000,
      tooltip: 2000
    }
  };
  
  export default theme;