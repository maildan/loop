import { createServer } from 'http';
import { join } from 'path';
import { existsSync } from 'fs';
import { Logger } from '../../shared/logger';
import { PORTS } from '../constants';

/**
 * StaticServer — lifecycle-only (<=100 lines)
 * Delegates request handling to modules under src/main/utils/static-server
 */
export class StaticServer {
  private static instance: StaticServer;
  private server: import('http').Server | null = null;
  private port = 0;
  private readonly basePort = PORTS.STATIC_SERVER;
  private readonly staticPath = join(__dirname, '..', 'renderer');

  private constructor() {
    Logger.debug('STATIC_SERVER', 'StaticServer lifecycle-only instance created', { staticPath: this.staticPath });
  }

  public static getInstance(): StaticServer { if (!StaticServer.instance) StaticServer.instance = new StaticServer(); return StaticServer.instance; }

  public getStaticPath(): string { return this.staticPath; }

  // Backwards compatibility for callers expecting getMainUrl
  public getMainUrl(): string { return `http://localhost:${this.port}`; }

  /**
   * Check whether static build exists and ensure the HTTP server is started in production.
   */
  public async checkHealth(): Promise<boolean> {
    const indexExists = existsSync(join(this.staticPath, 'index.html'));
    if (!indexExists) return false;

    // If index exists but server not started, start it (restore legacy behaviour)
    if (!this.server) {
      try {
        await this.start();
      } catch (err) {
        Logger.error('STATIC_SERVER', 'Failed to start server in checkHealth', err);
      }
    }

    return this.port > 0;
  }

  public async start(): Promise<void> {
    if (this.server) return;
    this.server = createServer((req, res) => {
      Promise.all([
        import('./static-server/requestRouter'),
        import('./static-server/staticProvider'),
        import('./static-server/dynamicRouter'),
        import('./static-server/oauthCallback')
      ]).then(([
        { RequestRouter },
        { StaticFileProvider },
        { DynamicRouter },
        { OAuthCallbackHandler }
      ]) => {
        const staticProvider = new StaticFileProvider(this.staticPath);
        const dynamicRouter = new DynamicRouter(this.staticPath);
        const oauthHandler = new OAuthCallbackHandler(this.staticPath);
        const router = new RequestRouter(staticProvider, dynamicRouter, oauthHandler);
        router.handle(req, res).catch((err: any) => { Logger.error('STATIC_SERVER', 'Router failed', err); try { res.writeHead(500); res.end('Internal Server Error'); } catch (e) {/*ignore*/ } });
      }).catch(err => { Logger.error('STATIC_SERVER', 'Failed to load router', err); try { res.writeHead(500); res.end('Internal Server Error'); } catch (e) {/*ignore*/ } });
    });

    await new Promise<void>((resolve, reject) => {
      const tryPort = (p: number) => {
        this.server!.listen(p, 'localhost', () => { this.port = p; Logger.info('STATIC_SERVER', `Started on http://localhost:${p}`); resolve(); });
        this.server!.on('error', (err: any) => { if (err.code === 'EADDRINUSE' && p < this.basePort + 100) return tryPort(p + 1); reject(err); });
      };
      tryPort(this.basePort);
    });
  }

  public cleanup(): void { if (!this.server) return; Logger.info('STATIC_SERVER', 'Shutting down'); this.server.close(); this.server = null; this.port = 0; }
}