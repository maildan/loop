// 🔥 한국 웹소설 특화 분석 모듈
// 2025년 웹소설 시장 트렌드 및 장르별 특성 기반

import { Logger } from '../logger';
import {
    analyzeNarrativeKeywords,
    buildKeywordInsightPrompt,
    type NarrativeKeywordInsight,
} from './keywordSets';

/**
 * 🔥 한국 웹소설 장르 타입
 * - 여성향: 로맨스판타지, 로맨스, BL
 * - 남성향: 현대판타지, 판타지, 무협
 */
export type KoreanWebNovelGenre =
    | 'romance-fantasy' // 로맨스판타지 (로판)
    | 'romance' // 로맨스
    | 'bl' // BL (Boys Love)
    | 'modern-fantasy' // 현대판타지 (현판)
    | 'hunter' // 헌터물
    | 'fantasy' // 판타지
    | 'martial-arts' // 무협
    | 'historical' // 사극
    | 'unknown'; // 미분류

/**
 * 🔥 장르별 주요 클리셰 및 키워드 (2025년 트렌드)
 */
export interface GenreCliche {
    genre: KoreanWebNovelGenre;
    cliches: string[];
    keywords: string[];
    targetAudience: '여성향' | '남성향' | '중립';
    popularAge: string;
}

/**
 * 🔥 5막 구조 (한국식 기승전결 + 도입)
 * - 영미권 3막 구조와 달리 한국 전통 서사 구조
 */
export interface FiveActStructure {
    intro: { start: number; end: number; description: string }; // 도입: 배경 설정
    rising: { start: number; end: number; description: string }; // 발단: 사건 시작
    development: { start: number; end: number; description: string }; // 전개: 갈등 심화
    climax: { start: number; end: number; description: string }; // 절정: 최고조
    conclusion: { start: number; end: number; description: string }; // 결말: 해결
    cliffhangers: CliffhangerPoint[]; // 연재형 클리프행어
}

/**
 * 🔥 클리프행어 포인트 (웹소설 연재 특화)
 */
export interface CliffhangerPoint {
    position: number;
    type: 'revelation' | 'danger' | 'emotional' | 'mystery';
    description: string;
    intensity: number; // 1-10 scale
}

/**
 * 🔥 MBTI 기반 캐릭터 프로필
 */
export interface MBTICharacterProfile {
    mbtiType: string; // 예: "ISTJ", "ENFP"
    coreTrait: string; // 핵심 성격 특성
    coreConflict: string; // 핵심 갈등
    growthPath: string; // 성장 방향
    idealRole: '주인공' | '조연' | '악역' | '멘토' | '라이벌';
    relationshipStyle: string; // 관계 스타일
    exampleCharacters: string[]; // 유명 캐릭터 예시
}

/**
 * 🔥 시놉시스 분석 결과
 */
export interface SynopsisAnalysis {
    genre: KoreanWebNovelGenre;
    detectedCliches: string[]; // 탐지된 클리셰
    missingElements: string[]; // 누락된 필수 요소
    keywordScore: number; // 키워드 매력도 (0-100)
    targetAudience: string; // 주 타겟 독자층
    recommendations: string[]; // 개선 제안
    genreConsistency: number; // 장르 일관성 (0-100)
    narrativeInsights: NarrativeKeywordInsight[];
    keywordGuidance: string;
}

/**
 * 🔥 한국 웹소설 분석기 클래스
 */
export class KoreanWebNovelAnalyzer {
    private static readonly COMPONENT_NAME = 'KOREAN_WEBNOVEL_ANALYZER';

