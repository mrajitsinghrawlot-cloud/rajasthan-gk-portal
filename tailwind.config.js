/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rajasthan: {
          saffron: '#FF6B1A',
          saffronDark: '#D84E00',
          gold: '#E09F3E',
          maroon: '#800020',
          royalBlue: '#1E3A8A',
          sand: '#FAF6F0',
          sandDark: '#F0E6D8',
          charcoal: '#1C1917',
          surfaceDark: '#292524',
          cardDark: '#201D1B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', '"Tiro Devanagari Hindi"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
