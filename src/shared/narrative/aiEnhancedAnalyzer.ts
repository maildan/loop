// 🔥 AI-Enhanced NCP Story Analyzer - Gemini 연동
import { NCPStoryAnalyzer, type NCPNarrativeStructure, type ReaderEngagementPrediction, type TimelineAnalysis, type MindmapAnalysis } from './ncpAnalyzer';
import { getGeminiClient, type GeminiResponse } from '../ai/geminiClient';
import { Logger } from '../logger';
import { DummyDataFilter } from '../services/dummyDataFilter';

export interface AIEnhancedAnalysisResult {
    // 기존 NCP 분석 결과
    ncpAnalysis: {
        readerEngagement: ReaderEngagementPrediction;
        timeline: TimelineAnalysis;
        mindmap: MindmapAnalysis;
    };

    // AI 강화 분석 결과
    aiAnalysis: {
        synopsis: {
            overall: GeminiResponse;
            strengths: string[];
            weaknesses: string[];
            score: number; // 0-100
            recommendations: string[];
        };

        characters: {
            analysis: GeminiResponse;
            arcCompleteness: number;
            relationshipDepth: number;
            developmentSuggestions: string[];
        };

        plot: {
            analysis: GeminiResponse;
            coherenceScore: number;
            pacingScore: number;
            climaxEffectiveness: number;
            plotHoles: string[];
            structuralSuggestions: string[];
        };

        themes: {
            analysis: GeminiResponse;
            clarity: number;
            consistency: number;
            resonance: number;
            themesSuggestions: string[];
        };
    };

    // 통합 평가
    overallAssessment: {
        totalScore: number; // 0-100
        grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D+' | 'D' | 'F';
        readyForPublication: boolean;
        criticalIssues: string[];
        nextSteps: string[];
        estimatedRevisionTime: string; // "2-3주", "1-2개월" 등
    };
}

export class AIEnhancedNCPAnalyzer extends NCPStoryAnalyzer {
    private geminiClient = getGeminiClient();
    private dummyFilter = new DummyDataFilter();

    constructor(structure: NCPNarrativeStructure) {
        super(structure);
        Logger.info('AI_NCP_ANALYZER', 'Initialized with AI enhancement and dummy data filter');
    }

    // 🔥 종합 AI 분석 - 모든 분석을 통합하여 수행
    async performComprehensiveAnalysis(
        content: string,
        characters: any[],
        plotPoints: any[],
        additionalContext?: string
    ): Promise<AIEnhancedAnalysisResult> {
        Logger.info('AI_NCP_ANALYZER', 'Starting comprehensive analysis', {
            contentLength: content.length,
            characterCount: characters.length,
            plotPointCount: plotPoints.length
        });

        try {
            // 1. 기존 NCP 분석 수행
            const ncpAnalysis = {
                readerEngagement: this.predictReaderEngagement(plotPoints),
                timeline: this.analyzeTimeline(plotPoints),
                mindmap: this.analyzeMindmap(plotPoints, characters)
            };

            // 2. AI 강화 분석 수행 (병렬 처리)
            const [synopsisAnalysis, characterAnalysis, plotAnalysis, themeAnalysis] = await Promise.all([
                this.performSynopsisAnalysis(content, additionalContext),
                this.performCharacterAnalysis(characters, content),
                this.performPlotAnalysis(plotPoints, content),
                this.performThemeAnalysis(content, plotPoints)
            ]);

            // 3. 통합 평가 계산
            const overallAssessment = this.calculateOverallAssessment({
                synopsis: synopsisAnalysis,
                characters: characterAnalysis,
                plot: plotAnalysis,
                themes: themeAnalysis,
                ncpEngagement: ncpAnalysis.readerEngagement
            });

            const result: AIEnhancedAnalysisResult = {
                ncpAnalysis,
                aiAnalysis: {
                    synopsis: synopsisAnalysis,
                    characters: characterAnalysis,
                    plot: plotAnalysis,
                    themes: themeAnalysis
                },
                overallAssessment
            };

            Logger.info('AI_NCP_ANALYZER', 'Comprehensive analysis completed', {
                overallScore: overallAssessment.totalScore,
                grade: overallAssessment.grade,
                duration: 'calculated'
            });

            return result;
        } catch (error) {
            Logger.error('AI_NCP_ANALYZER', 'Comprehensive analysis failed', error);
            throw error;
        }
    }

