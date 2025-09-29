// 🔥 WYSIWYG ProjectHeader - 완전한 에디터 툴바
// 이미지 기반으로 정확한 WYSIWYG 에디터 툴바 구현

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { useSettings } from '../../../app/settings/hooks/useSettings';

// 🎨 스타일 정의
const TOOLBAR_STYLES = {
  container: 'w-full h-14 bg-[var(--toolbar-bg)] border-b border-[color:var(--toolbar-border)] flex items-center px-4 gap-1 text-[color:var(--toolbar-foreground)]',
  section: 'flex items-center gap-1',
  divider: 'w-px h-6 bg-[color:var(--toolbar-divider)] opacity-70 mx-2',
  button: 'h-8 px-2 rounded text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)] transition-colors flex items-center gap-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  buttonActive: 'h-8 px-2 rounded bg-[var(--button-active)] text-[color:var(--editor-accent)] hover:bg-[var(--button-active)] transition-colors flex items-center gap-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  dropdown: 'h-8 px-3 rounded text-[color:var(--toolbar-foreground)] hover:bg-[var(--toolbar-hover-bg)] transition-colors flex items-center gap-2 text-sm border border-[color:var(--toolbar-border)] bg-[var(--toolbar-bg)] shadow-sm',
  backButton: 'h-8 w-8 rounded text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] hover:text-[color:var(--toolbar-foreground)] transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
  colorButton: 'h-8 w-8 rounded text-[color:var(--toolbar-muted)] hover:bg-[var(--toolbar-hover-bg)] transition-colors flex items-center justify-center relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--editor-accent)]/30 focus-visible:ring-offset-0',
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
  const [showLineHeightDropdown, setShowLineHeightDropdown] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  
  // 🔥 커스텀 폰트 크기 및 줄간격 입력
  const [customFontSize, setCustomFontSize] = useState<number>(FONT_SIZE_RANGE.default);
  const [customLineHeight, setCustomLineHeight] = useState<number>(LINE_HEIGHT_RANGE.default);

  // 🔥 폰트 시스템 연동 (safe)
  const [availableFonts, setAvailableFonts] = useState<any[]>([]);
  const [currentFont, setCurrentFont] = useState<string>('Pretendard');
  
  // 🔥 설정 시스템 연동 (optional)
  const settingsResult = useSettings();
  const settings = settingsResult?.settings;

  // 🔥 폰트 목록 로딩 (실제 .otf 파일들)
  useEffect(() => {
    const loadFonts = async () => {
      try {
        Logger.debug('ProjectHeader', 'Starting font loading process');
        
        // IPC를 통해 실제 폰트 목록 가져오기
        if (window.electronAPI?.font?.getAvailableFonts) {
          Logger.debug('ProjectHeader', 'IPC font API available, loading fonts');
          const fonts = await window.electronAPI.font.getAvailableFonts();
          Logger.info('ProjectHeader', 'Fonts loaded from IPC', { 
            count: fonts?.length || 0,
            fonts: fonts?.map(f => f.label) || []
          });
          
          if (fonts && fonts.length > 0) {
            setAvailableFonts(fonts);
            Logger.info('ProjectHeader', 'Set available fonts from IPC', { count: fonts.length });
            return;
          }
        } else {
          Logger.warn('ProjectHeader', 'IPC font API not available');
        }
        
        // Fallback: 기본 폰트 목록 설정
        Logger.info('ProjectHeader', 'Using fallback fonts');
        const defaultFonts = [
          { id: 'gangwon', name: '강원교육모두체', cssFamily: '강원교육모두체, Gangwon' },
          { id: 'pretendard', name: 'Pretendard', cssFamily: 'Pretendard' },
          { id: 'noto-sans-kr', name: 'Noto Sans KR', cssFamily: 'Noto Sans KR' },
          { id: 'malgun-gothic', name: '맑은 고딕', cssFamily: 'Malgun Gothic' },
          { id: 'nanumgothic', name: '나눔고딕', cssFamily: 'NanumGothic' },
          { id: 'sf-pro-display', name: 'SF Pro Display', cssFamily: 'SF Pro Display' },
        ];
        setAvailableFonts(defaultFonts);
        Logger.info('ProjectHeader', 'Set fallback fonts', { count: defaultFonts.length });
      } catch (error) {
        Logger.error('ProjectHeader', 'Failed to load fonts', error);
        // 에러 시 최소한의 기본 폰트
        const errorFallbackFonts = [
          { id: 'gangwon', name: '강원교육모두체', cssFamily: '강원교육모두체' },
          { id: 'pretendard', name: 'Pretendard', cssFamily: 'Pretendard' }
        ];
        setAvailableFonts(errorFallbackFonts);
        Logger.info('ProjectHeader', 'Set error fallback fonts', { count: errorFallbackFonts.length });
      }
    };

    loadFonts();
  }, []);

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
    const rootStyles = getComputedStyle(document.documentElement);
    const accentValue = rootStyles.getPropertyValue('--accent-primary').trim();
    const color = accentValue || `hsl(${rootStyles.getPropertyValue('--primary')})`;

    editor?.chain().focus().setMark('textStyle', { color }).run();
    Logger.debug('WYSIWYG_TOOLBAR', 'Text color changed', { color });
  }, [editor]);

  const handleFontFamily = useCallback(async (fontFamily: string) => {
    Logger.info('ProjectHeader', 'Font family change requested', { fontFamily });
    
    if (!editor) {
      Logger.warn('ProjectHeader', 'No editor available for font family change');
      return;
    }

    try {
      // 🔍 디버깅: 에디터 확장 및 명령어 확인
      console.log('🔍 Editor extensions:', editor.extensionManager.extensions.map(ext => ext.name));
      console.log('🔍 Available commands:', Object.keys(editor.commands));
      console.log('🔍 FontFamily command available:', !!editor.commands.setFontFamily);
      
      // 🎨 1. 전역 CSS 변수 업데이트 (즉시 적용)
      document.documentElement.style.setProperty('--app-font-family', fontFamily);
      Logger.info('ProjectHeader', 'CSS 변수 업데이트 완료', { fontFamily });
      
      // 🎨 2. TipTap setFontFamily 명령어도 실행 (선택된 텍스트용)
      Logger.debug('ProjectHeader', 'Applying fontFamily via TipTap setFontFamily command', { fontFamily });
      
      if (editor.commands.setFontFamily) {
        const success = editor.commands.setFontFamily(fontFamily);
        console.log('🎨 setFontFamily result:', success);
        
        if (success) {
          Logger.info('ProjectHeader', 'Font family applied successfully via TipTap command', { fontFamily });
          
          // 🧹 빈 TextStyle span 정리 (TipTap 공식 명령어)
          editor.commands.removeEmptyTextStyle();
          
          // 💾 현재 폰트 상태 저장 (간소화된 이름으로)
          setCurrentFont(getSimplifiedFontName(fontFamily));
          
          // 🔍 디버깅: HTML 결과 확인
          setTimeout(() => {
            console.log('🔍 Editor HTML after font change:', editor.getHTML());
          }, 100);
          
          Logger.info('ProjectHeader', 'Font family change completed', { 
            fontFamily,
            simplifiedName: getSimplifiedFontName(fontFamily),
            success: true 
          });
        } else {
          Logger.warn('ProjectHeader', 'TipTap setFontFamily command failed', { fontFamily });
        }
      } else {
        Logger.error('ProjectHeader', 'setFontFamily command not available - FontFamily extension may not be loaded');
        console.error('❌ FontFamily extension not properly loaded!');
      }
      
    } catch (error) {
      Logger.error('ProjectHeader', 'Font family change failed', { 
        error: String(error), 
        fontFamily 
      });
    }
  }, [editor]);

  const handleFontSize = useCallback((fontSize: number) => {
    if (!editor) {
      Logger.warn('ProjectHeader', 'No editor available for font size change');
      return;
    }

    try {
      // 🔥 TipTap 공식 setFontSize 명령어 사용
      const fontSizeValue = `${fontSize}px`;
      const success = editor.commands.setFontSize(fontSizeValue);
      
      if (success) {
        Logger.info('ProjectHeader', 'Font size applied successfully via TipTap command', { 
          fontSize: fontSizeValue 
        });
        
        // 🧹 빈 TextStyle span 정리
        editor.commands.removeEmptyTextStyle();
        
        // 💾 커스텀 폰트 크기 상태 저장
        setCustomFontSize(fontSize);
        
      } else {
        Logger.warn('ProjectHeader', 'TipTap setFontSize command failed', { fontSize: fontSizeValue });
      }
      
    } catch (error) {
      Logger.error('ProjectHeader', 'Font size change failed', { 
        error: String(error), 
        fontSize 
      });
    }
  }, [editor]);

  const handleLineHeight = useCallback((lineHeight: number) => {
    if (editor) {
      // 🔥 선택된 텍스트에 줄간격 적용
      editor.chain().focus().setMark('textStyle', { lineHeight: lineHeight.toString() }).run();
      
      // 🔥 에디터 전체에도 CSS로 적용 (fallback)
      const editorElement = editor.view.dom as HTMLElement;
      if (editorElement) {
        editorElement.style.lineHeight = lineHeight.toString();
      }
      
      Logger.debug('WYSIWYG_TOOLBAR', 'Line height changed', { lineHeight });
    }
  }, [editor]);

  // 🔥 폰트 이름 간소화 함수
  const getSimplifiedFontName = useCallback((fontFamily: string): string => {
    if (!fontFamily || typeof fontFamily !== 'string') return 'Pretendard';
    
    // CSS font-family 스타일에서 첫 번째 폰트만 추출
    const firstFont = fontFamily.split(',')[0]?.trim() || fontFamily;
    
    // 따옴표 제거
    const cleaned = firstFont.replace(/['"]/g, '');
    
    // 일반적인 시스템 폰트들을 단순화
    const fontMap: Record<string, string> = {
      '-apple-system': 'System',
      'BlinkMacSystemFont': 'System',
      'system-ui': 'System',
      'sans-serif': 'Sans',
      'serif': 'Serif',
      'monospace': 'Mono',
      'Gangwon_mac': 'Gangwon',
      'Gangwon_win': 'Gangwon',
      'calibri-font-family': 'Calibri',
      'nanum-gothic': 'Nanum Gothic',
      'nanum gothic': 'Nanum Gothic',
      'sf-pro-display': 'SF Pro',
      'times-new-roman': 'Times'
    };
    
    const result = fontMap[cleaned.toLowerCase()] || cleaned;
    
    // 🔍 디버깅 로그
    console.log('🔍 Font simplification:', {
      original: fontFamily,
      firstFont,
      cleaned,
      result
    });
    
    return result;
  }, []);

  // 🔥 폰트 설정 함수 (핸들러 함수들 뒤에 정의)
  const setFont = useCallback((fontFamily: string) => {
    setCurrentFont(getSimplifiedFontName(fontFamily));
    handleFontFamily(fontFamily);
  }, [handleFontFamily, getSimplifiedFontName]);

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
            title="폰트 선택"
          >
            <span>{getSimplifiedFontName(currentFont) || 'Pretendard'}</span>
            <ChevronDown size={14} />
          </button>
          {showFontDropdown && (
            <div className="absolute top-full left-0 mt-1 w-40 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto text-[color:var(--editor-text)]">
              {availableFonts.map((font) => (
                <button
                  key={font.value}
                  type="button"
                  onClick={() => {
                    setShowFontDropdown(false);
                    setFont(font.value);
                  }}
                  className="w-full px-2 py-1.5 text-left text-xs transition-colors hover:bg-[var(--editor-accent-light)]"
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
            title="폰트 크기"
          >
            <span>{customFontSize}</span>
            <ChevronDown size={14} />
          </button>
          {showSizeDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-50 p-3 text-[color:var(--editor-text)]">
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
                {[12, 14, 16, 18, 20, 24].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => {
                      setCustomFontSize(size);
                      handleFontSize(size);
                      setShowSizeDropdown(false);
                    }}
                    className="px-2 py-1 text-xs rounded transition-colors hover:bg-[var(--editor-accent-light)]"
                  >
                    {size}
                  </button>
                ))}
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
            onClick={() => setShowLineHeightDropdown(!showLineHeightDropdown)}
            className={TOOLBAR_STYLES.dropdown}
            title="줄간격"
          >
            <span>{customLineHeight}</span>
            <ChevronDown size={14} />
          </button>
          {showLineHeightDropdown && (
            <div className="absolute top-full left-0 mt-1 w-32 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-50 p-3 text-[color:var(--editor-text)]">
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
                {[1.0, 1.2, 1.5, 1.8, 2.0, 2.5].map((height) => (
                  <button
                    key={height}
                    type="button"
                    onClick={() => {
                      setCustomLineHeight(height);
                      handleLineHeight(height);
                      setShowLineHeightDropdown(false);
                    }}
                    className="px-2 py-1 text-xs rounded transition-colors hover:bg-[var(--editor-accent-light)]"
                  >
                    {height}
                  </button>
                ))}
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
            <div className="absolute top-full right-0 mt-1 w-48 bg-[var(--editor-bg)] border border-[color:var(--editor-border)] rounded-lg shadow-lg z-50 text-[color:var(--editor-text)]">
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--editor-accent-light)]"
                onClick={() => {
                  setShowMoreOptions(false);
                }}
              >
                테이블 삽입
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--editor-accent-light)]"
                onClick={() => {
                  editor?.chain().focus().toggleBlockquote().run();
                  setShowMoreOptions(false);
                }}
              >
                인용문
              </button>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm transition-colors hover:bg-[var(--editor-accent-light)]"
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
              title={
                settings?.ui.sidebarCollapsed || sidebarCollapsed 
                  ? '사이드바 펼치기' 
                  : '사이드바 접기'
              }
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
