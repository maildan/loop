// Server RootLayout: read auth snapshot synchronously and pass to client layout
import * as fs from 'fs';
import * as path from 'path';
// 🔥 global 폴리필 추가 (최우선)
if (typeof global === 'undefined') {
  (globalThis as any).global = globalThis;
}
import ClientLayout from './ClientLayout';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

// 🔥 기가차드 규칙: Inter 폰트 최적화
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const LAYOUT_STYLES = {
  html: 'h-full',
  body: 'h-full bg-slate-50 dark:bg-slate-900 antialiased', // theme classes on body
  container: 'h-full',
  sidebar: 'flex-shrink-0',
  main: 'flex-1 flex flex-col overflow-hidden',
  header: 'flex-shrink-0',
  content: 'flex-1 overflow-auto',
} as const;

// 🔥 기가차드 규칙: 메타데이터 타입 정의
interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps): React.ReactElement {
  // read auth snapshot synchronously on server render
  let initialAuth: any = null;
  try {
    const snapPath = path.join(process.cwd(), '.auth_snapshot.json');
    if (fs.existsSync(snapPath)) {
      const raw = fs.readFileSync(snapPath, { encoding: 'utf-8' });
      const parsed = JSON.parse(raw);
      initialAuth = parsed;
    }
  } catch (e) {
    // ignore
  }

  const themeInitializerScript = `
    (function() {
      // Prevent CSS transitions during initial theme application to avoid flash
      try { document.documentElement.classList.add('disable-theme-transitions'); } catch(e){}

      const theme = localStorage.getItem('loop-theme') || localStorage.getItem('theme') || 'system';
      if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return (
    <html lang="ko" className={`${inter.className} ${LAYOUT_STYLES.html}`} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Loop - 당신의 AI 워드프로세서" />
        <title>Loop</title>
      </head>
      <body className={`${LAYOUT_STYLES.body} overflow-x-hidden`}>
        <script dangerouslySetInnerHTML={{ __html: themeInitializerScript }} />
        <div className={LAYOUT_STYLES.container}>
          <ClientLayout initialAuth={initialAuth}>
            {children}
          </ClientLayout>
        </div>
      </body>
    </html>
  );
}
