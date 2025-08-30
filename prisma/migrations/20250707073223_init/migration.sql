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
    CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
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
