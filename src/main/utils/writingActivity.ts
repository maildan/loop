import type { Prisma, PrismaClient } from '@prisma/client';
import { getTodayStart } from '../../shared/utils/date';

/**
 * Upsert daily writing activity metrics for a project.
 * Aggregates additional word count into the existing record for the day.
 */
export async function recordDailyWritingActivity(
  prisma: PrismaClient | Prisma.TransactionClient,
  projectId: string,
  wordCount: number,
  duration: number = 0,
  date: Date = getTodayStart(),
  episodeId?: string
): Promise<void> {
  if (wordCount <= 0) {
    return;
  }

  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);

  await prisma.writingActivity.upsert({
    where: {
      projectId_date: {
        projectId,
        date: normalizedDate,
      },
    },
    update: {
      wordCount: {
        increment: wordCount,
      },
      duration: {
        increment: duration,
      },
    },
    create: {
      projectId,
      date: normalizedDate,
      wordCount,
      duration,
      episodeId,
    },
  });
}
