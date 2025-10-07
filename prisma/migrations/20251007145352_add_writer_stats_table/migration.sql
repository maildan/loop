-- AlterTable
ALTER TABLE "projects" ADD COLUMN "chapters" TEXT;

-- CreateTable
CREATE TABLE "ai_analyses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "metadata" JSONB,
    "confidence" REAL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "error" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ai_analyses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_workflows" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "workflowName" TEXT NOT NULL,
    "configYaml" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "currentStep" TEXT,
    "totalSteps" INTEGER NOT NULL DEFAULT 1,
    "completedSteps" INTEGER NOT NULL DEFAULT 0,
    "results" JSONB,
    "error" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ai_workflows_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_workflow_steps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "stepName" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "analysisType" TEXT NOT NULL,
    "inputData" TEXT,
    "outputData" TEXT,
    "prompt" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "duration" INTEGER,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ai_workflow_steps_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "ai_workflows" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_evaluations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "analysisId" TEXT,
    "evaluationType" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "score" REAL NOT NULL,
    "maxScore" REAL NOT NULL DEFAULT 100,
    "criteria" JSONB NOT NULL,
    "feedback" TEXT,
    "suggestions" JSONB,
    "strengths" JSONB,
    "weaknesses" JSONB,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ai_evaluations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ai_evaluations_analysisId_fkey" FOREIGN KEY ("analysisId") REFERENCES "ai_analyses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ai_usage_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "date" DATETIME NOT NULL,
    "apiProvider" TEXT NOT NULL,
    "analysisType" TEXT NOT NULL,
    "requestCount" INTEGER NOT NULL DEFAULT 0,
    "tokenUsed" INTEGER NOT NULL DEFAULT 0,
    "cost" REAL NOT NULL DEFAULT 0,
    "successCount" INTEGER NOT NULL DEFAULT 0,
    "failureCount" INTEGER NOT NULL DEFAULT 0,
    "avgResponseTime" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "writer_stats" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "sessionStartTime" DATETIME NOT NULL,
    "sessionEndTime" DATETIME,
    "sessionDuration" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "charCount" INTEGER NOT NULL DEFAULT 0,
    "paragraphCount" INTEGER NOT NULL DEFAULT 0,
    "wpm" INTEGER NOT NULL DEFAULT 0,
    "wordGoal" INTEGER NOT NULL DEFAULT 0,
    "goalAchieved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "writer_stats_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ai_analyses_projectId_idx" ON "ai_analyses"("projectId");

-- CreateIndex
CREATE INDEX "ai_analyses_analysisType_idx" ON "ai_analyses"("analysisType");

-- CreateIndex
CREATE INDEX "ai_analyses_createdAt_idx" ON "ai_analyses"("createdAt");

-- CreateIndex
CREATE INDEX "ai_analyses_status_idx" ON "ai_analyses"("status");

-- CreateIndex
CREATE INDEX "ai_workflows_projectId_idx" ON "ai_workflows"("projectId");

-- CreateIndex
CREATE INDEX "ai_workflows_status_idx" ON "ai_workflows"("status");

-- CreateIndex
CREATE INDEX "ai_workflows_createdAt_idx" ON "ai_workflows"("createdAt");

-- CreateIndex
CREATE INDEX "ai_workflow_steps_workflowId_idx" ON "ai_workflow_steps"("workflowId");

-- CreateIndex
CREATE INDEX "ai_workflow_steps_stepOrder_idx" ON "ai_workflow_steps"("stepOrder");

-- CreateIndex
CREATE INDEX "ai_workflow_steps_status_idx" ON "ai_workflow_steps"("status");

-- CreateIndex
CREATE INDEX "ai_evaluations_projectId_idx" ON "ai_evaluations"("projectId");

-- CreateIndex
CREATE INDEX "ai_evaluations_evaluationType_idx" ON "ai_evaluations"("evaluationType");

-- CreateIndex
CREATE INDEX "ai_evaluations_category_idx" ON "ai_evaluations"("category");

-- CreateIndex
CREATE INDEX "ai_evaluations_score_idx" ON "ai_evaluations"("score");

-- CreateIndex
CREATE INDEX "ai_evaluations_createdAt_idx" ON "ai_evaluations"("createdAt");

-- CreateIndex
CREATE INDEX "ai_usage_stats_date_idx" ON "ai_usage_stats"("date");

-- CreateIndex
CREATE INDEX "ai_usage_stats_userId_idx" ON "ai_usage_stats"("userId");

-- CreateIndex
CREATE INDEX "ai_usage_stats_apiProvider_idx" ON "ai_usage_stats"("apiProvider");

-- CreateIndex
CREATE UNIQUE INDEX "ai_usage_stats_date_userId_apiProvider_analysisType_key" ON "ai_usage_stats"("date", "userId", "apiProvider", "analysisType");

-- CreateIndex
CREATE INDEX "writer_stats_projectId_idx" ON "writer_stats"("projectId");

-- CreateIndex
CREATE INDEX "writer_stats_sessionStartTime_idx" ON "writer_stats"("sessionStartTime");

-- CreateIndex
CREATE INDEX "writer_stats_createdAt_idx" ON "writer_stats"("createdAt");
