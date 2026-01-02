/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [    "./src/**/*.{js,jsx,ts,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        georgia: ['Georgia', 'serif'],
        comic: ['"Comic Sans MS"', 'cursive'],
      },
    },
  },
  plugins: [],
}

