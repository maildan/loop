// 🔥 useProjectEditorState Hook - ProjectEditor 상태 관리를 위한 커스텀 훅
// 복잡한 상태 로직을 훅으로 추상화

import { useState } from 'react';
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

    // 🔥 상태 액션들 생성
    const actions = projectEditorStateService.createStateActions(state, setState);

    return {
        state,
        actions,
    };
}

export default useProjectEditorState;
