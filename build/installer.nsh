!include MUI2.nsh

# Discord 스타일 커스터마이징
# ================================

# 진행률 바 색상 (파란색)
!define MUI_INSTFILESPAGE_PROGRESSBAR "colored"

# 설치 페이지 헤더 텍스트
!define MUI_INSTFILESPAGE_HEADER_TEXT "Loop 설치 중..."
!define MUI_INSTFILESPAGE_HEADER_SUBTEXT "잠시만 기다려주세요"

# 완료 페이지 텍스트
!define MUI_FINISHPAGE_TITLE "Loop 설치 완료!"
!define MUI_FINISHPAGE_TEXT "Loop이 성공적으로 설치되었습니다."

# 설치 완료 후 앱 자동 실행
!macro customFinish
  Exec "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
!macroend
