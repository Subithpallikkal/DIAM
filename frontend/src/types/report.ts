export interface DashboardStats {
  totalClients: number
  totalAudits: number
  completedAudits: number
  openRisks: number
  pendingTasks: number
  openIssues: number
  resolvedIssues: number
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
