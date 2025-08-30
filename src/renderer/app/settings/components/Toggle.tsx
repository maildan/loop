'use client';

import React from 'react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';
import type { ToggleProps } from '../types';

// 🔥 기가차드 Toggle 컴포넌트 - 완전 메모이제이션!

/**
 * 🔥 최적화된 Toggle 컴포넌트
 * - React.memo로 불필요한 리렌더링 방지
 * - useCallback으로 이벤트 핸들러 메모이제이션
 * - 접근성 지원 (ARIA 라벨)
 * - 키보드 네비게이션 지원
 */
export const Toggle = React.memo<ToggleProps>(({ checked, onChange, disabled = false }) => {
  const handleClick = React.useCallback(() => {
    if (!disabled) {
      onChange(!checked);
    }
  }, [checked, onChange, disabled]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent) => {
    if ((event.key === ' ' || event.key === 'Enter') && !disabled) {
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
      } ${disabled ? SETTINGS_PAGE_STYLES.toggleDisabled : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <span
        className={`${SETTINGS_PAGE_STYLES.toggleSwitch} ${
          checked ? SETTINGS_PAGE_STYLES.toggleSwitchActive : SETTINGS_PAGE_STYLES.toggleSwitchInactive
        }`}
        aria-hidden="true"
      />
      <span className={SETTINGS_PAGE_STYLES.srOnly}>
        {checked ? '켜짐' : '꺼짐'}
      </span>
    </button>
  );
});

Toggle.displayName = 'Toggle';
