import { app } from 'electron';
import { promises as fsPromises, existsSync } from 'fs';
import { join, dirname } from 'path';
import { Logger } from '../../shared/logger';

const COMPONENT = 'PRISMA_PATHS';
const DB_FILENAME = 'loop.db';
const PRISMA_DATA_DIR = 'prisma';

/**
 * 🔥 ASYNC: Ensure directory exists
 */
const ensureDirectory = async (directory: string): Promise<void> => {
  try {
    await fsPromises.access(directory);
  } catch {
    await fsPromises.mkdir(directory, { recursive: true });
    Logger.info(COMPONENT, 'Created directory', { directory });
  }
};

const ENGINE_FILE_MAP: Record<string, string[]> = {
  'win32-x64': ['query_engine-windows.dll.node'],
  'win32-arm64': ['query_engine-windows-arm64.dll.node', 'query_engine-windows.dll.node'],
  'darwin-arm64': ['libquery_engine-darwin-arm64.dylib.node', 'libquery_engine-darwin.dylib.node'],
  'darwin-x64': ['libquery_engine-darwin.dylib.node'],
  'linux-arm64': ['libquery_engine-linux-arm64-openssl-3.0.x.so.node'],
  'linux-x64': ['libquery_engine-debian-openssl-3.0.x.so.node'],
};

const resolveEngineSearchPaths = (): string[] => {
  const resourcesPath = process.resourcesPath ? String(process.resourcesPath) : '';
  let appPath = process.cwd();

  try {
    appPath = app.getAppPath();
  } catch (error) {
    Logger.debug(COMPONENT, 'app.getAppPath unavailable, falling back to cwd', { error });
  }

  const candidates = [
    resourcesPath ? join(resourcesPath, 'app.asar.unpacked', 'node_modules', '.prisma', 'client') : null,
    resourcesPath ? join(resourcesPath, 'node_modules', '.prisma', 'client') : null,
  join(appPath, '..', 'node_modules', '.prisma', 'client'),
  join(appPath, 'node_modules', '.prisma', 'client'),
  join(process.cwd(), 'node_modules', '.prisma', 'client'),
  join(dirname(__dirname), '..', '..', 'node_modules', '.prisma', 'client'),
  ];

  return Array.from(new Set(candidates.filter((value): value is string => Boolean(value))));
};

const setPrismaEngineEnvironment = (): void => {
  const platformKey = `${process.platform}-${process.arch}`;
  const fallbackKey = `${process.platform}-x64`;
  const engineCandidates = ENGINE_FILE_MAP[platformKey] ?? ENGINE_FILE_MAP[fallbackKey] ?? [];

  if (engineCandidates.length === 0) {
    Logger.warn(COMPONENT, 'No Prisma engine candidates mapped for platform', { platform: process.platform, arch: process.arch });
    return;
  }

  const searchPaths = resolveEngineSearchPaths();

  for (const fileName of engineCandidates) {
    for (const basePath of searchPaths) {
      const fullPath = join(basePath, fileName);
      if (existsSync(fullPath)) {
        if (process.env.PRISMA_QUERY_ENGINE_LIBRARY !== fullPath) {
          Reflect.set(process.env as Record<string, unknown>, 'PRISMA_QUERY_ENGINE_LIBRARY', fullPath);
          Logger.info(COMPONENT, 'Resolved Prisma engine library', { fullPath });
        }
        Reflect.set(process.env as Record<string, unknown>, 'PRISMA_QUERY_ENGINE_TYPE', 'library');
        return;
      }
    }
  }

  Logger.warn(COMPONENT, 'Failed to resolve Prisma engine library', { platform: process.platform, arch: process.arch, searchPaths, engineCandidates });
};

/**
 * 🔥 ASYNC: Find template database
 */
const findTemplateDatabase = async (target: string): Promise<string | null> => {
  const candidates = [
    join(process.resourcesPath || '', PRISMA_DATA_DIR, DB_FILENAME),
    join(app.getAppPath(), PRISMA_DATA_DIR, DB_FILENAME),
    join(process.cwd(), PRISMA_DATA_DIR, DB_FILENAME),
    join(dirname(__dirname), '..', '..', PRISMA_DATA_DIR, DB_FILENAME),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      await fsPromises.access(candidate);
      const stats = await fsPromises.stat(candidate);
      if (stats.isFile() && stats.size > 0 && candidate !== target) {
        Logger.debug(COMPONENT, 'Template database candidate found', { candidate, size: stats.size });
        return candidate;
      }
    } catch (error) {
      Logger.debug(COMPONENT, 'Template database candidate check failed', { candidate, error });
    }
  }

  return null;
};

/**
 * 🔥 ASYNC: Resolve Prisma database path
 */
export const resolvePrismaDatabasePath = async (): Promise<string> => {
  const userDataPath = app.getPath('userData');
  const prismaDir = join(userDataPath, PRISMA_DATA_DIR);
  await ensureDirectory(prismaDir);

  const targetPath = join(prismaDir, DB_FILENAME);

  // 🔥 ASYNC: Check if database exists
  try {
    await fsPromises.access(targetPath);
  } catch {
    // Database doesn't exist, create it
    const templatePath = await findTemplateDatabase(targetPath);

    if (templatePath) {
      try {
        await fsPromises.copyFile(templatePath, targetPath);
        Logger.info(COMPONENT, 'Copied template database to user data directory', { templatePath, targetPath });
      } catch (error) {
        Logger.warn(COMPONENT, 'Failed to copy template database, falling back to empty file', { templatePath, targetPath, error });
        await fsPromises.writeFile(targetPath, '');
      }
    } else {
      Logger.info(COMPONENT, 'Template database not found, creating empty SQLite file', { targetPath });
      await fsPromises.writeFile(targetPath, '');
    }
  }

  return targetPath;
};

/**
 * 🔥 ASYNC: Ensure database URL is set
 */
export const ensureDatabaseUrl = async (): Promise<{ dbPath: string; databaseUrl: string }> => {
  const dbPath = await resolvePrismaDatabasePath();
  const databaseUrl = `file:${dbPath}`;

  if (process.env.DATABASE_URL !== databaseUrl) {
    Logger.info(COMPONENT, 'Setting DATABASE_URL for Prisma', { databaseUrl });
    Reflect.set(process.env as Record<string, unknown>, 'DATABASE_URL', databaseUrl);
  }

  setPrismaEngineEnvironment();

  return { dbPath, databaseUrl };
};
