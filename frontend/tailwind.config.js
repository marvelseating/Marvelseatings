/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#b9cefd',
          300: '#8caefb',
          400: '#5a88f7',
          500: '#2f62f1',
          600: '#1a47e0',
          700: '#1437c7',
          800: '#1430a1',
          900: '#152c7e',
          950: '#0e1d52',
        },
        brand: {
          DEFAULT: '#1e3a5f',
          light: '#2a5080',
          dark: '#0f1f33',
        },
        accent: {
          DEFAULT: '#e8722a',
          light: '#f08445',
          dark: '#c45c18',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-left': 'slideInLeft 0.6s ease forwards',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(30px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideInLeft: { '0%': { opacity: 0, transform: 'translateX(-30px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      }
    }
  },
  plugins: []
};
