// 🔥 기가차드 UI 설정 섹션 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Palette } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import type { SettingsData, UpdateSettingFunction } from '../../types';

/**
 * 🔥 UI 설정 섹션 Props
 */
interface UISettingsSectionProps {
  settings: SettingsData['ui'];
  updateSetting: UpdateSettingFunction;
}

/**
 * 🔥 UI 설정 섹션 컴포넌트
 */
export const UISettingsSection = React.memo<UISettingsSectionProps>(({
  settings,
  updateSetting
}) => {
  // 🔥 창 너비 변경 핸들러
  const handleWindowWidthChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(event.target.value, 10);
    if (width >= 800 && width <= 2560) {
      updateSetting('ui', 'windowWidth', width);
    }
  }, [updateSetting]);

  // 🔥 창 높이 변경 핸들러
  const handleWindowHeightChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const height = parseInt(event.target.value, 10);
    if (height >= 600 && height <= 1440) {
      updateSetting('ui', 'windowHeight', height);
    }
  }, [updateSetting]);

  // 🔥 토글 핸들러들
  const handleSidebarCollapsedToggle = useCallback((checked: boolean) => {
    updateSetting('ui', 'sidebarCollapsed', checked);
  }, [updateSetting]);

  const handleShowLineNumbersToggle = useCallback((checked: boolean) => {
    updateSetting('ui', 'showLineNumbers', checked);
  }, [updateSetting]);

  const handleShowWordCountToggle = useCallback((checked: boolean) => {
    updateSetting('ui', 'showWordCount', checked);
  }, [updateSetting]);

  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
        <Palette className={SETTINGS_PAGE_STYLES.sectionIcon} />
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>UI/UX 설정</h2>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingItem}>
        <SettingItem
          title="창 너비"
          description="앱 창의 기본 너비를 설정하세요 (800-2560px)"
          control={
            <input
              type="number"
              min="800"
              max="2560"
              step="50"
              value={settings.windowWidth}
              onChange={handleWindowWidthChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />

        <SettingItem
          title="창 높이"
          description="앱 창의 기본 높이를 설정하세요 (600-1440px)"
          control={
            <input
              type="number"
              min="600"
              max="1440"
              step="50"
              value={settings.windowHeight}
              onChange={handleWindowHeightChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />

        <SettingItem
          title="사이드바 접기"
          description="앱 시작 시 사이드바를 접힌 상태로 표시합니다"
          control={
            <Toggle
              checked={settings.sidebarCollapsed}
              onChange={handleSidebarCollapsedToggle}
            />
          }
        />

        <SettingItem
          title="줄 번호 표시"
          description="에디터에서 줄 번호를 표시합니다"
          control={
            <Toggle
              checked={settings.showLineNumbers}
              onChange={handleShowLineNumbersToggle}
            />
          }
        />

        <SettingItem
          title="단어 수 표시"
          description="상태바에 단어 수를 표시합니다"
          control={
            <Toggle
              checked={settings.showWordCount}
              onChange={handleShowWordCountToggle}
            />
          }
        />
      </div>
    </div>
  );
});

UISettingsSection.displayName = 'UISettingsSection';
