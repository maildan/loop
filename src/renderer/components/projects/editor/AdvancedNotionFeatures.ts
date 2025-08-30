// 🔥 TipTap 에디터에 추가할 노션 기능들 (기본 기능만)
// src/renderer/components/projects/editor/AdvancedNotionFeatures.ts

import { Node, Mark, mergeAttributes } from '@tiptap/core';
import type { Range } from '@tiptap/core';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';

type EditorChain = {
  focus: () => EditorChain;
  deleteRange: (range: Range) => EditorChain;
  toggleList: (listType: string, itemType: string) => EditorChain;
  toggleHeading: (opts: { level: 1 | 2 | 3 }) => EditorChain;
  toggleOrderedList: () => EditorChain;
  toggleBulletList: () => EditorChain;
  toggleBlockquote: () => EditorChain;
  toggleCodeBlock: () => EditorChain;
  toggleHighlight: () => EditorChain;
  setHighlight: (attrs: { color: string }) => EditorChain;
  setCallout: (attrs: { type: string; icon: string }) => EditorChain;
  setToggle: (attrs: { summary: string; open: boolean }) => EditorChain;
  insertContent: (content: unknown) => EditorChain;
  selectTextblockEnd: () => EditorChain;
  run: () => boolean;
};

type EditorLike = {
  chain: () => EditorChain;
};

