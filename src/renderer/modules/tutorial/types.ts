/**
 * 🔥 Loop 튜토리얼 시스템 타입 정의
 * Sequential Thinking + Type-safe 규칙 준수
 */

import type { DriveStep } from 'driver.js';

/**
 * 튜토리얼 단계 설정 (Driver.js DriveStep 확장)
 */
export interface TutorialStepConfig extends Omit<DriveStep, 'popover'> {
  /**
   * 단계 ID (유일해야 함)
   * @example 'dashboard-welcome', 'kpi-intro', 'quickstart-create'
   */
  readonly stepId: string;

  /**
   * 팝오버 설정 (Driver.js Popover)
   */
  readonly popover: {
    readonly title?: string;
    readonly description?: string;
    readonly side?: 'top' | 'right' | 'bottom' | 'left';
    readonly align?: 'start' | 'center' | 'end';
    readonly showButtons?: ('next' | 'previous' | 'close')[];
    readonly nextBtnText?: string;
    readonly prevBtnText?: string;
    readonly doneBtnText?: string;
    readonly showProgress?: boolean;
    readonly progressText?: string;
  };

  /**
   * 선택적: 이 단계에서 사용자 상호작용 방지
   */
  readonly disableActiveInteraction?: boolean;
}

/**
 * 완전한 튜토리얼 정의
 */
export interface Tutorial {
  /**
   * 튜토리얼 ID (유일해야 함)
   * @example 'dashboard-intro', 'project-creation', 'analysis-tutorial'
   */
  readonly id: string;

  /**
   * 튜토리얼 이름 (UI에서 표시)
   * @example '대시보드 시작 가이드'
   */
  readonly name: string;

  /**
   * 튜토리얼 설명
   */
  readonly description: string;

  /**
   * 튜토리얼 단계 배열
   */
  readonly steps: readonly TutorialStepConfig[];

  /**
   * 선택적: 튜토리얼 시작 전 콜백
   */
  readonly onStart?: () => void | Promise<void>;

  /**
   * 선택적: 튜토리얼 완료 시 콜백
   */
  readonly onComplete?: () => void | Promise<void>;

  /**
   * 선택적: 튜토리얼 스킵 시 콜백
   */
  readonly onSkip?: () => void | Promise<void>;

  /**
   * 선택적: 튜토리얼 메타 정보 (자동 진행 등)
   */
  readonly meta?: {
    /**
     * 자동 진행 여부 (버튼 없이 일정 시간마다 자동으로 다음 단계)
     */
    readonly autoProgress?: boolean;

    /**
     * 자동 진행 딜레이 (밀리초)
     * @default 3000
     */
    readonly autoProgressDelay?: number;

    /**
     * 다음 튜토리얼 ID (링크된 튜토리얼)
     * @example 'project-creator' (대시보드 → 프로젝트 생성)
     */
    readonly nextTutorialId?: string;

    /**
     * 다음 튜토리얼에서 시작할 스텝 ID
     * @default 첫 번째 스텝
     */
    readonly nextStepId?: string;

    /**
     * 이 튜토리얼 완료 후 복귀할 튜토리얼 ID
     * @example 'dashboard-intro' (프로젝트 생성 완료 후)
     */
    readonly returnTutorialId?: string;

    /**
     * 복귀할 튜토리얼의 스텝 ID
     * @example 'action-import'
     */
    readonly returnStepId?: string;
  };
}

/**
 * 튜토리얼 상태 (Context에서 관리)
 */
export interface TutorialState {
  /**
   * 현재 활성화된 튜토리얼 ID (null이면 비활성)
   */
  readonly currentTutorialId: string | null;

  /**
   * 현재 튜토리얼의 스텝 인덱스
   */
  readonly currentStepIndex: number;

  /**
   * 튜토리얼 진행 중 여부
   */
  readonly isActive: boolean;

  /**
   * 완료된 튜토리얼 ID 배열 (localStorage 동기화)
   */
  readonly completedTutorials: readonly string[];

  /**
   * 튜토리얼별 진행도 (단계 저장)
   * @example { 'dashboard-intro': 3, 'project-creation': 1 }
   */
  readonly tutorialProgress: Readonly<Record<string, number>>;
}

/**
 * 튜토리얼 Context 값
 */
export interface TutorialContextValue extends TutorialState {
  /**
   * 튜토리얼 시작
   * @param tutorialId 시작할 튜토리얼 ID
   */
  startTutorial: (tutorialId: string) => Promise<void>;

  /**
   * 다음 단계로 이동
   */
  nextStep: () => Promise<void>;

  /**
   * 이전 단계로 이동
   */
  previousStep: () => Promise<void>;

  /**
   * 특정 단계로 이동
   */
  goToStep: (stepIndex: number) => Promise<void>;

  /**
   * 튜토리얼 완료
   */
  completeTutorial: () => Promise<void>;

  /**
   * 튜토리얼 스킵
   */
  skipTutorial: () => Promise<void>;

  /**
   * 튜토리얼 닫기
   */
  closeTutorial: () => void;

  /**
   * 튜토리얼 재설정 (진행도 삭제)
   */
  resetTutorial: (tutorialId?: string) => Promise<void>;
}

/**
 * Driver.js 드라이버 인스턴스 타입 (선택적 내부 사용)
 */
export interface TutorialDriver {
  readonly drive: (stepIndex?: number) => void;
  readonly destroy: () => void;
  readonly moveNext: () => Promise<void>;
  readonly movePrevious: () => Promise<void>;
  readonly moveTo: (stepIndex: number) => Promise<void>;
  readonly getActiveIndex: () => number;
  readonly isActive: () => boolean;
  readonly refresh: () => void;
}
