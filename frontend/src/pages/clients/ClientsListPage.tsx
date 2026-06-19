import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Modal, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  createClient,
  deactivateClient,
  fetchClient,
  fetchClients,
  updateClient,
} from '../../api/clients.api'
import {
  Button,
  ClientStatusTag,
  ModalForm,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  applyTableQuery,
  BOOL_FILTERS,
  type ColumnsType,
} from '../../components/common'
import { ClientForm, type ClientFormValues } from '../../components/forms'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientDetail, ClientListItem, CreateClientPayload, UpdateClientPayload } from '../../types/client'
import { getApiErrorMessage } from '../../utils/errors'

type ClientModalMode = 'create' | 'edit'

export function ClientsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<ClientFormValues>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<ClientModalMode>('create')
  const [editingClientId, setEditingClientId] = useState<number | null>(null)
  const [editingClient, setEditingClient] = useState<ClientDetail | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingClient, setLoadingClient] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const modalWidth = useResponsiveModalWidth(900)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchClients>[0]) => fetchClients(params),
    [],
  )

  const { data: clients, loading, reload, pagination, tableSort, tableFilters, onTableChange } =
    usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setModalError(null)
    setEditingClientId(null)
    setEditingClient(null)
    form.resetFields()
  }, [form])

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setEditingClientId(null)
    setEditingClient(null)
    setModalError(null)
    form.resetFields()
    setModalOpen(true)
  }, [form])

  const openEditModal = useCallback(
    async (clientId: number) => {
      setModalMode('edit')
      setEditingClientId(clientId)
      setModalError(null)
      setModalOpen(true)
      setLoadingClient(true)
      form.resetFields()

      try {
        const client = await fetchClient(clientId)
        setEditingClient(client)
        form.setFieldsValue({
          name: client.name,
          email: client.email ?? undefined,
          phone: client.phone ?? undefined,
          address: client.address ?? undefined,
          gstNumber: client.gstNumber ?? undefined,
          code: client.code ?? undefined,
        })
      } catch (err) {
        message.error(getApiErrorMessage(err, 'Failed to load client'))
        closeModal()
      } finally {
        setLoadingClient(false)
      }
    },
    [closeModal, form],
  )

  useEffect(() => {
    if (location.state?.openCreate) {
      openCreateModal()
      navigate('/clients', { replace: true, state: {} })
      return
    }

    if (location.state?.openEdit) {
      openEditModal(location.state.openEdit as number)
      navigate('/clients', { replace: true, state: {} })
    }
  }, [location.state, navigate, openCreateModal, openEditModal])

  const handleSubmit = async (values: ClientFormValues) => {
    setSubmitting(true)
    setModalError(null)

    try {
      if (modalMode === 'create') {
        await createClient(values as CreateClientPayload)
        message.success('Client created')
      } else if (editingClientId) {
        await updateClient(editingClientId, values as UpdateClientPayload)
        message.success('Client updated')
      }

      closeModal()
      reload()
    } catch (err) {
      setModalError(
        getApiErrorMessage(
          err,
          modalMode === 'create' ? 'Failed to create client' : 'Failed to update client',
        ),
      )
    } finally {
      setSubmitting(false)
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
    () =>
      applyTableQuery<ClientListItem>(
        [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
        width: 160,
        sorter: true,
        showSorterTooltip: true,
        render: (name: string, record) => (
          <Link to={`/clients/${record.id}`} className="font-medium text-[#2D46B9] hover:text-[#243a9a]">
            {name}
          </Link>
        ),
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
        render: (v: string | null) => v || '—',
      },
      {
        title: 'Phone',
        dataIndex: 'phone',
        key: 'phone',
        responsive: ['lg'],
        sorter: true,
        showSorterTooltip: true,
        render: (v: string | null) => v || '—',
      },
      {
        title: 'GST',
        dataIndex: 'gstNumber',
        key: 'gstNumber',
        responsive: ['xl'],
        sorter: true,
        showSorterTooltip: true,
        render: (v: string | null) => v || '—',
      },
      {
        title: 'Status',
        dataIndex: 'isActive',
        key: 'isActive',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: BOOL_FILTERS,
        filterMultiple: false,
        render: (isActive: boolean) => <ClientStatusTag isActive={isActive} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 96,
        fixed: 'right',
        render: (_, record) => (
          <div className="flex items-center gap-0.5">
            <Link to={`/clients/${record.id}`}>
              <Button type="text" size="small" icon={<EyeOutlined />} aria-label="View" />
            </Link>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label="Edit"
              onClick={() => openEditModal(record.id)}
            />
            {record.isActive && (
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined />}
                aria-label="Deactivate"
                onClick={() => handleDeactivate(record)}
              />
            )}
          </div>
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [openEditModal, tableSort, tableFilters],
  )

  const isEdit = modalMode === 'edit'

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        subtitle="Manage audit client organizations"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal} block className="sm:!inline-flex">
            Add Client
          </Button>
        }
      />

      <PageBody variant="fill">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={clients}
          pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      <ModalForm
        open={modalOpen}
        title={isEdit ? 'Update Client Info' : 'Add Client'}
        subtitle={isEdit ? 'Client Update' : 'Client Creation'}
        meta={
          isEdit && editingClient
            ? [
                { label: 'Client ID', value: editingClient.id },
                {
                  label: 'Created Date',
                  value: new Date(editingClient.createdAt).toLocaleDateString(),
                },
              ]
            : undefined
        }
        onClose={closeModal}
        onSubmit={() => form.submit()}
        submitText={isEdit ? 'Update Client' : 'Create Client'}
        loading={submitting}
        submitDisabled={loadingClient}
        error={modalError}
        width={modalWidth}
        loadingContent={loadingClient}
      >
        <ClientForm
          form={form}
          mode={modalMode}
          onCancel={closeModal}
          onFinish={handleSubmit}
          loading={submitting}
          hideActions
          inModal
        />
      </ModalForm>
    </PageContainer>
  )
}
