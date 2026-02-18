'use client';

import React, { useEffect, useState } from 'react';
import { IconSun, IconMoon } from '@tabler/icons-react';

const STORAGE_KEY = 'nord-theme';

const ThemeToggle: React.FC = () => {
  // Arrancamos en null para evitar mismatch de hidratación
  const [isDark, setIsDark] = useState<boolean | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const dark = saved ? saved === 'dark' : true;
    setIsDark(dark);
    applyTheme(dark);
  }, []);

  function applyTheme(dark: boolean) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  }

  function toggle() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  // Placeholder del mismo tamaño mientras carga para evitar layout shift
  if (isDark === null) {
    return <div style={{ width: '3.25rem', height: '1.75rem' }} />;
  }

  return (
    <button
      onClick={toggle}
      className="relative flex items-center cursor-pointer flex-shrink-0"
      style={{ width: '3.25rem', height: '1.75rem' }}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Track */}
      <div
        className="absolute inset-0 rounded-full transition-all duration-300"
        style={{
          background: isDark ? 'var(--bg-overlay)' : 'var(--accent)',
          border: '1px solid var(--border)',
        }}
      />
      {/* Thumb */}
      <div
        className="absolute flex items-center justify-center rounded-full transition-all duration-300"
        style={{
          width: '1.375rem',
          height: '1.375rem',
          background: isDark ? 'var(--bg-surface)' : 'var(--text-primary)',
          left: isDark ? '2px' : 'calc(100% - 24px)',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        {isDark
          ? <IconMoon size={12} stroke={2} style={{ color: 'var(--accent)' }} />
          : <IconSun  size={12} stroke={2} style={{ color: 'var(--accent)' }} />
        }
      </div>
    </button>
  );
};

export default ThemeToggle;
