-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "genre" TEXT NOT NULL DEFAULT '기타',
    "status" TEXT NOT NULL DEFAULT 'active',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "author" TEXT NOT NULL DEFAULT '사용자',
    "platform" TEXT NOT NULL DEFAULT 'loop',
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastModified" DATETIME NOT NULL,
    "chapters" TEXT,
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

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
    "platform" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "publishedAt" DATETIME,
    CONSTRAINT "episodes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_characters" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT,
    "notes" TEXT,
    "appearance" TEXT,
    "personality" TEXT,
    "background" TEXT,
    "goals" TEXT,
    "conflicts" TEXT,
    "avatar" TEXT,
    "color" TEXT NOT NULL DEFAULT '#3b82f6',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "appearances" JSONB,
    "firstAppearance" INTEGER,
    "speechPattern" TEXT,
    CONSTRAINT "project_characters_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_structure" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT,
    "status" TEXT NOT NULL DEFAULT 'planned',
    "wordCount" INTEGER NOT NULL DEFAULT 0,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "depth" INTEGER NOT NULL DEFAULT 0,
    "color" TEXT NOT NULL DEFAULT '#6b7280',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "project_structure_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_structure_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "project_structure" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_notes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'general',
    "tags" JSONB,
    "color" TEXT NOT NULL DEFAULT '#fbbf24',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "importance" TEXT,
    "introducedEpisode" INTEGER,
    "resolvedEpisode" INTEGER,
    CONSTRAINT "project_notes_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "typing_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "keyCount" INTEGER NOT NULL DEFAULT 0,
    "wpm" REAL NOT NULL DEFAULT 0,
    "accuracy" REAL NOT NULL DEFAULT 0,
    "windowTitle" TEXT,
    "appName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "typing_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "key_events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "keyCode" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL,
    "eventType" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "key_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "typing_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "session_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "averageWpm" REAL NOT NULL,
    "peakWpm" REAL NOT NULL,
    "errorCount" INTEGER NOT NULL,
    "correctionCount" INTEGER NOT NULL,
    "rhythmScore" REAL NOT NULL,
    "consistencyScore" REAL NOT NULL,
    "improvementTips" JSONB,
    "analysisData" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "session_analytics_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "typing_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "language" TEXT NOT NULL DEFAULT 'ko',
    "keyboardLayout" TEXT NOT NULL DEFAULT 'qwerty',
    "showRealTimeWpm" BOOLEAN NOT NULL DEFAULT true,
    "enableSounds" BOOLEAN NOT NULL DEFAULT false,
    "autoSaveInterval" INTEGER NOT NULL DEFAULT 30,
    "privacyMode" BOOLEAN NOT NULL DEFAULT false,
    "monitoringEnabled" BOOLEAN NOT NULL DEFAULT true,
    "targetWpm" INTEGER NOT NULL DEFAULT 60,
    "sessionGoalMinutes" INTEGER NOT NULL DEFAULT 30,
    "excludedApps" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "user_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "threshold" REAL NOT NULL,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "app_usage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "appName" TEXT NOT NULL,
    "windowTitle" TEXT,
    "totalTime" INTEGER NOT NULL,
    "sessionCount" INTEGER NOT NULL DEFAULT 1,
    "avgWpm" REAL NOT NULL DEFAULT 0,
    "lastUsed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "daily_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "targetWpm" INTEGER NOT NULL,
    "targetMinutes" INTEGER NOT NULL,
    "actualWpm" REAL NOT NULL DEFAULT 0,
    "actualMinutes" REAL NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "search_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "results" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

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

