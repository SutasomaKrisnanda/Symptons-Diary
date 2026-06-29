/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['Poppins', 'sans-serif'] },
      colors: {
        brand: {
          light: '#e6f5f4',
          DEFAULT: '#009387',
          dark: '#00756c',
        },
        bgapp: '#f2f7f6',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'brand': '0 10px 25px -5px rgba(0, 147, 135, 0.4)',
      }
    },
  },
  plugins: [],
}
