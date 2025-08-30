// src/types/prisma.d.ts
import { PrismaClient } from '@prisma/client';

declare module '@prisma/client' {
  interface PrismaClient {
    // Loop 전용 메서드 추가
    $loopTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T>;
    $loopHealthCheck(): Promise<boolean>;
    $loopBackup(path: string): Promise<void>;
    $loopRestore(path: string): Promise<void>;
  }

  // 모델 확장
  interface Session {
    // 가상 필드들
    wpmCalculated?: number;
    accuracyPercentage?: string;
    durationMs?: number;
    isActive?: boolean;
  }

  interface User {
    // 가상 필드들
    totalSessions?: number;
    averageWpm?: number;
    bestAccuracy?: number;
  }

  interface TypingStats {
    // 가상 필드들
    improvementRate?: number;
    consistencyScore?: number;
    skillLevel?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }
}

// Prisma 클라이언트 확장
declare global {
  namespace PrismaJson {
    // JSON 필드 타입 정의
    interface SessionMetadata {
      windowTitle: string;
      appName: string;
      language: string;
      keyboardLayout: string;
      errors?: Array<{
        position: number;
        expected: string;
        actual: string;
      }>;
    }

    interface UserPreferences {
      theme: 'light' | 'dark' | 'auto';
      language: string;
      notifications: boolean;
      soundEnabled: boolean;
      autoSave: boolean;
      privacyMode: boolean;
    }

    interface SystemInfo {
      os: string;
      platform: string;
      arch: string;
      nodeVersion: string;
      electronVersion: string;
      screenResolution: string;
    }
  }
}

export { };
