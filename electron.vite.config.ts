import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        // 외부 의존성 최적화
        external: ['electron']
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        external: ['electron']
      }
    }
  },
  renderer: {
    root: 'src/renderer',
    plugins: [
      react(),
      // 🔥 폰트 파일을 out/renderer/fonts로 복사 (Modern Font Service 호환)
      viteStaticCopy({
        targets: [
          {
            src: resolve(__dirname, 'public/fonts/**/*'),
            dest: 'fonts'
          }
        ]
      })
    ],
    // 🔥 Electron 환경에 맞는 base path 설정
    base: process.env.NODE_ENV === 'development' ? '/' : './',
    // 🔥 폰트 파일을 asset으로 인식하도록 설정
    assetsInclude: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2'],
    optimizeDeps: {
      include: ['react', 'react-dom'],
      // exclude: ['@tailwindcss/vite'], // 제거 - TailwindCSS 처리 방해
      force: true
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src/renderer'),
        '@components': resolve(__dirname, 'src/renderer/components'),
        '@app': resolve(__dirname, 'src/renderer/app'),
        '@hooks': resolve(__dirname, 'src/renderer/hooks'),
        '@utils': resolve(__dirname, 'src/renderer/utils'),
        '@styles': resolve(__dirname, 'src/renderer/styles')
      }
    },

    define: {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        DEBUG: JSON.stringify(process.env.DEBUG || 'false'),
        LOG_LEVEL: JSON.stringify(process.env.LOG_LEVEL || 'debug'),
        VERBOSE_LOGGING: JSON.stringify(process.env.VERBOSE_LOGGING || 'false')
      }
    },
    server: {
      port: parseInt(process.env.RENDERER_PORT || '4000'),
      host: true,
      middlewareMode: false,
      fs: {
        allow: ['..']
      },
      watch: {
        usePolling: true,
        interval: 1000,
        ignored: ['!**/src/**/*.{js,ts,jsx,tsx}']
      },
      // 🔥 폰트 파일 MIME 타입 설정
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    },
    // 🔥 정적 파일 디렉토리 설정 (개발 모드용)
    publicDir: resolve(__dirname, 'public'),
    build: {
      // 프로덕션 빌드 최적화
      rollupOptions: {
        output: {
          // 청킹 전략 최적화
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['@tiptap/core', '@tiptap/extension-bubble-menu']
          }
        }
      },
      // 큰 파일에 대한 경고 임계값 증가
      chunkSizeWarningLimit: 1000
    }
  }
})