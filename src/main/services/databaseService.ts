// 🔥 기가차드 데이터베이스 서비스 - Prisma ORM 전용!

import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result, isObject } from '../../shared/common';
import { TypingSession, TypingStats, UserPreferences, Project, ProjectCharacter } from '../../shared/types';
import type { Theme } from '../../shared/types/theme';
import { isValidTheme } from '../../shared/types/theme';
import { ensureDatabaseUrl } from '../utils/prismaPaths';
import { safePathJoin } from '../../shared/utils/pathSecurity';

// #DEBUG: Database service entry point
Logger.debug('DATABASE', 'Database service module loaded');

// 🔥 기가차드 Prisma 클라이언트 타입 (동적 로딩)
interface PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  $executeRaw(query: TemplateStringsArray, ...values: unknown[]): Promise<number>;
  typingSession: {
    create(data: { data: unknown }): Promise<unknown>;
    findMany(args?: unknown): Promise<unknown[]>;
    findUnique(args: { where: { id: string } }): Promise<unknown | null>;
    update(args: { where: { id: string }; data: unknown }): Promise<unknown>;
    delete(args: { where: { id: string } }): Promise<unknown>;
  };
  userSettings: {
    upsert(args: { where: { userId: string }; create: unknown; update: unknown }): Promise<unknown>;
    findUnique(args: { where: { userId: string } }): Promise<unknown | null>;
  };
  project: {
    findMany(args?: unknown): Promise<unknown[]>;
    findUnique(args: { where: { id: string } }): Promise<unknown | null>;
    create(data: { data: unknown }): Promise<unknown>;
    update(args: { where: { id: string }; data: unknown }): Promise<unknown>;
    delete(args: { where: { id: string } }): Promise<unknown>;
  };
  projectCharacter: {
    findMany(args?: unknown): Promise<unknown[]>;
    findUnique(args: { where: { id: string } }): Promise<unknown | null>;
    create(data: { data: unknown }): Promise<unknown>;
    update(args: { where: { id: string }; data: unknown }): Promise<unknown>;
    delete(args: { where: { id: string } }): Promise<unknown>;
  };
}

// 🔥 기가차드 데이터베이스 설정 인터페이스
export interface DatabaseConfig {
  databaseUrl: string;
  maxConnections: number;
  connectionTimeout: number;
  queryTimeout: number;
  enableLogging: boolean;
  enableMetrics: boolean;
}

// 🔥 기가차드 데이터베이스 서비스 클래스
export class DatabaseService {
  private static instance: DatabaseService | null = null;
  private prisma: PrismaClient | null = null;
  private isConnected = false;
  private config: DatabaseConfig;

