"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredDocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const engagements_service_1 = require("./engagements.service");
let RequiredDocumentsService = class RequiredDocumentsService {
    constructor(prisma, engagementsService) {
        this.prisma = prisma;
        this.engagementsService = engagementsService;
    }
    async create(engagementId, dto) {
        await this.engagementsService.ensureExists(engagementId);
        const document = await this.prisma.engagementDocument.create({
            data: {
                engagementUid: engagementId,
                documentName: dto.documentName,
                isRequired: dto.isRequired ?? true,
            },
        });
        return this.toListItem(document);
    }
    async upsert(engagementId, dto) {
        const { id, documentName, ...data } = dto;
        if (id != null) {
            return this.update(engagementId, id, data);
        }
        if (!documentName?.trim()) {
            throw new common_1.BadRequestException("documentName is required");
        }
        return this.create(engagementId, {
            documentName,
            isRequired: data.isRequired,
        });
    }
    async findAll(engagementId) {
        await this.engagementsService.ensureExists(engagementId);
        const documents = await this.prisma.engagementDocument.findMany({
            where: { engagementUid: engagementId },
            orderBy: { uid: "asc" },
        });
        return documents.map((document) => this.toListItem(document));
    }
    async update(engagementId, docId, dto) {
        await this.engagementsService.ensureExists(engagementId);
        const document = await this.prisma.engagementDocument.findFirst({
            where: { uid: docId, engagementUid: engagementId },
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document ${docId} not found for engagement ${engagementId}`);
        }
        const updated = await this.prisma.engagementDocument.update({
            where: { uid: docId },
            data: dto,
        });
        return this.toListItem(updated);
    }
    toListItem(document) {
        return {
            id: document.uid,
            documentName: document.documentName,
            isRequired: document.isRequired,
            isReceived: document.isReceived,
        };
    }
};
exports.RequiredDocumentsService = RequiredDocumentsService;
exports.RequiredDocumentsService = RequiredDocumentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        engagements_service_1.EngagementsService])
], RequiredDocumentsService);
//# sourceMappingURL=required-documents.service.js.map