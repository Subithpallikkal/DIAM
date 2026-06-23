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
        const [totalClients, totalAudits, completedAudits, openRisks, pendingTasks, openIssues, resolvedIssues, workload,] = await Promise.all([
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
            this.getWorkloadStats(),
        ]);
        const stats = {
            totalClients,
            totalAudits,
            completedAudits,
            openRisks,
            pendingTasks,
            openIssues,
            resolvedIssues,
            workload,
        };
        this.cache.set(ReportsService_1.DASHBOARD_CACHE_KEY, stats, ReportsService_1.DASHBOARD_TTL_MS);
        return stats;
    }
    async getMyDashboardStats(userId) {
        const cacheKey = `dashboard:my:${userId}`;
        const cached = this.cache.get(cacheKey);
        if (cached)
            return cached;
        const activeTaskStatuses = [enums_dto_1.TaskStatus.PENDING, enums_dto_1.TaskStatus.IN_PROGRESS];
        const activeIssueStatuses = [enums_dto_1.IssueStatus.OPEN, enums_dto_1.IssueStatus.IN_PROGRESS];
        const [tasks, checklists, issues] = await Promise.all([
            this.prisma.task.findMany({
                where: {
                    status: { in: activeTaskStatuses },
                    assignments: { some: { assignedToUid: userId } },
                },
                select: {
                    uid: true,
                    title: true,
                    status: true,
                    engagement: { select: { title: true } },
                },
                orderBy: { updatedAt: "desc" },
            }),
            this.prisma.riskChecklist.findMany({
                where: {
                    isCompleted: false,
                    assignments: { some: { assignedToUid: userId } },
                },
                select: {
                    uid: true,
                    title: true,
                    risk: {
                        select: {
                            uid: true,
                            title: true,
                            engagement: { select: { title: true } },
                        },
                    },
                },
                orderBy: { updatedAt: "desc" },
            }),
            this.prisma.issue.findMany({
                where: {
                    status: { in: activeIssueStatuses },
                    assignments: { some: { assignedToUid: userId } },
                },
                select: {
                    uid: true,
                    title: true,
                    status: true,
                    severity: true,
                    engagement: { select: { title: true } },
                },
                orderBy: { updatedAt: "desc" },
            }),
        ]);
        const myTasks = tasks.map((task) => ({
            id: task.uid,
            title: task.title,
            engagementTitle: task.engagement.title,
            status: task.status,
        }));
        const myChecklists = checklists.map((item) => ({
            id: item.uid,
            title: item.title,
            riskId: item.risk.uid,
            riskTitle: item.risk.title,
            engagementTitle: item.risk.engagement.title,
        }));
        const myIssues = issues.map((issue) => ({
            id: issue.uid,
            title: issue.title,
            engagementTitle: issue.engagement.title,
            status: issue.status,
            severity: issue.severity,
        }));
        const stats = {
            pendingTasks: myTasks.filter((task) => task.status === enums_dto_1.TaskStatus.PENDING).length,
            inProgressTasks: myTasks.filter((task) => task.status === enums_dto_1.TaskStatus.IN_PROGRESS).length,
            openChecklists: myChecklists.length,
            openIssues: myIssues.length,
            myTasks,
            myChecklists,
            myIssues,
        };
        this.cache.set(cacheKey, stats, ReportsService_1.DASHBOARD_TTL_MS);
        return stats;
    }
    async getWorkloadStats() {
        const [tasks, openChecklists] = await Promise.all([
            this.prisma.task.findMany({
                where: {
                    status: { in: [enums_dto_1.TaskStatus.PENDING, enums_dto_1.TaskStatus.IN_PROGRESS] },
                },
                include: {
                    assignments: {
                        select: {
                            assignedTo: {
                                select: {
                                    uid: true,
                                    name: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            }),
            this.prisma.riskChecklist.findMany({
                where: { isCompleted: false },
                include: {
                    assignments: {
                        select: {
                            assignedTo: {
                                select: {
                                    uid: true,
                                    name: true,
                                },
                            },
                        },
                        orderBy: { createdAt: "desc" },
                        take: 1,
                    },
                },
            }),
        ]);
        const taskWorkload = new Map();
        for (const task of tasks) {
            const assignee = task.assignments[0]?.assignedTo;
            const key = assignee?.uid ?? 0;
            const userName = assignee?.name ?? "Unassigned";
            const current = taskWorkload.get(key) ?? {
                userId: key,
                userName,
                pending: 0,
                inProgress: 0,
            };
            if (task.status === enums_dto_1.TaskStatus.PENDING) {
                current.pending += 1;
            }
            else if (task.status === enums_dto_1.TaskStatus.IN_PROGRESS) {
                current.inProgress += 1;
            }
            taskWorkload.set(key, current);
        }
        const checklistWorkload = new Map();
        for (const item of openChecklists) {
            const assignee = item.assignments[0]?.assignedTo;
            const key = assignee?.uid ?? 0;
            const userName = assignee?.name ?? "Unassigned";
            const current = checklistWorkload.get(key) ?? {
                userId: key,
                userName,
                openCount: 0,
            };
            current.openCount += 1;
            checklistWorkload.set(key, current);
        }
        return {
            tasksByAssignee: Array.from(taskWorkload.values()).sort((a, b) => a.userName.localeCompare(b.userName)),
            openChecklistsByAssignee: Array.from(checklistWorkload.values()).sort((a, b) => a.userName.localeCompare(b.userName)),
        };
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