    /**
     * 🔥 장르별 클리셰 및 키워드 데이터베이스 (2025년 트렌드 기반)
     */
    private static readonly GENRE_DATABASE: GenreCliche[] = [
        {
            genre: 'romance-fantasy',
            cliches: [
                '회귀', '빙의', '악녀', '성녀', '황후', '황녀', '공녀', '공작', '황제',
                '집착', '계약결혼', '재혼', '이혼', '후궁', '역하렘', '능력각성',
                '마법', '황실', '귀족', '비밀신분', '운명적만남'
            ],
            keywords: [
                '황후', '황제', '공작', '악녀', '회귀', '빙의', '집착', '계약',
                '마법', '황실', '귀족', '이혼', '재혼', '후궁', '은밀', '우연'
            ],
            targetAudience: '여성향',
            popularAge: '20-30대'
        },
        {
            genre: 'romance',
            cliches: [
                '계약연애', '소개팅', '동거', '사내연애', '재벌', '비서', '팀장',
                '신분차이', '짝사랑', '연하남', '연상녀', '삼각관계', '첫사랑',
                '이혼녀', '싱글맘', '싱글대디', '육아', '동창', '미스터리남'
            ],
            keywords: [
                '사내연애', '계약', '재벌', '비서', '동거', '소개팅', '짝사랑',
                '연하', '연상', '이혼', '싱글', '육아', '팀장', '실장', '사장'
            ],
            targetAudience: '여성향',
            popularAge: '20-40대'
        },
        {
            genre: 'modern-fantasy',
            cliches: [
                '헌터', '던전', '각성', '상태창', '레벨업', '아이템', '스킬',
                '길드', '랭크', 'S급', 'SSS급', '회귀', '재생', '능력자',
                '이세계', '전이', '포탈', '몬스터', '레이드', '솔로플레이'
            ],
            keywords: [
                '헌터', '던전', '각성', '상태창', '레벨', '스킬', '길드',
                'S급', '능력', '이세계', '회귀', '시스템', '퀘스트', '포탈'
            ],
            targetAudience: '남성향',
            popularAge: '10-30대'
        },
        {
            genre: 'hunter',
            cliches: [
                '최약체', '성장형', '숨겨진능력', '독보적', '레벨업', '던전',
                '보스몬스터', '히든클래스', '유니크스킬', '협회', '랭킹',
                '국가간전쟁', '세계위기', '각성자', '사냥꾼', '게이트'
            ],
            keywords: [
                '헌터', '각성', '던전', '레벨', '스킬', '랭크', '길드',
                '몬스터', '레이드', 'S급', '능력자', '게이트', '포탈'
            ],
            targetAudience: '남성향',
            popularAge: '10-20대'
        },
        {
            genre: 'fantasy',
            cliches: [
                '용사', '마왕', '엘프', '드워프', '마법사', '검사', '암살자',
                '파티', '던전', '마법진', '정령', '드래곤', '이세계', '전이',
                '소환', '레벨업', '스킬트리', '마탑', '길드', '모험가'
            ],
            keywords: [
                '마법', '검술', '용사', '마왕', '엘프', '드래곤', '정령',
                '이세계', '던전', '모험', '파티', '레벨', '스킬', '마탑'
            ],
            targetAudience: '남성향',
            popularAge: '10-30대'
        },
        {
            genre: 'martial-arts',
            cliches: [
                '무림', '강호', '문파', '정파', '사파', '마교', '무공',
                '절정고수', '회귀', '환생', '빙의', '무림맹', '천하제일',
                '비급', '내공', '검법', '장법', '권법', '암기', '복수', '강시'
            ],
            keywords: [
                '무림', '강호', '문파', '정파', '사파', '마교', '무공',
                '고수', '절정', '검', '장', '권', '내공', '비급', '복수'
            ],
            targetAudience: '남성향',
            popularAge: '30-50대'
        }
    ];

