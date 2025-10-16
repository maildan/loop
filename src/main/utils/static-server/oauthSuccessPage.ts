import { Logger } from '../../../shared/logger';

/**
 * 🔥 OAuth Success Page Generator
 * 
 * Modern, CSP-compliant OAuth success/error pages
 * - Nonce-based inline scripts for strict CSP
 * - Auto app launch via custom protocol (loop://)
 * - Countdown timer with manual override button
 * - Dark mode support
 * - Smooth animations and transitions
 */
export class OAuthSuccessPage {

    /**
     * 🎉 Generate OAuth success page
     * 
     * Features:
     * - Auto-launches app via loop://oauth-success after 3s
     * - Manual launch button for user control
     * - Countdown timer with visual feedback
     * - Graceful fallback if protocol handler fails
     * 
     * @param nonce - CSP nonce for inline scripts
     */
    public static generateSuccessHtml(nonce: string): string {
        Logger.info('OAUTH_SUCCESS', 'Generating OAuth success page with app launch capability');

        return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loop - 인증 완료</title>
  <style>
    /* 🎨 Design System - Modern Minimalist */
    :root {
      /* Light theme */
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #1a1a1a;
      --text-secondary: #6c757d;
      --text-muted: #adb5bd;
      --accent: #0066ff;
      --accent-hover: #0052cc;
      --accent-light: #e6f0ff;
      --success: #00c853;
      --success-light: #e8f5e9;
      --border: #e9ecef;
      --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
      --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.12);
      --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2a2a2a;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --text-muted: #808080;
        --accent: #4d94ff;
        --accent-hover: #3380ff;
        --accent-light: #1a3d6b;
        --success: #4caf50;
        --success-light: #1e3a1e;
        --border: #3a3a3a;
        --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.3);
        --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.4);
        --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
      }
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-secondary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.6;
    }

    .container {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: 48px 40px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      max-width: 480px;
      width: 100%;
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border);
    }

    /* Top accent bar */
    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent), var(--success));
    }

    /* Success icon with animation */
    .icon-container {
      width: 80px;
      height: 80px;
      background: var(--success-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
      animation: iconPulse 2s ease-in-out infinite;
    }

    @keyframes iconPulse {
      0%, 100% { 
        transform: scale(1); 
        box-shadow: 0 0 0 0 var(--success-light);
      }
      50% { 
        transform: scale(1.05); 
        box-shadow: 0 0 0 8px transparent;
      }
    }

    .icon-container svg {
      width: 40px;
      height: 40px;
      color: var(--success);
      stroke-width: 3;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 32px;
      line-height: 1.5;
    }

    /* Status message */
    .status {
      background: var(--accent-light);
      border-left: 4px solid var(--accent);
      border-radius: var(--radius-sm);
      padding: 16px;
      margin-bottom: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    .status-text {
      font-size: 14px;
      color: var(--text-primary);
      font-weight: 500;
    }

    /* Spinner animation */
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--accent-light);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Launch button */
    .launch-btn {
      background: var(--accent);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      width: 100%;
      font-family: inherit;
      box-shadow: var(--shadow-sm);
    }

    .launch-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .launch-btn:active {
      transform: translateY(0);
      box-shadow: var(--shadow-sm);
    }

    .launch-btn:focus {
      outline: none;
      box-shadow: 0 0 0 3px var(--accent-light);
    }

    /* Countdown */
    .countdown {
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-muted);
    }

    .countdown-number {
      color: var(--accent);
      font-weight: 700;
      font-size: 20px;
      display: inline-block;
      min-width: 24px;
    }

    /* Fade in animation */
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .container {
      animation: fadeIn 0.4s ease-out;
    }

    /* Responsive */
    @media (max-width: 480px) {
      .container {
        padding: 36px 24px;
      }
      h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon-container">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    </div>
    
    <h1>인증 완료!</h1>
    <p class="subtitle">Google 계정 연동이 성공적으로 완료되었습니다.</p>
    
    <div class="status">
      <div class="spinner"></div>
      <span class="status-text">Loop 앱으로 자동 이동 중...</span>
    </div>
    
    <button class="launch-btn" id="launchBtn">
      Loop 앱 열기
    </button>
    
    <div class="countdown">
      <span class="countdown-number" id="countdown">3</span>초 후 자동으로 앱이 열립니다
    </div>
  </div>

  <script nonce="${nonce}">
    (function() {
      'use strict';
      
      let countdown = 3;
      let countdownTimer = null;
      let autoLaunchTimer = null;
      const countdownElement = document.getElementById('countdown');
      const launchBtn = document.getElementById('launchBtn');
      
      /**
       * Launch Loop app via custom protocol
       */
      function launchApp() {
        try {
          // 1️⃣ IPC 신호 전송: renderer의 ProjectCreator에 토큰 재검증 요청
          if (window.electronAPI?.onOAuthSuccess) {
            window.electronAPI.onOAuthSuccess();
            console.log('[OAuth Success] IPC signal sent to renderer');
          }
        } catch (e) {
          console.warn('[OAuth Success] IPC signal failed:', e);
        }
        
        try {
          // 2️⃣ 커스텀 프로토콜로 앱 전환
          window.location.href = 'loop://oauth-success';
          console.log('[OAuth Success] App launch initiated via loop:// protocol');
        } catch (e) {
          console.warn('[OAuth Success] Protocol handler failed:', e);
        }
        
        // 3️⃣ 짧은 지연 후 창 종료
        setTimeout(function() {
          try {
            window.close();
          } catch (e) {
            console.log('[OAuth Success] Window close not permitted');
          }
        }, 1000);
      }
      
      /**
       * Start countdown timer
       */
      function startCountdown() {
        countdownTimer = setInterval(function() {
          countdown--;
          if (countdownElement) {
            countdownElement.textContent = countdown;
          }
          
          if (countdown <= 0) {
            clearInterval(countdownTimer);
          }
        }, 1000);
      }
      
      /**
       * Initialize page behavior
       */
      function init() {
        // Manual launch button
        if (launchBtn) {
          launchBtn.addEventListener('click', function() {
            // Cancel auto launch
            if (autoLaunchTimer) {
              clearTimeout(autoLaunchTimer);
            }
            if (countdownTimer) {
              clearInterval(countdownTimer);
            }
            
            launchApp();
          });
        }
        
        // Start countdown immediately
        startCountdown();
        
        // Auto launch after 3 seconds
        autoLaunchTimer = setTimeout(function() {
          launchApp();
        }, 3000);
      }
      
      // Start when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }
      
      // Handle visibility change (user returns to tab)
      document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
          // User came back to this tab - try launching again
          setTimeout(function() {
            launchApp();
          }, 500);
        }
      });
    })();
  </script>
