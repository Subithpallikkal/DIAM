import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Checkbox,
  Descriptions,
  Empty,
  Form,
  List,
  Modal,
  Typography,
  message,
} from 'antd'
import {
  DeleteOutlined,
  FileTextOutlined,
  PlusOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import dayjs from 'dayjs'
import {
  createRequiredDocument,
  createScope,
  deleteScope,
  fetchEngagement,
  fetchRequiredDocuments,
  fetchScopes,
  updateRequiredDocument,
} from '../../api/engagements.api'
import { Button, EngagementStatusTag, Input, Loader, ModalForm, ModalFormField, modalFormClassName, PageBody, PageContainer, PageHeader, ResponsiveCard, responsiveDescriptionsClass, stackListItemClass } from '../../components/common'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type {
  EngagementDetail,
  RequiredDocument,
  ScopeItem,
} from '../../types/engagement'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export function EngagementDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const engagementId = Number(id)

  const [engagement, setEngagement] = useState<EngagementDetail | null>(null)
  const [scopes, setScopes] = useState<ScopeItem[]>([])
  const [documents, setDocuments] = useState<RequiredDocument[]>([])
  const [loading, setLoading] = useState(true)

  const [scopeModalOpen, setScopeModalOpen] = useState(false)
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [scopeForm] = Form.useForm<{ name: string; description?: string }>()
  const [docForm] = Form.useForm<{ documentName: string; isRequired?: boolean }>()
  const modalWidth = useResponsiveModalWidth(520)

  const loadData = useCallback(async () => {
    if (!engagementId) return

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
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load engagement'))
      navigate('/engagements')
    } finally {
      setLoading(false)
    }
  }, [engagementId, navigate])

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
      const scopeData = await fetchScopes(engagementId)
      setScopes(scopeData)
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
      await createRequiredDocument(engagementId, values)
      message.success('Document added to checklist')
      setDocModalOpen(false)
      docForm.resetFields()
      const docData = await fetchRequiredDocuments(engagementId)
      setDocuments(docData)
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to add document'))
    }
  }

  const handleToggleReceived = async (doc: RequiredDocument, checked: boolean) => {
    try {
      const updated = await updateRequiredDocument(engagementId, doc.id, {
        isReceived: checked,
      })
      setDocuments((prev) =>
        prev.map((item) => (item.id === doc.id ? updated : item)),
      )
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update document'))
    }
  }

  if (loading) {
    return <Loader fullPage />
  }

  if (!engagement) return null

  return (
    <PageContainer>
      <PageHeader
        title={engagement.title}
        subtitle={`Engagement for ${engagement.clientName}`}
        breadcrumbs={[
          { title: 'Engagements', href: '/engagements' },
          { title: engagement.title },
        ]}
      />

      <PageBody variant="fill" className="gap-3 overflow-y-auto pr-0.5 md:gap-4">
      <ResponsiveCard>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle" className={responsiveDescriptionsClass}>
          <Descriptions.Item label="Client">
            <Link to={`/clients/${engagement.clientId}`}>{engagement.clientName}</Link>
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <EngagementStatusTag status={engagement.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Audit Type">{engagement.auditType}</Descriptions.Item>
          <Descriptions.Item label="Financial Year">
            {engagement.financialYear || '—'}
          </Descriptions.Item>
          <Descriptions.Item label="Start Date">
            {engagement.startDate
              ? dayjs(engagement.startDate).format('DD MMM YYYY')
              : '—'}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {engagement.endDate ? dayjs(engagement.endDate).format('DD MMM YYYY') : '—'}
          </Descriptions.Item>
          {engagement.description && (
            <Descriptions.Item label="Description" span={2}>
              {engagement.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </ResponsiveCard>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2">
        <ResponsiveCard
          title={
            <span className="inline-flex items-center gap-2">
              <UnorderedListOutlined /> Scope
            </span>
          }
          extra={
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setScopeModalOpen(true)}
            >
              <span className="hidden sm:inline">Add Scope</span>
              <span className="sm:hidden">Add</span>
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
            <Button
              type="primary"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => setDocModalOpen(true)}
            >
              <span className="hidden sm:inline">Add Document</span>
              <span className="sm:hidden">Add</span>
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
      </PageBody>

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
    </PageContainer>
  )
}
