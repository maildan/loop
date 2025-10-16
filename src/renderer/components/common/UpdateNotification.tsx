// 🔥 UpdateNotification - Electron Auto-Updater 다운로드 진행률 표시

import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, X, AlertCircle } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { Logger } from '../../../shared/logger';

interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

interface UpdateInfo {
  version: string;
  releaseDate: string;
}

/**
 * 🔥 UpdateNotification 컴포넌트
 * 
 * Electron Auto-Updater의 다운로드 진행률을 표시하는 알림 UI
 * - Main process에서 전송하는 IPC 이벤트 수신
 * - 다운로드 진행률 실시간 표시
 * - 다운로드 완료 시 재시작 버튼 표시
 * - 모든 플랫폼 (macOS arm64/x64, Windows, Linux) 지원
 */
export function UpdateNotification(): React.ReactElement | null {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [downloaded, setDownloaded] = useState<UpdateInfo | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [restarting, setRestarting] = useState(false);
  const [restartError, setRestartError] = useState<string | null>(null);

  // 🔥 Client-side only (SSR 방지)
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // 🔥 IPC 리스너 등록
    if (!mounted || typeof window === 'undefined' || !window.electronAPI) {
      return;
    }

    const handleUpdateAvailable = (...args: unknown[]) => {
      const info = args[1] as UpdateInfo;
      Logger.info('UPDATE_NOTIFICATION', '✅ 업데이트 사용 가능', { version: info.version });
      setUpdateAvailable(info);
      setVisible(true);
      setDownloading(true);
      setRestartError(null);
    };

    const handleDownloadProgress = (...args: unknown[]) => {
      const progressInfo = args[1] as DownloadProgress;
      setProgress(progressInfo);
    };

    const handleUpdateDownloaded = (...args: unknown[]) => {
      const info = args[1] as UpdateInfo;
      Logger.info('UPDATE_NOTIFICATION', '✅ 업데이트 다운로드 완료', { version: info.version });
      setDownloaded(info);
      setDownloading(false);
    };

    const handleUpdateError = (...args: unknown[]) => {
      const error = args[1] as string;
      Logger.error('UPDATE_NOTIFICATION', '❌ 업데이트 오류', { error });
      setDownloading(false);
    };

    // IPC 리스너 등록 (window.electronAPI.on이 preload에서 노출됨)
    window.electronAPI.on('updater:available', handleUpdateAvailable);
    window.electronAPI.on('updater:download-progress', handleDownloadProgress);
    window.electronAPI.on('updater:downloaded', handleUpdateDownloaded);
    window.electronAPI.on('updater:error', handleUpdateError);

    Logger.debug('UPDATE_NOTIFICATION', '🔧 IPC 리스너 등록 완료');

    // Cleanup
    return () => {
      window.electronAPI.removeListener('updater:available', handleUpdateAvailable);
      window.electronAPI.removeListener('updater:download-progress', handleDownloadProgress);
      window.electronAPI.removeListener('updater:downloaded', handleUpdateDownloaded);
      window.electronAPI.removeListener('updater:error', handleUpdateError);
    };
  }, [mounted]);

  // 🔥 닫기 핸들러
  const handleClose = () => {
    setVisible(false);
    setUpdateAvailable(null);
    setProgress(null);
    setDownloaded(null);
    setRestarting(false);
    setRestartError(null);
  };

  // 🔥 재시작 핸들러 (모든 플랫폼 지원)
  const handleRestart = async () => {
    if (typeof window === 'undefined' || !window.electronAPI) {
      setRestartError('데스크톱 앱에서만 사용 가능합니다');
      Logger.error('UPDATE_NOTIFICATION', '❌ window.electronAPI 없음');
      return;
    }

    try {
      setRestarting(true);
      setRestartError(null);
      Logger.info('UPDATE_NOTIFICATION', '🔄 업데이트 재시작 시작...');

      // 🔥 플랫폼별 재시작 명령
      const platform = process.platform;
      Logger.debug('UPDATE_NOTIFICATION', '📱 플랫폼 감지', { platform });

      // 방법 1: IPC 호출 (Main process의 updater:restart-and-install 핸들러)
      if (window.electronAPI?.updater?.restartAndInstall) {
        Logger.debug('UPDATE_NOTIFICATION', '📡 IPC 호출: updater.restartAndInstall()');
        await window.electronAPI.updater.restartAndInstall();
        Logger.info('UPDATE_NOTIFICATION', '✅ 재시작 완료');
      } 
      // 방법 2: app 제어 IPC 호출 (fallback)
      else if (window.electronAPI?.app?.restart) {
        Logger.debug('UPDATE_NOTIFICATION', '📡 IPC 호출: app.restart()');
        await window.electronAPI.app.restart();
        Logger.info('UPDATE_NOTIFICATION', '✅ 재시작 완료 (앱 재시작)');
      }
      // 방법 3: 커스텀 재시작 IPC (updater:quitAndInstall)
      else if (window.electronAPI?.updater?.quitAndInstall) {
        Logger.debug('UPDATE_NOTIFICATION', '📡 IPC 호출: updater.quitAndInstall()');
        await window.electronAPI.updater.quitAndInstall();
        Logger.info('UPDATE_NOTIFICATION', '✅ 재시작 완료 (quitAndInstall)');
      } else {
        throw new Error('사용 가능한 재시작 메서드를 찾을 수 없습니다');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류';
      Logger.error('UPDATE_NOTIFICATION', '❌ 재시작 실패', { error: errorMessage, platform: process.platform });
      setRestartError(errorMessage);
      setRestarting(false);
    }
  };

  // 🔥 표시 안 함
  if (!mounted || !visible) return null;

  // 🔥 포맷팅 헬퍼 (개선: MB 중복 제거)
  const formatBytes = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return mb.toFixed(2);
  };

  const formatSpeed = (bytesPerSecond: number): string => {
    const mbps = bytesPerSecond / 1024 / 1024;
    return `${mbps.toFixed(2)} MB/s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 bg-accent/10 border-b border-border">
        <div className="flex items-center gap-2">
          {downloading ? (
            <Download className="w-5 h-5 text-blue-500 animate-pulse" />
          ) : restartError ? (
            <AlertCircle className="w-5 h-5 text-red-500" />
          ) : (
            <RefreshCw className="w-5 h-5 text-green-500" />
          )}
          <h3 className="font-semibold text-foreground">
            {downloading ? '업데이트 다운로드 중...' : restartError ? '재시작 오류' : '업데이트 준비 완료'}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-accent rounded transition-colors"
          aria-label="닫기"
          disabled={restarting}
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="p-4 space-y-3">
        {/* 버전 정보 */}
        {updateAvailable && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Loop {updateAvailable.version}</span> 업데이트
          </div>
        )}

        {/* 다운로드 진행률 */}
        {downloading && progress && (
          <div className="space-y-2">
            <ProgressBar
              value={progress.percent}
              color="blue"
              size="md"
              animated
              showLabel
              label={`${progress.percent.toFixed(1)}%`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              {/* 🔥 개선: MB 단위 중복 제거 */}
              <span>{formatBytes(progress.transferred)} / {formatBytes(progress.total)} MB</span>
              <span>{formatSpeed(progress.bytesPerSecond)}</span>
            </div>
          </div>
        )}

        {/* 재시작 오류 표시 */}
        {restartError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">
              ⚠️ {restartError}
            </p>
            <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
              수동으로 애플리케이션을 다시 시작해주세요.
            </p>
          </div>
        )}

        {/* 다운로드 완료 */}
        {downloaded && !downloading && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              업데이트가 다운로드되었습니다. 지금 재시작하시겠습니까?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                disabled={restarting || !!restartError}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
              >
                {restarting ? '재시작 중...' : '지금 재시작'}
              </button>
              <button
                onClick={handleClose}
                disabled={restarting}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground font-medium rounded-lg transition-colors"
              >
                나중에
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
