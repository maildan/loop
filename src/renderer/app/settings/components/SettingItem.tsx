'use client';

import React from 'react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';
import type { SettingItemProps } from '../types';

// 🔥 기가차드 SettingItem 컴포넌트 - 설정 항목 공통 컴포넌트!

/**
 * 🔥 최적화된 SettingItem 컴포넌트
 * - 모든 설정 항목의 레이아웃 통일
 * - React.memo로 성능 최적화
 * - 반응형 레이아웃 지원
 * - 접근성 지원
 */
export const SettingItem = React.memo<SettingItemProps>(({ title, description, control }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.settingRow}>
      <div className={SETTINGS_PAGE_STYLES.settingLabel}>
        <div className={SETTINGS_PAGE_STYLES.settingTitle}>
          {title}
        </div>
        <div className={SETTINGS_PAGE_STYLES.settingDescription}>
          {description}
        </div>
      </div>
      <div className={SETTINGS_PAGE_STYLES.settingControl}>
        {control}
      </div>
    </div>
  );
});

SettingItem.displayName = 'SettingItem';
