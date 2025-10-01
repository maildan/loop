import { app } from 'electron';
import { existsSync, mkdirSync, copyFileSync, writeFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { Logger } from '../../shared/logger';

const COMPONENT = 'PRISMA_PATHS';
const DB_FILENAME = 'loop.db';
const PRISMA_DATA_DIR = 'prisma';

const ensureDirectory = (directory: string) => {
  if (!existsSync(directory)) {
    mkdirSync(directory, { recursive: true });
    Logger.info(COMPONENT, 'Created directory', { directory });
  }
};

const findTemplateDatabase = (target: string): string | null => {
  const candidates = [
    join(process.resourcesPath || '', PRISMA_DATA_DIR, DB_FILENAME),
    join(app.getAppPath(), PRISMA_DATA_DIR, DB_FILENAME),
    join(process.cwd(), PRISMA_DATA_DIR, DB_FILENAME),
    join(dirname(__dirname), '..', '..', PRISMA_DATA_DIR, DB_FILENAME),
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      if (existsSync(candidate)) {
        const stats = statSync(candidate);
        if (stats.isFile() && stats.size > 0 && candidate !== target) {
          Logger.debug(COMPONENT, 'Template database candidate found', { candidate, size: stats.size });
          return candidate;
        }
      }
    } catch (error) {
      Logger.debug(COMPONENT, 'Template database candidate check failed', { candidate, error });
    }
  }

  return null;
};

export const resolvePrismaDatabasePath = (): string => {
  const userDataPath = app.getPath('userData');
  const prismaDir = join(userDataPath, PRISMA_DATA_DIR);
  ensureDirectory(prismaDir);

  const targetPath = join(prismaDir, DB_FILENAME);

  if (!existsSync(targetPath)) {
    const templatePath = findTemplateDatabase(targetPath);

    if (templatePath) {
      try {
        copyFileSync(templatePath, targetPath);
        Logger.info(COMPONENT, 'Copied template database to user data directory', { templatePath, targetPath });
      } catch (error) {
        Logger.warn(COMPONENT, 'Failed to copy template database, falling back to empty file', { templatePath, targetPath, error });
        writeFileSync(targetPath, '');
      }
    } else {
      Logger.info(COMPONENT, 'Template database not found, creating empty SQLite file', { targetPath });
      writeFileSync(targetPath, '');
    }
  }

  return targetPath;
};

export const ensureDatabaseUrl = (): { dbPath: string; databaseUrl: string } => {
  const dbPath = resolvePrismaDatabasePath();
  const databaseUrl = `file:${dbPath}`;

  if (process.env.DATABASE_URL !== databaseUrl) {
    Logger.info(COMPONENT, 'Setting DATABASE_URL for Prisma', { databaseUrl });
    process.env.DATABASE_URL = databaseUrl;
  }

  return { dbPath, databaseUrl };
};
