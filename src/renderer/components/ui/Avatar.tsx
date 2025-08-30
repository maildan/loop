'use client';

import { ReactNode, forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { Logger } from '../../../shared/logger';

// 🔥 기가차드 규칙: 프리컴파일된 스타일 상수
const AVATAR_STYLES = {
  root: 'relative inline-flex items-center justify-center overflow-hidden rounded-full select-none',
  sizes: {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  },
  image: 'aspect-square h-full w-full object-cover object-center',
  fallback: 'flex h-full w-full items-center justify-center bg-slate-100 text-slate-600 font-medium',
  icon: 'h-1/2 w-1/2 text-slate-400',
  status: {
    base: 'absolute bottom-0 right-0 rounded-full border-2 border-white',
    sizes: {
      sm: 'h-2 w-2',
      md: 'h-2.5 w-2.5',
      lg: 'h-3 w-3',
      xl: 'h-4 w-4',
    },
    variants: {
      online: 'bg-green-500',
      away: 'bg-yellow-500',
      busy: 'bg-red-500',
      offline: 'bg-slate-400',
    },
  },
} as const;

// 🔥 기가차드 규칙: 명시적 타입 정의
export interface AvatarProps {
  readonly size?: keyof typeof AVATAR_STYLES.sizes;
  readonly src?: string;
  readonly alt?: string;
  readonly fallback?: string;
  readonly status?: keyof typeof AVATAR_STYLES.status.variants;
  readonly className?: string;
  readonly children?: ReactNode;
  readonly onClick?: () => void;
  readonly 'aria-label'?: string;
}

export interface AvatarImageProps {
  readonly src: string;
  readonly alt: string;
  readonly className?: string;
  readonly onLoadingStatusChange?: (loading: boolean) => void;
}

export interface AvatarFallbackProps {
  readonly className?: string;
  readonly children: ReactNode;
}

function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({
    size = 'md',
    src,
    alt,
    fallback,
    status,
    className,
    children,
    onClick,
    'aria-label': ariaLabel,
    ...props
  }, ref) => {

    const [imageLoaded, setImageLoaded] = useState<boolean>(false);
    const [imageError, setImageError] = useState<boolean>(false);

    const avatarClassName = cn(
      AVATAR_STYLES.root,
      AVATAR_STYLES.sizes[size],
      onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
      className
    );

    const handleClick = (): void => {
      if (!onClick) return;

      Logger.info('AVATAR', 'Avatar clicked', { size, hasImage: !!src });
      onClick();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
      if (!onClick) return;

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    };

    const showImage = src && !imageError && imageLoaded;
    const showFallback = !src || imageError || !imageLoaded;

    return (
      <div
        ref={ref}
        className={avatarClassName}
        onClick={onClick ? handleClick : undefined}
        onKeyDown={onClick ? handleKeyDown : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={ariaLabel || alt}
        {...props}
      >
        {/* 이미지 */}
        {src && (
          <img
            src={src}
            alt={alt || '사용자 아바타'}
            className={cn(
              AVATAR_STYLES.image,
              showImage ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => {
              setImageLoaded(true);
              setImageError(false);
            }}
            onError={() => {
              setImageError(true);
              setImageLoaded(false);
            }}
          />
        )}

        {/* 폴백 */}
        {showFallback && (
          <div className={AVATAR_STYLES.fallback}>
            {children || fallback ? (
              children || fallback
            ) : (
              <User className={AVATAR_STYLES.icon} aria-hidden="true" />
            )}
          </div>
        )}

        {/* 상태 표시 */}
        {status && (
          <span
            className={cn(
              AVATAR_STYLES.status.base,
              AVATAR_STYLES.status.sizes[size],
              AVATAR_STYLES.status.variants[status]
            )}
            aria-label={`상태: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export const AvatarImage = forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, className, onLoadingStatusChange, ...props }, ref) => {

    const handleLoad = (): void => {
      onLoadingStatusChange?.(false);
    };

    const handleError = (): void => {
      onLoadingStatusChange?.(false);
    };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        className={cn(AVATAR_STYLES.image, className)}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
  }
);

AvatarImage.displayName = 'AvatarImage';

export const AvatarFallback = forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(AVATAR_STYLES.fallback, className)}
        {...props}
      >
        {children || <User className={AVATAR_STYLES.icon} aria-hidden="true" />}
      </div>
    );
  }
);

AvatarFallback.displayName = 'AvatarFallback';
