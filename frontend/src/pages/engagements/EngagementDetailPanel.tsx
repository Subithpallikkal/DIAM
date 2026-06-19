import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Checkbox,
  Empty,
  Form,
  List,
  Modal,
  Typography,
  message,
} from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  upsertRequiredDocument,
  createScope,
  deleteScope,
  fetchEngagement,
  fetchRequiredDocuments,
  fetchScopes,
  upsertEngagement,
} from '../../api/engagements.api'
import { fetchClients } from '../../api/clients.api'
import {
  Button,
  DetailFieldList,
  DetailFieldRow,
  EngagementStatusTag,
  Input,
  Loader,
  ModalForm,
  ModalFormField,
  modalFormClassName,
  ResponsiveCard,
  stackListItemClass,
} from '../../components/common'
import { EngagementForm, type EngagementFormValues } from '../../components/forms'
import { useAuth } from '../../context/AuthContext'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import { invalidateEngagementOptionsCache } from '../../hooks/useEngagementOptions'
import type {
  EngagementDetail,
  RequiredDocument,
  ScopeItem,
  UpsertEngagementPayload,
} from '../../types/engagement'
import type { ClientListItem } from '../../types/client'
import { API_MAX_PAGE_SIZE } from '../../types/api'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export interface EngagementDetailPanelProps {
  engagementId: number
  onLoaded?: (engagement: EngagementDetail) => void
  onError?: () => void
  onClientClick?: (clientId: number) => void
}

