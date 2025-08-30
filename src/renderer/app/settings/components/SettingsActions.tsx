// 🔥 기가차드 설정 액션 버튼 컴포넌트 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Save, RotateCcw } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';

/**
 * 🔥 액션 버튼 Props
 */
interface SettingsActionsProps {
  saving: boolean;
  onSave: () => Promise<void>;
  onReset: () => Promise<void>;
}

/**
 * 🔥 설정 액션 버튼 컴포넌트
 */
export const SettingsActions = React.memo<SettingsActionsProps>(({ 
  saving, 
  onSave, 
  onReset 
}) => {
  // 🔥 저장 핸들러
  const handleSave = useCallback(async () => {
    try {
      await onSave();
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [onSave]);

  // 🔥 리셋 핸들러 (확인 다이얼로그 포함)
  const handleReset = useCallback(async () => {
    const confirmed = window.confirm(
      '모든 설정을 기본값으로 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.'
    );
    
    if (confirmed) {
      try {
        await onReset();
      } catch (error) {
        console.error('Failed to reset settings:', error);
      }
    }
  }, [onReset]);

  return (
    <div className={SETTINGS_PAGE_STYLES.actions}>
      <button
        type="button"
        className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.secondaryButton}`}
        onClick={handleReset}
        disabled={saving}
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        기본값으로 복원
      </button>
      
      <button
        type="button"
        className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.primaryButton}`}
        onClick={handleSave}
        disabled={saving}
      >
        <Save className="w-4 h-4 mr-2" />
        {saving ? '저장 중...' : '모든 설정 저장'}
      </button>
    </div>
  );
});

SettingsActions.displayName = 'SettingsActions';
