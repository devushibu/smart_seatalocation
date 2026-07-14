import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 rounded-xl bg-background border border-border hover:bg-muted transition-all duration-300 shadow-sm active:scale-95"
      aria-label="Toggle Theme"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Sun Icon — visible in dark mode to switch to light */}
        <Sun
          size={18}
          className={`absolute text-amber-500 transition-all duration-500 transform ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
        {/* Moon Icon — visible in light mode to switch to dark */}
        <Moon
          size={18}
          className={`absolute text-indigo-500 transition-all duration-500 transform ${
            theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          }`}
        />
      </div>
    </Button>
  );
};

export default ThemeToggle;
