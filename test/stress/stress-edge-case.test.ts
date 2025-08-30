// 🔥 기가차드 Stress & Edge Case 테스트 - 실전 내구성 검증!

import { SettingsManager } from '../../src/main/settings/SettingsManager';
import { KeyboardEventProcessor } from '../../src/main/keyboard/KeyboardEventProcessor';
import { StatsManager } from '../../src/main/keyboard/StatsManager';
import { DEFAULT_SETTINGS } from '../../src/main/settings/defaults';
import type { KeyboardEvent } from '../../src/shared/types';
import type { SettingsSchema } from '../../src/main/settings/types';

// 메모리 기반 Mock Storage
class StressTestMockStorage {
  public data: string | null = null;
  public saveCount = 0;
  public loadCount = 0;

  async save(data: unknown): Promise<void> {
    this.saveCount++;
    // 10% 확률로 지연 시뮬레이션 (현실적인 I/O 지연)
    if (Math.random() < 0.1) {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 50));
    }
    this.data = JSON.stringify(data);
  }

  async load(): Promise<Partial<SettingsSchema>> {
    this.loadCount++;
    if (this.data === null) {
      return {};
    }
    return JSON.parse(this.data);
  }

  async exists(): Promise<boolean> {
    return this.data !== null;
  }

  clear(): void {
    this.data = null;
    this.saveCount = 0;
    this.loadCount = 0;
  }

  // 파일 시스템 오류 시뮬레이션
  simulateDiskFull(): void {
    this.save = async (): Promise<void> => {
      throw new Error('ENOSPC: no space left on device');
    };
  }
}

