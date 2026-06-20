export interface DashboardStats {
  totalClients: number
  totalAudits: number
  completedAudits: number
  openRisks: number
  pendingTasks: number
  openIssues: number
  resolvedIssues: number
  workload: WorkloadStats
}

export interface TaskWorkloadItem {
  userId: number
  userName: string
  pending: number
  inProgress: number
}

export interface ChecklistWorkloadItem {
  userId: number
  userName: string
  openCount: number
}

export interface WorkloadStats {
  tasksByAssignee: TaskWorkloadItem[]
  openChecklistsByAssignee: ChecklistWorkloadItem[]
}

export interface AuditSummaryReport {
  engagementTitle: string
  clientName: string
  totalRisks: number
  openIssues: number
  resolvedIssues: number
  pendingTasks: number
  completedTasks: number
  totalDocuments: number
}

export interface RiskReportItem {
  title: string
  priority: string
  status: string
  checklistProgress: string
}

export interface RiskReport {
  engagementTitle: string
  high: number
  medium: number
  low: number
  items: RiskReportItem[]
}

export interface FindingsReportItem {
  issueName: string
  findingTitle: string
  severity: string
  status: string
}

export interface FindingsReport {
  engagementTitle: string
  items: FindingsReportItem[]
}

export type ReportFormat = 'pdf' | 'excel'

export type ReportType = 'audit-summary' | 'risk-report' | 'findings-report'

export interface MyTaskItem {
  id: number
  title: string
  engagementTitle: string
  status: string
}

export interface MyChecklistItem {
  id: number
  title: string
  riskId: number
  riskTitle: string
  engagementTitle: string
}

export interface MyIssueItem {
  id: number
  title: string
  engagementTitle: string
  status: string
  severity: string
}

export interface MyDashboardStats {
  pendingTasks: number
  inProgressTasks: number
  openChecklists: number
  openIssues: number
  myTasks: MyTaskItem[]
  myChecklists: MyChecklistItem[]
  myIssues: MyIssueItem[]
}
