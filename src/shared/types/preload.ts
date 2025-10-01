/**
 * Preload Script Type Definitions
 *
 * This file contains type definitions used in the preload script (security boundary).
 * These types ensure type-safe communication between Electron main process and renderer.
 *
 * @module shared/types/preload
 * @see src/preload/index.ts
 */

import { IpcRendererEvent } from 'electron';

// ============================================================
// Theme Management
// ============================================================

/**
 * Theme setting values supported by the application
 */
export type ThemeValue = 'light' | 'dark' | 'system';

/**
 * Payload structure for theme-related IPC communication
 */
export interface ThemePayload {
  /**
   * JSON path to the theme setting (e.g., 'appearance.theme')
   */
  keyPath: string;

  /**
   * Theme value to set
   */
  value: ThemeValue;

  /**
   * If true, resets the theme to default system value
   */
  reset?: boolean;
}

/**
 * Theme change event data structure
 */
export interface ThemeChangeData {
  keyPath: string;
  value: ThemeValue;
}

// ============================================================
// Settings API
// ============================================================

/**
 * Settings-related API exposed to renderer via contextBridge
 */
export interface ElectronAPISettings {
  /**
   * Get a setting value by key path
   * @param keyPath - Dot-notation path (e.g., 'appearance.theme')
   * @returns Promise resolving to the setting value
   */
  get: (keyPath: string) => Promise<unknown>;

  /**
   * Set a setting value by key path
   * @param keyPath - Dot-notation path
   * @param value - Value to set (type depends on setting)
   * @returns Promise resolving when setting is saved
   */
  set: (keyPath: string, value: unknown) => Promise<void>;

  /**
   * Register a callback for setting changes
   * @param callback - Function called when settings change
   * @returns Cleanup function to remove the listener
   */
  onDidChange: (
    callback: (event: IpcRendererEvent, data: ThemeChangeData) => void
  ) => () => void;
}

// ============================================================
// File API
// ============================================================

export interface ElectronAPIFiles {
  /**
   * Open a file picker dialog
   * @returns Promise resolving to selected file path(s)
   */
  openFile: () => Promise<string | string[] | null>;

  /**
   * Save content to a file
   * @param filePath - Path where to save
   * @param content - File content
   * @returns Promise resolving when file is saved
   */
  saveFile: (filePath: string, content: string) => Promise<void>;

  /**
   * Read file content
   * @param filePath - Path to read from
   * @returns Promise resolving to file content
   */
  readFile: (filePath: string) => Promise<string>;
}

// ============================================================
// Loop Snapshot API
// ============================================================

export interface ElectronAPILoopSnapshot {
  /**
   * Create a snapshot of the current project state
   * @param projectId - Project identifier
   * @returns Promise resolving to snapshot metadata
   */
  create: (projectId: string) => Promise<{ id: string; timestamp: number }>;

  /**
   * List all snapshots for a project
   * @param projectId - Project identifier
   * @returns Promise resolving to array of snapshot metadata
   */
  list: (projectId: string) => Promise<Array<{ id: string; timestamp: number }>>;

  /**
   * Restore a project to a specific snapshot
   * @param snapshotId - Snapshot identifier
   * @returns Promise resolving when restore is complete
   */
  restore: (snapshotId: string) => Promise<void>;
}

// ============================================================
// OAuth API
// ============================================================

export interface ElectronAPIOAuth {
  /**
   * Open OAuth flow in a new window
   * @param provider - OAuth provider name (e.g., 'google', 'github')
   * @returns Promise resolving to OAuth credentials
   */
  authenticate: (provider: string) => Promise<{ accessToken: string; refreshToken?: string }>;
}

// ============================================================
// Complete Electron API
// ============================================================

/**
 * Complete Electron API surface exposed to renderer via contextBridge.
 * This interface defines all methods available to the renderer process.
 *
 * SECURITY NOTE: This API is the only way renderer can access Node.js/Electron APIs.
 * All methods must be carefully validated in the main process.
 */
export interface ElectronAPI {
  /**
   * Settings management API
   */
  settings: ElectronAPISettings;

  /**
   * File system operations API
   */
  files: ElectronAPIFiles;

  /**
   * Loop project snapshot API
   */
  loopSnapshot: ElectronAPILoopSnapshot;

  /**
   * OAuth authentication API
   */
  oauth: ElectronAPIOAuth;

  /**
   * Get application version
   * @returns Promise resolving to version string (e.g., '1.1.6')
   */
  getVersion: () => Promise<string>;

  /**
   * Quit the application
   * @returns Promise resolving when quit is initiated
   */
  quit: () => Promise<void>;

  /**
   * Open external URL in default browser
   * @param url - URL to open
   * @returns Promise resolving when URL is opened
   */
  openExternal: (url: string) => Promise<void>;

  /**
   * Check if running on macOS
   * @returns Promise resolving to true if macOS
   */
  isMac: () => Promise<boolean>;

  /**
   * Get platform name
   * @returns Promise resolving to platform string ('darwin', 'win32', 'linux')
   */
  getPlatform: () => Promise<NodeJS.Platform>;
}

// ============================================================
// NOTE: Global Window Type Augmentation
// ============================================================
//
// The Window.electronAPI type augmentation is already defined in:
// src/types/global.d.ts
//
// This avoids duplicate type declarations while keeping all preload-related
// type definitions organized in this file.
