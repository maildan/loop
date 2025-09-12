/**
 * 🇰🇷 Korean Spell Checker Service
 * 한국어 맞춤법 검사 및 제안 시스템
 */

export interface SpellCheckResult {
    isCorrect: boolean;
    suggestions: string[];
    type: 'spelling' | 'grammar' | 'spacing' | 'style';
    confidence: number;
    originalText: string;
    correctedText?: string;
}

export interface SpellCheckError {
    start: number;
    end: number;
    text: string;
    message: string;
    suggestions: string[];
    type: 'spelling' | 'grammar' | 'spacing' | 'style';
}

// 🔥 한국어 맞춤법 규칙 데이터베이스
const KOREAN_RULES = {
    // 자주 틀리는 단어들
    commonMistakes: {
        '되': ['돼', '되어', '되다'],
        '돼': ['되', '되어', '되다'],
        '안': ['않'],
        '않': ['안'],
        '있다': ['잇다'],
        '없다': ['업다', '업음'],
        '어떻게': ['어떡해'],
        '어떡해': ['어떻게'],
        '무엇': ['뭐'],
        '뭐': ['무엇'],
        '그러나': ['그런데', '하지만'],
        '하지만': ['그러나', '그런데'],
        '때문에': ['떄문에'],
        '떄문에': ['때문에'],
        '어떤': ['어떤'],
        '가지고': ['갖고'],
        '갖고': ['가지고'],
        '왔다': ['와따'],
        '와따': ['왔다'],
        '갔다': ['가따'],
        '가따': ['갔다'],
        '했다': ['해따'],
        '해따': ['했다'],
        '봤다': ['봐따'],
        '봐따': ['봤다'],
    } as Record<string, string[]>,

    // 띄어쓰기 규칙
    spacingRules: {
        '그런데': ['그런 데'],
        '그런 데': ['그런데'],
        '하지만': ['하지 만'],
        '하지 만': ['하지만'],
        '때문에': ['때 문에'],
        '때 문에': ['때문에'],
        '나머지': ['나 머지'],
        '나 머지': ['나머지'],
        '그리고': ['그리 고'],
        '그리 고': ['그리고'],
        '그래서': ['그래 서'],
        '그래 서': ['그래서'],
    } as Record<string, string[]>,

    // 문법 패턴
    grammarPatterns: [
        {
            pattern: /하고\s*있다/g,
            suggestions: ['하고 있다'],
            message: '진행형 표현에서는 띄어쓰기가 필요합니다.'
        },
        {
            pattern: /할\s*수\s*있다/g,
            suggestions: ['할 수 있다'],
            message: '가능 표현에서는 띄어쓰기가 필요합니다.'
        },
        {
            pattern: /하지\s*않다/g,
            suggestions: ['하지 않다'],
            message: '부정 표현에서는 띄어쓰기가 필요합니다.'
        },
    ],

    // 존댓말 제안
    honorifics: {
        '해': ['해요', '합니다'],
        '가': ['가요', '갑니다'],
        '와': ['와요', '옵니다'],
        '본다': ['봐요', '봅니다'],
        '한다': ['해요', '합니다'],
    } as Record<string, string[]>
};

// 🔥 외부 API를 사용한 고급 맞춤법 검사 (한국어 맞춤법 검사기)
class KoreanSpellChecker {
    private static instance: KoreanSpellChecker;
    private cache = new Map<string, SpellCheckResult>();

    static getInstance(): KoreanSpellChecker {
        if (!this.instance) {
            this.instance = new KoreanSpellChecker();
        }
        return this.instance;
    }

    // 🔥 기본 맞춤법 검사
    async checkSpelling(text: string): Promise<SpellCheckError[]> {
        if (!text.trim()) return [];

        const errors: SpellCheckError[] = [];
        const words = this.tokenizeKorean(text);

        for (const word of words) {
            const result = await this.checkWord(word);
            if (!result.isCorrect) {
                errors.push({
                    start: text.indexOf(word.text),
                    end: text.indexOf(word.text) + word.text.length,
                    text: word.text,
                    message: this.getErrorMessage(result.type),
                    suggestions: result.suggestions,
                    type: result.type
                });
            }
        }

        return errors;
    }

    // 🔥 단어별 검사
    private async checkWord(word: { text: string; start: number; end: number }): Promise<SpellCheckResult> {
        const text = word.text.trim();

        // 캐시 확인
        if (this.cache.has(text)) {
            return this.cache.get(text)!;
        }

        let result: SpellCheckResult = {
            isCorrect: true,
            suggestions: [],
            type: 'spelling',
            confidence: 1.0,
            originalText: text
        };

        // 1. 일반적인 맞춤법 오류 검사
        if (KOREAN_RULES.commonMistakes[text]) {
            result = {
                isCorrect: false,
                suggestions: KOREAN_RULES.commonMistakes[text],
                type: 'spelling',
                confidence: 0.9,
                originalText: text,
                correctedText: KOREAN_RULES.commonMistakes[text][0]
            };
        }

        // 2. 띄어쓰기 검사
        else if (KOREAN_RULES.spacingRules[text]) {
            result = {
                isCorrect: false,
                suggestions: KOREAN_RULES.spacingRules[text],
                type: 'spacing',
                confidence: 0.8,
                originalText: text,
                correctedText: KOREAN_RULES.spacingRules[text][0]
            };
        }

        // 3. 존댓말 제안
        else if (KOREAN_RULES.honorifics[text]) {
            result = {
                isCorrect: true,
                suggestions: KOREAN_RULES.honorifics[text],
                type: 'style',
                confidence: 0.7,
                originalText: text
            };
        }

        // 캐시에 저장
        this.cache.set(text, result);
        return result;
    }

