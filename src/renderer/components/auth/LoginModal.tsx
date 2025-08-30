"use client";

import React from 'react';
import { Button } from '../ui/Button';

export default function LoginModal({ open, onClose, onLogin }: { open: boolean; onClose: () => void; onLogin: () => Promise<void> }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Google 재로그인 필요"
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 w-full max-w-md mx-4"
      >
        <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">Google 재로그인 필요</h3>
        <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Google 인증이 만료되었거나 연결이 해제되었습니다. 계속하려면 다시 로그인해주세요.</p>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>취소</Button>
          <Button onClick={async () => { await onLogin(); onClose(); }}>Google로 로그인</Button>
        </div>
      </div>
    </div>
  );
}
