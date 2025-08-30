'use client';

import React, { createContext, useContext, useState, useCallback, useLayoutEffect, useMemo } from 'react';
import { Logger } from '../../shared/logger';

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface MonitoringState {
  isMonitoring: boolean;
  isAIOpen: boolean;
  startTime: Date | null;
  sessionData: {
    wpm: number;
    words: number;
    time: number;
  };
}

export interface MonitoringContextType {
  state: MonitoringState;
  startMonitoring: () => Promise<void>;
  stopMonitoring: () => Promise<void>;
  toggleAI: () => void;
  updateSessionData: (data: Partial<MonitoringState['sessionData']>) => void;
}

// 🔥 컨텍스트 생성
export const MonitoringContext = createContext<MonitoringContextType | undefined>(undefined);

// 🔥 초기 상태 상수화 (메모리 최적화)
const INITIAL_STATE: MonitoringState = {
  isMonitoring: false,
  isAIOpen: false,
  startTime: null,
  sessionData: {
    wpm: 0,
    words: 0,
    time: 0,
  },
} as const;

// 🔥 프로바이더 컴포넌트
export function MonitoringProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  // 🔥 하이드레이션 불일치 완전 해결: 서버와 클라이언트 동일한 초기값
  const [state, setState] = useState<MonitoringState>(INITIAL_STATE);

  // 🔥 클라이언트 마운트 후 localStorage에서 상태 복원 (모니터링은 항상 false로 시작)
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedState = localStorage.getItem('monitoring-state');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          setState(prev => ({
            ...prev,
            // 🔥 모니터링은 항상 false로 시작 (사용자 수동 시작 원칙)
            isMonitoring: false, 
            isAIOpen: parsed.isAIOpen || false,
            startTime: null, // 시작 시간도 초기화
            sessionData: {
              ...prev.sessionData,
              ...parsed.sessionData,
            },
          }));
          Logger.debug('MONITORING_CONTEXT', 'State restored from localStorage (monitoring disabled)', { ...parsed, isMonitoring: false });
        }
      } catch (error) {
        Logger.error('MONITORING_CONTEXT', 'Failed to load state from localStorage', error);
      }
    }
  }, []);

  // 🔥 상태 변경 시 localStorage에 저장 (즉시 실행) - 디바운스 적용
  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const timeoutId = setTimeout(() => {
        try {
          localStorage.setItem('monitoring-state', JSON.stringify(state));
          Logger.debug('MONITORING_CONTEXT', 'State saved to localStorage', state);
        } catch (error) {
          Logger.error('MONITORING_CONTEXT', 'Failed to save state to localStorage', error);
        }
      }, 100); // 100ms 디바운스

      return () => clearTimeout(timeoutId);
    }
  }, [state]);

  const startMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTEXT', '🚀 모니터링 시작 요청');
      
      // 🔥 버튼 깜빡임 방지: 즉시 상태 업데이트 (낙관적 업데이트)
      setState(prev => ({
        ...prev,
        isMonitoring: true,
        startTime: new Date(),
      }));
      
      // 🔥 백엔드 요청
      const result = await window.electronAPI.keyboard.startMonitoring();
      if (!result.success) {
        // 🔥 실패 시 상태 롤백
        setState(prev => ({
          ...prev,
          isMonitoring: false,
          startTime: null,
        }));
        
        // 🔥 권한 관련 에러인지 확인
        const isPermissionError = result.error && (
          result.error.includes('권한') || 
          result.error.includes('permission') ||
          result.error.includes('accessibility')
        );
        
        if (isPermissionError) {
          Logger.warn('MONITORING_CONTEXT', '⚠️ 권한 필요:', result.error);
          // TODO: 권한 요청 모달 표시
          alert(`접근성 권한이 필요합니다.\n\n시스템 설정 → 보안 및 개인정보보호 → 개인정보보호 → 접근성\n에서 Loop 앱을 허용해주세요.`);
        } else {
          Logger.error('MONITORING_CONTEXT', '❌ 모니터링 시작 실패:', result.error);
        }
        
        throw new Error(result.error || 'Failed to start monitoring');
      }
      
      Logger.info('MONITORING_CONTEXT', '✅ 모니터링 시작 성공!');
    } catch (error) {
      Logger.error('MONITORING_CONTEXT', 'Error starting monitoring', error);
      
      // 🔥 에러 시 상태 롤백 확실히 실행
      setState(prev => ({
        ...prev,
        isMonitoring: false,
        startTime: null,
      }));
      
      throw error;
    }
  }, []);

  const stopMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTEXT', 'Stopping monitoring');
      
      // 🔥 버튼 깜빡임 방지: 즉시 상태 업데이트
      setState(prev => ({
        ...prev,
        isMonitoring: false,
        startTime: null,
      }));
      
      const result = await window.electronAPI.keyboard.stopMonitoring();
      if (!result.success) {
        // 실패 시 상태 롤백
        setState(prev => ({
          ...prev,
          isMonitoring: true,
          startTime: new Date(),
        }));
        Logger.error('MONITORING_CONTEXT', 'Failed to stop monitoring', result.error);
        throw new Error(result.error || 'Failed to stop monitoring');
      }
      
      Logger.info('MONITORING_CONTEXT', 'Monitoring stopped successfully');
    } catch (error) {
      // 에러 시 상태 롤백 (모니터링 재개)
      setState(prev => ({
        ...prev,
        isMonitoring: true,
        startTime: new Date(),
      }));
      Logger.error('MONITORING_CONTEXT', 'Error stopping monitoring', error);
      throw error;
    }
  }, []);

  const toggleAI = useCallback((): void => {
    setState(prev => ({
      ...prev,
      isAIOpen: !prev.isAIOpen,
    }));
    Logger.info('MONITORING_CONTEXT', 'AI Panel toggled');
  }, []);

  const updateSessionData = useCallback((data: Partial<MonitoringState['sessionData']>): void => {
    setState(prev => ({
      ...prev,
      sessionData: {
        ...prev.sessionData,
        ...data,
      },
    }));
  }, []);

  // 🔥 컨텍스트 값 메모화 (성능 최적화)
  const contextValue = useMemo<MonitoringContextType>(() => ({
    state,
    startMonitoring,
    stopMonitoring,
    toggleAI,
    updateSessionData,
  }), [state, startMonitoring, stopMonitoring, toggleAI, updateSessionData]);

  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
}

// 🔥 커스텀 훅
export function useMonitoring(): MonitoringContextType {
  const context = useContext(MonitoringContext);
  if (context === undefined) {
    throw new Error('useMonitoring must be used within a MonitoringProvider');
  }
  return context;
}
