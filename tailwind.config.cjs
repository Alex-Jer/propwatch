/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        shark: {
          50: "#f6f6f7",
          100: "#e2e3e5",
          200: "#c4c7cb",
          300: "#9ea3aa",
          400: "#797e88",
          500: "#5f646d",
          600: "#4b4e56",
          700: "#3e4147",
          800: "#34373b",
          900: "#2e2f33",
          950: "#1a1b1e",
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
