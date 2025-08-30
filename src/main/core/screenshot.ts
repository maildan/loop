// 🔥 기가차드 스크린샷 관리자 - 화면 캡처 전문가!

import { screen, desktopCapturer, nativeImage, app, dialog } from 'electron';
import { join } from 'path';
import { promises as fs } from 'fs';
import { Logger } from '../../shared/logger';
import { isString, isNumber } from '../../shared/common';

// #DEBUG: Screenshot manager entry point
Logger.debug('SCREENSHOT', 'Screenshot manager module loaded');

// 🔥 기가차드 스크린샷 설정 인터페이스
export interface ScreenshotConfig {
  format: 'png' | 'jpeg';
  quality: number; // 0-100 (JPEG만 해당)
  saveDirectory: string;
  autoSave: boolean;
  includeTimestamp: boolean;
  filenamePrefix: string;
}

// 🔥 기가차드 스크린샷 정보 인터페이스
export interface ScreenshotInfo {
  id: string;
  filename: string;
  filepath: string;
  timestamp: Date;
  size: { width: number; height: number };
  format: string;
  fileSize: number;
}

// 🔥 기가차드 화면 정보 인터페이스
export interface DisplayInfo {
  id: number;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
  scaleFactor: number;
  rotation: number;
  isPrimary: boolean;
}

// 🔥 기가차드 스크린샷 관리자 클래스
export class ScreenshotManager {
  private static instance: ScreenshotManager | null = null;
  private config: ScreenshotConfig;
  private screenshots: ScreenshotInfo[] = [];

  private constructor() {
    this.config = {
      format: 'png',
      quality: 90,
      saveDirectory: join(app.getPath('pictures'), 'Loop Screenshots'),
      autoSave: true,
      includeTimestamp: true,
      filenamePrefix: 'loop-screenshot'
    };
    
    this.initializeScreenshotManager();
  }

  // 🔥 싱글톤 인스턴스 가져오기
  public static getInstance(): ScreenshotManager {
    if (!ScreenshotManager.instance) {
      ScreenshotManager.instance = new ScreenshotManager();
    }
    return ScreenshotManager.instance;
  }

  // 🔥 스크린샷 관리자 초기화
  private async initializeScreenshotManager(): Promise<void> {
    try {
      // #DEBUG: Initializing screenshot manager
      Logger.debug('SCREENSHOT', 'Initializing screenshot manager');

      // 저장 디렉토리 생성
      await this.ensureSaveDirectory();

      Logger.info('SCREENSHOT', 'Screenshot manager initialized', {
        saveDirectory: this.config.saveDirectory,
        format: this.config.format
      });

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to initialize screenshot manager', error);
    }
  }

  // 🔥 저장 디렉토리 확인/생성
  private async ensureSaveDirectory(): Promise<void> {
    try {
      // #DEBUG: Ensuring save directory exists
      await fs.mkdir(this.config.saveDirectory, { recursive: true });
      
      Logger.debug('SCREENSHOT', 'Save directory ensured', {
        directory: this.config.saveDirectory
      });

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to ensure save directory', error);
      throw error;
    }
  }

  // 🔥 모든 화면 정보 가져오기
  public getAllDisplays(): DisplayInfo[] {
    try {
      // #DEBUG: Getting all displays
      const displays = screen.getAllDisplays();
      
      const displayInfos: DisplayInfo[] = displays.map((display: any) => ({
        id: display.id,
        bounds: display.bounds,
        workArea: display.workArea,
        scaleFactor: display.scaleFactor,
        rotation: display.rotation,
        isPrimary: display === screen.getPrimaryDisplay()
      }));

      Logger.debug('SCREENSHOT', 'All displays retrieved', {
        count: displayInfos.length,
        displays: displayInfos
      });

      return displayInfos;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to get all displays', error);
      return [];
    }
  }

  // 🔥 전체 화면 스크린샷 캡처
  public async captureFullScreen(): Promise<ScreenshotInfo | null> {
    try {
      // #DEBUG: Capturing full screen
      Logger.debug('SCREENSHOT', 'Capturing full screen screenshot');

      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      if (sources.length === 0) {
        Logger.warn('SCREENSHOT', 'No screen sources available');
        return null;
      }

      // 주 화면 선택
      const primarySource = sources[0];
      if (!primarySource) {
        Logger.warn('SCREENSHOT', 'Primary source not available');
        return null;
      }
      const image = primarySource.thumbnail;

      return await this.processScreenshot(image, 'fullscreen');

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to capture full screen', error);
      return null;
    }
  }

