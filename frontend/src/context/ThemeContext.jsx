import { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const themes = {
  default: {
    name: 'Default Dark',
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    background: '#0f172a',
    card: 'rgba(0, 0, 0, 0.3)',
    text: '#f1f5f9'
  },
  cyberpunk: {
    name: 'Cyberpunk',
    primary: '#ff00ff',
    secondary: '#00ffff',
    background: '#0a0a0a',
    card: 'rgba(255, 0, 255, 0.1)',
    text: '#00ff00',
    special: 'neon-glow'
  },
  zen: {
    name: 'Minimal Zen',
    primary: '#10b981',
    secondary: '#6ee7b7',
    background: '#f8fafc',
    card: 'rgba(255, 255, 255, 0.9)',
    text: '#1e293b',
    isLight: true
  },
  retro: {
    name: 'Retro Gaming',
    primary: '#ff6b6b',
    secondary: '#ffd93d',
    background: '#2d1b69',
    card: 'rgba(138, 43, 226, 0.2)',
    text: '#ffffff',
    special: 'pixel-borders'
  },
  pride: {
    name: 'Pride Mode',
    primary: '#ff6b9d',
    secondary: '#c44569',
    background: '#1a1a2e',
    card: 'rgba(255, 107, 157, 0.1)',
    text: '#ffffff',
    special: 'rainbow-gradient'
  },
  hacker: {
    name: 'Dark Hacker',
    primary: '#00ff00',
    secondary: '#39ff14',
    background: '#000000',
    card: 'rgba(0, 255, 0, 0.05)',
    text: '#00ff00',
    special: 'matrix-effect'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'default';
    setCurrentTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    const root = document.documentElement;
    
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-card', theme.card);
    root.style.setProperty('--color-text', theme.text);
    
    // Apply special effects
    document.body.className = themeName;
    
    if (theme.isLight) {
      document.body.classList.add('light-mode');
    } else {
      document.body.classList.remove('light-mode');
    }
  };

  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('theme', themeName);
    applyTheme(themeName);
  };

  const value = {
    currentTheme,
    changeTheme,
    theme: themes[currentTheme],
    allThemes: themes
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
