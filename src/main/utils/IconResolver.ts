'use strict';

/**
 * 🔥 아이콘 리졸버 유틸리티
 * 빌드 시 올바른 아이콘을 찾을 수 있도록 도와주는 유틸리티 클래스
 */

import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';
import { Logger } from '../../shared/logger';
import { Platform } from './platform';

export class IconResolver {
  private static readonly componentName = 'ICON_RESOLVER';

  /**
   * 🔥 트레이 아이콘 경로 찾기
   */
  public static getTrayIconPath(): string | null {
    try {
      // 🔥 개발 환경과 프로덕션 환경 구분
      const isDev = process.env.NODE_ENV === 'development';
      
      // 아이콘 검색 경로 설정
      const searchPaths: string[] = [];
      
      // 개발 환경과 프로덕션 환경에서 다른 경로 사용
      if (isDev) {
        searchPaths.push(
          // 개발 환경 경로
          path.join(process.cwd(), 'assets', 'icon.icns'),
          path.join(process.cwd(), 'assets', 'icon.ico'),
          path.join(process.cwd(), 'assets', 'icon.png'),
          path.join(process.cwd(), 'assets', 'icon.iconset', 'icon_16x16.png'),
          path.join(process.cwd(), 'public', 'icon', 'trayTemplate.png'),
          path.join(process.cwd(), 'public', 'icon', 'appIcon.png'),
          path.join(process.cwd(), 'public', 'icon.png')
        );
      } else {
        const appPath = app.getAppPath();
        const resourcesPath = process.resourcesPath;
        const appRoot = path.join(resourcesPath, '..');
        
        // 프로덕션 환경의 경로 설정 - 더 많은 가능한 경로 추가
        searchPaths.push(
          // 리소스 패스 내 경로
          path.join(resourcesPath, 'assets', 'icon.icns'),
          path.join(resourcesPath, 'assets', 'icon.ico'),
          path.join(resourcesPath, 'assets', 'icon.png'),
          path.join(resourcesPath, 'assets', 'icon.iconset', 'icon_16x16.png'),
          path.join(resourcesPath, 'assets', 'trayTemplate.png'),
          path.join(resourcesPath, 'assets', 'trayTemplate@2x.png'),
          path.join(resourcesPath, 'app.asar.unpacked', 'assets', 'icon.png'),
          path.join(resourcesPath, 'app.asar.unpacked', 'assets', 'icon.ico'),
          path.join(resourcesPath, 'extraResources', 'assets', 'icon.png'),
          path.join(resourcesPath, 'extraResources', 'assets', 'icon.ico'),
          
          // 앱 경로 내 경로
          path.join(appPath, 'assets', 'icon.icns'),
          path.join(appPath, 'assets', 'icon.ico'),
          path.join(appPath, 'assets', 'icon.png'),
          path.join(appPath, 'assets', 'trayTemplate.png'),
          path.join(appPath, 'public', 'icon', 'trayTemplate.png'),
          path.join(appPath, 'public', 'icon', 'appIcon.png'),
          path.join(appPath, 'public', 'icon.png'),
          
          // 앱 루트 경로 내 아이콘
          path.join(appRoot, 'icon.icns'),
          path.join(appRoot, 'icon.ico'),
          path.join(appRoot, 'icon.png'),
          path.join(appRoot, 'assets', 'icon.ico'),
          path.join(appRoot, 'assets', 'icon.png'),
          
          // 추가 검색 경로
          path.join(process.cwd(), 'assets', 'icon.ico'),
          path.join(process.cwd(), 'assets', 'icon.png')
        );
      }
      
      // 로그 남기기
      Logger.info(this.componentName, '🔍 Looking for tray icon', {
        isDev,
        platform: process.platform,
        searchPathsCount: searchPaths.length
      });
      
      // 검색 경로에서 존재하는 첫 번째 아이콘 반환
      for (const iconPath of searchPaths) {
        try {
          if (fs.existsSync(iconPath)) {
            Logger.info(this.componentName, '✅ Found icon at', { iconPath });
            return iconPath;
          }
        } catch (err) {
          // 오류 무시하고 다음 경로 시도
        }
      }
      
      // 아이콘을 찾지 못한 경우 플랫폼별 기본 아이콘 설정
      let defaultIconPath: string | null = null;
      
      if (Platform.isMacOS()) {
          Logger.warn(this.componentName, '⚠️ macOS icon not found, using app.getAppIcon()');
        return null; // macOS에서는 null을 반환하면 앱 아이콘을 자동으로 사용
      } else if (Platform.isWindows()) {
        defaultIconPath = path.join(isDev ? process.cwd() : app.getAppPath(), 'assets', 'icon.ico');
        Logger.warn(this.componentName, '⚠️ Windows icon not found, using default icon', { defaultIconPath });
      } else {
        defaultIconPath = path.join(isDev ? process.cwd() : app.getAppPath(), 'assets', 'icon.png');
        Logger.warn(this.componentName, '⚠️ Linux icon not found, using default icon', { defaultIconPath });
      }
      
      // 기본 아이콘 존재 여부 확인
      if (defaultIconPath && fs.existsSync(defaultIconPath)) {
        return defaultIconPath;
      }
      
      // 최종적으로 아이콘을 찾지 못한 경우
      Logger.error(this.componentName, '❌ No suitable icon found');
      return null;
    } catch (error) {
      Logger.error(this.componentName, '❌ Error while finding icon', error);
      return null;
    }
  }
}
