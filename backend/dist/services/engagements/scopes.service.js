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
exports.ScopesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const engagements_service_1 = require("./engagements.service");
let ScopesService = class ScopesService {
    constructor(prisma, engagementsService) {
        this.prisma = prisma;
        this.engagementsService = engagementsService;
    }
    async create(engagementId, dto) {
        await this.engagementsService.ensureExists(engagementId);
        const scope = await this.prisma.auditScope.create({
            data: {
                engagementUid: engagementId,
                name: dto.name,
                description: dto.description,
            },
        });
        return this.toListItem(scope);
    }
    async findAll(engagementId) {
        await this.engagementsService.ensureExists(engagementId);
        const scopes = await this.prisma.auditScope.findMany({
            where: { engagementUid: engagementId },
            orderBy: { uid: "asc" },
        });
        return scopes.map((scope) => this.toListItem(scope));
    }
    async remove(engagementId, scopeId) {
        await this.engagementsService.ensureExists(engagementId);
        const scope = await this.prisma.auditScope.findFirst({
            where: { uid: scopeId, engagementUid: engagementId },
        });
        if (!scope) {
            throw new common_1.NotFoundException(`Scope ${scopeId} not found for engagement ${engagementId}`);
        }
        await this.prisma.auditScope.delete({ where: { uid: scopeId } });
    }
    toListItem(scope) {
        return {
            id: scope.uid,
            name: scope.name,
            description: scope.description,
            isActive: scope.isActive,
        };
    }
};
exports.ScopesService = ScopesService;
exports.ScopesService = ScopesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        engagements_service_1.EngagementsService])
], ScopesService);
//# sourceMappingURL=scopes.service.js.map