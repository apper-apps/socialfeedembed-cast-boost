/** @type {import('tailwindcss').Config} */
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