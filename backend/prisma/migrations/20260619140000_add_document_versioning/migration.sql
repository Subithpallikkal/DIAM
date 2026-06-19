-- AlterTable
ALTER TABLE "documents" ADD COLUMN "parentDocumentUid" INTEGER,
ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE INDEX "documents_parentDocumentUid_idx" ON "documents"("parentDocumentUid");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_parentDocumentUid_fkey" FOREIGN KEY ("parentDocumentUid") REFERENCES "documents"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
