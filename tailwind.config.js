/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./bets.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt: ['VT323', 'monospace'],
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        flappySky: '#4ec0ca',
        flappyGround: '#ded895',
        flappyPipe: '#73bf2e',
        flappyPipeDark: '#558022',
        flappyOrange: '#e86100',
        flappyYellow: '#f4c330',
      },
      boxShadow: {
        'pixel': '0 4px 0 #000000',
        'pixel-lg': '0 6px 0 #000000',
        'pop-emerald': '0 5px 0 #15803d',
        'pop-amber': '0 5px 0 #b45309',
        'pop-rose': '0 5px 0 #be123c',
        'pop-sky': '0 5px 0 #0369a1',
      }
    },
  },
  plugins: [],
}