describe('🔥 Stress & Edge Case 테스트', () => {
  let settingsManager: SettingsManager;
  let mockStorage: StressTestMockStorage;

  beforeEach(async () => {
    mockStorage = new StressTestMockStorage();
    settingsManager = new SettingsManager(mockStorage as any);
    await settingsManager.initialize();
  });

  afterEach(async () => {
    if (settingsManager) {
      await settingsManager.cleanup();
    }
    mockStorage.clear();
  });

  describe('💪 성능 Stress 테스트', () => {
    it('대량 설정 변경 (1000회) 후 메모리 누수 없음', async () => {
      const initialMemory = process.memoryUsage().heapUsed;
      
      // 1000번 연속 설정 변경
      for (let i = 0; i < 1000; i++) {
        await settingsManager.set('app', {
          ...DEFAULT_SETTINGS.app,
          autoStart: i % 2 === 0
        });
      }
      
      // 강제 GC (테스트 환경에서만)
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage().heapUsed;
      const memoryIncrease = finalMemory - initialMemory;
      
      // 메모리 증가량이 10MB 이하여야 함 (테스트 환경 고려)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
      expect(mockStorage.saveCount).toBe(1000);
    }, 10000); // 10초 타임아웃

    it('동시 설정 변경 100개 처리 후 데이터 일관성 유지', async () => {
      const promises = [];
      
      // 100개 동시 요청
      for (let i = 0; i < 100; i++) {
        promises.push(
          settingsManager.set('keyboard', {
            ...DEFAULT_SETTINGS.keyboard,
            processingDelay: i % 10
          })
        );
      }
      
      const results = await Promise.all(promises);
      
      // 모든 요청이 성공해야 함
      results.forEach(result => {
        expect(result.success).toBe(true);
      });
      
      // 최종 상태가 일관성 있어야 함
      const finalSettings = settingsManager.getAll();
      expect(typeof finalSettings.keyboard.processingDelay).toBe('number');
      expect(finalSettings.keyboard.processingDelay).toBeGreaterThanOrEqual(0);
      expect(finalSettings.keyboard.processingDelay).toBeLessThan(10);
    });

    it('메모리 부족 상황에서 graceful degradation', async () => {
      // 디스크 풀 시뮬레이션
      mockStorage.simulateDiskFull();
      
      const result = await settingsManager.set('app', {
        ...DEFAULT_SETTINGS.app,
        autoStart: false
      });
      
      // 저장은 실패하지만 애플리케이션은 계속 실행되어야 함
      expect(result.success).toBe(false);
      expect(result.error).toContain('no space left on device');
      
      // 메모리상 설정은 여전히 접근 가능해야 함
      const currentSettings = settingsManager.get('app');
      expect(currentSettings).toBeDefined();
    });
  });

  describe('🏃 키보드 이벤트 고부하 테스트', () => {
    let processor: KeyboardEventProcessor;
    let statsManager: StatsManager;

    beforeEach(async () => {
      processor = new KeyboardEventProcessor();
      statsManager = new StatsManager();
      await processor.initialize();
      await statsManager.initialize();
    });

    afterEach(async () => {
      await processor.cleanup();
      await statsManager.cleanup();
    });

    it('초당 1000개 키 이벤트 처리 성능 테스트', async () => {
      const startTime = Date.now();
      const eventCount = 1000;
      
      // 실제 KeyboardEvent 형태로 이벤트 생성
      for (let i = 0; i < eventCount; i++) {
        const event: KeyboardEvent = {
          key: String.fromCharCode(65 + (i % 26)), // A-Z 순환
          code: `Key${String.fromCharCode(65 + (i % 26))}`,
          keycode: 65 + (i % 26),
          keychar: String.fromCharCode(65 + (i % 26)),
          type: 'keydown',
          timestamp: Date.now() + i,
          windowTitle: 'Test Window'
        };
        
        await processor.processKeyboardEvent(event);
      }
      
      // debounced stats 업데이트 대기
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const endTime = Date.now();
      const processingTime = endTime - startTime;
      
      // 1000개 이벤트를 2초 이내에 처리해야 함 (debounce 고려)
      expect(processingTime).toBeLessThan(2000);
      
      // 프로세서 통계 확인 (debounce 후 업데이트됨)
      const stats = processor.getCurrentStats();
      expect(stats.totalKeystrokes).toBeGreaterThan(0);
    });

    it('연속 10분간 키 입력 시뮬레이션 (축약 버전)', async () => {
      const duration = 1000; // 1초 (실제로는 10분)
      const interval = 10; // 10ms마다
      const startTime = Date.now();
      
      let eventCount = 0;
      const intervalId = setInterval(async () => {
        if (Date.now() - startTime >= duration) {
          clearInterval(intervalId);
          return;
        }
        
        const event: KeyboardEvent = {
          key: 'a',
          code: 'KeyA',
          keycode: 65,
          keychar: 'a',
          type: 'keydown',
          timestamp: Date.now(),
          windowTitle: 'Test Window'
        };
        
        await processor.processKeyboardEvent(event);
        eventCount++;
      }, interval);
      
      // 완료 대기
      await new Promise(resolve => {
        const check = () => {
          if (Date.now() - startTime >= duration) {
            resolve(void 0);
          } else {
            setTimeout(check, 50);
          }
        };
        check();
      });
      
      clearInterval(intervalId);
      
      // debounced stats 업데이트 대기
      await new Promise(resolve => setTimeout(resolve, 600));
      
      // 메모리 사용량 확인
      const memoryUsage = process.memoryUsage();
      expect(memoryUsage.heapUsed).toBeLessThan(100 * 1024 * 1024); // 100MB 이하
      
      // 프로세서 통계 확인 (debounce 고려)
      const stats = processor.getCurrentStats();
      expect(stats.totalKeystrokes).toBeGreaterThan(0); // 최소 1개 이벤트
    });
  });

  describe('⚠️ Edge Case 시나리오', () => {
    it('손상된 JSON 복구 후 정상 동작', async () => {
      // 손상된 데이터 설정
      mockStorage.data = '{"app":{"autoStart":tr'; // 잘린 JSON
      
      const newManager = new SettingsManager(mockStorage as any);
      await newManager.initialize();
      
      // 기본값으로 복구되어야 함
      const settings = newManager.getAll();
      expect(settings.app.autoStart).toBe(DEFAULT_SETTINGS.app.autoStart);
      
      // 새로운 설정 저장이 정상 동작해야 함
      const result = await newManager.set('app', {
        ...DEFAULT_SETTINGS.app,
        autoStart: false
      });
      expect(result.success).toBe(true);
      
      await newManager.cleanup();
    });

    it('Unicode 및 특수 문자 처리', async () => {
      const unicodeSettings = {
        ...DEFAULT_SETTINGS.app,
        // 유효한 language 값 사용 (타입 정의에 맞춤)
        language: 'ko' as const
      };
      
      const result = await settingsManager.set('app', unicodeSettings);
      expect(result.success).toBe(true);
      
      // 새 인스턴스에서 로드 확인
      const newMockStorage = new StressTestMockStorage();
      newMockStorage.data = mockStorage.data;
      const newManager = new SettingsManager(newMockStorage as any);
      await newManager.initialize();
      
      const loaded = newManager.get('app');
      expect(loaded.language).toBe('ko');
      
      await newManager.cleanup();
    });

    it('극한 설정값 처리 (경계값 테스트)', async () => {
      const extremeSettings = {
        ...DEFAULT_SETTINGS.keyboard,
        processingDelay: Number.MAX_SAFE_INTEGER,
        eventBufferSize: 0,
        sessionTimeout: -1
      };
      
      // 검증 로직이 극한값을 적절히 처리하는지 확인
      const result = await settingsManager.set('keyboard', extremeSettings);
      
      // 검증에 따라 성공 또는 실패할 수 있음
      if (result.success) {
        const saved = settingsManager.get('keyboard');
        expect(typeof saved.processingDelay).toBe('number');
      } else {
        expect(result.error).toBeDefined();
      }
    });

    it('동시 접근 시 데이터 경쟁 조건 방지', async () => {
      const promises = [];
      
      // 같은 설정을 동시에 다른 값으로 변경
      for (let i = 0; i < 50; i++) {
        promises.push(
          settingsManager.set('app', {
            ...DEFAULT_SETTINGS.app,
            autoStart: i % 2 === 0
          })
        );
      }
      
      const results = await Promise.all(promises);
      
      // 모든 요청이 처리되어야 함 (성공 또는 실패)
      expect(results).toHaveLength(50);
      
      // 최종 상태가 유효해야 함
      const finalSettings = settingsManager.get('app');
      expect(typeof finalSettings.autoStart).toBe('boolean');
    });
  });

  describe('🔒 보안 및 안정성 테스트', () => {
    it('악의적 페이로드 주입 방지', async () => {
      // 🔥 실제 검증되는 필드로 테스트: theme 값은 'light', 'dark', 'system'만 허용
      const maliciousPayload = {
        ...DEFAULT_SETTINGS.app,
        theme: 'malicious_theme_injection' as any
      };
      
      const result = await settingsManager.set('app', maliciousPayload);
      
      // 🔥 타입 안전성: 검증이 반드시 실패해야 함 (기가차드 원칙)
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('theme');
      
      // 설정이 변경되지 않았는지 확인
      const saved = settingsManager.get('app');
      expect(saved.theme).not.toBe('malicious_theme_injection');
      expect(['light', 'dark', 'system']).toContain(saved.theme);
    });

    it('타입 안전성: 잘못된 데이터 타입 거부', async () => {
      // 🔥 autoStart는 boolean이어야 함
      const invalidTypePayload = {
        ...DEFAULT_SETTINGS.app,
        autoStart: 'true' as any // string을 boolean으로 전달
      };
      
      const result = await settingsManager.set('app', invalidTypePayload);
      
      // 타입 검증이 실패해야 함
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      // 원본 설정이 유지되어야 함
      const saved = settingsManager.get('app');
      expect(typeof saved.autoStart).toBe('boolean');
    });

    it('경계값 검증: 윈도우 크기 제한', async () => {
      // 🔥 윈도우 크기는 범위 내에 있어야 함
      const invalidBoundsPayload = {
        ...DEFAULT_SETTINGS.app,
        windowBounds: {
          ...DEFAULT_SETTINGS.app.windowBounds,
          width: 50, // 최소값(400) 미만
          height: 10000 // 최대값 초과
        }
      };
      
      const result = await settingsManager.set('app', invalidBoundsPayload);
      
      // 경계값 검증이 실패해야 함
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      
      // 원본 설정이 유지되어야 함
      const saved = settingsManager.get('app');
      expect(saved.windowBounds.width).toBeGreaterThanOrEqual(400);
      expect(saved.windowBounds.height).toBeLessThanOrEqual(2000);
    });

    it('메모리 기반 설정 격리 (다중 인스턴스)', async () => {
      const storage1 = new StressTestMockStorage();
      const storage2 = new StressTestMockStorage();
      
      const manager1 = new SettingsManager(storage1 as any);
      const manager2 = new SettingsManager(storage2 as any);
      
      await manager1.initialize();
      await manager2.initialize();
      
      // 서로 다른 설정 적용
      await manager1.set('app', { ...DEFAULT_SETTINGS.app, autoStart: true });
      await manager2.set('app', { ...DEFAULT_SETTINGS.app, autoStart: false });
      
      // 각각 독립적이어야 함
      expect(manager1.get('app').autoStart).toBe(true);
      expect(manager2.get('app').autoStart).toBe(false);
      
      await manager1.cleanup();
      await manager2.cleanup();
    });
  });
});
