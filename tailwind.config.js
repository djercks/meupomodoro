/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bgPurple: '#241733',
        bgPlum: '#3a1f3d',
        bgTeal: '#16323a',
        ringGreen: '#34e6a8',
        pillGreen: '#22c55e',
      },
    },
  },
  plugins: [],
}
