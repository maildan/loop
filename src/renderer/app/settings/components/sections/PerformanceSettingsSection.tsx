// 🔥 기가차드 성능 설정 섹션 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Cpu } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Toggle } from '../controls/Toggle';
import type { SettingsData, UpdateSettingFunction } from '../../types';

/**
 * 🔥 성능 설정 섹션 Props
 */
interface PerformanceSettingsSectionProps {
  settings: SettingsData['performance'];
  updateSetting: UpdateSettingFunction;
}

/**
 * 🔥 성능 설정 섹션 컴포넌트
 */
export const PerformanceSettingsSection = React.memo<PerformanceSettingsSectionProps>(({ 
  settings, 
  updateSetting 
}) => {
  // 🔥 최대 CPU 사용률 변경 핸들러
  const handleMaxCPUUsageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const usage = parseInt(event.target.value, 10);
    if (usage >= 20 && usage <= 100) {
      updateSetting('performance', 'maxCPUUsage', usage);
    }
  }, [updateSetting]);

  // 🔥 최대 메모리 사용량 변경 핸들러
  const handleMaxMemoryUsageChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const memory = parseInt(event.target.value, 10);
    if (memory >= 512 && memory <= 8192) {
      updateSetting('performance', 'maxMemoryUsage', memory);
    }
  }, [updateSetting]);

  // 🔥 토글 핸들러들
  const handleGPUAccelerationToggle = useCallback((checked: boolean) => {
    updateSetting('performance', 'enableGPUAcceleration', checked);
  }, [updateSetting]);

  const handleHardwareAccelerationToggle = useCallback((checked: boolean) => {
    updateSetting('performance', 'enableHardwareAcceleration', checked);
  }, [updateSetting]);

  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
        <Cpu className={SETTINGS_PAGE_STYLES.sectionIcon} />
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>성능 설정</h2>
      </div>

      <div className={SETTINGS_PAGE_STYLES.settingItem}>
        <SettingItem
          title="GPU 가속 활성화"
          description="GPU를 사용하여 렌더링 성능을 향상시킵니다"
          control={
            <Toggle
              checked={settings.enableGPUAcceleration}
              onChange={handleGPUAccelerationToggle}
            />
          }
        />

        <SettingItem
          title="하드웨어 가속 활성화"
          description="하드웨어 가속을 사용하여 전반적인 성능을 향상시킵니다"
          control={
            <Toggle
              checked={settings.enableHardwareAcceleration}
              onChange={handleHardwareAccelerationToggle}
            />
          }
        />

        <SettingItem
          title="최대 CPU 사용률"
          description="앱이 사용할 수 있는 최대 CPU 사용률(%)을 설정하세요 (20-100%)"
          control={
            <input
              type="number"
              min="20"
              max="100"
              step="5"
              value={settings.maxCPUUsage}
              onChange={handleMaxCPUUsageChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />

        <SettingItem
          title="최대 메모리 사용량"
          description="앱이 사용할 수 있는 최대 메모리 사용량(MB)을 설정하세요 (512-8192MB)"
          control={
            <input
              type="number"
              min="512"
              max="8192"
              step="256"
              value={settings.maxMemoryUsage}
              onChange={handleMaxMemoryUsageChange}
              className={SETTINGS_PAGE_STYLES.numberInput}
            />
          }
        />
      </div>
    </div>
  );
});

PerformanceSettingsSection.displayName = 'PerformanceSettingsSection';
