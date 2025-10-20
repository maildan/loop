// 🔥 에디터 관련 타입 정의

export interface EditorTab {
  id: string;
  title: string;
  type: 'main' | 'chapter' | 'synopsis' | 'characters' | 'structure' | 'ideas' | 'notes';  // 🔥 Universal tab system - 모든 컨텐츠 타입 지원
  chapterId?: string; // chapter 타입일 때만 사용
  isActive: boolean;
  isDirty?: boolean; // 저장되지 않은 변경사항이 있는지
  order: number;
  content?: string; // 각 탭의 독립적인 컨텐츠
  metadata?: Record<string, unknown>; // 🔥 탭 타입별 추가 데이터 (예: synopsis 탭의 활성 서브탭)
  lastAccessedAt: number; // 🔥 MRU: 마지막 접근 시간 (timestamp)
}

export interface ChapterData {
  id: string;
  title: string;
  content: string;
  order: number;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}
