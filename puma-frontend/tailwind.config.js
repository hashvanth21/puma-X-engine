/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#ECF0F3',
          secondary: '#F4F6F8',
          card: '#EEF2F5',
          dark: '#0F1115',
        },
        accent: {
          black: '#111111',
          red: '#D90429',
          blue: '#2563EB',
          gold: '#C8A000',
        },
        text: {
          primary: '#111827',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        border: {
          subtle: 'rgba(0, 0, 0, 0.06)',
          medium: 'rgba(0, 0, 0, 0.10)',
        },
      },
      fontFamily: {
        display: ['"Inter Tight"', 'Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        chip: '16px',
        button: '18px',
        card: '28px',
        hero: '36px',
        xl: '32px',
      },
      boxShadow: {
        premium: '18px 18px 30px rgba(209, 217, 230, 1), -18px -18px 30px rgba(255, 255, 255, 1)',
        inset: 'inset 18px 18px 30px rgba(209, 217, 230, 1), inset -18px -18px 30px rgba(255, 255, 255, 1)',
        subtle: '8px 8px 16px rgba(209, 217, 230, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.8)',
        deep: '24px 24px 48px rgba(209, 217, 230, 0.8), -24px -24px 48px rgba(255, 255, 255, 0.9)',
        smNeumo: '4px 4px 8px rgba(209, 217, 230, 0.5), -4px -4px 8px rgba(255, 255, 255, 0.8)',
      },
      backgroundImage: {
        'gradient-red': 'linear-gradient(135deg, #D90429, #EF233C)',
        'gradient-accent': 'linear-gradient(135deg, #C8A000, #FFC800)',
      },
      transitionTimingFunction: {
        premium: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        float: 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
      },
    },
  },
  plugins: [],
};
