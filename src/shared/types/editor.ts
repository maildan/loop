// 🔥 에디터 관련 타입 정의

export interface EditorTab {
  id: string;
  title: string;
  type: 'main' | 'chapter';  // 글쓰기 에디터만 (구조, 인물 등 제외)
  chapterId?: string; // chapter 타입일 때만 사용
  isActive: boolean;
  isDirty?: boolean; // 저장되지 않은 변경사항이 있는지
  order: number;
  content?: string; // 각 탭의 독립적인 컨텐츠
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