    /**
     * 🔥 MBTI 유형별 캐릭터 프로필 데이터베이스
     */
    private static readonly MBTI_PROFILES: MBTICharacterProfile[] = [
        {
            mbtiType: 'ISTJ',
            coreTrait: '책임감, 실용성, 전통 존중',
            coreConflict: '일과 삶의 균형, 과거 트라우마 직면',
            growthPath: '유연성 획득, 감정 표현 학습',
            idealRole: '조연',
            relationshipStyle: '신뢰 기반, 안정 추구',
            exampleCharacters: ['집사', '기사단장', '관리자', '보좌관']
        },
        {
            mbtiType: 'ISFJ',
            coreTrait: '헌신, 배려, 실용적 지원',
            coreConflict: '자신의 욕구 vs 타인의 기대',
            growthPath: '자기 가치 발견, 독립성 주장',
            idealRole: '조연',
            relationshipStyle: '온화한 지원자',
            exampleCharacters: ['시녀', '비서', '간호사', '보호자']
        },
        {
            mbtiType: 'INFJ',
            coreTrait: '통찰력, 이상주의, 복잡한 내면',
            coreConflict: '이상 vs 현실, 자아 정체성 탐색',
            growthPath: '현실 수용, 자기 역할 이해',
            idealRole: '주인공',
            relationshipStyle: '깊은 공감, 선택적 친밀감',
            exampleCharacters: ['예언자', '현자', '치유사', '비밀 수호자']
        },
        {
            mbtiType: 'INTJ',
            coreTrait: '전략가, 독립적, 비전 지향',
            coreConflict: '개인 가치 vs 사회 규범',
            growthPath: '협력 학습, 감정 인정',
            idealRole: '주인공',
            relationshipStyle: '선택적 신뢰, 전략적 관계',
            exampleCharacters: ['전략가', '흑막', '천재 마법사', '냉철한 리더']
        },
        {
            mbtiType: 'ISTP',
            coreTrait: '실용적, 문제해결, 즉흥적',
            coreConflict: '내면 불안 직면',
            growthPath: '감정 수용, 장기 계획 능력',
            idealRole: '조연',
            relationshipStyle: '자유로운 협력자',
            exampleCharacters: ['암살자', '기술자', '모험가', '용병']
        },
        {
            mbtiType: 'ISFP',
            coreTrait: '예술적, 감성적, 자유로운 영혼',
            coreConflict: '열정 회복, 타인과의 관계',
            growthPath: '강점 드러내기, 용기 획득',
            idealRole: '조연',
            relationshipStyle: '온화한 지지자',
            exampleCharacters: ['예술가', '음악가', '자유민', '떠돌이']
        },
        {
            mbtiType: 'INFP',
            coreTrait: '이상주의, 창의성, 진정성 추구',
            coreConflict: '내면 vs 현실 간극',
            growthPath: '의미 있는 길 찾기, 소통 학습',
            idealRole: '주인공',
            relationshipStyle: '깊은 공감, 진정한 연결',
            exampleCharacters: ['시인', '꿈꾸는 자', '이상주의자', '순수한 영혼']
        },
        {
            mbtiType: 'INTP',
            coreTrait: '논리적, 분석적, 독창적',
            coreConflict: '생각 vs 현실 접점',
            growthPath: '실용성 개발, 감정 조정',
            idealRole: '조연',
            relationshipStyle: '논리적 협력',
            exampleCharacters: ['학자', '발명가', '연구자', '천재 책사']
        },
        {
            mbtiType: 'ESTP',
            coreTrait: '행동파, 리더십, 모험 추구',
            coreConflict: '고집 vs 유연성',
            growthPath: '적응력 향상, 협력 학습',
            idealRole: '주인공',
            relationshipStyle: '카리스마 리더',
            exampleCharacters: ['모험가', '전사', '사업가', '대담한 리더']
        },
        {
            mbtiType: 'ESFP',
            coreTrait: '사교적, 활기찬, 즉흥적',
            coreConflict: '관계 개선, 갈등 해결',
            growthPath: '소통 방법 찾기',
            idealRole: '조연',
            relationshipStyle: '밝은 에너자이저',
            exampleCharacters: ['연예인', '무희', '사교가', '분위기 메이커']
        },
        {
            mbtiType: 'ENFP',
            coreTrait: '열정적, 창의적, 다양성 추구',
            coreConflict: '쉬운 싫증, 집중력 부족',
            growthPath: '협력 학습, 꿈을 현실로',
            idealRole: '주인공',
            relationshipStyle: '영감을 주는 리더',
            exampleCharacters: ['모험가', '혁신가', '자유로운 영혼', '변혁자']
        },
        {
            mbtiType: 'ENTP',
            coreTrait: '창의적, 도전적, 논쟁 좋아함',
            coreConflict: '다양한 상황 속 자기 증명',
            growthPath: '통찰력 발휘, 협력 개발',
            idealRole: '라이벌',
            relationshipStyle: '지적 도전자',
            exampleCharacters: ['책사', '모사꾼', '혁명가', '천재 악당']
        },
        {
            mbtiType: 'ESTJ',
            coreTrait: '조직적, 실용적, 효율 추구',
            coreConflict: '강한 자존심, 불협화음',
            growthPath: '이상과 현실 조화, 협력 기술',
            idealRole: '멘토',
            relationshipStyle: '강력한 리더',
            exampleCharacters: ['군인', '관리자', '조직 리더', '엄격한 스승']
        },
        {
            mbtiType: 'ESFJ',
            coreTrait: '친절, 협력적, 조화 추구',
            coreConflict: '자신의 욕구 vs 타인의 기대',
            growthPath: '자기 가치 표현, 소통 개발',
            idealRole: '조연',
            relationshipStyle: '따뜻한 지원자',
            exampleCharacters: ['주막 주인', '마을 어른', '친구', '중재자']
        },
        {
            mbtiType: 'ENFJ',
            coreTrait: '카리스마, 공감, 영향력',
            coreConflict: '외부 인정 의존',
            growthPath: '내적 동기 발견, 타인 돕기',
            idealRole: '주인공',
            relationshipStyle: '영감을 주는 멘토',
            exampleCharacters: ['성직자', '지도자', '교사', '카리스마 지도자']
        },
        {
            mbtiType: 'ENTJ',
            coreTrait: '전략적, 야심찬, 목표 지향',
            coreConflict: '자신만의 길 찾기',
            growthPath: '실용적 전략 개발, 성공으로 가는 길',
            idealRole: '주인공',
            relationshipStyle: '강력한 리더',
            exampleCharacters: ['황제', '장군', 'CEO', '제왕적 리더']
        }
    ];

