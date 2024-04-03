/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "weather-primary":"#00000",
        "weather-secondary":"#004E71",
      },
    },
    fontFamily: {
      Roboto: ["Roboto, sans-serif"],
      Unica:["Unica One, sans-serif"],
      Montserrat:["Montserrat, sans-serif"],
    },
    container: {
      padding: "2rem",
      center: true,
    },
    screens: {
      sm: "640px",
      md:"748px",
    },
  },
  plugins: [],
};

