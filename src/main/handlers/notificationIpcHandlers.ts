import { ipcMain, Notification, IpcMainInvokeEvent } from 'electron';
import { Logger } from '../../shared/logger';

export default function registerNotificationHandlers() {
    // show simple notification: title + body
    ipcMain.handle('notifications:show', async (_event: IpcMainInvokeEvent, title: string, message: string) => {
        try {
            if (!title && !message) return { success: false, error: 'No content' };
            const notification = new Notification({ title: String(title || ''), body: String(message || '') });
            notification.show();
            return { success: true };
        } catch (e) {
            Logger.error('NOTIFICATIONS', 'Failed to show notification', e);
            return { success: false, error: String(e) };
        }
    });

    // show typing goal progress as notification (optional)
    ipcMain.handle('notifications:show-typing-goal', async (_event: IpcMainInvokeEvent, progress: number) => {
        try {
            const pct = Math.max(0, Math.min(100, Number(progress || 0)));
            const notif = new Notification({ title: '타자 목표', body: `진행률: ${pct}%` });
            notif.show();
            return { success: true };
        } catch (e) {
            Logger.error('NOTIFICATIONS', 'Failed to show typing goal notification', e);
            return { success: false, error: String(e) };
        }
    });
}
