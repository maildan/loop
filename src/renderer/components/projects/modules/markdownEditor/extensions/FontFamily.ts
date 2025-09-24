    // 🔥 TipTap FontFamily Extension for v2
// TipTap v2에서 폰트 패밀리 지원을 위한 커스텀 확장

import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    fontFamily: {
      /**
       * Set the font family
       */
      setFontFamily: (fontFamily: string) => ReturnType;
      /**
       * Unset the font family
       */
      unsetFontFamily: () => ReturnType;
    };
  }
}

export interface FontFamilyOptions {
  types: string[];
}

export const FontFamily = Extension.create<FontFamilyOptions>({
  name: 'fontFamily',

  addOptions() {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontFamily: {
            default: null,
            parseHTML: element => element.style.fontFamily?.replace(/['"]/g, ''),
            renderHTML: attributes => {
              if (!attributes.fontFamily) {
                return {};
              }

              // 🎯 개별 폰트 설정 우선 전략 - 사용자 선택 존중
              // 개별 폰트가 명시적으로 설정된 경우 그것을 사용하고,
              // 전역 폰트는 fallback으로만 사용
              return {
                style: `font-family: ${attributes.fontFamily}`,
                'data-font-family': attributes.fontFamily,
                'data-font-source': 'local'
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontFamily: fontFamily => ({ chain, commands }) => {
        // 🔥 전역 CSS 변수 업데이트 (모든 텍스트에 적용)
        document.documentElement.style.setProperty('--app-font-family', fontFamily);
        
        // 🔥 선택된 텍스트에만 개별 적용 (옵션)
        // 대부분의 경우 전역 CSS 변수가 우선 적용됨
        return chain()
          .setMark('textStyle', { fontFamily })
          .run();
      },
      unsetFontFamily: () => ({ chain }) => {
        // 🔥 CSS 변수는 유지하고, 인라인 스타일만 제거
        return chain()
          .setMark('textStyle', { fontFamily: null })
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});