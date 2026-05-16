/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { 50:'#eef9ff',100:'#d9f1ff',500:'#00d4ff',600:'#00a8cc',700:'#0085a8' },
        neon: { green:'#39ff14', pink:'#ff2bd6', purple:'#9b5cff' },
      },
      fontFamily: { display: ['"Orbitron"','sans-serif'], sans: ['Inter','sans-serif'] },
      boxShadow: { glow: '0 0 20px rgba(0,212,255,0.45)' },
    },
  },
  plugins: [],
}