    /**
     * 🔥 텍스트에서 장르 탐지
     */
    static detectGenre(text: string, title?: string): KoreanWebNovelGenre {
        const combinedText = `${title || ''} ${text}`.toLowerCase();
        let maxScore = 0;
        let detectedGenre: KoreanWebNovelGenre = 'unknown';

        this.GENRE_DATABASE.forEach(genreData => {
            let score = 0;

            // 키워드 매칭
            genreData.keywords.forEach(keyword => {
                const regex = new RegExp(keyword, 'gi');
                const matches = combinedText.match(regex);
                if (matches) {
                    score += matches.length;
                }
            });

            // 클리셰 매칭 (가중치 2배)
            genreData.cliches.forEach(cliche => {
                if (combinedText.includes(cliche)) {
                    score += 2;
                }
            });

            if (score > maxScore) {
                maxScore = score;
                detectedGenre = genreData.genre;
            }
        });

        Logger.debug(this.COMPONENT_NAME, `Genre detected: ${detectedGenre} (score: ${maxScore})`);
        return detectedGenre;
    }

    /**
     * 🔥 탐지된 클리셰 목록 반환
     */
    static detectCliches(text: string, genre: KoreanWebNovelGenre): string[] {
        const genreData = this.GENRE_DATABASE.find(g => g.genre === genre);
        if (!genreData) return [];

        const detectedCliches: string[] = [];
        const lowerText = text.toLowerCase();

        genreData.cliches.forEach(cliche => {
            if (lowerText.includes(cliche)) {
                detectedCliches.push(cliche);
            }
        });

        return detectedCliches;
    }

    /**
     * 🔥 MBTI 유형 추천 (캐릭터 설명 기반)
     */
    static recommendMBTI(characterDescription: string): MBTICharacterProfile[] {
        const lowerDesc = characterDescription.toLowerCase();
        const recommendations: Array<{ profile: MBTICharacterProfile; score: number }> = [];

        this.MBTI_PROFILES.forEach(profile => {
            let score = 0;

            // 핵심 특성 매칭
            const traitKeywords = profile.coreTrait.split(',').map(t => t.trim().toLowerCase());
            traitKeywords.forEach(keyword => {
                if (lowerDesc.includes(keyword)) score += 3;
            });

            // 갈등 매칭
            if (lowerDesc.includes(profile.coreConflict.toLowerCase())) score += 2;

            // 역할 매칭
            if (lowerDesc.includes(profile.idealRole)) score += 1;

            if (score > 0) {
                recommendations.push({ profile, score });
            }
        });

        // 점수 기준 정렬 후 상위 3개 반환
        return recommendations
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(r => r.profile);
    }

