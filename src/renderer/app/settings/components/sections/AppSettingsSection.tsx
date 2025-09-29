// 🔥 기가차드 앱 설정 섹션 - 최적화
// 'use client' 제거됨 - React에서 불필요

import React, { useCallback, useEffect, useState } from 'react';
import { Settings } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import { useTheme } from '../../../../providers/ThemeProvider';
import type { Theme } from '../../../../../shared/types/theme';
import { useDynamicFont } from '../../../../hooks/useDynamicFont';
import { Logger } from '../../../../../shared/logger';
import GoogleAccountActions from '../GoogleAccountActions';
import type { SettingsData, UpdateSettingFunction } from '../../types';
import { THEME_OPTIONS } from '../../constants/settings';

/**
 * 🔥 앱 설정 섹션 Props
 */
interface AppSettingsSectionProps {
  settings: SettingsData['app'];
  updateSetting: UpdateSettingFunction;
  setTheme: (theme: Theme) => Promise<void>;
}

/**
 * 🔥 앱 설정 섹션 컴포넌트
 */
export const AppSettingsSection = React.memo<AppSettingsSectionProps>(({
  settings,
  updateSetting,
  setTheme
}) => {
  const { theme: currentTheme } = useTheme();
  const { availableFonts, loading: fontsLoading, error: fontsError, setFont } = useDynamicFont();

  // 🔥 로컬 테마 상태 (설정 UI 표시용)
  const [displayTheme, setDisplayTheme] = useState<Theme>(settings.theme);

  // 🔥 설정이 변경되면 로컬 상태 동기화
  useEffect(() => {
    setDisplayTheme(settings.theme);
  }, [settings.theme]);

  // 🔥 ThemeProvider의 테마가 변경되면 동기화
  useEffect(() => {
    if (currentTheme !== displayTheme && currentTheme !== 'system') {
      setDisplayTheme(currentTheme);
    }
  }, [currentTheme, displayTheme]);

  // 🔥 테마 변경 핸들러 (ThemeProvider + 설정 동시 업데이트)
  const handleThemeChange = useCallback(async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = event.target.value as Theme;

    try {
      // 1. 로컬 상태 즉시 업데이트 (UI 반응성)
      setDisplayTheme(newTheme);

      // 2. ThemeProvider 업데이트 (실제 테마 적용)
      await setTheme(newTheme);

      // 3. 설정 저장 (백엔드 동기화)
      await updateSetting('app', 'theme', newTheme);

      Logger.info('APP_SETTINGS', 'Theme updated successfully', {
        theme: newTheme,
        source: 'settings_page'
      });
    } catch (error) {
      Logger.error('APP_SETTINGS', 'Failed to update theme', error);

      // 🔥 에러 시 원래 상태로 롤백
      setDisplayTheme(settings.theme);
    }
  }, [updateSetting, setTheme, settings.theme]);

  // 🔥 언어 변경 핸들러
  const handleLanguageChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    updateSetting('app', 'language', event.target.value);
  }, [updateSetting]);

  // 🔥 글꼴 크기 변경 핸들러 - 기가차드 강화버전
  const handleFontSizeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(event.target.value, 10);
    if (size >= 10 && size <= 24) {
      try {
        // 🔥 즉시 CSS 변수 적용
        document.documentElement.style.setProperty('--app-font-size', `${size}px`);
        document.body.style.fontSize = `${size}px`;

        // 🔥 설정 저장
        updateSetting('app', 'fontSize', size);

        Logger.info('APP_SETTINGS', '🔥 기가차드 폰트 크기 변경 완료', {
          newSize: size,
          timestamp: Date.now()
        });
      } catch (error) {
        Logger.error('APP_SETTINGS', '폰트 크기 변경 실패', error);
      }
    }
  }, [updateSetting]);

  // 🔥 글꼴 패밀리 변경 핸들러 - 기가차드 강화버전
  const handleFontFamilyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFont = event.target.value;

    try {
      // 🔥 즉시 폰트 적용 (useDynamicFont의 setFont 사용)
      setFont(selectedFont);

      // 🔥 설정 저장
      updateSetting('app', 'fontFamily', selectedFont);

      Logger.info('APP_SETTINGS', '🔥 기가차드 폰트 변경 완료', {
        newFont: selectedFont,
        timestamp: Date.now()
      });
    } catch (error) {
      Logger.error('APP_SETTINGS', '폰트 변경 실패', error);
    }
  }, [updateSetting, setFont]);

  // 🔥 토글 핸들러들
  const handleAutoSaveToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'autoSave', checked);
  }, [updateSetting]);

  const handleStartMinimizedToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'startMinimized', checked);
  }, [updateSetting]);

  const handleMinimizeToTrayToggle = useCallback((checked: boolean) => {
    updateSetting('app', 'minimizeToTray', checked);
  }, [updateSetting]);

  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
        <Settings className={SETTINGS_PAGE_STYLES.sectionIcon} />
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>앱 설정</h2>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingItem}>
        <SettingItem
          title="테마"
          description="앱의 외관 테마를 선택하세요"
          control={
            <select
              value={displayTheme}
              onChange={handleThemeChange}
              className={SETTINGS_PAGE_STYLES.select}
            >
              {THEME_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />

        <SettingItem
          title="언어"
          description="앱에서 사용할 언어를 선택하세요"
          control={
            <select
              value={settings.language}
              onChange={handleLanguageChange}
              className={SETTINGS_PAGE_STYLES.select}
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
            </select>
          }
        />

        <SettingItem
          title="자동 저장"
          description="작업 내용을 자동으로 저장합니다"
          control={
            <Toggle
              checked={settings.autoSave}
              onChange={handleAutoSaveToggle}
            />
          }
        />

        <SettingItem
          title="최소화 상태로 시작"
          description="앱 시작 시 최소화된 상태로 실행합니다"
          control={
            <Toggle
              checked={settings.startMinimized}
              onChange={handleStartMinimizedToggle}
            />
          }
        />

        <SettingItem
          title="시스템 트레이로 최소화"
          description="창을 닫을 때 시스템 트레이로 최소화합니다"
          control={
            <Toggle
              checked={settings.minimizeToTray}
              onChange={handleMinimizeToTrayToggle}
            />
          }
        />

        <SettingItem
          title="글꼴 크기"
          description="앱에서 사용할 글꼴 크기를 설정하세요 (10-24px)"
          control={
            <input
              type="number"
              min="10"
              max="24"
              value={settings.fontSize}
              onChange={handleFontSizeChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />

        <SettingItem
          title="글꼴 패밀리"
          description={
            fontsError
              ? `폰트를 불러오는데 문제가 있습니다: ${fontsError}`
              : "앱에서 사용할 글꼴을 선택하세요"
          }
          control={
            <select
              value={settings.fontFamily}
              onChange={handleFontFamilyChange}
              className={SETTINGS_PAGE_STYLES.select}
              disabled={fontsLoading}
            >
              {fontsLoading ? (
                <option value="">폰트 목록 로딩 중...</option>
              ) : (
                <>
                  {/* 동적 폰트 카테고리별 그룹 */}
                  {[...new Set(availableFonts.map(f => f.category))].map(category => {
                    const categoryFonts = availableFonts.filter(f => f.category === category);
                    const categoryLabels: Record<string, string> = {
                      system: '시스템 폰트',
                      korean: '한국어 폰트',
                      japanese: '일본어 폰트',
                      english: '영어 폰트'
                    };

                    return (
                      <optgroup key={category} label={categoryLabels[category] || category}>
                        {categoryFonts.map(font => (
                          <option key={font.value} value={font.value}>
                            {font.label}
                          </option>
                        ))}
                      </optgroup>
                    );
                  })}
                </>
              )}
            </select>
          }
        />
        {/* Google account actions (로그아웃 등) */}
        <GoogleAccountActions />
      </div>
    </div>
  );
});

AppSettingsSection.displayName = 'AppSettingsSection';
