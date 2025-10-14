import { app } from 'electron';
import { promises as fsPromises, existsSync, mkdirSync, copyFileSync, writeFileSync, statSync } from 'fs';
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

  return { dbPath, databaseUrl };
};
