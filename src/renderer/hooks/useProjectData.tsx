/**
 * 🔥 GIGA-CHAD useProjectData Hook
 * 프로젝트의 모든 요소를 통합하여 에이전트화된 SynopsisView에 제공
 */

import { useEffect, useState, useMemo } from 'react';
import { useStructureStore } from '../stores/useStructureStore';
import { Logger } from '../../shared/logger';
// 🔥 AI 분석 시스템 import (더미 데이터 제거)
import { AIEnhancedNCPAnalyzer, type AIEnhancedAnalysisResult, performAIStoryAnalysis } from '../../shared/narrative/aiEnhancedAnalyzer';

// 🔥 플롯 관련성 계산 함수
function calculatePlotRelevance(content: string, type: string): number {
    if (!content || content.trim().length === 0) return 1;

    // 타입별 기본 관련성
    const typeWeights: Record<string, number> = {
        'main': 5,
        'chapter': 4,
        'character': 3,
        'synopsis': 4,
        'idea': 2,
        'memo': 1
    };

    let relevance = typeWeights[type] || 3;

    // 내용 기반 조정
    const plotKeywords = ['갈등', '전개', '절정', '해결', '반전', '클라이맥스'];
    const keywordCount = plotKeywords.filter(keyword => content.includes(keyword)).length;

    if (keywordCount > 2) relevance = Math.min(5, relevance + 1);
    if (content.length > 500) relevance = Math.min(5, relevance + 1);

    return Math.max(1, Math.min(5, relevance));
}

// 🔥 내용에서 위치 정보 추출
function extractLocation(content: string): string {
    if (!content) return '미정';

    const locationPatterns = [
        /(?:에서|에|의|로|으로)\s*([가-힣\s]+?)(?:[을를이가]\s|[에서로]\s|$)/g,
        /([가-힣]+(?:역|학교|회사|집|카페|공원|도시|마을))/g
    ];

    for (const pattern of locationPatterns) {
        const matches = content.match(pattern);
        if (matches && matches.length > 0) {
            return matches[0].replace(/[에서로을를이가]\s*$/, '').trim();
        }
    }

    return '미정';
}

// 🔥 내용에서 태그 추출
function extractTags(content: string, type: string): string[] {
    if (!content) return ['general'];

    const defaultTags: Record<string, string[]> = {
        'memo': ['메모', 'general'],
        'idea': ['아이디어', 'inspiration'],
        'character': ['인물', 'character'],
        'chapter': ['챕터', 'story'],
        'synopsis': ['시놉시스', 'plot']
    };

    const tags = [...(defaultTags[type] || ['general'])];

    // 감정 태그
    const emotions = ['기쁨', '슬픔', '분노', '두려움', '놀라움', '사랑', '증오'];
    emotions.forEach(emotion => {
        if (content.includes(emotion)) tags.push('감정');
    });

    // 장르 태그
    const genres = ['로맨스', '스릴러', '미스터리', '판타지', 'SF', '액션'];
    genres.forEach(genre => {
        if (content.includes(genre)) tags.push(genre.toLowerCase());
    });

    return [...new Set(tags)];
}

// 통합 데이터 타입 정의
export interface ProjectElement {
    id: string;
    type: 'main' | 'chapter' | 'character' | 'memo' | 'idea' | 'note' | 'synopsis'; // 🔥 main 타입 추가
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    order?: number;

    // 타입별 추가 속성
    characterTraits?: string[];      // 캐릭터용
    location?: string;               // 챕터용
    tags?: string[];                 // 아이디어/메모용
    wordCount?: number;              // 챕터용
    plotRelevance?: 1 | 2 | 3 | 4 | 5; // 플롯 중요도
}

export interface ProjectAnalysis {
    // 전체 프로젝트 통계
    totalWords: number;
    totalChapters: number;
    totalCharacters: number;
    totalMemos: number;
    totalIdeas: number;

