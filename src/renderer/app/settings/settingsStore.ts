import { EventEmitter } from 'events';
import type { SettingsData } from './types';

class SettingsStore extends EventEmitter {
    private state: SettingsData | null = null;

    get(): SettingsData | null {
        return this.state;
    }

    set(next: SettingsData | null): void {
        this.state = next;
        this.emit('change', this.state);
    }

    updatePatch(patch: Partial<SettingsData>): void {
        if (!this.state) {
            this.state = patch as SettingsData;
        } else {
            this.state = { ...(this.state as any), ...(patch as any) } as SettingsData;
        }
        this.emit('change', this.state);
    }

    subscribe(fn: (s: SettingsData | null) => void): () => void {
        this.on('change', fn);
        return () => this.removeListener('change', fn);
    }
}

export const settingsStore = new SettingsStore();

export default settingsStore;
