'use client';

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDarkMode(prev => !prev);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-primary/10 transition-colors"
      aria-label="Cambiar tema"
    >
      {isDarkMode ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5" />}
    </button>
  );
};