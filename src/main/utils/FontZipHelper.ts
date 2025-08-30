// 🔥 기가차드 폰트 ZIP 생성 헬퍼 - 테스트용

import AdmZip from 'adm-zip';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../../shared/logger';

// #DEBUG: Font zip helper entry point
Logger.debug('FONT_ZIP_HELPER', 'Font ZIP helper module loaded');

/**
 * 🔥 테스트용 폰트 ZIP 파일 생성
 * 실제 환경에서는 사용자가 직접 폰트 ZIP을 업로드하지만,
 * 데모 목적으로 샘플 ZIP을 생성합니다.
 */
export class FontZipHelper {
    private static instance: FontZipHelper | null = null;

    private constructor() {
        Logger.debug('FONT_ZIP_HELPER', 'FontZipHelper instance created');
    }

    public static getInstance(): FontZipHelper {
        if (!FontZipHelper.instance) {
            FontZipHelper.instance = new FontZipHelper();
        }
        return FontZipHelper.instance;
    }

    /**
     * 🔥 데모용 폰트 ZIP 파일 생성
     * 실제 폰트 파일 대신 더미 데이터로 ZIP을 생성합니다.
     */
    public async createDemoFontZip(outputPath: string): Promise<boolean> {
        try {
            Logger.debug('FONT_ZIP_HELPER', 'Creating demo font ZIP', { outputPath });

            const zip = new AdmZip();

            // 🔥 더미 폰트 파일들 추가 (실제 프로덕션에서는 진짜 폰트 파일)
            const demoFonts = [
                { name: 'Pretendard-Regular.woff2', content: this.createDummyFontData('Pretendard') },
                { name: 'NotoSansKR-Regular.woff2', content: this.createDummyFontData('Noto Sans KR') },
                { name: 'MalgunGothic.ttf', content: this.createDummyFontData('Malgun Gothic') },
                { name: 'SFProDisplay-Regular.otf', content: this.createDummyFontData('SF Pro Display') },
                { name: 'Roboto-Regular.ttf', content: this.createDummyFontData('Roboto') },
                { name: 'NanumGothic-Regular.ttf', content: this.createDummyFontData('Nanum Gothic') },
                { name: 'Inter-Regular.woff2', content: this.createDummyFontData('Inter') },
                { name: 'SourceHanSansKR-Regular.otf', content: this.createDummyFontData('Source Han Sans') }
            ];

            // ZIP에 폰트 파일들 추가
            for (const font of demoFonts) {
                zip.addFile(font.name, font.content);
                Logger.debug('FONT_ZIP_HELPER', 'Added font to ZIP', { fontName: font.name });
            }

            // 폰트 정보 파일 추가 (메타데이터)
            const fontInfo = {
                version: '1.0.0',
                fonts: demoFonts.map(f => ({
                    name: f.name,
                    size: f.content.length,
                    type: this.getFontType(f.name)
                })),
                createdAt: new Date().toISOString(),
                description: 'Loop Typing Analytics Demo Font Pack'
            };

            zip.addFile('font-info.json', Buffer.from(JSON.stringify(fontInfo, null, 2)));

            // ZIP 파일 저장
            zip.writeZip(outputPath);

            Logger.info('FONT_ZIP_HELPER', 'Demo font ZIP created successfully', {
                outputPath,
                fontCount: demoFonts.length,
                fileSize: fs.statSync(outputPath).size
            });

            return true;

        } catch (error) {
            Logger.error('FONT_ZIP_HELPER', 'Failed to create demo font ZIP', {
                outputPath,
                error
            });
            return false;
        }
    }

    /**
     * 🔥 더미 폰트 데이터 생성
     * 실제 환경에서는 진짜 폰트 파일을 사용하지만,
     * 데모에서는 최소한의 더미 데이터를 생성합니다.
     */
    private createDummyFontData(fontName: string): Buffer {
        // 실제로는 폰트 파일의 바이너리 데이터가 들어갑니다
        // 여기서는 테스트용 더미 데이터를 생성합니다
        const dummyData = `
# ${fontName} Font File
# This is a dummy font file for demonstration purposes
# In production, this would be actual font binary data

Font-Family: ${fontName}
Version: 1.0.0
Format: ${this.getFontType(fontName)}
Created: ${new Date().toISOString()}
Demo: true

${Buffer.alloc(1024, 0x42).toString('hex')}
    `.trim();

        return Buffer.from(dummyData, 'utf-8');
    }

    /**
     * 🔥 파일 확장자로 폰트 타입 결정
     */
    private getFontType(fileName: string): string {
        const ext = path.extname(fileName).toLowerCase();
        switch (ext) {
            case '.woff2': return 'woff2';
            case '.woff': return 'woff';
            case '.ttf': return 'truetype';
            case '.otf': return 'opentype';
            default: return 'unknown';
        }
    }

    /**
     * 🔥 ZIP 파일 검증
     */
    public async validateFontZip(zipPath: string): Promise<boolean> {
        try {
            Logger.debug('FONT_ZIP_HELPER', 'Validating font ZIP', { zipPath });

            if (!fs.existsSync(zipPath)) {
                Logger.error('FONT_ZIP_HELPER', 'ZIP file does not exist', { zipPath });
                return false;
            }

            const zip = new AdmZip(zipPath);
            const entries = zip.getEntries();

            if (entries.length === 0) {
                Logger.error('FONT_ZIP_HELPER', 'ZIP file is empty', { zipPath });
                return false;
            }

            // 폰트 파일이 있는지 확인
            const fontEntries = entries.filter(entry =>
                /\.(ttf|otf|woff|woff2)$/i.test(entry.entryName)
            );

            if (fontEntries.length === 0) {
                Logger.error('FONT_ZIP_HELPER', 'No font files found in ZIP', { zipPath });
                return false;
            }

            Logger.info('FONT_ZIP_HELPER', 'Font ZIP validation successful', {
                zipPath,
                totalEntries: entries.length,
                fontEntries: fontEntries.length
            });

            return true;

        } catch (error) {
            Logger.error('FONT_ZIP_HELPER', 'Failed to validate font ZIP', {
                zipPath,
                error
            });
            return false;
        }
    }
}

// 🔥 기가차드 전역 폰트 ZIP 헬퍼
export const fontZipHelper = FontZipHelper.getInstance();

// #DEBUG: Font zip helper exit point
Logger.debug('FONT_ZIP_HELPER', 'Font ZIP helper module setup complete');

export default fontZipHelper;
