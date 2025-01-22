/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: {
          light: 'rgba(128, 128, 128, 0.2)',
          dark: 'rgba(128, 128, 128, 0.3)'
        },
        background: {
          light: 'rgba(235, 240, 245, 0.4)',
          dark: 'rgba(17, 24, 39, 1)'
        }
      },
      boxShadow: {
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
        dark: '0 1px 3px 0 rgba(0, 0, 0, 0.35), 0 1px 2px -1px rgba(0, 0, 0, 0.35)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.35), 0 2px 4px -2px rgba(0, 0, 0, 0.35)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
};
