/**
 * 📖 Episode Service Client - 한국 웹소설 회차 관리 IPC 클라이언트 (렌더러 프로세스)
 *
 * IPC를 통해 메인 프로세스의 EpisodeService와 통신
 * Renderer Process에서 사용하는 IPC 래퍼 클래스
 */

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
} from '../types/episode';

const electronAPI = (window as any).electronAPI;

/**
 * 🔥 Episode Service Client Class (IPC 래퍼)
 * 
 * Main Process의 EpisodeService와 구분하기 위해 Client 접미사 사용
 */
export class EpisodeServiceClient {
  /**
   * 회차 생성
   */
  async createEpisode(input: CreateEpisodeInput): Promise<Episode> {
    const result = await electronAPI['episode:create'](input);
    if (!result.success) {
      throw new Error(result.error || 'Failed to create episode');
    }
    return result.data;
  }

  /**
   * 회차 조회 (ID)
   */
  async getEpisode(id: string): Promise<Episode | null> {
    const result = await electronAPI['episode:get'](id);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get episode');
    }
    return result.data;
  }

  /**
   * 회차 조회 (프로젝트 + 회차 번호)
   */
  async getEpisodeByNumber(projectId: string, episodeNumber: number): Promise<Episode | null> {
    const result = await electronAPI['episode:getByNumber'](projectId, episodeNumber);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get episode by number');
    }
    return result.data;
  }

  /**
   * 회차 목록 조회
   */
  async listEpisodes(
    projectId: string,
    filter?: EpisodeFilterOptions,
    sort?: EpisodeSortOptions
  ): Promise<Episode[]> {
    const result = await electronAPI['episode:list'](projectId, filter, sort);
    if (!result.success) {
      throw new Error(result.error || 'Failed to list episodes');
    }
    return result.data;
  }

  /**
   * 회차 수정
   */
  async updateEpisode(id: string, input: UpdateEpisodeInput): Promise<Episode> {
    const result = await electronAPI['episode:update'](id, input);
    if (!result.success) {
      throw new Error(result.error || 'Failed to update episode');
    }
    return result.data;
  }

  /**
   * 회차 삭제 (소프트 삭제)
   */
  async deleteEpisode(id: string): Promise<void> {
    const result = await electronAPI['episode:delete'](id);
    if (!result.success) {
      throw new Error(result.error || 'Failed to delete episode');
    }
  }

  /**
   * 회차 완전 삭제
   */
  async hardDeleteEpisode(id: string): Promise<void> {
    const result = await electronAPI['episode:hardDelete'](id);
    if (!result.success) {
      throw new Error(result.error || 'Failed to hard delete episode');
    }
  }

  /**
   * 회차 발행
   */
  async publishEpisode(id: string): Promise<Episode> {
    const result = await electronAPI['episode:publish'](id);
    if (!result.success) {
      throw new Error(result.error || 'Failed to publish episode');
    }
    return result.data;
  }

  /**
   * 비축 현황 조회
   */
  async getManuscriptReserves(projectId: string): Promise<ManuscriptReserves> {
    const result = await electronAPI['episode:getManuscriptReserves'](projectId);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get manuscript reserves');
    }
    return result.data;
  }

  /**
   * 5막 구조 분석
   */
  async analyzeFiveActStructure(projectId: string): Promise<FiveActAnalysis[]> {
    const result = await electronAPI['episode:analyzeFiveActStructure'](projectId);
    if (!result.success) {
      throw new Error(result.error || 'Failed to analyze five-act structure');
    }
    return result.data;
  }

  /**
   * 회차 통계 조회
   */
  async getEpisodeStats(projectId: string): Promise<EpisodeStats> {
    const result = await electronAPI['episode:getStats'](projectId);
    if (!result.success) {
      throw new Error(result.error || 'Failed to get episode stats');
    }
    return result.data;
  }

  /**
   * 회차를 5막 구조에 매핑
   */
  mapEpisodeToAct(episodeNumber: number, totalEpisodes: number): FiveActType {
    // 5막 구조 비율: 도입(10%) → 발단(20%) → 전개(30%) → 절정(25%) → 결말(15%)
    const ranges = {
      introduction: { start: 1, end: Math.ceil(totalEpisodes * 0.1), targetPercentage: 10 },
      rising: { start: Math.ceil(totalEpisodes * 0.1) + 1, end: Math.ceil(totalEpisodes * 0.3), targetPercentage: 20 },
      development: { start: Math.ceil(totalEpisodes * 0.3) + 1, end: Math.ceil(totalEpisodes * 0.6), targetPercentage: 30 },
      climax: { start: Math.ceil(totalEpisodes * 0.6) + 1, end: Math.ceil(totalEpisodes * 0.85), targetPercentage: 25 },
      conclusion: { start: Math.ceil(totalEpisodes * 0.85) + 1, end: totalEpisodes, targetPercentage: 15 },
    };

    for (const [act, range] of Object.entries(ranges)) {
      if (episodeNumber >= range.start && episodeNumber <= range.end) {
        return act as FiveActType;
      }
    }

    return 'introduction'; // fallback
  }

}

// ===== INSTANCE EXPORT =====
// Main Process의 EpisodeService와 구분되는 Client 인스턴스

export const episodeServiceClient = new EpisodeServiceClient();