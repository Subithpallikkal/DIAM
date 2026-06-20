import { ApiProperty } from "@nestjs/swagger";

export class TaskWorkloadItemDto {
  @ApiProperty({ example: 3 })
  userId!: number;

  @ApiProperty({ example: "Demo Auditor" })
  userName!: string;

  @ApiProperty({ example: 2 })
  pending!: number;

  @ApiProperty({ example: 1 })
  inProgress!: number;
}

export class ChecklistWorkloadItemDto {
  @ApiProperty({ example: 3 })
  userId!: number;

  @ApiProperty({ example: "Demo Auditor" })
  userName!: string;

  @ApiProperty({ example: 4 })
  openCount!: number;
}

export class WorkloadStatsDto {
  @ApiProperty({ type: [TaskWorkloadItemDto] })
  tasksByAssignee!: TaskWorkloadItemDto[];

  @ApiProperty({ type: [ChecklistWorkloadItemDto] })
  openChecklistsByAssignee!: ChecklistWorkloadItemDto[];
}

export class DashboardStatsDto {
  @ApiProperty({ example: 5 })
  totalClients!: number;

  @ApiProperty({ example: 8 })
  totalAudits!: number;

  @ApiProperty({ example: 2 })
  completedAudits!: number;

  @ApiProperty({ example: 12 })
  openRisks!: number;

  @ApiProperty({ example: 4 })
  pendingTasks!: number;

  @ApiProperty({ example: 5 })
  openIssues!: number;

  @ApiProperty({ example: 7 })
  resolvedIssues!: number;

  @ApiProperty({ type: WorkloadStatsDto })
  workload!: WorkloadStatsDto;
}

export class AuditSummaryReportDto {
  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;

  @ApiProperty({ example: "ABC Pvt Ltd" })
  clientName!: string;

  @ApiProperty({ example: 12 })
  totalRisks!: number;

  @ApiProperty({ example: 5 })
  openIssues!: number;

  @ApiProperty({ example: 7 })
  resolvedIssues!: number;

  @ApiProperty({ example: 3 })
  pendingTasks!: number;

  @ApiProperty({ example: 2 })
  completedTasks!: number;

  @ApiProperty({ example: 10 })
  totalDocuments!: number;
}

export class RiskReportItemDto {
  @ApiProperty({ example: "Revenue recognition cutoff errors" })
  title!: string;

  @ApiProperty({ example: "HIGH" })
  priority!: string;

  @ApiProperty({ example: "OPEN" })
  status!: string;

  @ApiProperty({ example: "1/3" })
  checklistProgress!: string;
}

export class RiskReportDto {
  @ApiProperty({ example: "FY 2025 Internal Audit — Acme" })
  engagementTitle!: string;

  @ApiProperty({ example: 4 })
  high!: number;

  @ApiProperty({ example: 5 })
  medium!: number;

  @ApiProperty({ example: 3 })
  low!: number;

  @ApiProperty({ type: [RiskReportItemDto] })
  items!: RiskReportItemDto[];
}

export class FindingsReportItemDto {
  @ApiProperty({ example: "Unrecorded sales invoices in December" })
  issueName!: string;

  @ApiProperty({ example: "₹12.4L revenue not recorded in ERP" })
  findingTitle!: string;

  @ApiProperty({ example: "HIGH" })
  severity!: string;

  @ApiProperty({ example: "IN_PROGRESS" })
  status!: string;
}

export class FindingsReportDto {
  @ApiProperty({ example: "FY 2025 Internal Audit — Acme" })
  engagementTitle!: string;

  @ApiProperty({ type: [FindingsReportItemDto] })
  items!: FindingsReportItemDto[];
}

export class MyTaskItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Review bank statements" })
  title!: string;

  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;

  @ApiProperty({ example: "PENDING" })
  status!: string;
}

export class MyChecklistItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "Verify GST returns" })
  title!: string;

  @ApiProperty({ example: 3 })
  riskId!: number;

  @ApiProperty({ example: "Tax compliance risk" })
  riskTitle!: string;

  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;
}

export class MyIssueItemDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: "GST filing delayed" })
  title!: string;

  @ApiProperty({ example: "Financial Audit 2026" })
  engagementTitle!: string;

  @ApiProperty({ example: "OPEN" })
  status!: string;

  @ApiProperty({ example: "HIGH" })
  severity!: string;
}

export class MyDashboardStatsDto {
  @ApiProperty({ example: 2 })
  pendingTasks!: number;

  @ApiProperty({ example: 1 })
  inProgressTasks!: number;

  @ApiProperty({ example: 3 })
  openChecklists!: number;

  @ApiProperty({ example: 2 })
  openIssues!: number;

  @ApiProperty({ type: [MyTaskItemDto] })
  myTasks!: MyTaskItemDto[];

  @ApiProperty({ type: [MyChecklistItemDto] })
  myChecklists!: MyChecklistItemDto[];

  @ApiProperty({ type: [MyIssueItemDto] })
  myIssues!: MyIssueItemDto[];
}
