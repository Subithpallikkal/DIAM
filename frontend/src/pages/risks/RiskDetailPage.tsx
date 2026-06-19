import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Form, List, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  upsertChecklistItem,
  fetchChecklists,
  fetchRisk,
  upsertRisk,
} from '../../api/risks.api'
import {
  Button,
  Input,
  Loader,
  ModalForm,
  ModalFormField,
  modalFormClassName,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  ResponsiveCard,
  stackListItemClass,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ChecklistItem, RiskListItem } from '../../types/risk'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export function RiskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const riskId = Number(id)

  const [risk, setRisk] = useState<RiskListItem | null>(null)
  const [checklists, setChecklists] = useState<ChecklistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(440)

  const loadData = useCallback(async () => {
    if (!riskId) return
    setLoading(true)
    try {
      const [riskData, checklistData] = await Promise.all([
        fetchRisk(riskId),
        fetchChecklists(riskId),
      ])
      setRisk(riskData)
      setChecklists(checklistData)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load risk'))
      navigate('/risks')
    } finally {
      setLoading(false)
    }
  }, [riskId, navigate])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddChecklist = async () => {
    try {
      const values = await form.validateFields()
      await upsertChecklistItem(riskId, values)
      message.success('Checklist item added')
      setChecklistOpen(false)
      form.resetFields()
      setChecklists(await fetchChecklists(riskId))
      setRisk(await fetchRisk(riskId))
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to add checklist item'))
    }
  }

  const handleToggleChecklist = async (item: ChecklistItem, checked: boolean) => {
    try {
      await upsertChecklistItem(riskId, { id: item.id, isCompleted: checked })
      setChecklists(await fetchChecklists(riskId))
      setRisk(await fetchRisk(riskId))
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update checklist'))
    }
  }

  const handleStatusChange = async (status: string) => {
    if (!risk) return
    try {
      const updated = await upsertRisk(risk.engagementId, {
        id: riskId,
        status: status as RiskListItem['status'],
      })
      setRisk(updated)
      message.success('Risk status updated')
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
    }
  }

  if (loading) return <Loader fullPage />
  if (!risk) return null

  return (
    <PageContainer>
      <PageHeader
        title={risk.title}
        subtitle="Risk details and verification checklist"
        breadcrumbs={[{ title: 'Risks', href: '/risks' }, { title: risk.title }]}
      />

      <PageBody variant="fill" className="gap-3 overflow-y-auto pr-0.5 md:gap-4">
      <ResponsiveCard className="mb-0">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <Text type="secondary">Priority</Text>
            <div className="mt-1">
              <PriorityTag value={risk.priority} />
            </div>
          </div>
          <div>
            <Text type="secondary">Status</Text>
            <div className="mt-1">
              {canManage ? (
                <Select
                  value={risk.status}
                  onChange={handleStatusChange}
                  className="w-full sm:w-48"
                  options={['OPEN', 'MITIGATED', 'CLOSED'].map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              ) : (
                <Text>{risk.status}</Text>
              )}
            </div>
          </div>
          {risk.description && (
            <div className="sm:col-span-2">
              <Text type="secondary">Description</Text>
              <div className="mt-1">{risk.description}</div>
            </div>
          )}
        </div>
      </ResponsiveCard>

      <ResponsiveCard
        title="Checklist"
        extra={
          canManage ? (
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setChecklistOpen(true)}>
              Add Item
            </Button>
          ) : undefined
        }
      >
        <List
          dataSource={checklists}
          locale={{ emptyText: 'No checklist items yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <Checkbox
                checked={item.isCompleted}
                onChange={(e) => handleToggleChecklist(item, e.target.checked)}
              >
                <Text delete={item.isCompleted}>{item.title}</Text>
              </Checkbox>
              {item.assigneeName && (
                <Text type="secondary" className="ml-auto text-xs">
                  Assigned: {item.assigneeName}
                </Text>
              )}
            </List.Item>
          )}
        />
      </ResponsiveCard>
      </PageBody>

      <ModalForm
        open={checklistOpen}
        title="Add Checklist Item"
        subtitle="Risk Checklist"
        onClose={() => {
          setChecklistOpen(false)
          form.resetFields()
        }}
        onSubmit={handleAddChecklist}
        submitText="Add Item"
        width={modalWidth}
      >
        <Form form={form} layout="vertical" requiredMark="optional" className={modalFormClassName}>
          <ModalFormField
            name="title"
            label="Title"
            requiredMark
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Verify cash register" />
          </ModalFormField>
        </Form>
      </ModalForm>
    </PageContainer>
  )
}
