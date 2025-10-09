/**
 * Synopsis Statistics Service
 * @module main/services/SynopsisStatsService
 */

import { PrismaClient } from '@prisma/client';
import type {
  Publication,
  CreatePublicationDTO,
  PlatformMetric,
  QuickLogDTO,
  MetricSuggestions,
  PlatformComparison,
  InsightCard,
  PublisherRelation,
  StrategyExperiment,
  CreateExperimentDTO
} from '../../shared/types/synopsis-stats';

export class SynopsisStatsService {
  private static instance: SynopsisStatsService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): SynopsisStatsService {
    if (!SynopsisStatsService.instance) {
      SynopsisStatsService.instance = new SynopsisStatsService();
    }
    return SynopsisStatsService.instance;
  }

  // ===========================
  // Publications
  // ===========================

  async getPublications(projectId: string): Promise<Publication[]> {
    const pubs = await this.prisma.publication.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' }
    });
    return pubs as any;
  }

  async createPublication(data: CreatePublicationDTO): Promise<Publication> {
    // 프로젝트 존재 여부 확인
    const projectExists = await this.prisma.project.findUnique({
      where: { id: data.projectId }
    });

    if (!projectExists) {
      throw new Error(`Project with id ${data.projectId} not found. Please save the project first.`);
    }

    // 중복 플랫폼 확인
    const existingPub = await this.prisma.publication.findUnique({
      where: {
        projectId_platform: {
          projectId: data.projectId,
          platform: data.platform
        }
      }
    });

    if (existingPub) {
      throw new Error(`${data.platform} is already added to this project.`);
    }

    const pub = await this.prisma.publication.create({
      data: {
        projectId: data.projectId,
        platform: data.platform,
        platformUrl: data.platformUrl,
        startDate: data.startDate,
        status: data.status || 'ongoing',
        contractType: data.contractType,
        note: data.note
      }
    });
    return pub as any;
  }

  async deletePublication(id: string): Promise<void> {
    await this.prisma.publication.delete({
      where: { id }
    });
  }

  // ===========================
  // Platform Metrics (Quick Log)
  // ===========================

  async createMetric(data: QuickLogDTO): Promise<PlatformMetric> {
    const metric = await this.prisma.platformMetric.create({
      data: {
        publicationId: data.publicationId,
        date: data.date,
        views: data.views,
        revenue: data.revenue,
        purchases: data.purchases,
        rank: data.rank,
        rankType: data.rankType,
        episodeNumber: data.episodeNumber,
        note: data.note,
        isEstimated: data.isEstimated || false
      }
    });
    return metric as any;
  }

  async getMetrics(
    publicationId: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<PlatformMetric[]> {
    const where: any = { publicationId };

    if (dateRange) {
      where.date = {
        gte: dateRange.start,
        lte: dateRange.end
      };
    }

    const metrics = await this.prisma.platformMetric.findMany({
      where,
      orderBy: { date: 'asc' }
    });
    return metrics as any;
  }

  async getSuggestions(publicationId: string): Promise<MetricSuggestions> {
    const recentMetrics = await this.prisma.platformMetric.findMany({
      where: { publicationId },
      orderBy: { date: 'desc' },
      take: 30 // 최근 30개 데이터
    });

    if (recentMetrics.length === 0) {
      return {};
    }

    const validViews = recentMetrics.filter((m: any) => m.views !== null).map((m: any) => m.views!);
    const validRevenue = recentMetrics.filter((m: any) => m.revenue !== null).map((m: any) => m.revenue!);
    const validPurchases = recentMetrics
      .filter((m: any) => m.purchases !== null)
      .map((m: any) => m.purchases!);

    const avgViews =
      validViews.length > 0
        ? Math.round(validViews.reduce((a, b) => a + b, 0) / validViews.length)
        : undefined;

    const avgRevenue =
      validRevenue.length > 0
        ? Math.round(validRevenue.reduce((a, b) => a + b, 0) / validRevenue.length)
        : undefined;

    const avgPurchases =
      validPurchases.length > 0
        ? Math.round(validPurchases.reduce((a, b) => a + b, 0) / validPurchases.length)
        : undefined;

    const lastMetric = recentMetrics[0];

    return {
      avgViews,
      avgRevenue,
      avgPurchases,
      lastRank: lastMetric?.rank || undefined,
      lastEpisodeNumber: lastMetric?.episodeNumber || undefined
    };
  }

  // ===========================
  // Platform Comparison
  // ===========================

  async getPlatformComparison(projectId: string): Promise<PlatformComparison[]> {
    const publications = await this.prisma.publication.findMany({
      where: { projectId },
      include: { metrics: true }
    });

    return publications.map((pub) => {
      const metrics = pub.metrics;
      const totalViews = metrics.reduce((sum, m) => sum + (m.views || 0), 0);
      const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
      const avgViewsPerEpisode = metrics.length > 0 ? totalViews / metrics.length : 0;
      const revenuePerView = totalViews > 0 ? totalRevenue / totalViews : 0;

      let efficiency: 'high' | 'medium' | 'low' = 'low';
      if (revenuePerView > 10) efficiency = 'high';
      else if (revenuePerView > 5) efficiency = 'medium';

      return {
        platform: pub.platform as any,
        totalViews,
        totalRevenue,
        avgViewsPerEpisode,
        revenuePerView,
        efficiency
      };
    });
  }

  async getInsights(projectId: string): Promise<InsightCard[]> {
    const comparisons = await this.getPlatformComparison(projectId);
    const insights: InsightCard[] = [];

    // 가장 효율적인 플랫폼 찾기
    const sortedByEfficiency = [...comparisons].sort(
      (a, b) => b.revenuePerView - a.revenuePerView
    );
    const topPlatform = sortedByEfficiency[0];
    if (topPlatform && topPlatform.revenuePerView > 0) {
      insights.push({
        id: 'top-platform',
        type: 'success',
        title: `${topPlatform.platform}가 가장 효율적입니다`,
        description: `조회당 ${topPlatform.revenuePerView.toFixed(2)}원의 수익을 만들고 있어요.`,
        priority: 1
      });
    }

    // 저조한 플랫폼 경고
    const lowPerformers = comparisons.filter((c) => c.efficiency === 'low' && c.totalViews > 100);
    const lowestPerformer = lowPerformers[0];
    if (lowestPerformer) {
      insights.push({
        id: 'low-performer',
        type: 'warning',
        title: `${lowestPerformer.platform}의 성과가 저조합니다`,
        description: '전략 변경이나 프로모션을 고려해보세요.',
        priority: 2
      });
    }

    return insights.sort((a, b) => a.priority - b.priority);
  }

  // ===========================
  // Publishers
  // ===========================

  async getPublishers(projectId: string): Promise<PublisherRelation[]> {
    const publishers = await this.prisma.publisherRelation.findMany({
      where: { projectId },
      orderBy: { contactDate: 'desc' }
    });
    return publishers as any;
  }

  async createPublisher(
    data: Omit<PublisherRelation, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PublisherRelation> {
    const publisher = await this.prisma.publisherRelation.create({
      data: {
        projectId: data.projectId,
        publisherName: data.publisherName,
        publisherType: data.publisherType,
        contactDate: data.contactDate,
        status: data.status,
        contractType: data.contractType,
        contract: data.contract as any,
        advance: data.advance,
        royaltyRate: data.royaltyRate,
        nextActionDate: data.nextActionDate,
        note: data.note
      }
    });
    return publisher as any;
  }

  // ===========================
  // Strategy Experiments
  // ===========================

  async getExperiments(projectId: string): Promise<StrategyExperiment[]> {
    const experiments = await this.prisma.strategyExperiment.findMany({
      where: { projectId },
      orderBy: { startDate: 'desc' }
    });
    return experiments as any;
  }

  async createExperiment(data: CreateExperimentDTO): Promise<StrategyExperiment> {
    const experiment = await this.prisma.strategyExperiment.create({
      data: {
        projectId: data.projectId,
        type: data.type,
        title: data.title,
        description: data.description,
        hypothesis: data.hypothesis,
        startDate: data.startDate,
        status: data.status || 'planned'
      }
    });
    return experiment as any;
  }
}
