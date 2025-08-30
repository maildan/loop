// 🔥 EasyMDE 에디터 설정 모듈

// EasyMDE 타입 정의
interface EasyMDEEditor {
  codemirror: CodeMirrorEditor;
  value(): string;
  value(val: string): void;
  togglePreview(): void;
  toggleSideBySide(): void;
  toggleFullScreen(): void;
  isPreviewActive(): boolean;
  isSideBySideActive(): boolean;
  isFullscreenActive(): boolean;
}

interface CodeMirrorEditor {
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  setSelection(anchor: { line: number; ch: number }, head?: { line: number; ch: number }): void;
  replaceSelection(replacement: string): void;
}

export interface EditorToolbarItem {
  name: string;
  action: (editor: EasyMDEEditor) => void;
  className: string;
  title: string;
}

// 🔥 작가 친화적 EasyMDE 설정 (FontAwesome 아이콘 + 한국어 최적화)
export const getEditorOptions = () => ({
  autofocus: true,
  spellChecker: false,
  placeholder: '이야기를 시작해보세요...',
  status: ['lines', 'words', 'cursor'],
  toolbar: false, // 🔥 기본 툴바 숨기기 (커스텀 Lucide 툴바 사용)
  shortcuts: {
    "toggleBold": "Cmd-B",        // 🔥 macOS 스타일 단축키
    "toggleItalic": "Cmd-I", 
    "drawLink": "Cmd-K",
    "toggleHeading1": "Cmd-Alt-1", // 🔥 노션 스타일 헤딩 단축키
    "toggleHeading2": "Cmd-Alt-2",
    "toggleHeading3": "Cmd-Alt-3",
    "cleanBlock": "Cmd-E",
    "drawImage": "Cmd-Alt-I",
    "toggleUnorderedList": "Cmd-Shift-8", // 🔥 노션 스타일 리스트
    "toggleOrderedList": "Cmd-Shift-7",   // 🔥 노션 스타일 번호 리스트
    "toggleBlockquote": "Cmd-Shift-9",    // 🔥 노션 스타일 인용구
    "toggleCodeBlock": "Cmd-Alt-C",
    "togglePreview": "Cmd-P",
    "toggleSideBySide": "F9",
    "toggleFullScreen": "F11",
    "toggleDarkMode": "Cmd-D" // 🔥 다크모드 토글 단축키 추가
  },
  // 🔥 한글 입력 최적화 설정 (2024-2025 최신 IME 지원)
  inputStyle: "contenteditable" as const, // 🔥 IME 지원 향상을 위해 contenteditable 사용
  nativeSpellcheck: true, // 🔥 IME와 함께 네이티브 스펠체크 활성화
  previewRender: (plainText: string) => {
    return `<div class="prose dark:prose-invert max-w-none">${plainText}</div>`;
  },
  renderingConfig: {
    singleLineBreaks: false,
    codeSyntaxHighlighting: true,
  },
  autoDownloadFontAwesome: false, // 🔥 FontAwesome 비활성화 (Lucide로 교체 예정)
  tabSize: 2,
  lineWrapping: true,
  styleSelectedText: false, // 🔥 성능 향상을 위해 비활성화
  parsingConfig: {
    allowAtxHeaderWithoutSpace: true,
  },
  lineNumbers: false,
  mode: {
    name: "markdown",
    highlightFormatting: false, // 🔥 노션 스타일을 위해 마크업 숨기기
  },
  // 🔥 한글 입력 최적화 설정 (IME 방해 요소 제거)
  configureMouse: () => ({ addNew: false }),
  indentWithTabs: false,
  smartIndent: false, // 🔥 스마트 인덴트 비활성화 (한글 입력 방해 방지)
  electricChars: false, // 🔥 자동 문자 교정 비활성화 (한글 조합 방해 방지)
  rtlMoveVisually: true,
  // 🔥 노션 스타일 커스텀 키 맵핑 (커서 위치 보존 강화)
  extraKeys: {
    // 🔥 노션 스타일 굵게 (Cmd+B) - 기가차드 수정: 포커스 조작 제거
    "Cmd-B": function(cm: CodeMirrorEditor) {
      const cursor = cm.getCursor();
      const selection = cm.getSelection();
      
      if (selection) {
        cm.replaceSelection(`**${selection}**`);
      } else {
        cm.replaceSelection('****');
        cm.setCursor({ line: cursor.line, ch: cursor.ch + 2 });
      }
    },
    
    // 🔥 노션 스타일 기울임 (Cmd+I) - 기가차드 수정: 포커스 조작 제거
    "Cmd-I": function(cm: CodeMirrorEditor) {
      const cursor = cm.getCursor();
      const selection = cm.getSelection();
      
      if (selection) {
        cm.replaceSelection(`*${selection}*`);
      } else {
        cm.replaceSelection('**');
        cm.setCursor({ line: cursor.line, ch: cursor.ch + 1 });
      }
    },
    
    // 🔥 노션 스타일 링크 (Cmd+K) - 기가차드 수정: 포커스 조작 제거
    "Cmd-K": function(cm: CodeMirrorEditor) {
      const cursor = cm.getCursor();
      const selection = cm.getSelection();
      
      if (selection) {
        cm.replaceSelection(`[${selection}]()`);
        const newCursor = cm.getCursor();
        cm.setCursor({ line: newCursor.line, ch: newCursor.ch - 1 });
      } else {
        cm.replaceSelection('[링크 텍스트]()');
        cm.setSelection(
          { line: cursor.line, ch: cursor.ch + 1 },
          { line: cursor.line, ch: cursor.ch + 6 }
        );
      }
    },
    
    // 🔥 기가차드 마크다운 변환: Space 키로 마크업 자동 변환
    "Space": function(cm: CodeMirrorEditor) {
      const cursor = cm.getCursor();
      const line = cm.getLine(cursor.line);
      const lineStart = line.substring(0, cursor.ch);
      
      // 1. 헤딩 패턴 감지 (# 1-6개) - 정확한 마크다운 변환
      const headingMatch = lineStart.match(/^(#{1,6})$/);
      if (headingMatch) {
        // 단순히 스페이스만 추가 (### -> ### )
        cm.replaceSelection(' ');
        return;
      }
      
      // 2. 리스트 패턴 감지 (- 또는 *)
      const listMatch = lineStart.match(/^([-*])$/);
      if (listMatch) {
        cm.replaceSelection(' ');
        return;
      }
      
      // 3. 번호 리스트 패턴 감지 (1. 2. 등)
      const numberedListMatch = lineStart.match(/^(\d+\.)$/);
      if (numberedListMatch) {
        cm.replaceSelection(' ');
        return;
      }
      
      // 4. 인용구 패턴 감지 (>)
      const quoteMatch = lineStart.match(/^(>)$/);
      if (quoteMatch) {
        cm.replaceSelection(' ');
        return;
      }
      
      // 기본 스페이스 입력
      cm.replaceSelection(' ');
    }
  }
});

// 🔥 포커스 모드용 설정
export const getFocusModeOptions = () => ({
  ...getEditorOptions(),
  toolbar: false,
  status: false,
});
