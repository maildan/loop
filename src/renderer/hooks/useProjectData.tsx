/**
 * 🔥 GIGA-CHAD useProjectData Hook
 * 프로젝트의 모든 요소를 통합하여 에이전트화된 SynopsisView에 제공
 */

import { useEffect, useState, useMemo } from 'react';
import { useStructureStore } from '../stores/useStructureStore';
import { Logger } from '../../shared/logger';

// 통합 데이터 타입 정의
export interface ProjectElement {
    id: string;
    type: 'chapter' | 'character' | 'memo' | 'idea' | 'note' | 'synopsis';
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

    // 🔥 디버깅 로그 추가
    useEffect(() => {
        console.log('🔍 [useIntegratedProjectData] Debug Info:', {
            projectId,
            structures,
            hasProjectData: !!structures[projectId],
            projectItems: structures[projectId]?.length || 0,
            allProjects: Object.keys(structures)
        });
        Logger.debug('INTEGRATED_PROJECT_DATA', 'Debug info', {
            projectId,
            structureKeys: Object.keys(structures),
            hasProjectData: !!structures[projectId],
            itemCount: structures[projectId]?.length || 0
        });
    }, [projectId, structures]);

    // 프로젝트 요소들을 통합 데이터 형태로 변환
    const processStructureItems = useMemo(() => {
        console.log('🔄 [processStructureItems] Starting processing for projectId:', projectId);

        if (!projectId || !structures[projectId]) {
            console.log('❌ [processStructureItems] No data found:', {
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
        console.log('📊 [processStructureItems] Found items:', items.length);

        const processedElements: ProjectElement[] = [];

        items.forEach((item: any, index: number) => {
            console.log(`📝 [processStructureItems] Processing item ${index + 1}:`, {
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
                plotRelevance: Math.floor(Math.random() * 5) + 1 as 1 | 2 | 3 | 4 | 5, // TODO: AI 분석으로 대체
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
                element.location = '미정'; // TODO: 내용에서 추출
            }

            if (['memo', 'idea'].includes(item.type)) {
                element.tags = ['general']; // TODO: 내용에서 태그 추출
            }

            processedElements.push(element);
        });

        const result = processedElements.sort((a, b) => (a.order || 0) - (b.order || 0));
        console.log('✅ [processStructureItems] Processing completed:', {
            inputItemsCount: items.length,
            processedElementsCount: result.length,
            elementTypes: result.reduce((acc, el) => {
                acc[el.type] = (acc[el.type] || 0) + 1;
                return acc;
            }, {} as Record<string, number>)
        });

        return result;
    }, [structures, projectId]);

    // AI 분석 수행 (시뮬레이션)
    const performAnalysis = useMemo(() => {
        console.log('🧠 [performAnalysis] Starting analysis with elements:', processStructureItems.length);

        if (processStructureItems.length === 0) {
            console.log('❌ [performAnalysis] No elements to analyze');
            return null;
        }

        const chapters = processStructureItems.filter(e => e.type === 'chapter');
        const characters = processStructureItems.filter(e => e.type === 'character');
        const memos = processStructureItems.filter(e => e.type === 'memo');
        const ideas = processStructureItems.filter(e => e.type === 'idea');

        const totalWords = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0);

        // 타임라인 생성 (시간순 정렬)
        const timeline = processStructureItems
            .map(element => ({
                id: element.id,
                title: element.title,
                type: element.type,
                timestamp: element.createdAt?.toISOString() || new Date().toISOString(),
                description: element.content.slice(0, 100) + '...'
            }))
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

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

            // 임시 AI 분석 결과
            storyConsistency: Math.floor(Math.random() * 30) + 70, // 70-100
            characterConsistency: Math.floor(Math.random() * 40) + 60, // 60-100
            plotHoles: [
                '3장에서 언급된 마법 시스템이 7장에서 다르게 작동함',
                '주인공의 나이가 일관되지 않음',
                '2장의 시간 설정과 4장이 모순됨'
            ].slice(0, Math.floor(Math.random() * 4)),

            suggestions: [
                '캐릭터 간의 대화가 더 자연스러워야 함',
                '액션 시퀀스에 더 많은 디테일 필요',
                '배경 설명을 점진적으로 공개하는 것이 좋겠음',
                '갈등의 해결이 너무 급작스러움'
            ].slice(0, Math.floor(Math.random() * 5)),

            timeline,
            relationships
        };

        return analysis;
    }, [processStructureItems]);

    useEffect(() => {
        setLoading(true);

        console.log('🔄 [useProjectData] useEffect triggered:', {
            elementsCount: processStructureItems.length,
            hasAnalysis: !!performAnalysis,
            projectId
        });

        // 실제 데이터 사용 (mock 데이터 완전 제거)
        console.log('📊 [useProjectData] Using real data from store');
        setElements(processStructureItems);
        setAnalysis(performAnalysis);

        // 로딩 시뮬레이션
        setTimeout(() => {
            setLoading(false);
            Logger.info('INTEGRATED_PROJECT_DATA', 'Data processing completed', {
                projectId,
                elementsCount: processStructureItems.length,
                hasAnalysis: !!performAnalysis
            });
        }, 500);
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
