import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, Modal, message } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import {
  deactivateClient,
  fetchClient,
  fetchClients,
  upsertClient,
} from '../../api/clients.api'
import {
  Button,
  ClientStatusTag,
  DetailDrawer,
  MobileCardBadge,
  MobileListActionButton,
  MobileListCard,
  MobileListRow,
  ModalForm,
  PageBody,
  PageContainer,
  PageHeader,
  PageToolbar,
  ResponsiveDataList,
  TableActions,
  applyTableQuery,
  actionsColumnBase,
  BOOL_FILTERS,
  type ColumnsType,
} from '../../components/common'
import { ClientForm, type ClientFormValues } from '../../components/forms'
import { ClientDetailPanel } from './ClientDetailPanel'
import { useDetailDrawer } from '../../hooks/useDetailDrawer'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientDetail, ClientListItem, UpsertClientPayload } from '../../types/client'
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
  const modalWidth = useResponsiveModalWidth(720)
  const { viewId, openDetail, closeDetail } = useDetailDrawer('/clients')
  const [detailMeta, setDetailMeta] = useState<{ title: string; subtitle?: string } | null>(null)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchClients>[0]) => fetchClients(params),
    [],
  )

  const { data: clients, loading, reload, pagination, search, setSearch, tableSort, tableFilters, onTableChange } =
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
      const payload: UpsertClientPayload = {
        ...values,
        ...(editingClientId ? { id: editingClientId } : {}),
      }
      await upsertClient(payload)
      message.success(editingClientId ? 'Client updated' : 'Client created')

      closeModal()
      if (editingClientId) {
        await reload()
      } else {
        await reload({ page: 1 })
      }
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
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-[#2D46B9] hover:text-[#243a9a] hover:underline"
            onClick={() => openDetail(record.id)}
          >
            {name}
          </button>
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
        ...actionsColumnBase('three'),
        render: (_, record) => (
          <TableActions>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              aria-label="View"
              onClick={() => openDetail(record.id)}
            />
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
          </TableActions>
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [openEditModal, openDetail, tableSort, tableFilters],
  )

  const isEdit = modalMode === 'edit'

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        subtitle="Manage audit client organizations"
      />

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients by name, email, or GST..."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
            Add Client
          </Button>
        }
      />

      <PageBody variant="fill">
        <ResponsiveDataList
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={clients}
          pagination={pagination}
          onChange={onTableChange}
          emptyDescription="No clients found"
          renderMobileCard={(client) => (
            <MobileListCard
              title={client.name}
              badge={
                <MobileCardBadge
                  label={client.isActive ? 'Active' : 'Inactive'}
                  tone={client.isActive ? 'success' : 'danger'}
                />
              }
              actions={
                <>
                  <MobileListActionButton
                    label="View Details"
                    onClick={() => openDetail(client.id)}
                  />
                  <MobileListActionButton
                    label="Edit Profile"
                    variant="outline"
                    onClick={() => openEditModal(client.id)}
                  />
                  {client.isActive && (
                    <MobileListActionButton
                      label="Deactivate"
                      variant="danger"
                      className="col-span-2"
                      onClick={() => handleDeactivate(client)}
                    />
                  )}
                </>
              }
            >
              <MobileListRow icon={<MailOutlined />}>
                {client.email || 'No email provided'}
              </MobileListRow>
              <MobileListRow icon={<PhoneOutlined />}>
                {client.phone || 'No phone provided'}
              </MobileListRow>
            </MobileListCard>
          )}
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

      <DetailDrawer
        open={viewId !== null}
        onClose={() => {
          closeDetail()
          setDetailMeta(null)
        }}
        title={detailMeta?.title}
        subtitle={detailMeta?.subtitle ?? 'Client details'}
        width={520}
      >
        {viewId !== null && (
          <ClientDetailPanel
            clientId={viewId}
            onLoaded={(client) =>
              setDetailMeta({ title: client.name, subtitle: 'Client details' })
            }
            onError={closeDetail}
            onEdit={(clientId) => {
              closeDetail()
              setDetailMeta(null)
              openEditModal(clientId)
            }}
          />
        )}
      </DetailDrawer>
    </PageContainer>
  )
}
