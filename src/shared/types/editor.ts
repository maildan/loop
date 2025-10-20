// 🔥 에디터 관련 타입 정의

export interface EditorTab {
  id: string;
  title: string;
  /** @deprecated 'main' 타입은 제거됨. chapter만 지원 */
  type: 'chapter';  // 글쓰기 에디터만 (구조, 인물 등 제외)
  chapterId: string; // chapter 타입일 때는 필수
  isActive: boolean;
  isDirty?: boolean; // 저장되지 않은 변경사항이 있는지
  order: number;
  content?: string; // 각 탭의 독립적인 컨텐츠
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
