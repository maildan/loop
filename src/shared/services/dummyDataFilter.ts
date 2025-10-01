// 🔥 더미데이터 완전 제거를 위한 실시간 필터링 시스템
// development-rules.yml 기반 엄격한 검증 로직

import { Logger } from '../logger';

/**
 * 금지된 더미 요소들 (development-rules.yml 기반)
 */
const FORBIDDEN_PATTERNS = {
    // 챕터 번호 관련
    chapter_references: [
        /[1-9]장/g,
        /\d+장/g,
        /[1-9]챕터/g,
        /\d+챕터/g,
        /첫\s*번째\s*장/g,
        /두\s*번째\s*장/g,
        /세\s*번째\s*장/g,
        /마지막\s*장/g,
        /Chapter\s*[1-9]/gi,
        /Chapter\s*\d+/gi,
        /Episode\s*[1-9]/gi,
        /Part\s*[1-9]/gi,
        /상편|중편|하편/g,
        /프롤로그|에필로그/g
    ],

    // 가상의 스토리 요소들
    generic_story_elements: [
        /마법\s*시스템/g,
        /마법사|마법\s*아이템/g,
        /캐릭터\s*대화/g,
        /대화\s*장면/g,
        /액션\s*시퀀스/g,
        /전투\s*장면/g,
        /로맨스\s*라인/g,
        /러브\s*스토리/g,
        /반전\s*요소/g,
        /트위스트/g,
        /케이라의?\s*배신/g,
        /케이라/g,
        /데이터\s*획득/g,
        /해킹/g,
        /사이버/g,
        /주인공의?\s*여정/g,
        /히어로\s*저니/g,
        /조력자/g,
        /멘토/g,
        /안타고니스트/g
    ],

    // 일반적인 조언들
    generic_advice: [
        /일반적인\s*스토리텔링/g,
        /베스트셀러\s*공식/g,
        /독자\s*몰입\s*기법/g,
        /문학적\s*기교/g,
        /창작\s*이론/g,
        /장르적\s*관습/g
    ]
} as const;

/**
 * AI 응답에서 더미데이터 감지 및 제거
 */
export class DummyDataFilter {
    private static instance: DummyDataFilter;

    public static getInstance(): DummyDataFilter {
        if (!DummyDataFilter.instance) {
            DummyDataFilter.instance = new DummyDataFilter();
        }
        return DummyDataFilter.instance;
    }

    /**
     * 텍스트에서 더미 패턴 감지
     */
    public detectDummyContent(text: string): {
        hasDummyContent: boolean;
        detectedPatterns: Array<{ category: string; pattern: string; matches: string[] }>;
        cleanedText: string;
    } {
        const detectedPatterns: Array<{ category: string; pattern: string; matches: string[] }> = [];
        let cleanedText = text;

        // 각 카테고리별로 패턴 검사
        Object.entries(FORBIDDEN_PATTERNS).forEach(([category, patterns]) => {
            patterns.forEach(pattern => {
                const matches = text.match(pattern);
                if (matches && matches.length > 0) {
                    detectedPatterns.push({
                        category,
                        pattern: pattern.toString(),
                        matches: [...new Set(matches)] // 중복 제거
                    });

                    // 텍스트에서 해당 패턴 제거
                    cleanedText = cleanedText.replace(pattern, '[데이터 기반 분석 필요]');
                }
            });
        });

        const hasDummyContent = detectedPatterns.length > 0;

        if (hasDummyContent) {
            Logger.warn('DUMMY_DATA_FILTER', 'Dummy content detected and cleaned', {
                originalLength: text.length,
                cleanedLength: cleanedText.length,
                detectedPatterns: detectedPatterns.map(p => ({
                    category: p.category,
                    matches: p.matches
                }))
            });
        }

        return {
            hasDummyContent,
            detectedPatterns,
            cleanedText
        };
    }