// 🔥 1. TaskList 확장 (기본 기능만)
export const TaskList = Node.create({
  name: 'taskList',
  group: 'block list',
  content: 'taskItem+',
  parseHTML() {
    return [{ tag: 'ul[data-type="taskList"]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['ul', mergeAttributes(HTMLAttributes, { 'data-type': 'taskList', class: 'task-list' }), 0];
  },
});

// 🔥 2. TaskItem 확장 (기본 기능만)
export const TaskItem = Node.create({
  name: 'taskItem',
  content: 'paragraph block*',
  defining: true,
  
  addAttributes() {
    return {
      checked: {
        default: false,
        parseHTML: (element: HTMLElement) => element.getAttribute('data-checked') === 'true',
        renderHTML: (attributes: { checked: boolean }) => ({ 'data-checked': attributes.checked }),
      },
    };
  },
  
  parseHTML() {
    return [{ tag: 'li[data-type="taskItem"]' }];
  },
  
  renderHTML({ node, HTMLAttributes }: { node: ProseMirrorNode; HTMLAttributes: Record<string, unknown> }) {
    return [
      'li',
      mergeAttributes(HTMLAttributes, { 
        'data-type': 'taskItem',
        'data-checked': (node.attrs as { checked?: boolean }).checked,
        class: 'task-item' 
      }),
      [
        'label',
        { class: 'task-checkbox-wrapper' },
        [
          'input',
          {
            type: 'checkbox',
            checked: node.attrs.checked ? 'checked' : null,
            class: 'task-checkbox',
          },
        ],
        ['span', { class: 'task-content' }, 0],
      ],
    ];
  },
});

// 🔥 3. 콜아웃 확장 (타입 안전)
export const Callout = Node.create({
  name: 'callout',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      type: {
        default: 'info',
        renderHTML: (attributes: { type: string }) => ({
          'data-type': attributes.type,
        }),
      },
      icon: {
        default: '💡',
        renderHTML: (attributes: { icon: string }) => ({
          'data-icon': attributes.icon,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'div[data-callout]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['div', { 'data-callout': true, ...HTMLAttributes }, 0];
  },
});

// 🔥 4. 토글 확장 (타입 안전)
export const Toggle = Node.create({
  name: 'toggle',
  group: 'block',
  content: 'block+',
  addAttributes() {
    return {
      open: {
        default: false,
        renderHTML: (attributes: { open: boolean }) => ({
          'data-open': attributes.open,
        }),
      },
      summary: {
        default: '토글 제목',
        renderHTML: (attributes: { summary: string }) => ({
          'data-summary': attributes.summary,
        }),
      },
    };
  },
  parseHTML() {
    return [{ tag: 'details[data-toggle]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['details', { 'data-toggle': true, ...HTMLAttributes }, 
      ['summary', {}, HTMLAttributes['data-summary'] || '토글 제목'],
      ['div', { class: 'toggle-content' }, 0]
    ];
  },
});

// 🔥 5. 하이라이트 확장 (타입 안전)
export const Highlight = Mark.create({
  name: 'highlight',
  addAttributes() {
    return {
      color: {
        default: 'yellow',
        parseHTML: (element: HTMLElement) => element.getAttribute('data-color'),
        renderHTML: (attributes: { color: string }) => {
          if (!attributes.color) {
            return {};
          }
          return {
            'data-color': attributes.color,
          };
        },
      },
    };
  },
  parseHTML() {
    return [{ tag: 'mark[data-highlight]' }];
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, unknown> }) {
    return ['mark', { 'data-highlight': true, ...HTMLAttributes }, 0];
  },
});

// 5. 확장된 슬래시 커맨드
export const extendedSlashCommands = [
  {
    title: '체크박스',
    description: '☑️ 할 일 목록',
    icon: '☑️',
    searchTerms: ['checkbox', 'todo', 'task', '체크', '할일'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .toggleList('taskList', 'taskItem')
        .run();
    },
  },
  {
    title: '콜아웃 - 정보',
    description: '💡 정보 강조',
    icon: '💡',
    searchTerms: ['callout', 'info', '콜아웃', '정보'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'info', icon: '💡' })
        .run();
    },
  },
  {
    title: '콜아웃 - 경고',
    description: '⚠️ 경고 메시지',
    icon: '⚠️',
    searchTerms: ['warning', 'caution', '경고', '주의'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'warning', icon: '⚠️' })
        .run();
    },
  },
  {
    title: '콜아웃 - 에러',
    description: '❌ 에러 메시지',
    icon: '❌',
    searchTerms: ['error', 'danger', '에러', '오류'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setCallout({ type: 'error', icon: '❌' })
        .run();
    },
  },
  {
    title: '토글',
    description: '▼ 접을 수 있는 섹션',
    icon: '▼',
    searchTerms: ['toggle', 'collapse', '토글', '접기'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .setToggle({ summary: '토글 제목', open: false })
        .run();
    },
  },
  {
    title: '하이라이트',
    description: '🖍️ 텍스트 강조',
    icon: '🖍️',
    searchTerms: ['highlight', 'mark', '하이라이트', '강조'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent('하이라이트 텍스트')
        .selectTextblockEnd()
        .setHighlight({ color: 'yellow' })
        .run();
    },
  },
  {
    title: '수식',
    description: '🔢 LaTeX 수식',
    icon: '🔢',
    searchTerms: ['math', 'latex', 'formula', '수식', '공식'],
    command: ({ editor, range }: { editor: EditorLike; range: Range }) => {
      editor.chain()
        .focus()
        .deleteRange(range)
        .insertContent('$E = mc^2$')
        .run();
    },
  },
];

// 6. 키보드 단축키 확장
export const extendedKeyboardShortcuts = [
  {
    key: 'Mod-Shift-1',
    description: '제목 1',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    key: 'Mod-Shift-2',
    description: '제목 2',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    key: 'Mod-Shift-3',
    description: '제목 3',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    key: 'Mod-Shift-7',
    description: '번호 리스트',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    key: 'Mod-Shift-8',
    description: '불릿 리스트',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    key: 'Mod-Shift-9',
    description: '체크박스',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleList('taskList', 'taskItem').run(),
  },
  {
    key: 'Mod-Shift-.',
    description: '인용구',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    key: 'Mod-Alt-C',
    description: '코드 블록',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    key: 'Mod-Shift-H',
    description: '하이라이트',
    command: ({ editor }: { editor: EditorLike }) => editor.chain().focus().toggleHighlight().run(),
  },
];
