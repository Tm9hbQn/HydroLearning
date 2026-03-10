/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Assistant', 'sans-serif'],
        serif: ['Frank Ruhl Libre', 'serif'],
      },
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e3a5f',
          900: '#1e293b',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f1f5f9',
          bg: '#f8fafc',
        },
        accent: {
          orange: '#f97316',
          blue:   '#3b82f6',
          purple: '#8b5cf6',
          red:    '#ef4444',
          green:  '#22c55e',
        },
      },
    },
  },
  plugins: [],
}
