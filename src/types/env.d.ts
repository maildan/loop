/// <reference types="vite/client" />

/**
 * 🔥 GIGA-CHAD 환경변수 타입 정의
 * 
 * Main Process와 Renderer Process 모두에서 사용 가능한
 * 환경변수 타입을 strict mode로 정의합니다.
 * 
 * electron-vite의 define 옵션으로 빌드 타임에 주입됩니다:
 * - Dev: .env 파일
 * - CI/CD: GitHub Secrets
 * - Production: 빌드 타임 주입 (런타임 .env 파일 불필요)
 */

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // 🔥 기본 환경 설정
      readonly NODE_ENV: 'development' | 'production' | 'test'
      
      // 🔥 포트 설정
      readonly PORT: string
      readonly ELECTRON_PORT: string
      readonly RENDERER_PORT: string
      readonly STATIC_SERVER_ORIGIN: string
      
      // 🔥 URL 설정
      readonly ELECTRON_RENDERER_URL: string
      readonly VITE_DEV_SERVER_URL: string
      readonly NEXT_PUBLIC_SHARE_WEB_URL: string
      readonly NEXT_PUBLIC_SHARE_API_URL: string
      
      // 🔥 Logger 설정
      readonly LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
      readonly DEBUG: string
      readonly VERBOSE_LOGGING: string
      
      // 🔥 데이터베이스
      readonly DATABASE_URL: string
      
      // 🔥 성능 모니터링
      readonly ENABLE_PERFORMANCE_TRACKING: string
      readonly MEMORY_MONITORING: string
      
      // 🔥 키보드 모니터링
      readonly KEYBOARD_MONITORING_ENABLED: string
      readonly KEYBOARD_DEBUG_MODE: string
      
      // 🔥 AI/분석 기능
      readonly AI_ANALYSIS_ENABLED: string
      readonly MOCK_AI_RESPONSES: string
      
      // 🔥 개발자 도구
      readonly REACT_DEVELOPER_TOOLS: string
      readonly REDUX_DEVTOOLS: string
      
      // 🔥 Google OAuth 설정 (CRITICAL)
      readonly GOOGLE_CLIENT_ID: string
      readonly GOOGLE_CLIENT_SECRET: string
      readonly GOOGLE_API_KEY: string
      readonly GOOGLE_REDIRECT_URI: string
      
      // 🔥 암호화 키 (CRITICAL)
      readonly ENCRYPT_SNAPSHOT_KEY: string
      
      // 🔥 Gemini AI 설정 (CRITICAL)
      readonly GEMINI_API_KEY: string
      readonly GEMINI_MODEL: string
      readonly GEMINI_MAX_TOKENS: string
      readonly GEMINI_TEMPERATURE: string
      
      // 🔥 Firebase 설정
      readonly FIREBASE_API_KEY: string
      readonly FIRE_AUTH_DOMAIN: string
      readonly FIRE_PROJECT_ID: string
      readonly STORAGE_BUCKET: string
      readonly MESSAGING_SENDER_ID: string
      readonly APP_ID: string
      readonly MEASUREMENT_ID: string
      
      // 🔥 Optional: GitHub Actions에서만 사용
      readonly GOOGLE_ACCESS_TOKEN?: string
      readonly GOOGLE_REFRESH_TOKEN?: string
    }
  }
}

/**
 * 🔥 Renderer Process용 환경변수 (import.meta.env)
 * 
 * Renderer는 보안상 최소한의 환경변수만 접근해야 합니다.
 * API 키는 Main Process IPC를 통해서만 접근하세요.
 */
interface ImportMetaEnv {
  readonly MODE: 'development' | 'production' | 'test'
  readonly DEV: boolean
  readonly PROD: boolean
  readonly SSR: boolean
  
  // 🔥 Renderer에서 안전하게 접근 가능한 환경변수만 포함
  // (API 키는 포함하지 않음 - IPC 사용)
  readonly VITE_DEV_SERVER_URL?: string
  readonly NEXT_PUBLIC_SHARE_WEB_URL?: string
  readonly NEXT_PUBLIC_SHARE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}
