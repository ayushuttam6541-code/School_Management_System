/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', "ui-serif", "Georgia", "serif"],
        body: ['"Outfit"', "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        tfa: {
          blue: "#1E3A8A",
          "blue-deep": "#0f1e5c",
          gold: "#D97706",
          "gold-light": "#F59E0B",
          cream: "#FEFCE8",
        },
      },
    },
  },
  plugins: [],
};
