'use client';

import { useCallback, useRef, useEffect } from 'react';
import { Logger } from '../../../../shared/logger';

interface UseAutoSaveOptions {
  projectId: string;
  delay?: number; // 기본값: 3.5초 (노션 스타일)
  onSave: () => Promise<void>;
  onSaveSuccess?: () => void;
  onSaveError?: (error: Error) => void;
}

/**
 * 🔥 노션 스타일 자동 저장 Hook - 타이핑 중단 후 저장
 * 
 * 특징:
 * - 사용자가 타이핑을 멈춘 후에만 저장 (노션 방식)
 * - 타이핑 중에는 절대 저장하지 않음
 * - 3.5초 딜레이로 여유로운 사용자 경험 제공
 * - 에러 처리 및 재시도 로직
 * - 저장 상태 추적
 */
export function useAutoSave({
  projectId,
  delay = 5000, // 🔥 5초로 증가 (글 삭제 방지 - 기가차드 수정)
  onSave,
  onSaveSuccess,
  onSaveError
}: UseAutoSaveOptions) {
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const retryCountRef = useRef(0);
  const lastTypingTimeRef = useRef<number>(0); // 🔥 마지막 타이핑 시간 추적
  const maxRetries = 3;

  // 🔥 노션 스타일 Debounced 저장 (타이핑 중단 후에만)
  const debouncedSave = useCallback(() => {
    // 🔥 타이핑 시간 업데이트
    lastTypingTimeRef.current = Date.now();
    
    // 기존 타이머 취소
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    // 새 타이머 설정 - 사용자가 타이핑을 멈춘 후에만 실행
    saveTimerRef.current = setTimeout(async () => {
      const timeSinceLastTyping = Date.now() - lastTypingTimeRef.current;
      
      // 🔥 핵심: 마지막 타이핑 후 충분한 시간이 지났는지 확인
      if (timeSinceLastTyping < delay * 0.9) { // 딜레이의 90% 이상 대기
        Logger.debug('AUTO_SAVE', 'Still typing, postponing save', { 
          projectId, 
          timeSinceLastTyping,
          requiredDelay: delay 
        });
        // 다시 스케줄링
        debouncedSave();
        return;
      }
      
      if (isLoadingRef.current) {
        Logger.debug('AUTO_SAVE', 'Save already in progress, skipping', { projectId });
        return;
      }

      try {
        isLoadingRef.current = true;
        const startTime = Date.now();
        
        Logger.debug('AUTO_SAVE', '💾 Starting auto-save (typing stopped)', { 
          projectId,
          timeSinceLastTyping 
        });
        
        await onSave();
        retryCountRef.current = 0; // 성공 시 재시도 카운터 리셋
        
        const duration = Date.now() - startTime;
        Logger.info('AUTO_SAVE', '✅ Auto-save completed', { 
          projectId, 
          duration: `${duration}ms`,
          timeSinceLastTyping
        });
        
        onSaveSuccess?.();
      } catch (error) {
        const errorObj = error instanceof Error ? error : new Error(String(error));
        Logger.error('AUTO_SAVE', '❌ Auto-save failed', errorObj);
        
        // 재시도 로직
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          Logger.warn('AUTO_SAVE', `Retrying save (${retryCountRef.current}/${maxRetries})`, { projectId });
          
          // 재시도 딜레이 (2초, 4초, 8초로 점진적 증가)
          setTimeout(() => {
            debouncedSave();
          }, Math.pow(2, retryCountRef.current) * 1000);
        } else {
          Logger.error('AUTO_SAVE', 'Max retries exceeded', { projectId });
          onSaveError?.(errorObj);
        }
      } finally {
        isLoadingRef.current = false;
        saveTimerRef.current = null;
      }
    }, delay);
  }, [projectId, delay, onSave, onSaveSuccess, onSaveError]);

  // 🔥 즉시 저장 (Ctrl+S용)
  const forceSave = useCallback(async () => {
    // 기존 debounced 저장 취소
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }

    if (isLoadingRef.current) {
      Logger.debug('AUTO_SAVE', 'Save already in progress, cannot force save', { projectId });
      return;
    }

    try {
      isLoadingRef.current = true;
      const startTime = Date.now();
      
      Logger.info('AUTO_SAVE', 'Starting force save', { projectId });
      
      await onSave();
      retryCountRef.current = 0;
      
      const duration = Date.now() - startTime;
      Logger.info('AUTO_SAVE', '✅ Force save completed', { 
        projectId, 
        duration: `${duration}ms` 
      });
      
      onSaveSuccess?.();
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      Logger.error('AUTO_SAVE', '❌ Force save failed', errorObj);
      onSaveError?.(errorObj);
    } finally {
      isLoadingRef.current = false;
    }
  }, [projectId, onSave, onSaveSuccess, onSaveError]);

  // 🔥 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  return {
    debouncedSave,
    forceSave,
    isLoading: isLoadingRef.current,
  };
}
