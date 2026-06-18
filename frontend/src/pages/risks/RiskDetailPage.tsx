import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Form, List, Modal, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  createChecklistItem,
  fetchChecklists,
  fetchRisk,
  updateChecklistItem,
  updateRisk,
} from '../../api/risks.api'
import {
  Button,
  Input,
  Loader,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  ResponsiveCard,
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
  const modalWidth = useResponsiveModalWidth(520)

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
      await createChecklistItem(riskId, values)
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
      await updateChecklistItem(riskId, item.id, { isCompleted: checked })
      setChecklists(await fetchChecklists(riskId))
      setRisk(await fetchRisk(riskId))
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update checklist'))
    }
  }

  const handleStatusChange = async (status: string) => {
    try {
      const updated = await updateRisk(riskId, { status: status as RiskListItem['status'] })
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

      <PageBody className="space-y-4 sm:space-y-5">
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
            <List.Item className="stack-list-item">
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

      <Modal
        title="Add Checklist Item"
        open={checklistOpen}
        onCancel={() => {
          setChecklistOpen(false)
          form.resetFields()
        }}
        onOk={handleAddChecklist}
        okText="Add"
        width={modalWidth}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-2">
          <Form.Item
            name="title"
            label="Title"
            rules={[{ required: true, message: 'Title is required' }]}
          >
            <Input placeholder="Verify cash register" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
