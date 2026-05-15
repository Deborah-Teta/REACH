'use client';

import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }

    setIsLoaded(true);
  }, []);

  const applyTheme = (selectedTheme: Theme) => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');

    if (selectedTheme === 'system') {
      const systemDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;

      root.classList.add(systemDark ? 'dark' : 'light');
    } else {
      root.classList.add(selectedTheme);
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);

    localStorage.setItem('theme', newTheme);

    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(newTheme);
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isLoaded,
  };
}