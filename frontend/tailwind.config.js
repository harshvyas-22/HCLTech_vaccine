export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        neu: {
          bg: '#dde1e7',
          dark: '#b8bec7',
          light: '#ffffff',
          surface: '#e2e6ec',
        },
        brand: {
          50: '#e8f4f8',
          100: '#c5e3ed',
          200: '#9fd0df',
          300: '#6db8cc',
          400: '#4aa3bc',
          500: '#2d7d91',
          600: '#1f5f6f',
          700: '#1a4a56',
          800: '#15373f',
          900: '#0f262b',
        },
        accent: {
          red: '#c0392b',
          green: '#27ae60',
          amber: '#e67e22',
          gold: '#f1c40f',
        },
      },
      boxShadow: {
        'neu-raised': '6px 6px 14px #b8bec7, -6px -6px 14px #ffffff',
        'neu-raised-sm': '3px 3px 8px #b8bec7, -3px -3px 8px #ffffff',
        'neu-raised-lg': '10px 10px 20px #b8bec7, -10px -10px 20px #ffffff',
        'neu-inset': 'inset 4px 4px 10px #b8bec7, inset -4px -4px 10px #ffffff',
        'neu-inset-sm': 'inset 2px 2px 6px #b8bec7, inset -2px -2px 6px #ffffff',
        'neu-flat': '2px 2px 4px #b8bec7, -2px -2px 4px #ffffff',
        'neu-pressed': 'inset 6px 6px 14px #b8bec7, inset -6px -6px 14px #ffffff',
        'neu-button': '4px 4px 10px #b8bec7, -4px -4px 10px #ffffff, inset 0 1px 0 rgba(255,255,255,0.4)',
      },
      borderRadius: {
        'neu': '16px',
        'neu-lg': '24px',
        'neu-xl': '32px',
      },
      animation: {
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'press': 'pressDown 0.15s ease-out forwards',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        pressDown: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(0.97)' },
        },
      },
    },
  },
  plugins: [],
};
