import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Modal, Space, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons'
import { createClient, deactivateClient, fetchClients } from '../../api/clients.api'
import {
  Alert,
  Button,
  ClientStatusTag,
  FilterBar,
  Input,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  type ColumnsType,
} from '../../components/common'
import { ClientForm, type ClientFormValues } from '../../components/forms'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem, CreateClientPayload } from '../../types/client'
import { getApiErrorMessage } from '../../utils/errors'

export function ClientsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<ClientFormValues>()
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createModalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchClients>[0]) => fetchClients(params),
    [],
  )

  const { data: clients, loading, search, setSearch, reload, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  useEffect(() => {
    if (location.state?.openCreate) {
      setCreateOpen(true)
      navigate('/clients', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  const handleCreate = async (values: ClientFormValues) => {
    setCreating(true)
    setCreateError(null)

    try {
      await createClient(values as CreateClientPayload)
      message.success('Client created')
      setCreateOpen(false)
      form.resetFields()
      reload()
    } catch (err) {
      setCreateError(getApiErrorMessage(err, 'Failed to create client'))
    } finally {
      setCreating(false)
    }
  }

  const handleDeactivate = (client: ClientListItem) => {
    Modal.confirm({
      title: 'Deactivate client?',
      content: `"${client.name}" will be marked inactive.`,
      okText: 'Deactivate',
      okButtonProps: { danger: true },
      icon: <DeleteOutlined />,
      onOk: async () => {
        await deactivateClient(client.id)
        message.success('Client deactivated')
        reload()
      },
    })
  }

  const columns: ColumnsType<ClientListItem> = useMemo(
    () => [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 160,
        render: (name: string, record) => (
          <Link to={`/clients/${record.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
            {name}
          </Link>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        responsive: ['md'],
        render: (v: string | null) => v || '—',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        responsive: ['lg'],
        render: (v: string | null) => v || '—',
      },
      {
        title: 'GST',
        dataIndex: 'gstNumber',
        key: 'gstNumber',
        responsive: ['xl'],
        render: (v: string | null) => v || '—',
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        responsive: ['sm'],
        render: (isActive: boolean) => <ClientStatusTag isActive={isActive} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 120,
        fixed: 'right',
        render: (_, record) => (
          <Space wrap size="small">
            <Link to={`/clients/${record.id}`}>
              <Button type="text" size="small" icon={<EyeOutlined />} />
            </Link>
            <Link to={`/clients/${record.id}/edit`}>
              <Button type="text" size="small" icon={<EditOutlined />} />
            </Link>
            {record.isActive && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                onClick={() => handleDeactivate(record)}
              />
            )}
          </Space>
        ),
      },
    ],
    [],
  )

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        subtitle="Manage audit client organizations"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
            Add Client
          </Button>
        }
      />

      <FilterBar>
        <Input
          allowClear
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mobile-full-input"
        />
      </FilterBar>

      <PageBody>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={clients}
          pagination={pagination}
        />
      </PageBody>

      <Modal
        title="Add Client"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          setCreateError(null)
          form.resetFields()
        }}
        footer={null}
        width={createModalWidth}
        centered
        destroyOnClose
        className="[&_.ant-modal-body]:max-h-[calc(100vh-8rem)] [&_.ant-modal-body]:overflow-y-auto"
      >
        {createError && <Alert type="error" message={createError} className="mb-4" />}
        <ClientForm
          form={form}
          mode="create"
          onCancel={() => setCreateOpen(false)}
          onFinish={handleCreate}
          loading={creating}
          hideActions
        />
      </Modal>
    </PageContainer>
  )
}