    // 🔥 시놉시스 분석 (한국 웹소설 특화)
    private async performSynopsisAnalysis(content: string, context?: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['synopsis']> {
        // 🔥 한국 웹소설 특화 분석 추가 (2025 최신 트렌드)
        const { KoreanWebNovelAnalyzer } = await import('./koreanWebNovelAnalyzer');
        
        // 제목 추출 (context에서 title이 있으면 사용)
        const titleMatch = context?.match(/제목[:\s]+(.+)/);
        const title = titleMatch?.[1]?.trim() || '';
        
        // 🔥 한국 웹소설 장르/클리셰 자동 감지
        const koreanAnalysis = KoreanWebNovelAnalyzer.analyzeSynopsis(content, title);
        
        // 🔥 감지된 장르에 맞는 시놉시스 템플릿 제공
        const synopsisTemplate = KoreanWebNovelAnalyzer.getSynopsisTemplate(koreanAnalysis.genre);
        
        // 🔥 5막 구조 제안 (한국 기승전결)
        const fiveActStructure = KoreanWebNovelAnalyzer.suggest5ActStructure(100000); // 10만자 기준
        
        const prompt = `
다음은 소설의 시놉시스입니다. 전문 편집자의 관점에서 종합적으로 분석해주세요.

${context ? `[추가 컨텍스트]\n${context}\n\n` : ''}

[시놉시스]
${content}

🔥 [한국 웹소설 자동 분석 결과]
- 감지된 장르: ${koreanAnalysis.genre} (일관성: ${koreanAnalysis.genreConsistency.toFixed(1)}%)
- 감지된 클리셰: ${koreanAnalysis.detectedCliches.join(', ') || '없음'}
- 키워드 점수: ${koreanAnalysis.keywordScore}/100
- 주 타겟: ${koreanAnalysis.targetAudience}
- 누락된 필수 요소: ${koreanAnalysis.missingElements.join(', ') || '없음'}
- 개선 제안: ${koreanAnalysis.recommendations.join(' / ')}

🔥 [${koreanAnalysis.genre} 장르 시놉시스 모범 템플릿]
${synopsisTemplate}

🔥 [한국식 5막 구조 제안]
- 1막 (도입, ${fiveActStructure.intro.start}-${fiveActStructure.intro.end}자): ${fiveActStructure.intro.description}
- 2막 (발단, ${fiveActStructure.rising.start}-${fiveActStructure.rising.end}자): ${fiveActStructure.rising.description}
- 3막 (전개, ${fiveActStructure.development.start}-${fiveActStructure.development.end}자): ${fiveActStructure.development.description}
- 4막 (절정, ${fiveActStructure.climax.start}-${fiveActStructure.climax.end}자): ${fiveActStructure.climax.description}
- 5막 (결말, ${fiveActStructure.conclusion.start}-${fiveActStructure.conclusion.end}자): ${fiveActStructure.conclusion.description}
- 클리프행어 지점: ${fiveActStructure.cliffhangers.map(c => `${c.position}자 (${c.type}: ${c.description}, 강도 ${c.intensity}/10)`).join(', ')}

다음 형식으로 분석해주세요:
1. 전체적인 완성도 평가 (0-100점) - 한국 웹소설 시장 기준
2. 주요 강점 3-5가지 - 장르 특화 요소 포함
3. 개선이 필요한 약점 3-5가지 - 클리셰 부족/과다 포함
4. 구체적인 개선 제안 5-7가지 - 감지된 장르 기준
5. 독자 타겟팅과 시장성 분석 - 2025 웹소설 시장 기준
6. 출간 준비도 평가 - 카카오페이지/네이버시리즈 기준
7. 🔥 장르 적합성 평가 - ${koreanAnalysis.genre} 장르 클리셰 활용도
8. 🔥 한국 웹소설 트렌드 부합도 - 회귀/빙의/헌터/악녀 등 2025 트렌드
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'synopsis');

        // AI 응답을 파싱하여 구조화된 데이터 생성
        const analysisData = this.parseSynopsisAnalysis(aiResponse.content);

        return {
            overall: aiResponse,
            strengths: analysisData.strengths,
            weaknesses: analysisData.weaknesses,
            score: analysisData.score,
            recommendations: [
                ...analysisData.recommendations,
                // 🔥 한국 웹소설 특화 추천 추가
                ...koreanAnalysis.recommendations.map(r => `[장르 특화] ${r}`)
            ]
        };
    }

    // 🔥 캐릭터 분석 (MBTI 기반)
    private async performCharacterAnalysis(characters: any[], content: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['characters']> {
        // 🔥 한국 웹소설 MBTI 분석 추가
        const { KoreanWebNovelAnalyzer } = await import('./koreanWebNovelAnalyzer');
        
        const characterData = characters.map(char => {
            const description = char.description || char.content || '';
            const background = char.background || '';
            const goals = char.goals || '';
            const fullDescription = `${description} ${background} ${goals}`.trim();
            
            // 🔥 각 캐릭터의 MBTI 자동 추천
            const mbtiRecommendations = fullDescription
                ? KoreanWebNovelAnalyzer.recommendMBTI(fullDescription)
                : [];
            
            return {
                name: char.name || char.title,
                role: char.role || 'unknown',
                description,
                background,
                goals,
                // 🔥 MBTI 추천 결과 포함
                mbtiRecommendations: mbtiRecommendations.slice(0, 3).map(mbti => ({
                    type: mbti.mbtiType,
                    trait: mbti.coreTrait,
                    conflict: mbti.coreConflict,
                    growth: mbti.growthPath,
                    idealRole: mbti.idealRole,
                    examples: mbti.exampleCharacters.join(', ')
                }))
            };
        });

        // 🔥 MBTI 기반 심층 분석 프롬프트
        const mbtiAnalysisSection = characterData
            .map(char => {
                if (char.mbtiRecommendations.length === 0) return '';
                const topMBTI = char.mbtiRecommendations[0];
                if (!topMBTI) return '';
                return `
📌 ${char.name} (${char.role})
   - 추천 MBTI: ${topMBTI.type} (${topMBTI.trait})
   - 핵심 갈등: ${topMBTI.conflict}
   - 성장 방향: ${topMBTI.growth}
   - 적합한 역할: ${topMBTI.idealRole}
   - 유사 캐릭터: ${topMBTI.examples}`;
            })
            .filter(Boolean)
            .join('\n');

        const prompt = `
다음은 소설의 등장인물 정보와 스토리 내용입니다. 캐릭터 개발 전문가로서 분석해주세요.

[등장인물 정보]
${JSON.stringify(characterData, null, 2)}

🔥 [MBTI 기반 캐릭터 자동 분석 결과]
${mbtiAnalysisSection || '(캐릭터 설명 부족으로 MBTI 분석 불가)'}

[스토리 내용]
${content.slice(0, 2000)}...

분석 요청사항:
1. 각 캐릭터의 동기와 목표 명확성 (0-100점)
2. 캐릭터 아크의 완성도 평가
3. 캐릭터 간 관계의 깊이와 발전성
4. 캐릭터 일관성과 현실감
5. 🔥 MBTI 기반 캐릭터 성격 적합성 평가
6. 🔥 추천 MBTI에 따른 핵심 갈등 활용 제안
7. 🔥 캐릭터별 성장 아크와 MBTI 연계성 분석
8. 🔥 한국 웹소설 독자들이 선호하는 캐릭터 유형 부합도
9. 캐릭터 발전을 위한 구체적 제안 (MBTI 기반)
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'character');
        const analysisData = this.parseCharacterAnalysis(aiResponse.content);

        return {
            analysis: aiResponse,
            arcCompleteness: analysisData.arcCompleteness,
            relationshipDepth: analysisData.relationshipDepth,
            developmentSuggestions: [
                ...analysisData.developmentSuggestions,
                // 🔥 MBTI 기반 캐릭터 발전 제안 추가
                ...characterData.flatMap(char => {
                    const topMBTI = char.mbtiRecommendations[0];
                    if (!topMBTI) return [];
                    return [`[${char.name}] ${topMBTI.type} 성향 활용: ${topMBTI.conflict} → ${topMBTI.growth}`];
                })
            ]
        };
    }

