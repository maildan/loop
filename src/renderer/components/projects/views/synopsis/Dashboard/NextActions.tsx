'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, Target, CheckCircle } from 'lucide-react';

interface NextAction {
    id: string;
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    icon: React.ReactNode;
    action: () => void;
}

interface NextActionsProps {
    actions: NextAction[];
}

/**
 * 🎯 NextActions - "다음에 뭘 해야 할까?" 섹션
 * 작가가 즉시 해야 할 액션을 우선순위순으로 표시
 */
export const NextActions: React.FC<NextActionsProps> = ({ actions }) => {
    const getPriorityColor = (priority: NextAction['priority']) => {
        switch (priority) {
            case 'high': return 'bg-red-500/10 border-red-500/30 text-red-500';
            case 'medium': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
            case 'low': return 'bg-blue-500/10 border-blue-500/30 text-blue-500';
        }
    };

    const getPriorityLabel = (priority: NextAction['priority']) => {
        switch (priority) {
            case 'high': return '긴급';
            case 'medium': return '중요';
            case 'low': return '일반';
        }
    };

    if (actions.length === 0) {
        return (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-6 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
                <p className="text-lg font-semibold text-foreground">
                    완벽합니다! 🎉
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                    현재 처리할 액션이 없습니다. 계속 좋은 작업하세요!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                다음 해야 할 일
            </h3>
            <div className="space-y-2">
                {actions.slice(0, 3).map((action) => (
                    <button
                        key={action.id}
                        onClick={action.action}
                        className={`w-full rounded-lg border p-4 text-left transition-all hover:scale-[1.02] ${getPriorityColor(action.priority)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                                {action.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-semibold text-foreground">
                                        {action.title}
                                    </span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(action.priority)}`}>
                                        {getPriorityLabel(action.priority)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {action.description}
                                </p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};
