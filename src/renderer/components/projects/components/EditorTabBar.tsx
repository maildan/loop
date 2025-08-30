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
    container: 'flex items-center bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 relative',
    tabsWrapper: 'flex-1 flex overflow-x-auto scrollbar-hide',
    tab: 'flex items-center gap-2 px-4 py-2 text-sm border-r border-gray-200 dark:border-gray-700 cursor-pointer select-none transition-all duration-150 min-w-[120px] max-w-[200px] group relative',
    activeTab: 'bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100',
    inactiveTab: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-750',
    dragOver: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-600',
    tabIcon: 'text-xs',
    tabTitle: 'flex-1 truncate font-medium',
    closeButton: 'opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded p-1 transition-all duration-150',
    closeButtonVisible: 'opacity-100',
    newTabButton: 'px-3 py-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-150',
    contextMenu: 'absolute bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-1 z-50 min-w-[180px]',
    contextMenuItem: 'px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2',
    contextMenuSeparator: 'border-t border-gray-200 dark:border-gray-600 my-1',
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
                {tabs.map((tab) => {
                    const isActive = tab.id === activeTabId;
                    const isDragOver = dragOverTabId === tab.id;
                    const canClose = tab.id !== 'main'; // 메인 탭은 닫을 수 없음

                    return (
                        <div
                            key={tab.id}
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

                            {tab.isDirty && (
                                <span className="text-orange-500 text-xs">●</span>
                            )}

                            {canClose && (
                                <button
                                    className={`
                    ${TAB_STYLES.closeButton}
                    ${isActive ? TAB_STYLES.closeButtonVisible : ''}
                  `}
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
                className={TAB_STYLES.newTabButton}
                onClick={onNewTab}
                title="새 장 추가"
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
