-- CreateTable
CREATE TABLE "episodes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "episodeNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "targetWordCount" INTEGER NOT NULL DEFAULT 5500,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "act" TEXT,
    "cliffhangerType" TEXT,
    "cliffhangerIntensity" INTEGER,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "episodes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "episodes_projectId_idx" ON "episodes"("projectId");

-- CreateIndex
CREATE INDEX "episodes_episodeNumber_idx" ON "episodes"("episodeNumber");

-- CreateIndex
CREATE INDEX "episodes_status_idx" ON "episodes"("status");

-- CreateIndex
CREATE INDEX "episodes_act_idx" ON "episodes"("act");

-- CreateIndex
CREATE UNIQUE INDEX "episodes_projectId_episodeNumber_key" ON "episodes"("projectId", "episodeNumber");
