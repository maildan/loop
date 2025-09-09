'use client';

import React from 'react';
import { Map } from 'lucide-react';
import { ProjectElement } from '../../../../hooks/useProjectData';

interface OutlinePanelProps {
    elements: ProjectElement[];
}

export const OutlinePanel: React.FC<OutlinePanelProps> = ({ elements }) => {
    return (
        <div className="flex-1 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Map className="h-5 w-5 mr-2" />
                아웃라인 뷰
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {elements.map((element) => (
                    <div
                        key={element.id}
                        className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium truncate">{element.title}</h3>
                            <div className={`w-3 h-3 rounded-full ${element.plotRelevance && element.plotRelevance >= 4
                                ? 'bg-red-500'
                                : element.plotRelevance && element.plotRelevance >= 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}></div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                            {element.content}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{element.type}</span>
                            <span>중요도 {element.plotRelevance}/5</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
