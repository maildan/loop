const PUBLIC_ENV_KEYS = [
  'NEXT_PUBLIC_GEMINI_API_KEY',
  'NEXT_PUBLIC_GEMINI_MODEL',
  'NEXT_PUBLIC_GEMINI_MAX_TOKENS',
  'NEXT_PUBLIC_GEMINI_TEMPERATURE'
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
  const envSource = typeof __LOOP_RENDERER_PUBLIC_ENV__ === 'object' ? __LOOP_RENDERER_PUBLIC_ENV__ : undefined
  const resolvedEnv: Partial<Record<PublicEnvKey, string>> = {}

  for (const key of PUBLIC_ENV_KEYS) {
    const value = envSource?.[key]
    if (typeof value === 'string' && value.trim().length > 0) {
      const trimmed = value.trim()
      resolvedEnv[key] = trimmed
      ensureProcessEnv(key, trimmed)
    }
  }

  if (!resolvedEnv.NEXT_PUBLIC_GEMINI_API_KEY) {
    Logger.warn('RENDERER_ENV', 'NEXT_PUBLIC_GEMINI_API_KEY가 설정되지 않았습니다. Gemini 기반 기능이 제한될 수 있습니다.');
  }

  const globalObject = globalThis as { __LOOP_RENDERER_ENV__?: Record<string, string> }
  globalObject.__LOOP_RENDERER_ENV__ = {
    ...(globalObject.__LOOP_RENDERER_ENV__ ?? {}),
    ...resolvedEnv
  }
}

bootstrapRendererEnv()
