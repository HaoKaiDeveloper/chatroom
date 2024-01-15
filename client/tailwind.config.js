/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#ff5722",
        grey1: "#fafafa",
        grey2: "#e0e0e0",
        grey3: "#757575",
        grey4: "#212121",
      },
      fontSize: {
        s: "1rem",
        mi: "1.5rem",
        l: "2.5rem",
      },
      keyframes: {
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-3rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
