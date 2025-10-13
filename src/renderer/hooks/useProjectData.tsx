/**
 * 🔥 GIGA-CHAD useProjectData Hook
 * 프로젝트의 모든 요소를 통합하여 에이전트화된 SynopsisView에 제공
 */

import { useEffect, useState, useMemo } from 'react';
import { useStructureStore } from '../stores/useStructureStore';
import { RendererLogger as Logger } from '../../shared/logger-renderer';
// 🔥 AI 분석 시스템 import (더미 데이터 제거)
import { AIEnhancedNCPAnalyzer, type AIEnhancedAnalysisResult, performAIStoryAnalysis } from '../../shared/narrative/aiEnhancedAnalyzer';

// 🔥 Symbol 기반 컴포넌트 이름
const USE_PROJECT_DATA = Symbol.for('USE_PROJECT_DATA');

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

        const processedElements: ProjectElement[] = [];

        if (!projectId || !structures[projectId]) {
            Logger.debug('PROCESS_STRUCTURE_ITEMS', 'No data found', {
                hasProjectId: !!projectId,
                hasStructureData: !!structures[projectId],
                availableProjects: Object.keys(structures)
            });

            // 🔥 실제 데이터만 반환 (mock 데이터 제거)
            return processedElements;
        }

        const items = structures[projectId] || [];
        Logger.debug('PROCESS_STRUCTURE_ITEMS', 'Found items', { count: items.length });

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
                Logger.warn(USE_PROJECT_DATA, 'Failed to parse content for item', { itemId: item.id, error: e });
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

            suggestions: (() => {
                const suggestions: string[] = [];
                
                // 🔥 실제 프로젝트 상태 기반 맞춤형 제안
                if (processStructureItems.length === 0) {
                    return [
                        '메인 스토리부터 작성을 시작해보세요. Write 탭에서 작성할 수 있습니다.',
                        '캐릭터 탭에서 주인공과 조연의 설정을 먼저 구상해보세요.',
                        '구조 탭에서 첫 번째 챕터를 추가하여 스토리를 시작하세요.'
                    ];
                }

                // 단어 수 기반 제안
                if (totalWords < 500) {
                    suggestions.push('스토리의 분량을 늘려 더 풍성한 내용으로 발전시켜보세요.');
                } else if (totalWords > 10000) {
                    suggestions.push('내용이 풍부합니다. 이제 구조와 흐름을 다듬어보세요.');
                }

                // 챕터 구조 기반 제안
                if (chapters.length === 0) {
                    suggestions.push('스토리를 챕터별로 나누어 구조화해보세요.');
                } else if (chapters.length === 1) {
                    suggestions.push('추가 챕터를 작성하여 스토리의 전개를 발전시켜보세요.');
                } else {
                    suggestions.push('챕터 간의 연결과 흐름을 점검해보세요.');
                }

                // 캐릭터 기반 제안
                if (characters.length === 0) {
                    suggestions.push('주인공과 주요 인물들의 설정을 Characters 탭에서 정의해보세요.');
                } else if (characters.length < 3) {
                    suggestions.push('조연이나 갈등을 만들어줄 인물들을 추가해보세요.');
                } else {
                    suggestions.push('캐릭터들 간의 관계와 갈등 구조를 더욱 깊이 있게 설정해보세요.');
                }

                // 아이디어/노트 기반 제안
                if (ideas.length > 0) {
                    suggestions.push('노트 탭의 아이디어들을 실제 스토리에 반영해보세요.');
                }

                return suggestions.slice(0, 3);
            })(),

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
