/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#8B5CF6', 
        accent: '#F59E0B',
        surface: '#F8FAFC',
        'surface-dark': '#F1F5F9'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        'luxury': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      },
      animation: {
        'gradient': 'gradient 6s ease infinite'
      },
      keyframes: {
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' }
        }
      },
      zIndex: {
        'sticky': '40',
        'sticky-high': '50'
      },
      spacing: {
        'sticky-offset': '1rem',
        'sticky-offset-lg': '2rem'
      }
    }
  },
  plugins: []
}
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5865F2',
        secondary: '#3B45A0',
        accent: '#00D4AA',
        surface: '#F7F9FC',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        twitter: '#1DA1F2',
        instagram: '#E4405F',
        facebook: '#1877F2',
        tiktok: '#000000',
        youtube: '#FF0000',
        linkedin: '#0077B5'
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'pulse-success': 'pulse 0.6s ease-out',
        'scale-hover': 'scale-hover 0.15s ease-out'
      },
      keyframes: {
        'scale-hover': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' }
        }
      }
    },
  },
  plugins: [],
}