'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'system', changeTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('system');

  const applyTheme = (t) => {
    const root = document.documentElement;
    if (t === 'dark') {
      root.classList.add('dark');
    } else if (t === 'light') {
      root.classList.remove('dark');
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'system';
    setTheme(saved);
    applyTheme(saved);

    if (saved === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, []);

  const changeTheme = (t) => {
    setTheme(t);
    localStorage.setItem('theme', t);
    applyTheme(t);
  };

  return (
    <ThemeContext.Provider value={{ theme, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
