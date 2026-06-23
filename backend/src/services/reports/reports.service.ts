import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma/prisma.service";
import { CacheService } from "../../common/cache/cache.service";
import {
  AuditSummaryReportDto,
  DashboardStatsDto,
  FindingsReportDto,
  MyDashboardStatsDto,
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
      workload,
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

    this.cache.set(
      ReportsService.DASHBOARD_CACHE_KEY,
      stats,
      ReportsService.DASHBOARD_TTL_MS,
    );

    return stats;
  }

  async getMyDashboardStats(userId: number): Promise<MyDashboardStatsDto> {
    const cacheKey = `dashboard:my:${userId}`;
    const cached = this.cache.get<MyDashboardStatsDto>(cacheKey);
    if (cached) return cached;

    const activeTaskStatuses = [TaskStatus.PENDING, TaskStatus.IN_PROGRESS];
    const activeIssueStatuses = [IssueStatus.OPEN, IssueStatus.IN_PROGRESS];

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

    const stats: MyDashboardStatsDto = {
      pendingTasks: myTasks.filter((task) => task.status === TaskStatus.PENDING).length,
      inProgressTasks: myTasks.filter((task) => task.status === TaskStatus.IN_PROGRESS).length,
      openChecklists: myChecklists.length,
      openIssues: myIssues.length,
      myTasks,
      myChecklists,
      myIssues,
    };

    this.cache.set(cacheKey, stats, ReportsService.DASHBOARD_TTL_MS);
    return stats;
  }

  async getWorkloadStats() {
    const [tasks, openChecklists] = await Promise.all([
      this.prisma.task.findMany({
        where: {
          status: { in: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] },
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

    const taskWorkload = new Map<
      number,
      { userId: number; userName: string; pending: number; inProgress: number }
    >();

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

      if (task.status === TaskStatus.PENDING) {
        current.pending += 1;
      } else if (task.status === TaskStatus.IN_PROGRESS) {
        current.inProgress += 1;
      }

      taskWorkload.set(key, current);
    }

    const checklistWorkload = new Map<
      number,
      { userId: number; userName: string; openCount: number }
    >();

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
      tasksByAssignee: Array.from(taskWorkload.values()).sort((a, b) =>
        a.userName.localeCompare(b.userName),
      ),
      openChecklistsByAssignee: Array.from(checklistWorkload.values()).sort((a, b) =>
        a.userName.localeCompare(b.userName),
      ),
    };
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
