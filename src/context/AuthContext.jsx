/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const DEMO_USER = {
  name: 'Arezo Student',
  email: 'student@example.com',
  role: 'Student',
  avatarInitials: 'AS',
  location: 'Bandar Baru Nilai, Malaysia',
  bio: 'Passionate UI/UX learner and visual designer building modern digital experiences.'
};

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('graphicdesignhub-demo-auth') === 'demo';
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('graphicdesignhub-user-profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_USER;
      }
    }
    return DEMO_USER;
  });

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('graphicdesignhub-theme') || 'light';
  });

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('graphicdesignhub-language') || 'English';
  });

  // Apply theme to DOM
  useEffect(() => {
    localStorage.setItem('graphicdesignhub-theme', theme);
    const root = document.documentElement;
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
      root.setAttribute('data-theme', theme);
    }
  }, [theme]);

  // Apply language / RTL direction to DOM
  useEffect(() => {
    localStorage.setItem('graphicdesignhub-language', language);
    const root = document.documentElement;
    if (language === 'Persian' || language === 'Dari') {
      root.setAttribute('dir', 'rtl');
      root.setAttribute('lang', 'fa');
    } else {
      root.setAttribute('dir', 'ltr');
      root.setAttribute('lang', 'en');
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem('graphicdesignhub-user-profile', JSON.stringify(user));
  }, [user]);

  const login = () => {
    sessionStorage.setItem('graphicdesignhub-demo-auth', 'demo');
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('graphicdesignhub-demo-auth');
    setIsAuthenticated(false);
  };

  const updateProfile = (updatedFields) => {
    setUser(prev => {
      const next = { ...prev, ...updatedFields };
      if (updatedFields.name) {
        const parts = updatedFields.name.trim().split(/\s+/);
        next.avatarInitials = parts.slice(0, 2).map(p => p[0]?.toUpperCase() || '').join('') || 'AS';
      }
      return next;
    });
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setLanguage = (newLang) => {
    setLanguageState(newLang);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        theme, 
        language, 
        login, 
        logout, 
        updateProfile, 
        setTheme, 
        toggleTheme, 
        setLanguage 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
