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
        fredoka: ['Fredoka', 'sans-serif'],
        cartoon: ['"Luckiest Guy"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'pop-emerald': '0 6px 0 #059669',
        'pop-emerald-active': '0 2px 0 #059669',
        'pop-amber': '0 6px 0 #d97706',
        'pop-amber-active': '0 2px 0 #d97706',
        'pop-rose': '0 6px 0 #e11d48',
        'pop-rose-active': '0 2px 0 #e11d48',
        'pop-indigo': '0 6px 0 #4f46e5',
        'pop-sky': '0 6px 0 #0284c7',
        'cartoon': '0 8px 0 rgba(0, 0, 0, 0.15)',
        'cartoon-lg': '0 12px 0 rgba(0, 0, 0, 0.12)',
      }
    },
  },
  plugins: [],
}
