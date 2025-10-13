# Changelog

All notable changes to Loop will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.1] - 2025-10-13

### Added
- 추가: Discord 스타일 커스텀 설치 GUI (NSIS MUI2)
- 추가: installer-sidebar.bmp (164x314) 브랜드 이미지
- 추가: build/installer.nsh 커스텀 NSIS 스크립트

### Changed
- 변경: NSIS oneClick: false (전체 설치 마법사 표시)
- 변경: allowToChangeInstallationDirectory: true (사용자가 설치 경로 선택 가능)
- 개선: UpdaterManager 다운로드 진행률 로깅 강화 (MB 단위, 속도 표시)
- 개선: WindowManager 통합으로 아키텍처 개선
- 개선: 업데이트 가용 시 Main window에 알림 전송 (향후 UI 활용 가능)

### Technical
- electron-builder.json: oneClick: false, installerSidebar 추가, include: "build/installer.nsh"
- build/installer.nsh: MUI2 커스터마이징, 진행률 바 색상, 설치 완료 후 자동 실행
- build/generate-installer-images.sh: ImageMagick으로 자동 이미지 생성
- UpdaterManager에 windowManager 참조 추가
- 다운로드 진행률 로그 포맷 개선: `⬇️ 다운로드: 42.5% | 8.32/19.58 MB | 1.23 MB/s`
- update-available 이벤트 시 webContents.send('updater:available') 추가

---

## [1.2.0] - 2025-10-13

### Fixed
- 수정: Windows 빌드 크래시 문제 해결 (Prisma 바이너리 경로 수정)
- 수정: PrismaService에서 app.asar.unpacked 경로로 Prisma 클라이언트 로드

### Changed
- 개선: NSIS 설치 프로그램 oneClick: true (원클릭 설치)
- 개선: after-pack.js에 Prisma 파일 보호 로직 추가
- 개선: GitHub Actions에 Prisma 검증 및 Windows 빌드 아티팩트 검증 추가

### Technical
- electron-builder.json: asarUnpack에 `**/*.node`, Prisma 바이너리 포함
- after-pack.js: Prisma 파일 보호 패턴 추가, 검증 로직 강화
- release.yml: Prisma generate 검증, .exe 크기 확인 스텝 추가

---

## [1.1.9] - 이전 버전

(이전 릴리스 노트는 추후 추가)
