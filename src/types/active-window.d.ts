// 🔥 기가차드 active-win 타입 정의 - active-win 8.x 호환
declare module 'active-win' {
  import { WindowInfo } from '../shared/types';
  
  // 🔥 active-win 8.x 옵션 (권한 우회 포함)
  export interface Options {
    accessibilityPermission?: boolean;     // macOS 접근성 권한 (기본: true)
    screenRecordingPermission?: boolean;   // macOS 화면 녹화 권한 (기본: true)
  }
  
  // 🔥 메인 API 함수 (8.x 버전 호환)
  function getActiveWindow(options?: Options): Promise<WindowInfo | undefined>;
  export default getActiveWindow;
}

export {};
