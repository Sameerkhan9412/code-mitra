/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        black:"#202022",
        white:"#FEFEFE",
        // blue:"#FFD700",
        blue:"#4886EE",
        richblue:{
          900:"#131327",
          800:"#181835",
          700:"#1D4ED8",
          600:"#2B82F6",
          500:"#93C5FD",
          400:"#4F46E5",
          300:"#3D72E0",
        },
        richblack: {
          5: "#F1F2FF",
          25: "#DBDDEA",
          50: "#C5C7D4",
          100: "#AFB2BF",
          200: "#999DAA",
          300: "#838894",
          400: "#6E727F",
          500: "#585D69",
          600: "#424854",
          700: "#2C333F",
          800: "#161D29",
          900: "#000814",
        },
      },
    },
  },
  plugins: [],
}