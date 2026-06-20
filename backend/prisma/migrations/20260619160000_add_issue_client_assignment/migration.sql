-- AlterTable
ALTER TABLE "issues" ADD COLUMN "assignedClientUid" INTEGER;

-- CreateIndex
CREATE INDEX "issues_assignedClientUid_idx" ON "issues"("assignedClientUid");

-- AddForeignKey
ALTER TABLE "issues" ADD CONSTRAINT "issues_assignedClientUid_fkey" FOREIGN KEY ("assignedClientUid") REFERENCES "clients"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
