/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    fontSize: {
      'sm': '12px',
      'normal': '14px',
      'md': '16px',
      'lg': '18px',
      'xl': '20px',
      '2xl': '24px',
      '4xl': '32px',
    },
    extend: {
    },
  },
  plugins: [],
};
