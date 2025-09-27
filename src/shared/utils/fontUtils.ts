// 🔥 폰트 유틸리티 - 기술명→사용자 친화명 변환
import { Logger } from '../logger';

/**
 * 🔥 폰트 기술명 → 사용자 친화명 매핑
 */
const FONT_DISPLAY_NAMES: Record<string, string> = {
  // Windows 기본 폰트
  'MSGothic': 'MS Gothic',
  'MSMinchoRegular': 'MS Mincho',
  'MSMincho': 'MS Mincho',
  'MalgunGothic': '맑은 고딕',
  'BatangChe': '바탕체',
  'Dotum': '돋움',
  'Gulim': '굴림',
  'GulimChe': '굴림체',
  
  // macOS 기본 폰트
  'AppleSDGothicNeo-Regular': 'Apple SD 고딕 Neo',
  'AppleSDGothicNeo': 'Apple SD 고딕 Neo',
  'PingFangSC-Regular': 'PingFang SC',
  'PingFangSC': 'PingFang SC',
  'HiraginoSansGB-Regular': 'Hiragino Sans GB',
  
  // 영문 폰트
  'arial': 'Arial',
  'Arial': 'Arial',
  'verdana': 'Verdana',
  'Verdana': 'Verdana',
  'calibri': 'Calibri',
  'Calibri': 'Calibri',
  'calibri-font-family': 'Calibri',
  'times-new-roman': 'Times New Roman',
  'TimesNewRoman': 'Times New Roman',
  'georgia': 'Georgia',
  'Georgia': 'Georgia',
  'tahoma': 'Tahoma',
  'Tahoma': 'Tahoma',
  
  // 시스템 폰트
  'system-ui': 'System Font',
  '-apple-system': 'Apple System Font',
  'BlinkMacSystemFont': 'Blink Mac System Font',
  'segoe-ui': 'Segoe UI',
  'SegoeUI': 'Segoe UI',
  'Microsoft-Sans-Serif': 'Microsoft Sans Serif',
  
  // 한글 폰트
  'NanumGothic': '나눔고딕',
  'NanumMyeongjo': '나눔명조',
  'NotoSansKR': 'Noto Sans KR',
  'PretendardRegular': 'Pretendard',
  'Pretendard': 'Pretendard',
  'GangwonEduAll': '강원교육모든체',
  
  // 일본어 폰트
  'HiraginoKakuGothicPro': 'Hiragino Kaku Gothic Pro',
  'YuGothic': 'Yu Gothic',
  'MeiryoUI': 'Meiryo UI',
  
  // 개발자 폰트
  'SFMono-Regular': 'SF Mono',
  'Monaco': 'Monaco',
  'CascadiaCode': 'Cascadia Code',
  'JetBrainsMono': 'JetBrains Mono',
  'FiraCode': 'Fira Code',
  'SourceCodePro': 'Source Code Pro',
  'Consolas': 'Consolas',
  'CourierNew': 'Courier New'
};

/**
 * 🔥 기술적 폰트명을 사용자 친화적 표시명으로 변환
 */
export function getFontDisplayName(technicalName: string): string {
  if (!technicalName || typeof technicalName !== 'string') {
    return 'Unknown Font';
  }

  // 1. 직접 매핑 확인
  const directMatch = FONT_DISPLAY_NAMES[technicalName];
  if (directMatch) {
    return directMatch;
  }

  // 2. 대소문자 무시하고 매핑 확인
  const lowerKey = Object.keys(FONT_DISPLAY_NAMES).find(
    key => key.toLowerCase() === technicalName.toLowerCase()
  );
  if (lowerKey && FONT_DISPLAY_NAMES[lowerKey]) {
    return FONT_DISPLAY_NAMES[lowerKey];
  }

  // 3. 자동 정규화 패턴 적용
  return normalizeFontName(technicalName);
}

/**
 * 🔥 특수 패턴 매핑 (복잡도 감소를 위해 분리)
 */
const SPECIAL_PATTERNS = [
  { pattern: /^ms-?gothic$/i, replacement: 'MS Gothic' },
  { pattern: /^ms-?mincho/i, replacement: 'MS Mincho' },
  { pattern: /malgun-?gothic/i, replacement: '맑은 고딕' },
  { pattern: /nanum-?gothic/i, replacement: '나눔고딕' },
  { pattern: /noto-?sans-?kr/i, replacement: 'Noto Sans KR' },
  { pattern: /pretendard/i, replacement: 'Pretendard' },
  { pattern: /apple-?sd-?gothic-?neo/i, replacement: 'Apple SD 고딕 Neo' },
  { pattern: /segoe-?ui/i, replacement: 'Segoe UI' },
  { pattern: /times-?new-?roman/i, replacement: 'Times New Roman' },
  { pattern: /courier-?new/i, replacement: 'Courier New' },
  { pattern: /source-?code-?pro/i, replacement: 'Source Code Pro' },
  { pattern: /jetbrains-?mono/i, replacement: 'JetBrains Mono' },
  { pattern: /cascadia-?code/i, replacement: 'Cascadia Code' },
  { pattern: /sf-?mono/i, replacement: 'SF Mono' },
  { pattern: /fira-?code/i, replacement: 'Fira Code' }
];

