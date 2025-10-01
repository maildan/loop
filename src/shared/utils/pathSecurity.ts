/**
 * Path security utilities for preventing path traversal attacks
 */
import path from 'path';
import { Logger } from '../logger';

/**
 * Validates that a resolved path is within an allowed base directory
 * Prevents path traversal attacks like ../../etc/passwd
 */
export function validatePathSafety(resolvedPath: string, basePath: string): boolean {
  const normalizedResolved = path.normalize(resolvedPath);
  const normalizedBase = path.normalize(basePath);
  
  // Ensure the resolved path starts with the base path
  return normalizedResolved.startsWith(normalizedBase);
}

/**
 * Safely joins paths with validation against path traversal
 * @param basePath - The base directory that should contain the result
 * @param ...segments - Path segments to join
 * @returns Joined path if safe, null if path traversal detected
 */
export function safePathJoin(basePath: string, ...segments: string[]): string | null {
  try {
    const joined = path.join(basePath, ...segments);
    const resolved = path.resolve(joined);
    
    if (validatePathSafety(resolved, basePath)) {
      return resolved;
    }
    
    Logger.warn('PATH_SECURITY', 'Path traversal attempt detected', {
      basePath,
      segments,
      attempted: resolved
    });
    return null;
  } catch (error) {
    Logger.error('PATH_SECURITY', 'Error in safePathJoin', error);
    return null;
  }
}

/**
 * Safely resolves a path relative to a base directory
 * @param basePath - The base directory
 * @param relativePath - The relative path to resolve
 * @returns Resolved path if safe, null if path traversal detected
 */
export function safePathResolve(basePath: string, relativePath: string): string | null {
  try {
    const resolved = path.resolve(basePath, relativePath);
    
    if (validatePathSafety(resolved, basePath)) {
      return resolved;
    }
    
    Logger.warn('PATH_SECURITY', 'Path traversal attempt detected in resolve', {
      basePath,
      relativePath,
      attempted: resolved
    });
    return null;
  } catch (error) {
    Logger.error('PATH_SECURITY', 'Error in safePathResolve', error);
    return null;
  }
}

/**
 * Sanitizes a filename by removing path traversal characters
 * @param filename - The filename to sanitize
 * @returns Sanitized filename with only safe characters
 */
export function sanitizeFilename(filename: string): string {
  // Remove path traversal attempts and special characters
  return filename
    .replace(/\.\./g, '')
    .replace(/[/\\]/g, '')
    .replace(/[<>:"|?*]/g, '')
    .trim();
}