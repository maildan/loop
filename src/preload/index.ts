import { contextBridge, ipcRenderer, nativeTheme, IpcRendererEvent } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { safePathJoin } from '../shared/utils/pathSecurity';
import {
  IPC_CHANNELS,
  IpcResponse,
  TypingSession,
  TypingStats,
  UserPreferences,
  WindowInfo,
  ElectronAPI,
  Project,
  ProjectCharacter,
  ProjectStructure,
  ProjectNote
} from '../shared/types';
import type { Theme } from '../shared/types/theme';
import { isValidTheme } from '../shared/types/theme';
import { Logger } from '../shared/logger';
import type {
  SettingsSchema,
  SettingsResult,
  AppSettingsSchema,
  // KeyboardSettingsSchema 제거됨 - 키보드 모니터링 기능 불필요
  UISettingsSchema,
  AnalyticsSettingsSchema,
  SecuritySettingsSchema,
  NotificationSettingsSchema,
  AISettingsSchema,
  ClipboardSettingsSchema,
  ScreenshotSettingsSchema,
  AccountSettingsSchema,
  DataRetentionSettingsSchema
} from '../main/settings/types';

// 🔥 기가차드 Preload 스크립트 - 타입 안전한 API 브릿지

// 🔥 타입 안전한 API 구현
const electronAPI: ElectronAPI = {
  // 🔥 이벤트 리스너 API
  on: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, listener);
  },
  removeListener: (channel: string, listener: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, listener);
  },
  keyboard: {
    // 모든 keyboard API가 더미 구현으로 교체됨 - 모니터링 기능 제거
    startMonitoring: () => Promise.resolve({ success: false, message: 'Keyboard monitoring disabled', timestamp: new Date(), data: false }),
    stopMonitoring: () => Promise.resolve({ success: false, message: 'Keyboard monitoring disabled', timestamp: new Date(), data: false }),
    getStatus: () => Promise.resolve({
      success: false,
      message: 'Status unavailable',
      timestamp: new Date(),
      data: { isActive: false, sessionDuration: 0, language: 'ko' }
    }),
    getRealtimeStats: () => Promise.resolve({
      success: false,
      message: 'Stats unavailable',
      timestamp: new Date(),
      data: { currentWpm: 0, accuracy: 0, sessionTime: 0, charactersTyped: 0, errorsCount: 0 }
    }),
    setLanguage: () => Promise.resolve({ success: false, message: 'Language setting disabled', timestamp: new Date(), data: false }),
    forceKorean: () => Promise.resolve({ success: false, message: 'Force Korean disabled', timestamp: new Date(), data: false }),
    testLanguageDetection: () => Promise.resolve({ success: false, message: 'Language detection disabled', timestamp: new Date(), data: 'disabled' }),
    detectLanguage: () => Promise.resolve({ success: false, message: 'Language detection disabled', timestamp: new Date(), data: 'ko' }),
    getSupportedLanguages: () => Promise.resolve({ success: false, message: 'Supported languages unavailable', timestamp: new Date(), data: [] }),
    setInputMethod: () => Promise.resolve({ success: false, message: 'Input method setting disabled', timestamp: new Date(), data: false }),
    resetComposition: () => Promise.resolve({ success: false, message: 'Composition reset disabled', timestamp: new Date(), data: false }),
    getCompositionState: () => Promise.resolve({ success: false, message: 'Composition state unavailable', timestamp: new Date(), data: { isComposing: false, composingText: '' } }),
  },

  dashboard: {
    getStats: () => ipcRenderer.invoke('dashboard:get-stats'),
    getRecentSessions: () => ipcRenderer.invoke('dashboard:get-recent-sessions'),
    getAnalytics: () => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_ANALYTICS), // 🔥 새로 추가
  },

  projects: {
    getAll: () => ipcRenderer.invoke('projects:get-all'),
    getById: (id: string) => ipcRenderer.invoke('projects:get-by-id', id),
    create: (project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>) => ipcRenderer.invoke('projects:create', project),
    update: (id: string, updates: Partial<Project>) => ipcRenderer.invoke('projects:update', id, updates),
    delete: (id: string) => ipcRenderer.invoke('projects:delete', id),
    createSample: () => ipcRenderer.invoke('projects:create-sample'),
    importFile: () => ipcRenderer.invoke('projects:import-file'),
    // 🔥 새로운 캐릭터/구조/메모 API 추가
    getCharacters: (projectId: string) => ipcRenderer.invoke('projects:get-characters', projectId),
    getStructure: (projectId: string) => ipcRenderer.invoke('projects:get-structure', projectId),
    getNotes: (projectId: string) => ipcRenderer.invoke('projects:get-notes', projectId),
    updateCharacters: (projectId: string, characters: ProjectCharacter[]) => ipcRenderer.invoke('projects:update-characters', projectId, characters),
    updateNotes: (projectId: string, notes: ProjectNote[]) => ipcRenderer.invoke('projects:update-notes', projectId, notes),
    upsertCharacter: (character: Partial<ProjectCharacter>) => ipcRenderer.invoke('projects:upsert-character', character),
    upsertStructure: (structure: Partial<ProjectStructure>) => ipcRenderer.invoke('projects:upsert-structure', structure),
    upsertNote: (note: Partial<ProjectNote>) => ipcRenderer.invoke('projects:upsert-note', note),
    deleteCharacter: (id: string) => ipcRenderer.invoke('projects:delete-character', id),
    deleteStructure: (id: string) => ipcRenderer.invoke('projects:delete-structure', id),
    deleteNote: (id: string) => ipcRenderer.invoke('projects:delete-note', id),
  },

  // 📊 Synopsis Statistics API
  synopsis: {
    getWritingActivity: (projectId: string, days?: number) => ipcRenderer.invoke('synopsis:getWritingActivity', projectId, days),
    getProgressTimeline: (projectId: string, days?: number) => ipcRenderer.invoke('synopsis:getProgressTimeline', projectId, days),
    getEpisodeStats: (projectId: string) => ipcRenderer.invoke('synopsis:getEpisodeStats', projectId),
    recordWritingActivity: (projectId: string, wordCount: number, duration: number, episodeId?: string) => 
      ipcRenderer.invoke('synopsis:recordWritingActivity', projectId, wordCount, duration, episodeId),
  },

  app: {
    getVersion: () => ipcRenderer.invoke(IPC_CHANNELS.APP.GET_VERSION),
    quit: () => ipcRenderer.invoke(IPC_CHANNELS.APP.QUIT),
    minimize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MINIMIZE),
    maximize: () => ipcRenderer.invoke(IPC_CHANNELS.APP.MAXIMIZE),
    isMaximized: () => ipcRenderer.invoke(IPC_CHANNELS.APP.IS_MAXIMIZED),
  },

  database: {
    backup: () => ipcRenderer.invoke('database:backup'),
    restore: (backupPath: string) => ipcRenderer.invoke('database:restore', backupPath),
    optimize: () => ipcRenderer.invoke('database:optimize'),
    reset: () => ipcRenderer.invoke('database:reset'),
    saveSession: (session: Omit<TypingSession, 'id'>) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.SAVE_SESSION, session),
    getSessions: (options?: { limit?: number; offset?: number }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_SESSIONS, options),
    getStats: (dateRange?: { from: Date; to: Date }) => ipcRenderer.invoke(IPC_CHANNELS.DATABASE.GET_STATS, dateRange),
  },

  ai: {
    analyzeText: (text: string) => ipcRenderer.invoke('ai:analyze-text', text),
    improveText: (text: string, projectId?: string) => ipcRenderer.invoke('ai:improve-text', text, projectId),
    generateSuggestions: (prompt: string) => ipcRenderer.invoke('ai:generate-suggestions', prompt),
    getUsageStats: () => ipcRenderer.invoke('ai:get-usage-stats'),
    sendMessage: (message: string, context?: string) => ipcRenderer.invoke('ai:send-message', message, context),
    getWritingHelp: (prompt: string, context?: string) => ipcRenderer.invoke('ai:get-writing-help', prompt, context),
    getProjectContext: (projectId: string) => ipcRenderer.invoke('ai:get-project-context', projectId),
    healthCheck: () => ipcRenderer.invoke('ai:health-check'),
    continueWriting: (text: string, context?: string) => ipcRenderer.invoke('ai:continue-writing', text, context),
    summarizeText: (text: string) => ipcRenderer.invoke('ai:summarize-text', text),
    saveAnalysisResult: (analysisData: any) => ipcRenderer.invoke('ai:save-analysis-result', analysisData),
  },

  notifications: {
    show: (title: string, message: string) => ipcRenderer.invoke('notifications:show', title, message),
    showTypingGoal: (progress: number) => ipcRenderer.invoke('notifications:show-typing-goal', progress),
  },

  // 📊 Synopsis Statistics API
  'synopsis-stats:get-publications': (projectId: string) => ipcRenderer.invoke('synopsis-stats:get-publications', projectId),
  'synopsis-stats:create-publication': (data: any) => ipcRenderer.invoke('synopsis-stats:create-publication', data),
  'synopsis-stats:delete-publication': (id: string) => ipcRenderer.invoke('synopsis-stats:delete-publication', id),
  'synopsis-stats:create-metric': (data: any) => ipcRenderer.invoke('synopsis-stats:create-metric', data),
  'synopsis-stats:get-metrics': (publicationId: string, dateRange?: any) => ipcRenderer.invoke('synopsis-stats:get-metrics', publicationId, dateRange),
  'synopsis-stats:get-suggestions': (publicationId: string) => ipcRenderer.invoke('synopsis-stats:get-suggestions', publicationId),
  'synopsis-stats:get-comparison': (projectId: string) => ipcRenderer.invoke('synopsis-stats:get-comparison', projectId),
  'synopsis-stats:get-insights': (projectId: string) => ipcRenderer.invoke('synopsis-stats:get-insights', projectId),
  'synopsis-stats:get-publishers': (projectId: string) => ipcRenderer.invoke('synopsis-stats:get-publishers', projectId),
  'synopsis-stats:create-publisher': (data: any) => ipcRenderer.invoke('synopsis-stats:create-publisher', data),
  'synopsis-stats:get-experiments': (projectId: string) => ipcRenderer.invoke('synopsis-stats:get-experiments', projectId),
  'synopsis-stats:create-experiment': (data: any) => ipcRenderer.invoke('synopsis-stats:create-experiment', data),

  // 📝 Episode Management API
  'episode:create': (input: any) => ipcRenderer.invoke('episode:create', input),
  'episode:get': (id: string) => ipcRenderer.invoke('episode:get', id),
  'episode:getByNumber': (projectId: string, episodeNumber: number) => ipcRenderer.invoke('episode:getByNumber', projectId, episodeNumber),
  'episode:list': (projectId: string, options?: any) => ipcRenderer.invoke('episode:list', projectId, options),
  'episode:update': (id: string, data: any) => ipcRenderer.invoke('episode:update', id, data),
  'episode:delete': (id: string) => ipcRenderer.invoke('episode:delete', id),
  'episode:hardDelete': (id: string) => ipcRenderer.invoke('episode:hardDelete', id),
  'episode:publish': (id: string, platforms: string[]) => ipcRenderer.invoke('episode:publish', id, platforms),
  'episode:getManuscriptReserves': (projectId: string) => ipcRenderer.invoke('episode:getManuscriptReserves', projectId),
  'episode:analyzeFiveActStructure': (projectId: string) => ipcRenderer.invoke('episode:analyzeFiveActStructure', projectId),
  'episode:getStats': (projectId: string) => ipcRenderer.invoke('episode:getStats', projectId),

  theme: {
    get: async () => {
      const fallbackTheme: Theme = 'light';

      const response = await ipcRenderer.invoke('settings:get', 'app.theme').catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown theme retrieval error';
        Logger.error('PRELOAD', 'Failed to load theme from settings', error);
        return { success: false, error: errorMessage } as { success: false; error: string };
      });

      if (!response || typeof response !== 'object') {
        Logger.warn('PRELOAD', 'Received empty theme response from settings, defaulting to light.');
        return {
          success: false,
          data: fallbackTheme,
          error: 'Invalid theme response from main process',
          timestamp: new Date(),
        } satisfies IpcResponse<Theme>;
      }

      const rawTheme = (response as { data?: unknown }).data;
      const hasValidTheme = isValidTheme(rawTheme);

      if ((response as { success?: boolean }).success && hasValidTheme) {
        return {
          success: true,
          data: rawTheme,
          timestamp: new Date(),
        } satisfies IpcResponse<Theme>;
      }

      if (!hasValidTheme && rawTheme !== undefined) {
        Logger.warn('PRELOAD', 'Falling back to light theme because settings value was invalid', { rawTheme });
      }

      const errorMessage = typeof (response as { error?: string }).error === 'string'
        ? (response as { error?: string }).error
        : 'Invalid theme received from main process, defaulting to light';

      return {
        success: false,
        data: fallbackTheme,
        error: errorMessage,
        timestamp: new Date(),
      } satisfies IpcResponse<Theme>;
    },
    set: async (theme: Theme) => {
      const createResponse = (success: boolean, error?: string): IpcResponse<boolean> => ({
        success,
        data: success,
        error,
        timestamp: new Date(),
      });

      if (!isValidTheme(theme)) {
        Logger.warn('PRELOAD', 'Attempted to persist invalid theme, ignoring', { theme });
        return createResponse(false, 'Invalid theme value provided to preload bridge');
      }

      const rawResponse = await ipcRenderer.invoke('settings:set', 'app.theme', theme).catch((error: unknown) => {
        const errorMessage = error instanceof Error ? error.message : 'Unknown theme persistence error';
        Logger.error('PRELOAD', 'Failed to save theme preference', error);
        return { success: false, error: errorMessage } as { success: false; error: string };
      });

      if (!rawResponse || typeof rawResponse !== 'object') {
        Logger.error('PRELOAD', 'Failed to persist theme preference: unknown response payload');
        return createResponse(false, 'Unknown theme persistence failure');
      }

      const typedResponse = rawResponse as { success?: boolean; error?: unknown; data?: unknown };

      if (typedResponse.success) {
        return createResponse(true);
      }

      const errorMessage = typeof typedResponse.error === 'string' ? typedResponse.error : 'Unknown theme persistence failure';

      if (typedResponse.data !== undefined) {
        Logger.error('PRELOAD', 'Failed to persist theme preference', { errorMessage, data: typedResponse.data });
      } else {
        Logger.error('PRELOAD', 'Failed to persist theme preference', { errorMessage });
      }

      return createResponse(false, errorMessage);
    },
    onChange: (callback: (theme: Theme) => void) => {
      const handleSettingsChange = (_event: Electron.IpcRendererEvent, change: { keyPath: string; value: unknown }) => {
        if (change.keyPath !== 'app.theme') {
          return;
        }

        const nextTheme: Theme = isValidTheme(change.value) ? change.value : 'light';

        if (!isValidTheme(change.value)) {
          Logger.warn('PRELOAD', 'Received invalid theme value from settings change event, defaulting to light', { value: change.value });
        }

        try {
          callback(nextTheme);
        } catch (error) {
          Logger.error('PRELOAD', 'Theme change callback threw an error', error);
        }
      };

      ipcRenderer.on('settings:changed', handleSettingsChange);
      return () => ipcRenderer.removeListener('settings:changed', handleSettingsChange);
    },
    onSystemChange: (callback: (shouldUseDarkColors: boolean) => void) => {
      if (!nativeTheme || typeof nativeTheme.on !== 'function' || typeof nativeTheme.off !== 'function') {
        return () => {
          // no-op when nativeTheme is unavailable
        };
      }

      const handleSystemThemeChange = () => {
        try {
          callback(Boolean(nativeTheme.shouldUseDarkColors));
        } catch (error) {
          Logger.error('PRELOAD', 'Failed to propagate system theme change', error);
        }
      };

      try {
        nativeTheme.on('updated', handleSystemThemeChange);
      } catch (error) {
        Logger.error('PRELOAD', 'Failed to subscribe to nativeTheme updates', error);
        return () => {
          // subscription failed, no-op cleanup
        };
      }

      return () => {
        try {
          nativeTheme.off('updated', handleSystemThemeChange);
        } catch (error) {
          Logger.error('PRELOAD', 'Failed to unsubscribe nativeTheme listener', error);
        }
      };
    },
  },

  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: unknown) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:get-all'),
    reset: () => ipcRenderer.invoke('settings:reset'),
    // subscribe to main process broadcast when settings change
    // added via any to avoid changing shared types in this patch
    // (electronAPI.settings as any).onDidChange = (listener: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => {
    //   const wrapped = (_event: any, data: any) => listener(data);
    //   ipcRenderer.on('settings:changed', wrapped);
    //   return () => ipcRenderer.removeListener('settings:changed', wrapped);
    // };
    // helper (attached after electronAPI creation)
  },

  // 🔥 기가차드 Shell API 추가 (외부 링크 열기)
  shell: {
    openExternal: (url: string) => ipcRenderer.invoke('shell:open-external', url),
    showItemInFolder: (fullPath: string) => ipcRenderer.invoke('shell:show-item-in-folder', fullPath),
  },

  // 🔥 OAuth API (Google Docs 연동)
  oauth: {
    startGoogleAuth: (loginHint?: string) => ipcRenderer.invoke('oauth:start-google-auth', loginHint),
    handleCallback: (code: string) => ipcRenderer.invoke('oauth:handle-callback', code),
    getGoogleDocuments: () => ipcRenderer.invoke('oauth:get-google-documents'),
    importGoogleDoc: (documentId: string) => ipcRenderer.invoke('oauth:import-google-doc', documentId),
    getAuthStatus: () => ipcRenderer.invoke('oauth:get-auth-status'),
    revokeAuth: () => ipcRenderer.invoke('oauth:revoke-auth'),
  },

  // 🔥 동적 폰트 API (public/fonts TTF 기반)
  font: {
    initialize: () => ipcRenderer.invoke('font:initialize'),
    getAvailableFonts: () => ipcRenderer.invoke('font:get-available-fonts'),
    generateCSS: () => ipcRenderer.invoke('font:generate-css'),
    getFontFamily: (familyName: string) => ipcRenderer.invoke('font:get-font-family', familyName),
    reload: () => ipcRenderer.invoke('font:reload'),
  },


};

