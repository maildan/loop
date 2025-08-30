// 🔥 기가차드 Settings E2E 테스트 (메모리 기반 버전)

import { SettingsManager } from '../../src/main/settings/SettingsManager';
import { FileStorage } from '../../src/main/settings/storage/FileStorage';
import { DEFAULT_SETTINGS } from '../../src/main/settings/defaults';
import type { SettingsSchema, SettingsResult } from '../../src/main/settings/types';

// 메모리 기반 Mock Storage
class MockStorage {
  public data: string | null = null;
  private isReadOnly: boolean = false;

  async save(settings: Partial<SettingsSchema>): Promise<void> {
    if (this.isReadOnly) {
      throw new Error('Read-only file system');
    }
    this.data = JSON.stringify(settings);
  }

  async load(): Promise<Partial<SettingsSchema>> {
    if (this.data === null) {
      return {};
    }
    try {
      return JSON.parse(this.data);
    } catch (error) {
      return {}; // 손상된 데이터일 경우 빈 객체 반환
    }
  }

  async exists(): Promise<boolean> {
    return this.data !== null;
  }

  async restore(backupData: string): Promise<void> {
    if (this.isReadOnly) {
      throw new Error('Read-only file system');
    }
    this.data = backupData;
  }

  clear(): void {
    this.data = null;
  }

  setCorruptData(): void {
    this.data = '{ invalid json }';
  }

  makeReadOnly(): void {
    this.isReadOnly = true;
  }
}

