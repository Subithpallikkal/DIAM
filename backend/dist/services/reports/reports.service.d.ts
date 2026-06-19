import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import { AuditSummaryReportDto, DashboardStatsDto, FindingsReportDto, RiskReportDto } from "../../dtos/reports/report.dto";
export declare class ReportsService {
    private prisma;
    private cache;
    private static readonly DASHBOARD_CACHE_KEY;
    private static readonly DASHBOARD_TTL_MS;
    constructor(prisma: PrismaService, cache: CacheService);
    getDashboardStats(): Promise<DashboardStatsDto>;
    getWorkloadStats(): Promise<{
        tasksByAssignee: {
            userId: number;
            userName: string;
            pending: number;
            inProgress: number;
        }[];
        openChecklistsByAssignee: {
            userId: number;
            userName: string;
            openCount: number;
        }[];
    }>;
    getAuditSummary(engagementId: number): Promise<AuditSummaryReportDto>;
    getRiskReport(engagementId: number): Promise<RiskReportDto>;
    getFindingsReport(engagementId: number): Promise<FindingsReportDto>;
}
