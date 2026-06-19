import {
  BadRequestException,
  Injectable,
  NotFoundException,
  StreamableFile,
} from "@nestjs/common";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomUUID } from "crypto";
import { DocumentsService } from "./documents.service";
import { DocumentLogAction } from "../../dtos/common/enums.dto";

@Injectable()
export class DocumentStorageService {
  private readonly uploadDir: string;

  constructor(private documentsService: DocumentsService) {
    this.uploadDir = process.env.UPLOAD_DIR ?? join(process.cwd(), "uploads");
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async upload(
    file: Express.Multer.File,
    data: {
      clientId: number;
      engagementId?: number;
      categoryId?: number;
      uploadedByUid: number;
    },
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const storedName = `${randomUUID()}-${file.originalname}`;

    const { writeFileSync } = await import("fs");
    writeFileSync(join(this.uploadDir, storedName), file.buffer);

    return this.documentsService.createRecord({
      clientId: data.clientId,
      engagementId: data.engagementId,
      categoryId: data.categoryId,
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedByUid: data.uploadedByUid,
    });
  }

  async uploadVersion(
    baseDocumentId: number,
    file: Express.Multer.File,
    uploadedByUid: number,
  ) {
    if (!file) {
      throw new BadRequestException("File is required");
    }

    const storedName = `${randomUUID()}-${file.originalname}`;

    const { writeFileSync } = await import("fs");
    writeFileSync(join(this.uploadDir, storedName), file.buffer);

    return this.documentsService.createVersionRecord(baseDocumentId, {
      originalName: file.originalname,
      storedName,
      mimeType: file.mimetype,
      fileSize: file.size,
      uploadedByUid,
    });
  }

  async download(documentId: number, performedByUid: number): Promise<StreamableFile> {
    const document = await this.documentsService.ensureExists(documentId);
    const filePath = join(this.uploadDir, document.storedName);

    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found on disk");
    }

    await this.documentsService.logAction(
      documentId,
      DocumentLogAction.DOWNLOAD,
      performedByUid,
    );

    const stream = createReadStream(filePath);
    return new StreamableFile(stream, {
      type: document.mimeType,
      disposition: `attachment; filename="${document.originalName}"`,
    });
  }

  async view(documentId: number, performedByUid: number): Promise<StreamableFile> {
    const document = await this.documentsService.ensureExists(documentId);
    const filePath = join(this.uploadDir, document.storedName);

    if (!existsSync(filePath)) {
      throw new NotFoundException("File not found on disk");
    }

    await this.documentsService.logAction(
      documentId,
      DocumentLogAction.VIEW,
      performedByUid,
    );

    const stream = createReadStream(filePath);
    return new StreamableFile(stream, {
      type: document.mimeType,
      disposition: `inline; filename="${document.originalName}"`,
    });
  }

  async deleteFile(documentId: number, performedByUid: number): Promise<void> {
    const document = await this.documentsService.ensureExists(documentId);
    const filePath = join(this.uploadDir, document.storedName);

    await this.documentsService.remove(documentId, performedByUid);

    if (existsSync(filePath)) {
      const { unlinkSync } = await import("fs");
      unlinkSync(filePath);
    }
  }
}
