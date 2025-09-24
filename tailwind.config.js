/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
    "./src/main/**/*.{js,ts,jsx,tsx}",
    "./src/preload/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 🔥 CSS 변수를 인식하도록 fontFamily 설정
      fontFamily: {
        'app': ['var(--app-font-family)', 'system-ui', 'sans-serif'],
        'dynamic': ['var(--dynamic-font-family)', 'system-ui', 'sans-serif'],
      },
      // 🔥 CSS 변수를 인식하도록 fontSize 설정
      fontSize: {
        'app': ['var(--app-font-size)', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}

