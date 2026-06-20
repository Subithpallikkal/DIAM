export declare class TaskWorkloadItemDto {
    userId: number;
    userName: string;
    pending: number;
    inProgress: number;
}
export declare class ChecklistWorkloadItemDto {
    userId: number;
    userName: string;
    openCount: number;
}
export declare class WorkloadStatsDto {
    tasksByAssignee: TaskWorkloadItemDto[];
    openChecklistsByAssignee: ChecklistWorkloadItemDto[];
}
export declare class DashboardStatsDto {
    totalClients: number;
    totalAudits: number;
    completedAudits: number;
    openRisks: number;
    pendingTasks: number;
    openIssues: number;
    resolvedIssues: number;
    workload: WorkloadStatsDto;
}
export declare class AuditSummaryReportDto {
    engagementTitle: string;
    clientName: string;
    totalRisks: number;
    openIssues: number;
    resolvedIssues: number;
    pendingTasks: number;
    completedTasks: number;
    totalDocuments: number;
}
export declare class RiskReportItemDto {
    title: string;
    priority: string;
    status: string;
    checklistProgress: string;
}
export declare class RiskReportDto {
    engagementTitle: string;
    high: number;
    medium: number;
    low: number;
    items: RiskReportItemDto[];
}
export declare class FindingsReportItemDto {
    issueName: string;
    findingTitle: string;
    severity: string;
    status: string;
}
export declare class FindingsReportDto {
    engagementTitle: string;
    items: FindingsReportItemDto[];
}
export declare class MyTaskItemDto {
    id: number;
    title: string;
    engagementTitle: string;
    status: string;
}
export declare class MyChecklistItemDto {
    id: number;
    title: string;
    riskId: number;
    riskTitle: string;
    engagementTitle: string;
}
export declare class MyIssueItemDto {
    id: number;
    title: string;
    engagementTitle: string;
    status: string;
    severity: string;
}
export declare class MyDashboardStatsDto {
    pendingTasks: number;
    inProgressTasks: number;
    openChecklists: number;
    openIssues: number;
    myTasks: MyTaskItemDto[];
    myChecklists: MyChecklistItemDto[];
    myIssues: MyIssueItemDto[];
}
