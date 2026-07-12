/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f3ff',
          100: '#e1e7fe',
          200: '#c8d4fe',
          300: '#a3b7fc',
          400: '#7992fa',
          500: '#546af6',
          650: '#3e4fea',
          700: '#313cd5',
          800: '#2c34ad',
          900: '#27308a',
          950: '#1a1d51',
        }
      }
    },
  },
  plugins: [],
}
