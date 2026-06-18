-- CreateTable
CREATE TABLE "checklist_assignments" (
    "uid" SERIAL NOT NULL,
    "checklistUid" INTEGER NOT NULL,
    "assignedToUid" INTEGER NOT NULL,
    "assignedByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "checklist_assignments_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "document_categories" (
    "uid" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_categories_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "document_logs" (
    "uid" SERIAL NOT NULL,
    "documentUid" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "performedByUid" INTEGER NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_logs_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "documents" (
    "uid" SERIAL NOT NULL,
    "clientUid" INTEGER NOT NULL,
    "engagementUid" INTEGER,
    "categoryUid" INTEGER,
    "originalName" TEXT NOT NULL,
    "storedName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "uploadedByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "findings" (
    "uid" SERIAL NOT NULL,
    "issueUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "findings_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "issue_assignments" (
    "uid" SERIAL NOT NULL,
    "issueUid" INTEGER NOT NULL,
    "assignedToUid" INTEGER NOT NULL,
    "assignedByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_assignments_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "issue_status_logs" (
    "uid" SERIAL NOT NULL,
    "issueUid" INTEGER NOT NULL,
    "oldStatus" TEXT NOT NULL,
    "newStatus" TEXT NOT NULL,
    "changedByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "issue_status_logs_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "issues" (
    "uid" SERIAL NOT NULL,
    "engagementUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "responsiblePerson" TEXT,
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "issues_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "risk_checklists" (
    "uid" SERIAL NOT NULL,
    "riskUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risk_checklists_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "risks" (
    "uid" SERIAL NOT NULL,
    "engagementUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "risks_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "task_assignments" (
    "uid" SERIAL NOT NULL,
    "taskUid" INTEGER NOT NULL,
    "assignedToUid" INTEGER NOT NULL,
    "assignedByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_assignments_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "task_comments" (
    "uid" SERIAL NOT NULL,
    "taskUid" INTEGER NOT NULL,
    "userUid" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "task_comments_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "tasks" (
    "uid" SERIAL NOT NULL,
    "engagementUid" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdByUid" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "document_categories_name_key" ON "document_categories"("name");

-- CreateIndex
CREATE INDEX "document_logs_documentUid_createdAt_idx" ON "document_logs"("documentUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "documents_clientUid_createdAt_idx" ON "documents"("clientUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "documents_engagementUid_createdAt_idx" ON "documents"("engagementUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "documents_categoryUid_idx" ON "documents"("categoryUid");

-- CreateIndex
CREATE INDEX "issues_engagementUid_createdAt_idx" ON "issues"("engagementUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "issues_status_idx" ON "issues"("status");

-- CreateIndex
CREATE INDEX "issues_engagementUid_status_createdAt_idx" ON "issues"("engagementUid", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "risks_engagementUid_createdAt_idx" ON "risks"("engagementUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "risks_status_idx" ON "risks"("status");

-- CreateIndex
CREATE INDEX "risks_engagementUid_status_idx" ON "risks"("engagementUid", "status");

-- CreateIndex
CREATE INDEX "tasks_engagementUid_createdAt_idx" ON "tasks"("engagementUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "tasks_status_idx" ON "tasks"("status");

-- CreateIndex
CREATE INDEX "tasks_engagementUid_status_createdAt_idx" ON "tasks"("engagementUid", "status", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "audit_engagements_clientUid_idx" ON "audit_engagements"("clientUid");

-- CreateIndex
CREATE INDEX "audit_engagements_status_idx" ON "audit_engagements"("status");

-- CreateIndex
CREATE INDEX "audit_engagements_clientUid_createdAt_idx" ON "audit_engagements"("clientUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "audit_engagements_createdAt_idx" ON "audit_engagements"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "clients_isActive_createdAt_idx" ON "clients"("isActive", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "clients_createdAt_idx" ON "clients"("createdAt" DESC);

-- CreateIndex
CREATE INDEX "users_roleUid_idx" ON "users"("roleUid");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "checklist_assignments" ADD CONSTRAINT "checklist_assignments_checklistUid_fkey" FOREIGN KEY ("checklistUid") REFERENCES "risk_checklists"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_assignments" ADD CONSTRAINT "checklist_assignments_assignedToUid_fkey" FOREIGN KEY ("assignedToUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checklist_assignments" ADD CONSTRAINT "checklist_assignments_assignedByUid_fkey" FOREIGN KEY ("assignedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_logs" ADD CONSTRAINT "document_logs_documentUid_fkey" FOREIGN KEY ("documentUid") REFERENCES "documents"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_logs" ADD CONSTRAINT "document_logs_performedByUid_fkey" FOREIGN KEY ("performedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_clientUid_fkey" FOREIGN KEY ("clientUid") REFERENCES "clients"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_categoryUid_fkey" FOREIGN KEY ("categoryUid") REFERENCES "document_categories"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedByUid_fkey" FOREIGN KEY ("uploadedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_issueUid_fkey" FOREIGN KEY ("issueUid") REFERENCES "issues"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "findings" ADD CONSTRAINT "findings_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_assignments" ADD CONSTRAINT "issue_assignments_issueUid_fkey" FOREIGN KEY ("issueUid") REFERENCES "issues"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_assignments" ADD CONSTRAINT "issue_assignments_assignedToUid_fkey" FOREIGN KEY ("assignedToUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_assignments" ADD CONSTRAINT "issue_assignments_assignedByUid_fkey" FOREIGN KEY ("assignedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_status_logs" ADD CONSTRAINT "issue_status_logs_issueUid_fkey" FOREIGN KEY ("issueUid") REFERENCES "issues"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue_status_logs" ADD CONSTRAINT "issue_status_logs_changedByUid_fkey" FOREIGN KEY ("changedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risk_checklists" ADD CONSTRAINT "risk_checklists_riskUid_fkey" FOREIGN KEY ("riskUid") REFERENCES "risks"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "risks" ADD CONSTRAINT "risks_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_taskUid_fkey" FOREIGN KEY ("taskUid") REFERENCES "tasks"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assignedToUid_fkey" FOREIGN KEY ("assignedToUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_assignments" ADD CONSTRAINT "task_assignments_assignedByUid_fkey" FOREIGN KEY ("assignedByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_taskUid_fkey" FOREIGN KEY ("taskUid") REFERENCES "tasks"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_comments" ADD CONSTRAINT "task_comments_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_engagementUid_fkey" FOREIGN KEY ("engagementUid") REFERENCES "audit_engagements"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_createdByUid_fkey" FOREIGN KEY ("createdByUid") REFERENCES "users"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
