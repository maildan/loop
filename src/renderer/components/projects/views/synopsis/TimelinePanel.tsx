'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { ProjectAnalysis } from '../../../../hooks/useProjectData';

interface TimelinePanelProps {
    analysis: ProjectAnalysis;
}

export const TimelinePanel: React.FC<TimelinePanelProps> = ({ analysis }) => {
    return (
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                타임라인 뷰
            </h2>
            <div className="space-y-4">
                {analysis.timeline.map((item, index) => (
                    <div key={item.id} className="flex items-start space-x-4">
                        <div className="flex flex-col items-center">
                            <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                            {index < analysis.timeline.length - 1 && (
                                <div className="w-0.5 h-16 bg-gray-300 dark:bg-gray-600 mt-2"></div>
                            )}
                        </div>
                        <div className="flex-1 pb-8">
                            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{item.title}</h3>
                                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                                        {item.type}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {item.description}
                                </p>
                                <div className="text-xs text-gray-500">
                                    {new Date(item.timestamp).toLocaleDateString('ko-KR')}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
