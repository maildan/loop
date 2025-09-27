module.exports = {
    plugins: {
        // 🔥 @import 구문 처리 - CSS 모듈화를 위해 필수
        'postcss-import': {},
        
        // 🔥 TailwindCSS v3 처리 - Vite 환경에서 필수
        tailwindcss: {},
        
        // 🔥 브라우저 호환성을 위한 Autoprefixer
        autoprefixer: {},
    },
};