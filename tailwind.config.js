/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
    "./src/main/**/*.{js,ts,jsx,tsx}",
    "./src/preload/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // 🎨 class 기반 다크 모드 활성화
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
      // 🔥 기가차드 색상 시스템 - CSS 변수 매핑
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
}