    // 🔥 플롯 분석 (한국식 5막 구조 + 3막 구조)
    private async performPlotAnalysis(plotPoints: any[], content: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['plot']> {
        // 🔥 한국 웹소설 5막 구조 분석 추가
        const { KoreanWebNovelAnalyzer } = await import('./koreanWebNovelAnalyzer');
        
        const plotData = plotPoints.map(point => ({
            title: point.title,
            type: point.type,
            description: point.description,
            order: point.order || point.sortOrder
        }));

        // 🔥 한국식 5막 구조 제안 (예상 길이 100,000자 기준)
        const fiveActStructure = KoreanWebNovelAnalyzer.suggest5ActStructure(content.length || 100000);
        
        // 🔥 현재 플롯이 5막 구조에 어떻게 매핑되는지 분석
        const totalPlots = plotPoints.length;
        const plotsPerAct = Math.ceil(totalPlots / 5);
        const actMapping = {
            intro: plotPoints.slice(0, plotsPerAct),
            rising: plotPoints.slice(plotsPerAct, plotsPerAct * 2),
            development: plotPoints.slice(plotsPerAct * 2, plotsPerAct * 3),
            climax: plotPoints.slice(plotsPerAct * 3, plotsPerAct * 4),
            conclusion: plotPoints.slice(plotsPerAct * 4)
        };
        
        const actAnalysis = `
🔥 [한국식 5막 구조 매핑 분석]

1막 (도입, ${fiveActStructure.intro.start}-${fiveActStructure.intro.end}자): ${fiveActStructure.intro.description}
   현재 플롯: ${actMapping.intro.map(p => p.title).join(', ') || '없음'}

2막 (발단, ${fiveActStructure.rising.start}-${fiveActStructure.rising.end}자): ${fiveActStructure.rising.description}
   현재 플롯: ${actMapping.rising.map(p => p.title).join(', ') || '없음'}

3막 (전개, ${fiveActStructure.development.start}-${fiveActStructure.development.end}자): ${fiveActStructure.development.description}
   현재 플롯: ${actMapping.development.map(p => p.title).join(', ') || '없음'}

4막 (절정, ${fiveActStructure.climax.start}-${fiveActStructure.climax.end}자): ${fiveActStructure.climax.description}
   현재 플롯: ${actMapping.climax.map(p => p.title).join(', ') || '없음'}

5막 (결말, ${fiveActStructure.conclusion.start}-${fiveActStructure.conclusion.end}자): ${fiveActStructure.conclusion.description}
   현재 플롯: ${actMapping.conclusion.map(p => p.title).join(', ') || '없음'}

🔥 [웹소설 클리프행어 포인트 제안]
${fiveActStructure.cliffhangers.map(c => `- ${c.position}자 (${c.type}): ${c.description} [강도: ${c.intensity}/10]`).join('\n')}
        `;

        const prompt = `
다음은 소설의 플롯 구조와 내용입니다. 플롯 구조 전문가로서 분석해주세요.

[플롯 구조]
${JSON.stringify(plotData, null, 2)}

[스토리 내용]
${content.slice(0, 3000)}...

${actAnalysis}

분석 요청사항:
1. 플롯의 논리적 일관성 (0-100점)
2. 🔥 한국식 5막 구조(기승전결) vs 서구식 3막 구조 적합성 평가
3. 🔥 각 막(도입-발단-전개-절정-결말)의 균형성 분석
4. 페이싱과 긴장감 곡선 분석
5. 🔥 웹소설 연재형 클리프행어 배치 적절성
6. 클라이맥스의 효과성
7. 발견된 플롯홀과 논리적 오류
8. 🔥 한국 웹소설 독자 성향에 맞는 빠른 전개 여부
9. 🔥 회차별 클리프행어 제안 (독자 참여 유도)
10. 구조 개선을 위한 제안 (5막 구조 기준)
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'plot');
        const analysisData = this.parsePlotAnalysis(aiResponse.content);

        return {
            analysis: aiResponse,
            coherenceScore: analysisData.coherenceScore,
            pacingScore: analysisData.pacingScore,
            climaxEffectiveness: analysisData.climaxEffectiveness,
            plotHoles: analysisData.plotHoles,
            structuralSuggestions: [
                ...analysisData.structuralSuggestions,
                // 🔥 5막 구조 기반 제안 추가
                `[5막 구조] 도입부(${fiveActStructure.intro.start}-${fiveActStructure.intro.end}자)는 빠르게 진행하여 독자 이탈 방지`,
                `[클리프행어] ${fiveActStructure.cliffhangers.length}개 지점에 강한 갈등 배치로 다음 회차 기대감 증폭`,
                `[연재 최적화] 회차당 ${Math.floor((content.length || 100000) / 100)}-${Math.floor((content.length || 100000) / 50)}자 분량으로 안정적 연재 가능`
            ]
        };
    }

    // 🔥 테마 분석
    private async performThemeAnalysis(content: string, plotPoints: any[]): Promise<AIEnhancedAnalysisResult['aiAnalysis']['themes']> {
        const prompt = `
다음 소설 내용의 테마를 분석해주세요. 테마 분석 전문가로서 깊이 있게 평가해주세요.

[스토리 내용]
${content.slice(0, 3000)}...

[주요 플롯 포인트]
${plotPoints.map(p => `- ${p.title}: ${p.description || ''}`).join('\n')}

분석 요청사항:
1. 핵심 테마 식별 및 명확성 평가 (0-100점)
2. 테마의 일관된 표현 정도
3. 독자에게 미치는 감정적 공명도
4. 서브테마와의 조화
5. 테마 강화를 위한 제안
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'theme');
        const analysisData = this.parseThemeAnalysis(aiResponse.content);

        return {
            analysis: aiResponse,
            clarity: analysisData.clarity,
            consistency: analysisData.consistency,
            resonance: analysisData.resonance,
            themesSuggestions: analysisData.suggestions
        };
    }