// ============================================================
// Dynamic API Attachments (Type-safe extensions)
// ============================================================

interface ElectronAPIExtended extends ElectronAPI {
  settings: ElectronAPI['settings'] & {
    onDidChange: (listener: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => () => void;
  };
  files: {
    readFileAsDataUrl: (filePath: string) => Promise<unknown>;
  };
}

// Attach settings.onDidChange in a type-safe way
const electronAPIExtended = electronAPI as unknown as ElectronAPIExtended;

electronAPIExtended.settings.onDidChange = (listener: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => {
  const wrapped = (_event: IpcRendererEvent, data: { keyPath: string; value: unknown; reset?: boolean }) => listener(data);
  ipcRenderer.on('settings:changed', wrapped);
  return () => ipcRenderer.removeListener('settings:changed', wrapped);
};

// Attach files API for reading local files as data URLs
electronAPIExtended.files = {
  readFileAsDataUrl: (filePath: string) => ipcRenderer.invoke('settings:read-file', filePath),
};

const readLoopSnapshotFromKeychain = async (): Promise<unknown | null> => {
  try {
    const resp = await ipcRenderer.invoke('keychain:get-snapshot');
    if (!resp) {
      return null;
    }

    if (!resp.ok) {
      return null;
    }

    if (!resp.data) {
      return null;
    }

    return resp.data;
  } catch (error) {
    // ignore keychain errors and fallback to file storage
  }

  return null;
};

const readLoopSnapshotFromFile = async (): Promise<unknown | null> => {
  try {
    const userDataPath = await ipcRenderer.invoke('app:get-user-data-path').catch(() => process.cwd());
    const basePath = typeof userDataPath === 'string' && userDataPath.length > 0 ? userDataPath : process.cwd();
    const filePath = safePathJoin(basePath, '.auth_snapshot.json');

    if (!filePath || !fs.existsSync(filePath)) {
      return null;
    }

    const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });
    return JSON.parse(raw);
  } catch (error) {
    // ignore file system errors
  }

