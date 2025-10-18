// 🔥 기가차드 설정 네비게이션 컴포넌트 - 최적화
'use client';

import React, { useCallback } from 'react';
import { Settings, User, Bell, Palette, Keyboard, Cpu } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';
import type { SettingSection, SettingSectionMeta } from '../types';

/**
 * 🔥 설정 섹션 메타데이터 - 단순한 플랫 구조
 */
const SECTIONS: SettingSectionMeta[] = [
  { id: 'app', label: '앱 설정', icon: Settings },
  { id: 'account', label: '사용자 프로필', icon: User },
  { id: 'notifications', label: '알림', icon: Bell },
  { id: 'ui', label: 'UI/UX', icon: Palette },
  { id: 'performance', label: '성능', icon: Cpu },
];

/**
 * 🔥 설정 네비게이션 Props
 */
interface SettingsNavigationProps {
  activeSection: SettingSection;
  onSectionChange: (section: SettingSection) => void;
}

/**
 * 🔥 섹션 버튼 컴포넌트
 */
const SectionButton = React.memo<{
  section: SettingSectionMeta;
  isActive: boolean;
  onClick: () => void;
}>(({ section, isActive, onClick }) => {
  const Icon = section.icon;

  return (
    <button
      type="button"
      className={`${SETTINGS_PAGE_STYLES.navButton} ${isActive
        ? SETTINGS_PAGE_STYLES.navButtonActive
        : SETTINGS_PAGE_STYLES.navButtonInactive
        }`}
      onClick={onClick}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon className="w-4 h-4 mr-2" />
      {section.label}
    </button>
  );
});

SectionButton.displayName = 'SectionButton';

/**
 * 🔥 설정 네비게이션 컴포넌트
 */
export const SettingsNavigation = React.memo<SettingsNavigationProps>(({
  activeSection,
  onSectionChange
}) => {
  const createSectionHandler = useCallback((sectionId: SettingSection) => {
    return () => onSectionChange(sectionId);
  }, [onSectionChange]);

  return (
    <nav className="flex flex-wrap gap-2 mb-6" role="navigation" aria-label="설정 네비게이션">
      {SECTIONS.map(section => (
        <SectionButton
          key={section.id}
          section={section}
          isActive={activeSection === section.id}
          onClick={createSectionHandler(section.id)}
        />
      ))}
    </nav>
  );
});

SettingsNavigation.displayName = 'SettingsNavigation';