    // 🔥 통합 평가 계산
    private calculateOverallAssessment(analysisResults: any): AIEnhancedAnalysisResult['overallAssessment'] {
        // 가중치가 적용된 점수 계산
        const weights = {
            synopsis: 0.3,
            characters: 0.25,
            plot: 0.25,
            themes: 0.2
        };

        const totalScore = Math.round(
            (analysisResults.synopsis.score * weights.synopsis) +
            (analysisResults.characters.arcCompleteness * weights.characters) +
            (analysisResults.plot.coherenceScore * weights.plot) +
            (analysisResults.themes.clarity * weights.themes)
        );

        const grade = this.calculateGrade(totalScore);
        const readyForPublication = totalScore >= 80 && grade !== 'F';

        const criticalIssues = [
            ...analysisResults.synopsis.weaknesses.slice(0, 2),
            ...analysisResults.plot.plotHoles.slice(0, 2)
        ].filter(issue => issue.length > 0);

        const nextSteps = [
            ...analysisResults.synopsis.recommendations.slice(0, 3),
            ...analysisResults.characters.developmentSuggestions.slice(0, 2),
            ...analysisResults.plot.structuralSuggestions.slice(0, 2)
        ].filter(step => step.length > 0);

        const estimatedRevisionTime = this.estimateRevisionTime(totalScore, criticalIssues.length);

        return {
            totalScore,
            grade,
            readyForPublication,
            criticalIssues,
            nextSteps,
            estimatedRevisionTime
        };
    }

