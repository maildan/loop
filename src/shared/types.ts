// 🔥 기가차드 공유 타입 정의 - Electron API 통합

import type { Theme } from './types/theme';
import type { FontOption, FontVariantManifestEntry } from './fonts/types';

// 🎭 프로젝트 관련 타입은 types/project.ts에서 import하여 사용
import type { ProjectCharacter, ProjectStructure, ProjectNote, Project } from './types/project';
import type { DashboardSummary, ForeshadowSummary, TimelineEpisodeSummary } from './types/synopsis';

// 🎭 에피소드 관련 타입 - types/episode.ts에서 import
import type {
  Episode,
  CreateEpisodeInput,
  UpdateEpisodeInput,
  EpisodeFilterOptions,
  EpisodeSortOptions,
  ManuscriptReserves,
  FiveActAnalysis,
  EpisodeStats
} from './types/episode';

// Re-export for convenience
export type { ProjectCharacter, ProjectStructure, ProjectNote, Project };
export type { Episode, CreateEpisodeInput, UpdateEpisodeInput, EpisodeFilterOptions, EpisodeSortOptions, ManuscriptReserves, FiveActAnalysis, EpisodeStats };
export type { DashboardSummary, ForeshadowSummary, TimelineEpisodeSummary };

// 🔥 Result 타입 - 함수 결과 래핑
export interface Result<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
}

// 🔥 IPC 응답 타입 - Main ↔ Renderer 공통
export interface IpcResponse<TData = unknown> {
  success: boolean;
  data?: TData;
  error?: string;
  timestamp: Date;
}

// 🤖 Gemini 채팅 타입
export type GeminiChatRole = 'user' | 'assistant' | 'system';

