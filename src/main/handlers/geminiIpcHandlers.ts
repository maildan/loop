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
import type { GeminiChatRole, GeminiChatMessageDTO, GeminiChatSessionDTO } from '../../shared/types';

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
  recentMessages?: Array<{
    role: GeminiChatRole;
    content: string;
    createdAt: Date;
  }>;
}

/**
 * 🔥 Gemini 메시지 전송 파라미터
 */
interface GeminiHistoryEntry {
  id: string;
  role: GeminiChatRole;
  content: string;
}

interface GeminiMessageParams {
  projectId: string;
  sessionId?: string;
  message: string;
  systemPrompt: string;
  history: GeminiHistoryEntry[];
}

interface GeminiHistoryRequest {
  projectId: string;
  sessionId?: string;
  limit?: number;
}

async function ensureGeminiSession(prisma: any, projectId: string, sessionId?: string) {
  if (sessionId) {
    const existing = await prisma.geminiChatSession.findFirst({
      where: {
        id: sessionId,
        projectId,
      },
    });

    if (existing) {
      return existing;
    }
  }

  const latest = await prisma.geminiChatSession.findFirst({
    where: { projectId },
    orderBy: { lastInteraction: 'desc' },
  });

  if (latest) {
    return latest;
  }

  return prisma.geminiChatSession.create({
    data: {
      projectId,
      title: '기본 대화',
    },
  });
}

function mapSessionToDTO(session: any): GeminiChatSessionDTO {
  return {
    id: session.id,
    projectId: session.projectId,
    title: session.title,
    summary: session.summary,
    metadata: session.metadata,
    lastInteraction: session.lastInteraction,
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  };
}

function mapMessageToDTO(message: any, projectId: string): GeminiChatMessageDTO {
  return {
    id: message.id,
    sessionId: message.sessionId,
    projectId,
    role: message.role,
    content: message.content,
    isStreaming: message.isStreaming ?? undefined,
    tokenUsage: message.tokenUsage ?? undefined,
    metadata: message.metadata ?? undefined,
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
  };
}

const toGeminiRequestRole = (role: GeminiChatRole): 'user' | 'model' => (role === 'assistant' ? 'model' : 'user');

/**
 * Gemini IPC 핸들러 설정
 */
