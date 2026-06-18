"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStorageService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const crypto_1 = require("crypto");
const documents_service_1 = require("./documents.service");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let DocumentStorageService = class DocumentStorageService {
    constructor(documentsService) {
        this.documentsService = documentsService;
        this.uploadDir = process.env.UPLOAD_DIR ?? (0, path_1.join)(process.cwd(), "uploads");
        if (!(0, fs_1.existsSync)(this.uploadDir)) {
            (0, fs_1.mkdirSync)(this.uploadDir, { recursive: true });
        }
    }
    async upload(file, data) {
        if (!file) {
            throw new common_1.BadRequestException("File is required");
        }
        const storedName = `${(0, crypto_1.randomUUID)()}-${file.originalname}`;
        const { writeFileSync } = await Promise.resolve().then(() => __importStar(require("fs")));
        writeFileSync((0, path_1.join)(this.uploadDir, storedName), file.buffer);
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
    async download(documentId, performedByUid) {
        const document = await this.documentsService.ensureExists(documentId);
        const filePath = (0, path_1.join)(this.uploadDir, document.storedName);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.NotFoundException("File not found on disk");
        }
        await this.documentsService.logAction(documentId, enums_dto_1.DocumentLogAction.DOWNLOAD, performedByUid);
        const stream = (0, fs_1.createReadStream)(filePath);
        return new common_1.StreamableFile(stream, {
            type: document.mimeType,
            disposition: `attachment; filename="${document.originalName}"`,
        });
    }
    async view(documentId, performedByUid) {
        const document = await this.documentsService.ensureExists(documentId);
        const filePath = (0, path_1.join)(this.uploadDir, document.storedName);
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new common_1.NotFoundException("File not found on disk");
        }
        await this.documentsService.logAction(documentId, enums_dto_1.DocumentLogAction.VIEW, performedByUid);
        const stream = (0, fs_1.createReadStream)(filePath);
        return new common_1.StreamableFile(stream, {
            type: document.mimeType,
            disposition: `inline; filename="${document.originalName}"`,
        });
    }
    async deleteFile(documentId, performedByUid) {
        const document = await this.documentsService.ensureExists(documentId);
        const filePath = (0, path_1.join)(this.uploadDir, document.storedName);
        await this.documentsService.remove(documentId, performedByUid);
        if ((0, fs_1.existsSync)(filePath)) {
            const { unlinkSync } = await Promise.resolve().then(() => __importStar(require("fs")));
            unlinkSync(filePath);
        }
    }
};
exports.DocumentStorageService = DocumentStorageService;
exports.DocumentStorageService = DocumentStorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [documents_service_1.DocumentsService])
], DocumentStorageService);
//# sourceMappingURL=document-storage.service.js.map