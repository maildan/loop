import { ipcMain } from 'electron';
import type { IpcMainInvokeEvent } from 'electron';
import type { AuthSnapshot } from '../../shared/types/auth';
import { keychainAdapter } from '../utils/keychainAdapter';

// Lightweight response wrapper used across handlers
type IpcGenericResponse<T> = { ok: boolean; data?: T; error?: string };

/**
 * Keychain IPC handlers using unified keychain adapter
 * - Uses native keytar when available, falls back to electron-store
 * - Runs in main process only. Preload/renderer should invoke these handlers.
 */
export function registerKeychainHandlers() {
    // get snapshot JSON from keychain
    ipcMain.handle('keychain:get-snapshot', async (_event: IpcMainInvokeEvent): Promise<IpcGenericResponse<AuthSnapshot | null>> => {
        try {
            const service = 'loop-auth';
            const account = 'snapshot';
            const raw = await keychainAdapter.getPassword(service, account);
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

    // set snapshot JSON into keychain
    ipcMain.handle('keychain:set-snapshot', async (_event: IpcMainInvokeEvent, payload: AuthSnapshot): Promise<IpcGenericResponse<boolean>> => {
        try {
            const service = 'loop-auth';
            const account = 'snapshot';
            const raw = JSON.stringify(payload || {});
            await keychainAdapter.setPassword(service, account, raw);
            return { ok: true, data: true };
        } catch (e: unknown) {
            return { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
    });

    // delete snapshot from keychain
    ipcMain.handle('keychain:delete-snapshot', async (_event: IpcMainInvokeEvent): Promise<IpcGenericResponse<boolean>> => {
        try {
            const service = 'loop-auth';
            const account = 'snapshot';
            const removed = await keychainAdapter.deletePassword(service, account);
            return { ok: true, data: !!removed };
        } catch (e: unknown) {
            return { ok: false, error: e instanceof Error ? e.message : String(e) };
        }
    });
}
