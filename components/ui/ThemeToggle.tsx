'use client';

import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'nord-theme';

const ThemeToggle: React.FC = () => {
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

  // Placeholder mismo tamaño para evitar layout shift
  if (isDark === null) {
    return <div style={{ width: '36px', height: '18px' }} />;
  }

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
    >
      <span style={{
        fontSize: '0.58rem',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'var(--text-lo)',
      }}>
        {isDark ? 'Dark' : 'Light'}
      </span>

      {/* Toggle — rectangular, igual al HTML */}
      <div
        onClick={toggle}
        aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
        style={{
          position: 'relative',
          width: '36px',
          height: '18px',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {/* Track */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '2px',
          background: isDark ? 'var(--bg-surface)' : `color-mix(in srgb, var(--accent) 8%, var(--bg))`,
          border: `1px solid ${isDark ? 'var(--border)' : 'var(--accent)'}`,
          transition: 'all 0.2s',
        }} />
        {/* Thumb */}
        <div style={{
          position: 'absolute',
          top: '2px',
          left: isDark ? '2px' : 'calc(100% - 14px)',
          width: '12px',
          height: '12px',
          borderRadius: '1px',
          background: isDark ? 'var(--text-mid)' : 'var(--accent)',
          transition: 'all 0.2s',
        }} />
      </div>
    </div>
  );
};

export default ThemeToggle;
