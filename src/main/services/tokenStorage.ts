//// 🔥 기가차드 Token Storage Service - OAuth 토큰 암호화 저장

import keytar from 'keytar';
import { Logger } from '../../shared/logger';
import type { OAuthTokens } from '../types/oauth';

/**
 * 🔥 TokenStorageService - keytar 기반 OS 키체인 저장소 사용
 * 기존 API를 유지합니다: saveTokens/getTokens/deleteTokens/refreshTokens
 */
export class TokenStorageService {
  private static instance: TokenStorageService;
  private readonly componentName = 'TOKEN_STORAGE';
  private readonly servicePrefix = 'loop.oauth';

  private constructor() { }

  static getInstance(): TokenStorageService {
    if (!TokenStorageService.instance) {
      TokenStorageService.instance = new TokenStorageService();
    }
    return TokenStorageService.instance;
  }

  private keyName(service: string, account = 'default'): string {
    return `${this.servicePrefix}.${service}.${account}`;
  }

  async saveTokens(service: 'google' | 'hancom', tokens: OAuthTokens, account = 'default'): Promise<boolean> {
    try {
      if (tokens.expires_in && !tokens.expires_at) {
        tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
      }

      const key = this.keyName(service, account);
      await keytar.setPassword(key, account, JSON.stringify(tokens));

      Logger.info(this.componentName, `✅ ${service} 토큰 keytar 저장 완료`);
      return true;
    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 저장 실패`, error);
      return false;
    }
  }

  async getTokens(service: 'google' | 'hancom', account = 'default'): Promise<OAuthTokens | null> {
    try {
      const key = this.keyName(service, account);
      const raw = await keytar.getPassword(key, account);
      if (!raw) {
        Logger.warn(this.componentName, `⚠️ ${service} 토큰이 없습니다`);
        return null;
      }

      const tokens: OAuthTokens = JSON.parse(raw);
      if (tokens.expires_at && tokens.expires_at < Date.now()) {
        Logger.warn(this.componentName, `⚠️ ${service} 토큰이 만료됨`);
        return null;
      }

      Logger.info(this.componentName, `✅ ${service} 토큰 조회 완료`);
      return tokens;
    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 조회 실패`, error);
      return null;
    }
  }

  async deleteTokens(service: 'google' | 'hancom', account = 'default'): Promise<boolean> {
    try {
      const key = this.keyName(service, account);
      await keytar.deletePassword(key, account);
      Logger.info(this.componentName, `✅ ${service} 토큰 삭제 완료`);
      return true;
    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 삭제 실패`, error);
      return false;
    }
  }

  async refreshTokens(service: 'google', account = 'default'): Promise<OAuthTokens | null> {
    try {
      const currentTokens = await this.getTokens(service, account);
      if (!currentTokens?.refresh_token) {
        Logger.warn(this.componentName, `⚠️ ${service} refresh_token이 없습니다`);
        return null;
      }

      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          refresh_token: currentTokens.refresh_token,
          grant_type: 'refresh_token',
        }),
      });

      if (!response.ok) throw new Error(`Refresh failed: ${response.status}`);

      const newTokens: OAuthTokens = await response.json();
      if (!newTokens.refresh_token) newTokens.refresh_token = currentTokens.refresh_token;

      await this.saveTokens(service, newTokens, account);
      Logger.info(this.componentName, `✅ ${service} 토큰 갱신 완료 (keytar)`);
      return newTokens;
    } catch (error) {
      Logger.error(this.componentName, `❌ ${service} 토큰 갱신 실패`, error);
      return null;
    }
  }
}

export const tokenStorage = TokenStorageService.getInstance();
