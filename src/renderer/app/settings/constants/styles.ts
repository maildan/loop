'use client';

// 🔥 기가차드 Settings 스타일 상수 - 프리컴파일된 Tailwind CSS 클래스

/**
 * 🎨 Settings 페이지 스타일 상수 (메모이제이션 최적화)
 * - 모든 스타일을 미리 정의하여 런타임 성능 최적화
 * - 조건부 스타일링 방지로 리렌더링 감소
 */
export const SETTINGS_PAGE_STYLES = {
  // 메인 컨테이너 - 스크롤 문제 해결: 단일 스크롤 영역으로 통합
  container: 'w-full max-w-4xl mx-auto px-4 py-6 space-y-6 min-w-0 flex-1 overflow-y-auto',
  pageTitle: 'text-3xl font-bold text-foreground mb-6',

  // 네비게이션
  nav: 'flex flex-wrap gap-2 mb-6',
  navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
  navButtonActive: 'bg-primary text-primary-foreground shadow-md hover:bg-primary/90',
  navButtonInactive: 'bg-muted text-muted-foreground hover:bg-muted/80',

  // 섹션 - 이중 스크롤 제거: 일반 flow로 변경
  section: 'space-y-6',
  sectionCard: 'bg-card rounded-xl shadow-sm border border-border p-6 text-card-foreground transition-colors',
  sectionHeader: 'flex items-center gap-3 mb-4 pb-3 border-b border-border',
  sectionIcon: 'w-6 h-6 text-primary flex-shrink-0',
  sectionTitle: 'text-xl font-semibold text-foreground',
  sectionDescription: 'text-sm text-muted-foreground mt-1',
  sectionCardBody: 'space-y-4',

  // 설정 항목
  settingItem: 'space-y-4',
  settingRow: 'flex items-center justify-between py-3 border-b border-border last:border-b-0 min-h-[60px]',
  settingLabel: 'flex-1 pr-4',
  settingTitle: 'font-medium text-foreground text-base',
  settingDescription: 'text-sm text-muted-foreground mt-1 max-w-md',
  settingControl: 'flex items-center gap-3 flex-shrink-0',

  // 입력 필드
  inputGroup: 'space-y-2',
  inputLabel: 'text-sm font-medium text-muted-foreground',
  textInput: 'w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring focus:outline-none bg-card text-card-foreground transition-colors',
  numberInput: 'w-24 px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring focus:outline-none bg-card text-card-foreground transition-colors',
  select: 'px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-ring focus:outline-none bg-card text-card-foreground min-w-[120px] transition-colors',

  // 체크박스 및 토글
  checkbox: 'w-4 h-4 text-primary bg-card border-border rounded focus:ring-ring focus:ring-2 transition-colors',
  toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background cursor-pointer',
  toggleActive: 'bg-primary',
  toggleInactive: 'bg-muted',
  toggleSwitch: 'inline-block h-4 w-4 transform rounded-full bg-card-foreground transition-transform duration-200 ease-in-out shadow-sm',
  toggleSwitchActive: 'translate-x-6',
  toggleSwitchInactive: 'translate-x-1',
  toggleDisabled: 'opacity-50 cursor-not-allowed',

  // 액션 버튼
  actions: 'flex justify-end gap-3 pt-6 border-t border-border',
  button: 'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed',
  primaryButton: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg focus:ring-ring',
  secondaryButton: 'bg-muted text-muted-foreground hover:bg-muted/80 focus:ring-ring',
  dangerButton: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground shadow-md hover:shadow-lg focus:ring-destructive',

  // 로딩 상태
  loading: 'flex items-center justify-center h-64',
  loadingContent: 'text-center',
  spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-b-primary mx-auto mb-4',
  loadingText: 'text-muted-foreground',
  loadingContainer: 'flex items-center justify-center h-64',
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-b-primary mx-auto mb-4',

  // 에러 상태
  errorContainer: 'bg-destructive/10 border border-destructive/40 rounded-lg p-4',
  errorText: 'text-destructive text-sm',

  // 성공 상태
  successContainer: 'bg-[var(--success-light)] border border-[color:var(--success)]/30 rounded-lg p-4',
  successText: 'text-[color:var(--success)] text-sm',

  // 유틸리티
  srOnly: 'sr-only',
  visuallyHidden: 'absolute w-px h-px p-0 -m-px overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0',
} as const;

/**
 * 🔥 아이콘 크기 상수
 */
export const ICON_SIZES = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
} as const;

/**
 * 🔥 간격 상수
 */
export const SPACING = {
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-3',
  lg: 'gap-4',
  xl: 'gap-6',
} as const;
