/**
 * 📖 Episode Service - 한국 웹소설 회차 관리 서비스 (메인 프로세스)
 *
 * Episode CRUD + 비축 현황 + 5막 구조 매핑
 */

import { prismaService } from './PrismaService';
import type {
  Episode,
  EpisodeStatus,
  FiveActType,
  CreateEpisodeInput,
  UpdateEpisodeInput,
  ManuscriptReserves,
  FiveActAnalysis,
  EpisodeFilterOptions,
  EpisodeSortOptions,
  EpisodeStats
} from '../../shared/types/episode';

/**
 * 🔥 Episode Service Class (메인 프로세스용)
 */
export class EpisodeService {
  private prismaService = prismaService;

  /**
   * 회차 생성
   */
  async createEpisode(input: CreateEpisodeInput): Promise<Episode> {
    const prisma = await this.prismaService.getClient();
    const wordCount = input.content ? this.calculateWordCount(input.content) : 0;

    const episode = await prisma.episode.create({
      data: {
        projectId: input.projectId,
        episodeNumber: input.episodeNumber,
        title: input.title,
        content: input.content || '',
        wordCount,
        targetWordCount: input.targetWordCount || 5500,
        status: input.status || 'draft',
        act: input.act || null,
        notes: input.notes || null,
        sortOrder: input.episodeNumber, // 기본값: episodeNumber와 동일
      },
    });

    return this.toPrismaEpisode(episode);
  }

  /**
   * 회차 조회 (ID)
   */
  async getEpisode(id: string): Promise<Episode | null> {
    const prisma = await this.prismaService.getClient();
    const episode = await prisma.episode.findUnique({
      where: { id },
    });

    return episode ? this.toPrismaEpisode(episode) : null;
  }

  /**
   * 회차 조회 (프로젝트 + 회차 번호)
   */
  async getEpisodeByNumber(projectId: string, episodeNumber: number): Promise<Episode | null> {
    const prisma = await this.prismaService.getClient();
    const episode = await prisma.episode.findUnique({
      where: {
        projectId_episodeNumber: {
          projectId,
          episodeNumber,
        },
      },
    });

    return episode ? this.toPrismaEpisode(episode) : null;
  }

  /**
   * 회차 목록 조회
   */
  async listEpisodes(
    projectId: string,
    filter?: EpisodeFilterOptions,
    sort?: EpisodeSortOptions
  ): Promise<Episode[]> {
    const prisma = await this.prismaService.getClient();
    const where: any = {
      projectId,
      isActive: true,
    };

    if (filter?.status) {
      where.status = filter.status;
    }

    if (filter?.act) {
      where.act = filter.act;
    }

    if (filter?.hasCliffhanger !== undefined) {
      where.cliffhangerType = filter.hasCliffhanger ? { not: null } : null;
    }

    if (filter?.minWordCount !== undefined) {
      where.wordCount = { gte: filter.minWordCount };
    }

    if (filter?.maxWordCount !== undefined) {
      where.wordCount = { ...where.wordCount, lte: filter.maxWordCount };
    }

    if (filter?.publishedAfter) {
      where.publishedAt = { gte: filter.publishedAfter };
    }

    if (filter?.publishedBefore) {
      where.publishedAt = { ...where.publishedAt, lte: filter.publishedBefore };
    }

    let orderBy: any = { episodeNumber: 'asc' };

    if (sort?.field) {
      orderBy = {
        [sort.field]: sort.direction || 'asc',
      };
    }

    const episodes = await prisma.episode.findMany({
      where,
      orderBy,
      take: filter?.limit || 100,
      skip: filter?.offset || 0,
    });

    return episodes.map((episode: any) => this.toPrismaEpisode(episode));
  }

  /**
   * 회차 수정
   */
  async updateEpisode(id: string, input: UpdateEpisodeInput): Promise<Episode> {
    const prisma = await this.prismaService.getClient();
    const updateData: any = {};

    if (input.title !== undefined) updateData.title = input.title;
    if (input.content !== undefined) {
      updateData.content = input.content;
      updateData.wordCount = this.calculateWordCount(input.content);
    }
    if (input.targetWordCount !== undefined) updateData.targetWordCount = input.targetWordCount;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.act !== undefined) updateData.act = input.act;
    if (input.cliffhangerType !== undefined) updateData.cliffhangerType = input.cliffhangerType;
    if (input.cliffhangerIntensity !== undefined) updateData.cliffhangerIntensity = input.cliffhangerIntensity;
    if (input.notes !== undefined) updateData.notes = input.notes;

    updateData.updatedAt = new Date();

    const episode = await prisma.episode.update({
      where: { id },
      data: updateData,
    });

