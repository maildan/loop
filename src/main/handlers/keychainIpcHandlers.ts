import { ipcMain } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import type { AuthSnapshot } from '../../shared/types/auth';

// Lightweight response wrapper used across handlers
type IpcGenericResponse<T> = { ok: boolean; data?: T; error?: string };

/**
 * Keychain / keytar IPC handlers
 * - Runs in main process only. Preload/renderer should invoke these handlers.
 */
export function registerKeychainHandlers() {
    // get snapshot JSON from keytar
    ipcMain.handle('keychain:get-snapshot', async (_event: IpcMainInvokeEvent): Promise<IpcGenericResponse<AuthSnapshot | null>> => {
        try {
            // dynamic import to avoid loading on unsupported platforms
            const keytar = await import('keytar');
            if (!keytar || typeof keytar.getPassword !== 'function') {
                return { ok: false, error: 'keytar not available' };
            }

            const service = 'loop-auth-snapshot';
            const account = 'snapshot';
            const raw = await keytar.getPassword(service, account);
            if (!raw) return { ok: true, data: null };
            try {
                return { ok: true, data: JSON.parse(raw) };
            } catch (e: unknown) {
                return { ok: false, error: 'failed to parse snapshot' };
            }
        } catch (e: unknown) {
            return { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
    });

    // set snapshot JSON into keytar
    ipcMain.handle('keychain:set-snapshot', async (_event: IpcMainInvokeEvent, payload: AuthSnapshot): Promise<IpcGenericResponse<boolean>> => {
        try {
            const keytar = await import('keytar');
            if (!keytar || typeof keytar.setPassword !== 'function') {
                return { ok: false, error: 'keytar not available' };
            }
            const service = 'loop-auth-snapshot';
            const account = 'snapshot';
            const raw = JSON.stringify(payload || {});
            await keytar.setPassword(service, account, raw);
            return { ok: true, data: true };
        } catch (e: unknown) {
            return { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
    });

    // delete snapshot from keytar
    ipcMain.handle('keychain:delete-snapshot', async (_event: IpcMainInvokeEvent): Promise<IpcGenericResponse<boolean>> => {
        try {
            const keytar = await import('keytar');
            if (!keytar || typeof keytar.deletePassword !== 'function') {
                return { ok: false, error: 'keytar not available' };
            }
            const service = 'loop-auth-snapshot';
            const account = 'snapshot';
            const removed = await keytar.deletePassword(service, account);
            return { ok: true, data: !!removed };
        } catch (e: unknown) {
            return { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
    });
}
