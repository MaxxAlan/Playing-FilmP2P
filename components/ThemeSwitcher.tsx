import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${
        isDark ? 'bg-primary' : 'bg-subtle'
      }`}
    >
      <span className="sr-only">
        {isDark ? 'Current theme is dark' : 'Current theme is light'}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none relative inline-block h-6 w-6 transform rounded-full shadow-lg ring-0 transition duration-300 ease-in-out ${
          isDark
            ? 'translate-x-5 bg-white'
            : 'translate-x-0 bg-slate-800'
        }`}
      >
        {/* Sun Icon for Light Mode */}
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-0 -rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        >
          <SunIcon className="h-4 w-4 text-yellow-400" />
        </span>
        {/* Moon Icon for Dark Mode */}
        <span
          className={`absolute inset-0 flex h-full w-full items-center justify-center transition-all duration-300 ease-in-out ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'
          }`}
        >
          <MoonIcon className="h-4 w-4 text-primary" />
        </span>
      </span>
    </button>
  );
};

export default ThemeSwitcher;