  return null;
};

// ============================================================
// Loop Snapshot API (Extended)
// ============================================================

interface LoopSnapshotAPI {
  getAsync: () => Promise<unknown | null>;
  save: (payload: Record<string, unknown>) => Promise<boolean>;
  delete: () => Promise<boolean>;
}

interface ElectronAPIWithSnapshot extends ElectronAPIExtended {
  loopSnapshot: LoopSnapshotAPI;
}

const electronAPIWithSnapshot = electronAPIExtended as unknown as ElectronAPIWithSnapshot;

electronAPIWithSnapshot.loopSnapshot = {
  getAsync: async () => {
    const keychainSnapshot = await readLoopSnapshotFromKeychain();
    if (keychainSnapshot) {
      return keychainSnapshot;
    }

    const fileSnapshot = await readLoopSnapshotFromFile();
    return fileSnapshot ?? null;
  },
  save: async (payload: Record<string, unknown>) => {
    try {
      const resp = await ipcRenderer.invoke('keychain:set-snapshot', payload);
      return resp && resp.ok;
    } catch (e) {
      return false;
    }
  },
  delete: async () => {
    try {
      const resp = await ipcRenderer.invoke('keychain:delete-snapshot');
      return resp && resp.ok && !!resp.data;
    } catch (e) {
      return false;
    }
  },
};

