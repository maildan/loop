import { Logger } from '../../../shared/logger';

/**
 * 🔥 OAuth 인증 성공 페이지 - 모듈화된 HTML 템플릿
 * global.css 스타일 규칙을 따르며, 자동 앱 열기 기능 포함
 */
export class OAuthSuccessPage {

    /**
     * 🔥 OAuth 성공 시 표시할 HTML 페이지 생성
     * - global.css 색상 시스템 적용
     * - 자동 앱 열기 (VS Code 스타일)
     * - 향상된 UX (로딩 애니메이션, 상태 메시지)
     */
    public static generateSuccessHtml(): string {
        Logger.info('OAUTH_SUCCESS', 'Generating OAuth success page with app launch capability');

        return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loop - 인증 완료</title>
  <style>
    /* 🔥 global.css 색상 시스템 적용 */
    :root {
      --bg-primary: #fefcf7;
      --bg-elevated: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #4a4a4a;
      --text-muted: #737373;
      --accent-primary: #2563eb;
      --accent-hover: #1d4ed8;
      --accent-light: #dbeafe;
      --success: #059669;
      --success-light: #d1fae5;
      --border-light: #e5e7eb;
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --app-font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: var(--app-font-family);
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--accent-light) 100%);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: var(--bg-elevated);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      max-width: 400px;
      width: 100%;
      position: relative;
      overflow: hidden;
    }

    .container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--accent-primary), var(--success));
    }

    .success-icon {
      width: 64px;
      height: 64px;
      background: var(--success-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: successPulse 2s ease-in-out infinite;
    }

    .success-icon svg {
      width: 32px;
      height: 32px;
      color: var(--success);
    }

    h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 12px;
    }

    .subtitle {
      font-size: 16px;
      color: var(--text-secondary);
      margin-bottom: 32px;
      line-height: 1.5;
    }

    .status-message {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 24px;
      padding: 12px;
      background: var(--accent-light);
      border-radius: 8px;
      border-left: 4px solid var(--accent-primary);
    }

    .countdown {
      font-size: 14px;
      color: var(--text-muted);
      font-weight: 500;
    }

    .countdown-number {
      color: var(--accent-primary);
      font-weight: 700;
    }

    .app-launch-btn {
      background: var(--accent-primary);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-top: 16px;
      font-family: inherit;
    }

    .app-launch-btn:hover {
      background: var(--accent-hover);
      transform: translateY(-1px);
    }

    .loader {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 2px solid var(--accent-light);
      border-radius: 50%;
      border-top-color: var(--accent-primary);
      animation: spin 1s ease-in-out infinite;
      margin-right: 8px;
    }

    @keyframes successPulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* 🔥 다크모드 지원 */
    @media (prefers-color-scheme: dark) {
      :root {
        --bg-primary: #0f172a;
        --bg-elevated: #1e293b;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --text-muted: #64748b;
        --border-light: #334155;
        --accent-light: #1e3a8a;
        --success-light: #064e3b;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20,6 9,17 4,12"></polyline>
      </svg>
    </div>
    
    <h1>인증 완료!</h1>
    <p class="subtitle">Google 계정 연동이 성공적으로 완료되었습니다.</p>
    
    <div class="status-message">
      <div class="loader"></div>
      Loop 앱으로 자동 이동 중...
    </div>
    
    <button class="app-launch-btn" onclick="openApp()">
      Loop 앱 열기
    </button>
    
    <p class="countdown">
      <span class="countdown-number" id="countdown">3</span>초 후 창이 자동으로 닫힙니다
    </p>
  </div>

  <script>
    let countdown = 3;
    const countdownElement = document.getElementById('countdown');
    
    // 🔥 앱 자동 열기 시도 (VS Code 스타일)
    function openApp() {
      try {
        // Loop 앱 커스텀 프로토콜 시도
        window.location.href = 'loop://oauth-success';
      } catch (e) {
        console.log('Direct app launch failed, continuing with window close');
      }
    }
    
    // 🔥 카운트다운 및 자동 닫기
    function startCountdown() {
      const timer = setInterval(() => {
        countdown--;
        if (countdownElement) {
          countdownElement.textContent = countdown;
        }
        
        if (countdown <= 0) {
          clearInterval(timer);
          window.close();
        }
      }, 1000);
    }
    
    // 🔥 페이지 로드 시 실행
    window.addEventListener('DOMContentLoaded', () => {
      // 앱 열기 시도
      setTimeout(() => {
        openApp();
      }, 500);
      
      // 카운트다운 시작
      setTimeout(() => {
        startCountdown();
      }, 1000);
    });
    
    // 🔥 사용자가 다른 곳으로 이동했다가 돌아온 경우 자동 닫기
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        setTimeout(() => {
          window.close();
        }, 500);
      }
    });
  </script>
</body>
</html>`;
    }

    /**
     * 🔥 에러 발생 시 표시할 HTML 페이지
     */
    public static generateErrorHtml(error?: string): string {
        Logger.warn('OAUTH_SUCCESS', 'Generating OAuth error page', { error });

        return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Loop - 인증 오류</title>
  <style>
    /* 기본 스타일은 성공 페이지와 동일 */
    :root {
      --bg-primary: #fefcf7;
      --bg-elevated: #ffffff;
      --text-primary: #1a1a1a;
      --text-secondary: #4a4a4a;
      --error: #dc2626;
      --error-light: #fee2e2;
      --border-light: #e5e7eb;
      --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      --app-font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: var(--app-font-family);
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .container {
      background: var(--bg-elevated);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--border-light);
      max-width: 400px;
      width: 100%;
    }

    .error-icon {
      width: 64px;
      height: 64px;
      background: var(--error-light);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }

    .error-icon svg {
      width: 32px;
      height: 32px;
      color: var(--error);
    }

    h1 { font-size: 24px; font-weight: 700; margin-bottom: 12px; }
    .subtitle { font-size: 16px; color: var(--text-secondary); margin-bottom: 24px; }
    .error-details { font-size: 14px; color: var(--error); background: var(--error-light); padding: 12px; border-radius: 8px; margin-bottom: 24px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="error-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="15" y1="9" x2="9" y2="15"></line>
        <line x1="9" y1="9" x2="15" y2="15"></line>
      </svg>
    </div>
    
    <h1>인증 오류</h1>
    <p class="subtitle">인증 과정에서 문제가 발생했습니다.</p>
    
    ${error ? `<div class="error-details">${error}</div>` : ''}
    
    <p>잠시 후 창이 자동으로 닫힙니다.</p>
  </div>

  <script>
    setTimeout(() => window.close(), 3000);
  </script>
</body>
</html>`;
    }
}
