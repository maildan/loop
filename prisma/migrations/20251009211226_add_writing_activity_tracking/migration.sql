-- CreateTable
CREATE TABLE "writing_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL DEFAULT 0,
    "episodeId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "writing_activities_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "writing_activities_projectId_idx" ON "writing_activities"("projectId");

-- CreateIndex
CREATE INDEX "writing_activities_date_idx" ON "writing_activities"("date");

-- CreateIndex
CREATE UNIQUE INDEX "writing_activities_projectId_date_key" ON "writing_activities"("projectId", "date");
