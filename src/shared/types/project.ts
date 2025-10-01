/**
 * Project-related types for renderer components
 * Based on Prisma schema models
 */

export interface Project {
  id: string;
  title: string;
  description?: string;
  content?: string;
  chapters?: string; // JSON string
  genre: string;
  status: string;
  progress: number;
  wordCount: number;
  author: string;
  platform: string;
  userId?: string;
  createdAt: Date;
  lastModified: Date;
  characters?: ProjectCharacter[];
  structure?: ProjectStructure[];
  notes?: ProjectNote[];
}

export interface ProjectCharacter {
  id: string;
  projectId: string;
  name: string;
  role: string;
  description?: string;
  notes?: string;
  appearance?: string;
  personality?: string;
  background?: string;
  goals?: string;
  conflicts?: string;
  avatar?: string;
  color: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectStructure {
  id: string;
  projectId: string;
  type: string;
  title: string;
  description?: string;
  content?: string;
  status: string;
  wordCount: number;
  sortOrder: number;
  parentId?: string;
  depth: number;
  color: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  parent?: ProjectStructure;
  children?: ProjectStructure[];
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  type: string;
  tags?: unknown; // JSON field from Prisma
  color: string;
  isPinned: boolean;
  isArchived: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}