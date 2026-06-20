import { useCallback, useEffect, useRef, useState } from 'react'
import { Checkbox, Form, List, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  upsertChecklistItem,
  assignChecklistItem,
  fetchChecklists,
  fetchRisk,
  upsertRisk,
} from '../../api/risks.api'
import { fetchUsers } from '../../api/users.api'
import {
  Button,
  DetailFieldList,
  DetailFieldRow,
  Input,
  Loader,
  ModalForm,
  ModalFormField,
  modalFormClassName,
  PriorityTag,
  ResponsiveCard,
  selectFieldClass,
  stackListItemClass,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import { cn } from '../../utils/cn'
import type { ChecklistItem, RiskListItem } from '../../types/risk'
import type { UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export interface RiskDetailPanelProps {
  riskId: number
  onLoaded?: (risk: RiskListItem) => void
  onError?: () => void
  onMutated?: () => void
}

export function RiskDetailPanel({ riskId, onLoaded, onError, onMutated }: RiskDetailPanelProps) {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const [risk, setRisk] = useState<RiskListItem | null>(null)
  const [checklists, setChecklists] = useState<ChecklistItem[]>([])
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [checklistOpen, setChecklistOpen] = useState(false)
  const [assignOpen, setAssignOpen] = useState(false)
  const [assigningItem, setAssigningItem] = useState<ChecklistItem | null>(null)
  const [assigneeId, setAssigneeId] = useState<number | undefined>()
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(440)
  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)
  const onMutatedRef = useRef(onMutated)

  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
    onMutatedRef.current = onMutated
  })

  const notifyMutated = useCallback(() => {
    onMutatedRef.current?.()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [riskData, checklistData] = await Promise.all([
        fetchRisk(riskId),
        fetchChecklists(riskId),
      ])
      setRisk(riskData)
      setChecklists(checklistData)
      onLoadedRef.current?.(riskData)
      if (canManage) {
        fetchUsers({ page: 1, limit: 100 })
          .then((response) => setUsers(response.data))
          .catch(() => setUsers([]))
      }
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load risk'))
      onErrorRef.current?.()
    } finally {
      setLoading(false)
    }
  }, [riskId, canManage])

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
      notifyMutated()
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
      notifyMutated()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update checklist'))
    }
  }

  const handleAssignChecklist = async () => {
    if (!assigningItem || !assigneeId) return
    try {
      await assignChecklistItem(riskId, assigningItem.id, assigneeId)
      message.success('Checklist item assigned')
      setAssignOpen(false)
      setAssigningItem(null)
      setAssigneeId(undefined)
      setChecklists(await fetchChecklists(riskId))
      notifyMutated()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to assign checklist item'))
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
      onLoadedRef.current?.(updated)
      message.success('Risk status updated')
      notifyMutated()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (!risk) return null

  return (
    <>
      <div className="flex flex-col gap-3">
        <ResponsiveCard bodyStyle={{ padding: 12 }}>
          <DetailFieldList>
            <DetailFieldRow label="Priority">
              <PriorityTag value={risk.priority} />
            </DetailFieldRow>
            <DetailFieldRow label="Status">
              {canManage ? (
                <Select
                  value={risk.status}
                  onChange={handleStatusChange}
                  className={cn('w-full', selectFieldClass)}
                  options={['OPEN', 'MITIGATED', 'CLOSED'].map((value) => ({
                    label: value,
                    value,
                  }))}
                />
              ) : (
                <Text>{risk.status}</Text>
              )}
            </DetailFieldRow>
            {risk.description && (
              <DetailFieldRow label="Description">{risk.description}</DetailFieldRow>
            )}
          </DetailFieldList>
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
              <List.Item
                className={stackListItemClass}
                actions={
                  canManage
                    ? [
                        <Button
                          key="assign"
                          type="link"
                          size="small"
                          onClick={() => {
                            setAssigningItem(item)
                            setAssignOpen(true)
                          }}
                        >
                          Assign
                        </Button>,
                      ]
                    : undefined
                }
              >
                <Checkbox
                  checked={item.isCompleted}
                  onChange={(e) => handleToggleChecklist(item, e.target.checked)}
                >
                  <Text delete={item.isCompleted}>{item.title}</Text>
                </Checkbox>
                {item.assigneeName && (
                  <Text type="secondary" className="text-xs">
                    {item.assigneeName}
                  </Text>
                )}
              </List.Item>
            )}
          />
        </ResponsiveCard>
      </div>

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

      <ModalForm
        open={assignOpen}
        title="Assign Checklist Item"
        subtitle={assigningItem?.title}
        onClose={() => {
          setAssignOpen(false)
          setAssigningItem(null)
          setAssigneeId(undefined)
        }}
        onSubmit={handleAssignChecklist}
        submitText="Assign"
        width={modalWidth}
      >
        <Select
          placeholder="Select user"
          className={cn('w-full', selectFieldClass)}
          value={assigneeId}
          onChange={setAssigneeId}
          options={users.map((item) => ({ label: item.name, value: item.id }))}
        />
      </ModalForm>
    </>
  )
}
