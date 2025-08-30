// 🔥 작가 통계 계산 유틸리티

export interface WriterStats {
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  readingTime: number;
  wordGoal: number;
  progress: number;
  sessionTime: number;
  wpm: number;
  headingCount?: number;
  listItemCount?: number;
}

// 🔥 작가 통계 계산
export const calculateWriterStats = (
  content: string,
  wordGoal: number,
  sessionStartTime: number
): WriterStats => {
  if (!content) {
    return {
      wordCount: 0,
      charCount: 0,
      paragraphCount: 0,
      readingTime: 0,
      wordGoal,
      progress: 0,
      sessionTime: 0,
      wpm: 0,
      headingCount: 0,
      listItemCount: 0
    };
  }
  
  const lines = content.split('\n');
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const charCount = content.length;
  const paragraphCount = content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;
  const readingTime = Math.ceil(wordCount / 200); // 분 단위 (200 WPM 기준)
  const progress = Math.min(100, Math.round((wordCount / wordGoal) * 100));
  
  // 세션 시간 및 WPM 계산
  const sessionMinutes = Math.max(1, (Date.now() - sessionStartTime) / 1000 / 60);
  const wpm = Math.round(wordCount / sessionMinutes);
  const sessionTime = Math.floor(sessionMinutes);
  
  // 마크다운 요소 카운트
  const headingCount = lines.filter(line => line.match(/^#{1,6}\s/)).length;
  const listItemCount = lines.filter(line => line.match(/^[\s]*[-*+]\s/)).length;
  
  return {
    wordCount,
    charCount,
    paragraphCount,
    readingTime,
    wordGoal,
    progress,
    sessionTime,
    wpm,
    headingCount,
    listItemCount
  };
};

// 🔥 시간 포맷팅 헬퍼
export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}분`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}시간 ${mins ? `${mins}분` : ''}`;
};

// 🔥 마지막 저장 시간 포맷팅
export const formatLastSaved = (lastSaved: Date | null): string => {
  if (!lastSaved) return '저장되지 않음';
  
  const now = new Date();
  const diffMs = now.getTime() - lastSaved.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return '방금 전';
  if (diffMins < 60) return `${diffMins}분 전`;
  
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;
  
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}일 전`;
};

// 🔥 글쓰기 목표 추천
export const getRecommendedWordGoal = (averageWordsPerDay: number): number[] => {
  const base = Math.max(500, averageWordsPerDay);
  return [
    Math.round(base * 0.8),
    base,
    Math.round(base * 1.2),
    Math.round(base * 1.5),
    Math.round(base * 2.0)
  ];
};
    