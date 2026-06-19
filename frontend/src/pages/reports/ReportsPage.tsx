import { useMemo, useState } from 'react'
import {
  AuditOutlined,
  DownloadOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  FileSearchOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { Empty, Select, Skeleton, Tabs, Typography, message } from 'antd'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import {
  exportReport,
  fetchAuditSummary,
  fetchFindingsReport,
  fetchRiskReport,
} from '../../api/reports.api'
import {
  Button,
  EngagementStatusTag,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  ResponsiveCard,
  Table,
} from '../../components/common'
import { cn } from '../../utils/cn'
import type {
  AuditSummaryReport,
  FindingsReport,
  ReportFormat,
  ReportType,
  RiskReport,
} from '../../types/report'
import { getApiErrorMessage } from '../../utils/errors'

const { Text, Title } = Typography

type ReportTab = 'overview' | 'risks' | 'findings'

interface SummaryStatProps {
  label: string
  value: number
  tone?: 'default' | 'success' | 'warning' | 'danger'
  loading?: boolean
}

function SummaryStat({ label, value, tone = 'default', loading }: SummaryStatProps) {
  const toneClass = {
    default: 'bg-slate-50 text-slate-700',
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
  }[tone]

  return (
    <div className={cn('rounded-xl px-4 py-3', toneClass)}>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 48 }} />
      ) : (
        <>
          <div className="text-2xl font-bold leading-tight">{value}</div>
          <div className="mt-0.5 text-xs font-medium opacity-80">{label}</div>
        </>
      )}
    </div>
  )
}

interface ExportButtonsProps {
  reportType: ReportType
  onExport: (type: ReportType, format: ReportFormat) => void
  disabled?: boolean
}

function ExportButtons({ reportType, onExport, disabled }: ExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        size="small"
        icon={<FilePdfOutlined />}
        disabled={disabled}
        onClick={() => onExport(reportType, 'pdf')}
      >
        Export PDF
      </Button>
      <Button
        size="small"
        icon={<FileExcelOutlined />}
        disabled={disabled}
        onClick={() => onExport(reportType, 'excel')}
      >
        Export Excel
      </Button>
    </div>
  )
}

interface TabSectionHeaderProps {
  title: string
  description: string
  reportType: ReportType
  onExport: (type: ReportType, format: ReportFormat) => void
  disabled?: boolean
}

function TabSectionHeader({
  title,
  description,
  reportType,
  onExport,
  disabled,
}: TabSectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        <Title level={5} className="m-0!">
          {title}
        </Title>
        <Text type="secondary" className="mt-1 block text-sm">
          {description}
        </Text>
      </div>
      <ExportButtons reportType={reportType} onExport={onExport} disabled={disabled} />
    </div>
  )
}

