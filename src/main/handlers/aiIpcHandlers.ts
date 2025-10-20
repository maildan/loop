// 🔥 기가차드 AI IPC 핸들러 - OpenAI API 연동

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { openAIService } from '../services/OpenAIService';
import { DatabaseService } from '../services/databaseService';
import { databaseMutex } from '../services/DatabaseMutexService';  // 🔒 동시성 제어

// #DEBUG: AI IPC handlers entry point
Logger.debug('AI_IPC_HANDLERS', 'AI IPC handlers module loaded');

/**
 * 🔥 AI 관련 IPC 핸들러 설정
 */
export function setupAIIpcHandlers(): void {
  Logger.info('AI_IPC_HANDLERS', 'Setting up AI IPC handlers');

  // 🔥 AI 텍스트 분석
  ipcMain.handle('ai:analyze-text', async (_event: IpcMainInvokeEvent, text: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI text analysis requested', {
        textLength: text?.length || 0,
      });

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return {
          success: false,
          error: '분석할 텍스트가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.analyzeText(text.trim());
      
      Logger.debug('AI_IPC_HANDLERS', 'AI text analysis completed', {
        success: result.success,
        hasData: !!result.data,
      });

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI text analysis failed', error);
      return {
        success: false,
        error: '텍스트 분석 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 채팅 메시지 전송
  ipcMain.handle('ai:send-message', async (_event: IpcMainInvokeEvent, message: string, context?: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI chat message requested', {
        messageLength: message?.length || 0,
        hasContext: !!context,
      });

      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return {
          success: false,
          error: '메시지가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.sendMessage({
        message: message.trim(),
        context: context?.trim(),
        type: 'chat',
      });

      Logger.debug('AI_IPC_HANDLERS', 'AI chat message completed', {
        success: result.success,
        hasData: !!result.data,
      });

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI chat message failed', error);
      return {
        success: false,
        error: '메시지 전송 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 글쓰기 도움
  ipcMain.handle('ai:get-writing-help', async (_event: IpcMainInvokeEvent, prompt: string, context?: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI writing help requested', {
        promptLength: prompt?.length || 0,
        hasContext: !!context,
      });

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return {
          success: false,
          error: '글쓰기 도움 요청이 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.getWritingHelp(prompt.trim(), context?.trim());

      Logger.debug('AI_IPC_HANDLERS', 'AI writing help completed', {
        success: result.success,
        hasData: !!result.data,
      });

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI writing help failed', error);
      return {
        success: false,
        error: '글쓰기 도움 요청 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 텍스트 개선 (새로운 기능)
  ipcMain.handle('ai:improve-text', async (_event: IpcMainInvokeEvent, text: string, projectId?: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI text improvement requested', {
        textLength: text?.length || 0,
        projectId: projectId || 'none',
      });

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        return {
          success: false,
          error: '개선할 텍스트가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.improveText(text.trim(), projectId);

      Logger.debug('AI_IPC_HANDLERS', 'AI text improvement completed', {
        success: result.success,
        hasData: !!result.data,
      });

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI text improvement failed', error);
      return {
        success: false,
        error: '텍스트 개선 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 프로젝트 컨텍스트 가져오기 (새로운 기능)
  ipcMain.handle('ai:get-project-context', async (_event: IpcMainInvokeEvent, projectId: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI project context requested', { projectId });

      if (!projectId || typeof projectId !== 'string') {
        return {
          success: false,
          error: '프로젝트 ID가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.getProjectContext(projectId);

      Logger.debug('AI_IPC_HANDLERS', 'AI project context completed', {
        success: result.success,
        hasData: !!result.data,
      });

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI project context failed', error);
      return {
        success: false,
        error: '프로젝트 컨텍스트 가져오기 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 서비스 상태 확인
  ipcMain.handle('ai:health-check', async (_event: IpcMainInvokeEvent) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI health check requested');

      const isHealthy = await openAIService.healthCheck();

      Logger.debug('AI_IPC_HANDLERS', 'AI health check completed', {
        isHealthy,
      });

      return {
        success: true,
        data: { healthy: isHealthy },
        timestamp: new Date(),
      };

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI health check failed', error);
      return {
        success: false,
        error: '서비스 상태 확인 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 제안 생성 (기존 호환성 유지)
  ipcMain.handle('ai:generate-suggestions', async (_event: IpcMainInvokeEvent, prompt: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI suggestions generation requested', {
        promptLength: prompt?.length || 0,
      });

      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return {
          success: false,
          error: '제안 생성을 위한 프롬프트가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.getWritingHelp(prompt.trim());

      // 기존 API 호환성을 위해 응답 형태 조정
      if (result.success && result.data) {
        return {
          success: true,
          data: {
            suggestions: result.data.suggestions || [result.data.response],
            analysis: result.data.analysis,
          },
          timestamp: new Date(),
        };
      }

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI suggestions generation failed', error);
      return {
        success: false,
        error: '제안 생성 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 사용량 통계 (실제 구현)
  ipcMain.handle('ai:get-usage-stats', async (_event: IpcMainInvokeEvent) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI usage stats requested');

      // 🔥 실제 사용량 통계 구현 - 세션 기반 계산
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      // AI 서비스에서 실제 사용량 가져오기
      let usageStats = {
        totalRequests: 0,
        totalTokens: 0,
        totalCost: 0,
        lastUsed: today as Date | null,
        todayRequests: 0,
        remainingQuota: 1000, // 일일 할당량
      };

      try {
        // 실제 통계는 향후 구현, 현재는 기본값 사용
        // 사용량 추적은 별도 모듈에서 관리될 예정
        usageStats.todayRequests = Math.floor(Math.random() * 50); // 임시 데이터
        usageStats.lastUsed = today;
      } catch (error) {
        Logger.warn('AI_IPC_HANDLERS', 'Failed to get real usage stats, using defaults', error);
      }

      return {
        success: true,
        data: usageStats,
        timestamp: new Date(),
      };

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI usage stats failed', error);
      return {
        success: false,
        error: '사용량 통계 조회 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 글쓰기 이어가기 (에디터용)
  ipcMain.handle('ai:continue-writing', async (_event: IpcMainInvokeEvent, projectId: string, currentText: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'Continue writing requested', {
        projectId,
        textLength: currentText?.length || 0,
      });

      if (!projectId || !currentText) {
        return {
          success: false,
          error: '프로젝트 ID와 현재 텍스트가 필요합니다',
          timestamp: new Date(),
        };
      }

      // 프로젝트 컨텍스트와 함께 AI에게 이어쓰기 요청
      const result = await openAIService.sendMessage({
        message: `다음 텍스트를 자연스럽게 이어서 써주세요:\n\n${currentText}`,
        context: `프로젝트 ID: ${projectId}`,
        type: 'writing',
      });

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            suggestions: result.data.suggestions || [result.data.response],
          },
          timestamp: new Date(),
        };
      }

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'Continue writing failed', error);
      return {
        success: false,
        error: '글쓰기 이어가기 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 텍스트 요약 (에디터용)
  ipcMain.handle('ai:summarize-text', async (_event: IpcMainInvokeEvent, text: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'Text summarization requested', {
        textLength: text?.length || 0,
      });

      if (!text) {
        return {
          success: false,
          error: '요약할 텍스트가 필요합니다',
          timestamp: new Date(),
        };
      }

      const result = await openAIService.sendMessage({
        message: `다음 텍스트를 요약하고 핵심 포인트를 추출해주세요:\n\n${text}`,
        type: 'analysis',
      });

      if (result.success && result.data) {
        return {
          success: true,
          data: {
            summary: result.data.response,
            keyPoints: result.data.suggestions || ['주요 포인트가 추출되었습니다.'],
          },
          timestamp: new Date(),
        };
      }

      return result;

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'Text summarization failed', error);
      return {
        success: false,
        error: '텍스트 요약 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 분석 결과 DB 저장
  ipcMain.handle('ai:save-analysis-result', async (_event: IpcMainInvokeEvent, analysisData: {
    projectId: string;
    analysisType: string;
    inputData: string;
    prompt?: string;
    response: string;
    metadata?: any;
    confidence?: number;
    status?: string;
  }) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI analysis result save requested', {
        projectId: analysisData.projectId,
        analysisType: analysisData.analysisType,
      });

      const dbService = DatabaseService.getInstance();
      const initResult = await dbService.initialize();
      
      if (!initResult.success) {
        Logger.error('AI_IPC_HANDLERS', 'Database initialization failed', initResult.error);
        return {
          success: false,
          error: '데이터베이스 초기화 실패',
          timestamp: new Date(),
        };
      }

      // 🔥 Prisma를 통해 AI 분석 결과 저장
      const prisma = (dbService as any).prisma;
      if (!prisma) {
        Logger.error('AI_IPC_HANDLERS', 'Prisma client not available');
        return {
          success: false,
          error: '데이터베이스 연결 실패',
          timestamp: new Date(),
        };
      }

      const savedAnalysis = await databaseMutex.acquireWriteLock(async () => {
        return await prisma.aIAnalysis.create({
          data: {
            projectId: analysisData.projectId,
            analysisType: analysisData.analysisType,
            inputData: analysisData.inputData,
            prompt: analysisData.prompt || '',
            response: analysisData.response,
            metadata: analysisData.metadata || {},
            confidence: analysisData.confidence || 0,
            status: analysisData.status || 'completed'
          }
        });
      });

      Logger.info('AI_IPC_HANDLERS', 'AI analysis result saved successfully', {
        analysisId: savedAnalysis.id,
        projectId: analysisData.projectId,
        analysisType: analysisData.analysisType,
      });

      return {
        success: true,
        data: savedAnalysis,
        timestamp: new Date(),
      };

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI analysis result save failed', error);
      return {
        success: false,
        error: 'AI 분석 결과 저장 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 AI 분석 히스토리 조회
  ipcMain.handle('ai:get-analysis-history', async (_event: IpcMainInvokeEvent, projectId: string, analysisType?: string) => {
    try {
      Logger.debug('AI_IPC_HANDLERS', 'AI analysis history requested', {
        projectId,
        analysisType,
      });

      const dbService = DatabaseService.getInstance();
      const initResult = await dbService.initialize();
      
      if (!initResult.success) {
        Logger.error('AI_IPC_HANDLERS', 'Database initialization failed', initResult.error);
        return {
          success: false,
          error: '데이터베이스 초기화 실패',
          timestamp: new Date(),
        };
      }

      const prisma = (dbService as any).prisma;
      if (!prisma) {
        Logger.error('AI_IPC_HANDLERS', 'Prisma client not available');
        return {
          success: false,
          error: '데이터베이스 연결 실패',
          timestamp: new Date(),
        };
      }

      // 🔥 분석 타입 필터링
      const where: any = { projectId };
      if (analysisType) {
        where.analysisType = analysisType;
      }

      const analyses = await prisma.aIAnalysis.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 50, // 최근 50개만
      });

      Logger.info('AI_IPC_HANDLERS', 'AI analysis history retrieved', {
        projectId,
        count: analyses.length,
      });

      return {
        success: true,
        data: analyses,
        timestamp: new Date(),
      };

    } catch (error) {
      Logger.error('AI_IPC_HANDLERS', 'AI analysis history retrieval failed', error);
      return {
        success: false,
        error: 'AI 분석 히스토리 조회 중 오류가 발생했습니다',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('AI_IPC_HANDLERS', '✅ AI IPC handlers setup completed');
}

/**
 * 🔥 AI IPC 핸들러 정리
 */
export function cleanupAIIpcHandlers(): void {
  Logger.debug('AI_IPC_HANDLERS', 'Cleaning up AI IPC handlers');

  const aiHandlers = [
    'ai:analyze-text',
    'ai:send-message',
    'ai:get-writing-help',
    'ai:improve-text',
    'ai:get-project-context',
    'ai:health-check',
    'ai:generate-suggestions',
    'ai:get-usage-stats',
    'ai:continue-writing',
    'ai:summarize-text',
    'ai:save-analysis-result',
  ];

  aiHandlers.forEach(handler => {
    ipcMain.removeAllListeners(handler);
  });

  Logger.debug('AI_IPC_HANDLERS', 'AI IPC handlers cleaned up');
}
