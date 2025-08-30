// 🔥 기가차드 Toggle 컴포넌트 - 완전 최적화
'use client';

import React, { useCallback } from 'react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import type { ToggleProps } from '../../types';

/**
 * 🔥 메모이제이션된 Toggle 컴포넌트
 */
export const Toggle = React.memo<ToggleProps>(({ checked, onChange, disabled = false }) => {
  // 🔥 이벤트 핸들러 메모이제이션
  const handleToggle = useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, onChange, disabled]);

  // 🔥 키보드 이벤트 핸들러
  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
      event.preventDefault();
      onChange(!checked);
    }
  }, [checked, onChange, disabled]);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      className={`${SETTINGS_PAGE_STYLES.toggle} ${
        checked ? SETTINGS_PAGE_STYLES.toggleActive : SETTINGS_PAGE_STYLES.toggleInactive
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
    >
      <span
        className={`${SETTINGS_PAGE_STYLES.toggleSwitch} ${
          checked ? SETTINGS_PAGE_STYLES.toggleSwitchActive : SETTINGS_PAGE_STYLES.toggleSwitchInactive
        }`}
      />
    </button>
  );
});

Toggle.displayName = 'Toggle';