export function ReportsPage() {
  const { engagements } = useEngagementOptions()
  const [engagementId, setEngagementId] = useState<number | undefined>()
  const [activeTab, setActiveTab] = useState<ReportTab>('overview')
  const [loading, setLoading] = useState(false)
  const [auditSummary, setAuditSummary] = useState<AuditSummaryReport | null>(null)
  const [riskReport, setRiskReport] = useState<RiskReport | null>(null)
  const [findingsReport, setFindingsReport] = useState<FindingsReport | null>(null)

  const selectedEngagement = useMemo(
    () => engagements.find((item) => item.id === engagementId),
    [engagements, engagementId],
  )

  const loadReports = async (selectedId: number) => {
    setLoading(true)
    try {
      const [summary, risks, findings] = await Promise.all([
        fetchAuditSummary(selectedId),
        fetchRiskReport(selectedId),
        fetchFindingsReport(selectedId),
      ])
      setAuditSummary(summary)
      setRiskReport(risks)
      setFindingsReport(findings)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load reports'))
    } finally {
      setLoading(false)
    }
  }

  const handleEngagementChange = (value: number) => {
    setEngagementId(value)
    setActiveTab('overview')
    loadReports(value)
  }

  const handleRefresh = () => {
    if (engagementId) loadReports(engagementId)
  }

  const handleExport = async (type: ReportType, format: ReportFormat) => {
    if (!engagementId) return
    try {
      await exportReport(type, engagementId, format)
      message.success(`${format === 'pdf' ? 'PDF' : 'Excel'} downloaded`)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Export failed'))
    }
  }

  const handleExportAll = async (format: ReportFormat) => {
    if (!engagementId) return
    const types: ReportType[] = ['audit-summary', 'risk-report', 'findings-report']
    try {
      for (const type of types) {
        await exportReport(type, engagementId, format)
      }
      message.success(`All reports exported as ${format === 'pdf' ? 'PDF' : 'Excel'}`)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Export failed'))
    }
  }

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span className="inline-flex items-center gap-2">
          <AuditOutlined />
          Overview
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 pt-2">
          <TabSectionHeader
            title="Engagement snapshot"
            description="High-level counts for risks, issues, tasks, and documents."
            reportType="audit-summary"
            onExport={handleExport}
            disabled={loading || !auditSummary}
          />
          {auditSummary ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
              <SummaryStat label="Total Risks" value={auditSummary.totalRisks} loading={loading} />
              <SummaryStat
                label="Open Issues"
                value={auditSummary.openIssues}
                tone="danger"
                loading={loading}
              />
              <SummaryStat
                label="Resolved Issues"
                value={auditSummary.resolvedIssues}
                tone="success"
                loading={loading}
              />
              <SummaryStat
                label="Pending Tasks"
                value={auditSummary.pendingTasks}
                tone="warning"
                loading={loading}
              />
              <SummaryStat
                label="Completed Tasks"
                value={auditSummary.completedTasks}
                tone="success"
                loading={loading}
              />
              <SummaryStat label="Documents" value={auditSummary.totalDocuments} loading={loading} />
            </div>
          ) : (
            <Empty description="No overview data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
    {
      key: 'risks',
      label: (
        <span className="inline-flex items-center gap-2">
          <WarningOutlined />
          Risks
          {riskReport && riskReport.items.length > 0 && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {riskReport.items.length}
            </span>
          )}
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 pt-2">
          <TabSectionHeader
            title="Risk register"
            description="Priority breakdown and checklist completion per risk."
            reportType="risk-report"
            onExport={handleExport}
            disabled={loading || !riskReport}
          />
          {riskReport ? (
            <>
              <div className="grid grid-cols-3 gap-3 sm:max-w-md">
                <SummaryStat label="High priority" value={riskReport.high} tone="danger" loading={loading} />
                <SummaryStat label="Medium priority" value={riskReport.medium} tone="warning" loading={loading} />
                <SummaryStat label="Low priority" value={riskReport.low} loading={loading} />
              </div>
              {riskReport.items.length === 0 ? (
                <Empty description="No risks recorded for this engagement" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              ) : (
                <Table
                  rowKey="title"
                  pagination={false}
                  dataSource={riskReport.items}
                  columns={[
                    { title: 'Risk', dataIndex: 'title', width: 200 },
                    {
                      title: 'Priority',
                      dataIndex: 'priority',
                      width: 110,
                      render: (value: string) => <PriorityTag value={value} />,
                    },
                    { title: 'Status', dataIndex: 'status', width: 120 },
                    { title: 'Checklist', dataIndex: 'checklistProgress', width: 110 },
                  ]}
                />
              )}
            </>
          ) : (
            <Empty description="No risk data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
    {
      key: 'findings',
      label: (
        <span className="inline-flex items-center gap-2">
          <SafetyCertificateOutlined />
          Findings
          {findingsReport && findingsReport.items.length > 0 && (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
              {findingsReport.items.length}
            </span>
          )}
        </span>
      ),
      children: (
        <div className="flex flex-col gap-4 pt-2">
          <TabSectionHeader
            title="Issues & findings"
            description="Findings linked to issues with severity and current status."
            reportType="findings-report"
            onExport={handleExport}
            disabled={loading || !findingsReport}
          />
          {findingsReport ? (
            findingsReport.items.length === 0 ? (
              <Empty description="No findings recorded for this engagement" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
              <Table
                rowKey={(record) => `${record.issueName}-${record.findingTitle}`}
                pagination={false}
                dataSource={findingsReport.items}
                columns={[
                  { title: 'Issue', dataIndex: 'issueName', width: 200 },
                  { title: 'Finding', dataIndex: 'findingTitle' },
                  {
                    title: 'Severity',
                    dataIndex: 'severity',
                    width: 110,
                    render: (value: string) => <PriorityTag value={value} />,
                  },
                  { title: 'Status', dataIndex: 'status', width: 120 },
                ]}
              />
            )
          ) : (
            <Empty description="No findings data available" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </div>
      ),
    },
  ]

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        subtitle="Generate engagement reports and export audit deliverables"
      />

      <PageBody className="gap-4">
        <ResponsiveCard bordered={false} className="border border-indigo-100! bg-linear-to-br from-indigo-50/80 to-white shadow-sm!">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-xl text-indigo-600">
                <FileSearchOutlined />
              </div>
              <div className="min-w-0 flex-1">
                <Title level={5} className="m-0!">
                  Choose an engagement
                </Title>
                <Text type="secondary" className="mt-1 block text-sm">
                  Select an audit engagement to preview reports and download PDF or Excel files.
                </Text>
                <Select
                  showSearch
                  placeholder="Search by engagement title or client..."
                  className="mt-3 w-full lg:max-w-xl"
                  value={engagementId}
                  onChange={handleEngagementChange}
                  optionFilterProp="label"
                  options={engagements.map((item) => ({
                    label: `${item.title} — ${item.clientName}`,
                    value: item.id,
                  }))}
                />
              </div>
            </div>

            {engagementId && (
              <div className="flex flex-wrap gap-2">
                <Button icon={<ReloadOutlined />} onClick={handleRefresh} loading={loading}>
                  Refresh
                </Button>
                <Button
                  icon={<FilePdfOutlined />}
                  onClick={() => handleExportAll('pdf')}
                  loading={loading}
                >
                  Export all PDF
                </Button>
                <Button
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={() => handleExportAll('excel')}
                  loading={loading}
                >
                  Export all Excel
                </Button>
              </div>
            )}
          </div>
        </ResponsiveCard>

        {!engagementId ? (
          <ResponsiveCard bordered={false} className="shadow-sm!">
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <div className="space-y-1">
                  <div className="font-medium text-slate-700">No engagement selected</div>
                  <div className="text-sm text-slate-500">
                    Pick an engagement above to view overview, risk, and findings reports.
                  </div>
                </div>
              }
            />
          </ResponsiveCard>
        ) : (
          <>
            <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="truncate font-semibold text-brand-dark">
                  {selectedEngagement?.title ?? auditSummary?.engagementTitle}
                </div>
                <Text type="secondary" className="text-sm">
                  Client: {selectedEngagement?.clientName ?? auditSummary?.clientName}
                </Text>
              </div>
              {selectedEngagement && <EngagementStatusTag status={selectedEngagement.status} />}
            </div>

            <ResponsiveCard bordered={false} className="shadow-sm!" loading={loading}>
              <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as ReportTab)}
                items={tabItems}
                className="[&_.ant-tabs-nav]:mb-0"
              />
            </ResponsiveCard>
          </>
        )}
      </PageBody>
    </PageContainer>
  )
}
