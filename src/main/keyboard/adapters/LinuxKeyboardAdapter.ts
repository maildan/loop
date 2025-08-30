// 🔥 기가차드 Linux 키보드 어댑터 - X11/IBus 기반 감지

import { EventEmitter } from 'events';
import { Logger } from '../../../shared/logger';
import type { IKeyboardInputAdapter, KeyInputData, AdapterStatus, AdapterOptions } from './IKeyboardInputAdapter';

/**
 * 🔥 Linux 전용 키보드 어댑터
 * 
 * X11/Wayland와 IBus/XIM을 활용한 네이티브 키보드 감지
 * - XGrabKey 기반 시스템 레벨 키 감지
 * - IBus 입력 메서드 처리
 * - 다양한 Linux 배포판 지원
 */
export class LinuxKeyboardAdapter extends EventEmitter implements IKeyboardInputAdapter {
  private readonly componentName = 'LINUX_KEYBOARD_ADAPTER';
  private isListening = false;
  private xConnection: unknown = null; // X11 연결
  private options: AdapterOptions;

  constructor(options: AdapterOptions = {}) {
    super();
    this.options = {
      enableBuffering: true,
      bufferSize: 100,
      enableLanguageDetection: true,
      enableWindowTracking: true,
      inputDelay: 0,
      debugMode: false,
      ...options
    };
    Logger.info(this.componentName, 'Linux 키보드 어댑터 초기화', { options: this.options });
  }

  /**
   * 🔥 키보드 감지 시작
   */
  public async startListening(): Promise<void> {
    if (this.isListening) {
      Logger.warn(this.componentName, '이미 감지 중입니다');
      return;
    }

    try {
      // TODO: Linux 네이티브 모듈 구현 필요
      Logger.info(this.componentName, 'Linux 네이티브 키보드 감지 시작 (구현 예정)');
      
      this.isListening = true;
      this.emit('started');
      
    } catch (error) {
      Logger.error(this.componentName, 'Linux 키보드 감지 시작 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 키보드 감지 중지
   */
  public async stopListening(): Promise<void> {
    if (!this.isListening) {
      return;
    }

    try {
      if (this.xConnection) {
        // TODO: X11 연결 해제
        this.xConnection = null;
      }

      this.isListening = false;
      this.emit('stopped');
      
      Logger.info(this.componentName, 'Linux 키보드 감지 중지');
    } catch (error) {
      Logger.error(this.componentName, 'Linux 키보드 감지 중지 실패', error);
      throw error;
    }
  }

  /**
   * 🔥 권한 요청 (Linux는 사용자별로 다름)
   */
  public async requestPermissions(): Promise<boolean> {
    try {
      Logger.warn(this.componentName, 'Linux 권한 요청 구현 예정');
      return true; // 임시
    } catch (error) {
      Logger.error(this.componentName, 'Linux 권한 요청 실패', error);
      return false;
    }
  }

  /**
   * 🔥 권한 확인 (Linux는 사용자별로 다름)
   */
  public async checkPermissions(): Promise<boolean> {
    try {
      Logger.warn(this.componentName, 'Linux 권한 확인 구현 예정');
      return true; // 임시
    } catch (error) {
      Logger.error(this.componentName, 'Linux 권한 확인 실패', error);
      return false;
    }
  }

  /**
   * 🔥 상태 확인
   */
  public getStatus(): AdapterStatus {
    return {
      isActive: this.isListening,
      hasPermissions: true,
      platform: 'linux',
      adapterType: 'linux',
      startedAt: undefined,
      lastInputAt: undefined,
      processedInputs: 0
    };
  }

  /**
   * 🔥 헬스체크
   */
  public async healthCheck(): Promise<{ healthy: boolean; uptime?: number; lastError?: string }> {
    return {
      healthy: true,
      uptime: process.uptime() * 1000
    };
  }

  /**
   * 🔥 정리
   */
  public async cleanup(): Promise<void> {
    await this.stopListening();
    this.removeAllListeners();
    Logger.info(this.componentName, 'Linux 키보드 어댑터 정리 완료');
  }

  /**
   * 🔥 네이티브 이벤트 처리 (미래 구현용)
   */
  private handleLinuxEvent(eventData: unknown): void {
    try {
      // TODO: Linux 이벤트 데이터 파싱 및 KeyInputData 변환
      const inputData: KeyInputData = {
        character: 'temp',
        timestamp: Date.now(),
        language: 'en',
        windowInfo: {
          title: 'Unknown',
          bundleId: 'unknown',
          processName: 'Unknown'
        },
        inputMethod: 'direct'
      };

      this.emit('input', inputData);
    } catch (error) {
      Logger.error(this.componentName, 'Linux 이벤트 처리 실패', error);
      this.emit('error', error);
    }
  }
}

export default LinuxKeyboardAdapter;
