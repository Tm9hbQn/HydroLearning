/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          DEFAULT: '#f0e6d2',
          dark: '#e6dcc0',
          light: '#f7f1e3',
        },
        ink: {
          DEFAULT: '#2b2118',
          light: '#5e4b35',
        },
        sanguine: {
          DEFAULT: '#8a3324',
          light: '#a64d3d',
        }
      },
      backgroundImage: {
        'grid-paper': "linear-gradient(#e0d6c2 1px, transparent 1px), linear-gradient(90deg, #e0d6c2 1px, transparent 1px)",
      },
      backgroundSize: {
        'grid-paper': '20px 20px',
      },
      fontFamily: {
        sans: ['Assistant', 'sans-serif'],
        serif: ['Frank Ruhl Libre', 'serif'],
      },
    },
  },
  plugins: [],
}
