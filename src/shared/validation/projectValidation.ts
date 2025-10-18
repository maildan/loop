/**
 * 🔒 프로젝트 데이터 검증 스키마 (Zod)
 * V3 취약점 완화: 프로젝트 CRUD 입력 검증
 * 
 * @module projectValidation
 */

import { z } from 'zod';
import { 
  KoreanWebNovelGenre, 
  ALL_GENRES, 
  PROJECT_STATUSES,
  ProjectStatus,
  isValidProjectStatus,
  getGenreLabel,
} from '../constants/enums';

/**
 * 🔒 호환성: V2 이전 코드용
 * 
 * ⚠️ 새 코드는 KoreanWebNovelGenre 직접 사용
 */
export type ProjectGenre = KoreanWebNovelGenre;
export const PROJECT_GENRES = ALL_GENRES;
export const PROJECT_STATUSES_COMPAT = PROJECT_STATUSES;

/**
 * 🔒 프로젝트 생성 요청 검증 스키마
 * 
 * 렌더러에서 projects:create IPC 호출 시 사용
 * 
 * @example
 * ```typescript
 * const data = await ProjectCreateSchema.parseAsync({
 *   title: '내 이야기',
 *   genre: '판타지',
 *   author: '김작가',
 * })
 * ```
 */
export const ProjectCreateSchema = z.object({
  title: z
    .string()
    .min(1, '제목은 최소 1자 이상이어야 합니다')
    .max(100, '제목은 최대 100자까지 가능합니다')
    .transform((val) => val.trim()),

  description: z
    .string()
    .max(500, '설명은 최대 500자까지 가능합니다')
    .transform((val) => val.trim())
    .optional()
    .default(''),

  content: z
    .string()
    .max(5_000_000, '내용은 최대 5MB까지 가능합니다')
    .optional()
    .default(''),

  genre: z
    .enum(ALL_GENRES as [KoreanWebNovelGenre, ...KoreanWebNovelGenre[]])
    .optional()
    .default('unknown' as const),

  status: z
    .enum(PROJECT_STATUSES as [ProjectStatus, ...ProjectStatus[]])
    .optional()
    .default('active' as const),

  author: z
    .string()
    .max(100, '작가명은 최대 100자까지 가능합니다')
    .transform((val) => val.trim())
    .optional()
    .default('사용자'),

  chapters: z
    .string()
    .optional(),
});

/**
 * 🔒 프로젝트 업데이트 요청 검증 스키마
 * 
 * 렌더러에서 projects:update IPC 호출 시 사용
 * 모든 필드가 선택 사항이지만, 최소 하나는 필수
 * 
 * @example
 * ```typescript
 * const updates = await ProjectUpdateSchema.parseAsync({
 *   title: '수정된 제목',
 *   progress: 50,
 * })
 * ```
 */
export const ProjectUpdateSchema = z
  .object({
    // 🔥 title: 비어있으면 무시, 있으면 검증 (자동저장 시 빈 제목 수용)
    title: z
      .string()
      .transform((val) => val.trim())
      .pipe(
        z.union([
          z.literal(''),  // 빈 문자열: 무시됨 (서버에서 기존 제목 유지)
          z.string().min(1, '제목은 최소 1자 이상이어야 합니다')
                    .max(100, '제목은 최대 100자까지 가능합니다'),
        ])
      )
      .optional(),

    description: z
      .string()
      .max(500, '설명은 최대 500자까지 가능합니다')
      .transform((val) => val.trim())
      .optional(),

    content: z
      .string()
      .max(5_000_000, '내용은 최대 5MB까지 가능합니다')
      .optional(),

    genre: z
      .enum(ALL_GENRES as [KoreanWebNovelGenre, ...KoreanWebNovelGenre[]])
      .optional(),

    status: z
      .enum(PROJECT_STATUSES as [ProjectStatus, ...ProjectStatus[]])
      .optional(),

    progress: z
      .number()
      .min(0, '진행도는 0 이상이어야 합니다')
      .max(100, '진행도는 100 이하여야 합니다')
      .optional(),

    author: z
      .string()
      .max(100, '작가명은 최대 100자까지 가능합니다')
      .transform((val) => val.trim())
      .optional(),

    chapters: z
      .string()
      .optional(),

    wordCount: z
      .number()
      .min(0)
      .optional(),

    // 🔥 렌더러에서 전송하지만 백엔드에서 무시하는 필드
    // 클라이언트 로컬 타임스탬프로만 사용, 서버는 자체 타임스탬프 생성
    lastModified: z
      .date()
      .or(z.string().datetime())
      .optional(),
  })
  .strict() // 🔒 미알려진 필드 거부
  .refine(
    (obj) => {
      // lastModified와 빈 title 제외하고 실제 업데이트 필드 확인
      const { lastModified, title, ...updates } = obj;
      // title이 있으면 (빈 문자열 아니면) 포함
      const hasTitle = title && title.trim().length > 0;
      return Object.keys(updates).length > 0 || hasTitle;
    },
    {
      message: '최소 하나의 필드를 업데이트해야 합니다',
    }
  );

