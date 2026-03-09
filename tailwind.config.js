/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
        display: ['"Fraunces"', 'serif'],
      },
      colors: {
        ink: '#0f0e0c',
        paper: '#f7f3ec',
        cream: '#ede8db',
        rule: '#c8bfa8',
        director: { DEFAULT: '#1a3a2e', light: '#e8f4f0', border: '#2d6a4f' },
        teacher:  { DEFAULT: '#3a1a2e', light: '#f4e8f0', border: '#6a2d4f' },
        student:  { DEFAULT: '#1a2e3a', light: '#e8f0f4', border: '#2d4f6a' },
        accent: '#c17f2a',
      }
    }
  },
  plugins: []
}