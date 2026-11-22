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
          blue: '#2563EB',
          darkBlue: '#1D4ED8',
          lightBlue: '#EFF6FF',
          accent: '#3B71CA'
        }
      }
    },
  },
  plugins: [],
}
