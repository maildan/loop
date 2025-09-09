// 🔥 Gemini API 연결 테스트 스크립트
import { getGeminiClient } from '../src/shared/ai/geminiClient';
import { Logger } from '../src/shared/logger';

async function testGeminiConnection() {
    console.log('🚀 Gemini API 연결 테스트 시작...\n');

    try {
        // 1. 환경변수 확인
        const apiKey = process.env.GEMINI_API_KEY;
        const model = process.env.GEMINI_MODEL;

        console.log('📋 환경변수 확인:');
        console.log(`   GEMINI_API_KEY: ${apiKey ? '✅ 설정됨 (' + apiKey.slice(0, 10) + '...)' : '❌ 미설정'}`);
        console.log(`   GEMINI_MODEL: ${model || 'gemini-1.5-flash (기본값)'}`);
        console.log('');

        if (!apiKey) {
            throw new Error('GEMINI_API_KEY가 설정되지 않았습니다.');
        }

        // 2. 클라이언트 초기화 테스트
        console.log('🔌 Gemini 클라이언트 초기화...');
        const client = getGeminiClient();
        console.log('✅ 클라이언트 초기화 성공\n');

        // 3. 상태 확인 테스트
        console.log('🔍 서비스 상태 확인...');
        const status = await client.checkStatus();
        console.log('📊 상태 결과:', status);
        console.log('');

        // 4. 간단한 텍스트 생성 테스트
        console.log('📝 간단한 텍스트 생성 테스트...');
        const testResponse = await client.generateText({
            prompt: "안녕하세요! 이 메시지가 보인다면 Gemini API가 정상 작동하는 것입니다. 간단한 인사말을 해주세요.",
            maxTokens: 100,
            temperature: 0.5
        });

        console.log('✅ 텍스트 생성 성공!');
        console.log('📄 응답 내용:', testResponse.content);
        console.log('📊 토큰 사용량:', testResponse.usage);
        console.log('🎯 완료 이유:', testResponse.finishReason);
        console.log('');

        // 5. 스토리 분석 테스트
        console.log('📚 스토리 분석 기능 테스트...');
        const storyAnalysis = await client.analyzeStoryStructure(
            "옛날 어떤 마을에 용감한 기사가 살고 있었습니다. 그는 마을을 괴롭히는 드래곤을 물리치기 위해 모험을 떠났습니다.",
            "basic"
        );

        console.log('✅ 스토리 분석 성공!');
        console.log('📖 분석 결과:', storyAnalysis.content.slice(0, 200) + '...');
        console.log('');

        console.log('🎉 모든 테스트 완료! Gemini API가 정상 작동합니다.');

    } catch (error) {
        console.error('❌ 테스트 실패:', error);
        console.error('');

        if (error.message?.includes('API key')) {
            console.log('💡 해결 방법: .env 파일에서 GEMINI_API_KEY를 확인하세요.');
        } else if (error.message?.includes('quota')) {
            console.log('💡 해결 방법: API 사용량 한도를 확인하세요.');
        } else if (error.message?.includes('safety')) {
            console.log('💡 해결 방법: 입력 내용이 안전 정책에 위반되지 않는지 확인하세요.');
        }

        process.exit(1);
    }
}

// 실행
testGeminiConnection().catch(console.error);