export function EngagementDetailPanel({
  engagementId,
  onLoaded,
  onError,
  onClientClick,
}: EngagementDetailPanelProps) {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const [engagement, setEngagement] = useState<EngagementDetail | null>(null)
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [scopes, setScopes] = useState<ScopeItem[]>([])
  const [documents, setDocuments] = useState<RequiredDocument[]>([])
  const [loading, setLoading] = useState(true)

  const [scopeModalOpen, setScopeModalOpen] = useState(false)
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [scopeForm] = Form.useForm<{ name: string; description?: string }>()
  const [docForm] = Form.useForm<{ documentName: string; isRequired?: boolean }>()
  const [editForm] = Form.useForm<EngagementFormValues>()
  const modalWidth = useResponsiveModalWidth(440)
  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [engagementData, scopeData, docData] = await Promise.all([
        fetchEngagement(engagementId),
        fetchScopes(engagementId),
        fetchRequiredDocuments(engagementId),
      ])
      setEngagement(engagementData)
      setScopes(scopeData)
      setDocuments(docData)
      onLoadedRef.current?.(engagementData)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load engagement'))
      onErrorRef.current?.()
    } finally {
      setLoading(false)
    }
  }, [engagementId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAddScope = async () => {
    try {
      const values = await scopeForm.validateFields()
      await createScope(engagementId, values)
      message.success('Scope added')
      setScopeModalOpen(false)
      scopeForm.resetFields()
      setScopes(await fetchScopes(engagementId))
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to add scope'))
    }
  }

  const handleDeleteScope = (scope: ScopeItem) => {
    Modal.confirm({
      title: 'Remove scope item?',
      content: `"${scope.name}" will be removed from this engagement.`,
      okText: 'Remove',
      okButtonProps: { danger: true },
      icon: <DeleteOutlined />,
      onOk: async () => {
        try {
          await deleteScope(engagementId, scope.id)
          message.success('Scope removed')
          setScopes((prev) => prev.filter((item) => item.id !== scope.id))
        } catch (err) {
          message.error(getApiErrorMessage(err, 'Failed to remove scope'))
        }
      },
    })
  }

  const handleAddDocument = async () => {
    try {
      const values = await docForm.validateFields()
      await upsertRequiredDocument(engagementId, values)
      message.success('Document added to checklist')
      setDocModalOpen(false)
      docForm.resetFields()
      setDocuments(await fetchRequiredDocuments(engagementId))
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to add document'))
    }
  }

  const handleToggleReceived = async (doc: RequiredDocument, checked: boolean) => {
    try {
      const updated = await upsertRequiredDocument(engagementId, {
        id: doc.id,
        isReceived: checked,
      })
      setDocuments((prev) => prev.map((item) => (item.id === doc.id ? updated : item)))
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update document'))
    }
  }

  const openEditModal = async () => {
    if (!engagement) return
    try {
      const response = await fetchClients({ page: 1, limit: API_MAX_PAGE_SIZE })
      setClients(response.data)
      editForm.setFieldsValue({
        clientId: engagement.clientId,
        title: engagement.title,
        auditType: engagement.auditType,
        financialYear: engagement.financialYear ?? undefined,
        status: engagement.status,
        description: engagement.description ?? undefined,
        startDate: engagement.startDate ? dayjs(engagement.startDate) : undefined,
        endDate: engagement.endDate ? dayjs(engagement.endDate) : undefined,
      })
      setEditOpen(true)
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load clients'))
    }
  }

  const handleEdit = async (values: EngagementFormValues) => {
    if (!engagement) return
    setSaving(true)
    const payload: UpsertEngagementPayload = {
      id: engagementId,
      clientId: values.clientId,
      title: values.title,
      auditType: values.auditType,
      financialYear: values.financialYear,
      status: values.status,
      description: values.description,
      startDate: values.startDate?.format('YYYY-MM-DD'),
      endDate: values.endDate?.format('YYYY-MM-DD'),
    }

    try {
      const updated = await upsertEngagement(payload)
      setEngagement(updated)
      onLoadedRef.current?.(updated)
      invalidateEngagementOptionsCache()
      message.success('Engagement updated')
      setEditOpen(false)
      editForm.resetFields()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update engagement'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (!engagement) return null

  return (
    <>
      <div className="flex flex-col gap-3">
        <ResponsiveCard
          bodyStyle={{ padding: 12 }}
          extra={
            canManage ? (
              <Button type="text" size="small" icon={<EditOutlined />} onClick={openEditModal}>
                Edit
              </Button>
            ) : undefined
          }
        >
          <DetailFieldList>
            <DetailFieldRow label="Client">
              {onClientClick ? (
                <button
                  type="button"
                  className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
                  onClick={() => onClientClick(engagement.clientId)}
                >
                  {engagement.clientName}
                </button>
              ) : (
                engagement.clientName
              )}
            </DetailFieldRow>
            <DetailFieldRow label="Status">
              <EngagementStatusTag status={engagement.status} />
            </DetailFieldRow>
            <DetailFieldRow label="Audit Type">{engagement.auditType}</DetailFieldRow>
            <DetailFieldRow label="Financial Year">
              {engagement.financialYear || '—'}
            </DetailFieldRow>
            <DetailFieldRow label="Start Date">
              {engagement.startDate ? dayjs(engagement.startDate).format('DD MMM YYYY') : '—'}
            </DetailFieldRow>
            <DetailFieldRow label="End Date">
              {engagement.endDate ? dayjs(engagement.endDate).format('DD MMM YYYY') : '—'}
            </DetailFieldRow>
            {engagement.description && (
              <DetailFieldRow label="Description">{engagement.description}</DetailFieldRow>
            )}
          </DetailFieldList>
        </ResponsiveCard>

        <ResponsiveCard
          title={
            <span className="inline-flex items-center gap-2">
              <UnorderedListOutlined /> Scope
            </span>
          }
          extra={
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setScopeModalOpen(true)}>
              Add Scope
            </Button>
          }
        >
          {scopes.length === 0 ? (
            <Empty description="No scope items yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              dataSource={scopes}
              renderItem={(item) => (
                <List.Item
                  className={stackListItemClass}
                  actions={[
                    <Button
                      key="delete"
                      type="text"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeleteScope(item)}
                    />,
                  ]}
                >
                  <List.Item.Meta
                    title={item.name}
                    description={item.description || 'No description'}
                  />
                </List.Item>
              )}
            />
          )}
        </ResponsiveCard>

        <ResponsiveCard
          title={
            <span className="inline-flex items-center gap-2">
              <FileTextOutlined /> Required Documents
            </span>
          }
          extra={
            <Button type="primary" size="small" icon={<PlusOutlined />} onClick={() => setDocModalOpen(true)}>
              Add Document
            </Button>
          }
        >
          {documents.length === 0 ? (
            <Empty description="No documents in checklist" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          ) : (
            <List
              dataSource={documents}
              renderItem={(item) => (
                <List.Item className={stackListItemClass}>
                  <Checkbox
                    checked={item.isReceived}
                    onChange={(e) => handleToggleReceived(item, e.target.checked)}
                  >
                    <Text delete={item.isReceived}>{item.documentName}</Text>
                  </Checkbox>
                  {!item.isRequired && (
                    <Text type="secondary" className="ml-auto text-xs">
                      Optional
                    </Text>
                  )}
                </List.Item>
              )}
            />
          )}
        </ResponsiveCard>
      </div>

      <ModalForm
        open={scopeModalOpen}
        title="Add Scope Item"
        subtitle="Engagement Scope"
        onClose={() => {
          setScopeModalOpen(false)
          scopeForm.resetFields()
        }}
        onSubmit={handleAddScope}
        submitText="Add Scope"
        width={modalWidth}
      >
        <Form form={scopeForm} layout="vertical" requiredMark="optional" className={modalFormClassName}>
          <ModalFormField
            name="name"
            label="Name"
            requiredMark
            rules={[{ required: true, message: 'Scope name is required' }]}
          >
            <Input placeholder="Sales" />
          </ModalFormField>
          <ModalFormField name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Review sales invoices and revenue" />
          </ModalFormField>
        </Form>
      </ModalForm>

      <ModalForm
        open={docModalOpen}
        title="Add Required Document"
        subtitle="Document Requirements"
        onClose={() => {
          setDocModalOpen(false)
          docForm.resetFields()
        }}
        onSubmit={handleAddDocument}
        submitText="Add Document"
        width={modalWidth}
      >
        <Form
          form={docForm}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ isRequired: true }}
          className={modalFormClassName}
        >
          <ModalFormField
            name="documentName"
            label="Document Name"
            requiredMark
            rules={[{ required: true, message: 'Document name is required' }]}
          >
            <Input placeholder="Bank Statement" />
          </ModalFormField>
          <Form.Item name="isRequired" valuePropName="checked">
            <Checkbox>Required document</Checkbox>
          </Form.Item>
        </Form>
      </ModalForm>

      <ModalForm
        open={editOpen}
        title="Edit Engagement"
        subtitle="Engagement Details"
        onClose={() => {
          setEditOpen(false)
          editForm.resetFields()
        }}
        onSubmit={() => editForm.submit()}
        submitText="Save Changes"
        loading={saving}
        width={modalWidth}
      >
        <EngagementForm
          form={editForm}
          clients={clients}
          hideActions
          inModal
          submitLabel="Save Changes"
          onCancel={() => setEditOpen(false)}
          onFinish={handleEdit}
        />
      </ModalForm>
    </>
  )
}
