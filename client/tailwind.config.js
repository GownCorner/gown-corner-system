/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all JS/TS/JSX/TSX files in the src directory
    "./public/index.html",        // Scans your HTML file for Tailwind classes
  ],
  theme: {
    extend: {}, // Use this to extend Tailwind's default theme
  },
  plugins: [
    require('@tailwindcss/typography'), // Typography plugin for styled content
  ],
};
