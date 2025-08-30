// 🔥 아이디어 서비스 - Prisma 데이터 연동
import type { IdeaItem } from '../../main/types/project';
import { Logger } from '../../shared/logger';
import { createSuccess, createError, type Result } from '../../shared/common';

// 🔥 기가차드 Prisma 클라이언트 타입 (동적 로딩)
interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    projectIdea: {
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
            Logger.info('IDEA_SERVICE', 'Prisma 클라이언트 연결 완료');
        } catch (error) {
            Logger.error('IDEA_SERVICE', 'Prisma 클라이언트 연결 실패', error);
            throw error;
        }
    }
    return prismaClient;
}

// 🔥 아이디어 서비스
export class IdeaService {
    // 🔥 프로젝트의 모든 아이디어 조회
    static async getIdeasByProject(projectId: string): Promise<Result<IdeaItem[]>> {
        try {
            const client = await getPrismaClient();
            const ideas = await client.projectIdea.findMany({
                where: { projectId },
                orderBy: [
                    { order: 'asc' },
                    { createdAt: 'desc' }
                ]
            });

            const mappedIdeas: IdeaItem[] = (ideas as Array<{
                id: string;
                title: string;
                content: string;
                category: string;
                stage: string;
                tags: unknown;
                priority: string;
                connections: unknown;
                attachments: unknown;
                notes: string;
                createdAt: Date;
                updatedAt: Date;
                isFavorite: boolean;
            }>).map((idea) => ({
                id: idea.id,
                title: idea.title,
                content: idea.content,
                category: idea.category as IdeaItem['category'],
                stage: idea.stage as IdeaItem['stage'],
                tags: Array.isArray(idea.tags) ? idea.tags as string[] : [],
                priority: idea.priority as IdeaItem['priority'],
                connections: Array.isArray(idea.connections) ? idea.connections as string[] : [],
                attachments: Array.isArray(idea.attachments) ? idea.attachments as string[] : [],
                notes: idea.notes || '',
                isFavorite: idea.isFavorite,
                createdAt: idea.createdAt,
                updatedAt: idea.updatedAt
            }));

            Logger.info('IDEA_SERVICE', `프로젝트 아이디어 조회 완료: ${mappedIdeas.length}개`, { projectId });
            return createSuccess(mappedIdeas);
        } catch (error) {
            Logger.error('IDEA_SERVICE', '아이디어 조회 실패', error);
            return createError('아이디어를 불러오는데 실패했습니다.');
        }
    }

    // 🔥 새 아이디어 생성
    static async createIdea(projectId: string, idea: Omit<IdeaItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<Result<IdeaItem>> {
        try {
            const client = await getPrismaClient();
            const newIdea = await client.projectIdea.create({
                data: {
                    projectId,
                    title: idea.title,
                    content: idea.content,
                    category: idea.category,
                    stage: idea.stage,
                    tags: idea.tags,
                    priority: idea.priority,
                    connections: idea.connections,
                    attachments: idea.attachments,
                    notes: idea.notes,
                    isFavorite: idea.isFavorite,
                    order: 0 // 새 아이디어는 맨 위에
                }
            });

            const mappedIdea: IdeaItem = {
                id: (newIdea as any).id,
                title: (newIdea as any).title,
                content: (newIdea as any).content,
                category: (newIdea as any).category as IdeaItem['category'],
                stage: (newIdea as any).stage as IdeaItem['stage'],
                tags: Array.isArray((newIdea as any).tags) ? (newIdea as any).tags as string[] : [],
                priority: (newIdea as any).priority as IdeaItem['priority'],
                connections: Array.isArray((newIdea as any).connections) ? (newIdea as any).connections as string[] : [],
                attachments: Array.isArray((newIdea as any).attachments) ? (newIdea as any).attachments as string[] : [],
                notes: (newIdea as any).notes || '',
                isFavorite: (newIdea as any).isFavorite,
                createdAt: (newIdea as any).createdAt,
                updatedAt: (newIdea as any).updatedAt
            };

            Logger.info('IDEA_SERVICE', '아이디어 생성 완료', { id: mappedIdea.id, title: mappedIdea.title });
            return createSuccess(mappedIdea);
        } catch (error) {
            Logger.error('IDEA_SERVICE', '아이디어 생성 실패', error);
            return createError('아이디어를 생성하는데 실패했습니다.');
        }
    }

    // 🔥 아이디어 업데이트
    static async updateIdea(id: string, updates: Partial<Omit<IdeaItem, 'id' | 'createdAt'>>): Promise<Result<IdeaItem>> {
        try {
            const client = await getPrismaClient();
            const updatedIdea = await client.projectIdea.update({
                where: { id },
                data: {
                    ...updates,
                    updatedAt: new Date()
                }
            });

            const mappedIdea: IdeaItem = {
                id: (updatedIdea as any).id,
                title: (updatedIdea as any).title,
                content: (updatedIdea as any).content,
                category: (updatedIdea as any).category as IdeaItem['category'],
                stage: (updatedIdea as any).stage as IdeaItem['stage'],
                tags: Array.isArray((updatedIdea as any).tags) ? (updatedIdea as any).tags as string[] : [],
                priority: (updatedIdea as any).priority as IdeaItem['priority'],
                connections: Array.isArray((updatedIdea as any).connections) ? (updatedIdea as any).connections as string[] : [],
                attachments: Array.isArray((updatedIdea as any).attachments) ? (updatedIdea as any).attachments as string[] : [],
                notes: (updatedIdea as any).notes || '',
                isFavorite: (updatedIdea as any).isFavorite,
                createdAt: (updatedIdea as any).createdAt,
                updatedAt: (updatedIdea as any).updatedAt
            };

            Logger.info('IDEA_SERVICE', '아이디어 업데이트 완료', { id });
            return createSuccess(mappedIdea);
        } catch (error) {
            Logger.error('IDEA_SERVICE', '아이디어 업데이트 실패', error);
            return createError('아이디어를 수정하는데 실패했습니다.');
        }
    }

    // 🔥 아이디어 삭제
    static async deleteIdea(id: string): Promise<Result<void>> {
        try {
            const client = await getPrismaClient();
            await client.projectIdea.delete({
                where: { id }
            });

            Logger.info('IDEA_SERVICE', '아이디어 삭제 완료', { id });
            return createSuccess(undefined);
        } catch (error) {
            Logger.error('IDEA_SERVICE', '아이디어 삭제 실패', error);
            return createError('아이디어를 삭제하는데 실패했습니다.');
        }
    }

    // 🔥 즐겨찾기 토글
    static async toggleFavorite(id: string): Promise<Result<IdeaItem>> {
        try {
            const client = await getPrismaClient();
            const idea = await client.projectIdea.findUnique({ where: { id } });
            if (!idea) {
                Logger.error('IDEA_SERVICE', '아이디어를 찾을 수 없음', { id });
                return createError('아이디어를 찾을 수 없습니다.');
            }

            return this.updateIdea(id, { isFavorite: !(idea as any).isFavorite });
        } catch (error) {
            Logger.error('IDEA_SERVICE', '즐겨찾기 토글 실패', error);
            return createError('즐겨찾기를 변경하는데 실패했습니다.');
        }
    }
}
