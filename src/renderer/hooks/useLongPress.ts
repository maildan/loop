// 🔥 롱프레스 훅 - 간단하고 확실한 구현

import { useRef, useCallback } from 'react';
import { Logger } from '../../shared/logger';

interface UseLongPressOptions {
    onLongPress: () => void;
    onShortPress?: () => void;
    delay?: number;
}

interface UseLongPressResult {
    onMouseDown: (event: React.MouseEvent) => void;
    onMouseUp: (event: React.MouseEvent) => void;
    onMouseLeave: (event: React.MouseEvent) => void;
    onTouchStart: (event: React.TouchEvent) => void;
    onTouchEnd: (event: React.TouchEvent) => void;
    onTouchCancel: (event: React.TouchEvent) => void;
}

export function useLongPress({
    onLongPress,
    onShortPress,
    delay = 600
}: UseLongPressOptions): UseLongPressResult {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isLongPressRef = useRef(false);
    const isPressingRef = useRef(false);

    const startPress = useCallback(() => {
        if (isPressingRef.current) return;

        isPressingRef.current = true;
        isLongPressRef.current = false;

        // 롱프레스 타이머 시작
        timeoutRef.current = setTimeout(() => {
            if (isPressingRef.current) {
                isLongPressRef.current = true;
                onLongPress();
                Logger.debug('LONGPRESS', '롱프레스 실행됨!');
            }
        }, delay);

        Logger.debug('LONGPRESS', '롱프레스 시작', { delay });
    }, [onLongPress, delay]);

    const endPress = useCallback(() => {
        if (!isPressingRef.current) return;

        isPressingRef.current = false;

        // 타이머 정리
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // 롱프레스가 실행되지 않았다면 숏프레스 실행
        if (!isLongPressRef.current && onShortPress) {
            onShortPress();
            Logger.debug('LONGPRESS', '숏프레스 실행됨!');
        }

        isLongPressRef.current = false;
    }, [onShortPress]);

    const cancelPress = useCallback(() => {
        isPressingRef.current = false;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        isLongPressRef.current = false;
        Logger.debug('LONGPRESS', '롱프레스 취소됨');
    }, []);

    // 마우스 이벤트 핸들러
    const onMouseDown = useCallback((event: React.MouseEvent) => {
        if (event.button !== 0) return; // 왼쪽 클릭만
        event.preventDefault();
        startPress();
    }, [startPress]);

    const onMouseUp = useCallback((event: React.MouseEvent) => {
        event.preventDefault();
        endPress();
    }, [endPress]);

    const onMouseLeave = useCallback((event: React.MouseEvent) => {
        cancelPress();
    }, [cancelPress]);

    // 터치 이벤트 핸들러
    const onTouchStart = useCallback((event: React.TouchEvent) => {
        if (event.touches.length > 1) return; // 단일 터치만
        event.preventDefault();
        startPress();
    }, [startPress]);

    const onTouchEnd = useCallback((event: React.TouchEvent) => {
        event.preventDefault();
        endPress();
    }, [endPress]);

    const onTouchCancel = useCallback((event: React.TouchEvent) => {
        cancelPress();
    }, [cancelPress]);

    return {
        onMouseDown,
        onMouseUp,
        onMouseLeave,
        onTouchStart,
        onTouchEnd,
        onTouchCancel
    };
}

export default useLongPress;