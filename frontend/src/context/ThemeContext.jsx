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
    icon: '🌙',
    description: 'Mode sombre classique et élégant',
    primary: '#0ea5e9',
    secondary: '#8b5cf6',
    accent: '#ec4899',
    background: '#0f172a',
    card: 'rgba(0, 0, 0, 0.3)',
    text: '#f1f5f9',
    preview: {
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #8b5cf6 50%, #ec4899 100%)'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    icon: '🤖',
    description: 'Néons futuristes et vibes cyberpunk',
    primary: '#ff00ff',
    secondary: '#00ffff',
    accent: '#00ff00',
    background: '#0a0a0a',
    card: 'rgba(255, 0, 255, 0.1)',
    text: '#00ff00',
    special: 'neon-glow',
    preview: {
      gradient: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 50%, #00ff00 100%)'
    }
  },
  zen: {
    name: 'Minimal Zen',
    icon: '☯️',
    description: 'Minimalisme apaisant et zen',
    primary: '#10b981',
    secondary: '#6ee7b7',
    accent: '#34d399',
    background: '#f8fafc',
    card: 'rgba(255, 255, 255, 0.9)',
    text: '#1e293b',
    isLight: true,
    preview: {
      gradient: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 50%, #34d399 100%)'
    }
  },
  retro: {
    name: 'Retro Gaming',
    icon: '👾',
    description: '8-bit rétro gaming nostalgie',
    primary: '#ff6b6b',
    secondary: '#ffd93d',
    accent: '#a8e6cf',
    background: '#2d1b69',
    card: 'rgba(138, 43, 226, 0.2)',
    text: '#ffffff',
    special: 'pixel-borders',
    preview: {
      gradient: 'linear-gradient(135deg, #ff6b6b 0%, #ffd93d 50%, #a8e6cf 100%)'
    }
  },
  pride: {
    name: 'Pride Mode',
    icon: '🏳️‍🌈',
    description: 'Couleurs arc-en-ciel et fierté',
    primary: '#ff6b9d',
    secondary: '#c44569',
    accent: '#ffa502',
    background: '#1a1a2e',
    card: 'rgba(255, 107, 157, 0.1)',
    text: '#ffffff',
    special: 'rainbow-gradient',
    preview: {
      gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c44569 50%, #ffa502 100%)'
    }
  },
  hacker: {
    name: 'Dark Hacker',
    icon: '💻',
    description: 'Terminal hacker style matrix',
    primary: '#00ff00',
    secondary: '#39ff14',
    accent: '#0dff00',
    background: '#000000',
    card: 'rgba(0, 255, 0, 0.05)',
    text: '#00ff00',
    special: 'matrix-effect',
    preview: {
      gradient: 'linear-gradient(135deg, #00ff00 0%, #39ff14 50%, #0dff00 100%)'
    }
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
    if (!theme) {
      console.error(`Theme "${themeName}" not found`);
      return;
    }
    
    const root = document.documentElement;
    
    // Apply CSS variables
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-background', theme.background);
    root.style.setProperty('--color-card', theme.card);
    root.style.setProperty('--color-text', theme.text);
    
    // Apply theme class to body
    document.body.className = '';
    document.body.classList.add(themeName);
    
    // Apply light mode if needed
    if (theme.isLight) {
      document.body.classList.add('light-mode');
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
    } else {
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = theme.background;
      document.body.style.color = theme.text;
    }
    
    console.log(`✅ Thème "${theme.name}" appliqué !`);
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