  // 🔥 특정 화면 스크린샷 캡처
  public async captureDisplay(displayId: number): Promise<ScreenshotInfo | null> {
    try {
      // #DEBUG: Capturing specific display
      Logger.debug('SCREENSHOT', 'Capturing display screenshot', { displayId });

      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: { width: 1920, height: 1080 }
      });

      // displayId에 해당하는 소스 찾기
      const targetSource = sources.find((source: any) => 
        source.display_id === displayId.toString()
      );

      if (!targetSource) {
        Logger.warn('SCREENSHOT', 'Display not found', { displayId });
        return null;
      }

      const image = targetSource.thumbnail;
      return await this.processScreenshot(image, `display-${displayId}`);

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to capture display', error);
      return null;
    }
  }

  // 🔥 영역 스크린샷 캡처
  public async captureArea(bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): Promise<ScreenshotInfo | null> {
    try {
      // #DEBUG: Capturing area screenshot
      Logger.debug('SCREENSHOT', 'Capturing area screenshot', { bounds });

      // 전체 화면을 먼저 캡처한 후 자르기
      const fullScreenshot = await this.captureFullScreen();
      if (!fullScreenshot) {
        return null;
      }

      // 이미지 로드 후 크롭
      const fullImage = nativeImage.createFromPath(fullScreenshot.filepath);
      const croppedImage = fullImage.crop(bounds);

      // 크롭된 이미지 저장
      return await this.processScreenshot(croppedImage, 'area');

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to capture area', error);
      return null;
    }
  }

  // 🔥 스크린샷 처리 및 저장
  private async processScreenshot(
    image: Electron.NativeImage,
    type: string
  ): Promise<ScreenshotInfo | null> {
    try {
      // #DEBUG: Processing screenshot
      Logger.debug('SCREENSHOT', 'Processing screenshot', { type });

      const screenshotId = this.generateScreenshotId();
      const filename = this.generateFilename(type);
      const filepath = join(this.config.saveDirectory, filename);

      // 이미지 데이터 준비
      let imageBuffer: Buffer;
      if (this.config.format === 'jpeg') {
        imageBuffer = image.toJPEG(this.config.quality);
      } else {
        imageBuffer = image.toPNG();
      }

      // 자동 저장 설정되어 있으면 파일로 저장
      if (this.config.autoSave) {
        await fs.writeFile(filepath, imageBuffer);
      }

      // 스크린샷 정보 생성
      const screenshotInfo: ScreenshotInfo = {
        id: screenshotId,
        filename,
        filepath,
        timestamp: new Date(),
        size: image.getSize(),
        format: this.config.format,
        fileSize: imageBuffer.length
      };

      // 스크린샷 목록에 추가
      this.screenshots.push(screenshotInfo);

      // 최대 100개까지만 유지
      if (this.screenshots.length > 100) {
        const oldScreenshot = this.screenshots.shift();
        if (oldScreenshot) {
          await this.deleteScreenshotFile(oldScreenshot.filepath);
        }
      }

      Logger.info('SCREENSHOT', 'Screenshot processed successfully', {
        id: screenshotId,
        filename,
        size: screenshotInfo.size,
        fileSize: screenshotInfo.fileSize
      });

      return screenshotInfo;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to process screenshot', error);
      return null;
    }
  }

  // 🔥 스크린샷 ID 생성
  private generateScreenshotId(): string {
    return `screenshot_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 🔥 파일명 생성
  private generateFilename(type: string): string {
    const timestamp = this.config.includeTimestamp 
      ? `_${new Date().toISOString().replace(/[:.]/g, '-')}`
      : '';
    
    return `${this.config.filenamePrefix}_${type}${timestamp}.${this.config.format}`;
  }

  // 🔥 스크린샷 목록 가져오기
  public getScreenshots(): ScreenshotInfo[] {
    try {
      // #DEBUG: Getting screenshots list
      Logger.debug('SCREENSHOT', 'Getting screenshots list', {
        count: this.screenshots.length
      });

      return [...this.screenshots];

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to get screenshots list', error);
      return [];
    }
  }

  // 🔥 스크린샷 삭제
  public async deleteScreenshot(screenshotId: string): Promise<boolean> {
    try {
      // #DEBUG: Deleting screenshot
      Logger.debug('SCREENSHOT', 'Deleting screenshot', { screenshotId });

      const index = this.screenshots.findIndex(s => s.id === screenshotId);
      if (index === -1) {
        Logger.warn('SCREENSHOT', 'Screenshot not found', { screenshotId });
        return false;
      }

      const screenshot = this.screenshots[index];
      
      if (!screenshot) {
        Logger.warn('SCREENSHOT', 'Screenshot not found for deletion', { screenshotId });
        return false;
      }
      
      // 파일 삭제
      await this.deleteScreenshotFile(screenshot.filepath);
      
      // 목록에서 제거
      this.screenshots.splice(index, 1);

      Logger.info('SCREENSHOT', 'Screenshot deleted successfully', {
        screenshotId,
        filename: screenshot.filename
      });

      return true;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to delete screenshot', error);
      return false;
    }
  }

  // 🔥 스크린샷 파일 삭제 (내부 함수)
  private async deleteScreenshotFile(filepath: string): Promise<void> {
    try {
      await fs.unlink(filepath);
      Logger.debug('SCREENSHOT', 'Screenshot file deleted', { filepath });
    } catch (error) {
      // 파일이 이미 없어도 무시
      Logger.debug('SCREENSHOT', 'Screenshot file deletion failed (may not exist)', {
        filepath,
        error
      });
    }
  }

  // 🔥 모든 스크린샷 삭제
  public async deleteAllScreenshots(): Promise<boolean> {
    try {
      // #DEBUG: Deleting all screenshots
      Logger.debug('SCREENSHOT', 'Deleting all screenshots');

      // 모든 파일 삭제
      for (const screenshot of this.screenshots) {
        await this.deleteScreenshotFile(screenshot.filepath);
      }

      // 목록 초기화
      this.screenshots = [];

      Logger.info('SCREENSHOT', 'All screenshots deleted successfully');
      return true;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to delete all screenshots', error);
      return false;
    }
  }

  // 🔥 스크린샷 설정 업데이트
  public async updateConfig(
    updates: Partial<ScreenshotConfig>
  ): Promise<boolean> {
    try {
      // #DEBUG: Updating screenshot config
      Logger.debug('SCREENSHOT', 'Updating screenshot config', updates);

      // 저장 디렉토리 변경 시 이전 디렉토리 확인
      if (updates.saveDirectory && updates.saveDirectory !== this.config.saveDirectory) {
        await fs.mkdir(updates.saveDirectory, { recursive: true });
      }

      this.config = { ...this.config, ...updates };

      Logger.info('SCREENSHOT', 'Screenshot config updated successfully');
      return true;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to update screenshot config', error);
      return false;
    }
  }

  // 🔥 스크린샷 설정 가져오기
  public getConfig(): ScreenshotConfig {
    return { ...this.config };
  }

  // 🔥 스크린샷 저장 위치 열기
  public async openSaveDirectory(): Promise<boolean> {
    try {
      // #DEBUG: Opening save directory
      Logger.debug('SCREENSHOT', 'Opening save directory');

      const { shell } = require('electron');
      await shell.openPath(this.config.saveDirectory);

      Logger.info('SCREENSHOT', 'Save directory opened successfully');
      return true;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to open save directory', error);
      return false;
    }
  }

  // 🔥 사용자에게 저장 위치 선택 요청
  public async chooseSaveDirectory(): Promise<string | null> {
    try {
      // #DEBUG: Choosing save directory
      Logger.debug('SCREENSHOT', 'Choosing save directory');

      const result = await dialog.showOpenDialog({
        title: 'Loop - 스크린샷 저장 폴더 선택',
        defaultPath: this.config.saveDirectory,
        properties: ['openDirectory', 'createDirectory']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        const selectedPath = result.filePaths[0];
        
        if (selectedPath) {
          await this.updateConfig({ saveDirectory: selectedPath });
          
          Logger.info('SCREENSHOT', 'Save directory changed', {
            newDirectory: selectedPath
          });

          return selectedPath;
        }
      }

      Logger.debug('SCREENSHOT', 'Save directory selection cancelled');
      return null;

    } catch (error) {
      Logger.error('SCREENSHOT', 'Failed to choose save directory', error);
      return null;
    }
  }
}

// 🔥 기가차드 싱글톤 스크린샷 관리자
export const screenshotManager = ScreenshotManager.getInstance();

// #DEBUG: Screenshot manager module exit point
Logger.debug('SCREENSHOT', 'Screenshot manager module setup complete');

export default screenshotManager;