    return this.toPrismaEpisode(episode);
  }

  /**
   * 회차 삭제 (소프트 삭제)
   */
  async deleteEpisode(id: string): Promise<void> {
    const prisma = await this.prismaService.getClient();
    await prisma.episode.update({
      where: { id },
      data: {
        isActive: false,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * 회차 완전 삭제
   */
  async hardDeleteEpisode(id: string): Promise<void> {
    const prisma = await this.prismaService.getClient();
    await prisma.episode.delete({
      where: { id },
    });
  }

  /**
   * 회차 발행
   */
  async publishEpisode(id: string): Promise<Episode> {
    const prisma = await this.prismaService.getClient();
    const episode = await prisma.episode.update({
      where: { id },
      data: {
        status: 'published',
        publishedAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return this.toPrismaEpisode(episode);
  }

  /**
   * 비축 현황 조회
   */
  async getManuscriptReserves(projectId: string): Promise<ManuscriptReserves> {
    const prisma = await this.prismaService.getClient();
    const episodes = await prisma.episode.findMany({
      where: {
        projectId,
        isActive: true,
      },
    });

    const totalEpisodes = episodes.length;
    const draftEpisodes = episodes.filter((e: any) => e.status === 'draft').length;
    const inProgressEpisodes = episodes.filter((e: any) => e.status === 'in-progress').length;
    const completedEpisodes = episodes.filter((e: any) => e.status === 'completed').length;
    const publishedEpisodes = episodes.filter((e: any) => e.status === 'published').length;
    const reserveCount = completedEpisodes - publishedEpisodes;

    const totalWordCount = episodes.reduce((sum: number, e: any) => sum + e.wordCount, 0);
    const averageWordCount = totalEpisodes > 0 ? Math.round(totalWordCount / totalEpisodes) : 0;

    const lastPublishedEpisode = episodes
      .filter((e: any) => e.publishedAt)
      .sort((a: any, b: any) => (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0))[0];

    return {
      totalEpisodes,
      draftEpisodes,
      inProgressEpisodes,
      completedEpisodes,
      publishedEpisodes,
      reserveCount,
      lastPublishedDate: lastPublishedEpisode?.publishedAt || null,
      nextScheduledPublish: null, // TODO: 스케줄링 기능 추가 시 구현
      totalWordCount,
      averageWordCount,
    };
  }

  /**
   * 5막 구조 분석
   */
  async analyzeFiveActStructure(projectId: string): Promise<FiveActAnalysis[]> {
    const prisma = await this.prismaService.getClient();
    const episodes = await prisma.episode.findMany({
      where: {
        projectId,
        isActive: true,
      },
      orderBy: { episodeNumber: 'asc' },
    });

    const totalEpisodes = episodes.length;
    if (totalEpisodes === 0) {
      return this.getEmptyFiveActAnalysis();
    }

    const actRanges = this.calculateActRanges(totalEpisodes);
    const actAnalysis: FiveActAnalysis[] = [];

    for (const act of ['introduction', 'rising', 'development', 'climax', 'conclusion'] as FiveActType[]) {
      const range = actRanges[act];
      const actEpisodes = episodes.filter((e: any) => e.episodeNumber >= range.start && e.episodeNumber <= range.end);

      const currentWordCount = actEpisodes.reduce((sum: number, e: any) => sum + e.wordCount, 0);
      const targetWordCount = range.targetPercentage * 0.01 * (totalEpisodes * 5500); // 5500: target word count per episode
      const currentPercentage = totalEpisodes > 0 ? (actEpisodes.length / totalEpisodes) * 100 : 0;

      actAnalysis.push({
        act,
        name: this.getActName(act),
        description: this.getActDescription(act),
        targetPercentage: range.targetPercentage,
        currentPercentage,
        targetWordCount: Math.round(targetWordCount),
        currentWordCount,
        episodes: actEpisodes.map((e: any) => this.toPrismaEpisode(e)),
        isComplete: currentPercentage >= range.targetPercentage * 0.8, // 80% 이상이면 완료로 간주
      });
    }

    return actAnalysis;
  }

  /**
   * 회차 통계 조회
   */
  async getEpisodeStats(projectId: string): Promise<EpisodeStats> {
    const prisma = await this.prismaService.getClient();
    const episodes = await prisma.episode.findMany({
      where: {
        projectId,
        isActive: true,
      },
    });

    if (episodes.length === 0) {
      return {
        totalEpisodes: 0,
        byStatus: { draft: 0, 'in-progress': 0, completed: 0, published: 0 },
        byAct: {},
        totalWordCount: 0,
        averageWordCount: 0,
        longestEpisode: null,
        shortestEpisode: null,
        withCliffhangers: 0,
      };
    }

    const sortedByWordCount = [...episodes].sort((a: any, b: any) => b.wordCount - a.wordCount);
    const longest = sortedByWordCount[0];
    const shortest = sortedByWordCount[sortedByWordCount.length - 1];

    const publishedEpisodes = episodes.filter((e: any) => e.publishedAt).sort((a: any, b: any) =>
      (b.publishedAt?.getTime() || 0) - (a.publishedAt?.getTime() || 0)
    );

    return {
      totalEpisodes: episodes.length,
      byStatus: {
        draft: episodes.filter((e: any) => e.status === 'draft').length,
        'in-progress': episodes.filter((e: any) => e.status === 'in-progress').length,
        completed: episodes.filter((e: any) => e.status === 'completed').length,
        published: episodes.filter((e: any) => e.status === 'published').length,
      },
      byAct: episodes.reduce((acc: any, e: any) => {
        if (e.act) {
          acc[e.act] = (acc[e.act] || 0) + 1;
        }
        return acc;
      }, {}),
      totalWordCount: episodes.reduce((sum: number, e: any) => sum + e.wordCount, 0),
      averageWordCount: Math.round(episodes.reduce((sum: number, e: any) => sum + e.wordCount, 0) / episodes.length),
      longestEpisode: longest ? {
        episodeNumber: longest.episodeNumber,
        wordCount: longest.wordCount,
      } : null,
      shortestEpisode: shortest ? {
        episodeNumber: shortest.episodeNumber,
        wordCount: shortest.wordCount,
      } : null,
      withCliffhangers: episodes.filter((e: any) => e.cliffhangerType).length,
    };
  }

  /**
   * 회차를 5막 구조에 매핑
   */
  mapEpisodeToAct(episodeNumber: number, totalEpisodes: number): FiveActType {
    const ranges = this.calculateActRanges(totalEpisodes);

    for (const [act, range] of Object.entries(ranges)) {
      if (episodeNumber >= range.start && episodeNumber <= range.end) {
        return act as FiveActType;
      }
    }

    return 'introduction'; // fallback
  }

  // ===== PRIVATE METHODS =====

  private calculateWordCount(content: string): number {
    if (!content) return 0;

    // 한글, 영어, 숫자, 공백을 제외한 모든 문자를 제거하고 단어 수 계산
    const cleanContent = content.replace(/[^\w\s가-힣]/g, '');
    const words = cleanContent.split(/\s+/).filter(word => word.trim().length > 0);

    return words.length;
  }

  private toPrismaEpisode(prismaEpisode: any): Episode {
    return {
      id: prismaEpisode.id,
      projectId: prismaEpisode.projectId,
      episodeNumber: prismaEpisode.episodeNumber,
      title: prismaEpisode.title,
      content: prismaEpisode.content,
      wordCount: prismaEpisode.wordCount,
      targetWordCount: prismaEpisode.targetWordCount,
      status: prismaEpisode.status as EpisodeStatus,
      act: prismaEpisode.act as FiveActType | null,
      cliffhangerType: prismaEpisode.cliffhangerType,
      cliffhangerIntensity: prismaEpisode.cliffhangerIntensity,
      notes: prismaEpisode.notes,
      sortOrder: prismaEpisode.sortOrder,
      isActive: prismaEpisode.isActive,
      createdAt: prismaEpisode.createdAt,
      updatedAt: prismaEpisode.updatedAt,
      publishedAt: prismaEpisode.publishedAt,
    };
  }

  private calculateActRanges(totalEpisodes: number) {
    // 5막 구조 비율: 도입(10%) → 발단(20%) → 전개(30%) → 절정(25%) → 결말(15%)
    const ranges = {
      introduction: { start: 1, end: Math.ceil(totalEpisodes * 0.1), targetPercentage: 10 },
      rising: { start: Math.ceil(totalEpisodes * 0.1) + 1, end: Math.ceil(totalEpisodes * 0.3), targetPercentage: 20 },
      development: { start: Math.ceil(totalEpisodes * 0.3) + 1, end: Math.ceil(totalEpisodes * 0.6), targetPercentage: 30 },
      climax: { start: Math.ceil(totalEpisodes * 0.6) + 1, end: Math.ceil(totalEpisodes * 0.85), targetPercentage: 25 },
      conclusion: { start: Math.ceil(totalEpisodes * 0.85) + 1, end: totalEpisodes, targetPercentage: 15 },
    };

    return ranges;
  }

  private getActName(act: FiveActType): string {
    const names = {
      introduction: '도입',
      rising: '발단',
      development: '전개',
      climax: '절정',
      conclusion: '결말',
    };
    return names[act];
  }

  private getActDescription(act: FiveActType): string {
    const descriptions = {
      introduction: '독자를 끌어들이고 세계관을 설정하는 부분',
      rising: '갈등이 시작되고 주인공이 도전에 직면하는 부분',
      development: '갈등이 심화되고 복잡해지는 부분',
      climax: '갈등이 최고조에 달하는 부분',
      conclusion: '갈등이 해결되고 이야기가 마무리되는 부분',
    };
    return descriptions[act];
  }

  private getEmptyFiveActAnalysis(): FiveActAnalysis[] {
    const acts: FiveActType[] = ['introduction', 'rising', 'development', 'climax', 'conclusion'];

    return acts.map(act => ({
      act,
      name: this.getActName(act),
      description: this.getActDescription(act),
      targetPercentage: 0,
      currentPercentage: 0,
      targetWordCount: 0,
      currentWordCount: 0,
      episodes: [],
      isComplete: false,
    }));
  }
}