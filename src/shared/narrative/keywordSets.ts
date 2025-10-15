/**
 * 한국 웹소설 캐릭터 일관성 평가에 사용하는 핵심 어휘 모듈.
 * 말투·외모·성격 키워드를 중앙에서 관리해 분석 로직 간 불일치를 방지한다.
 */

export type NarrativeKeywordCategory = 'speechPattern' | 'appearance' | 'personality';

export interface NarrativeKeywordDefinition {
  /** 카테고리 식별자 */
  id: NarrativeKeywordCategory;
  /** UI에 노출할 한글 라벨 */
  label: string;
  /** 실제 매칭에 사용하는 키워드 배열 */
  keywords: string[];
  /** 카테고리별 해석 가이드 */
  guidance: string;
}

export interface NarrativeKeywordInsight {
  category: NarrativeKeywordCategory;
  label: string;
  matchedKeywords: string[];
  missingKeywords: string[];
  coverageRate: number;
  guidance: string;
  summary: string;
}

const SPEECH_PATTERN_KEYWORDS = ['~다', '~요', '…', '?!', '!?', '말투', '톤', '사투리', '평소', '특유'];
const APPEARANCE_KEYWORDS = ['눈', '머리', '머릿결', '피부', '체형', '키', '옷', '복장', '색', '빛', '향'];
const PERSONALITY_KEYWORDS = ['성격', '습관', '가치관', '목표', '불안', '욕망', '강박', '미덕', '결점', '갈등'];

const NARRATIVE_KEYWORD_DEFINITIONS: Record<NarrativeKeywordCategory, NarrativeKeywordDefinition> = {
  speechPattern: {
    id: 'speechPattern',
    label: '말투',
    keywords: SPEECH_PATTERN_KEYWORDS,
    guidance: '대표 어구, 억양, 사투리 등을 명시해 캐릭터만의 목소리를 부여하세요.',
  },
  appearance: {
    id: 'appearance',
    label: '외모',
    keywords: APPEARANCE_KEYWORDS,
    guidance: '시각·후각 요소를 함께 기록하면 독자가 캐릭터를 더 쉽게 떠올릴 수 있습니다.',
  },
  personality: {
    id: 'personality',
    label: '성격',
    keywords: PERSONALITY_KEYWORDS,
    guidance: '가치관·욕망·갈등을 서술하면 동기가 선명해집니다.',
  },
};

/**
 * 모든 키워드 정의를 배열로 반환한다.
 */
export function listNarrativeKeywordDefinitions(): NarrativeKeywordDefinition[] {
  return Object.values(NARRATIVE_KEYWORD_DEFINITIONS);
}

/**
 * 카테고리별 키워드 정의를 조회한다.
 */
export function getNarrativeKeywordDefinition(category: NarrativeKeywordCategory): NarrativeKeywordDefinition {
  return NARRATIVE_KEYWORD_DEFINITIONS[category];
}

function normalizeSources(sources: Array<string | undefined | null>): string {
  return sources
    .filter((source): source is string => typeof source === 'string' && source.trim().length > 0)
    .map(source => source.replace(/\s+/g, ' ').toLowerCase())
    .join(' ');
}

function evaluateKeywordCoverage(
  definition: NarrativeKeywordDefinition,
  resolvedText: string
): NarrativeKeywordInsight {
  const matched = definition.keywords.filter(keyword => resolvedText.includes(keyword.toLowerCase()));
  const coverageRate = definition.keywords.length === 0
    ? 0
    : Math.round((matched.length / definition.keywords.length) * 100);
  const missing = definition.keywords.filter(keyword => !matched.includes(keyword));

  const summary = matched.length > 0
    ? `${matched.join(', ')} 키워드가 감지되었습니다.`
    : '핵심 키워드가 감지되지 않았습니다.';

  return {
    category: definition.id,
    label: definition.label,
    matchedKeywords: matched,
    missingKeywords: missing,
    coverageRate,
    guidance: definition.guidance,
    summary,
  };
}

/**
 * 여러 텍스트 소스로부터 카테고리별 키워드 커버리지를 계산한다.
 */
export function analyzeNarrativeKeywords(
  sources: Array<string | undefined | null>,
  categories: NarrativeKeywordCategory[] = ['speechPattern', 'appearance', 'personality']
): NarrativeKeywordInsight[] {
  const resolvedText = normalizeSources(sources);
  if (resolvedText.length === 0) {
    return categories.map(category => {
      const definition = getNarrativeKeywordDefinition(category);
      return {
        category: definition.id,
        label: definition.label,
        matchedKeywords: [],
        missingKeywords: [...definition.keywords],
        coverageRate: 0,
        guidance: definition.guidance,
        summary: '분석할 텍스트가 없습니다.',
      } as NarrativeKeywordInsight;
    });
  }

  return categories.map(category => {
    const definition = getNarrativeKeywordDefinition(category);
    return evaluateKeywordCoverage(definition, resolvedText);
  });
}

/**
 * Gemini 프롬프트에서 직접 활용할 수 있는 간결한 설명을 생성한다.
 */
export function buildKeywordInsightPrompt(insights: NarrativeKeywordInsight[]): string {
  return insights
    .map(insight => `${insight.label} (${insight.coverageRate}%): ${insight.summary}`)
    .join('\n');
}
