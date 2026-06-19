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
import {
  Button,
  ModalForm,
  ModalFormField,
  ModalFormGrid,
  modalFormClassName,
  stackListItemClass,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  applyTableQuery,
  type ColumnsType,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem } from '../../types/client'
import type { DocumentCategory, DocumentListItem, DocumentLog } from '../../types/document'
import { API_MAX_PAGE_SIZE } from '../../types/api'
import { getApiErrorMessage } from '../../utils/errors'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const DOCUMENT_FILTER_PARAM_MAP = {
  clientName: 'clientId',
  categoryName: 'categoryId',
} as const

export function DocumentsPage() {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [categories, setCategories] = useState<DocumentCategory[]>([])
  const [uploadOpen, setUploadOpen] = useState(false)
  const [logsOpen, setLogsOpen] = useState(false)
  const [logs, setLogs] = useState<DocumentLog[]>([])
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchDocuments>[0]) => fetchDocuments(params),
    [],
  )

  const { data: documents, loading, reload, pagination, tableSort, tableFilters, onTableChange } =
    usePaginatedList({
    fetcher,
    initialPageSize: 10,
    filterParamMap: DOCUMENT_FILTER_PARAM_MAP,
  })

  useEffect(() => {
    Promise.all([
      fetchClients({ page: 1, limit: API_MAX_PAGE_SIZE }),
      fetchDocumentCategories(),
    ])
      .then(([clientResponse, categoryList]) => {
        setClients(clientResponse.data)
        setCategories(categoryList)
      })
      .catch(() => message.error('Failed to load filter options'))
  }, [])

  const columns: ColumnsType<DocumentListItem> = useMemo(
    () =>
      applyTableQuery<DocumentListItem>(
        [
      {
        title: 'File Name',
        dataIndex: 'originalName',
        key: 'originalName',
        fixed: 'left',
        width: 160,
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Client',
        dataIndex: 'clientName',
        key: 'clientName',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
        filters: clients.map((client) => ({ text: client.name, value: client.id })),
        filterMultiple: false,
      },
      {
        title: 'Engagement',
        dataIndex: 'engagementTitle',
        key: 'engagementTitle',
        responsive: ['lg'],
        sorter: true,
        showSorterTooltip: true,
        render: (value: string | null) => value || '—',
      },
      {
        title: 'Category',
        dataIndex: 'categoryName',
        key: 'categoryName',
        responsive: ['xl'],
        sorter: true,
        showSorterTooltip: true,
        filters: categories.map((category) => ({ text: category.name, value: category.id })),
        filterMultiple: false,
        render: (value: string | null) => value || '—',
      },
      {
        title: 'Size',
        dataIndex: 'fileSize',
        key: 'fileSize',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        render: (value: number) => formatFileSize(value),
      },
      {
        title: 'Uploaded By',
        dataIndex: 'uploadedByName',
        key: 'uploadedByName',
        responsive: ['xl'],
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 112,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex flex-wrap items-center gap-0.5">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              aria-label="View"
              onClick={() => viewDocument(record.id)}
            />
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              aria-label="Download"
              onClick={() => downloadDocument(record.id, record.originalName)}
            />
            <Button
              type="text"
              size="small"
              icon={<HistoryOutlined />}
              aria-label="History"
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
                aria-label="Delete"
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
        tableSort,
        tableFilters,
      ),
    [canManage, categories, clients, reload, tableSort, tableFilters],
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

      <PageBody variant="fill">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={documents}
          pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      <ModalForm
        open={uploadOpen}
        title="Upload Document"
        subtitle="Document Upload"
        onClose={() => {
          setUploadOpen(false)
          form.resetFields()
        }}
        onSubmit={handleUpload}
        submitText="Upload Document"
        width={modalWidth}
      >
        <Form form={form} layout="vertical" requiredMark="optional" className={modalFormClassName}>
          <ModalFormGrid>
            <ModalFormField name="clientId" label="Client" requiredMark rules={[{ required: true }]}>
              <Select
                className="w-full"
                placeholder="Select client"
                options={clients.map((client) => ({ label: client.name, value: client.id }))}
              />
            </ModalFormField>
            <ModalFormField name="engagementId" label="Engagement">
              <Select
                allowClear
                className="w-full"
                placeholder="Optional engagement"
                options={engagements.map((item) => ({
                  label: `${item.title} (${item.clientName})`,
                  value: item.id,
                }))}
              />
            </ModalFormField>
            <ModalFormField name="categoryId" label="Category">
              <Select
                allowClear
                className="w-full"
                placeholder="Optional category"
                options={categories.map((item) => ({ label: item.name, value: item.id }))}
              />
            </ModalFormField>
            <ModalFormField name="file" label="File" requiredMark rules={[{ required: true }]} valuePropName="file">
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select file</Button>
              </Upload>
            </ModalFormField>
          </ModalFormGrid>
        </Form>
      </ModalForm>

      <ModalForm
        open={logsOpen}
        title="Document Audit Trail"
        subtitle="Activity History"
        onClose={() => setLogsOpen(false)}
        onSubmit={() => setLogsOpen(false)}
        showSubmit={false}
        width={modalWidth}
      >
        {logs.length === 0 ? (
          <p className="text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-2">
            {logs.map((log) => (
              <li key={log.id} className={stackListItemClass}>
                <strong>{log.action}</strong> by {log.performedByName}
                <div className="text-slate-500">{new Date(log.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </ModalForm>
    </PageContainer>
  )
}
