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
      const keytarModule = await import('keytar');
      
      // Handle CommonJS default export properly (Electron + Vite bundles CJS modules with .default)
      const keytarCandidate = 'default' in keytarModule 
        ? (keytarModule as { default: KeytarLike }).default 
        : (keytarModule as unknown as KeytarLike);
      
      // Verify keytar has the required methods
      if (
        keytarCandidate &&
        typeof keytarCandidate.setPassword === 'function' &&
        typeof keytarCandidate.getPassword === 'function' &&
        typeof keytarCandidate.deletePassword === 'function'
      ) {
        // Validate by attempting a test operation (some platforms may have keytar installed but non-functional)
        try {
          await keytarCandidate.getPassword('loop-test-service', 'loop-test-account');
          this.backend = keytarCandidate;
          this.backendType = 'keytar';
          Logger.info(componentName, '✅ Using native keytar for secure credential storage');
          return;
        } catch (testError) {
          // If test call fails, fall through to electron-store
          Logger.debug(componentName, 'keytar test operation failed, falling back to electron-store');
        }
      } else {
        Logger.debug(componentName, 'keytar module loaded but methods not available');
      }
    } catch (importError) {
      // Suppress noisy dlopen errors - this is expected on some platforms
      const errMsg = importError instanceof Error ? importError.message : String(importError);
      if (errMsg.includes('dlopen') || errMsg.includes('ERR_DLOPEN_FAILED')) {
        Logger.debug(componentName, 'Native keytar unavailable (expected on some platforms)');
      } else {
        Logger.debug(componentName, 'keytar import failed, using electron-store fallback', importError);
      }
    }

    // Fall back to electron-store
    this.backend = new ElectronStoreFallback();
    this.backendType = 'electron-store';
    Logger.info(componentName, 'Credential storage initialized using electron-store backend');
    Logger.debug(componentName, 'Native keytar not available - using encrypted electron-store as fallback');
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
