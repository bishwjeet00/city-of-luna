/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        luna: {
          50: '#f8f6ff',
          100: '#f0ecff',
          200: '#e6d9ff',
          300: '#d4b5ff',
          400: '#b88aff',
          500: '#9d5eff',
          600: '#8b3ffa',
          700: '#7a2dd4',
          800: '#5d22a3',
          900: '#451a7a',
          950: '#2a0f52',
        },
        cyberpunk: {
          primary: '#00f0ff',
          secondary: '#ff006e',
          accent: '#ffbe0b',
          dark: '#0a0e27',
        },
      },
      animation: {
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
