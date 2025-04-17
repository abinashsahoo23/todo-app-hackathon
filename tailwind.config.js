/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeInRight: {
          '0%': { opacity: '0', transform: 'translateX(10px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 240, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.8), 0 0 30px rgba(0, 240, 255, 0.6)' },
        },
        themedGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(var(--primary-rgb), 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(var(--primary-rgb), 0.8), 0 0 30px rgba(var(--primary-rgb), 0.6)' },
        },
        underlineExpand: {
          '0%': { width: '0%', left: '50%' },
          '100%': { width: '100%', left: '0%' },
        },
        rotate360: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        themeFade: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        themePulse: {
          '0%': { opacity: '1', filter: 'blur(0px)' },
          '50%': { opacity: '0.8', filter: 'blur(2px)' },
          '100%': { opacity: '1', filter: 'blur(0px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-in-out',
        fadeInUp: 'fadeInUp 0.4s ease-out',
        fadeInDown: 'fadeInDown 0.4s ease-out',
        fadeInLeft: 'fadeInLeft 0.4s ease-out',
        fadeInRight: 'fadeInRight 0.4s ease-out',
        bounceIn: 'bounceIn 0.5s ease-in-out',
        shimmer: 'shimmer 2s infinite linear',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
        shake: 'shake 0.5s ease-in-out',
        glow: 'glow 2s ease-in-out infinite',
        themedGlow: 'themedGlow 2s ease-in-out infinite',
        underlineExpand: 'underlineExpand 0.3s ease-out forwards',
        rotate360: 'rotate360 1s linear',
        themeFade: 'themeFade 0.4s ease-in-out',
        themePulse: 'themePulse 0.6s ease-in-out',
      },
    },
  },
  safelist: [
    {
      pattern: /bg-(red|blue|green|orange|teal|purple|yellow|gray)-(100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(red|blue|green|orange|teal|purple|yellow|gray)-(100|200|300|400|500|600|700|800|900)/,
    },
  ],
  plugins: [],
} 