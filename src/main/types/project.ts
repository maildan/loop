// 🔥 프로젝트 관련 타입 정의

export interface IdeaItem {
    id: string;
    title: string;
    content: string;
    category: 'character' | 'setting' | 'plot' | 'dialogue' | 'theme' | 'other';
    stage: 'initial' | 'developing' | 'concrete' | 'applied';
    tags: string[];
    priority: 'low' | 'medium' | 'high';
    connections: string[];
    attachments: string[];
    notes: string;
    isFavorite: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface PlotPoint {
    id: string;
    act: 1 | 2 | 3;
    title: string;
    description: string;
    type: 'setup' | 'conflict' | 'resolution' | 'twist' | 'climax';
    characters: string[];
    location?: string;
    notes?: string;
    order: number;
    duration?: number;
    importance: 'low' | 'medium' | 'high';
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectData {
    id: string;
    title: string;
    description?: string;
    content?: string;
    genre: string;
    status: 'active' | 'completed' | 'paused';
    progress: number;
    wordCount: number;
    author: string;
    platform: 'loop' | 'google-docs' | 'import';
    createdAt: Date;
    lastModified: Date;
}
