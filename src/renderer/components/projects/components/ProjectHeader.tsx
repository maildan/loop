// 🔥 WYSIWYG ProjectHeader - 완전한 에디터 툴바
// 이미지 기반으로 정확한 WYSIWYG 에디터 툴바 구현

'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  ChevronDown,
  PanelRightOpen,
  PanelRightClose
} from 'lucide-react';
import { RendererLogger as Logger } from '../../../../shared/logger-renderer';
import { useSettings } from '../../../app/settings/hooks/useSettings';
import { useDynamicFont } from '../../../hooks/useDynamicFont';

// 🔥 Symbol 기반 컴포넌트 이름
const PROJECT_HEADER = Symbol.for('PROJECT_HEADER');

// 🎨 스타일 정의
const TOOLBAR_STYLES = {
  container: 'w-full h-14 bg-[var(--toolbar-bg)] border-b border-[color:var(--toolbar-border)] flex flex-wrap items-center px-3 gap-2 gap-y-2 text-[color:var(--toolbar-foreground)] text-xs md:text-sm overflow-visible !leading-none [&_[title]]:delay-100',
  section: 'flex items-center gap-1.5 shrink-0 !leading-none',
  divider: 'w-px h-6 bg-[color:var(--toolbar-divider)] opacity-70 mx-2',
  button: 'h-8 px-2.5 rounded-md text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)] transition-colors flex items-center gap-1 text-xs font-medium !leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  buttonActive: 'h-8 px-2.5 rounded-md bg-[var(--button-active)] text-[color:var(--editor-accent)] hover:bg-[var(--button-active)] transition-colors flex items-center gap-1 text-xs font-semibold !leading-none shadow-inner focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  dropdown: 'h-8 px-3 min-w-[11rem] rounded-md text-[color:var(--toolbar-foreground)] hover:bg-[var(--toolbar-hover-bg)] transition-colors flex items-center justify-between gap-1.5 text-xs font-medium border border-[color:var(--toolbar-border)] bg-[var(--toolbar-bg)]/80 backdrop-blur-sm whitespace-nowrap shadow-sm !leading-none',
  backButton: 'h-8 w-8 rounded-md text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)] transition-colors flex items-center justify-center !leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  colorButton: 'h-8 w-8 rounded-md text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] transition-colors flex items-center justify-center relative !leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
} as const;

// 🎨 사용자 정의 폰트 크기 입력 범위
const FONT_SIZE_RANGE = {
  min: 8,
  max: 72,
  step: 0.1,
  default: 16
} as const;

// 🎨 사용자 정의 줄간격 입력 범위  
const LINE_HEIGHT_RANGE = {
  min: 0.0,
  max: 5.0,
  step: 0.1,
  default: 1.5
} as const;

const FONT_SCOPE_OPTIONS = [
  {
    value: 'document' as const,
    label: '전체',
    description: '문서 전체에 폰트를 적용합니다.'
  },
  {
    value: 'selection' as const,
    label: '선택',
    description: '선택한 텍스트에만 폰트를 적용합니다.'
  }
] as const;

