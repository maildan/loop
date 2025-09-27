/**
 * 🎨 Theme Selector Component - 테마 선택 UI
 * 
 * 사용자가 테마를 선택할 수 있는 아름다운 UI 컴포넌트
 */

'use client';

import React, { useState } from 'react';
import { useTheme } from '../contexts/themeContext';
import { Theme, ThemeMetadata } from '../../shared/types/theme';
import { DEFAULT_THEMES } from '../utils/themeUtils';

/* 🎨 아이콘 컴포넌트들 */
const Icons = {
  Sun: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  ),
  Moon: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  Monitor: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
      <path d="m8 21 4-4 4 4"/>
    </svg>
  ),
  Pen: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
  ),
  Palette: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="13.5" cy="6.5" r=".5"/>
      <circle cx="17.5" cy="10.5" r=".5"/>
      <circle cx="8.5" cy="7.5" r=".5"/>
      <circle cx="6.5" cy="12.5" r=".5"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  Settings: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  )
};

/* 🎨 테마별 아이콘 매핑 */
const getThemeIcon = (theme: Theme) => {
  switch (theme) {
    case 'light': return <Icons.Sun />;
    case 'dark': return <Icons.Moon />;
    case 'writer-focus':
    case 'writer-focus-dark': return <Icons.Pen />;
    case 'sepia':
    case 'sepia-dark': return <Icons.Palette />;
    case 'high-contrast':
    case 'colorblind-friendly': return <Icons.Settings />;
    default: return <Icons.Monitor />;
  }
};

/* 🎨 테마 프리뷰 컴포넌트 */
interface ThemePreviewProps {
  theme: Theme;
  metadata: ThemeMetadata;
  isActive: boolean;
  onSelect: (theme: Theme) => void;
}

