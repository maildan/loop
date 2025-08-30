'use client';

import { forwardRef, useState, ReactNode, useId } from 'react';
import { Eye, EyeOff, Search, X } from 'lucide-react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const INPUT_STYLES = {
  base: 'flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-blue-400',
  sizes: {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  },
  variants: {
    default: 'border-slate-300 focus:ring-blue-500',
    error: 'border-red-300 focus:ring-red-500 focus:border-red-500',
    success: 'border-green-300 focus:ring-green-500 focus:border-green-500',
  },
  withIcon: {
    left: 'pl-10',
    right: 'pr-10',
  },
  container: 'relative w-full',
  iconContainer: {
    left: 'absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500',
    right: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500',
  },
  iconButton: 'absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer transition-colors',
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  readonly size?: keyof typeof INPUT_STYLES.sizes;
  readonly variant?: keyof typeof INPUT_STYLES.variants;
  readonly leftIcon?: ReactNode;
  readonly rightIcon?: ReactNode;
  readonly clearable?: boolean;
  readonly label?: string;
  readonly error?: string;
  readonly helperText?: string;
  readonly required?: boolean;
  readonly onClear?: () => void;
}

function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type = 'text',
    size = 'md',
    variant = 'default',
    leftIcon,
    rightIcon,
    clearable = false,
    label,
    error,
    helperText,
    required = false,
    disabled,
    value,
    onChange,
    onClear,
    ...props
  }, ref) => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [focused, setFocused] = useState<boolean>(false);

    const isPassword = type === 'password';
    const hasValue = value !== undefined && value !== '';
    const showClearButton = clearable && hasValue && !disabled;
    const showPasswordToggle = isPassword && !disabled;

    const inputClassName = cn(
      INPUT_STYLES.base,
      INPUT_STYLES.sizes[size],
      INPUT_STYLES.variants[error ? 'error' : variant],
      leftIcon ? INPUT_STYLES.withIcon.left : false,
      (rightIcon || showClearButton || showPasswordToggle) ? INPUT_STYLES.withIcon.right : false,
      className
    );

    const handleClear = (): void => {
      if (onClear) {
        onClear();
      } else if (onChange) {
        // 클리어 이벤트 시뮬레이션
        const event = {
          target: { value: '' },
          currentTarget: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }
      Logger.debug('INPUT', 'Input cleared');
    };

    const togglePasswordVisibility = (): void => {
      setShowPassword(!showPassword);
      Logger.debug('INPUT', `Password visibility toggled: ${!showPassword}`);
    };

    const handleFocus = (event: React.FocusEvent<HTMLInputElement>): void => {
      setFocused(true);
      props.onFocus?.(event);
    };

    const handleBlur = (event: React.FocusEvent<HTMLInputElement>): void => {
      setFocused(false);
      props.onBlur?.(event);
    };

    const actualType = isPassword && showPassword ? 'text' : type;

    const _uid = useId();
    const labelId = label ? `input-${_uid}-label` : undefined;
    const errorId = error ? `input-${_uid}-error` : undefined;
    const helperId = helperText ? `input-${_uid}-helper` : undefined;

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

        {/* Input Container */}
        <div className={INPUT_STYLES.container}>
          {/* 좌측 아이콘 */}
          {leftIcon && (
            <div className={INPUT_STYLES.iconContainer.left}>
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            type={actualType}
            className={inputClassName}
            disabled={disabled}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            aria-labelledby={labelId}
            aria-describedby={cn(
              errorId && errorId,
              helperId && helperId
            ) || undefined}
            aria-invalid={!!error}
            aria-required={required}
            {...props}
          />

          {/* 우측 액션 버튼들 */}
          <div className={INPUT_STYLES.iconContainer.right}>
            <div className="flex items-center gap-1">
              {/* 클리어 버튼 */}
              {showClearButton && (
                <button
                  type="button"
                  className={cn(INPUT_STYLES.iconButton, 'p-0.5')}
                  onClick={handleClear}
                  aria-label="입력 내용 지우기"
                  tabIndex={-1}
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* 패스워드 토글 */}
              {showPasswordToggle && (
                <button
                  type="button"
                  className={cn(INPUT_STYLES.iconButton, 'p-0.5')}
                  onClick={togglePasswordVisibility}
                  aria-label={showPassword ? '패스워드 숨기기' : '패스워드 보기'}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              )}

              {/* 우측 아이콘 */}
              {rightIcon && !showClearButton && !showPasswordToggle && rightIcon}
            </div>
          </div>
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

Input.displayName = 'Input';

// 🔥 검색 전용 Input 컴포넌트
export const SearchInput = forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
  (props, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        leftIcon={<Search className="h-4 w-4" />}
        placeholder="검색..."
        clearable
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';
