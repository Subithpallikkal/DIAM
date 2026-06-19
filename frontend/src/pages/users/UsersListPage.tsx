import { useCallback, useMemo, useState } from 'react'
import { Form, Modal, message } from 'antd'
import { Link } from 'react-router-dom'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import {
  createUser,
  deactivateUser,
  fetchUser,
  fetchUsers,
  updateUser,
} from '../../api/users.api'
import {
  Button,
  ClientStatusTag,
  ModalForm,
  PageBody,
  PageContainer,
  PageHeader,
  RoleTag,
  Table,
  applyTableQuery,
  BOOL_FILTERS,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { UserForm, type UserFormValues } from '../../components/forms'
import { useAuth } from '../../context/AuthContext'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import { canCreateUsers } from '../../lib/roles'
import type { CreateUserPayload, UpdateUserPayload, UserDetail, UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

type UserModalMode = 'create' | 'edit'

export function UsersListPage() {
  const { user: currentUser } = useAuth()
  const canManage = canCreateUsers(currentUser?.role)
  const [form] = Form.useForm<UserFormValues>()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<UserModalMode>('create')
  const [editingUserId, setEditingUserId] = useState<number | null>(null)
  const [editingUser, setEditingUser] = useState<UserDetail | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingUser, setLoadingUser] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)
  const modalWidth = useResponsiveModalWidth(640)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchUsers>[0]) => fetchUsers(params),
    [],
  )

  const { data: users, loading, reload, pagination, tableSort, tableFilters, onTableChange } =
    usePaginatedList({
      fetcher,
      initialPageSize: 10,
    })

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setModalError(null)
    setEditingUserId(null)
    setEditingUser(null)
    form.resetFields()
  }, [form])

  const openCreateModal = useCallback(() => {
    setModalMode('create')
    setEditingUserId(null)
    setEditingUser(null)
    setModalError(null)
    form.resetFields()
    form.setFieldsValue({ role: 'AUDITOR', isActive: true })
    setModalOpen(true)
  }, [form])

  const openEditModal = useCallback(
    async (userId: number) => {
      setModalMode('edit')
      setEditingUserId(userId)
      setModalError(null)
      setModalOpen(true)
      setLoadingUser(true)
      form.resetFields()

      try {
        const user = await fetchUser(userId)
        setEditingUser(user)
        form.setFieldsValue({
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        })
      } catch (err) {
        message.error(getApiErrorMessage(err, 'Failed to load user'))
        closeModal()
      } finally {
        setLoadingUser(false)
      }
    },
    [closeModal, form],
  )

  const handleSubmit = async (values: UserFormValues) => {
    setSubmitting(true)
    setModalError(null)

    try {
      if (modalMode === 'create') {
        await createUser(values as CreateUserPayload)
        message.success('User created')
      } else if (editingUserId) {
        const payload: UpdateUserPayload = {
          name: values.name,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
        }
        if (values.password?.trim()) {
          payload.password = values.password.trim()
        }
        await updateUser(editingUserId, payload)
        message.success('User updated')
      }

      closeModal()
      reload()
    } catch (err) {
      setModalError(
        getApiErrorMessage(
          err,
          modalMode === 'create' ? 'Failed to create user' : 'Failed to update user',
        ),
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = (user: UserListItem) => {
    Modal.confirm({
      title: 'Deactivate user?',
      content: `"${user.name}" will no longer be able to sign in.`,
      okText: 'Deactivate',
      okButtonProps: { danger: true },
      icon: <DeleteOutlined />,
      onOk: async () => {
        await deactivateUser(user.id)
        message.success('User deactivated')
        reload()
      },
    })
  }

  const columns: ColumnsType<UserListItem> = useMemo(
    () =>
      applyTableQuery<UserListItem>(
        [
          {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 160,
            sorter: true,
            showSorterTooltip: true,
          },
          {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            responsive: ['md'],
            sorter: true,
            showSorterTooltip: true,
          },
          {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            responsive: ['sm'],
            sorter: true,
            showSorterTooltip: true,
            filters: enumFilters(['ADMIN', 'MANAGER', 'AUDITOR']),
            filterMultiple: false,
            render: (role: string) => <RoleTag role={role} />,
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
            title: 'Created',
            dataIndex: 'createdAt',
            key: 'createdAt',
            responsive: ['lg'],
            sorter: true,
            showSorterTooltip: true,
            render: (value: string) => new Date(value).toLocaleDateString(),
          },
          ...(canManage
            ? [
                {
                  title: 'Actions',
                  key: 'actions',
                  width: 96,
                  fixed: 'right' as const,
                  render: (_: unknown, record: UserListItem) => (
                    <div className="flex items-center gap-0.5">
                      <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        aria-label="Edit"
                        onClick={() => openEditModal(record.id)}
                      />
                      {record.isActive && record.id !== currentUser?.uid && (
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
              ]
            : []),
        ],
        tableSort,
        tableFilters,
      ),
    [canManage, currentUser?.uid, openEditModal, tableSort, tableFilters],
  )

  const isEdit = modalMode === 'edit'

  return (
    <PageContainer>
      <PageHeader
        title="Users"
        subtitle="Manage team accounts and access"
        extra={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Link to="/role-permissions">
              <Button icon={<SafetyCertificateOutlined />} block className="sm:!inline-flex">
                Role permissions
              </Button>
            </Link>
            {canManage ? (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={openCreateModal}
                block
                className="sm:!inline-flex"
              >
                Add User
              </Button>
            ) : null}
          </div>
        }
      />

      <PageBody variant="fill">
        <Table
            rowKey="id"
            loading={loading}
            columns={columns}
            dataSource={users}
            pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      {canManage && (
        <ModalForm
          open={modalOpen}
          title={isEdit ? 'Update User' : 'Add User'}
          subtitle={isEdit ? 'User Update' : 'User Creation'}
          meta={
            isEdit && editingUser
              ? [
                  { label: 'User ID', value: editingUser.id },
                  {
                    label: 'Created Date',
                    value: new Date(editingUser.createdAt).toLocaleDateString(),
                  },
                ]
              : undefined
          }
          onClose={closeModal}
          onSubmit={() => form.submit()}
          submitText={isEdit ? 'Update User' : 'Create User'}
          loading={submitting}
          submitDisabled={loadingUser}
          error={modalError}
          width={modalWidth}
          loadingContent={loadingUser}
        >
          <UserForm
            form={form}
            mode={modalMode}
            onCancel={closeModal}
            onFinish={handleSubmit}
            loading={submitting}
            hideActions
            inModal
          />
        </ModalForm>
      )}
    </PageContainer>
  )
}
