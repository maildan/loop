// 🔥 기가차드 다이얼로그 관리자 - 사용자 인터페이스 전담!

import { dialog, BrowserWindow, MessageBoxOptions, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { Logger } from '../shared/logger';
import { createSuccess, createError, Result } from '../shared/common';

// #DEBUG: Dialog manager entry point
Logger.debug('DIALOG_MANAGER', 'Dialog manager module loaded');

// 🔥 기가차드 다이얼로그 결과 타입
export interface DialogResult<T = unknown> {
  canceled: boolean;
  filePaths?: string[];
  filePath?: string;
  response?: number;
  checkboxChecked?: boolean;
  data?: T;
}

// 🔥 기가차드 다이얼로그 관리자 클래스
export class DialogManager {
  private static instance: DialogManager | null = null;
  private parentWindow: BrowserWindow | null = null;

  private constructor() {
    Logger.info('DIALOG_MANAGER', 'Dialog manager instance created');
  }

  // 🔥 싱글톤 인스턴스
  public static getInstance(): DialogManager {
    if (!DialogManager.instance) {
      DialogManager.instance = new DialogManager();
    }
    return DialogManager.instance;
  }

  // 🔥 부모 윈도우 설정
  public setParentWindow(window: BrowserWindow): void {
    this.parentWindow = window;
    Logger.debug('DIALOG_MANAGER', 'Parent window set');
  }

  // 🔥 에러 다이얼로그 표시
  public async showError(
    title: string,
    message: string,
    detail?: string
  ): Promise<Result<DialogResult>> {
    try {
      // #DEBUG: Showing error dialog
      Logger.debug('DIALOG_MANAGER', 'Showing error dialog', { title, message });

      const options: MessageBoxOptions = {
        type: 'error',
        title,
        message,
        detail,
        buttons: ['확인'],
        defaultId: 0,
      };

      const result = this.parentWindow
        ? await dialog.showMessageBox(this.parentWindow, options)
        : await dialog.showMessageBox(options);

      return createSuccess({
        canceled: false,
        response: result.response,
        checkboxChecked: result.checkboxChecked,
      });

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show error dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }

  // 🔥 경고 다이얼로그 표시
  public async showWarning(
    title: string,
    message: string,
    detail?: string
  ): Promise<Result<DialogResult>> {
    try {
      // #DEBUG: Showing warning dialog
      Logger.debug('DIALOG_MANAGER', 'Showing warning dialog', { title, message });

      const options: MessageBoxOptions = {
        type: 'warning',
        title,
        message,
        detail,
        buttons: ['확인', '취소'],
        defaultId: 0,
        cancelId: 1,
      };

      const result = this.parentWindow
        ? await dialog.showMessageBox(this.parentWindow, options)
        : await dialog.showMessageBox(options);

      return createSuccess({
        canceled: result.response === 1,
        response: result.response,
        checkboxChecked: result.checkboxChecked,
      });

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show warning dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }

  // 🔥 확인 다이얼로그 표시
  public async showConfirmation(
    title: string,
    message: string,
    detail?: string
  ): Promise<Result<boolean>> {
    try {
      // #DEBUG: Showing confirmation dialog
      Logger.debug('DIALOG_MANAGER', 'Showing confirmation dialog', { title, message });

      const options: MessageBoxOptions = {
        type: 'question',
        title,
        message,
        detail,
        buttons: ['예', '아니오'],
        defaultId: 0,
        cancelId: 1,
      };

      const result = this.parentWindow
        ? await dialog.showMessageBox(this.parentWindow, options)
        : await dialog.showMessageBox(options);

      return createSuccess(result.response === 0);

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show confirmation dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }

  // 🔥 파일 열기 다이얼로그
  public async showOpenDialog(
    title: string,
    filters?: { name: string; extensions: string[] }[],
    multiSelections = false
  ): Promise<Result<string[]>> {
    try {
      // #DEBUG: Showing open dialog
      Logger.debug('DIALOG_MANAGER', 'Showing open dialog', { title, multiSelections });

      const properties: Array<'openFile' | 'multiSelections'> = ['openFile'];
      if (multiSelections) {
        properties.push('multiSelections');
      }

      const options: OpenDialogOptions = {
        title,
        properties,
        filters: filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
      };

      const result = this.parentWindow
        ? await dialog.showOpenDialog(this.parentWindow, options)
        : await dialog.showOpenDialog(options);

      if (result.canceled) {
        return createSuccess([]);
      }

      return createSuccess(result.filePaths);

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show open dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }

  // 🔥 파일 저장 다이얼로그
  public async showSaveDialog(
    title: string,
    defaultPath?: string,
    filters?: { name: string; extensions: string[] }[]
  ): Promise<Result<string | null>> {
    try {
      // #DEBUG: Showing save dialog
      Logger.debug('DIALOG_MANAGER', 'Showing save dialog', { title, defaultPath });

      const options: SaveDialogOptions = {
        title,
        defaultPath,
        filters: filters || [
          { name: 'All Files', extensions: ['*'] }
        ],
      };

      const result = this.parentWindow
        ? await dialog.showSaveDialog(this.parentWindow, options)
        : await dialog.showSaveDialog(options);

      if (result.canceled) {
        return createSuccess(null);
      }

      return createSuccess(result.filePath || null);

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show save dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }

  // 🔥 정보 다이얼로그 표시
  public async showInfo(
    title: string,
    message: string,
    detail?: string
  ): Promise<Result<DialogResult>> {
    try {
      // #DEBUG: Showing info dialog
      Logger.debug('DIALOG_MANAGER', 'Showing info dialog', { title, message });

      const options: MessageBoxOptions = {
        type: 'info',
        title,
        message,
        detail,
        buttons: ['확인'],
        defaultId: 0,
      };

      const result = this.parentWindow
        ? await dialog.showMessageBox(this.parentWindow, options)
        : await dialog.showMessageBox(options);

      return createSuccess({
        canceled: false,
        response: result.response,
        checkboxChecked: result.checkboxChecked,
      });

    } catch (error) {
      Logger.error('DIALOG_MANAGER', 'Failed to show info dialog', error);
      return createError(error instanceof Error ? error.message : 'Dialog error');
    }
  }
}

// 🔥 기가차드 전역 다이얼로그 관리자
export const dialogManager = DialogManager.getInstance();

// #DEBUG: Dialog manager exit point
Logger.debug('DIALOG_MANAGER', 'Dialog manager module setup complete');

export default dialogManager;