-- CreateTable
CREATE TABLE "gemini_chat_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "title" TEXT,
    "summary" TEXT,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastInteraction" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "gemini_chat_sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "gemini_chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "tokenUsage" JSONB,
    "isStreaming" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "gemini_chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "gemini_chat_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "publications" (
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
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_lastModified_idx" ON "projects"("lastModified");

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

-- CreateIndex
CREATE INDEX "project_characters_projectId_idx" ON "project_characters"("projectId");

-- CreateIndex
CREATE INDEX "project_characters_sortOrder_idx" ON "project_characters"("sortOrder");

-- CreateIndex
CREATE INDEX "project_structure_projectId_idx" ON "project_structure"("projectId");

-- CreateIndex
CREATE INDEX "project_structure_sortOrder_idx" ON "project_structure"("sortOrder");

-- CreateIndex
CREATE INDEX "project_structure_parentId_idx" ON "project_structure"("parentId");

-- CreateIndex
CREATE INDEX "project_notes_projectId_idx" ON "project_notes"("projectId");

-- CreateIndex
CREATE INDEX "project_notes_type_idx" ON "project_notes"("type");

-- CreateIndex
CREATE INDEX "project_notes_isPinned_idx" ON "project_notes"("isPinned");

-- CreateIndex
CREATE INDEX "project_notes_createdAt_idx" ON "project_notes"("createdAt");

-- CreateIndex
CREATE INDEX "typing_sessions_userId_idx" ON "typing_sessions"("userId");

-- CreateIndex
CREATE INDEX "typing_sessions_startTime_idx" ON "typing_sessions"("startTime");

-- CreateIndex
CREATE INDEX "typing_sessions_wpm_idx" ON "typing_sessions"("wpm");

-- CreateIndex
CREATE INDEX "key_events_sessionId_idx" ON "key_events"("sessionId");

-- CreateIndex
CREATE INDEX "key_events_timestamp_idx" ON "key_events"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "session_analytics_sessionId_key" ON "session_analytics"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_settings_userId_key" ON "user_settings"("userId");

-- CreateIndex
CREATE INDEX "achievements_userId_idx" ON "achievements"("userId");

-- CreateIndex
CREATE INDEX "achievements_type_idx" ON "achievements"("type");

-- CreateIndex
CREATE INDEX "app_usage_userId_idx" ON "app_usage"("userId");

-- CreateIndex
CREATE INDEX "app_usage_appName_idx" ON "app_usage"("appName");

-- CreateIndex
CREATE INDEX "app_usage_lastUsed_idx" ON "app_usage"("lastUsed");

-- CreateIndex
CREATE UNIQUE INDEX "app_usage_userId_appName_key" ON "app_usage"("userId", "appName");

-- CreateIndex
CREATE INDEX "daily_goals_userId_idx" ON "daily_goals"("userId");

-- CreateIndex
CREATE INDEX "daily_goals_date_idx" ON "daily_goals"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_goals_userId_date_key" ON "daily_goals"("userId", "date");

-- CreateIndex
CREATE INDEX "search_history_userId_idx" ON "search_history"("userId");

-- CreateIndex
CREATE INDEX "search_history_createdAt_idx" ON "search_history"("createdAt");

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

-- CreateIndex
CREATE INDEX "gemini_chat_sessions_projectId_idx" ON "gemini_chat_sessions"("projectId");

-- CreateIndex
CREATE INDEX "gemini_chat_sessions_lastInteraction_idx" ON "gemini_chat_sessions"("lastInteraction");

-- CreateIndex
CREATE INDEX "gemini_chat_messages_sessionId_idx" ON "gemini_chat_messages"("sessionId");

-- CreateIndex
CREATE INDEX "gemini_chat_messages_createdAt_idx" ON "gemini_chat_messages"("createdAt");

-- CreateIndex
CREATE INDEX "publications_projectId_idx" ON "publications"("projectId");

-- CreateIndex
CREATE INDEX "publications_platform_idx" ON "publications"("platform");

-- CreateIndex
CREATE INDEX "publications_status_idx" ON "publications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "publications_projectId_platform_key" ON "publications"("projectId", "platform");

-- CreateIndex
CREATE INDEX "writing_activities_projectId_idx" ON "writing_activities"("projectId");

-- CreateIndex
CREATE INDEX "writing_activities_date_idx" ON "writing_activities"("date");

-- CreateIndex
CREATE UNIQUE INDEX "writing_activities_projectId_date_key" ON "writing_activities"("projectId", "date");
