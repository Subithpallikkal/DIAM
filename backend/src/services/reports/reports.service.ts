import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  AuditSummaryReportDto,
  DashboardStatsDto,
  FindingsReportDto,
  RiskReportDto,
} from "../../dtos/reports/report.dto";
import { EngagementStatus } from "../../dtos/common/engagement.dto";
import { IssueStatus, Priority, TaskStatus, RiskStatus } from "../../dtos/common/enums.dto";

@Injectable()
export class ReportsService {
  private static readonly DASHBOARD_CACHE_KEY = "dashboard:stats";
  private static readonly DASHBOARD_TTL_MS = 60 * 1000;

  constructor(
    private prisma: PrismaService,
    private cache: CacheService,
  ) {}

  async getDashboardStats(): Promise<DashboardStatsDto> {
    const cached = this.cache.get<DashboardStatsDto>(
      ReportsService.DASHBOARD_CACHE_KEY,
    );
    if (cached) return cached;

    const [
      totalClients,
      totalAudits,
      completedAudits,
      openRisks,
      pendingTasks,
      openIssues,
      resolvedIssues,
    ] = await Promise.all([
      this.prisma.client.count({ where: { isActive: true } }),
      this.prisma.auditEngagement.count(),
      this.prisma.auditEngagement.count({
        where: { status: EngagementStatus.COMPLETED },
      }),
      this.prisma.risk.count({ where: { status: RiskStatus.OPEN } }),
      this.prisma.task.count({
        where: { status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] } },
      }),
      this.prisma.issue.count({
        where: { status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] } },
      }),
      this.prisma.issue.count({
        where: { status: { in: [IssueStatus.RESOLVED, IssueStatus.CLOSED] } },
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

    this.cache.set(
      ReportsService.DASHBOARD_CACHE_KEY,
      stats,
      ReportsService.DASHBOARD_TTL_MS,
    );

    return stats;
  }

  async getAuditSummary(engagementId: number): Promise<AuditSummaryReportDto> {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
      include: { client: true },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }

    const [
      totalRisks,
      openIssues,
      resolvedIssues,
      pendingTasks,
      completedTasks,
      totalDocuments,
    ] = await Promise.all([
      this.prisma.risk.count({ where: { engagementUid: engagementId } }),
      this.prisma.issue.count({
        where: {
          engagementUid: engagementId,
          status: { in: [IssueStatus.OPEN, IssueStatus.IN_PROGRESS] },
        },
      }),
      this.prisma.issue.count({
        where: {
          engagementUid: engagementId,
          status: { in: [IssueStatus.RESOLVED, IssueStatus.CLOSED] },
        },
      }),
      this.prisma.task.count({
        where: {
          engagementUid: engagementId,
          status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
        },
      }),
      this.prisma.task.count({
        where: {
          engagementUid: engagementId,
          status: TaskStatus.COMPLETED,
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

  async getRiskReport(engagementId: number): Promise<RiskReportDto> {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }

    const risks = await this.prisma.risk.findMany({
      where: { engagementUid: engagementId },
      include: { checklists: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      engagementTitle: engagement.title,
      high: risks.filter((risk) => risk.priority === Priority.HIGH).length,
      medium: risks.filter((risk) => risk.priority === Priority.MEDIUM).length,
      low: risks.filter((risk) => risk.priority === Priority.LOW).length,
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

  async getFindingsReport(engagementId: number): Promise<FindingsReportDto> {
    const engagement = await this.prisma.auditEngagement.findUnique({
      where: { uid: engagementId },
    });

    if (!engagement) {
      throw new NotFoundException(`Engagement ${engagementId} not found`);
    }

    const issues = await this.prisma.issue.findMany({
      where: { engagementUid: engagementId },
      include: { findings: true },
      orderBy: { createdAt: "desc" },
    });

    const items = issues.flatMap((issue) =>
      issue.findings.map((finding) => ({
        issueName: issue.title,
        findingTitle: finding.title,
        severity: finding.severity,
        status: issue.status,
      })),
    );

    return {
      engagementTitle: engagement.title,
      items,
    };
  }
}
