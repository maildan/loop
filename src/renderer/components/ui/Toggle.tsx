'use client';

import { useState } from 'react';
import { cn } from '../../lib/utils';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const TOGGLE_STYLES = {
  container: 'relative inline-flex cursor-pointer items-center',
  track: 'h-6 w-11 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2',
  trackColors: {
    enabled: 'bg-blue-600 focus:ring-blue-500',
    disabled: 'bg-gray-200 focus:ring-gray-500'
  },
  thumb: 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition-transform duration-200 ease-in-out',
  thumbPositions: {
    enabled: 'translate-x-5',
    disabled: 'translate-x-0'
  },
  label: 'ml-3 text-sm font-medium text-gray-700',
  description: 'ml-3 text-sm text-gray-500'
} as const;

export interface ToggleProps {
  readonly id?: string;
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly description?: string;
  readonly className?: string;
  readonly onChange?: (checked: boolean) => void;
  readonly 'aria-label'?: string;
  readonly 'aria-describedby'?: string;
}

export function Toggle({ 
  id,
  checked: controlledChecked,
  defaultChecked = false,
  disabled = false,
  label,
  description,
  className,
  onChange,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy
}: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  
  // 🔥 기가차드 규칙: controlled vs uncontrolled 패턴
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleToggle = (): void => {
    if (disabled) return;
    
    const newValue = !checked;
    
    if (!isControlled) {
      setInternalChecked(newValue);
    }
    
    onChange?.(newValue);
  };

  const trackClassName = cn(
    TOGGLE_STYLES.track,
    checked ? TOGGLE_STYLES.trackColors.enabled : TOGGLE_STYLES.trackColors.disabled,
    disabled && 'opacity-50 cursor-not-allowed'
  );

  const thumbClassName = cn(
    TOGGLE_STYLES.thumb,
    checked ? TOGGLE_STYLES.thumbPositions.enabled : TOGGLE_STYLES.thumbPositions.disabled
  );

  const containerClassName = cn(
    TOGGLE_STYLES.container,
    disabled && 'cursor-not-allowed',
    className
  );

  return (
    <div className={containerClassName}>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        aria-label={ariaLabel || label}
        aria-describedby={ariaDescribedBy}
        disabled={disabled}
        className={trackClassName}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
      >
        <span className={thumbClassName} aria-hidden="true" />
      </button>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label htmlFor={id} className={TOGGLE_STYLES.label}>
              {label}
            </label>
          )}
          {description && (
            <span className={TOGGLE_STYLES.description} id={ariaDescribedBy}>
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
