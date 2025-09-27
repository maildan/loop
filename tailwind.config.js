/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
    "./src/shared/**/*.{js,ts,jsx,tsx}",
    "./src/main/**/*.{js,ts,jsx,tsx}",
    "./src/preload/**/*.{js,ts,jsx,tsx}",
  ],
  // 🔥 shadcn/ui 표준: class 기반 다크모드
  darkMode: ['class'],
  theme: {
    extend: {
      // 🔥 shadcn/ui 표준 색상 시스템 (OKLCH 형식)
      colors: {
        // Core semantic colors
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        
        // Card colors
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        
        // Popover colors  
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        
        // Primary colors
        primary: {
          DEFAULT: "oklch(var(--primary))",
          foreground: "oklch(var(--primary-foreground))",
        },
        
        // Secondary colors
        secondary: {
          DEFAULT: "oklch(var(--secondary))",
          foreground: "oklch(var(--secondary-foreground))",
        },
        
        // Muted colors
        muted: {
          DEFAULT: "oklch(var(--muted))",
          foreground: "oklch(var(--muted-foreground))",
        },
        
        // Accent colors
        accent: {
          DEFAULT: "oklch(var(--accent))",
          foreground: "oklch(var(--accent-foreground))",
        },
        
        // Destructive colors
        destructive: {
          DEFAULT: "oklch(var(--destructive))",
          foreground: "oklch(var(--destructive-foreground))",
        },
        
        // Border and input
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring))",
        
        // Chart colors
        chart: {
          "1": "oklch(var(--chart-1))",
          "2": "oklch(var(--chart-2))",
          "3": "oklch(var(--chart-3))",
          "4": "oklch(var(--chart-4))",
          "5": "oklch(var(--chart-5))",
        },
        
        // Sidebar colors
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))", 
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
      },
      
      // 🔥 shadcn/ui 표준 border radius
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      // 🔥 CSS 변수를 인식하도록 fontFamily 설정
      fontFamily: {
        'app': ['var(--app-font-family)', 'system-ui', 'sans-serif'],
        'dynamic': ['var(--dynamic-font-family)', 'system-ui', 'sans-serif'],
      },
      
      // 🔥 CSS 변수를 인식하도록 fontSize 설정
      fontSize: {
        'app': ['var(--app-font-size)', { lineHeight: '1.5' }],
      },
      
      // 🔥 shadcn/ui 표준 keyframes for animations
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      
      // 🔥 shadcn/ui 표준 animations
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
}

