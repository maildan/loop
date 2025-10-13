#!/usr/bin/env node
/**
 * 폰트 준비 스크립트
 * 
 * node_modules에서 필요한 폰트만 추출하여 public/assets/fonts에 복사
 * - 각 폰트 패밀리당 Regular(400), Bold(700) 웨이트만 선택
 * - 460MB → ~30MB로 압축
 */

const fs = require('fs');
const path = require('path');

const FONT_DEFINITIONS = [
    {
        family: 'pretendard',
        source: 'node_modules/.pnpm/pretendard@1.3.9/node_modules/pretendard/dist/web/static/woff2',
        files: [
            { weight: '400', file: 'Pretendard-Regular.woff2' },
            { weight: '700', file: 'Pretendard-Bold.woff2' }
        ]
    },
    {
        family: 'pretendard-jp',
        source: 'node_modules/.pnpm/pretendard-jp@1.3.9/node_modules/pretendard-jp/dist/web/static/woff2',
        files: [
            { weight: '400', file: 'PretendardJP-Regular.woff2' },
            { weight: '700', file: 'PretendardJP-Bold.woff2' }
        ]
    },
    {
        family: 'noto-sans-kr',
        source: 'node_modules/.pnpm/@fontsource+noto-sans-kr@5.2.8/node_modules/@fontsource/noto-sans-kr/files',
        files: [
            { weight: '400', file: 'noto-sans-kr-korean-400-normal.woff2' },
            { weight: '700', file: 'noto-sans-kr-korean-700-normal.woff2' }
        ]
    },
    {
        family: 'noto-sans-jp',
        source: 'node_modules/.pnpm/@fontsource+noto-sans-jp@5.2.8/node_modules/@fontsource/noto-sans-jp/files',
        files: [
            { weight: '400', file: 'noto-sans-jp-japanese-400-normal.woff2' },
            { weight: '700', file: 'noto-sans-jp-japanese-700-normal.woff2' }
        ]
    },
    {
        family: 'nanum-gothic',
        source: 'node_modules/.pnpm/@fontsource+nanum-gothic@5.2.7/node_modules/@fontsource/nanum-gothic/files',
        files: [
            { weight: '400', file: 'nanum-gothic-korean-400-normal.woff2' },
            { weight: '700', file: 'nanum-gothic-korean-700-normal.woff2' }
        ]
    },
    {
        family: 'gangwon-edu-bold',
        source: 'node_modules/.pnpm/@noonnu+gangwon-edu-otf-bold-a@0.1.0/node_modules/@noonnu/gangwon-edu-otf-bold-a/fonts',
        files: [
            { weight: '700', file: 'gangwoneduotfbolda-normal.woff' }
        ]
    },
    {
        family: 'gangwon-edu-saeeum',
        source: 'node_modules/.pnpm/@noonnu+gangwon-edu-saeeum-otf-medium-a@0.1.0/node_modules/@noonnu/gangwon-edu-saeeum-otf-medium-a/fonts',
        files: [
            { weight: '500', file: 'gangwonedusaeeumotfmediuma-normal.woff' }
        ]
    }
];

const OUTPUT_DIR = 'public/assets/fonts';

async function main() {
    console.log('🔍 폰트 준비 스크립트 시작...');
    
    // 출력 디렉토리 생성
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
        console.log(`✅ 출력 디렉토리 생성: ${OUTPUT_DIR}`);
    }

    let totalCopied = 0;
    let totalSize = 0;

    for (const fontDef of FONT_DEFINITIONS) {
        const familyDir = path.join(OUTPUT_DIR, fontDef.family);
        
        // 패밀리 디렉토리 생성
        if (!fs.existsSync(familyDir)) {
            fs.mkdirSync(familyDir, { recursive: true });
        }

        for (const fileDef of fontDef.files) {
            const sourcePath = path.join(fontDef.source, fileDef.file);
            const destPath = path.join(familyDir, fileDef.file);

            if (!fs.existsSync(sourcePath)) {
                console.warn(`⚠️  소스 파일 없음: ${sourcePath}`);
                continue;
            }

            fs.copyFileSync(sourcePath, destPath);
            const stats = fs.statSync(destPath);
            totalSize += stats.size;
            totalCopied++;

            console.log(`  ✓ ${fontDef.family}/${fileDef.file} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
        }
    }

    console.log(`\n✅ 폰트 복사 완료!`);
    console.log(`   - 파일 수: ${totalCopied}개`);
    console.log(`   - 총 크기: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   - 출력: ${OUTPUT_DIR}`);
}

main().catch(error => {
    console.error('❌ 폰트 준비 실패:', error);
    process.exit(1);
});
