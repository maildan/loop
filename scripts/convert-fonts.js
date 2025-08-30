// 🔥 기가차드 폰트 변환기 - TTF to OTF Ultimate Converter
const fs = require('fs');
const path = require('path');

// 폴더 경로 설정 (스크립트 실행 위치에 따라 조정 필요)
const fontsDir = path.join(process.cwd(), 'public', 'fonts');

// 디렉토리 존재 여부 확인
if (!fs.existsSync(fontsDir)) {
    console.error(`Error: Directory not found - ${fontsDir}`);
    console.log('Please ensure the "public/fonts" directory exists.');
    process.exit(1);
}

// TTF 파일을 재귀적으로 찾는 함수
function findTTFFiles(dir) {
    let ttfFiles = [];

    function searchRecursively(currentDir) {
        const items = fs.readdirSync(currentDir);

        items.forEach(item => {
            const fullPath = path.join(currentDir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                searchRecursively(fullPath);
            } else if (item.endsWith('.ttf')) {
                ttfFiles.push(fullPath);
            }
        });
    }

    searchRecursively(dir);
    return ttfFiles;
}

// TTF 파일 목록 가져오기
const ttfFiles = findTTFFiles(fontsDir);

if (ttfFiles.length === 0) {
    console.log('No TTF files found in public/fonts directory tree');
    process.exit(0);
}

// 🔥 기가차드 TTF to OTF 변환 함수 - 최신 Node.js Buffer API 사용
function convertTTFToOTF(ttfPath, otfPath) {
    try {
        console.log(`🔄 Converting: ${path.basename(ttfPath)}...`);

        // TTF 파일 읽기
        const ttfBuffer = fs.readFileSync(ttfPath);

        // TTF 헤더 확인 (0x74727565 또는 0x4F54544F)
        const header = ttfBuffer.readUInt32BE(0);

        if (header !== 0x74727565 && header !== 0x00010000) {
            throw new Error('Invalid TTF file format');
        }

        // OTF 변환: TTF 헤더를 OTF 호환 헤더로 변경
        const otfBuffer = Buffer.from(ttfBuffer);

        // TTF signature를 OTF signature로 변경
        // 'true' (0x74727565) -> 'OTTO' (0x4F54544F)
        if (header === 0x74727565) {
            otfBuffer.writeUInt32BE(0x4F54544F, 0);
        }

        // OTF 파일 저장
        fs.writeFileSync(otfPath, otfBuffer);

        return true;
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        return false;
    }
}

console.log(`Found ${ttfFiles.length} TTF files to convert...`);

// 🔥 변환 통계
let successCount = 0;
let errorCount = 0;

// 각 TTF 파일을 OTF로 변환
ttfFiles.forEach((ttfPath) => {
    const otfPath = ttfPath.replace('.ttf', '.otf');
    const relativePath = path.relative(fontsDir, ttfPath);

    if (convertTTFToOTF(ttfPath, otfPath)) {
        console.log(`✅ Converted: ${relativePath} → ${path.relative(fontsDir, otfPath)}`);
        successCount++;
    } else {
        console.error(`❌ Failed: ${relativePath}`);
        errorCount++;
    }
});

console.log(`\n🔥 GIGA-CHAD 변환 완료!`);
console.log(`✅ 성공: ${successCount}개`);
console.log(`❌ 실패: ${errorCount}개`);