/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🔥 Electron에서는 정적 export 필수 (SSR 비활성화)
  // 이유: Electron은 데스크톱 앱으로 SEO 불필요, 서버 없는 환경
  output: 'export',
  
  // 🔥 성능 최적화 - 이미지 설정
  images: {
    unoptimized: true, // Electron에서는 최적화 비활성화
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200],
  },
  
  // 🔥 성능 최적화 - 번들 분할 및 트리쉐이킹
  experimental: {
    optimizePackageImports: [
      'react', 
      'react-dom', 
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'clsx',
      'tailwind-merge'
    ],
    webpackBuildWorker: true,
  },
  
  // 🔥 개발 안정성
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 🔥 Webpack 최적화
  webpack: (config, { isServer, dev }) => {
    // Node.js 폴리필 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        querystring: false,
      };
      
      // Global 폴리필
      config.plugins.push(
        new (require('webpack')).DefinePlugin({
          'global': 'globalThis',
        })
      );

      // 🔥 성능 최적화: 고급 번들 분할
      if (!dev) {
        config.optimization.splitChunks = {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          cacheGroups: {
            // React 관련 라이브러리 분리
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 20,
            },
            // UI 라이브러리 분리 (Radix, Lucide 등)
            ui: {
              test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|clsx|tailwind-merge)[\\/]/,
              name: 'ui',
              chunks: 'all',
              priority: 15,
            },
            // 벤더 라이브러리 분리
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              priority: 10,
            },
          },
        };

        // 🔥 최적화: 트리쉐이킹 강화
        config.optimization.usedExports = true;
        config.optimization.sideEffects = false;
      }
    }
    
    return config;
  },
  
  // 🔥 성능 최적화 - 컴파일러 옵션
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    removeTestFiles: {
      include: [/\.test\.(js|jsx|ts|tsx)$/, /\.spec\.(js|jsx|ts|tsx)$/],
    },
  },

  // 🔥 압축 최적화
  compress: true,
  swcMinify: true,
  
  // 🔥 번들 크기 최적화 - 트리 쉐이킹 강화
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{kebabCase member}}',
      skipDefaultConversion: true,
    },
    '@radix-ui/react-icons': {
      transform: '@radix-ui/react-icons/dist/{{member}}.js',
    },
    'date-fns': {
      transform: 'date-fns/{{member}}',
    },
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
};

module.exports = nextConfig;
