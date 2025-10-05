import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

import type { AuthSnapshot } from '../../shared/types/auth';

const SERVICE_NAME = 'loop-auth-snapshot';
const ACCOUNT_NAME = 'default';

/**
 * SafeKeychain
 * - Tries to use native keytar module when available
 * - Falls back to a JSON file under userData when native module is unavailable or fails to load
 */
export class SafeKeychain {
  private native: any | null = null;
  private initialized = false;
  private fallbackPath: string;

  constructor() {
    this.fallbackPath = path.join(app.getPath('userData'), 'loop-keychain-snapshot.json');
  }

  private async init(): Promise<void> {
    if (this.initialized) return;
    this.initialized = true;
    try {
      // try native import; if it fails we swallow and use fallback
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const kt = await import('keytar');
      this.native = kt;
    } catch (err) {
      // Native keytar not available or failed to load (e.g. wrong arch). We'll log and fall back.
      // Do NOT throw here; caller should still work via fallback.
      // We intentionally avoid bringing any heavy dependencies here.
      // Logging is done by caller when appropriate.
      this.native = null;
    }
  }

  public async getSnapshot(): Promise<AuthSnapshot | null> {
    await this.init();
    if (this.native && typeof this.native.getPassword === 'function') {
      try {
        const raw = await this.native.getPassword(SERVICE_NAME, ACCOUNT_NAME);
        if (!raw) return null;
        return JSON.parse(raw) as AuthSnapshot;
      } catch (e) {
        // fallthrough to file-based fallback
      }
    }

    // fallback: file-based
    try {
      const data = await fs.readFile(this.fallbackPath, { encoding: 'utf8' });
      return JSON.parse(data) as AuthSnapshot;
    } catch (e) {
      return null;
    }
  }

  public async setSnapshot(snapshot: AuthSnapshot): Promise<boolean> {
    await this.init();
    const payload = JSON.stringify(snapshot);
    if (this.native && typeof this.native.setPassword === 'function') {
      try {
        await this.native.setPassword(SERVICE_NAME, ACCOUNT_NAME, payload);
        return true;
      } catch (e) {
        // fallthrough to file fallback
      }
    }

    try {
      await fs.writeFile(this.fallbackPath, payload, { encoding: 'utf8', mode: 0o600 });
      return true;
    } catch (e) {
      return false;
    }
  }

  public async deleteSnapshot(): Promise<boolean> {
    await this.init();
    if (this.native && typeof this.native.deletePassword === 'function') {
      try {
        await this.native.deletePassword(SERVICE_NAME, ACCOUNT_NAME);
        return true;
      } catch (e) {
        // fallthrough
      }
    }

    try {
      await fs.unlink(this.fallbackPath);
      return true;
    } catch (e) {
      // if file doesn't exist it's fine
      return false;
    }
  }
}

export const safeKeychain = new SafeKeychain();
