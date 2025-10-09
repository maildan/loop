/*
  Warnings:

  - You are about to drop the `platform_metrics` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `publisher_feedbacks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `publisher_relations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `strategy_experiments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `contractType` on the `publications` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "platform_metrics_publicationId_date_key";

-- DropIndex
DROP INDEX "platform_metrics_episodeNumber_idx";

-- DropIndex
DROP INDEX "platform_metrics_date_idx";

-- DropIndex
DROP INDEX "platform_metrics_publicationId_idx";

-- DropIndex
DROP INDEX "publisher_feedbacks_isResolved_idx";

-- DropIndex
DROP INDEX "publisher_feedbacks_date_idx";

-- DropIndex
DROP INDEX "publisher_feedbacks_relationId_idx";

-- DropIndex
DROP INDEX "publisher_relations_nextActionDate_idx";

-- DropIndex
DROP INDEX "publisher_relations_status_idx";

-- DropIndex
DROP INDEX "publisher_relations_projectId_idx";

-- DropIndex
DROP INDEX "strategy_experiments_startDate_idx";

-- DropIndex
DROP INDEX "strategy_experiments_status_idx";

-- DropIndex
DROP INDEX "strategy_experiments_type_idx";

-- DropIndex
DROP INDEX "strategy_experiments_projectId_idx";

-- AlterTable
ALTER TABLE "project_characters" ADD COLUMN "appearances" JSONB;
ALTER TABLE "project_characters" ADD COLUMN "firstAppearance" INTEGER;
ALTER TABLE "project_characters" ADD COLUMN "speechPattern" TEXT;

-- AlterTable
ALTER TABLE "project_notes" ADD COLUMN "importance" TEXT;
ALTER TABLE "project_notes" ADD COLUMN "introducedEpisode" INTEGER;
ALTER TABLE "project_notes" ADD COLUMN "resolvedEpisode" INTEGER;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "platform_metrics";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "publisher_feedbacks";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "publisher_relations";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "strategy_experiments";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_publications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "platformUrl" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "publications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_publications" ("createdAt", "endDate", "id", "note", "platform", "platformUrl", "projectId", "startDate", "status", "updatedAt") SELECT "createdAt", "endDate", "id", "note", "platform", "platformUrl", "projectId", "startDate", "status", "updatedAt" FROM "publications";
DROP TABLE "publications";
ALTER TABLE "new_publications" RENAME TO "publications";
CREATE INDEX "publications_projectId_idx" ON "publications"("projectId");
CREATE INDEX "publications_platform_idx" ON "publications"("platform");
CREATE INDEX "publications_status_idx" ON "publications"("status");
CREATE UNIQUE INDEX "publications_projectId_platform_key" ON "publications"("projectId", "platform");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