// ============================================================
// Internal Helpers API (Extended)
// ============================================================

interface ElectronAPIWithInternal extends ElectronAPIWithSnapshot {
  __internal: {
    getResourcesPath: () => string;
  };
  oauth: ElectronAPIWithSnapshot['oauth'] & {
    ensureAuthenticated: () => Promise<unknown>;
  };
}

const electronAPIFinal = electronAPIWithSnapshot as unknown as ElectronAPIWithInternal;

electronAPIFinal.__internal = {
  getResourcesPath: () => {
    try {
      return process.cwd(); // Safe fallback to current working directory
    } catch (e) {
      // ignore
    }
    try {
      const p = process as NodeJS.Process & { resourcesPath?: string };
      if (p && p.resourcesPath) return p.resourcesPath;
    } catch (e) {
      // ignore
    }
    return '';
  },
};

// Attach ensureAuthenticated helper
try {
  electronAPIFinal.oauth.ensureAuthenticated = () => ipcRenderer.invoke('oauth:ensure-authenticated');
} catch (e) {
  // ignore if oauth is not present
}

// ============================================================
// Expose API to Renderer via contextBridge
// ============================================================

contextBridge.exposeInMainWorld('electronAPI', electronAPIFinal);

// 🔥 클립보드 API 추가 - 복사/붙여넣기 활성화
contextBridge.exposeInMainWorld('clipboard', {
  writeText: (text: string) => navigator.clipboard.writeText(text),
  readText: () => navigator.clipboard.readText(),
  copy: (text: string) => {
    // 폴백 메커니즘
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    } else {
      // 구버전 브라우저 지원
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return Promise.resolve();
    }
  }
});

