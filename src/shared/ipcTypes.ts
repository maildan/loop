// 🔥 IPC 채널/페이로드 타입 맵 중앙화

export type IPCPayloads = {
  'keyboard:start-monitoring': undefined;
  'keyboard:stop-monitoring': undefined;
  'keyboard:get-status': undefined;
  'keyboard:event': { type: 'keydown' | 'keyup' | 'input'; payload: unknown };

  'projects:get-all': undefined;
  'projects:get-by-id': { id: string };
  'projects:create': { title: string; description: string; genre?: string };
  'projects:update': { id: string; updates: Record<string, unknown> };
  'projects:delete': { id: string };

  'settings:get': { key: string };
  'settings:set': { key: string; value: unknown };
  'settings:reset': undefined;

  'app:get-version': undefined;
  'app:quit': undefined;

  // 🔥 Updater 관련 IPC 채널
  'updater:available': { version: string; releaseDate: string };
  'updater:download-progress': {
    percent: number;
    transferred: number;
    total: number;
    bytesPerSecond: number;
  };
  'updater:downloaded': { version: string; releaseDate: string };
};

export type IPCResponseMap = {
  'keyboard:get-status': { isActive: boolean };
  'projects:get-all': { projects: unknown[] };
  'projects:get-by-id': { project: unknown };
};

export type IPCChannel = keyof IPCPayloads;

// 🔥 폰트 관련 타입 정의
export interface FontData {
  fontFamily: string;
  fileName: string;
  fontWeight: string | number;
  fontStyle: string;
  dataUri: string;
  format: string;
}

export interface FontLoadResult {
  success: boolean;
  fonts: FontData[];
  error?: string;
}


