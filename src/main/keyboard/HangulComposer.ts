// 🔥 기가차드 한글 조합기 - 완벽한 한글 입력 처리!

import { Logger } from '../../shared/logger';
import { BaseManager } from '../common/BaseManager';
import { KeyboardEvent, Result } from '../../shared/types';
import { HANGUL_KEY_MAP } from './constants';

// #DEBUG: Hangul composer entry point
Logger.debug('HANGUL_COMPOSER', 'Hangul composer module loaded');

// 🔥 기가차드 한글 조합 상태
export interface HangulCompositionState {
  isComposing: boolean;
  initial: string; // 초성
  medial: string;  // 중성
  final: string;   // 종성
  composed: string; // 조합된 글자
}

// 🔥 기가차드 한글 조합 결과
export interface HangulCompositionResult {
  completed: string; // 완성된 문자
  composing: string; // 조합 중인 문자
}

// 🔥 기가차드 한글 유니코드 범위
const HANGUL_BASE = 0xAC00; // 가
const INITIAL_COUNT = 19;    // 초성 개수
const MEDIAL_COUNT = 21;     // 중성 개수
const FINAL_COUNT = 28;      // 종성 개수 (없음 포함)

// 🔥 기가차드 초성 배열
const INITIALS = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

// 🔥 기가차드 중성 배열
const MEDIALS = [
  'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ',
  'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
];

// 🔥 기가차드 종성 배열
const FINALS = [
  '', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ',
  'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ',
  'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
];

/**
 * 🔥 HangulComposer - 완벽한 한글 조합 시스템
 * 실시간 한글 입력 처리, 조합, 분해, 오토마타 기반 상태 관리
 */
export class HangulComposer extends BaseManager {
  private readonly componentName = 'HANGUL_COMPOSER';
  private compositionState: HangulCompositionState;
  private keyMap: Map<string, string>;
  private lastProcessedTime = 0;
  private compositionTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super({
      name: 'HangulComposer',
      autoStart: false,
      retryOnError: false,
      maxRetries: 1,
      retryDelay: 500,
    });

    this.compositionState = this.createEmptyState();
    this.keyMap = new Map();
    this.setupKeyMapping();

