/**
 * Auth snapshot interface for secure storage and IPC communication.
 * Contains non-sensitive authentication state information.
 */
export interface AuthSnapshot {
  /** Whether the user is currently authenticated */
  isAuthenticated: boolean;
  /** User's email address, null if not available */
  userEmail: string | null;
  /** User's display name, null if not available */
  userName: string | null;
  /** User's profile picture URL, null if not available */
  userPicture: string | null;
}