    /**
     * 🔥 시놉시스 분석
     */
    static analyzeSynopsis(synopsis: string, title: string): SynopsisAnalysis {
        const genre = this.detectGenre(synopsis, title);
        const detectedCliches = this.detectCliches(synopsis, genre);
        const genreData = this.GENRE_DATABASE.find(g => g.genre === genre);
        const narrativeInsights = analyzeNarrativeKeywords([synopsis, title]);
        const keywordGuidance = buildKeywordInsightPrompt(narrativeInsights);

        // 누락된 필수 요소 체크
        const missingElements: string[] = [];
        if (!title || title.length < 3) missingElements.push('제목이 너무 짧습니다');
        if (synopsis.length < 100) missingElements.push('시놉시스가 너무 짧습니다 (최소 100자 권장)');
        if (detectedCliches.length === 0) missingElements.push('장르 특화 키워드가 부족합니다');

        // 키워드 점수 계산
        const keywordScore = Math.min(100, detectedCliches.length * 10);

        // 장르 일관성 점수
        const genreConsistency = detectedCliches.length >= 3 ? 100 : detectedCliches.length * 30;

        // 개선 제안
        const recommendations: string[] = [];
        if (keywordScore < 50) {
            recommendations.push(`${genreData?.genre || '장르'} 특화 키워드를 더 추가하세요`);
        }
        if (detectedCliches.length < 2) {
            recommendations.push('인기 클리셰를 활용하여 독자 흡입력을 높이세요');
        }
        if (synopsis.length < 200) {
            recommendations.push('시놉시스를 200자 이상으로 확장하여 스토리를 더 명확히 전달하세요');
        }
        narrativeInsights.forEach((insight: NarrativeKeywordInsight) => {
            if (insight.coverageRate < 40) {
                recommendations.push(`${insight.label} 묘사가 부족합니다. ${insight.guidance}`);
            }
        });

        return {
            genre,
            detectedCliches,
            missingElements,
            keywordScore,
            targetAudience: genreData?.targetAudience || '미분류',
            recommendations,
            genreConsistency,
            narrativeInsights,
            keywordGuidance,
        };
    }

    /**
     * 🔥 5막 구조 제안 (한국식 기승전결)
     */
    static suggest5ActStructure(totalLength: number): FiveActStructure {
        // 총 길이를 5막으로 분할 (도입 10%, 발단 20%, 전개 30%, 절정 25%, 결말 15%)
        const intro = { start: 0, end: Math.floor(totalLength * 0.1), description: '세계관과 주인공 소개' };
        const rising = { start: intro.end, end: Math.floor(totalLength * 0.3), description: '사건 발생, 갈등 시작' };
        const development = { start: rising.end, end: Math.floor(totalLength * 0.6), description: '갈등 심화, 복선 전개' };
        const climax = { start: development.end, end: Math.floor(totalLength * 0.85), description: '최고조 긴장, 결정적 대결' };
        const conclusion = { start: climax.end, end: totalLength, description: '갈등 해결, 결말' };

        // 클리프행어 포인트 제안 (연재형)
        const cliffhangers: CliffhangerPoint[] = [
            { position: rising.end, type: 'revelation', description: '중요한 비밀 폭로', intensity: 7 },
            { position: Math.floor((development.start + development.end) / 2), type: 'danger', description: '위기 상황 도래', intensity: 8 },
            { position: development.end, type: 'emotional', description: '감정적 전환점', intensity: 9 },
            { position: climax.start + Math.floor((climax.end - climax.start) / 2), type: 'mystery', description: '예상치 못한 반전', intensity: 10 }
        ];

        return {
            intro,
            rising,
            development,
            climax,
            conclusion,
            cliffhangers
        };
    }

