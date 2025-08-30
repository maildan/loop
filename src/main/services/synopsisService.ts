// 🔥 시놉시스 서비스 - Prisma 데이터 연동
import type { PlotPoint } from '../../main/types/project';
import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result } from '../../shared/common';

// 🔥 기가차드 Prisma 클라이언트 타입 (동적 로딩)
interface PrismaClient {
  $connect(): Promise<void>;
  $disconnect(): Promise<void>;
  projectPlotPoint: {
    create(data: { data: unknown }): Promise<unknown>;
    findMany(args?: unknown): Promise<unknown[]>;
    findUnique(args: { where: { id: string } }): Promise<unknown | null>;
    update(args: { where: { id: string }; data: unknown }): Promise<unknown>;
    delete(args: { where: { id: string } }): Promise<unknown>;
  };
}

let prismaClient: PrismaClient | null = null;

// 🔥 Prisma 클라이언트 초기화
async function getPrismaClient(): Promise<PrismaClient> {
  if (!prismaClient) {
    try {
      const { PrismaClient } = await import('@prisma/client');
      prismaClient = new PrismaClient() as unknown as PrismaClient;
      await prismaClient.$connect();
      Logger.info('SYNOPSIS_SERVICE', 'Prisma 클라이언트 연결 완료');
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', 'Prisma 클라이언트 연결 실패', error);
      throw error;
    }
  }
  return prismaClient;
}

