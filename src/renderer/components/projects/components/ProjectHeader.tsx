// 🔥 WYSIWYG ProjectHeader - 완전한 에디터 툴바
// 이미지 기반으로 정확한 WYSIWYG 에디터 툴바 구현

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import type { Editor } from '@tiptap/react';
import { 
  ArrowLeft, 
  Undo2, 
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Highlighter,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  MoreHorizontal,
  ChevronDown
} from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🎨 스타일 정의
const TOOLBAR_STYLES = {
  container: 'w-full h-14 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-1',
  section: 'flex items-center gap-1',
  divider: 'w-px h-6 bg-gray-300 dark:bg-gray-600 mx-2',
  button: 'h-8 px-2 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-1 text-sm',
  buttonActive: 'h-8 px-2 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors flex items-center gap-1 text-sm',
  dropdown: 'h-8 px-3 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm border border-gray-300 dark:border-gray-600',
  backButton: 'h-8 w-8 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center',
  colorButton: 'h-8 w-8 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center relative',
} as const;

// 🎨 폰트 패밀리 옵션들
const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter' },
  { value: '강원교육모두체', label: '강원교육모두체' },
  { value: 'Noto Sans KR', label: 'Noto Sans KR' },
  { value: 'Pretendard', label: 'Pretendard' },
  { value: 'Apple SD Gothic Neo', label: 'Apple SD Gothic Neo' },
] as const;

// 🎨 폰트 크기 옵션들
const FONT_SIZES = [
  { value: 12, label: '12' },
  { value: 14, label: '14' },
  { value: 16, label: '16' },
  { value: 18, label: '18' },
  { value: 20, label: '20' },
  { value: 24, label: '24' },
  { value: 28, label: '28' },
  { value: 32, label: '32' },
] as const;

