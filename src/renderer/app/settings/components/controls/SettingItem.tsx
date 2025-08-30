// 🔥 기가차드 SettingItem 공통 컴포넌트 - 최적화
'use client';

import React from 'react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';

/**
 * 🔥 설정 항목 Props
 */
interface SettingItemProps {
  title: string;
  description: string;
  control: React.ReactNode;
}

/**
 * 🔥 메모이제이션된 설정 항목 컴포넌트
 */
export const SettingItem = React.memo<SettingItemProps>(({ title, description, control }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.settingRow}>
      <div className={SETTINGS_PAGE_STYLES.settingLabel}>
        <div className={SETTINGS_PAGE_STYLES.settingTitle}>{title}</div>
        <div className={SETTINGS_PAGE_STYLES.settingDescription}>{description}</div>
      </div>
      <div className={SETTINGS_PAGE_STYLES.settingControl}>
        {control}
      </div>
    </div>
  );
});

SettingItem.displayName = 'SettingItem';
