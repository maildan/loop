'use client';

import React from 'react';

interface CharacterAvatarProps {
    name: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

/**
 * CharacterAvatar - 캐릭터 이름 첫 글자로 아바타 생성
 * 
 * Features:
 * - 한글/영문 첫 글자 표시
 * - 이름 해시 기반 색상 (일관성 유지)
 * - 3가지 사이즈 지원
 */
export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({
    name,
    size = 'md',
    className = '',
}) => {
    // 이름 첫 글자 추출 (한글/영문/숫자)
    const getInitial = (name: string): string => {
        if (!name) return '?';
        const firstChar = name.trim()[0];
        return firstChar?.toUpperCase() || '?';
    };

    // 이름 해시 기반 색상 생성 (동일 이름 = 동일 색상)
    const getColorFromName = (name: string): string => {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        // HSL 색상 생성 (채도 70%, 밝기 45% 고정 → 읽기 좋은 색상)
        const hue = Math.abs(hash) % 360;
        return `hsl(${hue}, 70%, 45%)`;
    };

    // 사이즈별 클래스
    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-12 h-12 text-base',
        lg: 'w-16 h-16 text-xl',
    };

    const initial = getInitial(name);
    const bgColor = getColorFromName(name);

    return (
        <div
            className={`flex items-center justify-center rounded-full font-bold text-white shadow-md ${sizeClasses[size]} ${className}`}
            style={{ backgroundColor: bgColor }}
            title={name}
        >
            {initial}
        </div>
    );
};
