import React from 'react';
import { BookOpen } from 'lucide-react';
import { Logger } from '../../../../../shared/logger';
import { WriterStats } from '../../editor/WriterStats';

interface MainStorySectionProps {
    projectId: string;
    projectTitle: string;
    mainContent: string;
    writerStats: WriterStats | null;
    projectDataLoading: boolean;
    collapsedFolders: Set<string>;
    renderFolderHeader: (
        folderId: string,
        title: string,
        icon: React.ComponentType<any>,
        count: number
    ) => React.ReactElement;
    STRUCTURE_STYLES: {
        structureItem: string;
        itemIcon: string;
        itemContent: string;
        itemTitle: string;
        itemType: string;
    };
}

export const MainStorySection: React.FC<MainStorySectionProps> = ({
    projectId,
    projectTitle,
    mainContent,
    writerStats,
    projectDataLoading,
    collapsedFolders,
    renderFolderHeader,
    STRUCTURE_STYLES
}) => {
    const handleMainStoryClick = () => {
        Logger.info('STRUCTURE_VIEW', 'Main story clicked', {
            projectId,
            hasContent: !!mainContent,
            wordCount: writerStats?.wordCount || 0
        });
        // TODO: Write 뷰로 네비게이션 추가
    };

    return (
        <div>
            {renderFolderHeader('main', '메인 스토리', BookOpen, 1)}
            {!collapsedFolders.has('main') && (
                <div className="ml-6 space-y-2">
                    {projectDataLoading ? (
                        <div className={`${STRUCTURE_STYLES.structureItem} opacity-50`}>
                            <BookOpen className={STRUCTURE_STYLES.itemIcon} />
                            <div className={STRUCTURE_STYLES.itemContent}>
                                <div className={STRUCTURE_STYLES.itemTitle}>로딩 중...</div>
                                <div className={STRUCTURE_STYLES.itemType}>프로젝트 데이터를 불러오는 중</div>
                            </div>
                        </div>
                    ) : (
                        <div
                            className={STRUCTURE_STYLES.structureItem}
                            onClick={handleMainStoryClick}
                            style={{ cursor: 'pointer' }}
                        >
                            <BookOpen className={STRUCTURE_STYLES.itemIcon} />
                            <div className={STRUCTURE_STYLES.itemContent}>
                                <div className={STRUCTURE_STYLES.itemTitle}>
                                    {projectTitle || '메인 스토리'}
                                </div>
                                <div className={STRUCTURE_STYLES.itemType}>프로젝트 메인 컨텐츠</div>
                                {mainContent && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {mainContent.substring(0, 100)}
                                        {mainContent.length > 100 && '...'}
                                    </div>
                                )}
                                {!mainContent && (
                                    <div className="text-xs text-muted-foreground italic mt-1">
                                        Write 탭에서 메인 스토리를 작성해보세요
                                    </div>
                                )}
                            </div>
                            <div className="text-xs text-muted-foreground flex flex-col items-end">
                                <span>{writerStats?.wordCount || 0} 단어</span>
                                {writerStats?.charCount && (
                                    <span className="text-xs text-muted-foreground/80">
                                        {writerStats.charCount} 자
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};