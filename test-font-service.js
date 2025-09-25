// FontService 직접 테스트
const { join, resolve, basename, extname } = require('path');
const { existsSync, readdirSync, statSync } = require('fs');

class TestFontService {
  constructor() {
    this.fontsPath = resolve(process.cwd(), 'public', 'fonts');
    this.allowedExtensions = ['.ttf', '.otf', '.woff', '.woff2'];
    this.maxPathDepth = 3;
    console.log('FontService initialized:', {
      fontsPath: this.fontsPath,
      exists: existsSync(this.fontsPath)
    });
  }

  isPathSafe(filePath) {
    try {
      const absolutePath = resolve(filePath);
      const normalizedFontsPath = resolve(this.fontsPath);
      
      if (!absolutePath.startsWith(normalizedFontsPath)) {
        console.warn('Path outside fonts directory:', filePath);
        return false;
      }
      return true;
    } catch (error) {
      console.warn('Path safety check failed:', error.message);
      return false;
    }
  }

  createFontFile(filePath, stats) {
    try {
      const fileName = basename(filePath);
      const ext = extname(fileName).toLowerCase();
      
      if (!this.allowedExtensions.includes(ext)) {
        return null;
      }

      const relativePath = filePath.replace(this.fontsPath, '');
      const pathParts = relativePath.split('/').filter(Boolean);
      const category = pathParts.length > 1 ? pathParts[0] : 'default';

      return {
        name: fileName,
        path: filePath,
        size: stats.size,
        category: category || 'default',
        isValid: true
      };
    } catch (error) {
      console.warn('Font file creation failed:', error.message);
      return null;
    }
  }

  async scanFontsRecursively(dirPath, fonts, depth) {
    if (depth > this.maxPathDepth) {
      console.warn('Max depth exceeded:', dirPath);
      return;
    }

    try {
      const items = readdirSync(dirPath);
      console.log(`Scanning ${dirPath} (depth ${depth}), found ${items.length} items`);

      for (const item of items) {
        const itemPath = join(dirPath, item);
        
        if (!this.isPathSafe(itemPath)) {
          continue;
        }

        const stats = statSync(itemPath);

        if (stats.isDirectory()) {
          console.log(`  Directory: ${item}`);
          await this.scanFontsRecursively(itemPath, fonts, depth + 1);
        } else if (stats.isFile()) {
          const font = this.createFontFile(itemPath, stats);
          if (font) {
            console.log(`  Font file: ${item} -> ${font.category}`);
            fonts.push(font);
          } else {
            console.log(`  Skipped file: ${item}`);
          }
        }
      }
    } catch (error) {
      console.warn('Directory scan failed:', error.message);
    }
  }

  async getAvailableFonts() {
    try {
      if (!existsSync(this.fontsPath)) {
        console.warn('Fonts directory does not exist');
        return [];
      }

      const fonts = [];
      await this.scanFontsRecursively(this.fontsPath, fonts, 0);

      console.log(`Scan complete: ${fonts.length} total fonts, ${fonts.filter(f => f.isValid).length} valid fonts`);
      return fonts.filter(font => font.isValid);
    } catch (error) {
      console.error('Font scan failed:', error);
      return [];
    }
  }
}

// 테스트 실행
async function testFontService() {
  const service = new TestFontService();
  const fonts = await service.getAvailableFonts();
  
  console.log('\n=== Font Scan Results ===');
  console.log(`Total fonts found: ${fonts.length}`);
  
  const categories = {};
  fonts.forEach(font => {
    if (!categories[font.category]) {
      categories[font.category] = 0;
    }
    categories[font.category]++;
  });
  
  console.log('By category:');
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`  ${cat}: ${count} fonts`);
  });
  
  if (fonts.length > 0) {
    console.log('\nFirst 5 fonts:');
    fonts.slice(0, 5).forEach(font => {
      console.log(`  ${font.name} (${font.category}) - ${font.size} bytes`);
    });
  }
}

testFontService().catch(console.error);