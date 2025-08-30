// 🔥 기가차드 active-win 타입 정의 - Loop 전용 확장
declare module 'active-win' {
  // 🔥 기가차드 윈도우 정보 인터페이스
  export interface WindowInfo {
    id: number;
    title: string;
    owner: {
      name: string;
      processId: number;
      bundleId?: string;
      path?: string;
    };
    bounds: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    memoryUsage: number;
    
    // 🔥 Loop 전용 확장 필드
    loopTimestamp?: number;
    loopAppCategory?: 'ai-assistant' | 'browser' | 'cloud-storage' | 'communication' | 'design' | 'development' | 'e-commerce' | 'entertainment' | 'file-management' | 'finance' | 'marketing' | 'media-production' | 'office' | 'productivity' | 'project-management' | 'security' | 'system' | 'unknown';
    loopSessionId?: string;
    loopTypingStats?: {
      wpm: number;
      accuracy: number;
      keystrokeCount: number;
      sessionDuration: number;
    };
  }

  // 🔥 기가차드 get-windows 옵션
  export interface GetWindowsOptions {
    screenRecordingPermission?: boolean;
    accessibilityPermission?: boolean;
    // Loop 전용 옵션
    includeInvisible?: boolean;
    filterByCategory?: string[];
    includeMemoryUsage?: boolean;
  }

  // 🔥 메인 API 함수들
  export default function getWindows(options?: GetWindowsOptions): Promise<WindowInfo[]>;
  export function getActiveWindow(options?: GetWindowsOptions): Promise<WindowInfo | undefined>;
  
  // 🔥 Loop 전용 유틸리티 함수들
  export interface WindowTracker {
    onWindowChange(callback: (current: WindowInfo, previous?: WindowInfo) => void): void;
    startTracking(): void;
    stopTracking(): void;
    getCurrentWindow(): WindowInfo | null;
    getWindowHistory(): WindowInfo[];
  }
  
  export function createWindowTracker(): WindowTracker;
}

export {};
