// 🔥 시놉시스 서비스 - Prisma 데이터 연동
import type { PlotPoint } from '../../main/types/project';
import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result } from '../../shared/common';
import { prismaService } from './PrismaService';

// 🔥 시놉시스 서비스
export class SynopsisService {
  // 🔥 프로젝트의 모든 플롯 포인트 조회
  static async getPlotPointsByProject(projectId: string): Promise<Result<PlotPoint[]>> {
    try {
      const client = await prismaService.getClient();
      const plotNotes = await client.projectNote.findMany({
        where: { 
          projectId,
          type: 'plot'
        },
        orderBy: [
          { createdAt: 'desc' }
        ]
      });

      // ProjectNote를 PlotPoint로 매핑
      const mappedPlots: PlotPoint[] = plotNotes.map((note) => {
        const tagsData = (note.tags as any) || {};
        return {
          id: note.id,
          act: tagsData.act || 1,
          title: note.title,
          description: note.content || '',
          type: tagsData.type || 'setup',
          characters: Array.isArray(tagsData.characters) ? tagsData.characters : [],
          location: tagsData.location || '',
          notes: tagsData.notes || '',
          order: tagsData.order || 0,
          duration: tagsData.duration || 0,
          importance: tagsData.importance || 'medium',
          createdAt: note.createdAt,
          updatedAt: note.updatedAt
        };
      });

      // act와 order로 정렬
      mappedPlots.sort((a, b) => {
        if (a.act !== b.act) return a.act - b.act;
        return a.order - b.order;
      });

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
      const client = await prismaService.getClient();
      const plotNotes = await client.projectNote.findMany({
        where: {
          projectId,
          type: 'plot'
        },
        orderBy: [
          { createdAt: 'desc' }
        ]
      });

      // ProjectNote를 PlotPoint로 매핑하고 특정 막만 필터링
      const mappedPlots: PlotPoint[] = plotNotes
        .map((note) => {
          const tagsData = (note.tags as any) || {};
          return {
            id: note.id,
            act: tagsData.act || 1,
            title: note.title,
            description: note.content || '',
            type: tagsData.type || 'setup',
            characters: Array.isArray(tagsData.characters) ? tagsData.characters : [],
            location: tagsData.location || '',
            notes: tagsData.notes || '',
            order: tagsData.order || 0,
            duration: tagsData.duration || 0,
            importance: tagsData.importance || 'medium',
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
          };
        })
        .filter((plot) => plot.act === act)
        .sort((a, b) => a.order - b.order);

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
      const client = await prismaService.getClient();
      
      // PlotPoint를 ProjectNote 모델에 맞게 변환
      const plotData = {
        projectId,
        title: plot.title,
        content: plot.description,
        type: 'plot',
        tags: {
          act: plot.act,
          type: plot.type,
          characters: plot.characters,
          location: plot.location,
          notes: plot.notes,
          order: plot.order,
          duration: plot.duration,
          importance: plot.importance
        }
      };

      const newNote = await client.projectNote.create({
        data: plotData
      });

      // ProjectNote를 PlotPoint로 매핑
      const tagsData = (newNote.tags as any) || {};
      const mappedPlot: PlotPoint = {
        id: newNote.id,
        act: tagsData.act || 1,
        title: newNote.title,
        description: newNote.content || '',
        type: tagsData.type || 'setup',
        characters: Array.isArray(tagsData.characters) ? tagsData.characters : [],
        location: tagsData.location || '',
        notes: tagsData.notes || '',
        order: tagsData.order || 0,
        duration: tagsData.duration || 0,
        importance: tagsData.importance || 'medium',
        createdAt: newNote.createdAt,
        updatedAt: newNote.updatedAt
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
      const client = await prismaService.getClient();
      
      // 기존 노트 데이터 가져오기
      const existingNote = await client.projectNote.findUnique({
        where: { id }
      });
      
      if (!existingNote) {
        return createError('플롯 포인트를 찾을 수 없습니다.');
      }

      // 기존 tags 데이터 파싱
      const existingTags = (existingNote.tags as any) || {};
      
      // ProjectNote 모델용 데이터 변환
      const updateData: any = {
        type: 'plot',
        updatedAt: new Date()
      };
      
      if (updates.title) updateData.title = updates.title;
      if (updates.description) updateData.content = updates.description;
      
      // tags 필드에 플롯 관련 메타데이터 저장
      const updatedTags = { ...existingTags };
      if (updates.act) updatedTags.act = updates.act;
      if (updates.type) updatedTags.type = updates.type;
      if (updates.characters) updatedTags.characters = updates.characters;
      if (updates.location) updatedTags.location = updates.location;
      if (updates.notes) updatedTags.notes = updates.notes;
      if (updates.order !== undefined) updatedTags.order = updates.order;
      if (updates.duration !== undefined) updatedTags.duration = updates.duration;
      if (updates.importance) updatedTags.importance = updates.importance;
      
      updateData.tags = updatedTags;

      const updatedNote = await client.projectNote.update({
        where: { id },
        data: updateData
      });

      // ProjectNote를 PlotPoint로 매핑
      const tagsData = (updatedNote.tags as any) || {};
      const mappedPlot: PlotPoint = {
        id: updatedNote.id,
        act: tagsData.act || 1,
        title: updatedNote.title,
        description: updatedNote.content || '',
        type: tagsData.type || 'setup',
        characters: Array.isArray(tagsData.characters) ? tagsData.characters : [],
        location: tagsData.location || '',
        notes: tagsData.notes || '',
        order: tagsData.order || 0,
        duration: tagsData.duration || 0,
        importance: tagsData.importance || 'medium',
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt
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
      const client = await prismaService.getClient();
      await client.projectNote.delete({
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
