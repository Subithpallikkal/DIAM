import { useCallback, useEffect, useMemo, useState } from 'react'
import { Select, message } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import { fetchRolePermissionGrid, fetchRoles, updateRolePermissionGrid } from '../../api/roles.api'
import { PermissionsGridTable } from '../../components/permissions/PermissionsGridTable'
import { Button, PageBody, PageContainer, PageHeader, RoleTag } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { ROLE_LABELS, canCreateUsers } from '../../lib/roles'
import type { RoleName } from '../../types/auth'
import type { PermissionGrid, PermissionGridState } from '../../types/permission'
import type { RoleDefinition } from '../../types/role'
import { getApiErrorMessage } from '../../utils/errors'

function gridToState(grid: PermissionGrid): PermissionGridState {
  const state: PermissionGridState = {}

  for (const group of grid.groups) {
    for (const resource of group.resources) {
      state[resource.key] = { ...resource.permissions }
    }
  }

  return state
}

export function RolePermissionsPage() {
  const { user } = useAuth()
  const canEdit = canCreateUsers(user?.role)
  const [roles, setRoles] = useState<RoleDefinition[]>([])
  const [selectedRole, setSelectedRole] = useState<RoleName>('MANAGER')
  const [grid, setGrid] = useState<PermissionGrid | null>(null)
  const [draft, setDraft] = useState<PermissionGridState>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const loadGrid = useCallback(async (role: RoleName) => {
    setLoading(true)
    try {
      const response = await fetchRolePermissionGrid(role)
      setGrid(response)
      setDraft(gridToState(response))
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load permissions'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRoles()
      .then((items) => {
        setRoles(items)
        if (items.length > 0 && !items.some((item) => item.name === selectedRole)) {
          setSelectedRole(items[0].name)
        }
      })
      .catch(() => message.error('Failed to load roles'))
  }, [selectedRole])

  useEffect(() => {
    loadGrid(selectedRole)
  }, [loadGrid, selectedRole])

  const roleLabel = ROLE_LABELS[selectedRole].toLowerCase()
  const isAdminRole = selectedRole === 'ADMIN'
  const readOnly = !canEdit || isAdminRole

  const hasChanges = useMemo(() => {
    if (!grid) return false
    return JSON.stringify(draft) !== JSON.stringify(gridToState(grid))
  }, [draft, grid])

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await updateRolePermissionGrid(selectedRole, { permissions: draft })
      setGrid(updated)
      setDraft(gridToState(updated))
      message.success('Permissions updated')
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to save permissions'))
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    if (grid) {
      setDraft(gridToState(grid))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title={`Permissions grid for ${roleLabel}`}
        subtitle={grid?.description ?? 'Configure module access for each role'}
        extra={
          canEdit && !isAdminRole ? (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <Button onClick={handleReset} disabled={!hasChanges || saving || loading} block className="sm:inline-flex!">
                Reset
              </Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSave}
                loading={saving}
                disabled={!hasChanges || loading}
                block
                className="sm:inline-flex!"
              >
                Save permissions
              </Button>
            </div>
          ) : undefined
        }
      />

      <PageBody variant="fill" className="gap-2">
        <div className="flex shrink-0 flex-col gap-2 rounded border border-border bg-white px-3 py-2 md:flex-row md:items-center md:justify-between md:px-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-500 md:text-xs">Role</p>
            <div className="mt-0.5 flex flex-wrap items-center gap-2">
              <Select
                size="small"
                className="min-w-40 md:min-w-45"
                value={selectedRole}
                onChange={setSelectedRole}
                options={roles.map((role) => ({
                  label: ROLE_LABELS[role.name],
                  value: role.name,
                }))}
              />
              <RoleTag role={selectedRole} />
            </div>
          </div>
          {isAdminRole && (
            <p className="text-xs text-slate-500 md:text-sm">
              Admin has full access. This grid is read-only.
            </p>
          )}
          {!canEdit && (
            <p className="text-xs text-slate-500 md:text-sm">You have view-only access to role permissions.</p>
          )}
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center rounded border border-border bg-white text-sm text-slate-500">
            Loading permission grid...
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-0.5 md:space-y-3">
            {grid?.groups.map((group) => (
              <PermissionsGridTable
                key={group.key}
                group={group}
                readOnly={readOnly}
                value={draft}
                onChange={setDraft}
              />
            ))}
          </div>
        )}
      </PageBody>
    </PageContainer>
  )
}