    // 🔥 AI 응답 파싱 유틸리티들 - 더미데이터 필터 적용
    private parseSynopsisAnalysis(content: string) {
        // 🔥 먼저 더미데이터 필터 적용
        const filteredResult = this.dummyFilter.detectDummyContent(content);
        const filteredContent = filteredResult.cleanedText;

        // AI 응답을 파싱하여 구조화된 데이터로 변환
        const scoreMatch = filteredContent.match(/(\d+)점|(\d+)\/100|점수[:\s]*(\d+)/i);
        const score = scoreMatch ? parseInt((scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) || '0') : 0;

        const strengthsSection = filteredContent.match(/강점[:\s]*\n*((?:.*\n)*?)(?=약점|개선|$)/i);
        const strengths = strengthsSection?.[1] ?
            strengthsSection[1].split('\n').filter((s: string) => s.trim().length > 0).slice(0, 5).filter((item: string) => !this.dummyFilter.detectDummyContent(item).hasDummyContent) :
            [];

        const weaknessesSection = filteredContent.match(/약점[:\s]*\n*((?:.*\n)*?)(?=제안|개선|$)/i);
        const weaknesses = weaknessesSection?.[1] ?
            weaknessesSection[1].split('\n').filter((s: string) => s.trim().length > 0).slice(0, 5).filter((item: string) => !this.dummyFilter.detectDummyContent(item).hasDummyContent) :
            [];

        const recommendationsSection = filteredContent.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const recommendations = recommendationsSection?.[1] ?
            recommendationsSection[1].split('\n').filter((s: string) => s.trim().length > 0).slice(0, 7).filter((item: string) => !this.dummyFilter.detectDummyContent(item).hasDummyContent) :
            [];

        return { score, strengths, weaknesses, recommendations };
    }

