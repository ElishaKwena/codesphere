/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'heading': ['Poppins', 'sans-serif'],
      },
      colors: {
        dark900: '#0a0a0a',
        dark800: '#1a1a1a',
        dark700: '#2a2a2a',
        electric: '#2563eb',
        success: '#00ff66',
        warning: '#ff9800',
        danger: '#ff4757',
        intermediate: '#b7860b',
        white000: 'azure',
        white001: 'rgb(255, 255, 255)',
        border: 'rgb(149, 149, 166)',
        purple: 'rgb(195, 10, 195)',
        yellow: 'yellow',
        green0: 'rgb(0, 189, 0)',
        red000: 'red',
        cyan00: 'cyan',
        border02: '#2a2f34',
        whitesmoke: 'rgb(209, 208, 208)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
      },
    },
  },
  plugins: [],
} 