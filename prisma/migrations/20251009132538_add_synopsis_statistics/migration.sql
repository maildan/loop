-- CreateTable
CREATE TABLE "publications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "platformUrl" TEXT,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'ongoing',
    "contractType" TEXT,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "publications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "platform_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "publicationId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "views" INTEGER,
    "revenue" REAL,
    "purchases" INTEGER,
    "rank" INTEGER,
    "rankType" TEXT,
    "episodeNumber" INTEGER,
    "note" TEXT,
    "isEstimated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "platform_metrics_publicationId_fkey" FOREIGN KEY ("publicationId") REFERENCES "publications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publisher_relations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "publisherName" TEXT NOT NULL,
    "publisherType" TEXT NOT NULL DEFAULT 'publisher',
    "contactDate" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'contacted',
    "contractType" TEXT,
    "contract" JSONB,
    "advance" REAL,
    "royaltyRate" REAL,
    "nextActionDate" DATETIME,
    "note" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "publisher_relations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publisher_feedbacks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "relationId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "actionItem" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "publisher_feedbacks_relationId_fkey" FOREIGN KEY ("relationId") REFERENCES "publisher_relations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "strategy_experiments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'running',
    "beforeData" JSONB,
    "afterData" JSONB,
    "results" JSONB,
    "conclusion" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "strategy_experiments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "publications_projectId_idx" ON "publications"("projectId");

-- CreateIndex
CREATE INDEX "publications_platform_idx" ON "publications"("platform");

-- CreateIndex
CREATE INDEX "publications_status_idx" ON "publications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "publications_projectId_platform_key" ON "publications"("projectId", "platform");

-- CreateIndex
CREATE INDEX "platform_metrics_publicationId_idx" ON "platform_metrics"("publicationId");

-- CreateIndex
CREATE INDEX "platform_metrics_date_idx" ON "platform_metrics"("date");

-- CreateIndex
CREATE INDEX "platform_metrics_episodeNumber_idx" ON "platform_metrics"("episodeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "platform_metrics_publicationId_date_key" ON "platform_metrics"("publicationId", "date");

-- CreateIndex
CREATE INDEX "publisher_relations_projectId_idx" ON "publisher_relations"("projectId");

-- CreateIndex
CREATE INDEX "publisher_relations_status_idx" ON "publisher_relations"("status");

-- CreateIndex
CREATE INDEX "publisher_relations_nextActionDate_idx" ON "publisher_relations"("nextActionDate");

-- CreateIndex
CREATE INDEX "publisher_feedbacks_relationId_idx" ON "publisher_feedbacks"("relationId");

-- CreateIndex
CREATE INDEX "publisher_feedbacks_date_idx" ON "publisher_feedbacks"("date");

-- CreateIndex
CREATE INDEX "publisher_feedbacks_isResolved_idx" ON "publisher_feedbacks"("isResolved");

-- CreateIndex
CREATE INDEX "strategy_experiments_projectId_idx" ON "strategy_experiments"("projectId");

-- CreateIndex
CREATE INDEX "strategy_experiments_type_idx" ON "strategy_experiments"("type");

-- CreateIndex
CREATE INDEX "strategy_experiments_status_idx" ON "strategy_experiments"("status");

-- CreateIndex
CREATE INDEX "strategy_experiments_startDate_idx" ON "strategy_experiments"("startDate");
