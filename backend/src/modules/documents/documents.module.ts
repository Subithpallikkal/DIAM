import { Module } from "@nestjs/common";
import { DocumentsController } from "../../controllers/documents/documents.controller";
import { DocumentsService } from "../../services/documents/documents.service";
import { DocumentStorageService } from "../../services/documents/document-storage.service";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, DocumentStorageService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
