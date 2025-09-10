// 🔥 환경변수 테스트용 컴포넌트
'use client';

import React from 'react';

export const EnvTester = () => {
    const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const geminiModel = process.env.NEXT_PUBLIC_GEMINI_MODEL;

    console.log('🔍 Environment Variables Test:', {
        NEXT_PUBLIC_GEMINI_API_KEY: geminiApiKey ? 'SET' : 'MISSING',
        NEXT_PUBLIC_GEMINI_MODEL: geminiModel || 'MISSING'
    });

    return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-blue-800 mb-2">🔍 Environment Variables Status</h3>
            <div className="space-y-1 text-sm">
                <div>
                    <span className="font-medium">NEXT_PUBLIC_GEMINI_API_KEY:</span>{' '}
                    <span className={geminiApiKey ? 'text-green-600' : 'text-red-600'}>
                        {geminiApiKey ? 'SET' : 'MISSING'}
                    </span>
                </div>
                <div>
                    <span className="font-medium">NEXT_PUBLIC_GEMINI_MODEL:</span>{' '}
                    <span className={geminiModel ? 'text-green-600' : 'text-red-600'}>
                        {geminiModel || 'MISSING'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default EnvTester;