interface ProjectHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  onBack: () => void;
  editor?: Editor | null;
  sidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const ProjectHeader = React.memo(function ProjectHeader({
  title,
  onTitleChange,
  onBack,
  editor,
  sidebarCollapsed,
  onToggleSidebar
}: ProjectHeaderProps): React.ReactElement {
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showSizeDropdown, setShowSizeDropdown] = useState(false);
  const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);
  
  // 🔥 커스텀 폰트 크기 및 줄간격 입력
  const [customFontSize, setCustomFontSize] = useState<number>(FONT_SIZE_RANGE.default);
  const [customLineHeight, setCustomLineHeight] = useState<number>(LINE_HEIGHT_RANGE.default);
  const [selectionScopedFont, setSelectionScopedFont] = useState<string | null>(null);

  // 🔥 폰트 시스템 연동 (shared hook)
  const {
    availableFonts,
    currentFont: appFont,
    editorFont,
    setEditorFont,
    editorFontScope,
    setEditorFontScope,
    loading: fontsLoading,
    error: fontError
  } = useDynamicFont();

  const previousScopeRef = useRef(editorFontScope);

  const activeFont = useMemo(() => {
    if (editorFontScope === 'selection') {
      return selectionScopedFont ?? editorFont ?? appFont;
    }

    return editorFont ?? appFont;
  }, [appFont, editorFont, editorFontScope, selectionScopedFont]);

  useEffect(() => {
    if (editorFontScope === 'document') {
      setSelectionScopedFont(null);
    }
  }, [editorFontScope]);

  const handleToggleFontDropdown = useCallback(() => {
    setShowFontDropdown((prev) => {
      const next = !prev;
      if (next) {
        setShowSizeDropdown(false);
        setShowLineHeightDropdown(false);
      }
      return next;
    });
  }, []);

  const handleToggleSizeDropdown = useCallback(() => {
    setShowSizeDropdown((prev) => {
      const next = !prev;
      if (next) {
        setShowFontDropdown(false);
        setShowLineHeightDropdown(false);
      }
      return next;
    });
  }, []);

  const handleToggleLineHeightDropdown = useCallback(() => {
    setShowLineHeightDropdown((prev) => {
      const next = !prev;
      if (next) {
        setShowFontDropdown(false);
        setShowSizeDropdown(false);
      }
      return next;
    });
  }, []);

  const clearDocumentFontMarks = useCallback(() => {
    if (!editor) {
      return;
    }

    const { from, to } = editor.state.selection;
    const wasFocused = editor.isFocused;

    editor.chain().focus().selectAll().unsetFontFamily().run();

    if (wasFocused) {
      editor.chain().focus().setTextSelection({ from, to }).run();
    } else {
      editor.chain().setTextSelection({ from, to }).run();
      editor.view.dom.blur();
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) {
      previousScopeRef.current = editorFontScope;
      return;
    }

    if (editorFontScope === 'document' && previousScopeRef.current === 'selection') {
      clearDocumentFontMarks();
    }

    previousScopeRef.current = editorFontScope;
  }, [clearDocumentFontMarks, editor, editorFontScope]);
  
  // 🔥 설정 시스템 연동 (optional)
  const settingsResult = useSettings();
  const settings = settingsResult?.settings;


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
    const rootStyles = getComputedStyle(document.documentElement);
    const accentValue = rootStyles.getPropertyValue('--accent-primary').trim();
    const color = accentValue || `hsl(${rootStyles.getPropertyValue('--primary')})`;

    editor?.chain().focus().setMark('textStyle', { color }).run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Text color changed', { color });
  }, [editor]);

  const getSimplifiedFontName = useCallback((fontFamily: string | undefined | null): string => {
    if (!fontFamily || fontFamily.trim().length === 0) {
      return 'System';
    }

    const firstFont = fontFamily.split(',')[0]?.trim() ?? '';
    const cleaned = firstFont.replace(/['"]/g, '');

    const fontMap: Record<string, string> = {
      '-apple-system': 'System',
      'blinkmacsystemfont': 'System',
      'system-ui': 'System',
      'sans-serif': 'Sans',
      'serif': 'Serif',
      'monospace': 'Mono',
      'gangwon_mac': 'Gangwon',
      'gangwon_win': 'Gangwon',
      'calibri-font-family': 'Calibri',
      'nanum-gothic': 'Nanum Gothic',
      'nanum gothic': 'Nanum Gothic',
      'sf-pro-display': 'SF Pro',
      'times-new-roman': 'Times'
    };

    const lookupKey = cleaned.toLowerCase();
    return fontMap[lookupKey] ?? cleaned;
  }, []);

  const handleFontFamily = useCallback(async (fontFamily: string) => {
    Logger.info('ProjectHeader', 'Font family change requested', { fontFamily, scope: editorFontScope });

    if (editorFontScope === 'document') {
      setEditorFont(fontFamily);
      setSelectionScopedFont(null);
      clearDocumentFontMarks();
    } else {
      setSelectionScopedFont(fontFamily);
    }

    if (!editor) {
      Logger.warn(PROJECT_HEADER, 'No editor available for font family change');
      return;
    }

    try {
      // 🔍 디버깅: 에디터 확장 및 명령어 확인
      Logger.debug(PROJECT_HEADER, 'Editor extensions', {
        extensions: editor.extensionManager.extensions.map(ext => ext.name),
        commands: Object.keys(editor.commands),
        hasFontFamily: !!editor.commands.setFontFamily
      });
      
      // 🎨 TipTap setFontFamily 명령어 - 선택 영역일 때만 인라인 적용
      const shouldApplyInline = editorFontScope === 'selection';
      if (shouldApplyInline && editor.commands.setFontFamily) {
        Logger.debug(PROJECT_HEADER, 'Applying fontFamily via TipTap setFontFamily command', { fontFamily });
        const success = editor.commands.setFontFamily(fontFamily);
        Logger.debug(PROJECT_HEADER, 'setFontFamily result', { success });

        if (success) {
          Logger.info(PROJECT_HEADER, 'Font family applied successfully via TipTap command', { fontFamily });
          editor.commands.removeEmptyTextStyle();

          setTimeout(() => {
            Logger.debug(PROJECT_HEADER, 'Editor HTML after font change', { 
              html: editor.getHTML().substring(0, 200) + '...' 
            });
          }, 100);

          Logger.info(PROJECT_HEADER, 'Font family change completed', {
            fontFamily,
            simplifiedName: getSimplifiedFontName(fontFamily),
            success: true
          });
        } else {
          Logger.warn(PROJECT_HEADER, 'TipTap setFontFamily command failed', { fontFamily });
        }
      } else if (shouldApplyInline && !editor.commands.setFontFamily) {
        Logger.error(PROJECT_HEADER, 'setFontFamily command not available - FontFamily extension may not be loaded');
      }
    } catch (error) {
      Logger.error(PROJECT_HEADER, 'Font family change failed', {
        error: String(error),
        fontFamily
      });
    }
  }, [clearDocumentFontMarks, editor, editorFontScope, getSimplifiedFontName, setEditorFont]);

  const handleFontSize = useCallback((fontSize: number) => {
    if (!editor) {
      Logger.warn('ProjectHeader', 'No editor available for font size change');
      return;
    }

    const fontSizeValue = `${fontSize}px`;

    try {
      const didApply = typeof editor.commands.setFontSize === 'function'
        ? editor.commands.setFontSize(fontSizeValue)
        : editor.chain().focus().setMark('textStyle', { fontSize: fontSizeValue }).run();

      if (didApply) {
        Logger.info('ProjectHeader', 'Font size applied', { fontSize: fontSizeValue });
        editor.commands.removeEmptyTextStyle?.();
      } else {
        Logger.warn('ProjectHeader', 'Font size command did not execute', { fontSize: fontSizeValue });
      }
    } catch (error) {
      Logger.error('ProjectHeader', 'Font size change failed', {
        error: String(error),
        fontSize: fontSizeValue
      });
    }
  }, [editor]);

  const handleLineHeight = useCallback((lineHeight: number) => {
    if (!editor) {
      Logger.warn('ProjectHeader', 'No editor available for line height change');
      return;
    }

    const normalized = Number.isFinite(lineHeight) ? lineHeight : LINE_HEIGHT_RANGE.default;

    try {
      const setLineHeightCommand = (editor.commands as Record<string, unknown>).setLineHeight as
        | ((value: number) => boolean)
        | undefined;

      const didApply = typeof setLineHeightCommand === 'function'
        ? setLineHeightCommand(normalized)
        : editor.chain().focus().setMark('textStyle', { lineHeight: normalized }).run();

      if (didApply) {
        Logger.info('ProjectHeader', 'Line height applied', { lineHeight: normalized });
        editor.commands.removeEmptyTextStyle?.();
      } else {
        Logger.warn('ProjectHeader', 'Line height command did not execute', { lineHeight: normalized });
      }
    } catch (error) {
      Logger.error('ProjectHeader', 'Line height change failed', {
        error: String(error),
        lineHeight: normalized
      });
    }
  }, [editor]);

  // 🔥 폰트 설정 함수 (핸들러 함수들 뒤에 정의)
  const setFont = useCallback((fontFamily: string) => {
    handleFontFamily(fontFamily).catch(error => {
      Logger.error('ProjectHeader', 'Font family handler rejected', {
        fontFamily,
        error: String(error)
      });
    });
  }, [handleFontFamily]);

  Logger.debug('WYSIWYG_TOOLBAR', 'Rendering toolbar', {
    hasEditor: !!editor,
    editorState,
    title
  });

  return (
  <div className={TOOLBAR_STYLES.container} style={{ boxShadow: 'var(--toolbar-shadow)' }}>
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
          title="실행 취소 (⌘Z)"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={handleRedo}
          disabled={!editorState.canRedo}
          className={`${TOOLBAR_STYLES.button} ${!editorState.canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
          title="다시 실행 (⇧⌘Z)"
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
            onClick={handleToggleFontDropdown}
            className={TOOLBAR_STYLES.dropdown}
            title="폰트 선택"
          >
            <span>
              {fontsLoading ? '폰트 불러오는 중…' : getSimplifiedFontName(activeFont) || 'Pretendard'}
            </span>
            <ChevronDown size={14} />
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 w-44 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-[1600] max-h-60 overflow-y-auto text-[color:var(--editor-text)]">
              {fontsLoading ? (
                <div className="px-3 py-2 text-xs text-[color:var(--editor-text-muted)]">
                  폰트를 불러오는 중이에요…
                </div>
              ) : fontError ? (
                <div className="px-3 py-2 text-xs text-red-400">
                  {fontError}
                </div>
              ) : availableFonts.length > 0 ? (
                <>
                  {availableFonts.map((font) => {
                    const isActive = font.value === activeFont;

                    return (
                      <button
                        key={`${font.value}-${font.source}`}
                        type="button"
                        onClick={() => {
                          setShowFontDropdown(false);
                          setFont(font.value);
                        }}
                        className={`w-full px-3 py-2 text-left text-xs transition-colors rounded-sm ${
                          isActive ? 'bg-[var(--editor-accent-light)] text-[color:var(--editor-accent)]' : 'hover:bg-[var(--editor-accent-light)]'
                        }`}
                        style={{ fontFamily: font.value }}
                      >
                        <div className="flex items-center justify-between">
                          <span>{font.label}</span>
                          {font.source === 'system' && (
                            <span className="text-[10px] text-[color:var(--editor-text-muted)] opacity-60">
                              시스템
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </>
              ) : (
                <div className="px-3 py-2 text-xs text-[color:var(--editor-text-muted)]">
                  사용할 수 있는 폰트가 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 🔥 폰트 적용 범위 토글 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="flex items-center h-8 rounded-md border border-[color:var(--toolbar-border)] bg-[var(--toolbar-bg)]/90 backdrop-blur-sm shadow-sm overflow-hidden">
          {FONT_SCOPE_OPTIONS.map((option, index) => {
            const isActive = editorFontScope === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setEditorFontScope(option.value)}
                className={`h-full px-3 text-xs font-medium transition-all duration-150 flex items-center justify-center ${
                  isActive
                    ? 'bg-[var(--editor-accent)] text-white shadow-inner'
                    : 'text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)]'
                } ${index > 0 ? 'border-l border-[color:var(--toolbar-border)]/70' : ''}`}
                title={`${option.label} — ${option.description}`}
                aria-pressed={isActive}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 🔥 중앙 영역 - 폰트 크기 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleSizeDropdown}
            className={TOOLBAR_STYLES.dropdown}
            title="폰트 크기"
          >
            <span>{customFontSize}</span>
            <ChevronDown size={14} />
          </button>
          {showSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-[1600] p-3 text-[color:var(--editor-text)]">
              <div className="mb-2">
                <label className="block text-xs text-[color:var(--editor-text-muted)] mb-1">
                  크기 ({FONT_SIZE_RANGE.min}-{FONT_SIZE_RANGE.max}px)
                </label>
                <input
                  type="number"
                  min={FONT_SIZE_RANGE.min}
                  max={FONT_SIZE_RANGE.max}
                  step={FONT_SIZE_RANGE.step}
                  value={customFontSize}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setCustomFontSize(value);
                      handleFontSize(value);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-[color:var(--editor-border)] rounded bg-[var(--editor-bg-secondary)] text-[color:var(--editor-text)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[12, 14, 16, 18, 20, 24].map((size) => {
                  const isPresetActive = Math.abs(customFontSize - size) < 0.001;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setCustomFontSize(size);
                        handleFontSize(size);
                        setShowSizeDropdown(false);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isPresetActive
                          ? 'bg-[var(--button-active)] text-[color:var(--editor-accent)] shadow-inner'
                          : 'hover:bg-[var(--editor-accent-light)]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 🔥 중앙 영역 - 줄간격 */}
      <div className={TOOLBAR_STYLES.section}>
        <div className="relative">
          <button
            type="button"
            onClick={handleToggleLineHeightDropdown}
            className={TOOLBAR_STYLES.dropdown}
            title="줄간격"
          >
            <span>{customLineHeight}</span>
            <ChevronDown size={14} />
          </button>
          {showLineHeightDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-[1600] p-3 text-[color:var(--editor-text)]">
              <div className="mb-2">
                <label className="block text-xs text-[color:var(--editor-text-muted)] mb-1">
                  줄간격 ({LINE_HEIGHT_RANGE.min}-{LINE_HEIGHT_RANGE.max})
                </label>
                <input
                  type="number"
                  min={LINE_HEIGHT_RANGE.min}
                  max={LINE_HEIGHT_RANGE.max}
                  step={LINE_HEIGHT_RANGE.step}
                  value={customLineHeight}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    if (!isNaN(value)) {
                      setCustomLineHeight(value);
                      handleLineHeight(value);
                    }
                  }}
                  className="w-full px-2 py-1 text-sm border border-[color:var(--editor-border)] rounded bg-[var(--editor-bg-secondary)] text-[color:var(--editor-text)]"
                />
              </div>
              <div className="grid grid-cols-2 gap-1">
                {[1.0, 1.2, 1.5, 1.8, 2.0, 2.5].map((height) => {
                  const isPresetActive = Math.abs(customLineHeight - height) < 0.001;
                  return (
                    <button
                      key={height}
                      type="button"
                      onClick={() => {
                        setCustomLineHeight(height);
                        handleLineHeight(height);
                        setShowLineHeightDropdown(false);
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        isPresetActive
                          ? 'bg-[var(--button-active)] text-[color:var(--editor-accent)] shadow-inner'
                          : 'hover:bg-[var(--editor-accent-light)]'
                      }`}
                    >
                      {height}
                    </button>
                  );
                })}
              </div>
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
          title="굵게 (⌘B)"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={handleItalic}
          className={editorState.isItalic ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="기울임 (⌘I)"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={handleUnderline}
          className={editorState.isUnderline ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="밑줄 (⌘U)"
        >
          <Underline size={16} />
        </button>
        <button
          type="button"
          onClick={handleStrike}
          className={editorState.isStrike ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="취소선 (⇧⌘X)"
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
          title="텍스트 색상 (⌘K)"
        >
          <Type size={16} />
        </button>
        <button
          type="button"
          onClick={handleHighlight}
          className={editorState.isHighlight ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="형광펜 (⇧⌘H)"
        >
          <Highlighter size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 오른쪽 영역 - 정렬 */}
      <div className={TOOLBAR_STYLES.section}>
        <button
          type="button"
          onClick={() => handleAlign('left')}
          className={editorState.isLeftAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="왼쪽 정렬 (⇧⌘L)"
        >
          <AlignLeft size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('center')}
          className={editorState.isCenterAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="가운데 정렬 (⇧⌘E)"
        >
          <AlignCenter size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('right')}
          className={editorState.isRightAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="오른쪽 정렬 (⇧⌘R)"
        >
          <AlignRight size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleAlign('justify')}
          className={editorState.isJustifyAlign ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="양쪽 정렬 (⇧⌘J)"
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
          title="글머리 기호 (⇧⌘8)"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={handleOrderedList}
          className={editorState.isOrderedList ? TOOLBAR_STYLES.buttonActive : TOOLBAR_STYLES.button}
          title="번호 매기기 (⇧⌘7)"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      <div className={TOOLBAR_STYLES.divider} />

      {/* 🔥 맨 오른쪽 - 사이드바 토글 */}
      {onToggleSidebar && (
        <>
          <div className="flex-1" />
          <div className={TOOLBAR_STYLES.section}>
            <button
              type="button"
              onClick={onToggleSidebar}
              className={TOOLBAR_STYLES.button}
              title={
                settings?.ui.sidebarCollapsed || sidebarCollapsed 
                  ? '사이드바 펼치기' 
                  : '사이드바 접기'
              }
            >
              {settings?.ui.sidebarCollapsed || sidebarCollapsed ? (
                <PanelRightOpen size={16} />
              ) : (
                <PanelRightClose size={16} />
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default ProjectHeader;
