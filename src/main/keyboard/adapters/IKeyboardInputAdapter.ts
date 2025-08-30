// 🔥 기가차드 키보드 입력 어댑터 인터페이스 - OS별 최적화를 위한 추상화

import { EventEmitter } from 'events';

/**
 * 🔥 키 입력 데이터 인터페이스
 */
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

/**
 * 🔥 어댑터 상태 정보
 */
export interface AdapterStatus {
  /** 어댑터가 활성 상태인지 */
  isActive: boolean;
  
  /** 권한 상태 */
  hasPermissions: boolean;
  
  /** 지원하는 플랫폼 */
  platform: string;
  
  /** 어댑터 타입 */
  adapterType: string;
  
  /** 시작 시각 */
  startedAt?: Date;
  
  /** 마지막 입력 시각 */
  lastInputAt?: Date;
  
  /** 처리한 키 입력 수 */
  processedInputs: number;
}

/**
 * 🔥 키보드 입력 어댑터 인터페이스
 * OS별 키보드 입력 처리를 추상화
 */
export interface IKeyboardInputAdapter extends EventEmitter {
  /**
   * 키보드 모니터링 시작
   */
  startListening(): Promise<void>;
  
  /**
   * 키보드 모니터링 중지
   */
  stopListening(): Promise<void>;
  
  /**
   * 시스템 권한 요청
   */
  requestPermissions(): Promise<boolean>;
  
  /**
   * 현재 권한 상태 확인
   */
  checkPermissions(): Promise<boolean>;
  
  /**
   * 어댑터 상태 정보 반환
   */
  getStatus(): AdapterStatus;
  
  /**
   * 어댑터 정리 (메모리 해제 등)
   */
  cleanup(): Promise<void>;
  
  /**
   * 헬스 체크
   */
  healthCheck(): Promise<{ healthy: boolean; uptime?: number; lastError?: string }>;
  
  // 🔥 이벤트 타입 정의
  on(event: 'input', callback: (data: KeyInputData) => void): this;
  on(event: 'error', callback: (error: Error) => void): this;
  on(event: 'permissionChanged', callback: (hasPermission: boolean) => void): this;
  on(event: 'statusChanged', callback: (status: AdapterStatus) => void): this;
  
  emit(event: 'input', data: KeyInputData): boolean;
  emit(event: 'error', error: Error): boolean;
  emit(event: 'permissionChanged', hasPermission: boolean): boolean;
  emit(event: 'statusChanged', status: AdapterStatus): boolean;
}

/**
 * 🔥 어댑터 설정 옵션
 */
export interface AdapterOptions {
  /** 키 입력 버퍼링 활성화 */
  enableBuffering?: boolean;
  
  /** 버퍼 크기 (기본: 100) */
  bufferSize?: number;
  
  /** 입력 지연 시간 (ms, 기본: 0) */
  inputDelay?: number;
  
  /** 디버그 모드 활성화 */
  debugMode?: boolean;
  
  /** 언어 감지 활성화 */
  enableLanguageDetection?: boolean;
  
  /** 윈도우 추적 활성화 */
  enableWindowTracking?: boolean;
}
