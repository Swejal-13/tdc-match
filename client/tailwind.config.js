/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        rose: {
          DEFAULT: '#C84B5A',
          light: '#F9EEF0',
          mid: '#E8B4BC',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#FDF8E8',
          mid: '#E8D48A',
        },
        ink: {
          DEFAULT: '#1A1218',
          2: '#3D2E38',
          3: '#6B5565',
        },
        surface: {
          DEFAULT: '#FDFAF8',
          2: '#F5F0EC',
          3: '#EDE5E0',
        },
      },
      borderRadius: {
        lg: '10px',
        md: '7px',
        sm: '5px',
      },
    },
  },
  plugins: [],
}
