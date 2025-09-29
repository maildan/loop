'use client';

import React, { useState, useRef, useCallback, memo } from 'react';
import { X, Plus } from 'lucide-react';
import { EditorTab } from '../../../../shared/editor';
import { Logger } from '../../../../shared/logger';

interface EditorTabBarProps {
    tabs: EditorTab[];
    activeTabId: string;
    onTabClick: (tabId: string) => void;
    onTabClose: (tabId: string) => void;
    onNewTab: () => void;
    onTabReorder?: (fromIndex: number, toIndex: number) => void;
}

interface ContextMenuState {
    isOpen: boolean;
    x: number;
    y: number;
    tabId: string | null;
}

const TAB_STYLES = {
    // 🔥 작가 친화적 디자인: 방해요소 최소화, EditorTabBar z-index를 ProjectHeader보다 높게 설정
    container: 'flex items-center bg-[var(--editor-bg-secondary)] border-b border-[color:var(--editor-border)] relative z-[1000]', // 950 → 1000으로 증가
    tabsWrapper: 'flex-1 flex overflow-x-auto scrollbar-hide',
    tab: 'flex items-center gap-2 px-4 py-2 text-sm border-r border-[color:var(--editor-border)] cursor-pointer select-none transition-all duration-200 min-w-[120px] max-w-[200px] group relative',
    activeTab: 'bg-[var(--editor-bg)] text-[color:var(--editor-text)] shadow-sm',
    inactiveTab: 'bg-[var(--editor-bg-secondary)] text-[color:var(--editor-text-muted)] hover:bg-[var(--editor-bg)] hover:text-[color:var(--editor-text)]',
    dragOver: 'bg-[var(--editor-accent-light)] border-[color:var(--editor-accent)]',
    tabIcon: 'text-xs',
    tabTitle: 'flex-1 truncate font-medium',
    closeButton: 'hover:bg-[var(--editor-bg)] rounded p-1 transition-all duration-200 opacity-0 group-hover:opacity-100',
    closeButtonVisible: 'opacity-100',
    newTabButton: 'px-3 py-2 text-[color:var(--editor-text-muted)] hover:text-[color:var(--editor-text)] hover:bg-[var(--editor-bg)] transition-all duration-200 rounded-md mx-2',
    contextMenu: 'absolute bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-xl py-1 z-[1010] min-w-[180px]', // 960 → 1010으로 증가
    contextMenuItem: 'px-3 py-2 text-sm text-[color:var(--editor-text)] hover:bg-[var(--editor-accent-light)] cursor-pointer flex items-center gap-2',
    contextMenuSeparator: 'border-t border-[color:var(--editor-border)] my-1',
} as const;

