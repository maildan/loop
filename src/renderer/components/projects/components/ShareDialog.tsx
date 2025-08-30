'use client';

import React, { useState, useCallback } from 'react';
import { X as XIcon, Share2, Copy, Check, Download, Mail } from 'lucide-react';
import { Logger } from '../../../../shared/logger';

// 🔥 프리컴파일된 스타일 (11원칙 준수)
const SHARE_DIALOG_STYLES = {
  overlay: 'fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50',
  dialog: 'bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden',
  header: 'flex items-center gap-3 p-6 border-b border-slate-200 dark:border-slate-700',
  icon: 'w-8 h-8 text-blue-500 flex-shrink-0',
  headerText: 'flex-1',
  title: 'text-lg font-bold text-slate-900 dark:text-slate-100',
  subtitle: 'text-sm text-slate-600 dark:text-slate-400 mt-1',
  closeButton: 'w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors',
  content: 'p-6 space-y-4',
  section: 'space-y-3',
  sectionTitle: 'text-sm font-medium text-slate-900 dark:text-slate-100',
  optionGrid: 'grid grid-cols-2 gap-3',
  option: 'flex items-center gap-3 p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer',
  optionIcon: 'w-5 h-5 text-slate-600 dark:text-slate-400',
  optionText: 'text-sm text-slate-700 dark:text-slate-300',
  urlSection: 'space-y-2',
  urlLabel: 'text-sm font-medium text-slate-900 dark:text-slate-100',
  urlContainer: 'flex items-center gap-2',
  urlInput: 'flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-900 dark:text-slate-100 font-mono',
  copyButton: 'px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2',
  copiedButton: 'px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium flex items-center gap-2',
  footer: 'p-6 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400',
} as const;

interface ShareDialogProps {
  isOpen: boolean;
  projectTitle: string;
  projectId: string;
  onClose: () => void;
}

export function ShareDialog({ isOpen, projectTitle, projectId, onClose }: ShareDialogProps): React.ReactElement | null {
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // 🔥 임시 공유 URL (실제로는 서버에서 생성)
  const shareUrl = `https://loop-writer.app/shared/${projectId}`;

  const handleOverlayClick = (event: React.MouseEvent): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent): void => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const handleCopyUrl = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedUrl(true);
      Logger.info('SHARE_DIALOG', 'URL copied to clipboard');
      
      // 3초 후 상태 리셋
      setTimeout(() => setCopiedUrl(false), 3000);
    } catch (error) {
      Logger.error('SHARE_DIALOG', 'Failed to copy URL', error);
    }
  }, [shareUrl]);

  const handleExportText = useCallback((): void => {
    // 🔥 텍스트 파일로 내보내기 (실제 구현 필요)
    Logger.info('SHARE_DIALOG', 'Export as text requested');
    // TODO: 실제 내보내기 구현
  }, []);

  const handleExportPdf = useCallback((): void => {
    // 🔥 PDF로 내보내기 (실제 구현 필요)
    Logger.info('SHARE_DIALOG', 'Export as PDF requested');
    // TODO: 실제 PDF 내보내기 구현
  }, []);

  const handleSendEmail = useCallback((): void => {
    // 🔥 이메일로 공유하기
    const subject = encodeURIComponent(`Loop 프로젝트: ${projectTitle}`);
    const body = encodeURIComponent(`안녕하세요,\n\n"${projectTitle}" 프로젝트를 공유합니다.\n\n${shareUrl}\n\nLoop Writer에서 확인해보세요!`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.open(mailtoUrl, '_blank');
    Logger.info('SHARE_DIALOG', 'Email sharing opened');
  }, [projectTitle, shareUrl]);

  if (!isOpen) return null;

  return (
    <div 
      className={SHARE_DIALOG_STYLES.overlay} 
      onClick={handleOverlayClick}
      onKeyDown={handleEscapeKey}
      tabIndex={-1}
    >
      <div className={SHARE_DIALOG_STYLES.dialog}>
        {/* 🔥 헤더 */}
        <div className={SHARE_DIALOG_STYLES.header}>
          <Share2 className={SHARE_DIALOG_STYLES.icon} />
          <div className={SHARE_DIALOG_STYLES.headerText}>
            <h3 className={SHARE_DIALOG_STYLES.title}>프로젝트 공유</h3>
            <p className={SHARE_DIALOG_STYLES.subtitle}>&ldquo;{projectTitle}&rdquo; 작품 공유하기</p>
          </div>
          <button
            className={SHARE_DIALOG_STYLES.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <XIcon size={20} />
          </button>
        </div>

        {/* 🔥 내용 */}
        <div className={SHARE_DIALOG_STYLES.content}>
          {/* 🔥 링크 공유 */}
          <div className={SHARE_DIALOG_STYLES.section}>
            <h4 className={SHARE_DIALOG_STYLES.sectionTitle}>링크로 공유</h4>
            <div className={SHARE_DIALOG_STYLES.urlContainer}>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className={SHARE_DIALOG_STYLES.urlInput}
              />
              <button
                className={copiedUrl ? SHARE_DIALOG_STYLES.copiedButton : SHARE_DIALOG_STYLES.copyButton}
                onClick={handleCopyUrl}
                disabled={copiedUrl}
              >
                {copiedUrl ? (
                  <>
                    <Check size={16} />
                    복사됨
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    복사
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 🔥 공유 옵션 */}
          <div className={SHARE_DIALOG_STYLES.section}>
            <h4 className={SHARE_DIALOG_STYLES.sectionTitle}>공유 방법</h4>
            <div className={SHARE_DIALOG_STYLES.optionGrid}>
              <button
                className={SHARE_DIALOG_STYLES.option}
                onClick={handleSendEmail}
              >
                <Mail className={SHARE_DIALOG_STYLES.optionIcon} />
                <span className={SHARE_DIALOG_STYLES.optionText}>이메일</span>
              </button>
              
              <button
                className={SHARE_DIALOG_STYLES.option}
                onClick={handleExportText}
              >
                <Download className={SHARE_DIALOG_STYLES.optionIcon} />
                <span className={SHARE_DIALOG_STYLES.optionText}>텍스트 파일</span>
              </button>
            </div>
          </div>
        </div>

        {/* 🔥 푸터 */}
        <div className={SHARE_DIALOG_STYLES.footer}>
          💡 공유된 프로젝트는 읽기 전용으로 제공됩니다. 원본 편집은 작성자만 가능합니다.
        </div>
      </div>
    </div>
  );
}
