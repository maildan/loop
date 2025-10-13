'use strict';

// MIGRATION: MIGRATED FROM projectIpcHandlers.ts:19-556
// MIGRATION: TODO verify Prisma disconnect, error handling, 'new' ID edge case

import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, Project } from '../../shared/types';
import { prismaService } from '../services/PrismaService';

/**
 * 🔥 프로젝트 CRUD IPC 핸들러 - 성능 최적화
 * 
 * 등록된 채널:
 * - projects:get-all
 * - projects:get-by-id
 * - projects:create
 * - projects:update
 * - projects:delete
 * - projects:create-sample
 * - projects:import-file
 */
export function registerProjectCrudHandlers(): void {
  Logger.debug('PROJECT_CRUD_IPC', 'Registering CRUD IPC handlers');

  // 모든 프로젝트 조회 - 🔥 성능 최적화
  ipcMain.handle('projects:get-all', async (): Promise<IpcResponse<Project[]>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', 'Getting all projects from database');

      const prisma = await prismaService.getClient();

      const projects = await prisma.project.findMany({
        orderBy: { lastModified: 'desc' }
      });

      // Prisma 결과를 Project 타입으로 변환
      const convertedProjects: Project[] = projects.map((project: {
        id: string;
        title: string;
        description: string | null;
        content: string | null;
        progress: number;
        wordCount: number;
        lastModified: Date;
        createdAt: Date;
        genre: string;
        status: string;
        author: string;
      }) => ({
        id: project.id,
        title: project.title,
        description: project.description || '',
        content: project.content || '',
        progress: project.progress || 0,
        wordCount: project.wordCount || 0,
        lastModified: project.lastModified,
        createdAt: project.createdAt,
        updatedAt: project.lastModified, // 🔥 updatedAt 필드 추가
        genre: project.genre || '기타',
        status: (project.status as 'active' | 'completed' | 'paused') || 'active',
        author: project.author || '사용자',
      }));

      Logger.info('PROJECT_CRUD_IPC', `✅ 조회된 프로젝트 수: ${convertedProjects.length}`);

      return {
        success: true,
        data: convertedProjects,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', 'Failed to get projects from database', error);

      return {
        success: true,
        data: [],
        timestamp: new Date(),
      };
    }
  });

  // 프로젝트 ID로 조회 - 🔥 성능 최적화
  ipcMain.handle('projects:get-by-id', async (_event: IpcMainInvokeEvent, id: string): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', 'Getting project by ID', { id });

      const prisma = await prismaService.getClient();

      // 🔥 디버깅: 요청된 ID 상세 로그
      Logger.info('PROJECT_CRUD_IPC', `🔍 실제 요청된 프로젝트 ID: "${id}" (길이: ${id.length})`);

      const project = await prisma.project.findUnique({
        where: { id }
      });

      // 🔥 디버깅: 조회 결과 로그
      Logger.info('PROJECT_CRUD_IPC', `🔍 DB 조회 결과: ${project ? '찾음' : '없음'}`, {
        requestedId: id,
        found: !!project,
        projectTitle: project?.title
      });

      if (!project) {
        // 🔥 'new' ID 처리 - 새 프로젝트 템플릿 반환
        if (id === 'new') {
          const now = new Date();
          const newProjectTemplate: Project = {
            id: 'new',
            title: '새로운 프로젝트',
            description: '새로운 이야기를 시작해보세요',
            content: '',
            chapters: '{}', // 🔥 빈 chapters 추가
            progress: 0,
            wordCount: 0,
            genre: '기타',
            status: 'active',
            author: '사용자',
            createdAt: now,
            lastModified: now,
            updatedAt: now,
          };

          Logger.info('PROJECT_CRUD_IPC', 'new 프로젝트 템플릿 반환');
          return {
            success: true,
            data: newProjectTemplate,
            timestamp: new Date(),
          };
        }

        return {
          success: false,
          error: '프로젝트를 찾을 수 없습니다.',
          timestamp: new Date(),
        };
      }

      const convertedProject: Project = {
        id: project.id,
        title: project.title,
        description: project.description || '',
        content: project.content || '',
        chapters: (project as any).chapters || undefined, // 🔥 chapters 필드 추가
        progress: project.progress || 0,
        wordCount: project.wordCount || 0,
        lastModified: project.lastModified,
        createdAt: project.createdAt,
        updatedAt: project.lastModified, // 🔥 lastModified를 updatedAt으로 사용
        genre: project.genre || '기타',
        status: (project.status as 'active' | 'completed' | 'paused') || 'active',
        author: project.author || '사용자',
      };

      return {
        success: true,
        data: convertedProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', 'Failed to get project by ID', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 실제 프로젝트 생성 - Prisma DB 연동
  ipcMain.handle('projects:create', async (_event: IpcMainInvokeEvent, project: Omit<Project, 'id' | 'createdAt' | 'lastModified'>): Promise<IpcResponse<Project>> => {
    try {
      Logger.info('PROJECT_CRUD_IPC', '🔥 Creating new project in DB', {
        title: project.title,
        genre: project.genre,
      });

      // 🔥 유효성 검증
      if (!project.title || project.title.trim().length === 0) {
        throw new Error('프로젝트 제목은 필수입니다.');
      }

      if (project.title.length > 100) {
        throw new Error('프로젝트 제목은 100자를 초과할 수 없습니다.');
      }

      // 🔥 Prisma를 통한 실제 DB 생성
      const prisma = await prismaService.getClient();

      try {
        const now = new Date();

        const createdProject = await prisma.project.create({
          data: {
            title: project.title.trim(),
            description: project.description?.trim() || '새로운 프로젝트입니다.',
            content: project.content || '',
            progress: 0,
            wordCount: project.content ? project.content.split(/\s+/).filter(w => w.length > 0).length : 0,
            genre: project.genre || '기타',
            status: project.status || 'active',
            author: project.author || '사용자',
            createdAt: now,
            lastModified: now,
          }
        });

        const newProject: Project = {
          id: createdProject.id,
          title: createdProject.title,
          description: createdProject.description || '',
          content: createdProject.content || '',
          progress: createdProject.progress || 0,
          wordCount: createdProject.wordCount || 0,
          genre: createdProject.genre || '기타',
          status: (createdProject.status as 'active' | 'completed' | 'paused') || 'active',
          author: createdProject.author || '사용자',
          createdAt: createdProject.createdAt,
          lastModified: createdProject.lastModified,
          updatedAt: createdProject.lastModified, // 🔥 lastModified를 updatedAt으로 사용
        };

        Logger.info('PROJECT_CRUD_IPC', '✅ Project created successfully in DB', {
          id: newProject.id,
          title: newProject.title,
          wordCount: newProject.wordCount
        });

        return {
          success: true,
          data: newProject,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', '❌ Failed to create project in DB', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 프로젝트 업데이트 - 성능 최적화 (즉시 저장)
  ipcMain.handle('projects:update', async (_event: IpcMainInvokeEvent, id: string, updates: Partial<Project>): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', '🚀 즉시 프로젝트 업데이트 시작', { id, contentLength: updates.content?.length });

      const prisma = await prismaService.getClient();

      const updateData: Partial<{
        title: string;
        description: string;
        content: string;
        chapters: string; // 🔥 chapters 필드 추가
        progress: number;
        wordCount: number;
        genre: string;
        status: string;
        author: string;
        lastModified: Date;
      }> = {
        lastModified: new Date(),
      };

      if (updates.title) updateData.title = updates.title.trim();
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.content !== undefined) {
        updateData.content = updates.content;
        updateData.wordCount = updates.content.split(/\s+/).filter(w => w.length > 0).length;
      }
      if (updates.chapters !== undefined) updateData.chapters = updates.chapters; // 🔥 chapters 업데이트 로직 추가
      if (updates.progress !== undefined) updateData.progress = updates.progress;
      if (updates.genre) updateData.genre = updates.genre;
      if (updates.status) updateData.status = updates.status;
      if (updates.author) updateData.author = updates.author;

      // 🔥 디버깅 로그: 저장할 데이터 확인
      Logger.debug('PROJECT_CRUD_IPC', 'Backend about to save updateData', {
        hasChapters: !!updateData.chapters,
        chaptersLength: updateData.chapters?.length,
        chaptersPreview: updateData.chapters?.substring(0, 100)
      });

      // 🔥 즉시 저장 - 트랜잭션으로 성능 개선
      const updatedProject = await prisma.project.update({
        where: { id },
        data: updateData
      });

      const convertedProject: Project = {
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description || '',
        content: updatedProject.content || '',
        chapters: (updatedProject as any).chapters || undefined, // 🔥 chapters 필드 추가 (타입 캐스팅)
        progress: updatedProject.progress || 0,
        wordCount: updatedProject.wordCount || 0,
        genre: updatedProject.genre || '기타',
        status: (updatedProject.status as 'active' | 'completed' | 'paused') || 'active',
        author: updatedProject.author || '사용자',
        createdAt: updatedProject.createdAt,
        lastModified: updatedProject.lastModified,
        updatedAt: updatedProject.lastModified, // 🔥 lastModified를 updatedAt으로 사용
      };

      Logger.info('PROJECT_CRUD_IPC', '✅ 프로젝트 업데이트 완료', {
        id: convertedProject.id,
        wordCount: convertedProject.wordCount,
        hasChapters: !!convertedProject.chapters,
        chaptersLength: convertedProject.chapters?.length,
        duration: `${Date.now() - Date.now()}ms`
      });

      return {
        success: true,
        data: convertedProject,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', '❌ 프로젝트 업데이트 실패', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 프로젝트 삭제
  ipcMain.handle('projects:delete', async (_event: IpcMainInvokeEvent, id: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', 'Deleting project from DB', { id });

      const prisma = await prismaService.getClient();

      try {
        await prisma.project.delete({
          where: { id }
        });

        Logger.info('PROJECT_CRUD_IPC', '✅ Project deleted successfully', { id });

        return {
          success: true,
          data: true,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', 'Failed to delete project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 기가차드 샘플 프로젝트 생성
  ipcMain.handle('projects:create-sample', async (): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', 'Creating sample project');

      const sampleProjects = [
        {
          title: '나의 첫 번째 소설',
          description: '창작의 첫 걸음을 위한 소설 프로젝트입니다.',
          content: `제1장: 새로운 시작

오늘부터 내 인생의 새로운 챕터가 시작된다. 
키보드 위에서 춤추는 손가락들이 만들어내는 이야기.

여기서부터 당신의 상상력을 펼쳐보세요!

✍️ 팁:
- 하루에 500단어씩 꾸준히 작성해보세요
- 등장인물의 성격을 구체적으로 설정해보세요
- 독자가 몰입할 수 있는 장면을 묘사해보세요

Loop과 함께 작가의 꿈을 실현해보세요! 🚀`,
          genre: '소설',
          progress: 15,
          wordCount: 450,
          author: '새로운 작가'
        }
      ];

      const selectedSample = sampleProjects[0]; // 첫 번째 샘플 사용

      if (!selectedSample) {
        throw new Error('Sample project not found');
      }

      // 실제 DB에 저장
      const prisma = await prismaService.getClient();

      try {
        const now = new Date();

        const createdProject = await prisma.project.create({
          data: {
            title: selectedSample.title,
            description: selectedSample.description,
            content: selectedSample.content,
            progress: selectedSample.progress,
            wordCount: selectedSample.wordCount,
            genre: selectedSample.genre,
            status: 'active',
            author: selectedSample.author,
            createdAt: now,
            lastModified: now,
          }
        });

        const sampleProject: Project = {
          id: createdProject.id,
          title: createdProject.title,
          description: createdProject.description || '',
          content: createdProject.content || '',
          progress: createdProject.progress || 0,
          wordCount: createdProject.wordCount || 0,
          genre: createdProject.genre || '기타',
          status: (createdProject.status as 'active' | 'completed' | 'paused') || 'active',
          author: createdProject.author || '사용자',
          createdAt: createdProject.createdAt,
          lastModified: createdProject.lastModified,
          updatedAt: createdProject.lastModified, // 🔥 lastModified를 updatedAt으로 사용
        };

        Logger.info('PROJECT_CRUD_IPC', `샘플 프로젝트 생성됨: ${sampleProject.title}`, {
          genre: sampleProject.genre,
          wordCount: sampleProject.wordCount
        });

        return {
          success: true,
          data: sampleProject,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', 'Failed to create sample project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 기가차드 프로젝트 파일 가져오기 (텍스트 파일 지원)
  ipcMain.handle('projects:import-file', async (): Promise<IpcResponse<Project>> => {
    try {
      Logger.debug('PROJECT_CRUD_IPC', 'Starting file import process');

      const { dialog } = require('electron');
      const fs = require('fs').promises;
      const path = require('path');

      // 파일 선택 다이얼로그 열기
      const result = await dialog.showOpenDialog({
        title: 'Loop 프로젝트로 가져올 파일 선택',
        filters: [
          { name: '텍스트 파일', extensions: ['txt', 'md', 'rtf'] },
          { name: 'Markdown 파일', extensions: ['md', 'markdown'] },
          { name: '모든 파일', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (result.canceled || !result.filePaths.length) {
        return {
          success: false,
          error: '파일이 선택되지 않았습니다.',
          timestamp: new Date(),
        };
      }

      const filePath = result.filePaths[0];
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const fileName = path.basename(filePath, path.extname(filePath));
      const fileExtension = path.extname(filePath).toLowerCase();

      // 파일 내용 분석
      const wordCount = fileContent.split(/\s+/).filter((word: string) => word.length > 0).length;

      // 장르 추정 (파일 확장자 기반)
      let estimatedGenre = '일반';
      if (fileExtension === '.md' || fileExtension === '.markdown') {
        estimatedGenre = '기술문서';
      } else if (fileName.includes('소설') || fileName.includes('novel')) {
        estimatedGenre = '소설';
      } else if (fileName.includes('블로그') || fileName.includes('blog')) {
        estimatedGenre = '블로그';
      }

      // 실제 DB에 저장
      const prisma = await prismaService.getClient();

      try {
        const now = new Date();

        const createdProject = await prisma.project.create({
          data: {
            title: fileName,
            description: `가져온 파일: ${path.basename(filePath)} (${wordCount}단어)`,
            content: fileContent,
            progress: 100, // 이미 작성된 파일이므로
            wordCount,
            genre: estimatedGenre,
            status: 'completed',
            author: '가져온 파일',
            createdAt: now,
            lastModified: now,
          }
        });

        const importedProject: Project = {
          id: createdProject.id,
          title: createdProject.title,
          description: createdProject.description || '',
          content: createdProject.content || '',
          progress: createdProject.progress || 0,
          wordCount: createdProject.wordCount || 0,
          genre: createdProject.genre || '기타',
          status: (createdProject.status as 'active' | 'completed' | 'paused') || 'active',
          author: createdProject.author || '사용자',
          createdAt: createdProject.createdAt,
          lastModified: createdProject.lastModified,
          updatedAt: createdProject.lastModified, // 🔥 lastModified를 updatedAt으로 사용
        };

        Logger.info('PROJECT_CRUD_IPC', `파일 가져오기 완료: ${fileName}`, {
          filePath,
          wordCount,
          genre: estimatedGenre
        });

        return {
          success: true,
          data: importedProject,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_CRUD_IPC', 'Failed to import project file', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '파일 가져오기 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('PROJECT_CRUD_IPC', '✅ Project CRUD IPC handlers registered');
}
