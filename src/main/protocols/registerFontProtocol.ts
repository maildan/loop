import { protocol } from 'electron';
import type { ProtocolRequest } from 'electron';
import { Logger } from '../../shared/logger';
import { fontService } from '../services/FontService';

/**
 * Registers the loop-font:// custom protocol so renderer processes can
 * retrieve WOFF2 font binaries without exposing file:// URLs.
 */
export async function registerFontProtocol(): Promise<void> {
  try {
    await fontService.initialize();
  } catch (error) {
    Logger.error('FONT_PROTOCOL', 'Failed to initialize font service before protocol registration', error);
    throw error;
  }

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
