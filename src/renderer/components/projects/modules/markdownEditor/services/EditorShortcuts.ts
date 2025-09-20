// 🔥 기가차드 노션 스타일 단축키 시스템
'use client';

import { Editor } from '@tiptap/react';
import { Logger } from '../../../../../../shared/logger';

// 🔥 플랫폼별 modifier 키 감지
const isMac = typeof window !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
const modifierKey = isMac ? 'metaKey' : 'ctrlKey';

// 🔥 단축키 정의 (노션 스타일)
export interface EditorShortcut {
  key: string;
  modifier: boolean;
  shift?: boolean;
  alt?: boolean;
  action: (editor: Editor) => boolean;
  description: string;
}

// 🔥 기본 텍스트 포맷팅 단축키
export const TEXT_FORMATTING_SHORTCUTS: EditorShortcut[] = [
  {
    key: 'b',
    modifier: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleBold().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Bold toggled');
      return true;
    },
    description: '볼드 토글'
  },
  {
    key: 'i',
    modifier: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleItalic().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Italic toggled');
      return true;
    },
    description: '이탤릭 토글'
  },
  {
    key: 'u',
    modifier: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleMark('underline').run();
      Logger.debug('EDITOR_SHORTCUTS', 'Underline toggled');
      return true;
    },
    description: '언더라인 토글'
  },
  {
    key: 's',
    modifier: true,
    shift: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleStrike().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Strikethrough toggled');
      return true;
    },
    description: '취소선 토글'
  },
  {
    key: 'k',
    modifier: true,
    action: (editor: Editor) => {
      // 🔥 링크 생성 (추후 구현)
      Logger.debug('EDITOR_SHORTCUTS', 'Link shortcut triggered');
      return true;
    },
    description: '링크 생성'
  }
];

// 🔥 헤딩 단축키
export const HEADING_SHORTCUTS: EditorShortcut[] = [
  {
    key: '1',
    modifier: true,
    alt: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
      Logger.debug('EDITOR_SHORTCUTS', 'H1 toggled');
      return true;
    },
    description: '제목 1'
  },
  {
    key: '2',
    modifier: true,
    alt: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
      Logger.debug('EDITOR_SHORTCUTS', 'H2 toggled');
      return true;
    },
    description: '제목 2'
  },
  {
    key: '3',
    modifier: true,
    alt: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
      Logger.debug('EDITOR_SHORTCUTS', 'H3 toggled');
      return true;
    },
    description: '제목 3'
  },
  {
    key: '0',
    modifier: true,
    alt: true,
    action: (editor: Editor) => {
      editor.chain().focus().setParagraph().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Paragraph set');
      return true;
    },
    description: '일반 텍스트'
  }
];

// 🔥 리스트 단축키
export const LIST_SHORTCUTS: EditorShortcut[] = [
  {
    key: '8',
    modifier: true,
    shift: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleBulletList().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Bullet list toggled');
      return true;
    },
    description: '불릿 리스트'
  },
  {
    key: '7',
    modifier: true,
    shift: true,
    action: (editor: Editor) => {
      editor.chain().focus().toggleOrderedList().run();
      Logger.debug('EDITOR_SHORTCUTS', 'Ordered list toggled');
      return true;
    },
    description: '번호 리스트'
  }
];

// 🔥 저장 단축키
export const SAVE_SHORTCUTS: EditorShortcut[] = [
  {
    key: 's',
    modifier: true,
    action: (editor: Editor) => {
      // 🔥 저장 이벤트 발생 (커스텀 이벤트)
      const saveEvent = new CustomEvent('editor:save');
      window.dispatchEvent(saveEvent);
      Logger.info('EDITOR_SHORTCUTS', 'Save triggered');
      return true;
    },
    description: '저장'
  }
];

