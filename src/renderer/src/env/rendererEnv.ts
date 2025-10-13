// 🔥 GIGA-CHAD 보안 강화: renderer에서 API 키 완전 제거
// Gemini API 키는 main process에서만 관리, renderer는 IPC를 통해서만 접근
const PUBLIC_ENV_KEYS = [
  // NEXT_PUBLIC_GEMINI_* 제거 - 보안 위험
  // 'NEXT_PUBLIC_GEMINI_API_KEY', // ❌ REMOVED
  // 'NEXT_PUBLIC_GEMINI_MODEL', // ❌ REMOVED
  // 'NEXT_PUBLIC_GEMINI_MAX_TOKENS', // ❌ REMOVED
  // 'NEXT_PUBLIC_GEMINI_TEMPERATURE' // ❌ REMOVED
] as const

type PublicEnvKey = (typeof PUBLIC_ENV_KEYS)[number]

declare const __LOOP_RENDERER_PUBLIC_ENV__: Partial<Record<PublicEnvKey, string>> | undefined

import { Logger } from '../../../shared/logger';

type MutableProcessEnv = Record<string, string | undefined>

const ensureProcessEnv = (key: PublicEnvKey, value: string | undefined) => {
  if (typeof process === 'undefined' || typeof value !== 'string' || value.length === 0) {
    return
  }

  try {
    const env = (process.env ?? {}) as MutableProcessEnv
    if (env[key] === undefined) {
      env[key] = value
    }
  } catch {
    // ignore environments where process.env is read-only
  }
}

const bootstrapRendererEnv = () => {
  // 🔥 GIGA-CHAD: PUBLIC_ENV_KEYS가 비어있으므로 환경변수 bootstrap 불필요
  // renderer는 IPC를 통해서만 API 키 접근
  const globalObject = globalThis as { __LOOP_RENDERER_ENV__?: Record<string, string> }
  globalObject.__LOOP_RENDERER_ENV__ = {
    ...(globalObject.__LOOP_RENDERER_ENV__ ?? {})
  }
}

bootstrapRendererEnv()

