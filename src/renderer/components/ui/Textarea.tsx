'use client';

import { forwardRef, useState, useRef, useEffect, useId } from 'react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TEXTAREA_STYLES = {
  base: 'flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
  sizes: {
    sm: 'min-h-[60px] text-xs',
    md: 'min-h-[80px] text-sm',
    lg: 'min-h-[120px] text-base',
  },
  variants: {
    default: 'border-slate-300 focus:ring-blue-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
  },
  resize: {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  },
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  readonly size?: keyof typeof TEXTAREA_STYLES.sizes;
  readonly variant?: keyof typeof TEXTAREA_STYLES.variants;
  readonly resize?: keyof typeof TEXTAREA_STYLES.resize;
  readonly autoResize?: boolean;
  readonly maxLength?: number;
  readonly showCount?: boolean;
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly required?: boolean;
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({
    className,
    size = 'md',
    variant = 'default',
    resize = 'vertical',
    autoResize = false,
    maxLength,
    showCount = false,
    label,
    error,
    helperText,
    required = false,
    disabled,
    value,
    onChange,
    onFocus,
    onBlur,
    ...props
  }, ref) => {

    const [focused, setFocused] = useState<boolean>(false);
    const [charCount, setCharCount] = useState<number>(0);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 🔥 기가차드 규칙: ref 병합
    useEffect(() => {
      if (ref && typeof ref === 'function') {
        ref(textareaRef.current);
      } else if (ref) {
        ref.current = textareaRef.current;
      }
    }, [ref]);

    // 자동 리사이즈 처리
    useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }, [value, autoResize]);

    // 문자 수 업데이트
    useEffect(() => {
      if (typeof value === 'string') {
        setCharCount(value.length);
      }
    }, [value]);

    const textareaClassName = cn(
      TEXTAREA_STYLES.base,
      TEXTAREA_STYLES.sizes[size],
      TEXTAREA_STYLES.variants[error ? 'error' : variant],
      TEXTAREA_STYLES.resize[resize],
      autoResize && 'overflow-hidden',
      className
    );

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
      const newValue = event.target.value;

      // maxLength 체크
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setCharCount(newValue.length);

      if (onChange) {
        onChange(event);
        Logger.debug('TEXTAREA', 'Value changed', {
          length: newValue.length,
          maxLength,
          autoResize
        });
      }

      // 자동 리사이즈
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };

    const handleFocus = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
      setFocused(true);
      onFocus?.(event);
      Logger.debug('TEXTAREA', 'Focused');
    };

    const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement>): void => {
      setFocused(false);
      onBlur?.(event);
      Logger.debug('TEXTAREA', 'Blurred');
    };

    const _uid = useId();
    const labelId = label ? `textarea-${_uid}-label` : undefined;
    const errorId = error ? `textarea-${_uid}-error` : undefined;
    const helperId = helperText ? `textarea-${_uid}-helper` : undefined;

    return (
      <div className="w-full">
        {/* 라벨 */}
        {label && (
          <label
            id={labelId}
            htmlFor={props.id}
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Textarea */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            className={textareaClassName}
            disabled={disabled}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            aria-labelledby={labelId}
            aria-describedby={cn(
              errorId && errorId,
              helperId && helperId
            ) || undefined}
            aria-invalid={!!error}
            aria-required={required}
            {...props}
          />

          {/* 문자 수 표시 */}
          {(showCount || maxLength) && (
            <div className="absolute bottom-2 right-2 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-1 rounded">
              {charCount}{maxLength && `/${maxLength}`}
            </div>
          )}
        </div>

        {/* 에러 메시지 */}
        {error && (
          <p
            id={errorId}
            className="mt-2 text-sm text-red-600 dark:text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* 도움말 텍스트 */}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-2 text-sm text-slate-500 dark:text-slate-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
