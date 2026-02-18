'use client';

import React, { useEffect, useState, useRef } from 'react';
import { IconChevronDown, IconCheck } from '@tabler/icons-react';

const ACCENTS = [
  { label: 'Frost Blue',    value: '#88C0D0' },
  { label: 'Frost Steel',   value: '#81A1C1' },
  { label: 'Frost Deep',    value: '#5E81AC' },
  { label: 'Frost Teal',    value: '#8FBCBB' },
  { label: 'Aurora Red',    value: '#BF616A' },
  { label: 'Aurora Green',  value: '#A3BE8C' },
  { label: 'Aurora Purple', value: '#B48EAD' },
  { label: 'Aurora Yellow', value: '#EBCB8B' },
];

const STORAGE_KEY = 'nord-accent';

function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastText(hex: string): string {
  const lum = getLuminance(hex);
  const contrastDark  = (lum + 0.05) / (getLuminance('#2E3440') + 0.05);
  const contrastLight = (getLuminance('#ECEFF4') + 0.05) / (lum + 0.05);
  return contrastLight >= contrastDark ? '#ECEFF4' : '#2E3440';
}

const AccentPicker: React.FC = () => {
  const [accent, setAccent] = useState(ACCENTS[0].value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const initial = saved ?? ACCENTS[0].value;
    setAccent(initial);
    applyAccent(initial);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function applyAccent(value: string) {
    document.documentElement.style.setProperty('--accent', value);
    document.documentElement.style.setProperty('--accent-text', getContrastText(value));
  }

  function handleSelect(value: string) {
    setAccent(value);
    applyAccent(value);
    localStorage.setItem(STORAGE_KEY, value);
    setOpen(false);
  }

  const current = ACCENTS.find(a => a.value === accent) ?? ACCENTS[0];

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
        }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
      >
        {/* Swatch */}
        <span
          className="w-4 h-4 rounded-sm flex-shrink-0"
          style={{ background: current.value }}
        />
        <span className="hidden sm:inline">{current.label}</span>
        <IconChevronDown
          size={14}
          stroke={2}
          className="transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden z-50"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border)',
          }}
        >
          {ACCENTS.map(a => (
            <button
              key={a.value}
              onClick={() => handleSelect(a.value)}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = 'var(--bg-overlay)';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
              }}
            >
              {/* Swatch cuadrado */}
              <span
                className="w-5 h-5 rounded-sm flex-shrink-0"
                style={{ background: a.value }}
              />
              <span className="flex-1 text-left">{a.label}</span>
              {a.value === accent && (
                <IconCheck size={14} stroke={2.5} style={{ color: 'var(--accent)' }} />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccentPicker;