    /**
     * AI 분석 결과 정화
     */
    public sanitizeAnalysisResult(result: unknown): {
        sanitizedResult: unknown;
        violationsFound: boolean;
        violationReport: Array<{ field: string; violations: string[] }>;
    } {
        const violationReport: Array<{ field: string; violations: string[] }> = [];
        const sanitizedResult = JSON.parse(JSON.stringify(result)); // deep clone

        // 재귀적으로 모든 문자열 필드 검사
        const sanitizeRecursive = (obj: unknown, path: string = ''): void => {
            if (typeof obj === 'string') {
                const detection = this.detectDummyContent(obj);
                if (detection.hasDummyContent) {
                    const violations = detection.detectedPatterns.flatMap(p => p.matches);
                    violationReport.push({ field: path, violations });

                    // 해당 필드를 정화된 텍스트로 교체
                    const pathParts = path.split('.');
                    let target: Record<string, unknown> = sanitizedResult as Record<string, unknown>;
                    for (let i = 0; i < pathParts.length - 1; i++) {
                        const key = pathParts[i];
                        if (key && target && typeof target === 'object') {
                            target = target[key] as Record<string, unknown>;
                        }
                    }
                    const lastKey = pathParts[pathParts.length - 1];
                    if (target && lastKey) {
                        target[lastKey] = detection.cleanedText;
                    }
                }
            } else if (Array.isArray(obj)) {
                obj.forEach((item, index) => {
                    sanitizeRecursive(item, path ? `${path}.${index}` : `${index}`);
                });
            } else if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
                Object.keys(obj).forEach(key => {
                    sanitizeRecursive((obj as Record<string, unknown>)[key], path ? `${path}.${key}` : key);
                });
            }
        };

        sanitizeRecursive(sanitizedResult);

        const violationsFound = violationReport.length > 0;

        if (violationsFound) {
            Logger.error('DUMMY_DATA_FILTER', 'Analysis result contained dummy data', {
                violationCount: violationReport.length,
                violationReport
            });
        }

        return {
            sanitizedResult,
            violationsFound,
            violationReport
        };
    }

    /**
     * 실시간 검증 - AI 응답 전 필터링
     */
    public validateResponse(response: string): {
        isValid: boolean;
        filteredResponse: string;
        violations: string[];
    } {
        const detection = this.detectDummyContent(response);
        const violations = detection.detectedPatterns.flatMap(p => p.matches);

        return {
            isValid: !detection.hasDummyContent,
            filteredResponse: detection.cleanedText,
            violations
        };
    }

    /**
     * 응급 상황 대응 - 더미데이터 완전 차단
     */
    public emergencyCleanup(text: string): string {
        let cleanedText = text;

        // 강력한 패턴 매칭으로 모든 더미 요소 제거
        const emergencyPatterns = [
            /\d+장[^a-zA-Z가-힣]*?[가-힣]+/g,    // "3장: 내용" 패턴
            /Chapter\s*\d+[^a-zA-Z]*?[a-zA-Z]+/gi, // "Chapter 3: Content" 패턴  
            /케이라[^가-힣]*?배신/g,               // "케이라의 배신" 패턴
            /데이터[^가-힣]*?획득/g,               // "데이터 획득" 패턴
            /마법[^가-힣]*?시스템/g,               // "마법 시스템" 패턴
        ];

        emergencyPatterns.forEach(pattern => {
            cleanedText = cleanedText.replace(pattern, '[실제 프로젝트 데이터 기반 분석이 필요합니다]');
        });

        return cleanedText;
    }
}

/**
 * AI 분석 서비스에서 사용할 미들웨어
 */
export const aiResponseMiddleware = (response: string): string => {
    const filter = DummyDataFilter.getInstance();
    const validation = filter.validateResponse(response);

    if (!validation.isValid) {
        Logger.warn('AI_RESPONSE_MIDDLEWARE', 'Response contained dummy data', {
            violations: validation.violations
        });

        return validation.filteredResponse;
    }

    return response;
};

/**
 * 분석 결과 후처리 미들웨어
 */
export const analysisResultMiddleware = (result: unknown): unknown => {
    const filter = DummyDataFilter.getInstance();
    const sanitization = filter.sanitizeAnalysisResult(result);

    if (sanitization.violationsFound) {
        Logger.error('ANALYSIS_RESULT_MIDDLEWARE', 'Analysis result sanitized', {
            violationReport: sanitization.violationReport
        });
    }

    return sanitization.sanitizedResult;
};
