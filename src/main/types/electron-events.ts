/**
 * Electron Main Process Event Type Definitions
 *
 * This file contains type definitions for Electron's internal events
 * that are not fully typed in @types/electron or need more specific typing.
 *
 * @module main/types/electron-events
 * @see https://www.electronjs.org/docs/latest/api/web-contents
 */

// ============================================================
// WebContents Events
// ============================================================

/**
 * Details provided when a renderer process crashes or is killed
 *
 * @see https://www.electronjs.org/docs/latest/api/web-contents#event-render-process-gone
 */
export interface RenderProcessGoneDetails {
  /**
   * Reason for process termination
   * - 'clean-exit': Process exited with exit code 0
   * - 'abnormal-exit': Process exited with non-zero exit code
   * - 'killed': Process was killed by the OS (e.g., SIGKILL)
   * - 'crashed': Process crashed (e.g., segmentation fault)
   * - 'oom': Process ran out of memory
   * - 'launch-failed': Process never successfully launched
   * - 'integrity-failure': Windows code integrity checks failed
   */
  reason:
    | 'clean-exit'
    | 'abnormal-exit'
    | 'killed'
    | 'crashed'
    | 'oom'
    | 'launch-failed'
    | 'integrity-failure';

  /**
   * Exit code of the process
   * - For 'clean-exit': 0
   * - For 'abnormal-exit': non-zero exit code
   * - For 'crashed': platform-specific error code
   * - For other reasons: undefined or 0
   */
  exitCode: number;
}

/**
 * Details provided when a child process crashes or is killed
 *
 * @see https://www.electronjs.org/docs/latest/api/app#event-child-process-gone
 */
export interface ChildProcessGoneDetails {
  /**
   * Type of child process
   * - 'Utility': Utility process
   * - 'Zygote': Zygote process (Linux only)
   * - 'Sandbox helper': Sandbox helper process (macOS only)
   * - 'GPU': GPU process
   * - 'Pepper Plugin': Pepper plugin process
   * - 'Pepper Plugin Broker': Pepper plugin broker process
   * - 'Unknown': Unknown process type
   */
  type:
    | 'Utility'
    | 'Zygote'
    | 'Sandbox helper'
    | 'GPU'
    | 'Pepper Plugin'
    | 'Pepper Plugin Broker'
    | 'Unknown';

  /**
   * Reason for process termination (same as RenderProcessGoneDetails.reason)
   */
  reason:
    | 'clean-exit'
    | 'abnormal-exit'
    | 'killed'
    | 'crashed'
    | 'oom'
    | 'launch-failed'
    | 'integrity-failure';

  /**
   * Exit code of the process
   */
  exitCode: number;

  /**
   * Name of the process (e.g., 'Utility Process')
   */
  name: string;
}

/**
 * Details provided when a renderer process becomes unresponsive
 *
 * @see https://www.electronjs.org/docs/latest/api/browser-window#event-unresponsive
 */
export interface UnresponsiveDetails {
  /**
   * Reason why the renderer became unresponsive
   */
  reason?: string;
}

/**
 * Details provided when a renderer process becomes responsive again
 *
 * @see https://www.electronjs.org/docs/latest/api/browser-window#event-responsive
 */
export interface ResponsiveDetails {
  /**
   * Reason why the renderer became responsive
   */
  reason?: string;
}

// ============================================================
// Certificate Error Events
// ============================================================

/**
 * Certificate error details
 *
 * @see https://www.electronjs.org/docs/latest/api/app#event-certificate-error
 */
export interface CertificateErrorDetails {
  /**
   * URL that triggered the certificate error
   */
  url: string;

  /**
   * Error message
   */
  error: string;

  /**
   * Certificate that caused the error
   */
  certificate: Electron.Certificate;

  /**
   * Whether to trust the certificate (callback result)
   */
  isTrusted?: boolean;
}

// ============================================================
// Crash Reporter Events
// ============================================================

/**
 * Crash report details
 */
export interface CrashReportDetails {
  /**
   * Date when the crash occurred
   */
  date: Date;

  /**
   * Product name (from app.getName())
   */
  productName: string;

  /**
   * Process ID
   */
  pid: number;

  /**
   * Process type ('browser', 'renderer', 'gpu-process')
   */
  type: 'browser' | 'renderer' | 'gpu-process';

  /**
   * Crash dump ID
   */
  crashDump?: string;
}

// ============================================================
// Type Guards
// ============================================================

/**
 * Type guard to check if details are RenderProcessGoneDetails
 */
export function isRenderProcessGoneDetails(
  details: unknown
): details is RenderProcessGoneDetails {
  return (
    typeof details === 'object' &&
    details !== null &&
    'reason' in details &&
    'exitCode' in details &&
    typeof (details as RenderProcessGoneDetails).reason === 'string' &&
    typeof (details as RenderProcessGoneDetails).exitCode === 'number'
  );
}

/**
 * Type guard to check if details are ChildProcessGoneDetails
 */
export function isChildProcessGoneDetails(
  details: unknown
): details is ChildProcessGoneDetails {
  return (
    typeof details === 'object' &&
    details !== null &&
    'type' in details &&
    'reason' in details &&
    'exitCode' in details &&
    'name' in details &&
    typeof (details as ChildProcessGoneDetails).type === 'string' &&
    typeof (details as ChildProcessGoneDetails).reason === 'string' &&
    typeof (details as ChildProcessGoneDetails).exitCode === 'number' &&
    typeof (details as ChildProcessGoneDetails).name === 'string'
  );
}
