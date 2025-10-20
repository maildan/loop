import { useState, useEffect } from 'react';
import { AlertCircle, Check, Eye, EyeOff, HelpCircle, ExternalLink } from 'lucide-react';
import { Logger } from '../../../../../shared/logger';

const COMPONENT = 'GEMINI_SETTINGS';

interface GeminiStatus {
  available: boolean;
  status: 'set' | 'missing';
  message: string;
}
 
export function GeminiSettingsSection() {
  const [apiKey, setApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [geminiStatus, setGeminiStatus] = useState<GeminiStatus | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // 컴포넌트 로드 시 저장된 키 불러오기
  useEffect(() => {
    const loadGeminiKey = async () => {
      try {
        const result = await window.electronAPI.env.getGeminiKey();
        if (result.data?.key) {
          setApiKey(result.data.key);
        }
        
        // 상태 확인
        const statusResult = await window.electronAPI.env.getGeminiStatus();
        if (statusResult.data) {
          setGeminiStatus(statusResult.data);
        }
      } catch (error) {
        Logger.error(COMPONENT, 'Failed to load Gemini key', error);
      }
    };

    loadGeminiKey();
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      Logger.warn(COMPONENT, 'API key is empty');
      return;
    }

    setIsSaving(true);
    try {
      const result = await window.electronAPI.env.setGeminiKey(apiKey);
      
      Logger.debug(COMPONENT, 'Save response received', { result });
      
      if (result?.data?.success || result?.success) {
        setLastSaved(new Date());
        setSuccessMessage('✅ Gemini API 키가 저장되었습니다!');
        
        // 상태 업데이트
        const statusResult = await window.electronAPI.env.getGeminiStatus();
        if (statusResult.data) {
          setGeminiStatus(statusResult.data);
        }

        // 3초 후 메시지 제거
        setTimeout(() => setSuccessMessage(''), 3000);
        
        Logger.info(COMPONENT, 'Gemini API key saved successfully');
      } else {
        Logger.warn(COMPONENT, 'Save failed - unexpected response', { result });
        setSuccessMessage('❌ API 키 저장 실패');
      }
    } catch (error) {
      Logger.error(COMPONENT, 'Failed to save Gemini key', error);
      setSuccessMessage(`❌ 오류: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenGuide = async () => {
    try {
      const result = await window.electronAPI.shell.openExternal('http://bit.ly/4hkefvJ');
      if (!result.success) {
        Logger.error(COMPONENT, 'Failed to open external link', result.error);
      }
    } catch (error) {
      Logger.error(COMPONENT, 'Failed to open guide', error);
    }
  };

  const maskedKey = apiKey ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : '';

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          🤖 Gemini AI 설정
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Google Gemini API를 사용하여 AI 분석 및 작성 지원 기능을 활성화하세요.
        </p>
      </div>

      {/* 상태 표시 */}
      {geminiStatus && (
        <div
          className={`p-4 rounded-lg border flex items-start gap-3 ${
            geminiStatus.available
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          }`}
        >
          {geminiStatus.available ? (
            <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
          )}
          <div>
            <p
              className={`text-sm font-medium ${
                geminiStatus.available
                  ? 'text-green-800 dark:text-green-300'
                  : 'text-yellow-800 dark:text-yellow-300'
              }`}
            >
              {geminiStatus.available ? '✅ 설정됨' : '⚠️ 미설정'}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {geminiStatus.message}
            </p>
          </div>
        </div>
      )}

      {/* API 키 입력 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          API 키
        </label>
        <div className="relative">
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
          >
            {showKey ? (
              <EyeOff className="w-4 h-4 text-gray-500" />
            ) : (
              <Eye className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* 도움말 */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 space-y-2">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
          📝 API 키 발급 방법
        </p>
        <ol className="text-xs text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
          <li>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:opacity-75"
            >
              Google AI Studio
            </a>
            에 접속하세요.
          </li>
          <li>「Get API key」 버튼을 클릭합니다.</li>
          <li>새 프로젝트를 생성하고 API 키를 복사합니다.</li>
          <li>위 입력 필드에 붙여넣기하고 저장합니다.</li>
        </ol>
      </div>

      {/* 저장 버튼 및 상태 메시지 */}
      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={handleSave}
          disabled={!apiKey.trim() || isSaving}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition"
        >
          {isSaving ? '저장 중...' : '저장'}
        </button>
        
        {successMessage && (
          <span className="text-sm text-green-600 dark:text-green-400">{successMessage}</span>
        )}
        
        {lastSaved && !successMessage && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            마지막 저장: {lastSaved.toLocaleTimeString('ko-KR')}
          </span>
        )}
      </div>

      {apiKey && (
        <div className="text-xs text-gray-500 dark:text-gray-400 p-3 bg-gray-50 dark:bg-slate-800 rounded">
          현재 키: {maskedKey}
        </div>
      )}

      {/* 🆘 QnA 섹션 */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-6 mt-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 className="font-semibold text-gray-900 dark:text-white">
              자주 묻는 질문 (FAQ)
            </h4>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Gemini API 키 설정 및 사용에 관한 궁금한 점이 있으신가요?
          </p>

          <button
            onClick={handleOpenGuide}
            className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:shadow-md transition group"
          >
            <span className="flex items-center gap-2">
              <span className="text-base">📚</span>
              <span className="font-medium text-gray-900 dark:text-white">
                Gemini API 설정 가이드 보기
              </span>
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" />
          </button>
        </div>
      </div>
    </div>
  );
}