/**
 * 🔒 프로젝트 데이터 타입 (검증된)
 */
export type ProjectCreateInput = z.infer<typeof ProjectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof ProjectUpdateSchema>;

/**
 * 🔒 프로젝트 입력값 검증 함수
 * 
 * @param data - 검증할 입력 데이터
 * @param type - 'create' 또는 'update'
 * @returns 검증된 데이터
 * @throws {z.ZodError} 검증 실패 시
 * 
 * @example
 * ```typescript
 * try {
 *   const validated = await validateProjectInput(inputData, 'create')
 * } catch (err) {
 *   if (err instanceof z.ZodError) {
 *     console.error(err.errors[0].message)
 *   }
 * }
 * ```
 */
export async function validateProjectInput(
  data: unknown,
  type: 'create' | 'update'
): Promise<ProjectCreateInput | ProjectUpdateInput> {
  const schema = type === 'create' ? ProjectCreateSchema : ProjectUpdateSchema;

  try {
    return await schema.parseAsync(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      // 첫 번째 에러 메시지만 반환 (간결함)
      const firstError = error.issues[0];
      if (firstError) {
        throw new Error(
          `입력값 검증 실패: ${firstError.path.join('.')} - ${firstError.message}`
        );
      }
      throw new Error('입력값 검증 실패');
    }
    throw error;
  }
}

/**
 * 🔒 장르 목록 조회 (UI용)
 * 
 * 렌더러가 유효한 장르 목록을 얻을 때 사용
 */
export function getAvailableGenres(): ProjectGenre[] {
  return [...PROJECT_GENRES];
}

/**
 * 🔒 상태 목록 조회 (UI용)
 * 
 * 렌더러가 유효한 상태 목록을 얻을 때 사용
 */
export function getAvailableStatuses(): ProjectStatus[] {
  return [...PROJECT_STATUSES];
}

/**
 * 🔒 유효한 장르 확인
 */
export function isValidGenre(genre: unknown): genre is ProjectGenre {
  return PROJECT_GENRES.includes(genre as any);
}

/**
 * 🔒 유효한 상태 확인
 */
export function isValidStatus(status: unknown): status is ProjectStatus {
  return PROJECT_STATUSES.includes(status as any);
}

/**
 * 🔒 공격 패턴 탐지 (선택 사항)
 * 
 * 특정 패턴의 입력을 거부할 수 있습니다.
 * 예: SQL 인젝션, XSS 등
 */
export function detectSuspiciousInput(input: string): boolean {
  // SQL 인젝션 패턴
  const sqlPatterns = /(\bdrop\b|\bdelete\b|\binsert\b|\bupdate\b|\bunion\b)/gi;
  if (sqlPatterns.test(input)) return true;

  // XSS 패턴
  const xssPatterns = /(<script|javascript:|onerror=|onclick=)/gi;
  if (xssPatterns.test(input)) return true;

  // Command 인젝션 패턴
  const cmdPatterns = /(;|\||`|\$\(|&&)/;
  if (cmdPatterns.test(input)) return true;

  return false;
}
