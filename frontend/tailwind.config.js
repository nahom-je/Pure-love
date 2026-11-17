/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1e3a5f", light: "#2d5a8e", dark: "#152b47" },
        accent: { DEFAULT: "#c9973f", light: "#e0b060", dark: "#a87c2e" },
        cream: { DEFAULT: "#faf8f4", dark: "#f0ebe2" },
      },
      fontFamily: {
        sans: ["Noto Sans Ethiopic", "Noto Sans", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