describe('🔥 Settings E2E 테스트 (메모리 기반)', () => {
  let settingsManager: SettingsManager;
  let mockStorage: MockStorage;

  beforeEach(async () => {
    // 메모리 기반 스토리지 생성
    mockStorage = new MockStorage();
    settingsManager = new SettingsManager(mockStorage as any);
    await settingsManager.initialize();
  });

  afterEach(async () => {
    // 정리
    if (settingsManager) {
      await settingsManager.cleanup();
    }
    mockStorage.clear();
  });

  describe('💾 전체 라이프사이클 테스트', () => {
    it('설정 생성 → 수정 → 저장 → 로드 → 검증 전체 과정이 올바르게 작동해야 함', async () => {
      // 초기 설정 검증 (타임스탬프 제외)
      const initialSettings = settingsManager.getAll();
      expect(initialSettings.keyboard).toEqual(DEFAULT_SETTINGS.keyboard);
      expect(initialSettings.app).toEqual(DEFAULT_SETTINGS.app);
      expect(initialSettings.ui).toEqual(DEFAULT_SETTINGS.ui);

      // 설정 수정
      const newKeyboardSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        enabled: false,
        processingDelay: 200
      };

      const updateResult: SettingsResult<SettingsSchema['keyboard']> = await settingsManager.set('keyboard', newKeyboardSettings);
      expect(updateResult.success).toBe(true);
      expect(updateResult.data).toEqual(newKeyboardSettings);

      // 저장된 데이터 확인
      expect(await mockStorage.exists()).toBe(true);

      // 새 인스턴스에서 로드 확인
      const newMockStorage = new MockStorage();
      newMockStorage.data = mockStorage.data; // 데이터 복사
      const newSettingsManager = new SettingsManager(newMockStorage as any);
      await newSettingsManager.initialize();
      
      const loadedKeyboard = newSettingsManager.get('keyboard');
      // 변경된 값들만 확인
      expect(loadedKeyboard.enabled).toBe(false);
      expect(loadedKeyboard.processingDelay).toBe(200);
      
      await newSettingsManager.cleanup();
    });

    it('다중 카테고리 동시 업데이트가 올바르게 처리되어야 함', async () => {
      // 다중 업데이트 실행
      const updates = await Promise.all([
        settingsManager.set('keyboard', { ...DEFAULT_SETTINGS.keyboard, enabled: false }),
        settingsManager.set('app', { ...DEFAULT_SETTINGS.app, autoStart: false }),
        settingsManager.set('ui', { ...DEFAULT_SETTINGS.ui, compactMode: true })
      ]);

      // 모든 업데이트 성공 확인
      updates.forEach((result: SettingsResult<unknown>) => {
        expect(result.success).toBe(true);
      });

      // 최종 상태 검증
      const finalSettings = settingsManager.getAll();
      expect(finalSettings.keyboard.enabled).toBe(false);
      expect(finalSettings.app.autoStart).toBe(false);
      expect(finalSettings.ui.compactMode).toBe(true);
    });
  });

  describe('🔄 백업 및 복원 E2E', () => {
    it('전체 백업 → 설정 변경 → 복원 과정이 올바르게 작동해야 함', async () => {
      // 초기 설정 백업
      const backup = settingsManager.getAll();

      // 설정 대폭 변경
      await settingsManager.set('keyboard', { ...DEFAULT_SETTINGS.keyboard, enabled: false });
      await settingsManager.set('app', { ...DEFAULT_SETTINGS.app, autoStart: false });

      // 변경 확인
      expect(settingsManager.get('keyboard').enabled).toBe(false);
      expect(settingsManager.get('app').autoStart).toBe(false);

      // 복원 (백업을 JSON 문자열로 변환)
      const restoreResult = await settingsManager.restore(JSON.stringify(backup));
      expect(restoreResult.success).toBe(true);

      // 복원 확인
      expect(settingsManager.get('keyboard').enabled).toBe(DEFAULT_SETTINGS.keyboard.enabled);
      expect(settingsManager.get('app').autoStart).toBe(DEFAULT_SETTINGS.app.autoStart);
    });
  });

  describe('🚫 에러 시나리오 E2E', () => {
    it('손상된 설정 파일이 있을 때 기본값으로 복구되어야 함', async () => {
      // 손상된 데이터 설정
      mockStorage.setCorruptData();

      // 새 SettingsManager로 로드 시도
      const newMockStorage = new MockStorage();
      newMockStorage.data = mockStorage.data; // 손상된 데이터 복사
      const newSettingsManager = new SettingsManager(newMockStorage as any);
      
      // 에러 없이 초기화되고 기본값으로 복구됨
      await expect(newSettingsManager.initialize()).resolves.not.toThrow();
      
      const settings = newSettingsManager.getAll();
      // 타임스탬프 제외하고 검증
      expect(settings.keyboard).toEqual(DEFAULT_SETTINGS.keyboard);
      expect(settings.app).toEqual(DEFAULT_SETTINGS.app);
      expect(settings.ui).toEqual(DEFAULT_SETTINGS.ui);
      
      await newSettingsManager.cleanup();
    });

    it('읽기 전용 파일 시스템에서 graceful하게 처리되어야 함', async () => {
      // 먼저 정상 설정 저장
      await settingsManager.set('app', { ...DEFAULT_SETTINGS.app, autoStart: true });
      
      // 읽기 전용 모드 설정
      mockStorage.makeReadOnly();

      // 설정 변경 시도 (실패해야 함)
      const result = await settingsManager.set('app', { ...DEFAULT_SETTINGS.app, autoStart: false });
      
      // 결과가 실패를 나타내야 함 (에러를 던지지 않고)
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('Read-only');
    });
  });

  describe('🔍 성능 및 동시성 테스트', () => {
    it('대량의 연속 업데이트가 올바르게 처리되어야 함', async () => {
      const updateCount = 50;
      const startTime = Date.now();

      // 연속 업데이트 실행
      const updates: Promise<SettingsResult<SettingsSchema['app']>>[] = [];
      for (let i = 0; i < updateCount; i++) {
        updates.push(
          settingsManager.set('app', {
            ...DEFAULT_SETTINGS.app,
            autoStart: i % 2 === 0
          })
        );
      }

      const results = await Promise.all(updates);
      const endTime = Date.now();

      // 모든 업데이트 성공 확인
      results.forEach(result => {
        expect(result.success).toBe(true);
      });

      // 성능 검증 (1초 이내)
      expect(endTime - startTime).toBeLessThan(1000);

      // 최종 상태가 일관성 있게 유지됨
      const finalSettings = settingsManager.getAll();
      expect(typeof finalSettings.app.autoStart).toBe('boolean');
    });
  });

  describe('🔍 이벤트 및 watcher 테스트', () => {
    it('설정 변경 시 이벤트가 올바르게 발생해야 함', async () => {
      const events: Array<{ key: string; oldValue: unknown; newValue: unknown }> = [];

      // 이벤트 리스너 등록
      const unwatch = settingsManager.watch('keyboard', (event) => {
        events.push(event);
      });

      // 설정 변경
      await settingsManager.set('keyboard', { 
        ...DEFAULT_SETTINGS.keyboard, 
        enabled: false 
      });

      // 이벤트 발생 확인
      expect(events).toHaveLength(1);
      expect(events[0].key).toBe('keyboard');
      expect(events[0].newValue).toEqual({ 
        ...DEFAULT_SETTINGS.keyboard, 
        enabled: false 
      });

      // 정리
      unwatch();
    });
  });
});