    Logger.info(this.componentName, 'Hangul composer instance created');
  }

  /**
   * BaseManager 추상 메서드 구현 - 초기화
   */
  protected async doInitialize(): Promise<void> {
    try {
      this.setupKeyMapping();
      Logger.info(this.componentName, 'Hangul composer initialized successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to initialize hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 시작
   */
  protected async doStart(): Promise<void> {
    try {
      this.compositionState = this.createEmptyState();
      Logger.info(this.componentName, 'Hangul composer started successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to start hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 중지
   */
  protected async doStop(): Promise<void> {
    try {
      this.finishComposition();
      if (this.compositionTimeout) {
        clearTimeout(this.compositionTimeout);
        this.compositionTimeout = null;
      }
      Logger.info(this.componentName, 'Hangul composer stopped successfully');
    } catch (error) {
      const err = error as Error;
      Logger.error(this.componentName, 'Failed to stop hangul composer', err);
      throw err;
    }
  }

  /**
   * BaseManager 추상 메서드 구현 - 정리
   */
  protected async doCleanup(): Promise<void> {
    this.compositionState = this.createEmptyState();
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
      this.compositionTimeout = null;
    }
    Logger.info(this.componentName, 'Hangul composer cleaned up');
  }

  /**
   * 키 입력 처리 (메인 인터페이스)
   */
  public async processKey(event: KeyboardEvent): Promise<HangulCompositionResult> {
    try {
      this.lastProcessedTime = Date.now();
      
      // 🔥 macOS IME 완성형 한글 우선 처리
      if (process.platform === 'darwin' && event.keychar && this.isCompleteHangul(event.keychar)) {
        Logger.debug(this.componentName, '🎯 macOS IME 완성형 한글 감지 - 직접 반환', {
          keychar: event.keychar,
          charCode: event.keychar.charCodeAt(0).toString(16)
        });
        
        // 기존 조합 완료 후 완성형 한글 반환
        if (this.compositionState.isComposing) {
          const previousCompleted = this.buildCharacter();
          this.compositionState = this.createEmptyState();
          return { 
            completed: previousCompleted + event.keychar, 
            composing: '' 
          };
        }
        
        return { 
          completed: event.keychar, 
          composing: '' 
        };
      }
      
      // 백스페이스 처리
      if (event.key === 'backspace') {
        return this.handleBackspace();
      }
      
      // 스페이스나 엔터 처리
      if (event.key === 'space' || event.key === 'enter') {
        return this.finishComposition();
      }
      
      // 🔥 한글 키 확인 (개선된 로직 - 키 값 검증 추가)
      let hangulChar: string | undefined;
      
      // 0. 키 값 사전 검증 (숫자나 특수문자는 즉시 조합 완료)
      if (this.isInvalidKey(event.key)) {
        Logger.debug(this.componentName, '⚠️ 유효하지 않은 키 - 조합 완료', { 
          key: event.key,
          reason: 'invalid-key-detected'
        });
        return this.finishComposition();
      }
      
      // 1. 이미 한글 문자인지 확인
      if (this.isHangulChar(event.key)) {
        hangulChar = event.key; // 이미 한글이면 그대로 사용
        Logger.debug(this.componentName, '🔥 이미 한글 문자 감지됨', { key: event.key });
      } else {
        // 2. 영어 키를 한글로 매핑
        hangulChar = this.keyMap.get(event.key.toLowerCase());
        Logger.debug(this.componentName, '🔍 영어→한글 매핑 시도', { 
          englishKey: event.key, 
          hangulChar: hangulChar || 'undefined' 
        });
      }
      
      if (!hangulChar) {
        // 한글이 아닌 경우 조합 완료
        Logger.debug(this.componentName, '❌ 한글이 아님 - 조합 완료', { key: event.key });
        return this.finishComposition();
      }
      
      // 한글 조합 처리
      Logger.debug(this.componentName, '✅ 한글 조합 시작', { hangulChar });
      return this.composeHangul(hangulChar);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error processing key', error as Error);
      return { completed: '', composing: '' };
    }
  }

  /**
   * 직접 키 처리 (문자열 입력) - 🔥 기가차드 개선!
   */
  public processKeyString(key: string): HangulCompositionResult {
    try {
      Logger.debug(this.componentName, '🔍 키 문자열 처리 시작', { 
        inputKey: key,
        keyLength: key.length,
        keyCode: key.charCodeAt(0),
        isComposing: this.compositionState.isComposing
      });
      
      // 백스페이스 처리
      if (key === 'backspace' || key === '\b') {
        Logger.debug(this.componentName, '🔧 백스페이스 처리');
        return this.handleBackspace();
      }
      
      // 스페이스나 엔터 처리
      if (key === ' ' || key === '\n') {
        Logger.debug(this.componentName, '🔧 조합 완료 (스페이스/엔터)');
        return this.finishComposition();
      }
      
      // 🔥 기가차드 개선: 영어 키 → 한글 매핑 확인
      let hangulChar = key;
      
      // 1. 직접 한글 문자인지 확인
      if (this.isHangulChar(key)) {
        Logger.debug(this.componentName, '🔥 이미 한글 문자 감지됨', { key });
        hangulChar = key;
      } 
      // 2. 영어 키보드 → 한글 매핑 확인
      else if (this.keyMap.has(key.toLowerCase())) {
        hangulChar = this.keyMap.get(key.toLowerCase())!;
        Logger.debug(this.componentName, '🔄 영어→한글 매핑 성공', { 
          englishKey: key, 
          hangulChar,
          mappingType: 'keyMap'
        });
      }
      // 3. HANGUL_KEY_MAP 역매핑 확인 (영어 키 → 한글)
      else {
        const reversedKey = this.findHangulByEnglishKey(key);
        if (reversedKey) {
          hangulChar = reversedKey;
          Logger.debug(this.componentName, '🔄 HANGUL_KEY_MAP 역매핑 성공', { 
            englishKey: key, 
            hangulChar,
            mappingType: 'reversed'
          });
        }
      }
      
      // 4. 최종 한글 문자 검증
      if (!this.isHangulChar(hangulChar)) {
        Logger.debug(this.componentName, '❌ 한글이 아님 - 조합 완료', { 
          originalKey: key,
          mappedChar: hangulChar,
          isHangul: false
        });
        return this.finishComposition();
      }
      
      Logger.debug(this.componentName, '✅ 한글 조합 시작', { hangulChar });
      
      // 한글 조합 처리
      return this.composeHangul(hangulChar);
      
    } catch (error) {
      Logger.error(this.componentName, 'Error processing key string', error as Error);
      return { completed: '', composing: '' };
    }
  }

  /**
   * 🔥 영어 키로 한글 찾기 (HANGUL_KEY_MAP 역매핑)
   */
  private findHangulByEnglishKey(englishKey: string): string | null {
    try {
      // 대소문자 모두 확인
      const keys = [englishKey, englishKey.toLowerCase(), englishKey.toUpperCase()];
      
      for (const key of keys) {
        for (const [hangul, english] of Object.entries(HANGUL_KEY_MAP)) {
          if (english === key) {
            Logger.debug(this.componentName, '🔍 영어→한글 매핑 시도', { englishKey: key, hangulChar: hangul });
            return hangul;
          }
        }
      }
      
      Logger.debug(this.componentName, '🔍 영어→한글 매핑 시도', { englishKey, hangulChar: 'undefined' });
      return null;
    } catch (error) {
      Logger.error(this.componentName, 'Error in findHangulByEnglishKey', error as Error);
      return null;
    }
  }

  /**
   * 한글 조합 처리
   */
  private composeHangul(char: string): HangulCompositionResult {
    const isInitial = this.isInitial(char);
    const isMedial = this.isMedial(char);
    const isFinal = this.isFinal(char);

    let completed = '';
    let composing = '';

    if (isInitial) {
      // 초성 처리
      if (!this.compositionState.isComposing) {
        // 새로운 조합 시작
        this.compositionState.isComposing = true;
        this.compositionState.initial = char;
        this.compositionState.medial = '';
        this.compositionState.final = '';
      } else if (this.compositionState.medial === '') {
        // 초성 다음에 초성이 온 경우 (이전 글자 완성)
        completed = this.buildCharacter();
        // 🔥 기가차드 개선: 새로운 조합 상태로 완전히 리셋
        this.resetToNewComposition(char);
      } else {
        // 종성 자리에 초성이 온 경우
        if (this.compositionState.final === '') {
          this.compositionState.final = char;
        } else {
          // 이전 글자 완성하고 새 글자 시작
          completed = this.buildCharacter();
          // 🔥 기가차드 개선: 새로운 조합 상태로 완전히 리셋
          this.resetToNewComposition(char);
        }
      }
    } else if (isMedial) {
      // 중성 처리
      if (this.compositionState.initial !== '') {
        if (this.compositionState.medial === '') {
          // 첫 번째 중성
          this.compositionState.medial = char;
          Logger.debug(this.componentName, '🔥 첫 번째 중성 설정', { 
            initial: this.compositionState.initial, 
            medial: char 
          });
        } else {
          // 🔥 복합 중성 조합 시도
          const combined = this.combineMedials(this.compositionState.medial, char);
          Logger.debug(this.componentName, '🔥 복합모음 조합 시도', { 
            first: this.compositionState.medial, 
            second: char, 
            combined
          });
          
          if (combined) {
            this.compositionState.medial = combined;
            Logger.debug(this.componentName, '🔥 복합모음 조합 성공!', { 
              original: `${this.compositionState.medial} + ${char}`,
              result: combined,
              fullChar: `${this.compositionState.initial}${combined}${this.compositionState.final}`
            });
          } else {
            // 🔥 조합 불가 시 이전 글자 완성하고 새 조합 시작
            completed = this.buildCharacter();
            Logger.debug(this.componentName, '🔥 복합모음 조합 불가로 이전 글자 완성', { 
              first: this.compositionState.medial, 
              second: char,
              completed,
              action: 'complete-and-start-new'
            });
            
            // 🔥 상태 초기화 후 새로운 조합 시작 (중성으로 시작)
            this.resetComposition();
            this.compositionState.isComposing = true;
            this.compositionState.initial = 'ㅇ'; // 묵음 초성 자동 추가
            this.compositionState.medial = char;
            this.compositionState.final = '';
            this.compositionState.composed = this.buildCharacter();
            
            Logger.debug(this.componentName, '🔥 새로운 중성 조합 시작', { 
              newInitial: 'ㅇ',
              newMedial: char,
              newComposed: this.compositionState.composed
            });
          }
        }
      } else {
        // 초성 없이 중성만 입력된 경우 (ㅇ 자동 추가)
        this.compositionState.isComposing = true;
        this.compositionState.initial = 'ㅇ'; // 묵음 초성
        this.compositionState.medial = char;
        this.compositionState.final = '';
        Logger.debug(this.componentName, '🔥 묵음 초성 자동 추가', { 
          medial: char,
          autoInitial: 'ㅇ'
        });
      }
    } else if (isFinal) {
      // 종성 처리
      if (this.compositionState.initial !== '' && this.compositionState.medial !== '') {
        if (this.compositionState.final === '') {
          this.compositionState.final = char;
        } else {
          // 복합 종성 시도
          const combined = this.combineFinals(this.compositionState.final, char);
          if (combined) {
            this.compositionState.final = combined;
          } else {
            // 조합 불가 - 이전 글자 완성
            completed = this.buildCharacter();
            this.compositionState.initial = char;
            this.compositionState.medial = '';
            this.compositionState.final = '';
          }
        }
      }
    }

    // 현재 조합 중인 글자 생성
    if (this.compositionState.isComposing) {
      composing = this.buildCharacter();
      this.compositionState.composed = composing;
    }

    // 조합 타임아웃 설정
    this.setCompositionTimeout();

    return { completed, composing };
  }

  /**
   * 백스페이스 처리
   */
  private handleBackspace(): HangulCompositionResult {
    if (!this.compositionState.isComposing) {
      return { completed: '', composing: '' };
    }

    const completed = '';
    let composing = '';

    // 종성 → 중성 → 초성 순으로 제거
    if (this.compositionState.final !== '') {
      this.compositionState.final = '';
    } else if (this.compositionState.medial !== '') {
      this.compositionState.medial = '';
    } else if (this.compositionState.initial !== '') {
      this.compositionState.initial = '';
      this.compositionState.isComposing = false;
    }

    // 현재 조합 상태 업데이트
    if (this.compositionState.isComposing) {
      composing = this.buildCharacter();
      this.compositionState.composed = composing;
    }

    return { completed, composing };
  }

  /**
   * 조합 완료
   */
  private finishComposition(): HangulCompositionResult {
    let completed = '';
    
    if (this.compositionState.isComposing) {
      completed = this.buildCharacter();
      this.compositionState = this.createEmptyState();
    }

    return { completed, composing: '' };
  }

  /**
   * 한글 문자 조합
   */
  private buildCharacter(): string {
    if (!this.compositionState.initial || !this.compositionState.medial) {
      return this.compositionState.initial || this.compositionState.medial || '';
    }

    const initialIndex = INITIALS.indexOf(this.compositionState.initial);
    const medialIndex = MEDIALS.indexOf(this.compositionState.medial);
    const finalIndex = FINALS.indexOf(this.compositionState.final);

    if (initialIndex === -1 || medialIndex === -1 || finalIndex === -1) {
      return this.compositionState.initial + this.compositionState.medial + this.compositionState.final;
    }

    const code = HANGUL_BASE + (initialIndex * MEDIAL_COUNT * FINAL_COUNT) + (medialIndex * FINAL_COUNT) + finalIndex;
    return String.fromCharCode(code);
  }

  /**
   * 키 매핑 설정 (HANGUL_KEY_MAP 직접 사용)
   */
  private setupKeyMapping(): void {
    try {
      // 🔥 HANGUL_KEY_MAP을 역매핑하여 영어키 → 한글 매핑 생성
      // 중요: Object.entries가 정의 순서를 보장하므로 기본 자음이 먼저 처리됨
      Object.entries(HANGUL_KEY_MAP).forEach(([hangul, english]) => {
        const key = english.toLowerCase();
        
        // 🔥 소문자 키만 매핑 (대문자 Shift 조합은 별도 처리)
        if (english === english.toLowerCase()) {
          this.keyMap.set(key, hangul);
        }
      });

      Logger.debug(this.componentName, 'Key mapping setup completed with HANGUL_KEY_MAP', {
        mappingCount: this.keyMap.size,
        sampleMappings: Array.from(this.keyMap.entries()).slice(0, 5)
      });
      
    } catch (error) {
      Logger.error(this.componentName, 'Failed to setup key mapping, using fallback', error);
      
      // 🔥 폴백: 기본 키 매핑 (QWERTY → 한글)
      const defaultMapping: Record<string, string> = {
        'q': 'ㅂ', 'w': 'ㅈ', 'e': 'ㄷ', 'r': 'ㄱ', 't': 'ㅅ',
        'y': 'ㅛ', 'u': 'ㅕ', 'i': 'ㅑ', 'o': 'ㅐ', 'p': 'ㅔ',
        'a': 'ㅁ', 's': 'ㄴ', 'd': 'ㅇ', 'f': 'ㄹ', 'g': 'ㅎ',
        'h': 'ㅗ', 'j': 'ㅓ', 'k': 'ㅏ', 'l': 'ㅣ',
        'z': 'ㅋ', 'x': 'ㅌ', 'c': 'ㅊ', 'v': 'ㅍ', 'b': 'ㅠ',
        'n': 'ㅜ', 'm': 'ㅡ'
      };

      Object.entries(defaultMapping).forEach(([key, value]) => {
        this.keyMap.set(key, value);
      });
    }
  }

  /**
   * 🔥 완전한 중성 조합 (모든 한국어 복합모음 지원)
   */
  private combineMedials(first: string, second: string): string | null {
    // 🔥 조합 가능성 사전 검사 (잘못된 조합 시도 방지)
    if (first === second) {
      Logger.debug(this.componentName, '❌ 동일한 모음 연속 입력 - 조합 불가', {
        first,
        second,
        reason: 'same-vowel-repetition'
      });
      return null;
    }

    const combinations: Record<string, Record<string, string>> = {
      // 🔥 ㅗ 계열 복합모음 (3개)
      'ㅗ': { 
        'ㅏ': 'ㅘ',   // ㅗ + ㅏ = ㅘ (wa)
        'ㅐ': 'ㅙ',   // ㅗ + ㅐ = ㅙ (wae)  
        'ㅣ': 'ㅚ'    // ㅗ + ㅣ = ㅚ (oe)
      },
      
      // 🔥 ㅜ 계열 복합모음 (3개)
      'ㅜ': { 
        'ㅓ': 'ㅝ',   // ㅜ + ㅓ = ㅝ (wo)
        'ㅔ': 'ㅞ',   // ㅜ + ㅔ = ㅞ (we)
        'ㅣ': 'ㅟ'    // ㅜ + ㅣ = ㅟ (wi)
      },
      
      // 🔥 ㅡ 계열 복합모음 (1개)
      'ㅡ': { 
        'ㅣ': 'ㅢ'    // ㅡ + ㅣ = ㅢ (ui)
      },
      
      // 🔥 추가: ㅑ, ㅕ 계열 복합모음 (표준 확장)
      'ㅑ': { 
        'ㅣ': 'ㅒ'    // ㅑ + ㅣ = ㅒ (yae) - 실제로는 단일키지만 조합 지원
      },
      
      'ㅕ': { 
        'ㅣ': 'ㅖ'    // ㅕ + ㅣ = ㅖ (ye) - 실제로는 단일키지만 조합 지원
      },

      // 🔥 기본 모음 + ㅣ 조합 지원 (표준 한글 조합 규칙)
      'ㅏ': { 
        'ㅣ': 'ㅐ'    // ㅏ + ㅣ = ㅐ (ae) - 실제로는 단일키지만 조합 지원
      },
      
      'ㅓ': { 
        'ㅣ': 'ㅔ'    // ㅓ + ㅣ = ㅔ (e) - 실제로는 단일키지만 조합 지원
      }
    };
    
    const result = combinations[first]?.[second] || null;
    
    if (result) {
      Logger.debug(this.componentName, '🔥 복합모음 조합 성공!', {
        first,
        second, 
        result,
        unicodeFirst: `U+${first.charCodeAt(0).toString(16).toUpperCase()}`,
        unicodeSecond: `U+${second.charCodeAt(0).toString(16).toUpperCase()}`,
        unicodeResult: `U+${result.charCodeAt(0).toString(16).toUpperCase()}`
      });
    } else {
      Logger.debug(this.componentName, '❌ 복합모음 조합 불가', {
        first,
        second,
        availableCombinations: Object.keys(combinations[first] || {})
      });
    }
    
    return result;
  }

  /**
   * 🔥 완전한 종성 조합 (모든 한국어 복합종성 지원!)
   */
  private combineFinals(first: string, second: string): string | null {
    const combinations: Record<string, Record<string, string>> = {
      // 🔥 ㄱ 계열 복합종성
      'ㄱ': { 
        'ㅅ': 'ㄳ'    // ㄱ + ㅅ = ㄳ (gs)
      },
      
      // 🔥 ㄴ 계열 복합종성 (2개)
      'ㄴ': { 
        'ㅈ': 'ㄵ',   // ㄴ + ㅈ = ㄵ (nj)
        'ㅎ': 'ㄶ'    // ㄴ + ㅎ = ㄶ (nh)
      },
      
      // 🔥 ㄹ 계열 복합종성 (8개) - 가장 많은 조합!
      'ㄹ': { 
        'ㄱ': 'ㄺ',   // ㄹ + ㄱ = ㄺ (lg)
        'ㅁ': 'ㄻ',   // ㄹ + ㅁ = ㄻ (lm)
        'ㅂ': 'ㄼ',   // ㄹ + ㅂ = ㄼ (lb)
        'ㅅ': 'ㄽ',   // ㄹ + ㅅ = ㄽ (ls)
        'ㅌ': 'ㄾ',   // ㄹ + ㅌ = ㄾ (lt)
        'ㅍ': 'ㄿ',   // ㄹ + ㅍ = ㄿ (lp)
        'ㅎ': 'ㅀ'    // ㄹ + ㅎ = ㅀ (lh)
      },
      
      // 🔥 ㅂ 계열 복합종성
      'ㅂ': { 
        'ㅅ': 'ㅄ'    // ㅂ + ㅅ = ㅄ (bs)
      }
    };

    const result = combinations[first]?.[second] || null;
    
    if (result) {
      Logger.debug(this.componentName, '🔥 복합종성 조합 성공!', {
        first,
        second,
        result,
        composition: `${first} + ${second} = ${result}`
      });
    } else {
      Logger.debug(this.componentName, '❌ 복합종성 조합 불가', {
        first,
        second,
        availableCombinations: Object.keys(combinations[first] || {})
      });
    }

    return result;
  }

  /**
   * 문자 타입 확인 메서드들
   */
  private isHangulChar(char: string): boolean {
    const code = char.charCodeAt(0);
    return (code >= 0x1100 && code <= 0x11FF) || // 한글 자모
           (code >= 0x3130 && code <= 0x318F) || // 한글 호환 자모
           (code >= 0xAC00 && code <= 0xD7AF);   // 한글 음절
  }

  private isInitial(char: string): boolean {
    return INITIALS.includes(char);
  }

  private isMedial(char: string): boolean {
    return MEDIALS.includes(char);
  }

  private isFinal(char: string): boolean {
    return FINALS.includes(char);
  }

  /**
   * 빈 상태 생성
   */
  private createEmptyState(): HangulCompositionState {
    return {
      isComposing: false,
      initial: '',
      medial: '',
      final: '',
      composed: '',
    };
  }

  /**
   * 조합 타임아웃 설정 (일정 시간 후 자동 완료)
   */
  private setCompositionTimeout(): void {
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
    }

    this.compositionTimeout = setTimeout(() => {
      if (this.compositionState.isComposing) {
        this.finishComposition();
      }
    }, 2000); // 2초 후 자동 완료
  }

  /**
   * 현재 조합 상태 반환
   */
  public getCompositionState(): HangulCompositionState {
    return { ...this.compositionState };
  }

  /**
   * 조합 상태 리셋
   */
  public resetComposition(): void {
    this.compositionState = this.createEmptyState();
    if (this.compositionTimeout) {
      clearTimeout(this.compositionTimeout);
      this.compositionTimeout = null;
    }
    Logger.debug(this.componentName, 'Composition state reset');
  }

  /**
   * 🔥 기가차드 개선: 새로운 조합으로 완전히 리셋
   */
  private resetToNewComposition(initialChar: string): void {
    this.compositionState.isComposing = true;
    this.compositionState.initial = initialChar;
    this.compositionState.medial = '';
    this.compositionState.final = '';
    this.compositionState.composed = initialChar;
    
    Logger.debug(this.componentName, '🔥 새로운 조합 시작', {
      initialChar,
      newState: {
        isComposing: this.compositionState.isComposing,
        initial: this.compositionState.initial,
        medial: this.compositionState.medial,
        final: this.compositionState.final,
        composed: this.compositionState.composed
      }
    });
  }

  /**
   * 헬스 체크 (BaseManager 오버라이드)
   */
  public async healthCheck(): Promise<{
    healthy: boolean;
    uptime?: number;
    lastError?: string;
    isComposing: boolean;
    keyMappingCount: number;
  }> {
    const baseHealth = await super.healthCheck();
    
    return {
      ...baseHealth,
      isComposing: this.compositionState.isComposing,
      keyMappingCount: this.keyMap.size,
    };
  }

  /**
   * 쌍자음 확인
   */
  private isDoubleConsonant(char: string): boolean {
    const doubleConsonants = ['ㄲ', 'ㄸ', 'ㅃ', 'ㅆ', 'ㅉ'];
    return doubleConsonants.includes(char);
  }

  /**
   * 🔥 완성형 한글 문자 확인 (macOS IME 처리용)
   */
  private isCompleteHangul(char: string): boolean {
    if (!char || char.length !== 1) return false;
    const charCode = char.charCodeAt(0);
    // 한글 완성형 유니코드 범위: AC00-D7AF
    return charCode >= 0xAC00 && charCode <= 0xD7AF;
  }

  /**
   * 🔥 유효하지 않은 키인지 판별 (숫자, 특수문자 등)
   */
  private isInvalidKey(key: string): boolean {
    if (!key || key.length !== 1) return true;
    
    const charCode = key.charCodeAt(0);
    
    // 숫자 키 (0-9)
    if (charCode >= 48 && charCode <= 57) {
      Logger.debug(this.componentName, '🔢 숫자키는 한글 처리 제외', { key, charCode, isValid: false });
      return true;
    }
    
    // 특수문자 범위 (다양한 특수문자들)
    if ((charCode >= 32 && charCode <= 47) ||   // 스페이스, !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /
        (charCode >= 58 && charCode <= 64) ||   // :, ;, <, =, >, ?, @
        (charCode >= 91 && charCode <= 96) ||   // [, \, ], ^, _, `
        (charCode >= 123 && charCode <= 126)) { // {, |, }, ~
      Logger.debug(this.componentName, '❌ 특수문자 키 감지', { key, charCode });
      return true;
    }
    
    return false;
  }
}

export const hangulComposer = new HangulComposer();
export default hangulComposer;
