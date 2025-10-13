// 🔥 UpdateNotification - Electron Auto-Updater 다운로드 진행률 표시

import React, { useEffect, useState } from 'react';
import { Download, RefreshCw, X } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';

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
 */
export function UpdateNotification(): React.ReactElement | null {
  const [updateAvailable, setUpdateAvailable] = useState<UpdateInfo | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState<DownloadProgress | null>(null);
  const [downloaded, setDownloaded] = useState<UpdateInfo | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

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
      setUpdateAvailable(info);
      setVisible(true);
      setDownloading(true);
    };

    const handleDownloadProgress = (...args: unknown[]) => {
      const progressInfo = args[1] as DownloadProgress;
      setProgress(progressInfo);
    };

    const handleUpdateDownloaded = (...args: unknown[]) => {
      const info = args[1] as UpdateInfo;
      setDownloaded(info);
      setDownloading(false);
    };

    // IPC 리스너 등록 (window.electronAPI.on이 preload에서 노출됨)
    window.electronAPI.on('updater:available', handleUpdateAvailable);
    window.electronAPI.on('updater:download-progress', handleDownloadProgress);
    window.electronAPI.on('updater:downloaded', handleUpdateDownloaded);

    // Cleanup
    return () => {
      window.electronAPI.removeListener('updater:available', handleUpdateAvailable);
      window.electronAPI.removeListener('updater:download-progress', handleDownloadProgress);
      window.electronAPI.removeListener('updater:downloaded', handleUpdateDownloaded);
    };
  }, [mounted]);

  // 🔥 닫기 핸들러
  const handleClose = () => {
    setVisible(false);
    setUpdateAvailable(null);
    setProgress(null);
    setDownloaded(null);
  };

  // 🔥 재시작 핸들러
  const handleRestart = async () => {
    if (typeof window !== 'undefined' && window.electronAPI?.updater) {
      await window.electronAPI.updater.restartAndInstall();
    }
  };

  // 🔥 표시 안 함
  if (!mounted || !visible) return null;

  // 🔥 포맷팅 헬퍼
  const formatBytes = (bytes: number): string => {
    const mb = bytes / 1024 / 1024;
    return `${mb.toFixed(2)} MB`;
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
          ) : (
            <RefreshCw className="w-5 h-5 text-green-500" />
          )}
          <h3 className="font-semibold text-foreground">
            {downloading ? '업데이트 다운로드 중...' : '업데이트 준비 완료'}
          </h3>
        </div>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-accent rounded transition-colors"
          aria-label="닫기"
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
              <span>{formatBytes(progress.transferred)} / {formatBytes(progress.total)}</span>
              <span>{formatSpeed(progress.bytesPerSecond)}</span>
            </div>
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
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                지금 재시작
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground font-medium rounded-lg transition-colors"
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