    private parseCharacterAnalysis(content: string) {
        // 🔥 더미데이터 필터 적용
        const filteredResult = this.dummyFilter.detectDummyContent(content);
        const filteredContent = filteredResult.cleanedText;

        const arcMatch = filteredContent.match(/아크.*?(\d+)점|완성도.*?(\d+)/i);
        const arcCompleteness = arcMatch ? parseInt((arcMatch[1] || arcMatch[2]) || '0') : 0;

        const relationshipMatch = filteredContent.match(/관계.*?(\d+)점|깊이.*?(\d+)/i);
        const relationshipDepth = relationshipMatch ? parseInt((relationshipMatch[1] || relationshipMatch[2]) || '0') : 0;

        const suggestionsSection = filteredContent.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const developmentSuggestions = suggestionsSection?.[1] ?
            suggestionsSection[1].split('\n').filter((s: string) => s.trim().length > 0).slice(0, 5).filter((item: string) => !this.dummyFilter.detectDummyContent(item).hasDummyContent) :
            [];

        return { arcCompleteness, relationshipDepth, developmentSuggestions };
    }

    private parsePlotAnalysis(content: string) {
        // 🔥 더미데이터 필터 적용
        const filteredResult = this.dummyFilter.detectDummyContent(content);
        const filteredContent = filteredResult.cleanedText;

        const coherenceMatch = filteredContent.match(/일관성.*?(\d+)점|논리.*?(\d+)/i);
        const coherenceScore = coherenceMatch ? parseInt((coherenceMatch[1] || coherenceMatch[2]) || '0') : 0;

        const pacingMatch = filteredContent.match(/페이싱.*?(\d+)점|리듬.*?(\d+)/i);
        const pacingScore = pacingMatch ? parseInt((pacingMatch[1] || pacingMatch[2]) || '0') : 0;

        const climaxMatch = filteredContent.match(/클라이맥스.*?(\d+)점|효과.*?(\d+)/i);
        const climaxEffectiveness = climaxMatch ? parseInt((climaxMatch[1] || climaxMatch[2]) || '0') : 0;

        const plotHoles = filteredContent.match(/플롯홀|오류|문제/gi) ?
            ['실제 플롯 검토가 필요합니다'] : [];

        const structuralSuggestions = ['실제 데이터 기반 구조 분석이 필요합니다'];

        return { coherenceScore, pacingScore, climaxEffectiveness, plotHoles, structuralSuggestions };
    }

    private parseThemeAnalysis(content: string) {
        // 🔥 더미데이터 필터 적용
        const filteredResult = this.dummyFilter.detectDummyContent(content);
        const filteredContent = filteredResult.cleanedText;

        const clarityMatch = filteredContent.match(/명확성.*?(\d+)점|테마.*?(\d+)/i);
        const clarity = clarityMatch ? parseInt((clarityMatch[1] || clarityMatch[2]) || '0') : 0;

        const consistencyMatch = filteredContent.match(/일관성.*?(\d+)점|표현.*?(\d+)/i);
        const consistency = consistencyMatch ? parseInt((consistencyMatch[1] || consistencyMatch[2]) || '0') : 0;

        const resonanceMatch = filteredContent.match(/공명.*?(\d+)점|감정.*?(\d+)/i);
        const resonance = resonanceMatch ? parseInt((resonanceMatch[1] || resonanceMatch[2]) || '0') : 0;

        const suggestions = ['실제 데이터 기반 테마 분석이 필요합니다'];

        return { clarity, consistency, resonance, suggestions };
    }

    private calculateGrade(score: number): AIEnhancedAnalysisResult['overallAssessment']['grade'] {
        if (score >= 95) return 'A+';
        if (score >= 90) return 'A';
        if (score >= 85) return 'B+';
        if (score >= 80) return 'B';
        if (score >= 75) return 'C+';
        if (score >= 70) return 'C';
        if (score >= 65) return 'D+';
        if (score >= 60) return 'D';
        return 'F';
    }

    private estimateRevisionTime(score: number, criticalIssuesCount: number): string {
        if (score >= 90 && criticalIssuesCount === 0) return '1-2주 (최종 검토)';
        if (score >= 80 && criticalIssuesCount <= 2) return '2-4주 (부분 수정)';
        if (score >= 70 && criticalIssuesCount <= 5) return '1-2개월 (전반적 수정)';
        if (score >= 60) return '2-3개월 (대폭 수정)';
        return '3-6개월 (전면 재작업)';
    }
}

// 🔥 편의 함수
export async function performAIStoryAnalysis(
    structure: NCPNarrativeStructure,
    content: string,
    characters: any[],
    plotPoints: any[],
    additionalContext?: string
): Promise<AIEnhancedAnalysisResult> {
    const analyzer = new AIEnhancedNCPAnalyzer(structure);
    return analyzer.performComprehensiveAnalysis(content, characters, plotPoints, additionalContext);
}
