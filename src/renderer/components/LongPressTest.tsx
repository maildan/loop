// 🔥 롱프레스 테스트 컴포넌트

import React from 'react';
import { useLongPress } from '../hooks/useLongPress';
import { Logger } from '../../shared/logger';

export function LongPressTest(): React.ReactElement {
    const longPressHandlers1 = useLongPress({
        onLongPress: () => {
            alert('🔥 롱프레스 성공! (500ms)');
        },
        onShortPress: () => {
            Logger.debug('LONGPRESS_TEST', '짧은 클릭 2');
        },
        delay: 500
    });

    const longPressHandlers2 = useLongPress({
        onLongPress: () => {
            alert('🔥🔥 롱프레스 성공! (1000ms)');
        },
        onShortPress: () => {
            console.log('짧은 클릭 2');
        },
        delay: 1000
    });

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-2xl font-bold">롱프레스 테스트</h1>

            <div className="space-y-4">
                <div
                    className="p-6 bg-blue-100 border-2 border-blue-300 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors select-none"
                    {...longPressHandlers1}
                >
                    <h3 className="font-semibold">500ms 롱프레스 테스트</h3>
                    <p className="text-sm text-gray-600">이 영역을 0.5초 동안 눌러보세요</p>
                </div>

                <div
                    className="p-6 bg-green-100 border-2 border-green-300 rounded-lg cursor-pointer hover:bg-green-200 transition-colors select-none"
                    {...longPressHandlers2}
                >
                    <h3 className="font-semibold">1000ms 롱프레스 테스트</h3>
                    <p className="text-sm text-gray-600">이 영역을 1초 동안 눌러보세요</p>
                </div>
            </div>

            <div className="text-sm text-gray-500">
                <p>• 짧게 클릭하면 콘솔에 로그가 출력됩니다</p>
                <p>• 길게 누르면 알림이 표시됩니다</p>
                <p>• 개발자 도구 콘솔을 확인해보세요</p>
            </div>
        </div>
    );
}