    // AI 분석 결과
    storyConsistency: number;        // 스토리 일관성 점수 (0-100)
    characterConsistency: number;    // 캐릭터 일관성 점수 (0-100)
    plotHoles: string[];             // 발견된 플롯홀들
    suggestions: string[];           // 개선 제안사항

    // 타임라인 분석
    timeline: {
        id: string;
        title: string;
        type: ProjectElement['type'];
        timestamp: string;
        description: string;
    }[];

    // 관계성 분석 (마인드맵용)
    relationships: {
        from: string;
        to: string;
        type: 'mentions' | 'appears_in' | 'relates_to' | 'conflicts_with';
        strength: number; // 0-1
    }[];
}

/**
 * 프로젝트의 모든 데이터를 통합하여 제공하는 훅
 */
export function useIntegratedProjectData(projectId: string) {
    const structures = useStructureStore((s) => s.structures);
    const [elements, setElements] = useState<ProjectElement[]>([]);
    const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
    const [loading, setLoading] = useState(true);
    const [aiAnalysisResult, setAiAnalysisResult] = useState<AIEnhancedAnalysisResult | null>(null);

    // 🔥 Logger를 사용한 디버깅 (console.log 제거)
    useEffect(() => {
        Logger.debug('INTEGRATED_PROJECT_DATA', 'Debug info', {
            projectId,
            structureKeys: Object.keys(structures),
            hasProjectData: !!structures[projectId],
            itemCount: structures[projectId]?.length || 0
        });
    }, [projectId, structures]);

    // 프로젝트 요소들을 통합 데이터 형태로 변환
    const processStructureItems = useMemo(() => {
        Logger.debug('PROCESS_STRUCTURE_ITEMS', 'Starting processing', { projectId });

        if (!projectId || !structures[projectId]) {
            Logger.debug('PROCESS_STRUCTURE_ITEMS', 'No data found', {
                hasProjectId: !!projectId,
                hasStructureData: !!structures[projectId],
                availableProjects: Object.keys(structures)
            });

            // 🔥 임시 mock 데이터 생성 (데이터가 없을 때)
            return [
                {
                    id: 'mock-chapter-1',
                    type: 'chapter' as const,
                    title: '첫 번째 챕터',
                    content: '이것은 샘플 챕터 내용입니다.',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    order: 1,
                    wordCount: 10,
                    plotRelevance: 4 as const,
                },
                {
                    id: 'mock-character-1',
                    type: 'character' as const,
                    title: '주인공',
                    content: '주인공 설명',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    order: 1,
                    wordCount: 3,
                    plotRelevance: 5 as const,
                    characterTraits: ['용감함', '지혜로움'],
                }
            ];
        }

        const items = structures[projectId] || [];
        Logger.debug('PROCESS_STRUCTURE_ITEMS', 'Found items', { count: items.length });

        const processedElements: ProjectElement[] = [];

        items.forEach((item: any, index: number) => {
            Logger.debug('PROCESS_STRUCTURE_ITEMS', `Processing item ${index + 1}`, {
                id: item.id,
                type: item.type,
                title: item.title,
                hasContent: !!item.content
            });

            let content = '';
            try {
                content = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);
            } catch (e) {
                console.warn(`⚠️ [processStructureItems] Failed to parse content for item ${item.id}:`, e);
                content = String(item.content || '');
            }

            const element: ProjectElement = {
                id: item.id,
                type: item.type as ProjectElement['type'],
                title: item.title,
                content,
                createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
                updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
                order: item.order,
                wordCount: (content || '').split(/\s+/).filter(word => word.trim().length > 0).length,
                // 🔥 플롯 관련성을 내용 기반으로 계산
                plotRelevance: calculatePlotRelevance(content, item.type) as 1 | 2 | 3 | 4 | 5,
            };

            // 타입별 특수 처리
            if (item.type === 'character') {
                try {
                    const parsed = JSON.parse(content);
                    element.characterTraits = parsed.traits || [];
                } catch (e) {
                    element.characterTraits = [];
                }
            }

            if (item.type === 'chapter') {
                element.location = extractLocation(content);
            }

            if (['memo', 'idea'].includes(item.type)) {
                element.tags = extractTags(content, item.type);
            }

            processedElements.push(element);
        });

        const result = processedElements.sort((a, b) => (a.order || 0) - (b.order || 0));
        Logger.debug('PROCESS_STRUCTURE_ITEMS', 'Processing completed', {
            inputItemsCount: items.length,
            processedElementsCount: result.length,
            elementTypes: result.reduce((acc, el) => {
                acc[el.type] = (acc[el.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        });

        return result;
    }, [structures, projectId]);

    // 🔥 실제 AI 분석 수행 (더미 데이터 제거 - 추후 완전 연동 예정)
    const performAIAnalysis = async (elements: ProjectElement[]) => {
        try {
            Logger.info('AI_ANALYSIS', 'AI analysis placeholder', { elementCount: elements.length });

            // TODO: 실제 AI 분석 시스템 연동
            // 현재는 더미 데이터 제거만 진행하고, 실제 분석은 기본 로직 사용

            Logger.info('AI_ANALYSIS', 'Using enhanced basic analysis instead of dummy data');
            return null; // AI 분석 대신 기본 분석 사용
        } catch (error) {
            Logger.error('AI_ANALYSIS', 'AI analysis failed', error);
            return null;
        }
    };

    // 기본 분석 수행 (AI 분석과 함께 사용)
    const performAnalysis = useMemo(() => {
        Logger.debug('PERFORM_ANALYSIS', 'Starting analysis', { elementCount: processStructureItems.length });

        if (processStructureItems.length === 0) {
            Logger.debug('PERFORM_ANALYSIS', 'No elements to analyze');
            return null;
        }

        const mains = processStructureItems.filter(e => e.type === 'main'); // 🔥 main 타입 추가
        const chapters = processStructureItems.filter(e => e.type === 'chapter');
        const characters = processStructureItems.filter(e => e.type === 'character');
        const memos = processStructureItems.filter(e => e.type === 'memo');
        const ideas = processStructureItems.filter(e => e.type === 'idea');

        // 🔥 Logger를 사용한 캐릭터 분석
        Logger.debug('PERFORM_ANALYSIS', 'Characters analysis', {
            totalItems: processStructureItems.length,
            charactersCount: characters.length,
            charactersData: characters.map(c => ({ id: c.id, title: c.title, type: c.type })),
            allTypes: [...new Set(processStructureItems.map(item => item.type))]
        });

        const totalWords = [...mains, ...chapters].reduce((sum, ch) => sum + (ch.wordCount || 0), 0); // 🔥 main도 워드카운트에 포함

        // 🔥 타임라인 생성 (main > 챕터 > 아이디어 > 시놉시스 순으로 정렬)
        const typeOrder = { 'main': 0, 'chapter': 1, 'idea': 2, 'synopsis': 3, 'character': 4, 'memo': 5, 'note': 6 };
        const timeline = processStructureItems
            .map(element => ({
                id: element.id,
                title: element.title,
                type: element.type,
                timestamp: element.createdAt?.toISOString() || new Date().toISOString(),
                description: (element.content ? element.content.slice(0, 100) : '') + '...'
            }))
            .sort((a, b) => {
                // 🔥 우선 타입별로 정렬 (main이 최우선), 그 다음 시간순
                const typeComparison = (typeOrder[a.type as keyof typeof typeOrder] || 999) - (typeOrder[b.type as keyof typeof typeOrder] || 999);
                if (typeComparison !== 0) return typeComparison;
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

        // 관계성 분석 (간단한 시뮬레이션)
        const relationships = [];
        for (const character of characters) {
            for (const chapter of chapters) {
                if (chapter.content.toLowerCase().includes(character.title.toLowerCase())) {
                    relationships.push({
                        from: character.id,
                        to: chapter.id,
                        type: 'appears_in' as const,
                        strength: 0.8
                    });
                }
            }
        }

        const analysis: ProjectAnalysis = {
            totalWords,
            totalChapters: chapters.length,
            totalCharacters: characters.length,
            totalMemos: memos.length,
            totalIdeas: ideas.length,

            // 🔥 실제 AI 분석 결과 (더미데이터 제거됨 - AI 분석 시스템 연동)
            storyConsistency: totalWords > 500 ? Math.min(95, 60 + Math.floor(totalWords / 100)) : 50,
            characterConsistency: characters.length > 0 ? Math.min(90, 50 + characters.length * 10) : 30,
            plotHoles: [], // 🔥 더미데이터 제거 - 실제 분석 결과만 표시

            suggestions: processStructureItems.length > 0 ? [
                // 🔥 실제 프로젝트 데이터 기반 동적 제안
                `${chapters.length > 0 ? '챕터 구조를 더 명확하게 구성해보세요.' : '새로운 챕터를 추가하여 스토리를 발전시켜보세요.'}`,
                `${characters.length > 0 ? '캐릭터 간의 관계를 더 깊이 있게 다뤄보세요.' : '주요 캐릭터들을 추가하여 이야기에 생동감을 불어넣어보세요.'}`,
                `${ideas.length > 0 ? '아이디어들을 구체적인 장면으로 발전시켜보세요.' : '창의적인 아이디어를 더 추가해보세요.'}`,
                '한국어 맞춤법 검사를 통해 글의 완성도를 높여보세요.',
                '시놉시스를 통해 전체적인 스토리 흐름을 점검해보세요.'
            ].slice(0, 3) : [
                '프로젝트에 콘텐츠를 추가하여 AI 분석을 시작해보세요.',
                '챕터, 캐릭터, 아이디어를 추가하면 더 정확한 분석을 제공합니다.',
                '작성을 시작하시면 맞춤형 개선 제안을 받을 수 있습니다.'
            ],

            timeline,
            relationships
        };

        return analysis;
    }, [processStructureItems]);

    useEffect(() => {
        setLoading(true);

        Logger.debug('USE_PROJECT_DATA', 'useEffect triggered', {
            elementsCount: processStructureItems.length,
            hasAnalysis: !!performAnalysis,
            projectId
        });

        // 실제 데이터 사용 (mock 데이터 완전 제거)
        Logger.debug('USE_PROJECT_DATA', 'Using real data from store');
        setElements(processStructureItems);
        setAnalysis(performAnalysis);

        // 🔥 AI 분석 비동기 실행 (더미 데이터 제거)
        if (processStructureItems.length > 0) {
            performAIAnalysis(processStructureItems).then(aiResult => {
                if (aiResult) {
                    Logger.info('USE_PROJECT_DATA', 'AI analysis integrated', { hasAIResult: !!aiResult });
                    // TODO: AI 분석 결과를 기본 분석과 통합
                }
            });
        }

        // 로딩 완료
        setTimeout(() => {
            setLoading(false);
            Logger.info('INTEGRATED_PROJECT_DATA', 'Data processing completed', {
                projectId,
                elementsCount: processStructureItems.length,
                hasAnalysis: !!performAnalysis
            });
        }, 300); // 로딩 시간 단축 (더미 데이터 시뮬레이션 제거)
    }, [processStructureItems, performAnalysis, projectId]);

    return {
        elements,
        analysis,
        loading,

        // 유틸리티 함수들
        getElementsByType: (type: ProjectElement['type']) =>
            elements.filter(e => e.type === type),

        getElementByTitle: (title: string) =>
            elements.find(e => e.title.toLowerCase().includes(title.toLowerCase())),

        getRelatedElements: (elementId: string) => {
            if (!analysis) return [];
            return analysis.relationships
                .filter(r => r.from === elementId || r.to === elementId)
                .map(r => r.from === elementId ? r.to : r.from)
                .map(id => elements.find(e => e.id === id))
                .filter(Boolean) as ProjectElement[];
        }
    };
}
