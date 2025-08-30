// 🔥 한글 입력 최적화 마크다운 유틸리티

import { Logger } from '../../../../shared/logger';

// CodeMirror 타입 정의 확장
interface CodeMirrorInstance {
  setOption(option: string, value: unknown): void;
  getCursor(): { line: number; ch: number };
  getLine(line: number): string;
  replaceRange(replacement: string, from: { line: number; ch: number }, to?: { line: number; ch: number }): void;
  setCursor(pos: { line: number; ch: number }): void;
  getSelection(): string;
  replaceSelection(replacement: string): void;
  execCommand(command: string): void;
  getWrapperElement?(): HTMLElement; // 🔥 CodeMirror wrapper 요소 접근
  getInputField?(): HTMLElement; // 🔥 입력 필드 접근
  focus?(): void; // 🔥 포커스 메서드 추가
}

// 🔥 한글 입력 최적화 설정 (기가차드 수정: 커서 조작 완전 제거)
export const setupKoreanInputOptimization = (cm: CodeMirrorInstance): void => {
  if (!cm) return;
  
  // 🔥 기본 IME 친화적 설정만 (커서 조작 X)
  cm.setOption('inputStyle', 'contenteditable');
  cm.setOption('lineWrapping', true);
  cm.setOption('styleSelectedText', false);
  cm.setOption('electricChars', false);
  cm.setOption('smartIndent', false);
  cm.setOption('autofocus', true);
  
  // 🔥 성능 최적화만
  cm.setOption('workTime', 200);
  cm.setOption('workDelay', 300);
  cm.setOption('pollInterval', 100);
  
  Logger.info('MARKDOWN_UTILS', 'Korean IME optimization applied (cursor-safe version)');
};

// 🔥 마크다운 텍스트 분석
export const analyzeMarkdownText = (content: string) => {
  if (!content) return {
    wordCount: 0,
    charCount: 0,
    paragraphCount: 0,
    headingCount: 0,
    listItemCount: 0
  };
  
  const lines = content.split('\n');
  
  return {
    wordCount: content.split(/\s+/).filter(word => word.length > 0).length,
    charCount: content.length,
    paragraphCount: content.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    headingCount: lines.filter(line => line.match(/^#{1,6}\s/)).length,
    listItemCount: lines.filter(line => line.match(/^[\s]*[-*+]\s/)).length
  };
};