  private constructor() {
    this.config = {
      databaseUrl: process.env.DATABASE_URL || 'file:./loop.db',
      maxConnections: 10,
      connectionTimeout: 10000,
      queryTimeout: 5000,
      enableLogging: process.env.NODE_ENV === 'development',
      enableMetrics: true,
    };
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // 🔥 데이터베이스 초기화
  public async initialize(): Promise<Result<boolean>> {
    try {
      // #DEBUG: Initializing database
      Logger.debug('DATABASE', 'Initializing database connection');

      const { dbPath, databaseUrl } = ensureDatabaseUrl();
      this.config.databaseUrl = databaseUrl;
      Logger.info('DATABASE', 'Resolved Prisma database path', { dbPath, databaseUrl });

      // Prisma 클라이언트 동적 로딩
      // 패키지 앱에서는 extraResources에서, 개발 환경에서는 node_modules에서 로드
      const { app } = require('electron');
      let PrismaClientConstructor;
      
      if (app.isPackaged) {
        // 패키지 앱: extraResources/prisma/client/index.js를 직접 require (default.js의 exports condition 우회)
        const path = require('path');
        const prismaClientDir = safePathJoin(process.resourcesPath || '', 'prisma', 'client');
        
        if (!prismaClientDir) {
          Logger.error('DATABASE', 'Failed to create secure Prisma client directory path');
          throw new Error('Failed to create secure Prisma client directory path');
        }
        
        // default.js 대신 index.js 직접 로드
        const indexPath = safePathJoin(prismaClientDir, 'index.js');
        if (!indexPath) {
          Logger.error('DATABASE', 'Failed to create secure Prisma index path');
          throw new Error('Failed to create secure Prisma index path');
        }
        
        Logger.info('DATABASE', 'Loading Prisma client from extraResources', { indexPath });
        
        // 🔒 보안: 동적 require는 일반적으로 위험하지만, 이 경우는 안전함
        // - indexPath는 safePathJoin으로 검증된 경로 (process.resourcesPath + 'prisma/client/index.js')
        // - process.resourcesPath는 Electron이 제공하는 신뢰할 수 있는 경로
        // - 사용자 입력이 개입하지 않는 고정된 패턴
        // nosemgrep: javascript.lang.security.audit.unsafe-dynamic-method-exec
        // eslint-disable-next-line @typescript-eslint/no-var-requires, security/detect-non-literal-require
        const prismaModule = require(indexPath);
        PrismaClientConstructor = prismaModule.PrismaClient;
      } else {
        // 개발 환경: 일반 node_modules에서 로드
        Logger.info('DATABASE', 'Loading Prisma client from node_modules');
        const prismaModule = await import('@prisma/client');
        PrismaClientConstructor = (prismaModule as unknown as { PrismaClient: new (...args: unknown[]) => PrismaClient }).PrismaClient ||
          (prismaModule as unknown as { default: { PrismaClient: new (...args: unknown[]) => PrismaClient } }).default?.PrismaClient;
      }

      if (!PrismaClientConstructor) {
        throw new Error('PrismaClient not found in module');
      }

      this.prisma = new PrismaClientConstructor({
        datasources: {
          db: {
            url: this.config.databaseUrl,
          },
        },
        log: this.config.enableLogging ? ['query', 'info', 'warn', 'error'] : [],
      }) as PrismaClient;

      // 데이터베이스 연결
      await this.prisma.$connect();
      this.isConnected = true;

      Logger.info('DATABASE', 'Database initialized successfully', {
        url: this.config.databaseUrl,
        logging: this.config.enableLogging,
      });

      return createSuccess(true);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to initialize database', error);
      return createError(error instanceof Error ? error.message : 'Database initialization failed');
    }
  }

  // 🔥 데이터베이스 연결 해제
  public async disconnect(): Promise<Result<boolean>> {
    try {
      if (!this.prisma || !this.isConnected) {
        return createSuccess(true);
      }

      // #DEBUG: Disconnecting from database
      Logger.debug('DATABASE', 'Disconnecting from database');

      await this.prisma.$disconnect();
      this.isConnected = false;
      this.prisma = null;

      Logger.info('DATABASE', 'Database disconnected successfully');
      return createSuccess(true);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to disconnect from database', error);
      return createError(error instanceof Error ? error.message : 'Database disconnect failed');
    }
  }

  // 🔥 타이핑 세션 저장
  public async saveTypingSession(session: Omit<TypingSession, 'id'>): Promise<Result<string>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Saving typing session
      Logger.debug('DATABASE', 'Saving typing session', {
        keyCount: session.keyCount,
        wpm: session.wpm,
        userId: session.userId,
      });

      const result = await this.prisma!.typingSession.create({
        data: {
          userId: session.userId,
          content: session.content,
          startTime: session.startTime,
          endTime: session.endTime,
          keyCount: session.keyCount,
          wpm: session.wpm,
          accuracy: session.accuracy,
          windowTitle: session.windowTitle,
          appName: session.appName,
        },
      });

      const sessionId = isObject(result) && 'id' in result ? String(result.id) : 'unknown';

      Logger.info('DATABASE', 'Typing session saved successfully', { id: sessionId });
      return createSuccess(sessionId);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to save typing session', error);
      return createError(error instanceof Error ? error.message : 'Failed to save session');
    }
  }

  // 🔥 타이핑 세션 목록 조회
  public async getTypingSessions(limit = 100, offset = 0): Promise<Result<TypingSession[]>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Fetching typing sessions
      Logger.debug('DATABASE', 'Fetching typing sessions', { limit, offset });

      const sessions = await this.prisma!.typingSession.findMany({
        orderBy: { startTime: 'desc' },
        take: limit,
        skip: offset,
      });

      const typedSessions = sessions.map(session => this.mapToTypingSession(session));

      Logger.info('DATABASE', 'Typing sessions retrieved successfully', {
        count: typedSessions.length
      });

      return createSuccess(typedSessions);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to fetch typing sessions', error);
      return createError(error instanceof Error ? error.message : 'Failed to fetch sessions');
    }
  }

  // 🔥 타이핑 세션 삭제
  public async deleteTypingSession(sessionId: string): Promise<Result<boolean>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Deleting typing session
      Logger.debug('DATABASE', 'Deleting typing session', { sessionId });

      const deleted = await this.prisma!.typingSession.delete({
        where: { id: sessionId },
      });

      if (deleted) {
        Logger.info('DATABASE', 'Typing session deleted successfully', { sessionId });
        return createSuccess(true);
      } else {
        Logger.warn('DATABASE', 'Session not found for deletion', { sessionId });
        return createError('Session not found');
      }

    } catch (error) {
      Logger.error('DATABASE', 'Failed to delete typing session', error);
      return createError(error instanceof Error ? error.message : 'Failed to delete session');
    }
  }

  // 🔥 타이핑 통계 계산
  public async getTypingStats(days = 30): Promise<Result<TypingStats>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Calculating typing stats
      Logger.debug('DATABASE', 'Calculating typing stats', { days });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const sessions = await this.prisma!.typingSession.findMany({
        where: {
          startTime: {
            gte: cutoffDate,
          },
        },
      });

      const stats = this.calculateStats(sessions);

      Logger.info('DATABASE', 'Typing stats calculated successfully', stats);
      return createSuccess(stats);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to calculate typing stats', error);
      return createError(error instanceof Error ? error.message : 'Failed to calculate stats');
    }
  }

  // 🔥 사용자 설정 저장
  public async saveUserPreferences(preferences: UserPreferences): Promise<Result<boolean>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Saving user preferences
      Logger.debug('DATABASE', 'Saving user preferences', { type: typeof preferences, preferences });

      // 문자열로 전달된 경우 파싱
      let parsedPreferences = preferences;
      if (typeof preferences === 'string') {
        try {
          parsedPreferences = JSON.parse(preferences);
        } catch (error) {
          Logger.error('DATABASE', 'Failed to parse preferences string', error);
          throw new Error('Invalid preferences format');
        }
      }

      // 먼저 default 사용자 확인/생성
      await this.prisma!.$executeRaw`
        INSERT OR IGNORE INTO users (id, username, email, createdAt, updatedAt) 
        VALUES ('default', 'default_user', 'default@loop.app', datetime('now'), datetime('now'))
      `;

      // 설정 필드 매핑 (Prisma UserSettings 모델과 UserPreferences 타입 매핑)
      const settingsData = {
        theme: (typeof parsedPreferences.theme === 'string' && isValidTheme(parsedPreferences.theme)) ? parsedPreferences.theme : 'light',
        language: (typeof parsedPreferences.language === 'string') ? parsedPreferences.language : 'ko',
        keyboardLayout: 'qwerty', // 기본값
        showRealTimeWpm: true, // 기본값
        enableSounds: Boolean(parsedPreferences.enableSounds !== undefined ? parsedPreferences.enableSounds : false),
        autoSaveInterval: 30, // 기본값
        privacyMode: Boolean(parsedPreferences.privacyMode !== undefined ? parsedPreferences.privacyMode : false),
        monitoringEnabled: Boolean(parsedPreferences.trackingEnabled !== undefined ? parsedPreferences.trackingEnabled : true),
        targetWpm: 60, // 기본값
        sessionGoalMinutes: 30, // 기본값
      };

      await this.prisma!.userSettings.upsert({
        where: { userId: 'default' },
        create: {
          userId: 'default',
          theme: settingsData.theme,
          language: settingsData.language,
          keyboardLayout: settingsData.keyboardLayout,
          showRealTimeWpm: settingsData.showRealTimeWpm,
          enableSounds: settingsData.enableSounds,
          autoSaveInterval: settingsData.autoSaveInterval,
          privacyMode: settingsData.privacyMode,
          monitoringEnabled: settingsData.monitoringEnabled,
          targetWpm: settingsData.targetWpm,
          sessionGoalMinutes: settingsData.sessionGoalMinutes,
        },
        update: {
          theme: settingsData.theme,
          language: settingsData.language,
          keyboardLayout: settingsData.keyboardLayout,
          showRealTimeWpm: settingsData.showRealTimeWpm,
          enableSounds: settingsData.enableSounds,
          autoSaveInterval: settingsData.autoSaveInterval,
          privacyMode: settingsData.privacyMode,
          monitoringEnabled: settingsData.monitoringEnabled,
          targetWpm: settingsData.targetWpm,
          sessionGoalMinutes: settingsData.sessionGoalMinutes,
        },
      });

      Logger.info('DATABASE', 'User preferences saved successfully');
      return createSuccess(true);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to save user preferences', error);
      return createError(error instanceof Error ? error.message : 'Failed to save preferences');
    }
  }

  // 🔥 사용자 설정 조회
  public async getUserPreferences(): Promise<Result<UserPreferences | null>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      // #DEBUG: Fetching user preferences
      Logger.debug('DATABASE', 'Fetching user preferences');

      const preferences = await this.prisma!.userSettings.findUnique({
        where: { userId: 'default' },
      });

      const typedPreferences = preferences ? this.mapToUserPreferences(preferences) : null;

      Logger.info('DATABASE', 'User preferences retrieved successfully');
      return createSuccess(typedPreferences);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to fetch user preferences', error);
      return createError(error instanceof Error ? error.message : 'Failed to fetch preferences');
    }
  }

  // 🔥 헬스 체크
  public async healthCheck(): Promise<Result<{ connected: boolean; latency: number }>> {
    try {
      const startTime = Date.now();

      if (!this.prisma) {
        return createSuccess({ connected: false, latency: 0 });
      }

      // 간단한 쿼리로 연결 상태 확인
      await this.prisma.$executeRaw`SELECT 1`;
      const latency = Date.now() - startTime;

      return createSuccess({ connected: true, latency });

    } catch (error) {
      Logger.error('DATABASE', 'Database health check failed', error);
      return createSuccess({ connected: false, latency: -1 });
    }
  }

  // 🔥 private 헬퍼 메서드들
  private ensureConnection(): boolean {
    if (!this.prisma || !this.isConnected) {
      Logger.warn('DATABASE', 'Database not connected');
      return false;
    }
    return true;
  }

  private mapToTypingSession(data: unknown): TypingSession {
    if (!isObject(data)) {
      throw new Error('Invalid session data');
    }

    return {
      id: String(data.id || ''),
      userId: String(data.userId || ''),
      content: String(data.content || ''),
      startTime: new Date(data.startTime as string),
      endTime: data.endTime ? new Date(data.endTime as string) : null,
      keyCount: Number(data.keyCount || 0),
      wpm: Number(data.wpm || 0),
      accuracy: Number(data.accuracy || 0),
      windowTitle: data.windowTitle ? String(data.windowTitle) : null,
      appName: data.appName ? String(data.appName) : null,
      isActive: Boolean(data.isActive),
      createdAt: new Date(data.createdAt as string),
      updatedAt: new Date(data.updatedAt as string),
    };
  }

  private mapToUserPreferences(data: unknown): UserPreferences {
    if (!isObject(data)) {
      throw new Error('Invalid preferences data');
    }

    const theme = String(data.theme || 'light');
    const validTheme = isValidTheme(theme) ? theme as Theme : 'light';

    return {
      language: String(data.language || 'en'),
      theme: validTheme,
      enableNotifications: Boolean(data.enableNotifications),
      enableSounds: Boolean(data.enableSounds),
      autoStartMonitoring: Boolean(data.autoStartMonitoring),
      privacyMode: Boolean(data.privacyMode),
      notifications: Boolean(data.enableNotifications),
      autoStart: Boolean(data.autoStartMonitoring),
      trackingEnabled: Boolean(!data.privacyMode),
    };
  }

  private calculateStats(sessions: unknown[]): TypingStats {
    if (sessions.length === 0) {
      return {
        totalKeystrokes: 0,
        wpm: 0,
        accuracy: 0,
        sessionDuration: 0,
        charactersTyped: 0,
        wordsTyped: 0,
        errorsCount: 0,
      };
    }

    let totalKeystrokes = 0;
    let totalWpm = 0;
    let totalAccuracy = 0;
    let totalDuration = 0;

    for (const session of sessions) {
      if (isObject(session)) {
        totalKeystrokes += Number(session.keyCount || 0);
        totalWpm += Number(session.wpm || 0);
        totalAccuracy += Number(session.accuracy || 0);

        const startTime = new Date(session.startTime as string);
        const endTime = new Date(session.endTime as string);
        totalDuration += endTime.getTime() - startTime.getTime();
      }
    }

    const avgWpm = totalWpm / sessions.length;
    const avgAccuracy = totalAccuracy / sessions.length;
    const charactersTyped = Math.floor(totalKeystrokes * 0.8); // 추정
    const wordsTyped = Math.floor(charactersTyped / 5); // 평균 단어 길이
    const errorsCount = Math.floor(totalKeystrokes * (1 - avgAccuracy / 100));

    return {
      totalKeystrokes,
      wpm: Math.round(avgWpm * 100) / 100,
      accuracy: Math.round(avgAccuracy * 100) / 100,
      sessionDuration: totalDuration,
      charactersTyped,
      wordsTyped,
      errorsCount,
    };
  }

  // 🔥 종합 분석 데이터 가져오기 (새로 추가)
  public async getAnalyticsData(): Promise<Result<any>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      Logger.debug('DATABASE', 'Getting comprehensive analytics data');

      // 🎯 병렬로 모든 분석 데이터 가져오기
      Logger.debug('DATABASE', 'Starting parallel data fetch...');
      const [
        projectsResult,
        charactersResult,
        sessionsResult,
        recentSessionsResult
      ] = await Promise.all([
        this.getProjectsData(),
        this.getCharactersData(),
        this.getTypingSessions(100, 0),
        this.getRecentSessions(7)
      ]);

      // 🔥 각 결과를 상세히 로깅
      Logger.debug('DATABASE', 'Results received', {
        projects: { success: projectsResult.success, dataLength: projectsResult.success ? projectsResult.data.length : 0 },
        characters: { success: charactersResult.success, dataLength: charactersResult.success ? charactersResult.data.length : 0 },
        sessions: { success: sessionsResult.success, dataLength: sessionsResult.success ? sessionsResult.data.length : 0 },
        recentSessions: { success: recentSessionsResult.success, dataLength: recentSessionsResult.success ? recentSessionsResult.data.length : 0 }
      });

      // 각 실패 원인을 개별적으로 로깅
      if (!projectsResult.success) {
        Logger.error('DATABASE', 'Projects data failed', projectsResult.error || 'No error message');
      }
      if (!charactersResult.success) {
        Logger.error('DATABASE', 'Characters data failed', charactersResult.error || 'No error message');
      }
      if (!sessionsResult.success) {
        Logger.error('DATABASE', 'Sessions data failed', sessionsResult.error || 'No error message');
      }
      if (!recentSessionsResult.success) {
        Logger.error('DATABASE', 'Recent sessions data failed', recentSessionsResult.error || 'No error message');
      }

      // 모든 결과가 성공인지 확인
      if (!projectsResult.success || !charactersResult.success ||
        !sessionsResult.success || !recentSessionsResult.success) {
        throw new Error('Failed to fetch some analytics data - check individual errors above');
      }

      const projects = projectsResult.data as Project[];
      const characters = charactersResult.data as ProjectCharacter[];
      const sessions = sessionsResult.data as TypingSession[];
      const recentSessions = recentSessionsResult.data as TypingSession[];

      // 🎯 통계 계산
      const stats = {
        // 프로젝트 통계
        totalProjects: projects.length,
        activeProjects: projects.filter((p: Project) => p.status === 'active').length,
        completedProjects: projects.filter((p: Project) => p.status === 'completed').length,
        totalWords: projects.reduce((sum: number, p: Project) => sum + (p.wordCount || 0), 0),

        // 캐릭터 통계
        totalCharacters: characters.length,
        charactersByRole: characters.reduce((acc: Record<string, number>, char: ProjectCharacter) => {
          acc[char.role] = (acc[char.role] || 0) + 1;
          return acc;
        }, {}),

        // 타이핑 통계
        totalSessions: sessions.length,
        avgWpm: sessions.length > 0
          ? sessions.reduce((sum: number, s: TypingSession) => sum + (s.wpm || 0), 0) / sessions.length
          : 0,
        avgAccuracy: sessions.length > 0
          ? sessions.reduce((sum: number, s: TypingSession) => sum + (s.accuracy || 0), 0) / sessions.length
          : 0,

        // 주간 통계
        weeklyWords: recentSessions.reduce((sum: number, s: TypingSession) => sum + (s.keyCount || 0), 0),
        weeklyAvgWpm: recentSessions.length > 0
          ? recentSessions.reduce((sum: number, s: TypingSession) => sum + (s.wpm || 0), 0) / recentSessions.length
          : 0,

        // 오늘 통계
        todayWords: recentSessions.filter((s: TypingSession) => {
          const today = new Date();
          const sessionDate = new Date(s.startTime);
          return sessionDate.toDateString() === today.toDateString();
        }).reduce((sum: number, s: TypingSession) => sum + (s.keyCount || 0), 0),

        // 상세 데이터
        topProjects: projects
          .sort((a: Project, b: Project) => (b.wordCount || 0) - (a.wordCount || 0))
          .slice(0, 5),
        characterDetails: characters.slice(0, 10),
        recentActivity: recentSessions.slice(0, 10)
      };

      // 🎯 인사이트 생성
      const insights = [];

      const topProject = stats.topProjects[0];
      if (topProject) {
        insights.push({
          id: 'top-project',
          type: 'achievement',
          title: `'${topProject.title}'이 가장 활발한 프로젝트입니다`,
          description: `${(topProject.wordCount || 0).toLocaleString()}단어 작성`,
          action: '프로젝트 상세보기',
          priority: 'high',
          actionable: true
        });
      }

      if (stats.avgWpm > 0) {
        const wpmLevel = stats.avgWpm > 80 ? '높음' : stats.avgWpm > 60 ? '보통' : '개선 필요';
        insights.push({
          id: 'wpm-analysis',
          type: 'performance',
          title: `평균 타이핑 속도가 ${wpmLevel} 수준입니다`,
          description: `분당 ${Math.round(stats.avgWpm)}단어, 정확도 ${Math.round(stats.avgAccuracy)}%`,
          action: '타이핑 연습하기',
          priority: stats.avgWpm > 70 ? 'medium' : 'high',
          actionable: true
        });
      }

      const result = {
        ...stats,
        insights,
        generatedAt: new Date().toISOString(),
        hasData: projects.length > 0 || sessions.length > 0
      };

      Logger.info('DATABASE', 'Analytics data generated successfully', {
        projects: stats.totalProjects,
        characters: stats.totalCharacters,
        sessions: stats.totalSessions
      });

      return createSuccess(result);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to get analytics data', error);
      return createError(error instanceof Error ? error.message : 'Failed to get analytics data');
    }
  }

  // 🔥 프로젝트 데이터 가져오기 (새로 추가)
  public async getProjectsData(): Promise<Result<any[]>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      Logger.debug('DATABASE', 'Getting projects data');

      // 🎯 실제 Prisma 쿼리 사용
      const projects = await this.prisma!.project.findMany({
        select: {
          id: true,
          title: true,
          description: true,
          genre: true,
          status: true,
          progress: true,
          wordCount: true,
          author: true,
          createdAt: true,
          lastModified: true
        },
        orderBy: {
          lastModified: 'desc'
        }
      });

      return createSuccess(projects);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to get projects data', error);
      return createError(error instanceof Error ? error.message : 'Failed to get projects');
    }
  }

  // 🔥 캐릭터 데이터 가져오기 (새로 추가)
  public async getCharactersData(): Promise<Result<any[]>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      Logger.debug('DATABASE', 'Getting characters data');

      // 🎯 실제 Prisma 쿼리 사용
      const characters = await this.prisma!.projectCharacter.findMany({
        select: {
          id: true,
          name: true,
          role: true,
          description: true,
          personality: true,
          background: true,
          avatar: true,
          color: true,
          createdAt: true,
          project: {
            select: {
              title: true,
              genre: true
            }
          }
        },
        where: {
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return createSuccess(characters);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to get characters data', error);
      return createError(error instanceof Error ? error.message : 'Failed to get characters');
    }
  }

  // 🔥 최근 세션 데이터 가져오기 (새로 추가)
  public async getRecentSessions(days = 7): Promise<Result<any[]>> {
    try {
      if (!this.ensureConnection()) {
        throw new Error('Database not connected');
      }

      Logger.debug('DATABASE', 'Getting recent sessions', { days });

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      const sessions = await this.prisma!.typingSession.findMany({
        where: {
          startTime: {
            gte: cutoffDate,
          },
        },
        orderBy: {
          startTime: 'desc'
        }
      });

      return createSuccess(sessions);

    } catch (error) {
      Logger.error('DATABASE', 'Failed to get recent sessions', error);
      return createError(error instanceof Error ? error.message : 'Failed to get recent sessions');
    }
  }
}

// 🔥 기가차드 전역 데이터베이스 서비스
export const databaseService = DatabaseService.getInstance();

// #DEBUG: Database service exit point
Logger.debug('DATABASE', 'Database service module setup complete');

export default databaseService;
