'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'ayu-accent';

// Copiamos las funciones de utilidad para que estén disponibles globalmente
function getLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function getContrastText(hex: string): string {
  const lum = getLuminance(hex);
  const contrastDark = (lum + 0.05) / (0.2126 * 0.0006 + 0.7152 * 0.0006 + 0.0722 * 0.0006 + 0.05); // Simplificado vs #0d1017
  const contrastLight = (1.0 + 0.05) / (lum + 0.05);
  return contrastLight >= contrastDark ? '#fafafa' : '#0d1017';
}

export default function ThemeInitializer() {
  useEffect(() => {
    const apply = () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        document.documentElement.style.setProperty('--accent', saved);
        document.documentElement.style.setProperty('--accent-text', getContrastText(saved));
      }
    };

    apply();
    // Escuchar cambios por si el usuario cambia el acento en otra pestaña o mediante el picker
    window.addEventListener('storage', apply);
    return () => window.removeEventListener('storage', apply);
  }, []);

  return null;
}
