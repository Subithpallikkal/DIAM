import { useCallback, useEffect, useMemo, useState } from 'react'
import { Form, Modal, Select, Upload, message } from 'antd'
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  HistoryOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import {
  deleteDocument,
  downloadDocument,
  fetchDocumentCategories,
  fetchDocumentLogs,
  fetchDocuments,
  uploadDocument,
  viewDocument,
} from '../../api/documents.api'
import { fetchClients } from '../../api/clients.api'
import { Button, FilterBar, PageBody, PageContainer, PageHeader, Table, type ColumnsType } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem } from '../../types/client'
import type { DocumentCategory, DocumentListItem, DocumentLog } from '../../types/document'
import { getApiErrorMessage } from '../../utils/errors'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DocumentsPage() {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [filterClientId, setFilterClientId] = useState<number | undefined>()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)
  const [logs, setLogs] = useState<DocumentLog[]>([])
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchDocuments>[0]) => fetchDocuments(params),
    [],
  )

  const { data: documents, loading, reload, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
    extraParams: { clientId: filterClientId },
  })

  useEffect(() => {
    Promise.all([
      fetchClients({ page: 1, limit: 200 }),
      fetchDocumentCategories(),
    ])
      .then(([clientResponse, categoryList]) => {
        setClients(clientResponse.data)
        setCategories(categoryList)
      })
      .catch(() => message.error('Failed to load filter options'))
  }, [])

  const columns: ColumnsType<DocumentListItem> = useMemo(
    () => [
      { title: 'File Name', dataIndex: 'originalName', key: 'originalName', fixed: 'left', width: 160 },
      { title: 'Client', dataIndex: 'clientName', key: 'clientName', responsive: ['md'] },
      {
        title: 'Engagement',
        dataIndex: 'engagementTitle',
        key: 'engagementTitle',
        responsive: ['lg'],
        render: (value: string | null) => value || '—',
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
        key: 'categoryName',
        responsive: ['xl'],
        render: (value: string | null) => value || '—',
      },
      {
        title: 'Size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        responsive: ['sm'],
        render: (value: number) => formatFileSize(value),
      },
      { title: 'Uploaded By', dataIndex: 'uploadedByName', key: 'uploadedByName', responsive: ['xl'] },
      {
        title: 'Actions',
        key: 'actions',
        width: 140,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex flex-wrap gap-1">
            <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => viewDocument(record.id)} />
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => downloadDocument(record.id, record.originalName)}
            />
            <Button
              type="text"
              size="small"
              icon={<HistoryOutlined />}
              onClick={async () => {
                setLogs(await fetchDocumentLogs(record.id))
                setLogsOpen(true)
              }}
            />
            {canManage && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => {
                  Modal.confirm({
                    title: 'Delete document?',
                    okText: 'Delete',
                    okButtonProps: { danger: true },
                    onOk: async () => {
                      await deleteDocument(record.id)
                      message.success('Document deleted')
                      reload()
                    },
                  })
                }}
              />
            )}
          </div>
        ),
      },
    ],
    [canManage, reload],
  )

  const handleUpload = async () => {
    try {
      const values = await form.validateFields()
      const file = values.file?.fileList?.[0]?.originFileObj as File | undefined
      if (!file) {
        message.error('Please select a file')
        return
      }
      await uploadDocument({
        file,
        clientId: values.clientId,
        engagementId: values.engagementId,
        categoryId: values.categoryId,
      })
      message.success('Document uploaded')
      setUploadOpen(false)
      form.resetFields()
      reload()
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Upload failed'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Documents"
        subtitle="Upload, download, and manage client audit documents"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setUploadOpen(true)} block className="sm:!inline-flex">
            Upload Document
          </Button>
        }
      />

      <FilterBar>
        <Select
          allowClear
          placeholder="Filter by client"
          className="mobile-full-select"
          value={filterClientId}
          onChange={setFilterClientId}
          options={clients.map((client) => ({ label: client.name, value: client.id }))}
        />
      </FilterBar>

      <PageBody>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={documents} pagination={pagination} />
      </PageBody>

      <Modal
        title="Upload Document"
        open={uploadOpen}
        onCancel={() => {
          setUploadOpen(false)
          form.resetFields()
        }}
        onOk={handleUpload}
        okText="Upload"
        width={modalWidth}
        centered
        destroyOnClose
      >
        <Form form={form} layout="vertical" className="mt-2">
          <Form.Item name="clientId" label="Client" rules={[{ required: true }]}>
            <Select
              placeholder="Select client"
              options={clients.map((client) => ({ label: client.name, value: client.id }))}
            />
          </Form.Item>
          <Form.Item name="engagementId" label="Engagement">
            <Select
              allowClear
              placeholder="Optional engagement"
              options={engagements.map((item) => ({
                label: `${item.title} (${item.clientName})`,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="categoryId" label="Category">
            <Select
              allowClear
              placeholder="Optional category"
              options={categories.map((item) => ({ label: item.name, value: item.id }))}
            />
          </Form.Item>
          <Form.Item name="file" label="File" rules={[{ required: true }]} valuePropName="file">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Select file</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      <Modal title="Document Audit Trail" open={logsOpen} onCancel={() => setLogsOpen(false)} footer={null} width={modalWidth} centered>
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className="stack-list-item">
                <strong>{log.action}</strong> by {log.performedByName}
                <div className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </Modal>
    </PageContainer>
  )
}
