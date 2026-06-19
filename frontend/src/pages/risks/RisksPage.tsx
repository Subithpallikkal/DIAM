import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createRisk, fetchRisks, PRIORITY_OPTIONS, RISK_STATUS_OPTIONS } from '../../api/risks.api'
import {
  Button,
  Input,
  ModalForm,
  ModalFormField,
  ModalFormGrid,
  modalFormClassName,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  Table,
  applyTableQuery,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { RiskListItem } from '../../types/risk'
import { getApiErrorMessage } from '../../utils/errors'

export function RisksPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchRisks>[0]) => fetchRisks(params),
    [],
  )

  const { data: risks, loading, pagination, tableSort, tableFilters, onTableChange } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  const columns: ColumnsType<RiskListItem> = useMemo(
    () =>
      applyTableQuery<RiskListItem>(
        [
      {
        title: 'Risk',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 180,
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(PRIORITY_OPTIONS),
        filterMultiple: false,
        render: (value: string) => <PriorityTag value={value} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(RISK_STATUS_OPTIONS),
        filterMultiple: false,
      },
      {
        title: 'Checklist',
        key: 'checklist',
        responsive: ['lg'],
        render: (_, record) => `${record.completedChecklistCount}/${record.checklistCount}`,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Link to={`/risks/${record.id}`}>
            <Button type="text" size="small" icon={<EyeOutlined />} aria-label="View" />
          </Link>
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [tableSort, tableFilters],
  )

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      const risk = await createRisk(values.engagementId, {
        title: values.title,
        description: values.description,
        priority: values.priority,
      })
      message.success('Risk created')
      setCreateOpen(false)
      form.resetFields()
      navigate(`/risks/${risk.id}`)
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to create risk'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Risk Register"
        subtitle="Track audit risks and verification checklists"
        extra={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
              Add Risk
            </Button>
          ) : undefined
        }
      />

      <PageBody variant="fill">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={risks}
          pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      <ModalForm
        open={createOpen}
        title="Add Risk"
        subtitle="Risk Creation"
        onClose={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onSubmit={handleCreate}
        submitText="Create Risk"
        width={modalWidth}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ priority: 'MEDIUM' }}
          className={modalFormClassName}
        >
          <ModalFormGrid>
            <ModalFormField name="engagementId" label="Engagement" requiredMark rules={[{ required: true }]}>
              <Select
                className="w-full"
                placeholder="Select engagement"
                options={engagements.map((item) => ({
                  label: `${item.title} (${item.clientName})`,
                  value: item.id,
                }))}
              />
            </ModalFormField>
            <ModalFormField name="priority" label="Priority">
              <Select
                className="w-full"
                options={PRIORITY_OPTIONS.map((value) => ({ label: value, value }))}
              />
            </ModalFormField>
            <ModalFormField name="title" label="Title" requiredMark rules={[{ required: true }]}>
              <Input placeholder="Cash handling control weak" />
            </ModalFormField>
            <ModalFormField name="description" label="Description" className="ant-form-item-full">
              <Input.TextArea rows={3} />
            </ModalFormField>
          </ModalFormGrid>
        </Form>
      </ModalForm>
    </PageContainer>
  )
}
