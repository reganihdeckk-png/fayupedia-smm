/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ocean: {
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
        glass: {
          surface: 'rgba(255, 255, 255, 0.08)',
          border: 'rgba(255, 255, 255, 0.18)',
          glow: 'rgba(56, 189, 248, 0.15)',
          dark: 'rgba(15, 23, 42, 0.65)'
        }
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '40px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        'glass-hover': '0 14px 40px 0 rgba(14, 165, 233, 0.25)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.3)',
        'dock': '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.12)',
      },
      animation: {
        'water-float': 'waterFloat 12s ease-in-out infinite',
        'ripple': 'ripple 4s ease-out infinite',
        'mac-bounce': 'macBounce 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shimmer': 'shimmer 2.5s infinite linear',
        'liquid-pulse': 'liquidPulse 8s ease-in-out infinite alternate',
      },
      keyframes: {
        waterFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '0.8' },
          '50%': { transform: 'scale(1.05)', opacity: '0.4' },
          '100%': { transform: 'scale(0.95)', opacity: '0.8' },
        },
        macBounce: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.15) translateY(-8px)' },
          '70%': { transform: 'scale(0.95) translateY(2px)' },
          '100%': { transform: 'scale(1) translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        liquidPulse: {
          '0%': { filter: 'hue-rotate(0deg) blur(50px)' },
          '100%': { filter: 'hue-rotate(45deg) blur(70px)' }
        }
      }
    },
  },
  plugins: [],
}
