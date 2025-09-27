import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import fs from 'fs'

// 🚀 동적 폰트 디렉토리 스캔 함수 (fonts/{dir} 구조 유지)
function generateFontCopyTargets() {
  const fontsDir = resolve(__dirname, 'public/fonts')
  const targets: Array<{src: string, dest: string}> = []
  
  if (!fs.existsSync(fontsDir)) {
    console.warn('⚠️  폰트 디렉토리가 존재하지 않습니다:', fontsDir)
    return targets
  }

  // 첫 번째 레벨 디렉토리들을 스캔 (폰트 패밀리 디렉토리)
  const fontFamilies = fs.readdirSync(fontsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name)
    .filter(name => {
      // 🔒 보안: 위험한 디렉토리명 필터링
      const sanitizedName = name.replace(/[^a-zA-Z0-9_-]/g, '');
      return sanitizedName === name && !name.includes('..') && name.length < 100;
    })

  for (const familyName of fontFamilies) {
    // 🔒 보안: 경로 정규화 및 검증
    const sanitizedFamilyName = familyName.replace(/[^a-zA-Z0-9_-]/g, '');
    if (sanitizedFamilyName !== familyName) {
      console.warn(`⚠️  위험한 폰트 디렉토리명 건너뜀: ${familyName}`);
      continue;
    }
    
    const familyPath = resolve(fontsDir, sanitizedFamilyName)
    
    // 각 폰트 패밀리 디렉토리 전체를 복사 (구조 유지)
    targets.push({
      src: `${familyPath}/**/*`,
      dest: `fonts/${familyName}`
    })
  }
  
  console.log(`✅ 동적 폰트 스캔 완료: ${fontFamilies.length}개 폰트 패밀리 발견`)
  console.log(`   폰트 패밀리: ${fontFamilies.join(', ')}`)
  return targets
}

// 동적으로 생성된 폰트 복사 타겟
const fontCopyTargets = generateFontCopyTargets()

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        // 외부 의존성 최적화
        external: ['electron'],
        output: {
          // 🔧 named exports 경고 해결
          exports: 'named'
        }
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
    // 🚫 public 폴더 자동 복사 비활성화 (동적 스캔으로 대체)
    publicDir: false,
    plugins: [
      react(),
      // � 동적으로 스캔된 폰트 파일들을 평면화하여 복사
      viteStaticCopy({
        targets: fontCopyTargets
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