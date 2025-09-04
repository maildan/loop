// 🔥 MarkdownParser Service - 마크다운 구문 파싱 전담
// 기존 MarkdownEditor.tsx의 handleKeyDown 로직을 서비스로 분리

import { Editor } from '@tiptap/react';
import { Logger } from '../../../../../../shared/logger';

export interface MarkdownPattern {
    pattern: string;
    action: (editor: Editor, position: number) => boolean;
    description: string;
}

export class MarkdownParserService {
    private static instance: MarkdownParserService;
    private patterns: MarkdownPattern[] = [];

    private constructor() {
        this.initializePatterns();
    }

    public static getInstance(): MarkdownParserService {
        if (!MarkdownParserService.instance) {
            MarkdownParserService.instance = new MarkdownParserService();
        }
        return MarkdownParserService.instance;
    }

    private initializePatterns(): void {
        this.patterns = [
            {
                pattern: '#',
                action: (editor, pos) => {
                    editor.chain()
                        .focus()
                        .deleteRange({ from: pos - 1, to: pos })
                        .setHeading({ level: 1 })
                        .run();
                    Logger.debug('MARKDOWN_PARSER', '✅ H1 applied');
                    return true;
                },
                description: 'Heading 1'
            },
            {
                pattern: '##',
                action: (editor, pos) => {
                    editor.chain()
                        .focus()
                        .deleteRange({ from: pos - 2, to: pos })
                        .setHeading({ level: 2 })
                        .run();
                    Logger.debug('MARKDOWN_PARSER', '✅ H2 applied');
                    return true;
                },
                description: 'Heading 2'
            },
            {
                pattern: '###',
                action: (editor, pos) => {
                    editor.chain()
                        .focus()
                        .deleteRange({ from: pos - 3, to: pos })
                        .setHeading({ level: 3 })
                        .run();
                    Logger.debug('MARKDOWN_PARSER', '✅ H3 applied');
                    return true;
                },
                description: 'Heading 3'
            },
            {
                pattern: '-',
                action: (editor, pos) => {
                    editor.chain()
                        .focus()
                        .deleteRange({ from: pos - 1, to: pos })
                        .toggleBulletList()
                        .run();
                    Logger.debug('MARKDOWN_PARSER', '✅ Bullet list applied');
                    return true;
                },
                description: 'Bullet List'
            }
        ];
    }

    public parseMarkdown(editor: Editor, textBefore: string, position: number): boolean {
        // 정확한 매칭을 위한 패턴 검사
        for (const pattern of this.patterns) {
            if (textBefore === pattern.pattern) {
                return pattern.action(editor, position);
            }
        }

        // 숫자 리스트 처리 (동적 패턴)
        if (/^\d+\.$/.test(textBefore)) {
            editor.chain()
                .focus()
                .deleteRange({ from: position - textBefore.length, to: position })
                .toggleOrderedList()
                .run();
            Logger.debug('MARKDOWN_PARSER', '✅ Ordered list applied');
            return true;
        }

        return false;
    }

    public getAvailablePatterns(): MarkdownPattern[] {
        return [...this.patterns];
    }
}

export const markdownParserService = MarkdownParserService.getInstance();
