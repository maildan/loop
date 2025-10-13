#!/bin/bash
# build/generate-installer-images.sh
# Discord 스타일 설치 프로그램 이미지 생성

set -e

echo "🎨 Loop 설치 프로그램 이미지 생성 중..."

# build/ 디렉토리 확인
mkdir -p build

# ImageMagick 설치 확인
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick이 필요합니다"
    echo "설치 방법: brew install imagemagick"
    exit 1
fi

echo "✅ ImageMagick 확인 완료"

# installer-sidebar.bmp 생성 (164x314, Discord dark gray 배경)
echo "📐 installer-sidebar.bmp 생성 중..."
convert public/assets/icon.png \
  -resize 600x600 \
  -background "#2C2F33" \
  -gravity center \
  -extent 164x314 \
  -depth 24 \
  BMP3:build/installer-sidebar.bmp

echo "✅ installer-sidebar.bmp 생성 완료 (164x314)"

# 생성된 파일 확인
if [ -f "build/installer-sidebar.bmp" ]; then
    echo "✅ 모든 이미지 생성 완료!"
    ls -lh build/installer-sidebar.bmp
else
    echo "❌ 이미지 생성 실패"
    exit 1
fi
