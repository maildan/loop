/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
    "./src/main/**/*.{js,ts,jsx,tsx}",
    "./src/preload/**/*.{js,ts,jsx,tsx}",
  ],
  // 🔥 다크모드를 간단한 selector 방식으로 설정 (next-themes 호환)
  darkMode: 'selector',
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
      // 🔥 CSS 변수를 Tailwind 색상으로 매핑
      colors: {
        // 배경 색상
        'bg-primary': 'var(--bg-primary)',
        'bg-secondary': 'var(--bg-secondary)',
        'bg-elevated': 'var(--bg-elevated)',
        'bg-card': 'var(--bg-card)',
        'bg-hover': 'var(--bg-hover)',
        
        // 텍스트 색상
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-inverse': 'var(--text-inverse)',
        
        // 강조 색상
        'accent-primary': 'var(--accent-primary)',
        'accent-hover': 'var(--accent-hover)',
        'accent-light': 'var(--accent-light)',
        'accent-dark': 'var(--accent-dark)',
        
        // 경계선 색상
        'border-light': 'var(--border-light)',
        'border-medium': 'var(--border-medium)',
        'border-dark': 'var(--border-dark)',
        
        // 상태 색상
        'success': 'var(--success)',
        'success-light': 'var(--success-light)',
        'warning': 'var(--warning)',
        'warning-light': 'var(--warning-light)',
        'error': 'var(--error)',
        'error-light': 'var(--error-light)',
        
        // shadcn/ui 호환 색상
        'background': 'hsl(var(--background))',
        'foreground': 'hsl(var(--foreground))',
        'card': {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'primary': {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'secondary': {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'muted': {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        'accent': {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'destructive': {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        'border': 'hsl(var(--border))',
        'input': 'hsl(var(--input))',
        'ring': 'hsl(var(--ring))',
      },
    },
  },
  plugins: [],
}

