#!/bin/bash

# 🔥 macOS Release 업로드 스크립트
# 사용법: ./scripts/upload-macos-release.sh <tag> [draft]
# 예: ./scripts/upload-macos-release.sh v1.5.7
# 예: ./scripts/upload-macos-release.sh v1.5.7 draft

set -e

TAG="${1:-}"
DRAFT="${2:-}"

if [ -z "$TAG" ]; then
  echo "❌ Error: Tag is required"
  echo "Usage: ./scripts/upload-macos-release.sh <tag> [draft]"
  echo "Example: ./scripts/upload-macos-release.sh v1.5.7"
  exit 1
fi

# 현재 디렉토리 확인
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Run this script from the project root."
  exit 1
fi

# release 폴더 확인
if [ ! -d "release" ]; then
  echo "❌ Error: release directory not found. Run 'pnpm dist:mac' first."
  exit 1
fi

# 필요한 파일 확인
echo "🔍 Checking macOS build artifacts..."
if [ ! -f "release"/*.dmg ]; then
  echo "❌ Error: No .dmg file found in release directory"
  exit 1
fi

if [ ! -f "release/latest-mac.yml" ]; then
  echo "⚠️ Warning: latest-mac.yml not found"
fi

# 파일 목록 출력
echo ""
echo "📦 Files to upload:"
ls -lh release/*.dmg 2>/dev/null || echo "  ❌ No .dmg files"
ls -lh release/*.zip 2>/dev/null || echo "  ℹ️  No .zip files"
ls -lh release/*.blockmap 2>/dev/null || echo "  ℹ️  No .blockmap files"
ls -lh release/latest-mac.yml 2>/dev/null || echo "  ℹ️  No latest-mac.yml"

echo ""
echo "🚀 Uploading to GitHub Release: $TAG"
echo ""

# Draft 옵션 처리
DRAFT_FLAG=""
if [ "$DRAFT" = "draft" ]; then
  DRAFT_FLAG="--draft"
  echo "📝 Creating as DRAFT release"
fi

# GitHub CLI를 사용하여 release 생성 및 파일 업로드
if command -v gh &> /dev/null; then
  echo "✅ GitHub CLI found"
  
  # Release 존재 여부 확인
  if gh release view "$TAG" &> /dev/null; then
    echo "📝 Release $TAG already exists. Uploading artifacts..."
    
    # 파일 업로드
    for file in release/*.dmg release/*.zip release/*.blockmap release/latest-mac.yml; do
      if [ -f "$file" ]; then
        echo "  📤 Uploading $(basename "$file")..."
        gh release upload "$TAG" "$file" --clobber
      fi
    done
  else
    echo "🆕 Creating new release $TAG..."
    
    # 새 release 생성 (artifacts 포함)
    FILES_TO_UPLOAD=""
    for file in release/*.dmg release/*.zip release/*.blockmap release/latest-mac.yml; do
      if [ -f "$file" ]; then
        FILES_TO_UPLOAD="$FILES_TO_UPLOAD $file"
      fi
    done
    
    gh release create "$TAG" $FILES_TO_UPLOAD $DRAFT_FLAG \
      --title "Loop $TAG" \
      --generate-notes
  fi
  
  echo ""
  echo "✅ Upload complete!"
  echo ""
  echo "📍 Release URL: https://github.com/maildan/loop/releases/tag/$TAG"
  
else
  echo "❌ Error: GitHub CLI (gh) is not installed"
  echo ""
  echo "📖 To install GitHub CLI, visit: https://cli.github.com"
  echo ""
  echo "Or use manual upload with curl:"
  echo "  GITHUB_TOKEN=your_token ./scripts/upload-macos-release-curl.sh $TAG"
  exit 1
fi
