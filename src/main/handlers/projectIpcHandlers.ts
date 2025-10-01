'use strict';

// 🔥 기가차드 프로젝트 IPC 핸들러 - 성능 최적화된 Prisma 연동
import { ipcMain, IpcMainInvokeEvent, shell } from 'electron';
import { Logger } from '../../shared/logger';
import { IpcResponse, Project, ProjectCharacter, ProjectStructure, ProjectNote } from '../../shared/types';
import type { IdeaItem } from '../types/project';
import { prismaService } from '../services/PrismaService';
import { IdeaService } from '../services/ideaService';
import { SynopsisService } from '../services/synopsisService';

/**
 * 🔥 프로젝트 IPC 핸들러 설정 - 성능 최적화
 */
export function setupProjectIpcHandlers(): void {
  Logger.debug('PROJECT_IPC', 'Setting up optimized project IPC handlers');

  // 모든 프로젝트 조회 - 🔥 성능 최적화
  ipcMain.handle('projects:get-all', async (): Promise<IpcResponse<Project[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting all projects from database');

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

      Logger.info('PROJECT_IPC', `✅ 조회된 프로젝트 수: ${convertedProjects.length}`);

      return {
        success: true,
        data: convertedProjects,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get projects from database', error);

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
      Logger.debug('PROJECT_IPC', 'Getting project by ID', { id });

      const prisma = await prismaService.getClient();

      // 🔥 디버깅: 요청된 ID 상세 로그
      Logger.info('PROJECT_IPC', `🔍 실제 요청된 프로젝트 ID: "${id}" (길이: ${id.length})`);

      const project = await prisma.project.findUnique({
        where: { id }
      });

      // 🔥 디버깅: 조회 결과 로그
      Logger.info('PROJECT_IPC', `🔍 DB 조회 결과: ${project ? '찾음' : '없음'}`, {
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

          Logger.info('PROJECT_IPC', 'new 프로젝트 템플릿 반환');
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
      Logger.error('PROJECT_IPC', 'Failed to get project by ID', error);
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
      Logger.info('PROJECT_IPC', '🔥 Creating new project in DB', {
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

        Logger.info('PROJECT_IPC', '✅ Project created successfully in DB', {
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
      Logger.error('PROJECT_IPC', '❌ Failed to create project in DB', error);
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
      Logger.debug('PROJECT_IPC', '🚀 즉시 프로젝트 업데이트 시작', { id, contentLength: updates.content?.length });

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
      Logger.debug('PROJECT_IPC', 'Backend about to save updateData', {
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

      Logger.info('PROJECT_IPC', '✅ 프로젝트 업데이트 완료', {
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
      Logger.error('PROJECT_IPC', '❌ 프로젝트 업데이트 실패', error);
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
      Logger.debug('PROJECT_IPC', 'Deleting project from DB', { id });

      const prisma = await prismaService.getClient();

      try {
        await prisma.project.delete({
          where: { id }
        });

        Logger.info('PROJECT_IPC', '✅ Project deleted successfully', { id });

        return {
          success: true,
          data: true,
          timestamp: new Date(),
        };
      } finally {
        await prisma.$disconnect();
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to delete project', error);
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
      Logger.debug('PROJECT_IPC', 'Creating sample project');

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

        Logger.info('PROJECT_IPC', `샘플 프로젝트 생성됨: ${sampleProject.title}`, {
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
      Logger.error('PROJECT_IPC', 'Failed to create sample project', error);
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
      Logger.debug('PROJECT_IPC', 'Starting file import process');

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

        Logger.info('PROJECT_IPC', `파일 가져오기 완료: ${fileName}`, {
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
      Logger.error('PROJECT_IPC', 'Failed to import project file', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '파일 가져오기 중 오류가 발생했습니다.',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 External shell handler 추가
  ipcMain.handle('shell:open-external', async (_event: IpcMainInvokeEvent, url: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Opening external URL', { url });
      await shell.openExternal(url);

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to open external URL', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to open URL',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 캐릭터 관련 핸들러

  // 프로젝트 캐릭터 조회
  ipcMain.handle('projects:get-characters', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<ProjectCharacter[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting project characters', { projectId });

      const prisma = await prismaService.getClient();
      const characters = await prisma.projectCharacter.findMany({
        where: { projectId },
        orderBy: { sortOrder: 'asc' }
      });

      // Prisma 결과를 ProjectCharacter 타입으로 변환
      const convertedCharacters: ProjectCharacter[] = characters.map((char: {
        id: string;
        name: string;
        description: string | null;
        role: string;
        notes: string | null;
        appearance: string | null;
        personality: string | null;
        background: string | null;
        goals: string | null;
        conflicts: string | null;
        avatar: string | null;
        color: string;
        projectId: string;  
        sortOrder: number;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
      }) => ({
        id: char.id,
        projectId: char.projectId,
        name: char.name,
        role: char.role,
        description: char.description || undefined,
        notes: char.notes || undefined,
        appearance: char.appearance || undefined,
        personality: char.personality || undefined,
        background: char.background || undefined,
        goals: char.goals || undefined,
        conflicts: char.conflicts || undefined,
        avatar: char.avatar || undefined,
        color: char.color || undefined,
        sortOrder: char.sortOrder || 0,
        isActive: char.isActive || true,
        createdAt: char.createdAt,
        updatedAt: char.updatedAt,
      }));

      return {
        success: true,
        data: convertedCharacters,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get characters', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 캐릭터 생성/업데이트
  ipcMain.handle('projects:upsert-character', async (_event: IpcMainInvokeEvent, character: Partial<ProjectCharacter>): Promise<IpcResponse<ProjectCharacter>> => {
    try {
      const prisma = await prismaService.getClient();

      const upsertedCharacter = await prisma.projectCharacter.upsert({
        where: { id: character.id || '' },
        update: {
          name: character.name,
          role: character.role,
          description: character.description,
          notes: character.notes,
          appearance: character.appearance,
          personality: character.personality,
          background: character.background,
          goals: character.goals,
          conflicts: character.conflicts,
          avatar: character.avatar,
          color: character.color,
          sortOrder: character.sortOrder,
          isActive: character.isActive,
          updatedAt: new Date(),
        },
        create: {
          id: character.id || '',
          projectId: character.projectId || '',
          name: character.name || '',
          role: character.role || '',
          description: character.description,
          notes: character.notes,
          appearance: character.appearance,
          personality: character.personality,
          background: character.background,
          goals: character.goals,
          conflicts: character.conflicts,
          avatar: character.avatar,
          color: character.color,
          sortOrder: character.sortOrder || 0,
          isActive: character.isActive ?? true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Prisma 결과를 ProjectCharacter 타입으로 변환
      const convertedCharacter: ProjectCharacter = {
        id: upsertedCharacter.id,
        projectId: upsertedCharacter.projectId,
        name: upsertedCharacter.name,
        role: upsertedCharacter.role,
        description: upsertedCharacter.description || undefined,
        notes: upsertedCharacter.notes || undefined,
        appearance: upsertedCharacter.appearance || undefined,
        personality: upsertedCharacter.personality || undefined,
        background: upsertedCharacter.background || undefined,
        goals: upsertedCharacter.goals || undefined,
        conflicts: upsertedCharacter.conflicts || undefined,
        avatar: upsertedCharacter.avatar || undefined,
        color: upsertedCharacter.color || undefined,
        sortOrder: upsertedCharacter.sortOrder || 0,
        isActive: upsertedCharacter.isActive || true,
        createdAt: upsertedCharacter.createdAt,
        updatedAt: upsertedCharacter.updatedAt,
      };

      Logger.info('PROJECT_IPC', '✅ Character upserted successfully', { id: convertedCharacter.id });

      return {
        success: true,
        data: convertedCharacter,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to upsert character', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 캐릭터 삭제
  ipcMain.handle('projects:delete-character', async (_event: IpcMainInvokeEvent, characterId: string): Promise<IpcResponse<boolean>> => {
    try {
      const prisma = await prismaService.getClient();

      await prisma.projectCharacter.delete({
        where: { id: characterId }
      });

      Logger.info('PROJECT_IPC', '✅ Character deleted successfully', { characterId });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to delete character', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 구조 관련 핸들러

  // 프로젝트 구조 조회
  ipcMain.handle('projects:get-structure', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<ProjectStructure[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting project structure', { projectId });

      const prisma = await prismaService.getClient();
      const structure = await prisma.projectStructure.findMany({
        where: { projectId },
        orderBy: { sortOrder: 'asc' }
      });

      // Prisma 결과를 ProjectStructure 타입으로 변환
      const convertedStructure: ProjectStructure[] = structure.map((item: {
        id: string;
        projectId: string;
        type: string;
        title: string;
        description: string | null;
        content: string | null;
        status: string;
        wordCount: number;
        sortOrder: number;
        parentId: string | null;
        createdAt: Date;
        updatedAt: Date;
      }) => ({
        id: item.id,
        projectId: item.projectId,
        type: item.type as 'chapter' | 'synopsis' | 'idea' | 'act' | 'section',
        title: item.title,
        description: item.description || undefined,
        content: item.content || undefined,
        status: item.status || undefined,
        wordCount: item.wordCount || 0,
        sortOrder: item.sortOrder || 0,
        parentId: item.parentId || undefined,
        depth: 0, // 기본값으로 설정 (스키마에 없는 필드)
        color: undefined, // 기본값으로 설정 (스키마에 없는 필드)
        isActive: true, // 기본값으로 설정 (스키마에 없는 필드)
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      }));

      return {
        success: true,
        data: convertedStructure,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get structure', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 구조 생성/업데이트
  ipcMain.handle('projects:upsert-structure', async (_event: IpcMainInvokeEvent, structure: Partial<ProjectStructure>): Promise<IpcResponse<ProjectStructure>> => {
    try {
      const prisma = await prismaService.getClient();

      const upsertedStructure = await prisma.projectStructure.upsert({
        where: { id: structure.id || '' },
        update: {
          title: structure.title,
          type: structure.type,
          description: structure.description,
          content: structure.content,
          status: structure.status,
          wordCount: structure.wordCount,
          sortOrder: structure.sortOrder,
          parentId: structure.parentId,
          depth: structure.depth,
          color: structure.color,
          isActive: structure.isActive,
          updatedAt: new Date(),
        },
        create: {
          id: structure.id || '',
          projectId: structure.projectId || '',
          title: structure.title || '',
          type: structure.type || 'scene',
          description: structure.description,
          content: structure.content,
          status: structure.status,
          wordCount: structure.wordCount || 0,
          sortOrder: structure.sortOrder || 0,
          parentId: structure.parentId,
          depth: structure.depth || 0,
          color: structure.color,
          isActive: structure.isActive !== undefined ? structure.isActive : true,
          createdAt: structure.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });

      // ProjectStructure 타입으로 변환
      const convertedStructure: ProjectStructure = {
        id: upsertedStructure.id,
        projectId: upsertedStructure.projectId,
        type: upsertedStructure.type as 'chapter' | 'synopsis' | 'idea' | 'act' | 'section',
        title: upsertedStructure.title,
        description: upsertedStructure.description || undefined,
        content: upsertedStructure.content || undefined,
        status: upsertedStructure.status || undefined,
        wordCount: upsertedStructure.wordCount || 0,
        sortOrder: upsertedStructure.sortOrder || 0,
        parentId: upsertedStructure.parentId || undefined,
        depth: upsertedStructure.depth || 0,
        color: upsertedStructure.color || undefined,
        isActive: upsertedStructure.isActive || true,
        createdAt: upsertedStructure.createdAt,
        updatedAt: upsertedStructure.updatedAt,
      };

      Logger.info('PROJECT_IPC', '✅ Structure upserted successfully', { id: convertedStructure.id });

      return {
        success: true,
        data: convertedStructure,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to upsert structure', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 구조 아이템 삭제 핸들러
  ipcMain.handle('projects:delete-structure', async (_event: IpcMainInvokeEvent, structureId: string): Promise<IpcResponse<boolean>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Deleting structure item', { structureId });

      const prisma = await prismaService.getClient();

      await prisma.projectStructure.delete({
        where: { id: structureId }
      });

      Logger.info('PROJECT_IPC', '✅ Structure item deleted successfully', { structureId });

      return {
        success: true,
        data: true,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to delete structure item', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 메모 관련 핸들러

  // 프로젝트 메모 조회
  ipcMain.handle('projects:get-notes', async (_event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<any[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting project notes', { projectId });

      const prisma = await prismaService.getClient();
      const notes = await prisma.projectNote.findMany({
        where: { projectId },
        orderBy: { createdAt: 'desc' }
      });

      return {
        success: true,
        data: notes,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get notes', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 메모 생성/업데이트
  ipcMain.handle('projects:upsert-note', async (_event: IpcMainInvokeEvent, note: Partial<ProjectNote>): Promise<IpcResponse<ProjectNote>> => {
    try {
      const prisma = await prismaService.getClient();

      const upsertedNote = await prisma.projectNote.upsert({
        where: { id: note.id || '' },
        update: {
          title: note.title,
          content: note.content,
          type: note.type,
          tags: note.tags || [],
          color: note.color,
          isPinned: note.isPinned,
          isArchived: note.isArchived,
          sortOrder: note.sortOrder,
          updatedAt: new Date(),
        },
        create: {
          id: note.id || '',
          projectId: note.projectId || '',
          title: note.title || '',
          content: note.content || '',
          type: note.type,
          tags: note.tags || [],
          color: note.color,
          isPinned: note.isPinned || false,
          isArchived: note.isArchived || false,
          sortOrder: note.sortOrder || 0,
          createdAt: note.createdAt || new Date(),
          updatedAt: new Date(),
        },
      });

      // ProjectNote 타입으로 변환
      const convertedNote: ProjectNote = {
        id: upsertedNote.id,
        projectId: upsertedNote.projectId,
        title: upsertedNote.title,
        content: upsertedNote.content,
        type: upsertedNote.type || undefined,
        tags: Array.isArray(upsertedNote.tags) ? upsertedNote.tags as string[] : undefined,
        color: upsertedNote.color || undefined,
        isPinned: upsertedNote.isPinned || false,
        isArchived: upsertedNote.isArchived || false,
        sortOrder: upsertedNote.sortOrder || 0,
        createdAt: upsertedNote.createdAt,
        updatedAt: upsertedNote.updatedAt,
      };

      Logger.info('PROJECT_IPC', '✅ Note upserted successfully', { id: convertedNote.id });

      return {
        success: true,
        data: convertedNote,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to upsert note', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 캐릭터 일괄 업데이트 핸들러 추가
  ipcMain.handle('projects:update-characters', async (_event: IpcMainInvokeEvent, projectId: string, characters: ProjectCharacter[]): Promise<IpcResponse<ProjectCharacter[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Updating project characters', { projectId, count: characters.length });

      const prisma = await prismaService.getClient();

      // 🔥 기존 캐릭터들 삭제 후 새로 생성 (간단한 방법)
      await prisma.projectCharacter.deleteMany({
        where: { projectId }
      });

      // 🔥 새 캐릭터들 생성
      const createdCharacters = await Promise.all(
        characters.map(character =>
          prisma.projectCharacter.create({
            data: {
              id: character.id,
              projectId: character.projectId,
              name: character.name,
              role: character.role || '',
              notes: character.notes || '',
            }
          })
        )
      );

      const convertedCharacters: ProjectCharacter[] = createdCharacters.map(char => ({
        id: char.id,
        projectId: char.projectId,
        name: char.name,
        role: char.role || '',
        notes: char.notes || undefined,
        createdAt: char.createdAt,
        updatedAt: char.updatedAt,
      }));

      Logger.info('PROJECT_IPC', `✅ Characters updated successfully`, { count: convertedCharacters.length });

      return {
        success: true,
        data: convertedCharacters,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to update characters', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 노트 일괄 업데이트 핸들러 추가
  ipcMain.handle('projects:update-notes', async (_event: IpcMainInvokeEvent, projectId: string, notes: ProjectNote[]): Promise<IpcResponse<ProjectNote[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Updating project notes', { projectId, count: notes.length });

      const prisma = await prismaService.getClient();

      // 🔥 기존 노트들 삭제 후 새로 생성 (간단한 방법)
      await prisma.projectNote.deleteMany({
        where: { projectId }
      });

      // 🔥 새 노트들 생성
      const createdNotes = await Promise.all(
        notes.map(note =>
          prisma.projectNote.create({
            data: {
              id: note.id,
              projectId: note.projectId,
              title: note.title,
              content: note.content || '',
              tags: note.tags || '',
            }
          })
        )
      );

      const convertedNotes: ProjectNote[] = createdNotes.map(note => ({
        id: note.id,
        projectId: note.projectId,
        title: note.title,
        content: note.content || '',
        tags: note.tags ? (typeof note.tags === 'string' ? note.tags.split(',').map((t: string) => t.trim()) : undefined) : undefined,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
      }));

      Logger.info('PROJECT_IPC', `✅ Notes updated successfully`, { count: convertedNotes.length });

      return {
        success: true,
        data: convertedNotes,
        timestamp: new Date(),
      };
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to update notes', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 🔥 아이디어 관리 IPC 핸들러들
  
  // 프로젝트 아이디어 조회
  ipcMain.handle('projects:get-ideas', async (event: IpcMainInvokeEvent, projectId: string): Promise<IpcResponse<any[]>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Getting project ideas', { projectId });
      
      const result = await IdeaService.getIdeasByProject(projectId);
      
      if (result.success) {
        Logger.info('PROJECT_IPC', `✅ Ideas retrieved successfully`, { count: result.data.length });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('PROJECT_IPC', 'Failed to get ideas', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to get ideas', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 생성
  ipcMain.handle('projects:create-idea', async (event: IpcMainInvokeEvent, projectId: string, ideaData: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<IpcResponse<IdeaItem>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Creating new idea', { projectId, title: ideaData.title });
      
      const result = await IdeaService.createIdea(projectId, ideaData);
      
      if (result.success) {
        Logger.info('PROJECT_IPC', `✅ Idea created successfully`, { id: result.data.id });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('PROJECT_IPC', 'Failed to create idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to create idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 업데이트
  ipcMain.handle('projects:update-idea', async (event: IpcMainInvokeEvent, ideaId: string, updates: Partial<Omit<IdeaItem, 'id' | 'createdAt'>>): Promise<IpcResponse<IdeaItem>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Updating idea', { ideaId });
      
      const result = await IdeaService.updateIdea(ideaId, updates);
      
      if (result.success) {
        Logger.info('PROJECT_IPC', `✅ Idea updated successfully`, { id: result.data.id });
        return {
          success: true,
          data: result.data,
          timestamp: new Date(),
        };
      } else {
        Logger.error('PROJECT_IPC', 'Failed to update idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to update idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  // 아이디어 삭제
  ipcMain.handle('projects:delete-idea', async (event: IpcMainInvokeEvent, ideaId: string): Promise<IpcResponse<void>> => {
    try {
      Logger.debug('PROJECT_IPC', 'Deleting idea', { ideaId });
      
      const result = await IdeaService.deleteIdea(ideaId);
      
      if (result.success) {
        Logger.info('PROJECT_IPC', `✅ Idea deleted successfully`, { ideaId });
        return {
          success: true,
          data: undefined,
          timestamp: new Date(),
        };
      } else {
        Logger.error('PROJECT_IPC', 'Failed to delete idea', result.error);
        return {
          success: false,
          error: result.error,
          timestamp: new Date(),
        };
      }
    } catch (error) {
      Logger.error('PROJECT_IPC', 'Failed to delete idea', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date(),
      };
    }
  });

  Logger.info('PROJECT_IPC', '✅ Project IPC handlers setup complete with Prisma DB integration and Ideas support');
}