function ThemePreview({ theme, metadata, isActive, onSelect }: ThemePreviewProps) {
  const isDark = theme.includes('dark') || theme === 'dark';
  
  return (
    <button
      onClick={() => onSelect(theme)}
      className={`
        relative group p-4 rounded-xl border-2 transition-all duration-200
        ${isActive 
          ? 'border-primary bg-primary/5 shadow-md' 
          : 'border-border hover:border-primary/50 hover:shadow-sm'
        }
      `}
    >
      {/* 테마 프리뷰 영역 */}
      <div className={`
        mb-3 h-20 rounded-lg border overflow-hidden
        ${isDark 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' 
          : 'bg-gradient-to-br from-white to-slate-50 border-slate-200'
        }
      `}>
        <div className="p-2 space-y-1">
          {/* 모의 헤더 */}
          <div className={`
            h-2 rounded-full
            ${isDark ? 'bg-slate-600' : 'bg-slate-300'}
          `} style={{ width: '60%' }} />
          
          {/* 모의 콘텐츠 */}
          <div className={`
            h-1 rounded-full
            ${isDark ? 'bg-slate-700' : 'bg-slate-200'}
          `} style={{ width: '80%' }} />
          <div className={`
            h-1 rounded-full
            ${isDark ? 'bg-slate-700' : 'bg-slate-200'}
          `} style={{ width: '40%' }} />
          
          {/* 테마별 특색 표시 */}
          {theme.includes('writer') && (
            <div className={`
              mt-2 h-1 rounded-full bg-amber-500/60
            `} style={{ width: '90%' }} />
          )}
          {theme.includes('sepia') && (
            <div className={`
              mt-2 h-1 rounded-full bg-orange-400/60
            `} style={{ width: '70%' }} />
          )}
        </div>
      </div>

      {/* 테마 정보 */}
      <div className="text-left">
        <div className="flex items-center gap-2 mb-1">
          {getThemeIcon(theme)}
          <h3 className="font-medium text-sm">{metadata.name}</h3>
          {isActive && (
            <div className="ml-auto text-primary">
              <Icons.Check />
            </div>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground leading-relaxed">
          {metadata.description}
        </p>
        
        {/* 태그들 */}
        <div className="flex flex-wrap gap-1 mt-2">
          {metadata.tags.slice(0, 2).map(tag => (
            <span 
              key={tag}
              className="px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 호버 효과 */}
      <div className={`
        absolute inset-0 rounded-xl transition-opacity duration-200
        ${isActive 
          ? 'bg-primary/5 opacity-100' 
          : 'bg-primary/5 opacity-0 group-hover:opacity-100'
        }
      `} />
    </button>
  );
}

/* 🎨 메인 테마 선택기 컴포넌트 */
interface ThemeSelectorProps {
  className?: string;
  compact?: boolean;
}

export function ThemeSelector({ className = '', compact = false }: ThemeSelectorProps) {
  const { theme, setTheme, isTransitioning, preferences, isDarkMode } = useTheme();
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* 🔥 테마 변경 핸들러 */
  const handleThemeChange = async (newTheme: Theme) => {
    if (isTransitioning) return;
    
    await setTheme(newTheme, {
      duration: 300,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    });
  };

  /* 🔥 기본 테마들 필터링 */
  const baseThemes = DEFAULT_THEMES.filter(t => t.category === 'base');
  const writerThemes = DEFAULT_THEMES.filter(t => t.category === 'writer');

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* 빠른 다크 모드 토글 */}
        <button
          onClick={() => handleThemeChange(isDarkMode ? 'light' : 'dark')}
          disabled={isTransitioning}
          className="p-2 rounded-lg border hover:bg-accent transition-colors"
          title={isDarkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
        >
          {isDarkMode ? <Icons.Sun /> : <Icons.Moon />}
        </button>
        
        {/* 작가 테마 토글 */}
        <button
          onClick={() => {
            const isWriterTheme = theme.includes('writer-focus');
            const newTheme = isWriterTheme 
              ? (isDarkMode ? 'dark' : 'light')
              : (isDarkMode ? 'writer-focus-dark' : 'writer-focus');
            handleThemeChange(newTheme);
          }}
          disabled={isTransitioning}
          className={`p-2 rounded-lg border transition-colors ${
            theme.includes('writer-focus') 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-accent'
          }`}
          title="작가 집중 모드"
        >
          <Icons.Pen />
        </button>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 헤더 */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">테마 선택</h2>
        <p className="text-sm text-muted-foreground">
          작업 환경에 맞는 테마를 선택하세요
        </p>
      </div>

      {/* 기본 테마들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">기본 테마</h3>
        <div className="grid grid-cols-2 gap-3">
          {baseThemes.map((metadata) => (
            <ThemePreview
              key={metadata.id}
              theme={metadata.id as Theme}
              metadata={metadata}
              isActive={theme === metadata.id}
              onSelect={handleThemeChange}
            />
          ))}
        </div>
      </div>

      {/* 작가 테마들 */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">작가 테마</h3>
        <div className="grid grid-cols-2 gap-3">
          {writerThemes.map((metadata) => {
            // 라이트와 다크 변형 모두 표시
            const lightTheme = metadata.id as Theme;
            const darkTheme = `${metadata.id}-dark` as Theme;
            
            return (
              <React.Fragment key={metadata.id}>
                <ThemePreview
                  theme={lightTheme}
                  metadata={metadata}
                  isActive={theme === lightTheme}
                  onSelect={handleThemeChange}
                />
                <ThemePreview
                  theme={darkTheme}
                  metadata={{
                    ...metadata,
                    id: darkTheme,
                    name: `${metadata.name} (다크)`,
                    description: `${metadata.description} - 다크 모드`
                  }}
                  isActive={theme === darkTheme}
                  onSelect={handleThemeChange}
                />
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 고급 옵션 */}
      <div className="space-y-3">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <Icons.Settings />
          고급 설정
          <div className={`transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>
            →
          </div>
        </button>
        
        {showAdvanced && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            {/* 자동 다크 모드 */}
            <label className="flex items-center justify-between">
              <span className="text-sm">시스템 테마 따르기</span>
              <input
                type="checkbox"
                checked={preferences.autoSwitchDarkMode}
                onChange={(e) => {
                  // updatePreferences({ autoSwitchDarkMode: e.target.checked });
                }}
                className="rounded"
              />
            </label>

            {/* 고대비 모드 */}
            <label className="flex items-center justify-between">
              <span className="text-sm">고대비 모드</span>
              <input
                type="checkbox"
                checked={preferences.accessibility.highContrast}
                onChange={() => {
                  if (preferences.accessibility.highContrast) {
                    handleThemeChange(isDarkMode ? 'dark' : 'light');
                  } else {
                    handleThemeChange('high-contrast');
                  }
                }}
                className="rounded"
              />
            </label>

            {/* 색맹 친화 모드 */}
            <label className="flex items-center justify-between">
              <span className="text-sm">색맹 친화 모드</span>
              <input
                type="checkbox"
                checked={preferences.accessibility.colorblindFriendly}
                onChange={() => {
                  if (preferences.accessibility.colorblindFriendly) {
                    handleThemeChange(isDarkMode ? 'dark' : 'light');
                  } else {
                    handleThemeChange('colorblind-friendly');
                  }
                }}
                className="rounded"
              />
            </label>
          </div>
        )}
      </div>

      {/* 현재 테마 정보 */}
      <div className="p-3 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          {getThemeIcon(theme)}
          <span className="font-medium text-sm">
            현재 테마: {DEFAULT_THEMES.find(t => t.id === theme)?.name || theme}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {DEFAULT_THEMES.find(t => t.id === theme)?.description || '사용자 정의 테마'}
        </p>
      </div>
    </div>
  );
}