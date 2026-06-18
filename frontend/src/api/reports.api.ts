import { api } from './axios'
import type {
  AuditSummaryReport,
  DashboardStats,
  FindingsReport,
  ReportFormat,
  ReportType,
  RiskReport,
} from '../types/report'

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/reports/dashboard')
  return data
}

export async function fetchAuditSummary(engagementId: number): Promise<AuditSummaryReport> {
  const { data } = await api.get<AuditSummaryReport>('/reports/audit-summary', {
    params: { engagementId },
  })
  return data
}

export async function fetchRiskReport(engagementId: number): Promise<RiskReport> {
  const { data } = await api.get<RiskReport>('/reports/risk-report', {
    params: { engagementId },
  })
  return data
}

export async function fetchFindingsReport(engagementId: number): Promise<FindingsReport> {
  const { data } = await api.get<FindingsReport>('/reports/findings-report', {
    params: { engagementId },
  })
  return data
}

export async function exportReport(
  type: ReportType,
  engagementId: number,
  format: ReportFormat,
): Promise<void> {
  const endpoints: Record<ReportType, string> = {
    'audit-summary': '/reports/audit-summary/export',
    'risk-report': '/reports/risk-report/export',
    'findings-report': '/reports/findings-report/export',
  }

  const response = await api.get(endpoints[type], {
    params: { engagementId, format },
    responseType: 'blob',
  })

  const extension = format === 'excel' ? 'xlsx' : 'pdf'
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `${type}.${extension}`)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