// (Internal helpers now attached above before contextBridge.exposeInMainWorld)

// 🔥 초기 스냅샷: renderer에서 SSR과 동일한 초기값을 읽을 수 있도록 지원
contextBridge.exposeInMainWorld('loopSnapshot', {
  get: () => {
    try {
      const theme = nativeTheme ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light') : 'light';
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const snapshot: { theme: string; online: boolean; platform: string; auth?: unknown } = {
        theme,
        online,
        platform: process.platform
      };
      try {
        // Prefer userData location (production fallback) then fallback to project root (dev)
        let snapPath = safePathJoin(process.cwd(), '.auth_snapshot.json');
        // Note: In preload context, we cannot directly access app.getPath()
        // This should be handled via IPC if userData path is needed
        // For now, using safe fallback to current working directory

        if (snapPath && fs.existsSync(snapPath)) {
          const raw = fs.readFileSync(snapPath, { encoding: 'utf-8' });
          interface AuthData {
            isAuthenticated?: boolean;
            userEmail?: string;
            userName?: string;
            userPicture?: string;
          }

          let auth: AuthData | null = null;
          try {
            // If encrypted (base64), attempt to decrypt using env key
            const encKey = process.env.ENCRYPT_SNAPSHOT_KEY;
            if (encKey && /^[A-Za-z0-9+/=]+$/.test(raw)) {
              try {
                const b = Buffer.from(raw, 'base64');
                const iv = b.slice(0, 12);
                const tag = b.slice(12, 28);
                const encrypted = b.slice(28);
                const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encKey, 'hex'), iv);
                decipher.setAuthTag(tag);
                const dec = Buffer.concat([decipher.update(encrypted), decipher.final()]);
                auth = JSON.parse(dec.toString('utf-8')) as AuthData;
              } catch (e) {
                // fallback to plaintext parse
                try { auth = JSON.parse(raw) as AuthData; } catch (e2) { auth = null; }
              }
            } else {
              auth = JSON.parse(raw) as AuthData;
            }
          } catch (e) {
            auth = null;
          }
          // Only include non-sensitive fields
          if (auth) {
            snapshot.auth = {
              isAuthenticated: !!auth.isAuthenticated,
              userEmail: auth.userEmail || null,
              userName: auth.userName || null,
              userPicture: auth.userPicture || null,
            };
          }
        }
      } catch (e) {
        // ignore
      }

      return snapshot;
    } catch (e) {
      return { theme: 'light', online: true, platform: process.platform };
    }
  }
});

// 🔥 렌더러 프로세스 예외를 메인 프로세스로 전달 (디버깅 강화)
window.addEventListener('unhandledrejection', event => {
  ipcRenderer.send('renderer:unhandledRejection', event.reason.stack || event.reason);
});

window.addEventListener('error', event => {
  ipcRenderer.send('renderer:error', event.message, event.filename, event.lineno, event.colno, event.error ? (event.error.stack || event.error) : 'No stack');
});

// (OAuth.ensureAuthenticated now attached above before contextBridge.exposeInMainWorld)
