import { useState } from 'react'
import { Col, Row, Select, Statistic, Typography, message } from 'antd'
import { DownloadOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import {
  exportReport,
  fetchAuditSummary,
  fetchFindingsReport,
  fetchRiskReport,
} from '../../api/reports.api'
import {
  Button,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  ResponsiveCard,
  Table,
} from '../../components/common'
import type {
  AuditSummaryReport,
  FindingsReport,
  ReportFormat,
  ReportType,
  RiskReport,
} from '../../types/report'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export function ReportsPage() {
  const { engagements } = useEngagementOptions()
  const [engagementId, setEngagementId] = useState<number | undefined>()
  const [loading, setLoading] = useState(false)
  const [auditSummary, setAuditSummary] = useState<AuditSummaryReport | null>(null)
  const [riskReport, setRiskReport] = useState<RiskReport | null>(null)
  const [findingsReport, setFindingsReport] = useState<FindingsReport | null>(null)

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
    loadReports(value)
  }

  const handleExport = async (type: ReportType, format: ReportFormat) => {
    if (!engagementId) return
    try {
      await exportReport(type, engagementId, format)
      message.success(`${format.toUpperCase()} exported`)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Export failed'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Reports"
        subtitle="Audit summary, risk analysis, and findings reports"
        extra={
          <Select
            placeholder="Select engagement to generate reports"
            className="w-full sm:max-w-md"
            value={engagementId}
            onChange={handleEngagementChange}
            options={engagements.map((item) => ({
              label: `${item.title} (${item.clientName})`,
              value: item.id,
            }))}
          />
        }
      />

      <PageBody variant="fill" className="gap-3 overflow-y-auto pr-0.5 md:gap-4">
      {!engagementId ? (
        <ResponsiveCard>
          <Text type="secondary">Select an engagement to view and export reports.</Text>
        </ResponsiveCard>
      ) : (
        <>
          <ResponsiveCard
            className="mb-5"
            title="Audit Summary"
            extra={
              <div className="flex flex-wrap gap-2">
                <Button
                  size="small"
                  icon={<FilePdfOutlined />}
                  onClick={() => handleExport('audit-summary', 'pdf')}
                  block
                  className="sm:!inline-flex"
                >
                  PDF
                </Button>
                <Button
                  size="small"
                  icon={<DownloadOutlined />}
                  onClick={() => handleExport('audit-summary', 'excel')}
                  block
                  className="sm:!inline-flex"
                >
                  Excel
                </Button>
              </div>
            }
            loading={loading}
          >
            {auditSummary && (
              <Row gutter={[16, 16]}>
                <Col xs={12} sm={8} md={8}><Statistic title="Total Risks" value={auditSummary.totalRisks} /></Col>
                <Col xs={12} sm={8} md={8}><Statistic title="Open Issues" value={auditSummary.openIssues} /></Col>
                <Col xs={12} sm={8} md={8}><Statistic title="Resolved Issues" value={auditSummary.resolvedIssues} /></Col>
                <Col xs={12} sm={8} md={8}><Statistic title="Pending Tasks" value={auditSummary.pendingTasks} /></Col>
                <Col xs={12} sm={8} md={8}><Statistic title="Completed Tasks" value={auditSummary.completedTasks} /></Col>
                <Col xs={12} sm={8} md={8}><Statistic title="Documents" value={auditSummary.totalDocuments} /></Col>
              </Row>
            )}
          </ResponsiveCard>

          <ResponsiveCard
            className="mb-5"
            title="Risk Report"
            extra={
              <div className="flex flex-wrap gap-2">
                <Button size="small" onClick={() => handleExport('risk-report', 'pdf')} block className="sm:!inline-flex">PDF</Button>
                <Button size="small" onClick={() => handleExport('risk-report', 'excel')} block className="sm:!inline-flex">Excel</Button>
              </div>
            }
            loading={loading}
          >
            {riskReport && (
              <>
                <div className="mb-4 grid grid-cols-3 gap-4 sm:flex sm:flex-wrap">
                  <Statistic title="High" value={riskReport.high} />
                  <Statistic title="Medium" value={riskReport.medium} />
                  <Statistic title="Low" value={riskReport.low} />
                </div>
                <Table
                  rowKey="title"
                  pagination={false}
                  dataSource={riskReport.items}
                  columns={[
                    { title: 'Risk', dataIndex: 'title', fixed: 'left', width: 160 },
                    {
                      title: 'Priority',
                      dataIndex: 'priority',
                      responsive: ['sm'],
                      render: (value: string) => <PriorityTag value={value} />,
                    },
                    { title: 'Status', dataIndex: 'status', responsive: ['md'] },
                    { title: 'Checklist', dataIndex: 'checklistProgress', responsive: ['lg'] },
                  ]}
                />
              </>
            )}
          </ResponsiveCard>

          <ResponsiveCard
            title="Findings Report"
            extra={
              <div className="flex flex-wrap gap-2">
                <Button size="small" onClick={() => handleExport('findings-report', 'pdf')} block className="sm:!inline-flex">PDF</Button>
                <Button size="small" onClick={() => handleExport('findings-report', 'excel')} block className="sm:!inline-flex">Excel</Button>
              </div>
            }
            loading={loading}
          >
            {findingsReport && (
              <Table
                rowKey={(record) => `${record.issueName}-${record.findingTitle}`}
                pagination={false}
                dataSource={findingsReport.items}
                columns={[
                  { title: 'Issue', dataIndex: 'issueName', fixed: 'left', width: 160 },
                  { title: 'Finding', dataIndex: 'findingTitle', responsive: ['md'] },
                  {
                    title: 'Severity',
                    dataIndex: 'severity',
                    responsive: ['sm'],
                    render: (value: string) => <PriorityTag value={value} />,
                  },
                  { title: 'Status', dataIndex: 'status', responsive: ['lg'] },
                ]}
              />
            )}
          </ResponsiveCard>
        </>
      )}
      </PageBody>
    </PageContainer>
  )
}