</body>
</html>`;
    }

    /**
     * ❌ Generate OAuth error page
     * 
     * Features:
     * - Clear error messaging
     * - Auto-close after 5 seconds
     * - Retry button to restart flow
     * - Consistent design with success page
     * 
     * @param nonce - CSP nonce for inline scripts
     * @param error - Optional error message to display
     */
    public static generateErrorHtml(nonce: string, error?: string): string {
        Logger.warn('OAUTH_ERROR', 'Generating OAuth error page', { error });

        return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loop - 인증 오류</title>
  <style>
    /* Reuse design system from success page */
    :root {
      --bg-primary: #ffffff;
      --bg-secondary: #f8f9fa;
      --text-primary: #1a1a1a;
      --text-secondary: #6c757d;
      --text-muted: #adb5bd;
      --error: #dc3545;
      --error-hover: #c82333;
      --error-light: #ffe5e8;
      --border: #e9ecef;
      --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.15);
      --radius-lg: 16px;
      --radius-md: 12px;
      --radius-sm: 8px;
      --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #1a1a1a;
        --bg-secondary: #2a2a2a;
        --text-primary: #ffffff;
        --text-secondary: #b0b0b0;
        --text-muted: #808080;
        --error: #ff6b6b;
        --error-hover: #ff5252;
        --error-light: #3a1f1f;
        --border: #3a3a3a;
      }
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: var(--bg-secondary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      line-height: 1.6;
    }

    .container {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: 48px 40px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      max-width: 480px;
      width: 100%;
      position: relative;
      border: 1px solid var(--border);
      animation: fadeIn 0.4s ease-out;
    }

    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--error);
    }

    .icon-container {
      width: 80px;
      height: 80px;
      background: var(--error-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 32px;
    }

    .icon-container svg {
      width: 40px;
      height: 40px;
      color: var(--error);
      stroke-width: 3;
    }

    h1 {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }

    .subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 24px;
      line-height: 1.5;
    }

    .error-details {
      background: var(--error-light);
      border-left: 4px solid var(--error);
      border-radius: var(--radius-sm);
      padding: 16px;
      margin-bottom: 32px;
      text-align: left;
      font-size: 14px;
      color: var(--text-primary);
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      word-break: break-word;
    }

    .close-btn {
      background: var(--error);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: 16px 32px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      width: 100%;
      font-family: inherit;
    }

    .close-btn:hover {
      background: var(--error-hover);
      transform: translateY(-2px);
    }

    .close-btn:active {
      transform: translateY(0);
    }

    .countdown {
      margin-top: 24px;
      font-size: 14px;
      color: var(--text-muted);
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .container { padding: 36px 24px; }
      h1 { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="icon-container">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    
    <h1>인증 오류</h1>
    <p class="subtitle">인증 과정에서 문제가 발생했습니다.</p>
    
    ${error ? `<div class="error-details">${error}</div>` : ''}
    
    <button class="close-btn" id="closeBtn">창 닫기</button>
    
    <div class="countdown">
      <span id="countdown">5</span>초 후 자동으로 닫힙니다
    </div>
  </div>

  <script nonce="${nonce}">
    (function() {
      'use strict';
      
      let countdown = 5;
      const countdownElement = document.getElementById('countdown');
      const closeBtn = document.getElementById('closeBtn');
      
      function closeWindow() {
        try {
          window.close();
        } catch (e) {
          console.log('[OAuth Error] Window close not permitted');
        }
      }
      
      function startCountdown() {
        const timer = setInterval(function() {
          countdown--;
          if (countdownElement) {
            countdownElement.textContent = countdown;
          }
          
          if (countdown <= 0) {
            clearInterval(timer);
            closeWindow();
          }
        }, 1000);
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('click', closeWindow);
      }
      
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startCountdown);
      } else {
        startCountdown();
      }
    })();
  </script>
</body>
</html>`;
    }
}

