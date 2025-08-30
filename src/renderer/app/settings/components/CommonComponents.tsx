'use client';

import React from 'react';
import { SETTINGS_PAGE_STYLES } from '../constants/styles';

// 🔥 기가차드 공통 UI 컴포넌트들

/**
 * 🔥 최적화된 섹션 헤더 컴포넌트
 */
interface SectionHeaderProps {
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly title: string;
  readonly description?: string;
}

export const SectionHeader = React.memo<SectionHeaderProps>(({ icon: Icon, title, description }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
      <Icon className={SETTINGS_PAGE_STYLES.sectionIcon} />
      <div>
        <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>{title}</h2>
        {description && (
          <p className={SETTINGS_PAGE_STYLES.sectionDescription}>{description}</p>
        )}
      </div>
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';

/**
 * 🔥 최적화된 섹션 카드 컴포넌트
 */
interface SectionCardProps {
  readonly children: React.ReactNode;
}

export const SectionCard = React.memo<SectionCardProps>(({ children }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.sectionCard}>
      {children}
    </div>
  );
});

SectionCard.displayName = 'SectionCard';

/**
 * 🔥 최적화된 로딩 컴포넌트
 */
interface LoadingProps {
  readonly message?: string;
}

export const Loading = React.memo<LoadingProps>(({ message = '설정을 불러오는 중...' }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.loadingContainer}>
      <div className={SETTINGS_PAGE_STYLES.loadingContent}>
        <div className={SETTINGS_PAGE_STYLES.loadingSpinner} />
        <p className={SETTINGS_PAGE_STYLES.loadingText}>{message}</p>
      </div>
    </div>
  );
});

Loading.displayName = 'Loading';

/**
 * 🔥 최적화된 에러 컴포넌트
 */
interface ErrorMessageProps {
  readonly message: string;
  readonly onRetry?: () => void;
}

export const ErrorMessage = React.memo<ErrorMessageProps>(({ message, onRetry }) => {
  return (
    <div className={SETTINGS_PAGE_STYLES.errorContainer}>
      <p className={SETTINGS_PAGE_STYLES.errorText}>{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.secondaryButton} mt-2`}
        >
          다시 시도
        </button>
      )}
    </div>
  );
});

ErrorMessage.displayName = 'ErrorMessage';
