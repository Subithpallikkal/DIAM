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
var DocumentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const pagination_util_1 = require("../../common/prisma/pagination.util");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let DocumentsService = DocumentsService_1 = class DocumentsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async findCategories() {
        const cached = this.cache.get(DocumentsService_1.CATEGORY_CACHE_KEY);
        if (cached)
            return cached;
        const categories = await this.prisma.documentCategory.findMany({
            orderBy: { name: "asc" },
        });
        const result = categories.map((category) => ({
            id: category.uid,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
        }));
        this.cache.set(DocumentsService_1.CATEGORY_CACHE_KEY, result, DocumentsService_1.CATEGORY_TTL_MS);
        return result;
    }
    async createCategory(dto) {
        const category = await this.prisma.documentCategory.create({ data: dto });
        this.cache.delete(DocumentsService_1.CATEGORY_CACHE_KEY);
        return {
            id: category.uid,
            name: category.name,
            description: category.description,
            createdAt: category.createdAt,
        };
    }
    async findAll(query, filters) {
        const { page, limit, skip, take } = (0, pagination_util_1.resolvePagination)(query);
        const where = {
            clientUid: filters?.clientId,
            engagementUid: filters?.engagementId,
            categoryUid: filters?.categoryId,
            ...(query.search?.trim()
                ? { originalName: { contains: query.search.trim(), mode: "insensitive" } }
                : {}),
        };
        const [documents, total] = await Promise.all([
            this.prisma.document.findMany({
                where,
                include: {
                    client: true,
                    engagement: true,
                    category: true,
                    uploadedBy: true,
                },
                orderBy: this.buildOrderBy(query),
            }),
            this.prisma.document.count({ where }),
        ]);
        const latestDocuments = this.filterToLatestVersions(documents);
        const versionCounts = await this.getVersionCounts(latestDocuments.map((doc) => this.getRootDocumentId(doc)));
        const paginated = latestDocuments.slice(skip, skip + take);
        return (0, pagination_util_1.buildPaginatedResponse)(paginated.map((doc) => this.toListItem(doc, versionCounts.get(this.getRootDocumentId(doc)) ?? 1)), latestDocuments.length, page, limit);
    }
    buildOrderBy(query) {
        const direction = (0, pagination_util_1.resolveSortDirection)(query);
        switch (query.sortBy) {
            case "originalName":
                return { originalName: direction };
            case "clientName":
                return { client: { name: direction } };
            case "engagementTitle":
                return { engagement: { title: direction } };
            case "categoryName":
                return { category: { name: direction } };
            case "fileSize":
                return { fileSize: direction };
            case "createdAt":
                return { createdAt: direction };
            default:
                return { createdAt: "desc" };
        }
    }
    async findOne(id) {
        const document = await this.prisma.document.findUnique({
            where: { uid: id },
            include: {
                client: true,
                engagement: true,
                category: true,
                uploadedBy: true,
            },
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        return this.toListItem(document, await this.countVersions(this.getRootDocumentId(document)));
    }
    async findVersions(documentId) {
        const document = await this.ensureExists(documentId);
        const rootId = this.getRootDocumentId(document);
        const versions = await this.prisma.document.findMany({
            where: {
                OR: [{ uid: rootId }, { parentDocumentUid: rootId }],
            },
            include: {
                client: true,
                engagement: true,
                category: true,
                uploadedBy: true,
            },
            orderBy: { version: "asc" },
        });
        const versionCount = versions.length;
        return versions.map((item) => this.toListItem(item, versionCount));
    }
    async createRecord(data) {
        await this.ensureClientExists(data.clientId);
        if (data.engagementId) {
            await this.ensureEngagementExists(data.engagementId);
        }
        if (data.categoryId) {
            await this.ensureCategoryExists(data.categoryId);
        }
        const document = await this.prisma.document.create({
            data: {
                clientUid: data.clientId,
                engagementUid: data.engagementId,
                categoryUid: data.categoryId,
                originalName: data.originalName,
                storedName: data.storedName,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                uploadedByUid: data.uploadedByUid,
            },
            include: {
                client: true,
                engagement: true,
                category: true,
                uploadedBy: true,
            },
        });
        await this.logAction(document.uid, enums_dto_1.DocumentLogAction.UPLOAD, data.uploadedByUid);
        return this.toListItem(document, 1);
    }
    async createVersionRecord(baseDocumentId, data) {
        const baseDocument = await this.ensureExists(baseDocumentId);
        const rootId = this.getRootDocumentId(baseDocument);
        const latestVersion = await this.prisma.document.aggregate({
            where: {
                OR: [{ uid: rootId }, { parentDocumentUid: rootId }],
            },
            _max: { version: true },
        });
        const nextVersion = (latestVersion._max.version ?? 0) + 1;
        const document = await this.prisma.document.create({
            data: {
                clientUid: baseDocument.clientUid,
                engagementUid: baseDocument.engagementUid,
                categoryUid: baseDocument.categoryUid,
                parentDocumentUid: rootId,
                version: nextVersion,
                originalName: data.originalName,
                storedName: data.storedName,
                mimeType: data.mimeType,
                fileSize: data.fileSize,
                uploadedByUid: data.uploadedByUid,
            },
            include: {
                client: true,
                engagement: true,
                category: true,
                uploadedBy: true,
            },
        });
        await this.logAction(document.uid, enums_dto_1.DocumentLogAction.UPLOAD, data.uploadedByUid, `Version ${nextVersion} of document ${rootId}`);
        const versionCount = await this.countVersions(rootId);
        return this.toListItem(document, versionCount);
    }
    async logAction(documentId, action, performedByUid, details) {
        await this.ensureExists(documentId);
        await this.prisma.documentLog.create({
            data: {
                documentUid: documentId,
                action,
                performedByUid,
                details,
            },
        });
    }
    async getLogs(documentId) {
        await this.ensureExists(documentId);
        const logs = await this.prisma.documentLog.findMany({
            where: { documentUid: documentId },
            include: { performedBy: true },
            orderBy: { createdAt: "desc" },
        });
        return logs.map((log) => ({
            id: log.uid,
            action: log.action,
            performedByName: log.performedBy.name,
            details: log.details,
            createdAt: log.createdAt,
        }));
    }
    async remove(id, performedByUid) {
        const document = await this.prisma.document.findUnique({
            where: { uid: id },
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        await this.logAction(id, enums_dto_1.DocumentLogAction.DELETE, performedByUid);
        await this.prisma.document.delete({ where: { uid: id } });
        return;
    }
    async ensureExists(id) {
        const document = await this.prisma.document.findUnique({
            where: { uid: id },
        });
        if (!document) {
            throw new common_1.NotFoundException(`Document ${id} not found`);
        }
        return document;
    }
    async ensureClientExists(clientId) {
        const client = await this.prisma.client.findUnique({
            where: { uid: clientId },
        });
        if (!client) {
            throw new common_1.NotFoundException(`Client ${clientId} not found`);
        }
    }
    async ensureEngagementExists(engagementId) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: engagementId },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${engagementId} not found`);
        }
    }
    async ensureCategoryExists(categoryId) {
        const category = await this.prisma.documentCategory.findUnique({
            where: { uid: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException(`Category ${categoryId} not found`);
        }
    }
    getRootDocumentId(document) {
        return document.parentDocumentUid ?? document.uid;
    }
    async countVersions(rootId) {
        return this.prisma.document.count({
            where: {
                OR: [{ uid: rootId }, { parentDocumentUid: rootId }],
            },
        });
    }
    async getVersionCounts(rootIds) {
        const uniqueRootIds = [...new Set(rootIds)];
        const counts = await Promise.all(uniqueRootIds.map(async (rootId) => [rootId, await this.countVersions(rootId)]));
        return new Map(counts);
    }
    filterToLatestVersions(documents) {
        const families = new Map();
        for (const document of documents) {
            const rootId = this.getRootDocumentId(document);
            const family = families.get(rootId) ?? [];
            family.push(document);
            families.set(rootId, family);
        }
        return Array.from(families.values()).map((family) => family.reduce((latest, current) => current.version >= latest.version ? current : latest));
    }
    toListItem(document, versionCount) {
        const rootDocumentId = this.getRootDocumentId(document);
        return {
            id: document.uid,
            clientId: document.clientUid,
            clientName: document.client.name,
            engagementId: document.engagementUid,
            engagementTitle: document.engagement?.title ?? null,
            categoryId: document.categoryUid,
            categoryName: document.category?.name ?? null,
            originalName: document.originalName,
            mimeType: document.mimeType,
            fileSize: document.fileSize,
            uploadedByName: document.uploadedBy.name,
            version: document.version,
            parentDocumentId: document.parentDocumentUid,
            rootDocumentId,
            versionCount,
            createdAt: document.createdAt,
        };
    }
};
exports.DocumentsService = DocumentsService;
DocumentsService.CATEGORY_CACHE_KEY = "documents:categories";
DocumentsService.CATEGORY_TTL_MS = 5 * 60 * 1000;
exports.DocumentsService = DocumentsService = DocumentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], DocumentsService);
//# sourceMappingURL=documents.service.js.map