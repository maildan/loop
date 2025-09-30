import { protocol } from 'electron';
import type { ProtocolRequest } from 'electron';
import { Logger } from '../../shared/logger';
import { fontService } from '../services/FontService';

/**
 * Registers the loop-font:// custom protocol so renderer processes can
 * retrieve WOFF2 font binaries without exposing file:// URLs.
 */
export async function registerFontProtocol(): Promise<void> {
  // Start font service initialization in background - don't wait for it
  const initPromise = fontService.initialize().catch(error => {
    Logger.error('FONT_PROTOCOL', 'Font service initialization failed in background', error);
  });

  try {
    await protocol.unhandle?.('loop-font');
  } catch {
    // ignore when protocol has not been registered yet
  }

  protocol.handle('loop-font', async (request: ProtocolRequest) => {
    try {
      const variantId = request.url.replace('loop-font://', '').replace(/^\//, '');

      if (!variantId) {
        Logger.warn('FONT_PROTOCOL', 'Received loop-font request without variant id');
        return new Response(null, { status: 400 });
      }

      // Ensure font service is initialized before serving fonts
      try {
        await fontService.initialize();
      } catch (initError) {
        Logger.error('FONT_PROTOCOL', 'Font service initialization failed during request', initError);
        return new Response(null, { status: 503 });
      }

      const arrayBuffer = await fontService.getFontBinary(variantId);
      if (!arrayBuffer) {
        return new Response(null, { status: 404 });
      }

      return new Response(arrayBuffer, {
        headers: {
          'Content-Type': 'font/woff2',
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });
    } catch (error) {
      Logger.error('FONT_PROTOCOL', 'Failed to serve font via loop-font protocol', {
        url: request.url,
        error
      });
      return new Response(null, { status: 500 });
    }
  });

  Logger.info('FONT_PROTOCOL', 'loop-font protocol registered');
}

export default registerFontProtocol;