    /**
     * 🔥 장르별 시놉시스 템플릿 제공
     */
    static getSynopsisTemplate(genre: KoreanWebNovelGenre): string {
        const templates: Record<KoreanWebNovelGenre, string> = {
            'romance-fantasy': `
【로맨스판타지 시놉시스 템플릿】

1. 주인공 소개: [이름], [신분/역할] (예: 악녀로 빙의한 백작영애)
2. 특별한 상황: [회귀/빙의/각성] (예: 비극적 결말을 맞기 직전 회귀)
3. 목표: [생존/복수/사랑/권력] (예: 원작 악녀의 운명 피하기)
4. 남주인공: [신분/성격/관계] (예: 냉혈한 황태자, 집착형 성격)
5. 주요 갈등: [장애물/적대자] (예: 여주인공, 황후, 정치적 음모)
6. 핵심 키워드: [황실, 마법, 계약결혼, 이혼 등 3-5개]

예시: "악녀로 빙의한 그녀, 죽음을 피하기 위해 냉혈 황태자와 계약결혼을 제안한다!"
            `,
            'modern-fantasy': `
【현대판타지/헌터물 시놉시스 템플릿】

1. 주인공 소개: [이름], [초기 능력] (예: E급 헌터, 최약체)
2. 전환점: [각성/획득/회귀] (예: 죽음 직전 숨겨진 스킬 각성)
3. 특별 능력: [유니크 스킬/시스템] (예: 시간 역행 능력, 상태창 시스템)
4. 목표: [성장/복수/세계 구원] (예: S급 헌터 등극, 던전 정복)
5. 주요 갈등: [길드/국가/몬스터] (예: 라이벌 길드, 세계급 재난)
6. 핵심 키워드: [던전, 레벨업, S급, 독보적 등 3-5개]

예시: "E급에서 SSS급으로! 죽음을 넘어 회귀한 그는 세계 최강 헌터가 된다."
            `,
            'fantasy': `
【판타지 시놉시스 템플릿】

1. 주인공 소개: [이름], [직업/능력] (예: 평범한 검사, 마법사)
2. 전환점: [이세계 전이/소환/운명] (예: 이세계로 소환됨)
3. 목표: [마왕 토벌/귀환/모험] (예: 마왕을 쓰러뜨리고 현대로 귀환)
4. 동료: [파티 구성] (예: 엘프 마법사, 드워프 전사)
5. 주요 갈등: [마왕/던전/음모] (예: 마왕군의 침공, 배신자)
6. 핵심 키워드: [마법, 검, 던전, 모험 등 3-5개]

예시: "평범한 고등학생이 이세계 용사로 소환되어 마왕과의 최종 대결을 펼친다!"
            `,
            'martial-arts': `
【무협 시놉시스 템플릿】

1. 주인공 소개: [이름], [문파/신분] (예: 몰락 문파 후예)
2. 전환점: [회귀/비급 획득/복수] (예: 문파 멸문 후 10년 전 회귀)
3. 목표: [복수/강호 제패/정의 실현] (예: 문파의 원수 갚기)
4. 무공: [특별한 무공/비급] (예: 천하제일 검법, 금단의 내공)
5. 주요 갈등: [정사대립/마교/라이벌] (예: 마교 세력, 배신한 사형)
6. 핵심 키워드: [무림, 강호, 절정, 비급 등 3-5개]

예시: "멸문당한 문파의 유일한 생존자, 10년 전으로 회귀하여 절정고수로 다시 태어난다!"
            `,
            'romance': `
【로맨스 시놉시스 템플릿】

1. 여주인공 소개: [이름], [직업/상황] (예: 이혼녀, 워커홀릭 변호사)
2. 남주인공: [이름], [신분/성격] (예: 재벌 2세, 싱글대디)
3. 만남: [어떻게 만났는가] (예: 계약연애, 소개팅, 동거)
4. 갈등: [장애물] (예: 신분 차이, 과거 상처, 삼각관계)
5. 감정 변화: [적대 → 연애] (예: 티격태격하다 사랑에 빠짐)
6. 핵심 키워드: [계약, 동거, 사내연애, 재벌 등 3-5개]

예시: "싱글맘 변호사와 재벌 2세의 계약연애, 가짜 사랑이 진짜가 되는 순간!"
            `,
            'hunter': '현대판타지와 동일',
            'bl': '로맨스와 유사, 남성 간 로맨스',
            'historical': '무협과 유사, 사극 배경',
            'unknown': '장르를 먼저 선택하세요'
        };

        return templates[genre] || templates['unknown'];
    }
}
