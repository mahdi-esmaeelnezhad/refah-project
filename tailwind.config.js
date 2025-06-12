/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Include JSX/TSX files
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        organization: "#111e6c",

        primary: {
          DEFAULT: "#7485e5",
          100: "#e5e8fb",
          bg: "#e5e8fb",
          200: "#cad1f8",
          focus: "#cad1f8",
          300: "#b0baf4",
          border: "#b0baf4",
          400: "#95a3f1",
          500: "#7485e5",
          600: "#5c69b2",
          pressed: "#5c69b2",
          700: "#3e4677",
          800: "#1f233b",
          900: "#000000",
        },

        "our-choice": {
          DEFAULT: "#dedede",
          100: "#f8f8f8",
          200: "#f2f2f2",
          300: "#ebebeb",
          400: "#e5e5e5",
          500: "#dedede",
          600: "#a7a7a7",
          700: "#6f6f6f",
          800: "#383838",
          900: "#000000",
        },

        complementary: {
          DEFAULT: "#eddc7b",
          100: "#f4eab0",
          300: "#fdfbef",
          500: "#eddc7b",
        },

        success: {
          DEFAULT: "#479e55",
          pressed: "#32653a",
          border: "#66c575",
          focus: "#a8e3b1",
          bg: "#c6f5ce",
        },

        danger: {
          DEFAULT: "#de4949",
          pressed: "#ba2a2a",
          border: "#f56b6b",
          focus: "#f99999",
          bg: "#ffc8c8",
        },

        warning: {
          DEFAULT: "#daa51a",
          pressed: "#b78400",
          border: "#efbe3e",
          focus: "#ffd976",
          bg: "#ffe7a7",
        },

        info: {
          DEFAULT: "#4973de",
          pressed: "#2a4ba1",
          border: "#9cb8ff",
          focus: "#7ca1ff",
          bg: "#9cb8ff",
        },

        badge: {
          counter: "#49cd3d",
        },

        coming: {
          soon: "#e27220",
        },
      },
    },
  },
  plugins: [],
};