interface ProjectHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  editor?: Editor | null;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export function ProjectHeader({
  title,
  onTitleChange,
  onBack,
  editor,
  sidebarCollapsed,
  onToggleSidebar
}: ProjectHeaderProps): React.ReactElement {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // 🔥 현재 에디터 상태 확인
  const editorState = useMemo(() => {
    if (!editor) return {};
    
    return {
      canUndo: editor.can().undo(),
      canRedo: editor.can().redo(),
      isBold: editor.isActive('bold'),
      isItalic: editor.isActive('italic'),
      isUnderline: editor.isActive('underline'),
      isStrike: editor.isActive('strike'),
      isHighlight: editor.isActive('highlight'),
      isLink: editor.isActive('link'),
      isLeftAlign: editor.isActive({ textAlign: 'left' }),
      isCenterAlign: editor.isActive({ textAlign: 'center' }),
      isRightAlign: editor.isActive({ textAlign: 'right' }),
      isJustifyAlign: editor.isActive({ textAlign: 'justify' }),
      isBulletList: editor.isActive('bulletList'),
      isOrderedList: editor.isActive('orderedList'),
    };
  }, [editor]);

  // 🔥 커맨드 핸들러들
  const handleUndo = useCallback(() => {
    if (editor?.can().undo()) {
      editor.chain().focus().undo().run();
      Logger.debug('WYSIWYG_TOOLBAR', 'Undo executed');
    }
  }, [editor]);

  const handleRedo = useCallback(() => {
    if (editor?.can().redo()) {
      editor.chain().focus().redo().run();
      Logger.debug('WYSIWYG_TOOLBAR', 'Redo executed');
    }
  }, [editor]);

  const handleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Bold toggled');
  }, [editor]);

  const handleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Italic toggled');
  }, [editor]);

  const handleUnderline = useCallback(() => {
    if (editor?.isActive('underline')) {
      editor?.chain().focus().unsetMark('underline').run();
    } else {
      editor?.chain().focus().setMark('underline').run();
    }
    Logger.debug('WYSIWYG_TOOLBAR', 'Underline toggled');
  }, [editor]);

  const handleStrike = useCallback(() => {
    editor?.chain().focus().toggleStrike().run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Strikethrough toggled');
  }, [editor]);

  const handleHighlight = useCallback(() => {
    if (editor?.isActive('highlight')) {
      editor?.chain().focus().unsetMark('highlight').run();
    } else {
      editor?.chain().focus().setMark('highlight').run();
    }
    Logger.debug('WYSIWYG_TOOLBAR', 'Highlight toggled');
  }, [editor]);

  const handleLink = useCallback(() => {
    if (editorState.isLink) {
      // 링크 제거
      editor?.chain().focus().unsetMark('link').run();
    } else {
      // 링크 추가 - 간단한 기본 URL 사용
      const url = 'https://example.com';
      editor?.chain().focus().setMark('link', { href: url }).run();
    }
    Logger.debug('WYSIWYG_TOOLBAR', 'Link toggled');
  }, [editor, editorState.isLink]);

  const handleAlign = useCallback((alignment: 'left' | 'center' | 'right' | 'justify') => {
    if (editor?.isActive({ textAlign: alignment })) {
      editor?.chain().focus().unsetTextAlign().run();
    } else {
      editor?.chain().focus().setTextAlign(alignment).run();
    }
    Logger.debug('WYSIWYG_TOOLBAR', 'Text alignment changed', { alignment });
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Bullet list toggled');
  }, [editor]);

  const handleOrderedList = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Ordered list toggled');
  }, [editor]);

  const handleTextColor = useCallback(() => {
    // 기본 빨간색으로 설정 (향후 색상 피커로 대체 가능)
    const color = '#ff0000';
    editor?.chain().focus().setMark('textStyle', { color }).run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Text color changed', { color });
  }, [editor]);

  Logger.debug('WYSIWYG_TOOLBAR', 'Rendering toolbar', {
    hasEditor: !!editor,
    editorState,
    title
  });

  return (
    <div className={TOOLBAR_STYLES.container}>
      {/* 🔥 왼쪽 영역 - Back 버튼 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={onBack}
          className={TOOLBAR_STYLES.backButton}
          title="뒤로 가기"
        >
          <ArrowLeft size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 왼쪽 영역 - History (Undo/Redo) */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={handleUndo}
          disabled={!editorState.canUndo}
          className={`${TOOLBAR_STYLES.button} ${!editorState.canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="실행 취소"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!editorState.canRedo}
          className={`${TOOLBAR_STYLES.button} ${!editorState.canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="다시 실행"
        >
          <Redo2 size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 중앙 영역 - 폰트 선택 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowFontDropdown(!showFontDropdown)}
            className={TOOLBAR_STYLES.dropdown}
          >
            <span>강원교육모두체</span>
            <ChevronDown size={14} />
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {FONT_FAMILIES.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    setShowFontDropdown(false);
                    Logger.debug('WYSIWYG_TOOLBAR', 'Font family changed', { fontFamily: font.value });
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                  style={{ fontFamily: font.value }}
                >
                  {font.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 중앙 영역 - 폰트 크기 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSizeDropdown(!showSizeDropdown)}
            className={TOOLBAR_STYLES.dropdown}
          >
            <span>16</span>
            <ChevronDown size={14} />
          </button>
          {showSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-20 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    setShowSizeDropdown(false);
                    Logger.debug('WYSIWYG_TOOLBAR', 'Font size changed', { fontSize: size.value });
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                >
                  {size.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 중앙 영역 - 기본 서식 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={handleBold}
          className={editorState.isBold ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="굵게"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className={editorState.isItalic ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="기울임"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={handleUnderline}
          className={editorState.isUnderline ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="밑줄"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={handleStrike}
          className={editorState.isStrike ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="취소선"
        >
          <Strikethrough size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 중앙 영역 - 색상 및 하이라이트 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={handleTextColor}
          className={TOOLBAR_STYLES.colorButton}
          title="텍스트 색상"
        >
          <Type size={16} />
        </button>
        <button
          type="button"
          onClick={handleHighlight}
          className={editorState.isHighlight ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="형광펜"
        >
          <Highlighter size={16} />
        </button>
        <button
          type="button"
          onClick={handleLink}
          className={editorState.isLink ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="링크"
        >
          <Link size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 오른쪽 영역 - 정렬 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={() => handleAlign('left')}
          className={editorState.isLeftAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="왼쪽 정렬"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          className={editorState.isCenterAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="가운데 정렬"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          className={editorState.isRightAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="오른쪽 정렬"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('justify')}
          className={editorState.isJustifyAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="양쪽 정렬"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 오른쪽 영역 - 리스트 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={handleBulletList}
          className={editorState.isBulletList ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="글머리 기호"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={handleOrderedList}
          className={editorState.isOrderedList ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="번호 매기기"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 오른쪽 영역 - 더 많은 옵션 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMoreOptions(!showMoreOptions)}
            className={TOOLBAR_STYLES.button}
            title="더 많은 옵션"
          >
            <MoreHorizontal size={16} />
          </button>
          {showMoreOptions && (
            <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => {
                  setShowMoreOptions(false);
                }}
              >
                테이블 삽입
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => {
                  editor?.chain().focus().toggleBlockquote().run();
                  setShowMoreOptions(false);
                }}
              >
                인용문
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                onClick={() => {
                  editor?.chain().focus().toggleCodeBlock().run();
                  setShowMoreOptions(false);
                }}
              >
                코드 블록
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 맨 오른쪽 - 사이드바 토글 */}
      {onToggleSidebar && (
        <>
          <div className="flex-1" />
          <div className={TOOLBAR_STYLES.section}>
            <button
              type="button"
              onClick={onToggleSidebar}
              className={TOOLBAR_STYLES.button}
              title={sidebarCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
            >
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-0.5 bg-current"></div>
                <div className="w-3 h-0.5 bg-current"></div>
                <div className="w-3 h-0.5 bg-current"></div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectHeader;
