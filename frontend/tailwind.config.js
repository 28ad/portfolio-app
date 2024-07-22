/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue' : '#151965',
        'base': '#003285',
      },
      fontFamily: {
        custom: ['Lato']
      }
    },
  },
  plugins: [],
}

