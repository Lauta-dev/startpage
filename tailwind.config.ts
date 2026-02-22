/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Mapeo de la escala RAW de Ayu
        ayu: {
          0: 'var(--ayu0)', 1: 'var(--ayu1)', 2: 'var(--ayu2)', 
          3: 'var(--ayu3)', 4: 'var(--ayu4)', 5: 'var(--ayu5)', 
          6: 'var(--ayu6)', 7: 'var(--ayu7)', 8: 'var(--ayu8)', 9: 'var(--ayu9)',
          accent: 'var(--ayu-accent)',
          success: 'var(--ayu-success)',
          danger: 'var(--ayu-danger)',
          warning: 'var(--ayu-warning)',
          info: 'var(--ayu-info)',
          special: 'var(--ayu-special)',
          string: 'var(--ayu-string)',
          keyword: 'var(--ayu-keyword)',
        },
        // Mapeo de Textos (Cambiables según tema)
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-muted": "var(--text-muted)",
        
        // Mapeo de Superficies (Cambiables según tema)
        "bg-base": "var(--bg-base)",
        "bg-elevated": "var(--bg-elevated)",
        "bg-surface": "var(--bg-surface)",
        "bg-overlay": "var(--bg-overlay)",

        // Bordes
        "border-main": "var(--border)",
        "border-subtle": "var(--border-subtle)",
        "border-dim": "var(--border-dim)",

        // Estados con transparencia (los color-mix de tu CSS)
        success: {
          bg: "var(--color-success-bg)",
          border: "var(--color-success-border)",
        },
        danger: {
          bg: "var(--color-danger-bg)",
          border: "var(--color-danger-border)",
        },
        warning: {
          bg: "var(--color-warning-bg)",
          border: "var(--color-warning-border)",
        },
        info: {
          bg: "var(--color-info-bg)",
          border: "var(--color-info-border)",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "ayu-dark": {
          "primary": "#ffb454",
          "secondary": "#d2a6ff",
          "accent": "#ff8f40",
          "neutral": "#1a2232",
          "base-100": "#0b0e14", // --bg-base
          "base-200": "#0d1017", // --bg-elevated
          "base-300": "#131721", // --bg-surface
          "base-content": "#bfbdb6", // --text-primary
          "info": "#73b8ff",
          "success": "#aad94c",
          "warning": "#ffb454",
          "error": "#f07178",
        },
        "ayu-light": {
          "primary": "#f29718",
          "secondary": "#a37acc",
          "accent": "#e6b450",
          "neutral": "#e0e1e4",
          "base-100": "#fafafa",
          "base-200": "#f3f4f5",
          "base-300": "#eaebed",
          "base-content": "#1a1e28",
          "info": "#399ee6",
          "success": "#6cbf3a",
          "warning": "#f29718",
          "error": "#e3444b",
        },
      },
    ],
  },
};
