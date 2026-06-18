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
var ReportsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const cache_service_1 = require("../../common/cache/cache.service");
const engagement_dto_1 = require("../../dtos/common/engagement.dto");
const enums_dto_1 = require("../../dtos/common/enums.dto");
let ReportsService = ReportsService_1 = class ReportsService {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async getDashboardStats() {
        const cached = this.cache.get(ReportsService_1.DASHBOARD_CACHE_KEY);
        if (cached)
            return cached;
        const [totalClients, totalAudits, completedAudits, openRisks, pendingTasks, openIssues, resolvedIssues,] = await Promise.all([
            this.prisma.client.count({ where: { isActive: true } }),
            this.prisma.auditEngagement.count(),
            this.prisma.auditEngagement.count({
                where: { status: engagement_dto_1.EngagementStatus.COMPLETED },
            }),
            this.prisma.risk.count({ where: { status: enums_dto_1.RiskStatus.OPEN } }),
            this.prisma.task.count({
                where: { status: { in: [enums_dto_1.TaskStatus.PENDING, enums_dto_1.TaskStatus.IN_PROGRESS] } },
            }),
            this.prisma.issue.count({
                where: { status: { in: [enums_dto_1.IssueStatus.OPEN, enums_dto_1.IssueStatus.IN_PROGRESS] } },
            }),
            this.prisma.issue.count({
                where: { status: { in: [enums_dto_1.IssueStatus.RESOLVED, enums_dto_1.IssueStatus.CLOSED] } },
            }),
        ]);
        const stats = {
            totalClients,
            totalAudits,
            completedAudits,
            openRisks,
            pendingTasks,
            openIssues,
            resolvedIssues,
        };
        this.cache.set(ReportsService_1.DASHBOARD_CACHE_KEY, stats, ReportsService_1.DASHBOARD_TTL_MS);
        return stats;
    }
    async getAuditSummary(engagementId) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: engagementId },
            include: { client: true },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${engagementId} not found`);
        }
        const [totalRisks, openIssues, resolvedIssues, pendingTasks, completedTasks, totalDocuments,] = await Promise.all([
            this.prisma.risk.count({ where: { engagementUid: engagementId } }),
            this.prisma.issue.count({
                where: {
                    engagementUid: engagementId,
                    status: { in: [enums_dto_1.IssueStatus.OPEN, enums_dto_1.IssueStatus.IN_PROGRESS] },
                },
            }),
            this.prisma.issue.count({
                where: {
                    engagementUid: engagementId,
                    status: { in: [enums_dto_1.IssueStatus.RESOLVED, enums_dto_1.IssueStatus.CLOSED] },
                },
            }),
            this.prisma.task.count({
                where: {
                    engagementUid: engagementId,
                    status: { in: [enums_dto_1.TaskStatus.PENDING, enums_dto_1.TaskStatus.IN_PROGRESS] },
                },
            }),
            this.prisma.task.count({
                where: {
                    engagementUid: engagementId,
                    status: enums_dto_1.TaskStatus.COMPLETED,
                },
            }),
            this.prisma.document.count({ where: { engagementUid: engagementId } }),
        ]);
        return {
            engagementTitle: engagement.title,
            clientName: engagement.client.name,
            totalRisks,
            openIssues,
            resolvedIssues,
            pendingTasks,
            completedTasks,
            totalDocuments,
        };
    }
    async getRiskReport(engagementId) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: engagementId },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${engagementId} not found`);
        }
        const risks = await this.prisma.risk.findMany({
            where: { engagementUid: engagementId },
            include: { checklists: true },
            orderBy: { createdAt: "desc" },
        });
        return {
            engagementTitle: engagement.title,
            high: risks.filter((risk) => risk.priority === enums_dto_1.Priority.HIGH).length,
            medium: risks.filter((risk) => risk.priority === enums_dto_1.Priority.MEDIUM).length,
            low: risks.filter((risk) => risk.priority === enums_dto_1.Priority.LOW).length,
            items: risks.map((risk) => {
                const completed = risk.checklists.filter((item) => item.isCompleted).length;
                const total = risk.checklists.length;
                return {
                    title: risk.title,
                    priority: risk.priority,
                    status: risk.status,
                    checklistProgress: total > 0 ? `${completed}/${total}` : "0/0",
                };
            }),
        };
    }
    async getFindingsReport(engagementId) {
        const engagement = await this.prisma.auditEngagement.findUnique({
            where: { uid: engagementId },
        });
        if (!engagement) {
            throw new common_1.NotFoundException(`Engagement ${engagementId} not found`);
        }
        const issues = await this.prisma.issue.findMany({
            where: { engagementUid: engagementId },
            include: { findings: true },
            orderBy: { createdAt: "desc" },
        });
        const items = issues.flatMap((issue) => issue.findings.map((finding) => ({
            issueName: issue.title,
            findingTitle: finding.title,
            severity: finding.severity,
            status: issue.status,
        })));
        return {
            engagementTitle: engagement.title,
            items,
        };
    }
};
exports.ReportsService = ReportsService;
ReportsService.DASHBOARD_CACHE_KEY = "dashboard:stats";
ReportsService.DASHBOARD_TTL_MS = 60 * 1000;
exports.ReportsService = ReportsService = ReportsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], ReportsService);
//# sourceMappingURL=reports.service.js.map