/**
 * 🔥 기가차드 Keychain Adapter - Native keytar with electron-store fallback
 * 
 * This adapter provides a unified interface for secure credential storage:
 * - Prefers native keytar (macOS Keychain, Windows Credential Store, Linux Secret Service)
 * - Falls back to electron-store if keytar is unavailable or fails
 * - Suppresses noisy native module import errors
 */
import { Logger } from '../../shared/logger';
import Store from 'electron-store';

const componentName = 'KEYCHAIN_ADAPTER';

interface KeytarLike {
  setPassword(service: string, account: string, password: string): Promise<void>;
  getPassword(service: string, account: string): Promise<string | null>;
  deletePassword(service: string, account: string): Promise<boolean>;
}

/**
 * electron-store based fallback for credential storage
 */
class ElectronStoreFallback implements KeytarLike {
  private store: Store<Record<string, Record<string, string>>>;

  constructor() {
    this.store = new Store<Record<string, Record<string, string>>>({
      name: 'secure-credentials',
      encryptionKey: 'loop-keychain-fallback-v1',
      clearInvalidConfig: true,
    });
  }

  async setPassword(service: string, account: string, password: string): Promise<void> {
    const serviceData = this.store.get(service, {});
    serviceData[account] = password;
    this.store.set(service, serviceData);
  }

  async getPassword(service: string, account: string): Promise<string | null> {
    const serviceData = this.store.get(service, {});
    return serviceData[account] ?? null;
  }

  async deletePassword(service: string, account: string): Promise<boolean> {
    const serviceData = this.store.get(service, {});
    const hadKey = account in serviceData;
    delete serviceData[account];
    this.store.set(service, serviceData);
    return hadKey;
  }
}

/**
 * Unified keychain adapter
 */
class KeychainAdapter implements KeytarLike {
  private backend: KeytarLike | null = null;
  private backendType: 'keytar' | 'electron-store' | null = null;
  private initPromise: Promise<void> | null = null;

  constructor() {
    // Defer initialization to first use
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this.doInitialize();
    return this.initPromise;
  }

  private async doInitialize(): Promise<void> {
    // Try native keytar first
    try {
      const keytar = await import('keytar');
      if (keytar && typeof keytar.getPassword === 'function') {
        // Validate by attempting a test operation
        try {
          await keytar.getPassword('loop-test-service', 'loop-test-account');
          this.backend = keytar;
          this.backendType = 'keytar';
          Logger.info(componentName, '✅ Using native keytar for secure credential storage');
          return;
        } catch (e) {
          // If test call fails, fall through to electron-store
          Logger.debug(componentName, 'keytar test operation failed, falling back to electron-store');
        }
      }
    } catch (e) {
      // Suppress noisy dlopen errors - this is expected on some platforms
      const errMsg = e instanceof Error ? e.message : String(e);
      if (errMsg.includes('dlopen') || errMsg.includes('ERR_DLOPEN_FAILED')) {
        Logger.debug(componentName, 'Native keytar unavailable (expected on some platforms)');
      } else {
        Logger.debug(componentName, 'keytar import failed, using electron-store fallback', e);
      }
    }

    // Fall back to electron-store
    this.backend = new ElectronStoreFallback();
    this.backendType = 'electron-store';
    Logger.info(componentName, '⚠️ Using electron-store fallback for credential storage (less secure than native keytar)');
  }

  async setPassword(service: string, account: string, password: string): Promise<void> {
    await this.ensureInitialized();
    if (!this.backend) {
      throw new Error('Keychain backend not initialized');
    }
    return this.backend.setPassword(service, account, password);
  }

  async getPassword(service: string, account: string): Promise<string | null> {
    await this.ensureInitialized();
    if (!this.backend) {
      throw new Error('Keychain backend not initialized');
    }
    return this.backend.getPassword(service, account);
  }

  async deletePassword(service: string, account: string): Promise<boolean> {
    await this.ensureInitialized();
    if (!this.backend) {
      throw new Error('Keychain backend not initialized');
    }
    return this.backend.deletePassword(service, account);
  }

  getBackendType(): 'keytar' | 'electron-store' | null {
    return this.backendType;
  }
}

// Singleton instance
export const keychainAdapter = new KeychainAdapter();
