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
  @ApiProperty()
  title!: string;

  @ApiProperty()
  priority!: string;

  @ApiProperty()
  status!: string;

  @ApiProperty()
  checklistProgress!: string;
}

export class RiskReportDto {
  @ApiProperty()
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
  @ApiProperty()
  issueName!: string;

  @ApiProperty()
  findingTitle!: string;

  @ApiProperty()
  severity!: string;

  @ApiProperty()
  status!: string;
}

export class FindingsReportDto {
  @ApiProperty()
  engagementTitle!: string;

  @ApiProperty({ type: [FindingsReportItemDto] })
  items!: FindingsReportItemDto[];
}
