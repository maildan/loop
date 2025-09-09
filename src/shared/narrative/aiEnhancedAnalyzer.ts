// 🔥 AI-Enhanced NCP Story Analyzer - Gemini 연동
import { NCPStoryAnalyzer, type NCPNarrativeStructure, type ReaderEngagementPrediction, type TimelineAnalysis, type MindmapAnalysis } from './ncpAnalyzer';
import { getGeminiClient, type GeminiResponse } from '../ai/geminiClient';
import { Logger } from '../logger';

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

    constructor(structure: NCPNarrativeStructure) {
        super(structure);
        Logger.info('AI_NCP_ANALYZER', 'Initialized with AI enhancement');
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

    // 🔥 시놉시스 분석
    private async performSynopsisAnalysis(content: string, context?: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['synopsis']> {
        const prompt = `
다음은 소설의 시놉시스입니다. 전문 편집자의 관점에서 종합적으로 분석해주세요.

${context ? `[추가 컨텍스트]\n${context}\n\n` : ''}

[시놉시스]
${content}

다음 형식으로 분석해주세요:
1. 전체적인 완성도 평가 (0-100점)
2. 주요 강점 3-5가지
3. 개선이 필요한 약점 3-5가지
4. 구체적인 개선 제안 5-7가지
5. 독자 타겟팅과 시장성 분석
6. 출간 준비도 평가
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'synopsis');

        // AI 응답을 파싱하여 구조화된 데이터 생성
        const analysisData = this.parseSynopsisAnalysis(aiResponse.content);

        return {
            overall: aiResponse,
            strengths: analysisData.strengths,
            weaknesses: analysisData.weaknesses,
            score: analysisData.score,
            recommendations: analysisData.recommendations
        };
    }

    // 🔥 캐릭터 분석
    private async performCharacterAnalysis(characters: any[], content: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['characters']> {
        const characterData = characters.map(char => ({
            name: char.name || char.title,
            role: char.role || 'unknown',
            description: char.description || char.content,
            background: char.background,
            goals: char.goals
        }));

        const prompt = `
다음은 소설의 등장인물 정보와 스토리 내용입니다. 캐릭터 개발 전문가로서 분석해주세요.

[등장인물 정보]
${JSON.stringify(characterData, null, 2)}

[스토리 내용]
${content.slice(0, 2000)}...

분석 요청사항:
1. 각 캐릭터의 동기와 목표 명확성 (0-100점)
2. 캐릭터 아크의 완성도 평가
3. 캐릭터 간 관계의 깊이와 발전성
4. 캐릭터 일관성과 현실감
5. 캐릭터 발전을 위한 구체적 제안
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'character');
        const analysisData = this.parseCharacterAnalysis(aiResponse.content);

        return {
            analysis: aiResponse,
            arcCompleteness: analysisData.arcCompleteness,
            relationshipDepth: analysisData.relationshipDepth,
            developmentSuggestions: analysisData.developmentSuggestions
        };
    }

    // 🔥 플롯 분석
    private async performPlotAnalysis(plotPoints: any[], content: string): Promise<AIEnhancedAnalysisResult['aiAnalysis']['plot']> {
        const plotData = plotPoints.map(point => ({
            title: point.title,
            type: point.type,
            description: point.description,
            order: point.order || point.sortOrder
        }));

        const prompt = `
다음은 소설의 플롯 구조와 내용입니다. 플롯 구조 전문가로서 분석해주세요.

[플롯 구조]
${JSON.stringify(plotData, null, 2)}

[스토리 내용]
${content.slice(0, 3000)}...

분석 요청사항:
1. 플롯의 논리적 일관성 (0-100점)
2. 3막 구조의 균형성 평가
3. 페이싱과 긴장감 곡선 분석
4. 클라이맥스의 효과성
5. 발견된 플롯홀과 논리적 오류
6. 구조 개선을 위한 제안
        `;

        const aiResponse = await this.geminiClient.analyzeStoryStructure(prompt, 'plot');
        const analysisData = this.parsePlotAnalysis(aiResponse.content);

        return {
            analysis: aiResponse,
            coherenceScore: analysisData.coherenceScore,
            pacingScore: analysisData.pacingScore,
            climaxEffectiveness: analysisData.climaxEffectiveness,
            plotHoles: analysisData.plotHoles,
            structuralSuggestions: analysisData.structuralSuggestions
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

    // 🔥 AI 응답 파싱 유틸리티들
    private parseSynopsisAnalysis(content: string) {
        // AI 응답을 파싱하여 구조화된 데이터로 변환
        const scoreMatch = content.match(/(\d+)점|(\d+)\/100|점수[:\s]*(\d+)/i);
        const score = scoreMatch ? parseInt((scoreMatch[1] || scoreMatch[2] || scoreMatch[3]) || '75') : 75;

        const strengthsSection = content.match(/강점[:\s]*\n*((?:.*\n)*?)(?=약점|개선|$)/i);
        const strengths = strengthsSection?.[1] ?
            strengthsSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 5) :
            ['구체적인 강점 분석 필요'];

        const weaknessesSection = content.match(/약점[:\s]*\n*((?:.*\n)*?)(?=제안|개선|$)/i);
        const weaknesses = weaknessesSection?.[1] ?
            weaknessesSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 5) :
            ['구체적인 약점 분석 필요'];

        const recommendationsSection = content.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const recommendations = recommendationsSection?.[1] ?
            recommendationsSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 7) :
            ['추가 분석이 필요합니다'];

        return { score, strengths, weaknesses, recommendations };
    }

    private parseCharacterAnalysis(content: string) {
        const arcMatch = content.match(/아크.*?(\d+)점|완성도.*?(\d+)/i);
        const arcCompleteness = arcMatch ? parseInt((arcMatch[1] || arcMatch[2]) || '70') : 70;

        const relationshipMatch = content.match(/관계.*?(\d+)점|깊이.*?(\d+)/i);
        const relationshipDepth = relationshipMatch ? parseInt((relationshipMatch[1] || relationshipMatch[2]) || '70') : 70;

        const suggestionsSection = content.match(/제안[:\s]*\n*((?:.*\n)*?)$/i);
        const developmentSuggestions = suggestionsSection?.[1] ?
            suggestionsSection[1].split('\n').filter(s => s.trim().length > 0).slice(0, 5) :
            ['캐릭터 발전 제안 분석 중'];

        return { arcCompleteness, relationshipDepth, developmentSuggestions };
    }

    private parsePlotAnalysis(content: string) {
        const coherenceMatch = content.match(/일관성.*?(\d+)점|논리.*?(\d+)/i);
        const coherenceScore = coherenceMatch ? parseInt((coherenceMatch[1] || coherenceMatch[2]) || '75') : 75;

        const pacingMatch = content.match(/페이싱.*?(\d+)점|리듬.*?(\d+)/i);
        const pacingScore = pacingMatch ? parseInt((pacingMatch[1] || pacingMatch[2]) || '75') : 75;

        const climaxMatch = content.match(/클라이맥스.*?(\d+)점|효과.*?(\d+)/i);
        const climaxEffectiveness = climaxMatch ? parseInt((climaxMatch[1] || climaxMatch[2]) || '75') : 75;

        const plotHoles = content.match(/플롯홀|오류|문제/gi) ?
            ['플롯 일관성 검토 필요', '논리적 연결성 강화'] : [];

        const structuralSuggestions = ['구조적 개선 방안 도출 중'];

        return { coherenceScore, pacingScore, climaxEffectiveness, plotHoles, structuralSuggestions };
    }

    private parseThemeAnalysis(content: string) {
        const clarityMatch = content.match(/명확성.*?(\d+)점|테마.*?(\d+)/i);
        const clarity = clarityMatch ? parseInt((clarityMatch[1] || clarityMatch[2]) || '75') : 75;

        const consistencyMatch = content.match(/일관성.*?(\d+)점|표현.*?(\d+)/i);
        const consistency = consistencyMatch ? parseInt((consistencyMatch[1] || consistencyMatch[2]) || '75') : 75;

        const resonanceMatch = content.match(/공명.*?(\d+)점|감정.*?(\d+)/i);
        const resonance = resonanceMatch ? parseInt((resonanceMatch[1] || resonanceMatch[2]) || '75') : 75;

        const suggestions = ['테마 강화 방안 분석 중'];

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
