import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'
import { parse } from 'dotenv'

const PUBLIC_RENDERER_ENV_KEYS = [
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'NEXT_PUBLIC_GEMINI_MODEL',
  'NEXT_PUBLIC_GEMINI_MAX_TOKENS',
  'NEXT_PUBLIC_GEMINI_TEMPERATURE'
] as const

type PublicRendererEnvKey = (typeof PUBLIC_RENDERER_ENV_KEYS)[number]

const RENDERER_ENV_DEFAULTS: Record<string, string> = {
  NODE_ENV: 'development',
  DEBUG: 'false',
  LOG_LEVEL: 'debug',
  VERBOSE_LOGGING: 'false'
}

const loadEnvironmentVariables = (mode: string): Record<string, string> => {
  const cwd = process.cwd()
  const files = ['.env', '.env.local']
  if (mode) {
    files.push(`.env.${mode}`, `.env.${mode}.local`)
  }

  const env: Record<string, string> = {}

  for (const file of files) {
    const filePath = resolve(cwd, file)
    if (!existsSync(filePath)) {
      continue
    }
    try {
      const parsed = parse(readFileSync(filePath))
      Object.assign(env, parsed)
    } catch {
      // ignore malformed env files to avoid crashing dev server
    }
  }

  return env
}

export default defineConfig(({ mode }) => {
  const env = loadEnvironmentVariables(mode)

  const readEnv = (key: string, fallback = ''): string => {
    const value = env[key] ?? process.env[key]
    return typeof value === 'string' && value.length > 0 ? value : fallback
  }

  const rendererEnvDefinition: Record<string, string> = {}
  for (const [key, fallback] of Object.entries(RENDERER_ENV_DEFAULTS)) {
    rendererEnvDefinition[key] = JSON.stringify(readEnv(key, fallback))
  }

  const publicRendererEnv: Partial<Record<PublicRendererEnvKey, string>> = {}
  for (const key of PUBLIC_RENDERER_ENV_KEYS) {
    const value = readEnv(key)
    rendererEnvDefinition[key] = JSON.stringify(value)
    if (value) {
      publicRendererEnv[key] = value
    }
  }

  const privateGeminiApiKey = readEnv('GEMINI_API_KEY')
  const hasPublicGeminiApiKey = !!publicRendererEnv.NEXT_PUBLIC_GEMINI_API_KEY

  if (!hasPublicGeminiApiKey && privateGeminiApiKey && mode !== 'production') {
    rendererEnvDefinition.NEXT_PUBLIC_GEMINI_API_KEY = JSON.stringify(privateGeminiApiKey)
    publicRendererEnv.NEXT_PUBLIC_GEMINI_API_KEY = privateGeminiApiKey
    console.warn('[Loop][env] NEXT_PUBLIC_GEMINI_API_KEY가 설정되지 않아 개발 모드에서 GEMINI_API_KEY를 임시로 노출합니다. 프로덕션에서는 NEXT_PUBLIC_GEMINI_API_KEY를 명시적으로 설정하세요.')
  }

  if (!hasPublicGeminiApiKey && !privateGeminiApiKey) {
    console.warn('[Loop][env] Gemini API 키가 설정되지 않았습니다. AI 분석 기능이 비활성화됩니다. .env 파일을 확인하세요.')
  }

  return {
    main: {
      plugins: [externalizeDepsPlugin()],
      build: {
        rollupOptions: {
          // 외부 의존성 최적화
          external: [
            'electron',
            'ttf2woff2',
            '@prisma/client',
            '.prisma/client'
          ]
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
        // 🔥 번들 분석기 (ANALYZE=true 환경변수로 활성화)
        process.env.ANALYZE === 'true' && (require('rollup-plugin-visualizer').default)({
          open: true,
          filename: 'dist/stats.html',
          gzipSize: true,
          brotliSize: true
        })
      ].filter(Boolean),
      // 🔥 Electron 환경에 맞는 base path 설정
      base: readEnv('NODE_ENV', RENDERER_ENV_DEFAULTS.NODE_ENV) === 'development' ? '/' : './',
      // 🔥 폰트 파일을 asset으로 인식하도록 설정
      assetsInclude: ['**/*.ttf', '**/*.otf', '**/*.woff', '**/*.woff2'],
      envPrefix: ['VITE_', 'NEXT_PUBLIC_', 'LOOP_'],
      optimizeDeps: {
        include: ['react', 'react-dom', 'zustand'],
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
        'process.env': rendererEnvDefinition,
        __LOOP_RENDERER_PUBLIC_ENV__: JSON.stringify(publicRendererEnv)
      },
      server: {
        port: parseInt(readEnv('RENDERER_PORT', '4000')),
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
      build: {
        // 🔥 프로덕션 빌드 최적화
        minify: 'esbuild', // esbuild가 terser보다 빠름
        sourcemap: mode === 'development' ? 'inline' : false,
        reportCompressedSize: false, // 빌드 속도 향상
        rollupOptions: {
          output: {
            // 🔥 청킹 전략 최적화 - vendor 분리
            manualChunks: (id) => {
              // React 생태계
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
                return 'react-vendor'
              }
              // Zustand 상태관리
              if (id.includes('zustand')) {
                return 'state-vendor'
              }
              // Tiptap 에디터
              if (id.includes('@tiptap') || id.includes('prosemirror')) {
                return 'editor-vendor'
              }
              // Radix UI 컴포넌트
              if (id.includes('@radix-ui')) {
                return 'ui-vendor'
              }
              // Google AI 관련
              if (id.includes('@google/generative-ai')) {
                return 'ai-vendor'
              }
              // 기타 node_modules
              if (id.includes('node_modules')) {
                return 'vendor'
              }
            }
          }
        },
        // 🔥 청크 크기 경고 임계값 조정
        chunkSizeWarningLimit: 800
      }
    }
  }
})