import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
    plugins: [react()],
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
    css: {
      postcss: './postcss.config.cjs',
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
      host: true
    },
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