export function setupGeminiIpcHandlers(): void {
  Logger.debug('GEMINI_IPC', 'Setting up Gemini IPC handlers');

  ipcMain.handle('gemini:get-status', async () => {
    try {
      const { EnvironmentService } = await import('../services/EnvironmentService');
      await EnvironmentService.initialize();
      const status = EnvironmentService.getStatus();
      const available = status.GEMINI_API_KEY === 'set';

      // 🔥 DEBUG: 실제 값 확인
      const geminiKeyValue = EnvironmentService.get('GEMINI_API_KEY');
      Logger.debug('GEMINI_IPC', 'get-status result', {
        available,
        GEMINI_API_KEY_status: status.GEMINI_API_KEY,
        GEMINI_API_KEY_length: geminiKeyValue ? geminiKeyValue.length : 0,
        GEMINI_API_KEY_prefix: geminiKeyValue ? `***${geminiKeyValue.slice(-8)}` : 'undefined',
        GEMINI_MODEL: status.GEMINI_MODEL,
      });

      return {
        success: true,
        data: {
          available,
          status,
          message: available
            ? 'Gemini API 키가 구성되어 있습니다.'
            : 'Gemini 기능을 사용하려면 환경변수 GEMINI_API_KEY를 설정해야 합니다.',
        },
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('GEMINI_IPC', 'Failed to resolve Gemini availability', error);
      return {
        success: false,
        error: 'Gemini 환경 상태를 확인하지 못했습니다.',
        timestamp: new Date(),
      };
    }
  });

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

      const recentMessageRecords = await prisma.geminiChatMessage.findMany({
        where: {
          session: {
            projectId,
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          role: true,
          content: true,
          createdAt: true,
        },
      });

      const recentMessages = recentMessageRecords
        .reverse()
        .map((message: { role: string; content: string; createdAt: Date }) => ({
          role: message.role as GeminiChatRole,
          content: message.content,
          createdAt: message.createdAt,
        }));

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
        recentMessages,
      };

      Logger.info('GEMINI_IPC', 'Project context retrieved', {
        projectId,
        characterCount: characters.length,
        wordCount: totalWords,
        recentMessages: recentMessages.length,
      });

      return { success: true, data: context };

    } catch (error) {
      Logger.error('GEMINI_IPC', 'Failed to get project context', { error, projectId });
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

  ipcMain.handle('gemini:get-chat-history', async (_event: IpcMainEvent, params: GeminiHistoryRequest) => {
    try {
      if (!params?.projectId) {
        throw new Error('projectId가 필요합니다.');
      }

      const prisma = await prismaService.getClient();
      const session = await ensureGeminiSession(prisma, params.projectId, params.sessionId);
      const limit = Math.min(Math.max(params.limit ?? 200, 1), 500);

      const messages = await prisma.geminiChatMessage.findMany({
        where: { sessionId: session.id },
        orderBy: { createdAt: 'asc' },
        take: limit,
      });

      return {
        success: true,
        data: {
          session: mapSessionToDTO(session),
          messages: messages.map((message: any) => mapMessageToDTO(message, session.projectId)),
        },
      };
    } catch (error) {
      Logger.error('GEMINI_IPC', 'Failed to load chat history', {
        error,
        projectId: params?.projectId,
        sessionId: params?.sessionId,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

  //  스트리밍 응답 (웹컨텐츠를 통해 청크 전송)
  ipcMain.handle('gemini:send-message', async (event: IpcMainEvent, params: GeminiMessageParams) => {
    let prisma: any | null = null;
    let session: any | null = null;
    let assistantMessageId: string | null = null;
    const trimmedMessage = params.message?.trim();

    try {
      if (!trimmedMessage) {
        throw new Error('메시지를 입력해주세요.');
      }

      Logger.debug('GEMINI_IPC', 'Sending message to Gemini (streaming)', {
        projectId: params.projectId,
        messageLength: trimmedMessage.length,
      });

      prisma = await prismaService.getClient();
      session = await ensureGeminiSession(prisma, params.projectId, params.sessionId);

      await prisma.geminiChatSession.update({
        where: { id: session.id },
        data: { lastInteraction: new Date() },
      }).catch(() => undefined);

      await prisma.geminiChatMessage.create({
        data: {
          sessionId: session.id,
          role: 'user',
          content: trimmedMessage,
        },
      });

      const assistantMessage = await prisma.geminiChatMessage.create({
        data: {
          sessionId: session.id,
          role: 'assistant',
          content: '',
          isStreaming: true,
        },
      });

      assistantMessageId = assistantMessage.id;

      const geminiClient = getGeminiClient();
      const model = geminiClient.getModel();

      if (!model) {
        throw new Error('Gemini model not initialized');
      }

      const sanitizedHistory = (params.history ?? []).filter((item) => item.role !== 'system');
      const contents = sanitizedHistory.map((msg) => ({
        role: toGeminiRequestRole(msg.role),
        parts: [{ text: msg.content }],
      }));

      contents.push({
        role: 'user',
        parts: [{ text: trimmedMessage }],
      });

      let accumulatedText = '';
      let lastPersistAt = Date.now();

      const streamResult = await model.generateContentStream({
        contents,
        systemInstruction: params.systemPrompt,
        generationConfig: {
          maxOutputTokens: 4082,
          temperature: 0.7,
        },
      });

      for await (const chunk of streamResult.stream) {
        const chunkText = chunk.text();
        if (!chunkText) {
          continue;
        }

        accumulatedText += chunkText;

        event.sender.send('gemini:stream-chunk', {
          projectId: params.projectId,
          sessionId: session.id,
          messageId: assistantMessageId,
          chunk: chunkText,
          accumulated: accumulatedText,
        });

        const now = Date.now();
        if (now - lastPersistAt >= 400) {
          await prisma.geminiChatMessage.update({
            where: { id: assistantMessageId },
            data: {
              content: accumulatedText,
              updatedAt: new Date(),
            },
          }).catch(() => undefined);

          lastPersistAt = now;
        }
      }

      let finalResponse: any = null;
      if (streamResult && 'response' in streamResult && typeof (streamResult as { response?: Promise<unknown> }).response?.then === 'function') {
        finalResponse = await (streamResult as { response?: Promise<any> }).response?.catch(() => null);
      }

      const tokenUsage = finalResponse?.usageMetadata
        ? {
            promptTokens: finalResponse.usageMetadata.promptTokenCount ?? 0,
            responseTokens: finalResponse.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: finalResponse.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined;

      await prisma.geminiChatMessage.update({
        where: { id: assistantMessageId },
        data: {
          content: accumulatedText,
          isStreaming: false,
          tokenUsage,
        },
      });

      await prisma.geminiChatSession.update({
        where: { id: session.id },
        data: { lastInteraction: new Date() },
      }).catch(() => undefined);

      Logger.info('GEMINI_IPC', 'Message sent successfully (streaming)', {
        projectId: params.projectId,
        sessionId: session.id,
        assistantMessageId,
        contentLength: accumulatedText.length,
      });

      return {
        success: true,
        data: { response: accumulatedText, sessionId: session.id },
      };

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      Logger.error('GEMINI_IPC', 'Failed to send message', {
        error,
        projectId: params.projectId,
        sessionId: session?.id,
        assistantMessageId,
      });

      if (assistantMessageId && prisma) {
        await prisma.geminiChatMessage.update({
          where: { id: assistantMessageId },
          data: {
            content: `오류 발생: ${errorMessage}`,
            isStreaming: false,
          },
        }).catch(() => undefined);
      }

      if (session && prisma) {
        await prisma.geminiChatSession.update({
          where: { id: session.id },
          data: { lastInteraction: new Date() },
        }).catch(() => undefined);
      }

      event.sender.send('gemini:stream-error', {
        projectId: params.projectId,
        sessionId: session?.id,
        messageId: assistantMessageId,
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  });

  Logger.info('GEMINI_IPC', 'Gemini IPC handlers registered');
}