/**
 * 🔥 패턴 매칭으로 폰트명 변환
 */
function tryPatternMatch(name: string): string | null {
  for (const { pattern, replacement } of SPECIAL_PATTERNS) {
    if (pattern.test(name)) {
      return replacement;
    }
  }
  return null;
}

/**
 * 🔥 일반적인 폰트명 정규화
 */
function performGenericNormalization(name: string): string {
  return name
    .replace(/[-_]/g, ' ')  // 하이픈/언더스코어 → 공백
    .replace(/([a-z])([A-Z])/g, '$1 $2')  // camelCase 분리
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')  // 연속 대문자 처리
    .replace(/\b\w/g, l => l.toUpperCase())  // 각 단어 첫글자 대문자
    .replace(/\s+/g, ' ')  // 중복 공백 제거
    .trim();
}

/**
 * 🔥 폰트명 자동 정규화 (패턴 기반) - 복잡도 개선
 */
export function normalizeFontName(name: string): string {
  if (!name || typeof name !== 'string') {
    return 'Unknown Font';
  }

  try {
    // 1. 패턴 매칭 시도
    const patternMatch = tryPatternMatch(name);
    if (patternMatch) {
      return patternMatch;
    }

    // 2. 일반적인 정규화
    return performGenericNormalization(name);

  } catch (error) {
    Logger.warn('FONT_UTILS', '폰트명 정규화 실패', { name, error });
    return name; // 실패 시 원본 반환
  }
}

/**
 * 🔥 CSS 폰트 패밀리 문자열 생성 (폴백 체인 포함)
 */
export function generateCSSFontFamily(fontName: string): string {
  const normalizedName = getFontDisplayName(fontName);
  
  // 폰트 타입 감지
  const detectFontType = (name: string) => {
    const lowerName = name.toLowerCase();
    
    if (/nanum|나눔|malgun|맑은|gothic|바탕|dotum|돋움|한글/.test(lowerName)) {
      return 'korean';
    } else if (/hiragino|yu.gothic|meiryo|ms.gothic|japanese/.test(lowerName)) {
      return 'japanese';
    } else if (/mono|code|consolas|menlo|courier|fira|jetbrains/.test(lowerName)) {
      return 'monospace';
    } else if (/serif|times|georgia|mincho|명조/.test(lowerName)) {
      return 'serif';
    }
    return 'sans-serif';
  };

  const fontType = detectFontType(normalizedName);
  
  // 타입별 폴백 체인
  const fallbackChains = {
    korean: `"${normalizedName}", "Apple SD Gothic Neo", "Malgun Gothic", "Noto Sans KR", sans-serif`,
    japanese: `"${normalizedName}", "Hiragino Kaku Gothic Pro", "Yu Gothic", "MS Gothic", sans-serif`,
    monospace: `"${normalizedName}", "SF Mono", Monaco, "Cascadia Code", "JetBrains Mono", monospace`,
    serif: `"${normalizedName}", "Times New Roman", Georgia, "Noto Serif KR", serif`,
    'sans-serif': `"${normalizedName}", system-ui, -apple-system, "Segoe UI", Arial, sans-serif`
  };

  return fallbackChains[fontType] || fallbackChains['sans-serif'];
}

/**
 * 🔥 폰트 카테고리 결정
 */
export function determineFontCategory(fontName: string): 'korean' | 'japanese' | 'english' | 'monospace' | 'system' {
  const lowerName = fontName.toLowerCase();
  
  if (/nanum|나눔|malgun|맑은|gothic|바탕|dotum|돋움|korean|kr|gangwon|pretendard/.test(lowerName)) {
    return 'korean';
  }
  
  if (/hiragino|yu|meiryo|ms.gothic|japanese|jp/.test(lowerName)) {
    return 'japanese';
  }
  
  if (/mono|code|consolas|menlo|courier|fira|jetbrains|cascadia|sf.mono/.test(lowerName)) {
    return 'monospace';
  }
  
  if (/system|apple.system|blink/.test(lowerName)) {
    return 'system';
  }
  
  return 'english';
}

/**
 * 🔥 폰트 무게(weight) 정규화
 */
export function normalizeFontWeight(weight: string | number): string {
  if (typeof weight === 'number') {
    return String(weight);
  }
  
  const weightMap: Record<string, string> = {
    'thin': '100',
    'ultra-light': '200',
    'light': '300',
    'normal': '400',
    'regular': '400',
    'medium': '500',
    'semi-bold': '600',
    'bold': '700',
    'ultra-bold': '800',
    'black': '900'
  };
  
  const normalizedWeight = weight.toLowerCase().replace(/[-_]/g, '-');
  return weightMap[normalizedWeight] || '400';
}

/**
 * 🔥 폰트 스타일 정규화
 */
export function normalizeFontStyle(style: string): 'normal' | 'italic' | 'oblique' {
  const lowerStyle = style.toLowerCase();
  
  if (/italic|oblique/.test(lowerStyle)) {
    return 'italic';
  }
  
  return 'normal';
}

export default {
  getFontDisplayName,
  normalizeFontName,
  generateCSSFontFamily,
  determineFontCategory,
  normalizeFontWeight,
  normalizeFontStyle
};