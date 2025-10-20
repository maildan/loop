#!/usr/bin/env node

/**
 * 🔥 macOS 빌드 후 자동화 스크립트
 * 
 * 1. release/ 폴더의 macOS artifacts를 GitHub Release에 업로드
 * 2. GitHub Actions workflow_dispatch를 트리거하여 Windows 빌드 실행
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 컬러 출력
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// package.json에서 버전 읽기
function getVersion() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
  return `v${packageJson.version}`;
}

// GitHub token 확인
function checkGitHubToken() {
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token) {
    log(colors.red, '❌ GITHUB_TOKEN or GH_TOKEN environment variable is not set');
    log(colors.yellow, '설정: export GITHUB_TOKEN=your_token');
    process.exit(1);
  }
  return token;
}

// release/ 폴더의 macOS artifacts 찾기
function findMacOSArtifacts() {
  const releaseDir = path.join(__dirname, '../release');
  
  if (!fs.existsSync(releaseDir)) {
    log(colors.red, '❌ release/ directory not found');
    log(colors.yellow, '먼저 다음을 실행하세요: pnpm dist:mac');
    process.exit(1);
  }

  const artifacts = [];
  const files = fs.readdirSync(releaseDir);
  
  for (const file of files) {
    if (file.endsWith('.dmg') || 
        file.endsWith('.zip') || 
        file.endsWith('.blockmap') || 
        file === 'latest-mac.yml') {
      artifacts.push(path.join(releaseDir, file));
    }
  }

  if (artifacts.length === 0) {
    log(colors.red, '❌ No macOS artifacts found in release/');
    process.exit(1);
  }

  return artifacts;
}

// GitHub Release에 파일 업로드
async function uploadToRelease(token, tag, artifacts) {
  const owner = 'maildan';
  const repo = 'loop';

  log(colors.cyan, `\n📤 Uploading ${artifacts.length} artifacts to GitHub Release: ${tag}`);

  // GitHub Release가 존재하는지 확인
  try {
    execSync(
      `curl -s -H "Authorization: token ${token}" https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
      { stdio: 'pipe' }
    );
  } catch (error) {
    log(colors.yellow, `⚠️ Release ${tag} not found, creating...`);
    
    // Release 생성
    try {
      execSync(
        `curl -s -X POST -H "Authorization: token ${token}" ` +
        `-H "Content-Type: application/json" ` +
        `https://api.github.com/repos/${owner}/${repo}/releases ` +
        `-d '{"tag_name":"${tag}","name":"${tag}","draft":false,"prerelease":false}'`,
        { stdio: 'inherit' }
      );
      log(colors.green, `✅ Release ${tag} created`);
    } catch (error) {
      log(colors.red, `❌ Failed to create release: ${error.message}`);
      process.exit(1);
    }
  }

  // Get release ID
  let releaseId;
  try {
    const releaseInfo = execSync(
      `curl -s -H "Authorization: token ${token}" https://api.github.com/repos/${owner}/${repo}/releases/tags/${tag}`,
      { encoding: 'utf8' }
    );
    const release = JSON.parse(releaseInfo);
    releaseId = release.id;
    log(colors.green, `✅ Found release ID: ${releaseId}`);
  } catch (error) {
    log(colors.red, `❌ Failed to get release ID: ${error.message}`);
    process.exit(1);
  }

  // 각 artifact 업로드
  let successCount = 0;
  let failCount = 0;

  for (const artifactPath of artifacts) {
    const filename = path.basename(artifactPath);
    const fileSize = fs.statSync(artifactPath).size;
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

    process.stdout.write(`  🔄 ${filename} (${fileSizeMB} MB)... `);

    try {
      execSync(
        `curl -s -X POST -H "Authorization: token ${token}" ` +
        `-H "Content-Type: application/octet-stream" ` +
        `--data-binary "@${artifactPath}" ` +
        `"https://uploads.github.com/repos/${owner}/${repo}/releases/${releaseId}/assets?name=${filename}"`,
        { stdio: 'pipe' }
      );
      log(colors.green, '✅');
      successCount++;
    } catch (error) {
      log(colors.red, `❌ ${error.message}`);
      failCount++;
    }
  }

  log(colors.green, `\n✅ Upload complete: ${successCount} success, ${failCount} failed`);
  return { successCount, failCount };
}

// GitHub Actions workflow_dispatch 트리거
function triggerWindowsCI(token, tag) {
  const owner = 'maildan';
  const repo = 'loop';

  log(colors.cyan, `\n🚀 Triggering Windows CI build for ${tag}...`);

  try {
    execSync(
      `curl -s -X POST -H "Authorization: token ${token}" ` +
      `-H "Accept: application/vnd.github.v3+json" ` +
      `https://api.github.com/repos/${owner}/${repo}/actions/workflows/release.yml/dispatches ` +
      `-d '{"ref":"main","inputs":{"tag":"${tag}"}}'`,
      { stdio: 'inherit' }
    );
    log(colors.green, '✅ Windows CI build triggered');
    log(colors.cyan, `Monitor: https://github.com/${owner}/${repo}/actions`);
  } catch (error) {
    log(colors.red, `❌ Failed to trigger Windows CI: ${error.message}`);
    process.exit(1);
  }
}

// Main
async function main() {
  log(colors.cyan, '\n🔥 macOS Build Post-Processing\n');

  const token = checkGitHubToken();
  const tag = getVersion();
  
  log(colors.green, `Version: ${tag}`);

  // 1. macOS artifacts 찾기
  const artifacts = findMacOSArtifacts();
  log(colors.green, `✅ Found ${artifacts.length} macOS artifacts`);
  artifacts.forEach(art => log(colors.yellow, `  - ${path.basename(art)}`));

  // 2. GitHub Release에 업로드
  const uploadResult = await uploadToRelease(token, tag, artifacts);

  if (uploadResult.failCount > 0) {
    log(colors.red, `\n❌ Some uploads failed. Please check manually.`);
    process.exit(1);
  }

  // 3. Windows CI 트리거
  triggerWindowsCI(token, tag);

  log(colors.green, '\n✅ All done! Check GitHub Release:');
  log(colors.cyan, `https://github.com/maildan/loop/releases/tag/${tag}\n`);
}

main().catch(error => {
  log(colors.red, `\n❌ Error: ${error.message}`);
  process.exit(1);
});
