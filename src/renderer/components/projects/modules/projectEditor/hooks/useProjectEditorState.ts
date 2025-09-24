// 🔥 useProjectEditorState Hook - ProjectEditor 상태 관리를 위한 커스텀 훅
// 복잡한 상태 로직을 훅으로 추상화

import { useState, useMemo } from 'react';
import {
    ProjectEditorState,
    ProjectEditorStateActions,
    projectEditorStateService
} from '../services/ProjectEditorStateService';

export interface UseProjectEditorStateReturn {
    state: ProjectEditorState;
    actions: ProjectEditorStateActions;
}

export function useProjectEditorState(): UseProjectEditorStateReturn {
    // 🔥 단일 상태 객체로 모든 상태 관리
    const [state, setState] = useState<ProjectEditorState>(() =>
        projectEditorStateService.createInitialState()
    );

    // 🔥 상태 액션들 생성 - 의존성 없음으로 무한 렌더링 완전 방지
    const actions = useMemo(() =>
        projectEditorStateService.createStateActions(state, setState),
        [] // 의존성 없음 - 한 번만 생성하여 무한 렌더링 방지
    );

    return {
        state,
        actions,
    };
}

export default useProjectEditorState;
