/**
 * 🎨 App Theme Wrapper - 앱 레벨 테마 통합
 * 
 * 전체 앱에서 테마 시스템을 사용할 수 있도록 래핑
 */

'use client';

import React from 'react';
import { ThemeProvider } from '../contexts/themeContext';
import { initThemeSystem } from '../themes';

interface AppThemeWrapperProps {
  children: React.ReactNode;
}

/* 🔥 앱 테마 래퍼 - 최상위에서 사용 */
export function AppThemeWrapper({ children }: AppThemeWrapperProps) {
  
  // 테마 시스템 초기화
  React.useEffect(() => {
    initThemeSystem();
  }, []);

  return (
    <ThemeProvider
      defaultTheme="light"
      storageKey="loop-theme"
      enableSystemTheme={true}
      enableAutoSwitch={true}
    >
      {children}
    </ThemeProvider>
  );
}

/* 🔥 테마 개발 도구 (개발 모드에서만 표시) */
export function ThemeDevTools() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (!isDevelopment) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <details className="bg-background border rounded-lg shadow-lg">
        <summary className="p-2 cursor-pointer text-xs font-mono">
          🎨 Theme Dev
        </summary>
        <div className="p-3 border-t text-xs font-mono space-y-1">
          <div>Current: <code className="bg-muted px-1 rounded">{document.documentElement.className}</code></div>
          <div>Color Scheme: <code className="bg-muted px-1 rounded">{document.documentElement.style.colorScheme}</code></div>
          <div>Variables: <button 
            onClick={() => {
              const vars = Array.from(document.styleSheets)
                .flatMap(sheet => {
                  try {
                    return Array.from(sheet.cssRules);
                  } catch {
                    return [];
                  }
                })
                .filter(rule => rule.type === CSSRule.STYLE_RULE)
                .flatMap(rule => {
                  const style = (rule as CSSStyleRule).style;
                  return Array.from(style).filter(prop => prop.startsWith('--'));
                })
                .slice(0, 10);
              console.table(vars.map(v => ({
                variable: v,
                value: getComputedStyle(document.documentElement).getPropertyValue(v)
              })));
            }}
            className="text-xs underline text-primary"
          >
            Log CSS Vars
          </button></div>
        </div>
      </details>
    </div>
  );
}

/* 🔥 통합 App 래퍼 */
export function App({ children }: AppThemeWrapperProps) {
  return (
    <AppThemeWrapper>
      {children}
      <ThemeDevTools />
    </AppThemeWrapper>
  );
}