'use client';

// 🔥 기가차드 Settings 스타일 상수 - 프리컴파일된 Tailwind CSS 클래스

/**
 * 🎨 Settings 페이지 스타일 상수 (메모이제이션 최적화)
 * - 모든 스타일을 미리 정의하여 런타임 성능 최적화
 * - 조건부 스타일링 방지로 리렌더링 감소
 */
export const SETTINGS_PAGE_STYLES = {
  // 메인 컨테이너
  // Use full width with a max-width to avoid flex overflow inside the app layout
  container: 'w-full max-w-4xl mx-auto px-4 py-6 space-y-6 min-w-0',
  pageTitle: 'text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6',

  // 네비게이션
  nav: 'flex flex-wrap gap-2 mb-6',
  navButton: 'px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500',
  navButtonActive: 'bg-blue-600 text-white shadow-md',
  navButtonInactive: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',

  // 섹션
  section: 'space-y-6',
  sectionCard: 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6',
  sectionHeader: 'flex items-center gap-3 mb-4 pb-3 border-b border-slate-200 dark:border-slate-700',
  sectionIcon: 'w-6 h-6 text-blue-600 flex-shrink-0',
  sectionTitle: 'text-xl font-semibold text-slate-900 dark:text-slate-100',
  sectionDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1',

  // 설정 항목
  settingItem: 'space-y-4',
  settingRow: 'flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700 last:border-b-0 min-h-[60px]',
  settingLabel: 'flex-1 pr-4',
  settingTitle: 'font-medium text-slate-900 dark:text-slate-100 text-base',
  settingDescription: 'text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md',
  settingControl: 'flex items-center gap-3 flex-shrink-0',

  // 입력 필드
  inputGroup: 'space-y-2',
  inputLabel: 'text-sm font-medium text-slate-700 dark:text-slate-300',
  textInput: 'w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
  numberInput: 'w-24 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-colors',
  select: 'px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 min-w-[120px] transition-colors',

  // 체크박스 및 토글
  checkbox: 'w-4 h-4 text-blue-600 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 dark:bg-slate-700 dark:border-slate-600 transition-colors',
  toggle: 'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer',
  toggleActive: 'bg-blue-600',
  toggleInactive: 'bg-slate-200 dark:bg-slate-600',
  toggleSwitch: 'inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm',
  toggleSwitchActive: 'translate-x-6',
  toggleSwitchInactive: 'translate-x-1',
  toggleDisabled: 'opacity-50 cursor-not-allowed',

  // 액션 버튼
  actions: 'flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700',
  button: 'inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
  primaryButton: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg focus:ring-blue-500',
  secondaryButton: 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
  dangerButton: 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg focus:ring-red-500',

  // 로딩 상태
  loading: 'flex items-center justify-center h-64',
  loadingContent: 'text-center',
  spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',
  loadingText: 'text-slate-600 dark:text-slate-400',
  loadingContainer: 'flex items-center justify-center h-64',
  loadingSpinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4',

  // 에러 상태
  errorContainer: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4',
  errorText: 'text-red-800 dark:text-red-400 text-sm',

  // 성공 상태
  successContainer: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4',
  successText: 'text-green-800 dark:text-green-400 text-sm',

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
