/**
 * 🤖 Gemini IPC 핸들러 - AI 어시스턴트 관리
 *
 * 프로젝트 분석 데이터 수집 및 Gemini API 호출
 */

import { ipcMain } from 'electron';
import type { IpcMainEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { prismaService } from '../services/PrismaService';
import { getGeminiClient } from '../../shared/ai/geminiClient';
import { analyzeNarrativeKeywords } from '../../shared/narrative/keywordSets';

/**
 * 🔥 프로젝트 컨텍스트 인터페이스
 */
interface ProjectContext {
  projectId: string;
  title: string;
  wordCount: number;
  progress: number;
  characters: Array<{
    name: string;
    role: string;
    description?: string;
  }>;
  stats?: {
    totalWords: number;
    totalChapters: number;
    completionRate: number;
  };
  analysisInsights?: {
    characterConsistency?: string[];
    plotSuggestions?: string[];
    narrativeKeywords?: string[];
  };
}

/**
 * 🔥 Gemini 메시지 전송 파라미터
 */
interface GeminiMessageParams {
  projectId: string;
  message: string;
  systemPrompt: string;
  history: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
  }>;
}

/**
 * Gemini IPC 핸들러 설정
 */
export function setupGeminiIpcHandlers(): void {
  Logger.debug('GEMINI_IPC', 'Setting up Gemini IPC handlers');

  // 🔥 프로젝트 컨텍스트 가져오기
  ipcMain.handle('gemini:get-project-context', async (event: IpcMainEvent, projectId: string) => {
    try {
      Logger.debug('GEMINI_IPC', 'Getting project context', { projectId });

      const prisma = await prismaService.getClient();

      // 프로젝트 기본 정보
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          title: true,
          wordCount: true,
          progress: true,
        },
      });

      if (!project) {
        throw new Error('Project not found');
      }

      // 캐릭터 정보
      const characters = await prisma.projectCharacter.findMany({
        where: { projectId, isActive: true },
        select: {
          name: true,
          role: true,
          description: true,
        },
        orderBy: { sortOrder: 'asc' },
      });

      // 챕터 통계
      const chapters = await prisma.projectStructure.findMany({
        where: {
          projectId,
          type: 'chapter',
          isActive: true,
        },
        select: {
          wordCount: true,
          status: true,
          content: true,
        },
      });

      const totalWords = chapters.reduce((sum: number, ch: typeof chapters[0]) => {
        if (ch.wordCount && ch.wordCount > 0) {
          return sum + ch.wordCount;
        }
        if (ch.content) {
          // content 기반 계산
          const normalized = ch.content.trim();
          if (normalized.length > 0) {
            return sum + normalized.length;
          }
        }
        return sum;
      }, 0);

      const totalChapters = chapters.length;
      const completedChapters = chapters.filter((ch: typeof chapters[0]) =>
        ch.status === 'completed' || ch.status === 'published'
      ).length;
      const completionRate = totalChapters > 0 
        ? (completedChapters / totalChapters) * 100 
        : 0;

      // 🔥 분석 인사이트 (최근 AI 분석 결과 활용)
      const recentAnalyses = await prisma.aIAnalysis.findMany({
        where: {
          projectId,
          status: 'completed',
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          analysisType: true,
          response: true,
          metadata: true,
        },
      });

      const characterConsistency: string[] = [];
      const plotSuggestions: string[] = [];
      const narrativeKeywords: string[] = [];

      // AI 분석 결과에서 인사이트 추출
      recentAnalyses.forEach((analysis: typeof recentAnalyses[0]) => {
        if (analysis.analysisType === 'character') {
          // 캐릭터 일관성 관련 인사이트
          try {
            const insights = JSON.parse(analysis.response);
            if (insights.consistency) {
              characterConsistency.push(...(insights.consistency as string[]).slice(0, 3));
            }
          } catch (e) {
            // 파싱 실패 시 무시
          }
        }
        
        if (analysis.analysisType === 'plot' || analysis.analysisType === 'synopsis') {
          // 플롯 제안
          try {
            const insights = JSON.parse(analysis.response);
            if (insights.suggestions) {
              plotSuggestions.push(...(insights.suggestions as string[]).slice(0, 3));
            }
          } catch (e) {
            // 파싱 실패 시 무시
          }
        }
      });

      // 🔥 서사 키워드 분석
      const allCharacterTexts = characters.map((ch: typeof characters[0]) => ch.description || '');
      const keywordAnalysis = analyzeNarrativeKeywords(allCharacterTexts);
      
      // keywordAnalysis는 NarrativeKeywordInsight[] 배열
      const speechInsights = keywordAnalysis.find(k => k.category === 'speechPattern');
      const appearanceInsights = keywordAnalysis.find(k => k.category === 'appearance');
      const personalityInsights = keywordAnalysis.find(k => k.category === 'personality');
      
      if (speechInsights && speechInsights.matchedKeywords.length > 0) {
        narrativeKeywords.push(`말투: ${speechInsights.matchedKeywords.slice(0, 3).join(', ')}`);
      }
      if (appearanceInsights && appearanceInsights.matchedKeywords.length > 0) {
        narrativeKeywords.push(`외모: ${appearanceInsights.matchedKeywords.slice(0, 3).join(', ')}`);
      }
      if (personalityInsights && personalityInsights.matchedKeywords.length > 0) {
        narrativeKeywords.push(`성격: ${personalityInsights.matchedKeywords.slice(0, 3).join(', ')}`);
      }

      const context = {
        projectTitle: project.title,
        totalEpisodes: totalChapters,
        totalWords,
        characters: characters.map((ch: typeof characters[0]) => ({
          name: ch.name,
          role: ch.role,
          description: ch.description || undefined,
        })),
        aiInsights: [
          ...characterConsistency.map(c => `캐릭터 일관성: ${c}`),
          ...plotSuggestions.map(p => `플롯 제안: ${p}`),
          ...narrativeKeywords,
        ],
      };

      Logger.info('GEMINI_IPC', 'Project context retrieved', {
        projectId,
        characterCount: characters.length,
        wordCount: totalWords,
      });

      return { success: true, data: context };

    } catch (error) {
      Logger.error('GEMINI_IPC', 'Failed to get project context', { error, projectId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  // 🔥 Gemini에게 메시지 전송 (스트리밍)
  ipcMain.handle('gemini:send-message', async (event: IpcMainEvent, params: GeminiMessageParams) => {
    try {
      Logger.debug('GEMINI_IPC', 'Sending message to Gemini', {
        projectId: params.projectId,
        messageLength: params.message.length,
      });

      const geminiClient = getGeminiClient();

      // 대화 히스토리 구성
      let fullPrompt = `${params.systemPrompt}\n\n`;
      
      // 히스토리 추가 (최근 5턴만)
      const recentHistory = params.history.slice(-10); // 최대 10개 메시지 (5턴)
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          fullPrompt += `사용자: ${msg.content}\n\n`;
        } else if (msg.role === 'assistant') {
          fullPrompt += `어시스턴트: ${msg.content}\n\n`;
        }
      });

      // 현재 메시지
      fullPrompt += `사용자: ${params.message}\n\n`;
      fullPrompt += `어시스턴트: `;

      // 🔥 Gemini API 호출 (스트리밍)
      const response = await geminiClient.generateText({
        prompt: fullPrompt,
        maxTokens: 2048,
        temperature: 0.7,
      });

      Logger.info('GEMINI_IPC', 'Message sent successfully', {
        projectId: params.projectId,
        contentLength: response.content.length,
      });

      // 🔥 IpcResponse 형태로 반환
      return { 
        success: true, 
        data: { response: response.content } 
      };

    } catch (error) {
      Logger.error('GEMINI_IPC', 'Failed to send message', { error, projectId: params.projectId });
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });

  Logger.info('GEMINI_IPC', 'Gemini IPC handlers registered');
}
