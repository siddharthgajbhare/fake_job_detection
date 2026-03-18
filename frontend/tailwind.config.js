/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4f46e5',
        secondary: '#ec4899',
        dark: '#0f172a',
        neonCyan: '#00f3ff',
        neonPurple: '#bf00ff',
        glass: 'rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px #bf00ff, 0 0 20px #bf00ff' },
          'to': { boxShadow: '0 0 20px #00f3ff, 0 0 30px #00f3ff' },
        }
      }
    },
  },
  plugins: [],
}
