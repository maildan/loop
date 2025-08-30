'use client';

import { Settings, Keyboard, Palette, Cpu } from 'lucide-react';
import type { SettingSectionDefinition } from '../types';

// 🔥 기가차드 Settings 섹션 정의 - 메모이제이션 최적화

/**
 * 🎯 Settings 섹션 목록 (메모이제이션됨)
 * - 런타임에 객체 생성하지 않도록 상수로 정의
 * - 타입 안전성 보장
 */
export const SETTING_SECTIONS: readonly SettingSectionDefinition[] = [
  { id: 'app', label: '앱 설정', icon: Settings },
  { id: 'keyboard', label: '키보드', icon: Keyboard },
  { id: 'ui', label: 'UI/UX', icon: Palette },
  { id: 'performance', label: '성능', icon: Cpu },
] as const;

/**
 * 🔥 섹션별 설명
 */
export const SECTION_DESCRIPTIONS = {
  app: '앱의 기본 동작과 외관을 설정합니다',
  keyboard: '키보드 모니터링 및 입력 설정을 관리합니다',
  ui: '사용자 인터페이스와 테마를 사용자 정의합니다',
  performance: '시스템 성능과 리소스 사용량을 최적화합니다',
} as const;

/**
 * 🔥 테마 옵션
 */
export const THEME_OPTIONS = [
  { value: 'light' as const, label: '라이트 모드' },
  { value: 'dark' as const, label: '다크 모드' },
  { value: 'system' as const, label: '시스템 설정 따르기' },
] as const;

/**
 * 🔥 언어 옵션
 */
export const LANGUAGE_OPTIONS = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
  { value: 'zh', label: '中文' },
] as const;

/**
 * 🔥 키보드 언어 옵션
 */
export const KEYBOARD_LANGUAGE_OPTIONS = [
  { value: 'korean', label: '한국어' },
  { value: 'english', label: 'English' },
  { value: 'japanese', label: '日本語' },
  { value: 'chinese', label: '中文' },
] as const;

/**
 * 🔥 폰트 패밀리 옵션
 */
export const FONT_FAMILY_OPTIONS = [
  { 
    value: 'Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
    label: 'Pretendard (기본)' 
  },
  { 
    value: '-apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
    label: '시스템 폰트' 
  },
  { 
    value: 'SF Pro Display, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
    label: 'SF Pro Display' 
  },
  { 
    value: 'Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
    label: 'Inter' 
  },
  { 
    value: 'Noto Sans KR, -apple-system, BlinkMacSystemFont, system-ui, sans-serif', 
    label: 'Noto Sans KR' 
  },
] as const;

/**
 * 🔥 폰트 크기 옵션
 */
export const FONT_SIZE_OPTIONS = [
  { value: 12, label: '12px (작음)' },
  { value: 14, label: '14px (기본)' },
  { value: 16, label: '16px (보통)' },
  { value: 18, label: '18px (큼)' },
  { value: 20, label: '20px (매우 큼)' },
] as const;

/**
 * 🔥 세션 타임아웃 옵션 (분)
 */
export const SESSION_TIMEOUT_OPTIONS = [
  { value: 15, label: '15분' },
  { value: 30, label: '30분' },
  { value: 60, label: '1시간' },
  { value: 120, label: '2시간' },
  { value: 0, label: '제한 없음' },
] as const;

/**
 * 🔥 CPU 사용량 제한 옵션 (%)
 */
export const CPU_USAGE_OPTIONS = [
  { value: 50, label: '50%' },
  { value: 70, label: '70%' },
  { value: 80, label: '80%' },
  { value: 90, label: '90%' },
  { value: 100, label: '제한 없음' },
] as const;

/**
 * 🔥 메모리 사용량 제한 옵션 (MB)
 */
export const MEMORY_USAGE_OPTIONS = [
  { value: 1024, label: '1GB' },
  { value: 2048, label: '2GB' },
  { value: 4096, label: '4GB' },
  { value: 8192, label: '8GB' },
  { value: 16384, label: '16GB' },
] as const;
