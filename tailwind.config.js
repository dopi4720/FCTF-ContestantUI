/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc', // thay màu này bằng màu bạn muốn cho primary
        secondary: '#ffed4a', // thay màu này bằng màu bạn muốn cho secondary
        'theme-color-primary': '#ff6700',
        'theme-color-primary-dark':'#cc5200'
      }
    },
  },
  plugins: [],
}
