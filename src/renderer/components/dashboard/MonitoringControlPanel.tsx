'use client';

import React, { memo, useCallback } from 'react';
import { Play, Pause, Square, AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import { useMonitoring } from '../../contexts/GlobalMonitoringContext';
import { Logger } from '../../../shared/logger';

// 🔥 작가 친화적 모니터링 패널 스타일 - 다크모드 완벽 지원
const MONITORING_STYLES = {
  container: 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-8 rounded-2xl shadow-sm',
  header: 'flex items-center justify-between mb-6',
  status: 'flex items-center gap-3',
  pulse: 'w-3 h-3 bg-emerald-500 dark:bg-emerald-400 rounded-full animate-pulse shadow-sm',
  title: 'text-xl font-medium text-slate-900 dark:text-slate-100 tracking-wide',
  time: 'font-mono text-xl font-medium text-slate-900 dark:text-slate-100 tracking-wider',
  stats: 'grid grid-cols-3 gap-8 text-center mb-8',
  statValue: 'text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight',
  statLabel: 'text-slate-600 dark:text-slate-400 text-sm font-medium tracking-wide mt-1',
  controls: 'flex items-center gap-4',
  button: 'flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 border',
  startButton: 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white shadow-sm hover:shadow-md',
  stopButton: 'bg-red-600 hover:bg-red-700 border-red-600 text-white shadow-sm hover:shadow-md',
  aiButton: 'bg-violet-600 hover:bg-violet-700 border-violet-600 text-white shadow-sm hover:shadow-md',
} as const;

interface MonitoringControlPanelProps {
  className?: string;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function MonitoringControlPanelComponent({ className }: MonitoringControlPanelProps): React.ReactElement {
  const { state, startMonitoring, stopMonitoring, toggleAI } = useMonitoring();
  const { isMonitoring, isAIOpen, sessionData, startTime } = state;

  // 🔥 경과 시간 계산
  const elapsedTime = React.useMemo(() => {
    if (!startTime || !isMonitoring) return 0;
    return Math.floor((Date.now() - startTime.getTime()) / 1000);
  }, [startTime, isMonitoring]);

  // 🔥 모니터링 시작 핸들러
  const handleStartMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTROL', 'Starting monitoring...');
      await startMonitoring();
    } catch (error) {
      Logger.error('MONITORING_CONTROL', 'Failed to start monitoring', error);
      // TODO: 에러 토스트 표시
    }
  }, [startMonitoring]);

  // 🔥 모니터링 중지 핸들러
  const handleStopMonitoring = useCallback(async (): Promise<void> => {
    try {
      Logger.info('MONITORING_CONTROL', 'Stopping monitoring...');
      await stopMonitoring();
    } catch (error) {
      Logger.error('MONITORING_CONTROL', 'Failed to stop monitoring', error);
      // TODO: 에러 토스트 표시
    }
  }, [stopMonitoring]);

  // 🔥 AI 토글 핸들러
  const handleToggleAI = useCallback((): void => {
    Logger.info('MONITORING_CONTROL', 'Toggling AI panel...');
    toggleAI();
  }, [toggleAI]);

  return (
    <div className={`${MONITORING_STYLES.container} ${className || ''}`}>
      {/* 헤더 */}
      <div className={MONITORING_STYLES.header}>
        <div className={MONITORING_STYLES.status}>
          {isMonitoring && <div className={MONITORING_STYLES.pulse} />}
          <span className={MONITORING_STYLES.title}>
            {isMonitoring ? '모니터링 중' : '모니터링 대기'}
          </span>
        </div>
        <div className={MONITORING_STYLES.time}>
          {formatTime(elapsedTime)}
        </div>
      </div>

      {/* 통계 */}
      <div className={MONITORING_STYLES.stats}>
        <div>
          <div className={MONITORING_STYLES.statValue}>{sessionData.wpm}</div>
          <div className={MONITORING_STYLES.statLabel}>WPM</div>
        </div>
        <div>
          <div className={MONITORING_STYLES.statValue}>{sessionData.words}</div>
          <div className={MONITORING_STYLES.statLabel}>단어</div>
        </div>
        <div>
          <div className={MONITORING_STYLES.statValue}>{formatTime(sessionData.time)}</div>
          <div className={MONITORING_STYLES.statLabel}>시간</div>
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className={MONITORING_STYLES.controls}>
        {!isMonitoring ? (
          <Button
            onClick={handleStartMonitoring}
            className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.startButton}`}
            disabled={false}
          >
            <Play className="w-4 h-4" />
            모니터링 시작
          </Button>
        ) : (
          <Button
            onClick={handleStopMonitoring}
            className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.stopButton}`}
            disabled={false}
          >
            <Square className="w-4 h-4" />
            모니터링 중지
          </Button>
        )}

        <Button
          onClick={handleToggleAI}
          className={`${MONITORING_STYLES.button} ${MONITORING_STYLES.aiButton}`}
          disabled={false}
        >
          <AlertCircle className="w-4 h-4" />
          {isAIOpen ? 'AI 닫기' : 'AI 열기'}
        </Button>
      </div>
    </div>
  );
}

// 🔥 메모화로 성능 최적화
export const MonitoringControlPanel = memo(MonitoringControlPanelComponent);