export interface GeminiChatMessageDTO {
  id: string;
  sessionId: string;
  projectId: string;
  role: GeminiChatRole;
  content: string;
  isStreaming?: boolean;
  tokenUsage?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeminiChatSessionDTO {
  id: string;
  projectId: string;
  title?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown> | null;
  lastInteraction: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type EnvironmentStatusValue = 'set' | 'missing';

export type EnvironmentStatusKey =
  | 'GEMINI_API_KEY'
  | 'GEMINI_MODEL'
  | 'GOOGLE_CLIENT_ID'
  | 'GOOGLE_CLIENT_SECRET'
  | 'GOOGLE_REDIRECT_URI';

export type EnvironmentStatusMap = Record<EnvironmentStatusKey, EnvironmentStatusValue>;

export interface GeminiEnvironmentStatus {
  available: boolean;
  status: EnvironmentStatusMap;
  message?: string;
}

// 🎯 키보드 모니터링 상태 - Main ↔ Renderer 공통
export interface MonitoringStatus {
  isActive: boolean;
  startTime?: Date;
  sessionDuration: number;
  language: string;
}

// 🎯 실시간 타이핑 통계 - Main ↔ Renderer 공통
export interface RealtimeStats {
  currentWpm: number;
  accuracy: number;
  sessionTime: number;
  charactersTyped: number;
  errorsCount: number;
}

// 🎯 대시보드 통계 - Main ↔ Renderer 공통
export interface DashboardStats {
  todayWords: number;
  weekWords: number;
  monthWords: number;
  avgWpm: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  accuracy: number;
  streakDays: number;
}

// 🎯 세션 데이터 - Main ↔ Renderer 공통 (Prisma 스키마와 일치)
export interface TypingSession {
  id: string;
  userId: string;
  content: string;
  startTime: Date;
  endTime: Date | null;
  keyCount: number;
  wpm: number;
  accuracy: number;
  windowTitle: string | null;
  appName: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  // 🔥 세션 매니저에서 사용하는 추가 필드들
  totalKeystrokes?: number;
  charactersTyped?: number;
  wordsTyped?: number;
  errorsCount?: number;
  applicationName?: string;
  language?: string;
}

// 🔥 메인 Electron API 인터페이스 - Main ↔ Renderer 공통
export interface ElectronAPI {
  // 🔥 이벤트 리스너 API
  on: (channel: string, listener: (...args: unknown[]) => void) => void;
  removeListener: (channel: string, listener: (...args: unknown[]) => void) => void;

  // � Google OAuth API
  googleOAuth?: {
    startAuth: () => Promise<IpcResponse<{ url: string }>>;
    handleCallback: (code: string, state?: string) => Promise<IpcResponse<boolean>>;
    checkConnection: () => Promise<IpcResponse<{ isConnected: boolean; email?: string }>>;
    getUserInfo: () => Promise<IpcResponse<{ name: string; email: string }>>;
    listDocuments: () => Promise<IpcResponse<Array<{ id: string; name: string; webViewLink: string }>>>;
    createDocument: (title: string, content?: string) => Promise<IpcResponse<{ id: string; name: string; webViewLink: string }>>;
    updateDocument: (documentId: string, content: string) => Promise<IpcResponse<boolean>>;
    getDocumentContent: (documentId: string) => Promise<{ title: string; content: string; images: Array<{ url: string; alt?: string }>; metadata: { createdTime?: string; modifiedTime?: string } }>;
    
    // 🆕 OAuth 성공 콜백 핸들러 (StaticServer 콜백 페이지용)
    onOAuthSuccess?: (callback: () => void) => void;
  };

  // ⌨️ 키보드 API
  keyboard: {
    startMonitoring: () => Promise<IpcResponse<boolean>>;
    stopMonitoring: () => Promise<IpcResponse<boolean>>;
    getStatus: () => Promise<IpcResponse<MonitoringStatus>>;
    getRealtimeStats: () => Promise<IpcResponse<RealtimeStats>>;
    setLanguage: (language: string) => Promise<IpcResponse<boolean>>;
    // 🔥 기가차드 한글 입력 강화 API
    forceKorean: () => Promise<IpcResponse<boolean>>;
    testLanguageDetection: (keycode: number, keychar?: number) => Promise<IpcResponse<string>>;
    // 🔥 새로운 다국어 지원 메서드들
    detectLanguage: (keycode: number) => Promise<IpcResponse<string>>;
    getSupportedLanguages: () => Promise<IpcResponse<string[]>>;
    setInputMethod: (method: 'direct' | 'composition') => Promise<IpcResponse<boolean>>;
    resetComposition: () => Promise<IpcResponse<boolean>>;
    getCompositionState: () => Promise<IpcResponse<{ isComposing: boolean; composingText: string }>>;
  };

  // 📊 대시보드 API
  dashboard: {
    getStats: () => Promise<IpcResponse<DashboardStats>>;
    getRecentSessions: () => Promise<IpcResponse<TypingSession[]>>;
    getAnalytics: () => Promise<IpcResponse<any>>; // 🔥 새로 추가 - 종합 분석 데이터
  };

  // 📁 프로젝트 API
  projects: {
    getAll: () => Promise<IpcResponse<Project[]>>;
    getById: (id: string) => Promise<IpcResponse<Project>>;
    create: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => Promise<IpcResponse<Project>>;
    update: (id: string, updates: Partial<Project>) => Promise<IpcResponse<Project>>;
    delete: (id: string) => Promise<IpcResponse<boolean>>;
    createSample: () => Promise<IpcResponse<Project>>;
    importFile: () => Promise<IpcResponse<Project>>; // 🔥 기가차드 수정: Project 반환
    // 🔥 새로운 캐릭터/구조/메모 API
    getCharacters: (projectId: string) => Promise<IpcResponse<ProjectCharacter[]>>;
    getStructure: (projectId: string) => Promise<IpcResponse<ProjectStructure[]>>;
    getNotes: (projectId: string) => Promise<IpcResponse<ProjectNote[]>>;
    updateCharacters: (projectId: string, characters: ProjectCharacter[]) => Promise<IpcResponse<ProjectCharacter[]>>;
    updateNotes: (projectId: string, notes: ProjectNote[]) => Promise<IpcResponse<ProjectNote[]>>;
    upsertCharacter: (character: Partial<ProjectCharacter>) => Promise<IpcResponse<ProjectCharacter>>;
    upsertStructure: (structure: Partial<ProjectStructure>) => Promise<IpcResponse<ProjectStructure>>;
    upsertNote: (note: Partial<ProjectNote>) => Promise<IpcResponse<ProjectNote>>;
    deleteCharacter: (id: string) => Promise<IpcResponse<boolean>>;
    deleteStructure: (id: string) => Promise<IpcResponse<boolean>>;
    deleteNote: (id: string) => Promise<IpcResponse<boolean>>;
  };

  // 📊 Synopsis Statistics API
  synopsis: {
    getWritingActivity: (projectId: string, days?: number) => Promise<Array<{ date: string; words: number; duration: number }>>;
    getProgressTimeline: (projectId: string, days?: number) => Promise<Array<{ date: string; words: number }>>;
    getEpisodeStats: (projectId: string) => Promise<Array<{ act: string; count: number; avgWords: number; color: string }>>;
    recordWritingActivity: (projectId: string, wordCount: number, duration: number, episodeId?: string) => Promise<{ success: boolean }>;
    getDashboardSummary: (projectId: string) => Promise<DashboardSummary>;
  };

  // ⚙️ 설정 API
  settings: {
    get: (key: string) => Promise<IpcResponse<unknown>>;
    set: (key: string, value: unknown) => Promise<IpcResponse<unknown>>;
    getAll: () => Promise<IpcResponse<Record<string, unknown>>>;
    reset: () => Promise<IpcResponse<boolean>>;
  };

  // 🖥️ 앱 API
  app: {
    getVersion: () => Promise<IpcResponse<string>>;
    quit: () => Promise<IpcResponse<boolean>>;
    minimize: () => Promise<IpcResponse<boolean>>;
    maximize: () => Promise<IpcResponse<boolean>>;
    isMaximized: () => Promise<IpcResponse<boolean>>;
    restart: () => Promise<IpcResponse<boolean>>;
    getUserDataPath: () => Promise<IpcResponse<string>>;
    getName: () => Promise<IpcResponse<string>>;
  };

  // 💾 데이터베이스 API
  database: {
    backup: () => Promise<IpcResponse<string>>;
    restore: (backupPath: string) => Promise<IpcResponse<boolean>>;
    optimize: () => Promise<IpcResponse<boolean>>;
    reset: () => Promise<IpcResponse<boolean>>;
    saveSession: (session: Omit<TypingSession, 'id'>) => Promise<IpcResponse<TypingSession>>;
    getSessions: (options?: { limit?: number; offset?: number }) => Promise<IpcResponse<TypingSession[]>>;
    getStats: (dateRange?: { from: Date; to: Date }) => Promise<IpcResponse<DashboardStats>>;
  };

  // 🤖 AI API - 작가 친화적 AI 어시스턴트
  ai: {
    analyzeText: (text: string) => Promise<IpcResponse<{ suggestions: string[]; score: number }>>;
    generateSuggestions: (prompt: string) => Promise<IpcResponse<string[]>>;
    getUsageStats: () => Promise<IpcResponse<{ totalRequests: number; monthlyRequests: number }>>;
    sendMessage: (message: string, context?: string) => Promise<IpcResponse<{ response: string; suggestions?: string[] }>>;
    getWritingHelp: (prompt: string, context?: string) => Promise<IpcResponse<{ response: string; suggestions?: string[] }>>;
    healthCheck: () => Promise<IpcResponse<{ healthy: boolean }>>;
    // 🔥 에디터 전용 AI 기능
    getProjectContext: (projectId: string) => Promise<IpcResponse<{ summary: string; characters: string[]; keywords: string[] }>>;
    continueWriting: (projectId: string, currentText: string) => Promise<IpcResponse<{ suggestions: string[] }>>;
    improveText: (text: string, projectContext?: string) => Promise<IpcResponse<{ improvedText: string; explanation: string }>>;
    summarizeText: (text: string) => Promise<IpcResponse<{ summary: string; keyPoints: string[] }>>;
    saveAnalysisResult: (analysisData: {
      projectId: string;
      analysisType: string;
      inputData: string;
      prompt?: string;
      response: string;
      metadata?: any;
      confidence?: number;
      status?: string;
    }) => Promise<IpcResponse<any>>;
    getAnalysisHistory: (projectId: string, analysisType?: string) => Promise<IpcResponse<any[]>>;
  };

  // 🔔 알림 API
  notifications: {
    show: (title: string, message: string) => Promise<IpcResponse<boolean>>;
    showTypingGoal: (progress: number) => Promise<IpcResponse<boolean>>;
  };

  // 🎨 테마 API
  theme: {
    get: () => Promise<IpcResponse<Theme>>;
    set: (theme: Theme) => Promise<IpcResponse<boolean>>;
    onChange: (callback: (theme: Theme) => void) => () => void;
    onSystemChange: (callback: (shouldUseDarkColors: boolean) => void) => () => void;
  };

  // 📊 Synopsis Statistics API
  'synopsis-stats:get-publications': (projectId: string) => Promise<any>;
  'synopsis-stats:create-publication': (data: any) => Promise<any>;
  'synopsis-stats:delete-publication': (id: string) => Promise<void>;
  'synopsis-stats:create-metric': (data: any) => Promise<any>;
  'synopsis-stats:get-metrics': (publicationId: string, dateRange?: any) => Promise<any[]>;
  'synopsis-stats:get-suggestions': (publicationId: string) => Promise<any>;
  'synopsis-stats:get-comparison': (projectId: string) => Promise<any[]>;
  'synopsis-stats:get-insights': (projectId: string) => Promise<any[]>;
  'synopsis-stats:get-publishers': (projectId: string) => Promise<any[]>;
  'synopsis-stats:create-publisher': (data: any) => Promise<any>;
  'synopsis-stats:get-experiments': (projectId: string) => Promise<any[]>;
  'synopsis-stats:create-experiment': (data: any) => Promise<any>;

  // 📺 Episode Management API
  'episode:create': (input: CreateEpisodeInput) => Promise<IpcResponse<Episode>>;
  'episode:get': (id: string) => Promise<IpcResponse<Episode>>;
  'episode:getByNumber': (projectId: string, episodeNumber: number) => Promise<IpcResponse<Episode>>;
  'episode:list': (projectId: string, options?: EpisodeFilterOptions & EpisodeSortOptions) => Promise<IpcResponse<Episode[]>>;
  'episode:update': (id: string, data: UpdateEpisodeInput) => Promise<IpcResponse<Episode>>;
  'episode:delete': (id: string) => Promise<void>;
  'episode:hardDelete': (id: string) => Promise<void>;
  'episode:publish': (id: string, platforms: string[]) => Promise<IpcResponse<Episode>>;
  'episode:getManuscriptReserves': (projectId: string) => Promise<IpcResponse<ManuscriptReserves>>;
  'episode:analyzeFiveActStructure': (projectId: string) => Promise<IpcResponse<FiveActAnalysis>>;
  'episode:getStats': (projectId: string) => Promise<IpcResponse<EpisodeStats>>;

  // �🐚 Shell API (외부 링크 및 파일 탐색기)
  shell: {
    openExternal: (url: string) => Promise<IpcResponse<boolean>>;
    showItemInFolder: (fullPath: string) => Promise<IpcResponse<boolean>>;
  };

  // 🔐 OAuth API (Google Docs 연동)
  oauth: {
    // optional loginHint (email) can be provided to suggest account during auth
    startGoogleAuth: (loginHint?: string) => Promise<IpcResponse<{ authUrl: string }>>;
    handleCallback: (code: string) => Promise<IpcResponse<{ accessToken: string; refreshToken: string }>>;
    getGoogleDocuments: () => Promise<IpcResponse<Array<{ id: string; title: string; modifiedTime: string }>>>;
    importGoogleDoc: (documentId: string) => Promise<IpcResponse<{ title: string; content: string }>>;
    getAuthStatus: () => Promise<IpcResponse<{ isAuthenticated: boolean; userEmail?: string; userName?: string; userPicture?: string }>>;
    revokeAuth: () => Promise<IpcResponse<boolean>>;
  };

  // 🔥 폰트 API (사전 변환된 WOFF2 매니페스트 기반)
  font: {
    initialize: () => Promise<{ success: boolean; error?: string }>;
    getAvailableFonts: () => Promise<FontOption[]>;
    generateCSS: () => Promise<string>;
    getFontFamily: (familyName: string) => Promise<{ name: string; displayName: string; category: string; variants: FontVariantManifestEntry[]; cssFamily: string } | null>;
    reload: () => Promise<{ success: boolean; error?: string }>;
  };

  // 🔥 Updater API (electron-updater 통합 + 플랫폼별 재시작 지원)
  updater: {
    checkForUpdates: () => Promise<IpcResponse<boolean>>;
    restartAndInstall: () => Promise<IpcResponse<boolean>>;
    quitAndInstall: () => Promise<IpcResponse<boolean>>;
  };

  // 🌍 환경 변수 & 설정 API
  env: {
    setGeminiKey: (apiKey: string) => Promise<IpcResponse<{ success: boolean; message: string }>>;
    getGeminiKey: () => Promise<IpcResponse<{ key?: string; message: string }>>;
    getGeminiStatus: () => Promise<IpcResponse<{ available: boolean; status: 'set' | 'missing'; message: string }>>;
  };

  // 🤖 Gemini AI Assistant API (시놉시스 뷰 전용)
  'gemini:get-status': () => Promise<IpcResponse<GeminiEnvironmentStatus>>;
  'gemini:get-project-context': (projectId: string) => Promise<IpcResponse<{
    projectTitle: string;
    totalEpisodes: number;
    totalWords: number;
    characters: Array<{ name: string; role: string; description?: string }>;
    aiInsights: string[];
  }>>;
  'gemini:send-message': (params: {
    projectId: string;
    sessionId?: string;
    message: string;
    history: Array<{ id: string; role: GeminiChatRole; content: string }>;
    systemPrompt: string;
  }) => Promise<IpcResponse<{ response: string; sessionId: string }>>;
  'gemini:get-chat-history': (params: {
    projectId: string;
    sessionId?: string;
    limit?: number;
  }) => Promise<IpcResponse<{
    session: GeminiChatSessionDTO;
    messages: GeminiChatMessageDTO[];
  }>>;
}

// 🔥 기가차드 키보드 이벤트 인터페이스 (최종 통합 버전)
export interface KeyboardEvent {
  readonly key: string;
  readonly code: string; // 🔥 KeyboardEvent.code 표준 속성 추가
  readonly keycode: number; // 🔥 uIOhook keycode
  readonly keychar: string;
  readonly timestamp: number;
  readonly windowTitle: string;
  readonly type: 'keydown' | 'keyup' | 'input' | 'completed' | 'composing'; // 🔥 한글 조합 타입 추가
}

// 🔥 기가차드 처리된 키보드 이벤트 (keyboardService 처리 후)
export interface ProcessedKeyboardEvent {
  readonly key: string;
  readonly code: string; // 🔥 Key${keycode} 형태
  readonly keycode: number; // 🔥 uIOhook keycode 추가
  readonly keychar: string;
  readonly timestamp: number;
  readonly windowTitle: string;
  readonly type: 'keydown' | 'keyup' | 'input';
  readonly language: string; // 🔥 감지된 언어
  readonly composedChar?: string; // 🔥 조합된 문자 (한글 등)
  readonly isComposing: boolean; // 🔥 조합 중 여부
  readonly inputMethod: string; // 🔥 입력 방식
  readonly processingTime: number; // 🔥 처리 시간 (ms)
}



// 🔥 언어 감지 관련 타입들은 중앙화된 모듈에서 re-export
// 🔥 언어 감지 관련 타입 정의 (keyboard 모듈에서 이동됨)
export type SupportedLanguage = 'ko' | 'en';

export type DetectionMethod = 'keycode' | 'character' | 'pattern' | 'ime';

export interface LanguageDetectionResult {
  language: SupportedLanguage;
  confidence: number;
  method: DetectionMethod;
  metadata?: DetectionMetadata;
}

export interface DetectionMetadata {
  keycode?: number;
  character?: string;
  pattern?: string;
  timestamp?: number;
}

export interface PerformanceStats {
  totalDetections: number;
  successfulDetections: number;
  averageConfidence: number;
  lastDetectionTime?: number;
}

// 🔥 키 입력 데이터 인터페이스 (어댑터용)
export interface KeyInputData {
  /** 입력된 문자 (IME 완성 문자 포함) */
  character: string;

  /** 입력 시각 (타임스탬프) */
  timestamp: number;

  /** 감지된 언어 (ko, en, ja, zh 등) */
  language: string;

  /** 현재 활성 윈도우 정보 */
  windowInfo: {
    title: string;
    bundleId?: string;
    processName?: string;
  };

  /** 입력 방식 (직접 입력 vs IME 조합 vs 완성형) */
  inputMethod: 'direct' | 'ime' | 'composition' | 'complete';

  /** 원본 키 코드 정보 (디버깅용) */
  rawKeyInfo?: {
    keycode: number;
    keychar: number;
    key: string;
    shiftKey: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
  };
}

// 🔥 기가차드 한글 조합 결과
export interface HangulCompositionResult {
  completed: string; // 완성된 한글 (예: "가")
  composing: string; // 조합 중인 한글 (예: "ㄱ")
}

// 🔥 기가차드 키보드 상태
export interface KeyboardState {
  isActive: boolean;
  language: string; // 🔥 더 유연한 string 타입
  inputMethod: string; // 🔥 더 유연한 string 타입
  startTime?: Date;
  totalEvents: number;
  eventsPerSecond?: number; // 🔥 선택적 속성 추가
}

// 🔥 기가차드 키보드 모니터링 상태 (하위 호환성)
export interface KeyboardMonitorState {
  isActive: boolean;
  language: string;
  inputMethod: string;
  eventsPerSecond: number;
  totalEvents: number;
  startTime: Date | null;
}

// 🔥 기가차드 윈도우 정보 통합 타입 (모든 기능 포함)
export interface WindowInfo {
  // 🔥 기본 정보 (모든 플랫폼 공통)
  id: number;
  title: string;

  // 🔥 프로세스 정보
  owner: {
    name: string;          // processName 역할
    processId: number;     // pid 역할
    bundleId?: string;     // macOS용
    path?: string;         // 실행파일 경로
  };

  // 🔥 윈도우 위치/크기 정보
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  // 🔥 시스템 정보
  memoryUsage: number;

  // 🔥 Loop 전용 확장 필드 (기존 호환성 유지)
  loopTimestamp?: number;
  loopAppCategory?: AppCategory;
  loopSessionId?: string;
  loopTypingStats?: {
    wpm: number;
    accuracy: number;
    keystrokeCount: number;
    sessionDuration: number;
  };

  // 🔥 Loop 추가 전용 필드들
  loopLanguageDetected?: string;        // 감지된 언어 (한글/영문)
  loopIMEState?: 'enabled' | 'disabled' | 'unknown';  // IME 상태
  loopPlatformInfo?: {
    platform: NodeJS.Platform;
    version: string;
    architecture: string;
  };
  loopPermissions?: {
    accessibility: boolean;
    screenRecording: boolean;
    inputMonitoring: boolean;
  };
  loopSessionMetadata?: {
    startTime: number;
    endTime?: number;
    totalKeystrokes: number;
    activeTime: number;    // 실제 활성 시간 (밀리초)
    idleTime: number;      // 비활성 시간 (밀리초)
  };
}

// 🔥 간단한 윈도우 정보 (하위 호환성)
export interface SimpleWindowInfo {
  title: string;
  processName: string;
  pid: number;
}

// 🔥 앱 카테고리 타입 (appCategories.ts와 동일하게 유지)
export type AppCategory =
  | 'ai-assistant'
  | 'browser'
  | 'cloud-storage'
  | 'communication'
  | 'creative-writing'     // 🔥 새 카테고리
  | 'design'
  | 'development'
  | 'e-commerce'
  | 'entertainment'
  | 'file-management'
  | 'finance'
  | 'marketing'
  | 'media-production'
  | 'note-taking'          // 🔥 새 카테고리
  | 'office'
  | 'productivity'
  | 'project-management'
  | 'reading'              // 🔥 새 카테고리
  | 'research'             // 🔥 새 카테고리
  | 'security'
  | 'social-media'         // 🔥 새 카테고리
  | 'system'
  | 'text-editor'          // 🔥 새 카테고리
  | 'unknown'
  | 'writing-tools';       // 🔥 새 카테고리

// 🔥 키보드 엔진 설정 타입
export interface KeyboardEngineConfig {
  enableBuffering: boolean;
  bufferSize: number;
  enableLanguageDetection: boolean;
  enableWindowTracking: boolean;
  enableSessionRecording: boolean; // 필수 속성으로 변경
  inputDelay: number;
  debugMode: boolean;
}

// 🔥 타이핑 통계 인터페이스
export interface TypingStats {
  totalKeystrokes: number;
  wpm: number;
  accuracy: number;
  sessionDuration: number;
  charactersTyped: number;
  wordsTyped: number;
  errorsCount: number;
}

export interface UserPreferences {
  language: string;
  theme: Theme;
  enableNotifications: boolean;
  enableSounds: boolean;
  autoStartMonitoring: boolean;
  privacyMode: boolean;
  notifications: boolean;
  autoStart: boolean;
  trackingEnabled: boolean;
}

export interface AppSettings {
  version: string;
  lastUpdated: Date;
  dataDirectory: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

// 🔥 IPC 채널 상수
export const IPC_CHANNELS = {
  KEYBOARD: {
    START_MONITORING: 'keyboard:start-monitoring',
    STOP_MONITORING: 'keyboard:stop-monitoring',
    GET_STATUS: 'keyboard:get-status',
    EVENT: 'keyboard:event',
    TEST_LANGUAGE_DETECTION: 'keyboard:test-language-detection',
  },
  PROJECTS: {
    GET_ALL: 'projects:get-all',
    GET_BY_ID: 'projects:get-by-id',
    CREATE: 'projects:create',
    UPDATE: 'projects:update',
    DELETE: 'projects:delete',
    CREATE_SAMPLE: 'projects:create-sample',
    IMPORT_FILE: 'projects:import-file',
  },
  WINDOW: {
    GET_ACTIVE: 'window:get-active',
    GET_LIST: 'window:get-list',
  },
  DATABASE: {
    SAVE_SESSION: 'database:save-session',
    GET_SESSIONS: 'database:get-sessions',
    GET_STATS: 'database:get-stats',
    GET_ANALYTICS: 'database:get-analytics', // 🔥 새로 추가
  },
  SETTINGS: {
    GET: 'settings:get',
    SET: 'settings:set',
    RESET: 'settings:reset',
  },
  // 🔥 폰트 관련 채널 추가
  FONT: {
    LOAD: 'font:load',
    GET_SUPPORTED_FONTS: 'font:get-supported-fonts',
    GET_LOADED_FONTS: 'font:get-loaded-fonts',
    CLEAR_CACHE: 'font:clear-cache',
    EXTRACT_FROM_ZIP: 'font:extract-from-zip',
    GET_FONT_FAMILY: 'font:get-font-family',
    CREATE_DEMO_ZIP: 'font:create-demo-zip',
  },
  PERMISSIONS: {
    REQUEST_ALL: 'permissions:request-all',
    CHECK_STATUS: 'permissions:check-status',
    REQUEST_ACCESSIBILITY: 'permissions:request-accessibility',
    REQUEST_SCREEN_RECORDING: 'permissions:request-screen-recording',
  },
  APP: {
    GET_VERSION: 'app:get-version',
    QUIT: 'app:quit',
    MINIMIZE: 'app:minimize',
    MAXIMIZE: 'app:maximize',
    IS_MAXIMIZED: 'app:is-maximized',
  },
} as const;

export type IpcChannels = typeof IPC_CHANNELS;

// 🔥 Health Check 관련 타입들
export enum HealthStatus {
  HEALTHY = 'healthy',
  WARNING = 'warning',
  ERROR = 'error'
}

export interface HealthCheckResult {
  status: HealthStatus;
  message: string;
  details: Record<string, unknown>;
  issues: string[];
  lastChecked: Date;
}

export interface SystemHealth {
  timestamp: Date;
  overallStatus: HealthStatus;
  system: HealthCheckResult;
  keyboard: HealthCheckResult;
  permissions: HealthCheckResult;
  storage: HealthCheckResult;
  uptime: number;
  version: string;
}

// 🔥 권한 관련 타입들
export interface PermissionStatus {
  accessibility: boolean;
  screenRecording: boolean;
}

export interface PermissionRequestResult {
  accessibility: boolean;
  screenRecording: boolean;
  allGranted: boolean;
}

export type IpcChannelType = typeof IPC_CHANNELS;

// 🔥 이 파일을 모듈로 만들기 위한 export
export { };

// =============================
// 🔥 Google OAuth/Drive 공통 타입
// =============================

export interface OAuthTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number; // seconds
  scope?: string;
  token_type?: string;
}

export interface GoogleUserInfo {
  id?: string;
  email: string;
  verified_email?: boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  locale?: string;
}

export interface GoogleDriveFile {
  id: string;
  name: string;
  modifiedTime: string;
  webViewLink?: string;
}

export interface GoogleDriveFilesResponse {
  files: GoogleDriveFile[];
}
