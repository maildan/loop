// 🔥 기가차드 언어 감지기 공통 타입 정의

/**
 * 🔥 지원하는 언어 타입 (확장됨)
 */
export type SupportedLanguage = 'ko' | 'en' | 'ja' | 'zh' | 'es' | 'fr' | 'de';

/**
 * 🔥 macOS 입력소스 타입 (확장됨)
 */
export type MacOSInputSourceType = 'ko' | 'en' | 'zh' | 'ja' | 'es' | 'fr' | 'de' | null;

/**
 * 🔥 언어 감지 방법
 */
export type DetectionMethod = 
  | 'keycode' 
  | 'pattern' 
  | 'fallback' 
  | 'system' 
  | 'character' 
  | 'ime' 
  | 'switch' 
  | 'validation' 
  | 'special-char-mapping'
  | 'native'
  | 'unicode'
  | 'inference';

/**
 * 🔥 플랫폼 타입
 */
export type PlatformType = 'macos' | 'windows' | 'linux' | 'fallback';

/**
 * 🔥 한글 키코드 매핑 타입
 */
export type HangulKeycodeMap = Map<number, string>;

/**
 * 🔥 입력소스 매핑 타입
 */
export type InputSourceMap = Record<string, SupportedLanguage>;

/**
 * 🔥 키보드 레이아웃 매핑 타입
 */
export type KeyboardLayoutMap = Record<number, SupportedLanguage>;

/**
 * 🔥 언어 감지 결과 메타데이터
 */
export interface DetectionMetadata {
  keycode?: number;
  keychar?: number;
  char?: string;
  reason?: string;
  source?: string;
  processingTime?: string;
  hangulChar?: string;
  rawcode?: number;
  physicalKeycode?: number;
  error?: string;
  confidence?: number;
  inputSourceId?: string;
  inputSource?: string; // 🔥 추가: 입력소스 정보
  detectedLanguage?: string;
  systemCallDuration?: number;
  cacheHit?: boolean;
  fallbackReason?: string;
  layoutId?: number;
  threadId?: number;
  windowHandle?: string;
  engineName?: string;
  xkbLayout?: string;
  environmentLang?: string;
  inputMethod?: string;
  // 🔥 새로 추가되는 필드들
  charCode?: number;
  hangulType?: HangulType;
  translationResult?: MacOSTranslationResult; // 🔥 추가: 번역 결과
  modifiers?: MacOSModifiers; // 🔥 추가: 수정자 키
  unicodeRange?: UnicodeRange; // 🔥 추가: Unicode 범위 정보
  systemInputSource?: MacOSInputSourceType; // 🔥 추가: 시스템 입력소스
  detectionTime?: number; // 🔥 추가: 감지 시간 (timestamp)
  translationMethod?: string; // 🔥 추가: 번역 방법
  mappedBy?: string; // 🔥 추가: 매핑 방법 (keycode/keychar)
  systemLanguage?: string; // 🔥 추가: 시스템 언어 정보
}

/**
 * 🔥 언어 감지 결과 인터페이스
 */
export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  method: DetectionMethod;
  isComposing: boolean;
  detectedChar?: string; // 🔥 수정: null 제거, undefined만 허용
  metadata?: DetectionMetadata;
}

/**
 * 🔥 성능 통계 인터페이스
 */
export interface PerformanceStats {
  detectionCount: number;
  averageProcessingTime: number;
  currentLanguage: SupportedLanguage;
  platform?: string;
  detectorType?: PlatformType;
  fallbackCount?: number;
  fallbackRate?: number;
  systemCallCount?: number;
  cacheHitRate?: number;
  lastError?: string;
  uptime?: number;
}

/**
 * 🔥 헬스체크 결과 인터페이스
 */
export interface HealthCheckResult {
  healthy: boolean;
  uptime?: number;
  lastError?: string;
  performance: PerformanceStats;
  platform?: string;
  detectorType?: PlatformType;
}

/**
 * 🔥 macOS 전용 입력소스 타입 (확장됨)
 */

/**
 * 🔥 macOS 수정자 키 타입
 */
export interface MacOSModifiers {
  shift?: boolean;
  command?: boolean;
  option?: boolean;
  control?: boolean;
  fn?: boolean;
  capsLock?: boolean;
}

/**
 * 🔥 macOS 키코드 변환 결과 타입
 */
export interface MacOSTranslationResult {
  character: string | null;
  inputSource: string | null;
  language: SupportedLanguage | 'unknown';
  isSuccess: boolean;
  method: 'applescript' | 'cache' | 'fallback' | 'native';
  processingTime: number;
  confidence?: number;
  modifiers?: MacOSModifiers;
}

/**
 * 🔥 macOS 키보드 레이아웃 정보
 */
export interface MacOSKeyboardLayoutInfo {
  layoutId: string;
  layoutName: string;
  inputSourceId: string;
  language: SupportedLanguage;
  isActive: boolean;
  lastUsed?: Date;
}

/**
 * 🔥 macOS 입력소스 정보
 */
export interface MacOSInputSourceInfo {
  id: string;
  name: string;
  category: string;
  language: SupportedLanguage;
  isSelectable: boolean;
  isEnabled: boolean;
}

/**
 * 🔥 Unicode 범위 타입
 */
export interface UnicodeRange {
  start: number;
  end: number;
  language: SupportedLanguage;
  type: 'syllable' | 'consonant' | 'vowel' | 'compat' | 'basic' | 'extended';
  description: string;
}

/**
 * 🔥 한글 타입 분류
 */
export type HangulType = 'syllable' | 'consonant' | 'vowel' | 'compat';

/**
 * 🔥 언어 감지 성능 메트릭
 */
export interface LanguageDetectionMetrics {
  totalDetections: number;
  successRate: number;
  averageConfidence: number;
  methodUsageStats: Record<DetectionMethod, number>;
  languageDistribution: Record<SupportedLanguage, number>;
  errorCount: number;
  cacheHitRate: number;
  averageProcessingTime: number;
}
