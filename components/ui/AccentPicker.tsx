'use client';

import React, { useEffect, useState, useRef } from 'react';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

const ACCENTS = [
  { label: 'Ayu Orange',   value: '#ffb454' },
  { label: 'Ayu Keyword',  value: '#ff8f40' },
  { label: 'Ayu Blue',     value: '#73b8ff' },
  { label: 'Ayu Green',    value: '#aad94c' },
  { label: 'Ayu Lavender', value: '#d2a6ff' },
  { label: 'Ayu Red',      value: '#f07178' },
  { label: 'Ayu Teal',     value: '#95e6cb' },
  { label: 'Ayu Yellow',   value: '#e6b673' },
];

const STORAGE_KEY = 'ayu-accent';

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastText(hex: string): string {
  const lum = getLuminance(hex);
  const contrastDark  = (lum + 0.05) / (getLuminance('#0d1017') + 0.05);
  const contrastLight = (getLuminance('#fafafa') + 0.05) / (lum + 0.05);
  return contrastLight >= contrastDark ? '#fafafa' : '#0d1017';
}

const AccentPicker: React.FC = () => {
  // 1. IMPORTANTE: No leas localStorage aquí, usa siempre el valor por defecto
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // Para evitar mismatch
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('ayu-accent');
    if (saved) {
      setAccent(saved);
      // No llames a applyAccent aquí si ya tienes el script en el Head
    }
  }, []);

  function applyAccent(value: string) {
    document.documentElement.style.setProperty('--accent', value);
    document.documentElement.style.setProperty('--accent-text', getContrastText(value));
  }

  function handleSelect(value: string) {
    setAccent(value);
    applyAccent(value);
    localStorage.setItem('ayu-accent', value);
    setOpen(false);
  }

  // Si no ha montado, mostramos un placeholder o el default para evitar errores de SSR
  const current = ACCENTS.find(a => a.value === accent) ?? ACCENTS[0];

  return (
    <div ref={ref} className="relative" suppressHydrationWarning>
      <button
        onClick={() => setOpen(o => !o)}
        // 2. RECOMENDACIÓN: Usa clases de Tailwind en lugar de style inline si puedes
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border"
        style={{
          background: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          color: 'var(--text-secondary)',
        }}
      >
        <span
          className="w-4 h-4 rounded-sm flex-shrink-0"
          style={{ background: mounted ? accent : ACCENTS[0].value }}
        />
        <span className="hidden sm:inline">{mounted ? current.label : 'Cargando...'}</span>
        <IconChevronDown size={14} className={open ? 'rotate-180' : ''} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl z-50 bg-bg-surface border border-border shadow-xl">
          {ACCENTS.map(a => (
            <button
              key={a.value}
              onClick={() => handleSelect(a.value)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-bg-overlay text-text-secondary hover:text-text-primary"
            >
              <span className="w-5 h-5 rounded-sm" style={{ background: a.value }} />
              <span className="flex-1 text-left">{a.label}</span>
              {a.value === accent && <IconCheck size={14} className="text-accent" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccentPicker
