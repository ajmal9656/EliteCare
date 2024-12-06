/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your JavaScript and TypeScript files
    "./public/index.html",        // Include your HTML files
  ],
  theme: {
    extend: {
      colors: {
        hoverColor: "#FFC000",
        brightColor: "#dd8036",
        backgroundColor: "#36ae9a",
      },
    },
  },
  plugins: [],
};
