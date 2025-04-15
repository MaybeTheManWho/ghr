import { createGlobalStyle } from 'styled-components';
import theme from './theme';

const GlobalStyle = createGlobalStyle`
  /* Import fonts */
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  /* Reset CSS */
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    width: 100%;
  }
  
  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.fontSize.md};
    font-weight: ${theme.typography.fontWeight.regular};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background.dark};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }
  
  #root {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  
  /* Typography */
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${theme.typography.fontWeight.bold};
    margin-bottom: ${theme.spacing.md};
    line-height: 1.2;
  }
  
  h1 {
    font-size: ${theme.typography.fontSize['3xl']};
  }
  
  h2 {
    font-size: ${theme.typography.fontSize['2xl']};
  }
  
  h3 {
    font-size: ${theme.typography.fontSize.xl};
  }
  
  h4 {
    font-size: ${theme.typography.fontSize.lg};
  }
  
  h5, h6 {
    font-size: ${theme.typography.fontSize.md};
  }
  
  p {
    margin-bottom: ${theme.spacing.md};
  }
  
  a {
    color: ${theme.colors.accent};
    text-decoration: none;
    transition: color ${theme.transition.fast};
    
    &:hover {
      color: ${theme.colors.highlight};
    }
  }
  
  /* Forms */
  input, textarea, select, button {
    font-family: inherit;
    font-size: inherit;
  }
  
  button {
    cursor: pointer;
    background: none;
    border: none;
  }
  
  /* Utility classes */
  .container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${theme.spacing.md};
  }
  
  /* Scrollbar customization */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${theme.colors.background.medium};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.secondary};
    border-radius: ${theme.border.radius.md};
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.accent};
  }
  
  /* Animations */
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  @keyframes slideIn {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
  
  .fade-in {
    animation: fadeIn ${theme.transition.medium};
  }
  
  .slide-in {
    animation: slideIn ${theme.transition.medium};
  }
`;

export default GlobalStyle;