/**
 * Project-related types for renderer components
 * Based on Prisma schema models
 */

import type { KoreanWebNovelGenre, ProjectStatus, StructureStatus } from '../constants/enums';

export interface Project {
  id: string;
  title: string;
  description?: string;
  content?: string;
  chapters?: string; // JSON string
  genre: KoreanWebNovelGenre;
  status: ProjectStatus;
  progress: number;
  wordCount: number;
  author: string;
  /**
   * Platform is optional because some legacy DB rows or IPC conversions may not include it.
   */
  platform?: string;
  userId?: string;
  createdAt: Date;
  lastModified: Date;
  /**
   * `updatedAt` is used in IPC conversion and some backend mappings.
   * Keep it optional for compatibility with older DB rows.
   */
  updatedAt?: Date;
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
  // make these optional to allow backward-compatible conversions from DB
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
  // Additional optional profile fields referenced in UI
  age?: number | string;
  occupation?: string;
  birthplace?: string;
  residence?: string;
  family?: string;
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
  status: StructureStatus;
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
  // note type (idea, plot, general) - optional for backward compatibility
  type?: string;
  tags?: unknown; // JSON field from Prisma
  color?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}