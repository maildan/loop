// WriterSidebar 스타일과 상수 정의
import {
    Edit3,
    FileText,
    Users,
    Lightbulb
} from 'lucide-react';

// 🔥 기가차드 간소화된 사이드바 스타일
export const SIDEBAR_STYLES = {
    // 기본 컨테이너 (스크롤바 문제 해결)
    container: 'flex flex-col bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 h-full',
    collapsed: 'w-12',
    expanded: 'w-64',

    // 🔥 얇은 스크롤바 적용 영역
    scrollArea: 'flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar',

    // 🔥 메뉴 스타일
    menuSection: 'p-3 space-y-1',
    menuItem: 'flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer rounded-md',
    menuItemActive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    menuItemInactive: 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',

    // 🔥 섹션 스타일
    sectionContainer: 'p-3',
    sectionHeader: 'text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 flex items-center justify-between',
    sectionTitle: 'flex items-center gap-2',

    // 🔥 구조 아이템 스타일
    structureList: 'space-y-1',
    structureItem: 'flex items-center gap-2 py-1.5 px-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors rounded group',
    structureItemActive: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',

    // 🔥 통계 스타일
    statsSection: 'p-3 border-t border-gray-200 dark:border-gray-700',
    statItem: 'flex justify-between items-center py-1 text-sm',
    statLabel: 'text-gray-600 dark:text-gray-400',
    statValue: 'font-medium text-gray-900 dark:text-gray-100',
} as const;

// 🔥 메뉴 아이템 정의 (4개 탭)
export const MENU_ITEMS = [
    { id: 'write', label: '글쓰기', icon: Edit3 },
    { id: 'structure', label: '구조', icon: FileText },
    { id: 'characters', label: '인물', icon: Users },
    { id: 'idea', label: '아이디어', icon: Lightbulb },
];