export const EditorTabBar = memo(function EditorTabBar({
    tabs,
    activeTabId,
    onTabClick,
    onTabClose,
    onNewTab,
    onTabReorder,
}: EditorTabBarProps): React.ReactElement {
    const [draggedTabId, setDraggedTabId] = useState<string | null>(null);
    const [dragOverTabId, setDragOverTabId] = useState<string | null>(null);

    // 🔥 탭 상태 변경 시 로깅으로 디버깅
    React.useEffect(() => {
        Logger.debug('EDITOR_TAB_BAR', 'Tabs updated', {
            tabCount: tabs.length,
            activeTabId,
            tabIds: tabs.map(tab => tab.id)
        });
    }, [tabs, activeTabId]);

    // 🔥 안정적인 탭 배열 보장
    const stableTabs = React.useMemo(() => {
        return tabs.filter(tab => tab && tab.id); // null/undefined 탭 필터링
    }, [tabs]);
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({
        isOpen: false,
        x: 0,
        y: 0,
        tabId: null,
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // 🔥 드래그 앤 드롭 핸들러들
    const handleDragStart = useCallback((e: React.DragEvent, tabId: string) => {
        setDraggedTabId(tabId);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', tabId);

        // 드래그 중 스타일링을 위한 투명도 설정
        const target = e.currentTarget as HTMLElement;
        target.style.opacity = '0.5';

        Logger.debug('TAB_BAR', 'Drag started', { tabId });
    }, []);

    const handleDragEnd = useCallback((e: React.DragEvent) => {
        const target = e.currentTarget as HTMLElement;
        target.style.opacity = '1';
        setDraggedTabId(null);
        setDragOverTabId(null);

        Logger.debug('TAB_BAR', 'Drag ended');
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent, tabId: string) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        if (draggedTabId && draggedTabId !== tabId) {
            setDragOverTabId(tabId);
        }
    }, [draggedTabId]);

    const handleDragLeave = useCallback(() => {
        setDragOverTabId(null);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent, targetTabId: string) => {
        e.preventDefault();

        if (!draggedTabId || draggedTabId === targetTabId) return;

        const fromIndex = tabs.findIndex(tab => tab.id === draggedTabId);
        const toIndex = tabs.findIndex(tab => tab.id === targetTabId);

        if (fromIndex !== -1 && toIndex !== -1 && onTabReorder) {
            onTabReorder(fromIndex, toIndex);
            Logger.info('TAB_BAR', 'Tab reordered', {
                from: fromIndex,
                to: toIndex,
                draggedTabId,
                targetTabId
            });
        }

        setDraggedTabId(null);
        setDragOverTabId(null);
    }, [draggedTabId, tabs, onTabReorder]);

    // 🔥 컨텍스트 메뉴 핸들러들
    const handleContextMenu = useCallback((e: React.MouseEvent, tabId: string) => {
        e.preventDefault();

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        setContextMenu({
            isOpen: true,
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            tabId,
        });

        Logger.debug('TAB_BAR', 'Context menu opened', { tabId });
    }, []);

    const closeContextMenu = useCallback(() => {
        setContextMenu({ isOpen: false, x: 0, y: 0, tabId: null });
    }, []);

    const handleCloseOtherTabs = useCallback(() => {
        if (!contextMenu.tabId) return;

        tabs.forEach(tab => {
            if (tab.id !== contextMenu.tabId && tab.id !== 'main') {
                onTabClose(tab.id);
            }
        });

        closeContextMenu();
        Logger.info('TAB_BAR', 'Closed other tabs', { keepTabId: contextMenu.tabId });
    }, [contextMenu.tabId, tabs, onTabClose, closeContextMenu]);

    const handleCloseTabsToRight = useCallback(() => {
        if (!contextMenu.tabId) return;

        const currentIndex = tabs.findIndex(tab => tab.id === contextMenu.tabId);
        if (currentIndex === -1) return;

        tabs.slice(currentIndex + 1).forEach(tab => {
            if (tab.id !== 'main') {
                onTabClose(tab.id);
            }
        });

        closeContextMenu();
        Logger.info('TAB_BAR', 'Closed tabs to right', { fromTabId: contextMenu.tabId });
    }, [contextMenu.tabId, tabs, onTabClose, closeContextMenu]);

    // 🔥 탭 닫기 핸들러
    const handleTabCloseClick = useCallback((e: React.MouseEvent, tabId: string) => {
        e.preventDefault();
        e.stopPropagation();
        onTabClose(tabId);
    }, [onTabClose]);

    // 🔥 탭 타입에 따른 아이콘 반환
    const getTabIcon = useCallback((type: EditorTab['type']) => {
        const iconMap: Record<EditorTab['type'], string> = {
            main: '📝',
            chapter: '📖'
        };
        return iconMap[type] || '📄';
    }, []);

    // 🔥 전역 클릭 시 컨텍스트 메뉴 닫기
    React.useEffect(() => {
        const handleGlobalClick = () => closeContextMenu();
        if (contextMenu.isOpen) {
            document.addEventListener('click', handleGlobalClick);
            return () => document.removeEventListener('click', handleGlobalClick);
        }
    }, [contextMenu.isOpen, closeContextMenu]);

    return (
        <div ref={containerRef} className={TAB_STYLES.container}>
            <div className={TAB_STYLES.tabsWrapper}>
                {stableTabs.map((tab, index) => {
                    const isActive = tab.id === activeTabId;
                    const isDragOver = dragOverTabId === tab.id;
                    const canClose = tab.id !== 'main'; // 메인 탭은 닫을 수 없음

                    return (
                        <div
                            key={`${tab.id}-${index}`} // 🔥 안정적인 key 생성
                            draggable
                            className={`
                ${TAB_STYLES.tab}
                ${isActive ? TAB_STYLES.activeTab : TAB_STYLES.inactiveTab}
                ${isDragOver ? TAB_STYLES.dragOver : ''}
              `}
                            onClick={() => onTabClick(tab.id)}
                            onContextMenu={(e) => handleContextMenu(e, tab.id)}
                            onDragStart={(e) => handleDragStart(e, tab.id)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, tab.id)}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDrop(e, tab.id)}
                            title={tab.title}
                        >
                            <span className={TAB_STYLES.tabIcon}>
                                {getTabIcon(tab.type)}
                            </span>

                            <span className={TAB_STYLES.tabTitle}>
                                {tab.title}
                            </span>

                            {/* 🔥 저장되지 않은 변경사항 표시 (노란색 점) */}
                            {tab.isDirty && (
                                <span className="text-[var(--warning)] text-xs">●</span>
                            )}

                            {/* 🔥 X 버튼을 기본적으로 표시 (메인 탭 제외) */}
                            {canClose && (
                                <button
                                    type="button"
                                    className={TAB_STYLES.closeButton}
                                    onClick={(e) => handleTabCloseClick(e, tab.id)}
                                    title="탭 닫기"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            <button
                type="button"
                className={TAB_STYLES.newTabButton}
                onClick={onNewTab}
                title="새 챕터 추가"
            >
                <Plus size={16} />
            </button>

            {/* 🔥 컨텍스트 메뉴 */}
            {contextMenu.isOpen && (
                <div
                    className={TAB_STYLES.contextMenu}
                    style={{
                        left: contextMenu.x,
                        top: contextMenu.y,
                    }}
                >
                    <div
                        className={TAB_STYLES.contextMenuItem}
                        onClick={handleCloseOtherTabs}
                    >
                        다른 탭 모두 닫기
                    </div>

                    <div
                        className={TAB_STYLES.contextMenuItem}
                        onClick={handleCloseTabsToRight}
                    >
                        오른쪽 탭 모두 닫기
                    </div>

                    {contextMenu.tabId !== 'main' && (
                        <>
                            <div className={TAB_STYLES.contextMenuSeparator} />
                            <div
                                className={TAB_STYLES.contextMenuItem}
                                onClick={() => {
                                    if (contextMenu.tabId) {
                                        onTabClose(contextMenu.tabId);
                                    }
                                    closeContextMenu();
                                }}
                            >
                                이 탭 닫기
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
});
