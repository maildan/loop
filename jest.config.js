// 🔥 기가차드 Jest 설정 - 완벽한 테스트 환경

/** @type {import('jest').Config} */
module.exports = {
  // 기본 설정
  // Removed ts-jest preset; using babel-jest for JS/TSX transformation
  testEnvironment: 'jsdom',
  
  // 테스트 파일 패턴
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.(ts|tsx|js)',
    '<rootDir>/src/**/*.(test|spec).(ts|tsx|js)',
    '<rootDir>/test/**/*.(test|spec).(ts|tsx|js)'
  ],
  
  // 타입스크립트 설정 (최신 방식)
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  coverageProvider: 'v8',
  
  // 모듈 이름 매핑
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@main/(.*)$': '<rootDir>/src/main/$1',
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@preload/(.*)$': '<rootDir>/src/preload/$1'
  },
  
  // 커버리지 설정
  collectCoverage: true,
  collectCoverageFrom: [
    'src/main/**/*.{ts,tsx}',
    'src/renderer/**/*.{ts,tsx}',
    'src/shared/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/main/index.ts',
    '!src/preload/preload.ts',
    '!src/renderer/app/**/*', // FE 빌드 산출물 제외
    '!src/renderer/.next/**/*',
    '!src/renderer/out/**/*',
    '!dist/**/*',
    '!coverage/**/*'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  // coverageThreshold: {
  //   global: {
  //     branches: 70,
  //     functions: 70,
  //     lines: 70,
  //     statements: 70
  //   }
  // },
  
  // 설정 파일
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  
  // 무시할 패턴
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
    '<rootDir>/.next/',
    '<rootDir>/coverage/',
    '<rootDir>/out/',
    '<rootDir>/src/renderer/app/',
    '<rootDir>/src/renderer/.next/',
    '<rootDir>/src/renderer/out/'
  ],
  
  // 모듈 파일 확장자
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  // 병렬 실행 설정
  maxWorkers: '50%',
  
  // 타임아웃 설정
  testTimeout: 10000,
  
  // Mock 설정
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  
  // Electron 관련 설정
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};
