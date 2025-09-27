# 🎨 Loop Theme System Documentation

Loop의 완전한 다중 테마 시스템 - 작가와 개발자를 위한 아름다운 테마 경험을 제공합니다.

## 🚀 빠른 시작

### 1. 기본 설정

```tsx
// _app.tsx 또는 main.tsx에서
import { AppThemeWrapper } from '@/renderer/components/AppThemeWrapper';

function MyApp({ Component, pageProps }) {
  return (
    <AppThemeWrapper>
      <Component {...pageProps} />
    </AppThemeWrapper>
  );
}
```

### 2. 컴포넌트에서 테마 사용

```tsx
import { useTheme, useDarkMode } from '@/renderer/themes';

function MyComponent() {
  const { theme, setTheme, isDarkMode } = useTheme();
  const { isDark, toggle } = useDarkMode();
  
  return (
    <div>
      <p>현재 테마: {theme}</p>
      <button onClick={() => setTheme('writer-focus')}>
        작가 모드
      </button>
      <button onClick={toggle}>
        {isDark ? '라이트' : '다크'} 모드
      </button>
    </div>
  );
}
```

### 3. 테마 선택기 UI 사용

```tsx
import { ThemeSelector } from '@/renderer/themes';

function SettingsPage() {
  return (
    <div>
      <h1>설정</h1>
      
      {/* 전체 테마 선택기 */}
      <ThemeSelector />
      
      {/* 또는 컴팩트 버전 */}
      <ThemeSelector compact className="fixed top-4 right-4" />
    </div>
  );
}
```

## 🎨 제공되는 테마들

### 기본 테마
- **Light**: shadcn/ui 표준 라이트 테마
- **Dark**: shadcn/ui 표준 다크 테마

### 작가 전용 테마
- **Writer Focus**: 장시간 글쓰기에 최적화
  - 세리프 폰트 우선 사용
  - 극도로 어두운 배경 (눈의 피로 감소)
  - 최소한의 UI 요소 (집중도 향상)
  - 라이트/다크 변형 지원

- **Sepia Paper**: 종이 질감의 따뜻한 테마
  - 빈티지 세피아 색상 팔레트
  - 종이 텍스처 효과
  - 따뜻한 그림자와 경계
  - 라이트/다크 변형 지원

### 접근성 테마
- **High Contrast**: 고대비 모드
- **Colorblind Friendly**: 색맹 친화 모드

## 🔧 고급 사용법

### 사용자 정의 테마 만들기

1. **CSS 파일 생성** (`src/renderer/styles/themes/my-theme.css`):

```css
/* 커스텀 테마 */
.my-theme {
  /* 기본 색상 */
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  
  /* 프라이머리 색상 */
  --primary: 142 76% 36%;
  --primary-foreground: 355 7% 97%;
  
  /* 에디터 전용 변수 */
  --editor-background: var(--background);
  --editor-text: var(--foreground);
}

.my-theme.dark {
  /* 다크 모드 변형 */
  --background: 222 84% 4.9%;
  --foreground: 210 40% 98%;
}
```

2. **TypeScript 타입 확장**:

```tsx
// shared/types/theme.ts에 추가
export type Theme = 
  | 'light' 
  | 'dark' 
  | 'writer-focus' 
  | 'writer-focus-dark'
  | 'sepia'
  | 'sepia-dark'
  | 'my-theme'      // 새 테마 추가
  | 'my-theme-dark' // 다크 변형 추가
  | 'high-contrast'
  | 'colorblind-friendly';
```

3. **메타데이터 등록**:

```tsx
// utils/themeUtils.ts의 DEFAULT_THEMES에 추가
{
  id: 'my-theme',
  name: '내 테마',
  description: '나만의 특별한 테마',
  category: 'custom',
  author: 'Your Name',
  version: '1.0.0',
  tags: ['커스텀', '개인화'],
  supportsDarkMode: true,
  isAccessible: true,
  colorSpace: 'oklch'
}
```

### 프로그래밍 방식으로 테마 변경

```tsx
import { useTheme } from '@/renderer/themes';

function AutoThemeSwitcher() {
  const { setTheme } = useTheme();
  
  useEffect(() => {
    // 시간 기반 자동 전환
    const hour = new Date().getHours();
    if (hour >= 18 || hour <= 6) {
      setTheme('writer-focus-dark', {
        duration: 500,
        easing: 'ease-in-out'
      });
    } else {
      setTheme('light');
    }
  }, []);
  
  return null;
}
```

### 접근성 옵션 관리

```tsx
import { useAccessibility } from '@/renderer/themes';

function AccessibilitySettings() {
  const { accessibility, toggleOption, supports } = useAccessibility();
  
  return (
    <div>
      {supports.highContrast && (
        <label>
          <input 
            type="checkbox"
            checked={accessibility.highContrast}
            onChange={() => toggleOption('highContrast')}
          />
          고대비 모드
        </label>
      )}
      
      {supports.colorblindFriendly && (
        <label>
          <input 
            type="checkbox"
            checked={accessibility.colorblindFriendly}
            onChange={() => toggleOption('colorblindFriendly')}
          />
          색맹 친화 모드
        </label>
      )}
    </div>
  );
}
```

## 🎯 TipTap 에디터 통합

테마 시스템은 TipTap 에디터와 완벽하게 통합됩니다:

```tsx
import { useEditor } from '@tiptap/react';
import { useTheme } from '@/renderer/themes';

function MarkdownEditor() {
  const { theme, isDarkMode } = useTheme();
  
  const editor = useEditor({
    // 에디터 설정...
    editorProps: {
      attributes: {
        'data-theme': theme, // 테마 속성 자동 적용
        class: `prose prose-lg ${isDarkMode ? 'prose-invert' : ''}`
      }
    }
  });
  
  return (
    <div className="tiptap-editor">
      <EditorContent editor={editor} />
    </div>
  );
}
```

## 📱 사용자 경험 가이드

### 테마 전환 애니메이션
- 부드러운 300ms 전환 효과
- `prefers-reduced-motion` 자동 감지
- 커스텀 이징 함수 지원

### 지속성
- 로컬 스토리지에 자동 저장
- 브라우저 재시작 후에도 테마 유지
- 사용자 선호도 동기화

### 시스템 통합
- OS 다크 모드 자동 감지
- 고대비 모드 지원
- 색상 체계 시스템 설정

## 🐛 문제 해결

### 테마가 적용되지 않는 경우
1. `AppThemeWrapper`가 최상위에 있는지 확인
2. CSS 파일이 올바르게 로드되는지 확인
3. 브라우저 개발자 도구에서 CSS 변수 확인

### 에디터 테마가 동기화되지 않는 경우
1. `markdownEditor/styles/variables.css`에서 선택자 확인
2. `[data-theme="dark"]`와 `.dark` 모두 지원하는지 확인

### 성능 최적화
- 테마 CSS 파일은 필요할 때만 로드
- 사용하지 않는 테마는 자동 언로드
- CSS 변수를 활용한 실시간 변경

## 🔄 업데이트 및 마이그레이션

### v1.0.0에서 추가된 기능
- 다중 테마 지원
- 작가 전용 테마들
- 접근성 옵션
- TipTap 에디터 통합
- TypeScript 완전 지원

### 향후 업데이트 계획
- 더 많은 프리셋 테마
- 시각적 테마 에디터
- 테마 공유 기능
- AI 기반 테마 추천

---

💡 **팁**: 개발 모드에서는 화면 우하단의 테마 개발 도구를 활용하여 실시간으로 테마 상태를 확인할 수 있습니다.