    // 🔥 한국어 토큰화
    private tokenizeKorean(text: string): { text: string; start: number; end: number }[] {
        const tokens: { text: string; start: number; end: number }[] = [];

        // 단어 경계를 찾는 정규식 (한글, 영문, 숫자, 공백 기준)
        const wordRegex = /[\uAC00-\uD7AF]+|[a-zA-Z]+|[0-9]+/g;
        let match;

        while ((match = wordRegex.exec(text)) !== null) {
            tokens.push({
                text: match[0],
                start: match.index,
                end: match.index + match[0].length
            });
        }

        return tokens;
    }

    // 🔥 오류 메시지 생성
    private getErrorMessage(type: SpellCheckError['type']): string {
        switch (type) {
            case 'spelling':
                return '맞춤법 오류가 발견되었습니다.';
            case 'grammar':
                return '문법 오류가 발견되었습니다.';
            case 'spacing':
                return '띄어쓰기 오류가 발견되었습니다.';
            case 'style':
                return '더 적절한 표현이 있습니다.';
            default:
                return '텍스트를 확인해 주세요.';
        }
    }

    // 🔥 전체 문장 검사 (외부 API 사용)
    async checkSentence(text: string): Promise<SpellCheckError[]> {
        try {
            // 네이버 맞춤법 검사기 API 또는 Pusan National University API 사용
            // 여기서는 기본 로직으로 구현
            const basicErrors = await this.checkSpelling(text);
            const grammarErrors = this.checkGrammar(text);

            return [...basicErrors, ...grammarErrors];
        } catch (error) {
            console.warn('External spell check failed, using fallback:', error);
            return await this.checkSpelling(text);
        }
    }

    // 🔥 문법 검사
    private checkGrammar(text: string): SpellCheckError[] {
        const errors: SpellCheckError[] = [];

        for (const rule of KOREAN_RULES.grammarPatterns) {
            let match;
            while ((match = rule.pattern.exec(text)) !== null) {
                errors.push({
                    start: match.index,
                    end: match.index + match[0].length,
                    text: match[0],
                    message: rule.message,
                    suggestions: rule.suggestions,
                    type: 'grammar'
                });
            }
        }

        return errors;
    }

    // 🔥 텍스트 자동 교정
    async autoCorrect(text: string): Promise<string> {
        const errors = await this.checkSentence(text);
        let correctedText = text;

        // 뒤에서부터 교정 (인덱스 변화 방지)
        errors.reverse().forEach(error => {
            if (error.suggestions.length > 0) {
                correctedText =
                    correctedText.slice(0, error.start) +
                    error.suggestions[0] +
                    correctedText.slice(error.end);
            }
        });

        return correctedText;
    }

    // 🔥 유사한 단어 찾기
    findSimilarWords(word: string): string[] {
        const suggestions: string[] = [];

        // 자음/모음 유사성 기반 제안
        Object.keys(KOREAN_RULES.commonMistakes).forEach(correct => {
            if (this.calculateSimilarity(word, correct) > 0.7) {
                suggestions.push(correct);
            }
        });

        return suggestions.slice(0, 5); // 최대 5개까지
    }

    // 🔥 문자열 유사도 계산 (레벤슈타인 거리)
    private calculateSimilarity(str1: string, str2: string): number {
        const len1 = str1.length;
        const len2 = str2.length;

        if (len1 === 0) return len2;
        if (len2 === 0) return len1;

        // 2차원 배열 초기화
        const matrix: number[][] = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

        // 첫 번째 행과 열 초기화
        for (let i = 0; i <= len1; i++) {
            matrix[0]![i] = i;
        }
        for (let j = 0; j <= len2; j++) {
            matrix[j]![0] = j;
        }

        // 매트릭스 계산
        for (let j = 1; j <= len2; j++) {
            for (let i = 1; i <= len1; i++) {
                const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
                matrix[j]![i] = Math.min(
                    matrix[j]![i - 1]! + 1,
                    matrix[j - 1]![i]! + 1,
                    matrix[j - 1]![i - 1]! + cost
                );
            }
        }

        const distance = matrix[len2]![len1]!;
        const maxLen = Math.max(len1, len2);
        return 1 - (distance / maxLen);
    }
}

export const koreanSpellChecker = KoreanSpellChecker.getInstance();