// 🔥 모든 단축키 통합
export const ALL_SHORTCUTS: EditorShortcut[] = [
  ...TEXT_FORMATTING_SHORTCUTS,
  ...HEADING_SHORTCUTS,
  ...LIST_SHORTCUTS,
  ...SAVE_SHORTCUTS
];

// 🔥 키보드 이벤트 핸들러
export function handleEditorKeyDown(editor: Editor | null, event: KeyboardEvent): boolean {
  if (!editor) return false;

  const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
  const isModifier = isMac ? metaKey : ctrlKey;

  // 🔥 Space 키는 마크다운 처리를 위해 완전 제외
  if (key === ' ') {
    return false;
  }

  // 🔥 마크다운 타이핑 방해 방지: modifier 키가 없는 단일 문자는 처리하지 않음
  if (!isModifier && !shiftKey && !altKey && key.length === 1) {
    return false;
  }

  // 🔥 단축키 매칭 및 실행
  for (const shortcut of ALL_SHORTCUTS) {
    if (
      shortcut.key.toLowerCase() === key.toLowerCase() &&
      Boolean(shortcut.modifier) === isModifier &&
      Boolean(shortcut.shift) === shiftKey &&
      Boolean(shortcut.alt) === altKey
    ) {
      event.preventDefault();
      event.stopPropagation();

      try {
        const handled = shortcut.action(editor);
        if (handled) {
          Logger.debug('EDITOR_SHORTCUTS', `Shortcut executed: ${shortcut.description}`, {
            key: shortcut.key,
            modifier: isModifier,
            shift: shiftKey,
            alt: altKey
          });
          return true;
        }
      } catch (error) {
        Logger.error('EDITOR_SHORTCUTS', `Shortcut execution failed: ${shortcut.description}`, error);
      }
    }
  }

  return false;
}

// 🔥 에디터에 단축키 시스템 바인딩 (전역 리스너 제거)
export function bindShortcutsToEditor(editor: Editor | null): () => void {
  if (!editor) return () => { };

  // 🔥 전역 리스너 등록하지 않음 - TipTap 내부 handleKeyDown만 사용
  Logger.info('EDITOR_SHORTCUTS', 'Shortcuts system initialized', {
    shortcutCount: ALL_SHORTCUTS.length,
    platform: isMac ? 'macOS' : 'Windows/Linux'
  });

  // 🔥 정리 함수 반환 (실제로는 아무것도 안 함)
  return () => {
    Logger.debug('EDITOR_SHORTCUTS', 'Shortcuts system cleaned up');
  };
}

// 🔥 단축키 도움말 텍스트 생성
export function getShortcutHelp(): string {
  const modifier = isMac ? '⌘' : 'Ctrl';
  const shortcuts = [
    '📝 텍스트 포맷팅',
    `${modifier} + B: 볼드`,
    `${modifier} + I: 이탤릭`,
    `${modifier} + U: 밑줄`,
    `${modifier} + Shift + S: 취소선`,
    `${modifier} + \`: 인라인 코드`,
    '',
    '📋 편집',
    `${modifier} + C: 복사`,
    `${modifier} + V: 붙여넣기`,
    `${modifier} + X: 잘라내기`,
    `${modifier} + Z: 실행 취소`,
    `${modifier} + Y: 다시 실행`,
    '',
    '🔤 제목 및 구조',
    `${modifier} + Alt + 1: 제목 1`,
    `${modifier} + Alt + 2: 제목 2`,
    `${modifier} + Alt + 3: 제목 3`,
    `${modifier} + Shift + 8: 불릿 리스트`,
    `${modifier} + Shift + 7: 번호 리스트`,
    '',
    '⚡ 고급 기능',
    `${modifier} + K: 링크 삽입`,
    `${modifier} + Shift + K: 코드 블록`,
    `${modifier} + Shift + >: 인용구`,
    `${modifier} + Enter: 줄바꿈`,
    'ESC: 포커스 모드 해제'
  ];

  return shortcuts.join('\n');
}
