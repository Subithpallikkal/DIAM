-- CreateIndex
CREATE INDEX "checklist_assignments_assignedToUid_idx" ON "checklist_assignments"("assignedToUid");

-- CreateIndex
CREATE INDEX "checklist_assignments_checklistUid_createdAt_idx" ON "checklist_assignments"("checklistUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "checklist_assignments_assignedToUid_createdAt_idx" ON "checklist_assignments"("assignedToUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "issue_assignments_assignedToUid_idx" ON "issue_assignments"("assignedToUid");

-- CreateIndex
CREATE INDEX "issue_assignments_issueUid_createdAt_idx" ON "issue_assignments"("issueUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "issue_assignments_assignedToUid_createdAt_idx" ON "issue_assignments"("assignedToUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "risk_checklists_isCompleted_idx" ON "risk_checklists"("isCompleted");

-- CreateIndex
CREATE INDEX "risk_checklists_riskUid_isCompleted_idx" ON "risk_checklists"("riskUid", "isCompleted");

-- CreateIndex
CREATE INDEX "task_assignments_assignedToUid_idx" ON "task_assignments"("assignedToUid");

-- CreateIndex
CREATE INDEX "task_assignments_taskUid_createdAt_idx" ON "task_assignments"("taskUid", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "task_assignments_assignedToUid_createdAt_idx" ON "task_assignments"("assignedToUid", "createdAt" DESC);
