import { contextBridge, ipcRenderer, nativeTheme } from 'electron';
import * as fs from 'fs';
import * as path from 'path';
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
import type {
  SettingsSchema,
  SettingsResult,
  AppSettingsSchema,
  KeyboardSettingsSchema,
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
    startMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.START_MONITORING),
    stopMonitoring: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.STOP_MONITORING),
    getStatus: () => ipcRenderer.invoke(IPC_CHANNELS.KEYBOARD.GET_STATUS),
    getRealtimeStats: () => ipcRenderer.invoke('keyboard:get-realtime-stats'),
    setLanguage: (language: string) => ipcRenderer.invoke('keyboard:set-language', language),
    forceKorean: () => ipcRenderer.invoke('keyboard:force-korean'),
    testLanguageDetection: (keycode: number, keychar?: number) => ipcRenderer.invoke('keyboard:test-language-detection', keycode, keychar),
    // 🔥 새로운 다국어 지원 메서드들 추가
    detectLanguage: (keycode: number) => ipcRenderer.invoke('keyboard:detect-language', keycode),
    getSupportedLanguages: () => ipcRenderer.invoke('keyboard:get-supported-languages'),
    setInputMethod: (method: 'direct' | 'composition') => ipcRenderer.invoke('keyboard:set-input-method', method),
    resetComposition: () => ipcRenderer.invoke('keyboard:reset-composition'),
    getCompositionState: () => ipcRenderer.invoke('keyboard:get-composition-state'),
  },

  dashboard: {
    getStats: () => ipcRenderer.invoke('dashboard:get-stats'),
    getRecentSessions: () => ipcRenderer.invoke('dashboard:get-recent-sessions'),
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
  },

  notifications: {
    show: (title: string, message: string) => ipcRenderer.invoke('notifications:show', title, message),
    showTypingGoal: (progress: number) => ipcRenderer.invoke('notifications:show-typing-goal', progress),
  },

  theme: {
    get: () => ipcRenderer.invoke('theme:get'),
    set: (theme: 'light' | 'dark' | 'system') => ipcRenderer.invoke('theme:set', theme),
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
    getStaticFonts: () => ipcRenderer.invoke('font:get-static-fonts'),
  },


};

// Attach settings.onDidChange in a type-safe-ignored way
(electronAPI as any).settings.onDidChange = (listener: (payload: { keyPath: string; value: unknown; reset?: boolean }) => void) => {
  const wrapped = (_event: any, data: any) => listener(data);
  ipcRenderer.on('settings:changed', wrapped);
  return () => ipcRenderer.removeListener('settings:changed', wrapped);
};

// Attach files API for reading local files as data URLs
(electronAPI as any).files = {
  readFileAsDataUrl: (filePath: string) => ipcRenderer.invoke('settings:read-file', filePath),
};

// attach files helper
(electronAPI as any).files = {
  readFileAsDataUrl: (filePath: string) => ipcRenderer.invoke('settings:read-file', filePath),
};

// Attach async loopSnapshot API dynamically to avoid typing issues
; (electronAPI as any).loopSnapshot = {
  getAsync: async () => {
    try {
      // Delegate to main process keychain handler first
      const resp = await ipcRenderer.invoke('keychain:get-snapshot');
      if (resp && resp.ok && resp.data) return resp.data;
    } catch (e) {
      // ignore keychain errors and fallback to file
    }

    // fallback to file (userData then cwd)
    try {
      const { app } = require('electron');
      const userDataPath = app && typeof app.getPath === 'function' ? app.getPath('userData') : process.cwd();
      const filePath = path.join(userDataPath, '.auth_snapshot.json');
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, { encoding: 'utf-8' });
        return JSON.parse(raw);
      }
    } catch (e) {
      // ignore
    }

    return null;
  }
};

// Provide ability to save/delete snapshot via main process keychain handlers
; (electronAPI as any).loopSnapshot.save = async (payload: any) => {
  try {
    const resp = await ipcRenderer.invoke('keychain:set-snapshot', payload);
    return resp && resp.ok;
  } catch (e) {
    return false;
  }
};

; (electronAPI as any).loopSnapshot.delete = async () => {
  try {
    const resp = await ipcRenderer.invoke('keychain:delete-snapshot');
    return resp && resp.ok && !!resp.data;
  } catch (e) {
    return false;
  }
};

// 🔥 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

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

// attach internal helpers without changing the public ElectronAPI type
try {
  (electronAPI as any).__internal = {
    getResourcesPath: () => {
      try {
        const { app } = require('electron');
        if (app && typeof app.getAppPath === 'function' && app.getAppPath()) {
          return app.getAppPath();
        }
      } catch (e) {
        // ignore
      }
      try {
        const p: any = process;
        if (p && p.resourcesPath) return p.resourcesPath;
      } catch (e) {
        // ignore
      }
      return '';
    }
  };
} catch (e) {
  // ignore
}

// 🔥 초기 스냅샷: renderer에서 SSR과 동일한 초기값을 읽을 수 있도록 지원
contextBridge.exposeInMainWorld('loopSnapshot', {
  get: () => {
    try {
      const theme = nativeTheme ? (nativeTheme.shouldUseDarkColors ? 'dark' : 'light') : 'light';
      const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
      const snapshot: any = { theme, online, platform: process.platform };
      try {
        // Prefer userData location (production fallback) then fallback to project root (dev)
        let snapPath = path.join(process.cwd(), '.auth_snapshot.json');
        try {
          const { app } = require('electron');
          if (app && typeof app.getPath === 'function') {
            const userDataPath = app.getPath('userData');
            snapPath = path.join(userDataPath, '.auth_snapshot.json');
          }
        } catch (e) {
          // ignore - keep process.cwd() path
        }

        if (fs.existsSync(snapPath)) {
          const raw = fs.readFileSync(snapPath, { encoding: 'utf-8' });
          let auth: any = null;
          try {
            // If encrypted (base64), attempt to decrypt using env key
            const encKey = process.env.ENCRYPT_SNAPSHOT_KEY;
            if (encKey && /^[A-Za-z0-9+/=]+$/.test(raw)) {
              try {
                const b = Buffer.from(raw, 'base64');
                const iv = b.slice(0, 12);
                const tag = b.slice(12, 28);
                const encrypted = b.slice(28);
                const decipher = require('crypto').createDecipheriv('aes-256-gcm', Buffer.from(encKey, 'hex'), iv);
                decipher.setAuthTag(tag);
                const dec = Buffer.concat([decipher.update(encrypted), decipher.final()]);
                auth = JSON.parse(dec.toString('utf-8'));
              } catch (e) {
                // fallback to plaintext parse
                try { auth = JSON.parse(raw); } catch (e2) { auth = null; }
              }
            } else {
              auth = JSON.parse(raw);
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

// Window 글로벌 타입은 shared/types.ts에서 이미 선언됨
// Attach ensureAuthenticated helper dynamically to avoid changing the public ElectronAPI type
try {
  (electronAPI as any).oauth.ensureAuthenticated = () => ipcRenderer.invoke('oauth:ensure-authenticated');
} catch (e) {
  // ignore if oauth is not present
}
