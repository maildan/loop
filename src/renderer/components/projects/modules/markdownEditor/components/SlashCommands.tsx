'use client';

import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Extension } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import type { Range, Editor } from '@tiptap/core';
import type { Instance } from 'tippy.js';
import {
  Hash,
  List,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Type,
  Heading1,
  Heading2,
  Heading3,
  Lightbulb,
  AlertTriangle,
  X,
  ChevronDown,
  Highlighter
} from 'lucide-react';

// 🔥 ref 타입 정의
interface CommandMenuRef {
  onKeyDown: ({ event }: { event: KeyboardEvent }) => boolean;
}

// 🔥 슬래시 명령어 정의
type EditorChain = {
  focus: () => EditorChain;
  deleteRange: (range: Range) => EditorChain;
  setHeading: (opts: { level: 1 | 2 | 3 }) => EditorChain;
  setParagraph: () => EditorChain;
  toggleBulletList: () => EditorChain;
  toggleOrderedList: () => EditorChain;
  toggleList: (listType: string, itemType: string) => EditorChain;
  insertContent: (content: unknown) => EditorChain;
  setMark: (mark: string, attrs?: Record<string, unknown>) => EditorChain;
  toggleBlockquote: () => EditorChain;
  toggleCodeBlock: () => EditorChain;
  setHorizontalRule: () => EditorChain;
  run: () => boolean;
};

type EditorLike = {
  chain: () => EditorChain;
};

interface SlashCommand {
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  command: ({ editor, range }: { editor: EditorLike; range: Range }) => void;
}

// 🔥 명령어 목록 정의 (Notion 스타일)
const SLASH_COMMANDS: SlashCommand[] = [
  {
    title: '제목 1',
    description: '큰 섹션 헤딩',
    icon: Heading1,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: '제목 2',
    description: '중간 섹션 헤딩',
    icon: Heading2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: '제목 3',
    description: '작은 섹션 헤딩',
    icon: Heading3,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: '본문',
    description: '일반 텍스트로 시작',
    icon: Type,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: '불릿 리스트',
    description: '간단한 불릿 목록',
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: '번호 리스트',
    description: '번호가 매겨진 목록',
    icon: Hash,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: '체크리스트',
    description: '할 일 목록',
    icon: CheckSquare,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleList('taskList', 'taskItem').run();
    },
  },
  {
    title: '콜아웃 - 정보',
    description: '💡 정보 강조',
    icon: Lightbulb,
    command: ({ editor, range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'info', icon: '💡' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '정보를 입력하세요...' }] }],
        })
        .run();
    },
  },
  {
    title: '콜아웃 - 경고',
    description: '⚠️ 경고 메시지',
    icon: AlertTriangle,
    command: ({ editor, range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'warning', icon: '⚠️' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '경고 내용을 입력하세요...' }] }],
        })
        .run();
    },
  },
  {
    title: '콜아웃 - 에러',
    description: '❌ 에러 메시지',
    icon: X,
    command: ({ editor, range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'callout',
          attrs: { type: 'error', icon: '❌' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '에러 내용을 입력하세요...' }] }],
        })
        .run();
    },
  },
  {
    title: '토글',
    description: '▼ 접을 수 있는 섹션',
    icon: ChevronDown,
    command: ({ editor, range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent({
          type: 'toggle',
          attrs: { open: false, summary: '토글 제목' },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: '토글 내용을 입력하세요...' }] }],
        })
        .run();
    },
  },
  {
    title: '하이라이트',
    description: '🖍️ 텍스트 강조',
    icon: Highlighter,
    command: ({ editor, range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent('하이라이트할 텍스트')
        .setMark('highlight', { color: 'yellow' })
        .run();
    },
  },
  {
    title: '인용구',
    description: '인용 텍스트',
    icon: Quote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: '코드 블록',
    description: '코드 스니펫',
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: '구분선',
    description: '섹션 구분선',
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
];

// 🔥 명령어 메뉴 컴포넌트
interface CommandMenuProps {
  items: SlashCommand[];
  command: (item: SlashCommand) => void;
}

const CommandMenu = forwardRef<CommandMenuRef, CommandMenuProps>(({ items, command }, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        setSelectedIndex((selectedIndex + items.length - 1) % items.length);
        return true;
      }

      if (event.key === 'ArrowDown') {
        setSelectedIndex((selectedIndex + 1) % items.length);
        return true;
      }

      if (event.key === 'Enter') {
        selectItem(selectedIndex);
        return true;
      }

      return false;
    },
  }));

  useEffect(() => setSelectedIndex(0), [items]);

  const selectItem = (index: number): void => {
    const item = items[index];
    if (item) {
      command(item);
    }
  };

  return (
    <div className="z-50 w-72 p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-80 overflow-auto">
      {items.length ? (
        items.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-3 w-full px-3 py-2 text-left text-sm rounded-md transition-colors ${index === selectedIndex
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
              : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            onClick={() => selectItem(index)}
          >
            <div className="w-4 h-4 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <item.icon size={16} />
            </div>
            <div className="flex-1">
              <div className="font-medium">{item.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{item.description}</div>
            </div>
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">검색 결과가 없습니다</div>
      )}
    </div>
  );
});

CommandMenu.displayName = 'CommandMenu';

// 🔥 슬래시 명령어 확장
export const SlashCommand = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: Range; props: { command: (params: { editor: Editor; range: Range }) => void } }) => {
          props.command({ editor, range });
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

// 🔥 슬래시 명령어 제안 설정
export const slashSuggestion = {
  items: ({ query }: { query: string }) => {
    return SLASH_COMMANDS.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  // 🔥 슬래시 명령어 트리거 조건 개선
  char: '/',
  allowSpaces: false,              // 🔥 스페이스로 명령어 중단
  startOfLine: false,              // 🔥 줄 중간에서도 가능

  render: () => {
    let component: ReactRenderer;
    let popup: Instance[] = [];

    return {
      onStart: (props: { editor: Editor; clientRect?: () => DOMRect }) => {
        component = new ReactRenderer(CommandMenu, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
          hideOnClick: true,           // 🔥 클릭 시 숨김
          duration: [200, 150],        // 🔥 애니메이션 시간 단축
        });
      },

      onUpdate(props: { editor: Editor; clientRect?: () => DOMRect }) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        const instance = Array.isArray(popup) ? popup[0] : undefined;
        if (instance) {
          instance.setProps({
            getReferenceClientRect: props.clientRect,
          });
        }
      },

      onKeyDown(props: { event: KeyboardEvent }) {
        // 🔥 Escape 키로 메뉴 강제 종료
        if (props.event.key === 'Escape') {
          const instance = Array.isArray(popup) ? popup[0] : undefined;
          if (instance) {
            instance.hide();
            return true;
          }
        }

        // 🔥 Space 키로도 메뉴 종료
        if (props.event.key === ' ' || props.event.key === 'Space') {
          const instance = Array.isArray(popup) ? popup[0] : undefined;
          if (instance) {
            instance.hide();
            return false; // 스페이스는 일반 입력으로 처리
          }
        }

        // 🔥 Enter 키로 명령어 실행 후 메뉴 종료
        const result = (component.ref as CommandMenuRef)?.onKeyDown({ event: props.event });
        if (props.event.key === 'Enter' && result) {
          const instance = Array.isArray(popup) ? popup[0] : undefined;
          if (instance) {
            setTimeout(() => instance.hide(), 50); // 약간의 지연 후 숨김
          }
        }

        return result;
      },

      onExit() {
        const instance = Array.isArray(popup) ? popup[0] : undefined;
        if (instance) instance.destroy();
        component.destroy();
      },
    };
  },
};
