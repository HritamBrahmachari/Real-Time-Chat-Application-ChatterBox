/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          100: '#1E293B',
          200: '#0f172a',
          300: '#020617',
        },
        light: {
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
        }
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'neu': '5px 5px 10px #d1d1d1, -5px -5px 10px #ffffff',
        'neu-dark': '5px 5px 10px #0c1221, -5px -5px 10px #162039',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'gradient-glass-dark': 'linear-gradient(135deg, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.3))',
        'gradient-primary': 'linear-gradient(135deg, #4f46e5, #0ea5e9)',
        'gradient-secondary': 'linear-gradient(135deg, #0ea5e9, #4f46e5)',
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#4f46e5",
          "secondary": "#0ea5e9",
          "accent": "#6366f1",
          "neutral": "#2a323c",
          "base-100": "#ffffff",
          "info": "#3abff8",
          "success": "#22c55e",
          "warning": "#facc15", 
          "error": "#ef4444",
        },
        dark: {
          "primary": "#6366f1",
          "secondary": "#38bdf8",
          "accent": "#4f46e5",
          "neutral": "#f1f5f9",
          "base-100": "#0f172a",
          "info": "#0ea5e9",
          "success": "#16a34a",
          "warning": "#eab308",
          "error": "#dc2626",
        },
      },
    ],
  },
};
