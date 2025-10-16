/**
 * 🔥 마크다운을 HTML로 변환하는 유틸리티
 * TipTap Editor가 이해할 수 있는 HTML 형식으로 변환
 */

import { Logger } from '../../shared/logger';

/**
 * 간단한 마크다운 파서 (TipTap HTML로 변환)
 * 주의: remark가 있지만 간단한 변환이므로 수동 구현
 */
export function markdownToHtml(markdown: string): string {
  if (!markdown) return '';

  try {
    let html = markdown;

    // 🔥 테이블 변환 (마크다운 테이블 → HTML 테이블)
    // 패턴: | cell1 | cell2 |
    const tableRegex = /^\|(.+)\|$/gm;
    if (tableRegex.test(html)) {
      html = html.replace(/^\|(.+)\|$/gm, '<tr><td>$1</td></tr>');
      // 더 정교한 테이블 처리
      const tableMatch = html.match(/(<tr>.*?<\/tr>)/s);
      if (tableMatch) {
        // 간단한 테이블 처리: row별로 split
        const rows = html.split('\n').filter(line => line.includes('<tr>'));
        if (rows.length > 0) {
          const tableHtml = '<table class="markdown-table"><tbody>' + rows.join('') + '</tbody></table>';
          html = html.replace(/(<tr>.*?<\/tr>)/gs, tableHtml);
        }
      }
    }

    // 🔥 제목 변환
    // # → h1, ## → h2, 등
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

    // 🔥 이미지 변환
    // ![alt](url) → <img alt="alt" src="url" />
    html = html.replace(/!\[(.+?)\]\((.+?)\)/g, '<img alt="$1" src="$2" class="markdown-image" />');

    // 🔥 링크 변환
    // [text](url) → <a href="url">text</a>
    html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');

    // 🔥 굵은 텍스트
    // **text** → <strong>text</strong>
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // 🔥 기울임 텍스트
    // *text* → <em>text</em>
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // 🔥 취소선
    // ~~text~~ → <s>text</s>
    html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

    // 🔥 밑줄 (이미 <u>로 처리됨)
    // <u>text</u> → 그대로 유지

    // 🔥 코드 블록
    // ```code``` → <pre><code>code</code></pre>
    html = html.replace(/```([^`]+)```/g, '<pre><code>$1</code></pre>');

    // 🔥 인라인 코드
    // `code` → <code>code</code>
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // 🔥 수평선
    // --- → <hr />
    html = html.replace(/^---$/gm, '<hr />');

    // 🔥 목록 변환
    // - item → <li>item</li>
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.+<\/li>[\n]?)+/g, '<ul>$&</ul>');

    // 🔥 번호 목록
    // 1. item → <li>item</li>
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // 🔥 줄 바꿈 처리
    html = html.replace(/\n/g, '<br />');

    // 🔥 문단 처리
    const paragraphs = html.split('<br /><br />');
    html = '<p>' + paragraphs.join('</p><p>') + '</p>';

    Logger.debug('MARKDOWN_PARSER', '✅ 마크다운 → HTML 변환 완료', {
      inputLength: markdown.length,
      outputLength: html.length,
      preview: html.substring(0, 100),
    });

    return html;
  } catch (error) {
    Logger.error('MARKDOWN_PARSER', '❌ 마크다운 변환 실패', error);
    // 실패 시 원본 반환
    return markdown;
  }
}

/**
 * 더 정교한 테이블 파싱 (마크다운 테이블 → HTML 테이블)
 */
export function parseMarkdownTable(markdown: string): string {
  try {
    const lines = markdown.split('\n').map(line => line.trim());
    const tableLines = lines.filter(line => line && line.startsWith('|') && line.endsWith('|'));

    if (tableLines.length < 2) {
      // 테이블이 아님
      return markdown;
    }

    let html = '<table class="markdown-table"><tbody>';

    for (let i = 0; i < tableLines.length; i++) {
      const line = tableLines[i];
      if (!line) continue;

      const cells = line
        .split('|')
        .slice(1, -1) // 첫 번째와 마지막 empty 제거
        .map(cell => cell.trim());

      html += '<tr>';

      // 첫 번째 행이면 <th>, 아니면 <td>
      const isHeader = i === 0;
      const tag = isHeader ? 'th' : 'td';

      for (const cell of cells) {
        html += `<${tag}>${cell}</${tag}>`;
      }

      html += '</tr>';

      // 두 번째 줄이면 구분선 스킵 (마크다운 테이블 형식)
      if (i === 0 && tableLines[i + 1]?.includes('---')) {
        i++; // 구분선 스킵
      }
    }

    html += '</tbody></table>';

    return html;
  } catch (error) {
    Logger.warn('MARKDOWN_PARSER', '⚠️ 테이블 파싱 실패', error);
    return markdown;
  }
}