// 🔥 시놉시스 서비스
export class SynopsisService {
  // 🔥 프로젝트의 모든 플롯 포인트 조회
  static async getPlotPointsByProject(projectId: string): Promise<Result<PlotPoint[]>> {
    try {
      const client = await getPrismaClient();
      const plotPoints = await client.projectPlotPoint.findMany({
        where: { projectId },
        orderBy: [
          { act: 'asc' },
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      const mappedPlots: PlotPoint[] = plotPoints.map((plot: any) => ({
        id: plot.id,
        act: plot.act as 1 | 2 | 3,
        title: plot.title,
        description: plot.description,
        type: plot.type as PlotPoint['type'],
        characters: Array.isArray(plot.characters) ? plot.characters as string[] : [],
        location: plot.location,
        notes: plot.notes,
        order: plot.order,
        duration: plot.duration,
        importance: plot.importance as PlotPoint['importance'],
        createdAt: plot.createdAt,
        updatedAt: plot.updatedAt
      }));

      Logger.info('SYNOPSIS_SERVICE', `프로젝트 플롯 포인트 조회 완료: ${mappedPlots.length}개`, { projectId });
      return createSuccess(mappedPlots);
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', '플롯 포인트 조회 실패', error);
      return createError('시놉시스를 불러오는데 실패했습니다.');
    }
  }

  // 🔥 특정 막의 플롯 포인트 조회
  static async getPlotPointsByAct(projectId: string, act: 1 | 2 | 3): Promise<Result<PlotPoint[]>> {
    try {
      const client = await getPrismaClient();
      const plotPoints = await client.projectPlotPoint.findMany({
        where: {
          projectId,
          act
        },
        orderBy: [
          { order: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      const mappedPlots: PlotPoint[] = (plotPoints as Array<{
        id: string;
        act: unknown;
        title: string;
        description: string;
        type: string;
        characters: unknown;
        location: string;
        notes: string;
        order: number;
        duration: number;
        importance: string;
        createdAt: Date;
        updatedAt: Date;
      }>).map((plot) => ({
        id: plot.id,
        act: plot.act as 1 | 2 | 3,
        title: plot.title,
        description: plot.description,
        type: plot.type as PlotPoint['type'],
        characters: Array.isArray(plot.characters) ? plot.characters as string[] : [],
        location: plot.location,
        notes: plot.notes,
        order: plot.order,
        duration: plot.duration,
        importance: plot.importance as PlotPoint['importance'],
        createdAt: plot.createdAt,
        updatedAt: plot.updatedAt
      }));

      Logger.info('SYNOPSIS_SERVICE', `${act}막 플롯 포인트 조회 완료: ${mappedPlots.length}개`, { projectId, act });
      return createSuccess(mappedPlots);
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', '막별 플롯 포인트 조회 실패', error);
      return createError('시놉시스를 불러오는데 실패했습니다.');
    }
  }

  // 🔥 새 플롯 포인트 생성
  static async createPlotPoint(projectId: string, plot: Omit<PlotPoint, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<PlotPoint>> {
    try {
      const client = await getPrismaClient();
      const newPlot = await client.projectPlotPoint.create({
        data: {
          projectId,
          act: plot.act,
          title: plot.title,
          description: plot.description,
          type: plot.type,
          characters: plot.characters,
          location: plot.location,
          notes: plot.notes,
          order: plot.order,
          duration: plot.duration,
          importance: plot.importance
        }
      });

      const mappedPlot: PlotPoint = {
        id: (newPlot as any).id,
        act: (newPlot as any).act as 1 | 2 | 3,
        title: (newPlot as any).title,
        description: (newPlot as any).description,
        type: (newPlot as any).type as PlotPoint['type'],
        characters: Array.isArray((newPlot as any).characters) ? (newPlot as any).characters as string[] : [],
        location: (newPlot as any).location,
        notes: (newPlot as any).notes,
        order: (newPlot as any).order,
        duration: (newPlot as any).duration,
        importance: (newPlot as any).importance as PlotPoint['importance'],
        createdAt: (newPlot as any).createdAt,
        updatedAt: (newPlot as any).updatedAt
      };

      Logger.info('SYNOPSIS_SERVICE', '플롯 포인트 생성 완료', { id: mappedPlot.id, title: mappedPlot.title });
      return createSuccess(mappedPlot);
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', '플롯 포인트 생성 실패', error);
      return createError('플롯 포인트를 생성하는데 실패했습니다.');
    }
  }

  // 🔥 플롯 포인트 업데이트
  static async updatePlotPoint(id: string, updates: Partial<Omit<PlotPoint, 'id' | 'createdAt'>>): Promise<Result<PlotPoint>> {
    try {
      const client = await getPrismaClient();
      const updatedPlot = await client.projectPlotPoint.update({
        where: { id },
        data: {
          ...updates,
          updatedAt: new Date()
        }
      });

      const mappedPlot: PlotPoint = {
        id: (updatedPlot as any).id,
        act: (updatedPlot as any).act as 1 | 2 | 3,
        title: (updatedPlot as any).title,
        description: (updatedPlot as any).description,
        type: (updatedPlot as any).type as PlotPoint['type'],
        characters: Array.isArray((updatedPlot as any).characters) ? (updatedPlot as any).characters as string[] : [],
        location: (updatedPlot as any).location,
        notes: (updatedPlot as any).notes,
        order: (updatedPlot as any).order,
        duration: (updatedPlot as any).duration,
        importance: (updatedPlot as any).importance as PlotPoint['importance'],
        createdAt: (updatedPlot as any).createdAt,
        updatedAt: (updatedPlot as any).updatedAt
      };

      Logger.info('SYNOPSIS_SERVICE', '플롯 포인트 업데이트 완료', { id });
      return createSuccess(mappedPlot);
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', '플롯 포인트 업데이트 실패', error);
      return createError('플롯 포인트를 수정하는데 실패했습니다.');
    }
  }

  // 🔥 플롯 포인트 삭제
  static async deletePlotPoint(id: string): Promise<Result<void>> {
    try {
      const client = await getPrismaClient();
      await client.projectPlotPoint.delete({
        where: { id }
      });

      Logger.info('SYNOPSIS_SERVICE', '플롯 포인트 삭제 완료', { id });
      return createSuccess(undefined);
    } catch (error) {
      Logger.error('SYNOPSIS_SERVICE', '플롯 포인트 삭제 실패', error);
      return createError('플롯 포인트를 삭제하는데 실패했습니다.');
    }
  }
}
