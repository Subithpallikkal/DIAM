import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, Col, Row, Skeleton, Statistic, Typography } from 'antd'
import {
  AuditOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { fetchDashboardStats } from '../../api/reports.api'
import { Button, PageBody, PageContainer, PageHeader } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'

const { Text } = Typography

interface StatCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  iconClassName: string
  loading?: boolean
  link?: string
}

function StatCard({ title, value, icon, iconClassName, loading, link }: StatCardProps) {
  return (
    <Card
      bordered={false}
      className="!rounded-2xl !shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[14px] text-[22px] text-indigo-600',
            iconClassName,
          )}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          {loading ? (
            <Skeleton active paragraph={false} title={{ width: 80 }} />
          ) : (
            <>
              <Text type="secondary" className="mb-1 block text-[13px]">
                {title}
              </Text>
              <Statistic value={value} valueStyle={{ fontSize: 28, fontWeight: 700 }} />
            </>
          )}
        </div>
        {link && (
          <Link
            to={link}
            className="text-base text-slate-400 transition hover:text-indigo-600"
          >
            <ArrowRightOutlined />
          </Link>
        )}
      </div>
    </Card>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClients: 0,
    totalAudits: 0,
    completedAudits: 0,
    openRisks: 0,
    pendingTasks: 0,
    openIssues: 0,
    resolvedIssues: 0,
  })

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => {
        setStats({
          totalClients: 0,
          totalAudits: 0,
          completedAudits: 0,
          openRisks: 0,
          pendingTasks: 0,
          openIssues: 0,
          resolvedIssues: 0,
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageContainer>
      <PageHeader
        title={`Good day, ${user?.name?.split(' ')[0] ?? 'there'}`}
        subtitle="Overview of your audit management workspace"
      />

      <PageBody className="space-y-5">
      <Row gutter={[20, 20]}>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Total Clients"
            value={stats.totalClients}
            icon={<TeamOutlined />}
            iconClassName="bg-indigo-500/10"
            loading={loading}
            link="/clients"
          />
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Total Audits"
            value={stats.totalAudits}
            icon={<AuditOutlined />}
            iconClassName="bg-sky-500/10"
            loading={loading}
            link="/engagements"
          />
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Completed Audits"
            value={stats.completedAudits}
            icon={<CheckCircleOutlined />}
            iconClassName="bg-emerald-500/10"
            loading={loading}
            link="/engagements"
          />
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Open Risks"
            value={stats.openRisks}
            icon={<WarningOutlined />}
            iconClassName="bg-amber-500/10"
            loading={loading}
            link="/risks"
          />
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={<CheckCircleOutlined />}
            iconClassName="bg-violet-500/10"
            loading={loading}
            link="/tasks"
          />
        </Col>
        <Col xs={24} sm={12} xl={8} xxl={6}>
          <StatCard
            title="Open Issues"
            value={stats.openIssues}
            icon={<ExclamationCircleOutlined />}
            iconClassName="bg-rose-500/10"
            loading={loading}
            link="/issues"
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            className="flex flex-wrap items-center justify-between gap-4 !rounded-2xl !shadow-sm"
          >
            <div className="flex items-start gap-4">
              <TeamOutlined className="mt-1 text-[28px] text-indigo-600" />
              <div>
                <Text strong className="mb-1 block text-base">
                  Manage Clients
                </Text>
                <Text type="secondary" className="block text-[13px]">
                  Add new clients and keep contact details up to date.
                </Text>
              </div>
            </div>
            <Link to="/clients" state={{ openCreate: true }} className="w-full sm:w-auto">
              <Button type="primary" icon={<ArrowRightOutlined />} block className="sm:!w-auto">
                Add Client
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            className="flex flex-wrap items-center justify-between gap-4 !rounded-2xl !shadow-sm"
          >
            <div className="flex items-start gap-4">
              <AuditOutlined className="mt-1 text-[28px] text-indigo-600" />
              <div>
                <Text strong className="mb-1 block text-base">
                  Start an Engagement
                </Text>
                <Text type="secondary" className="block text-[13px]">
                  Create a new audit engagement for an existing client.
                </Text>
              </div>
            </div>
            <Link to="/engagements" state={{ openCreate: true }} className="w-full sm:w-auto">
              <Button type="primary" icon={<ArrowRightOutlined />} block className="sm:!w-auto">
                Create Engagement
              </Button>
            </Link>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card
            bordered={false}
            className="flex flex-wrap items-center justify-between gap-4 !rounded-2xl !shadow-sm"
          >
            <div className="flex items-start gap-4">
              <WarningOutlined className="mt-1 text-[28px] text-indigo-600" />
              <div>
                <Text strong className="mb-1 block text-base">
                  View Reports
                </Text>
                <Text type="secondary" className="block text-[13px]">
                  Generate audit summary, risk, and findings reports.
                </Text>
              </div>
            </div>
            <Link to="/reports" className="w-full sm:w-auto">
              <Button type="primary" icon={<ArrowRightOutlined />} block className="sm:!w-auto">
                Open Reports
              </Button>
            </Link>
          </Card>
        </Col>
      </Row>
      </PageBody>
    </PageContainer>
  )
}
