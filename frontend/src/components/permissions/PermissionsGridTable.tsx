import { Checkbox } from 'antd'
import { UI } from '../../lib/ui'
import { PERMISSION_ACTIONS } from '../../types/permission'
import type { PermissionGroup, PermissionGridState } from '../../types/permission'
import { cn } from '../../utils/cn'

interface PermissionsGridTableProps {
  group: PermissionGroup
  readOnly?: boolean
  value: PermissionGridState
  onChange: (next: PermissionGridState) => void
}

export function PermissionsGridTable({
  group,
  readOnly = false,
  value,
  onChange,
}: PermissionsGridTableProps) {
  const togglePermission = (
    resourceKey: string,
    actionKey: (typeof PERMISSION_ACTIONS)[number]['key'],
    checked: boolean,
  ) => {
    onChange({
      ...value,
      [resourceKey]: {
        ...value[resourceKey],
        [actionKey]: checked,
      },
    })
  }

  return (
    <div className="overflow-hidden rounded border border-border bg-white">
      <div
        className="border-b px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white md:px-4 md:py-2 md:text-sm md:normal-case md:tracking-normal"
        style={{ background: UI.tableHeader, borderColor: UI.sidebarBorder }}
      >
        {group.label}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-160 border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b" style={{ background: UI.tableHeader, borderColor: UI.sidebarBorder }}>
              <th className="w-45 px-3 py-1.5 text-left font-bold text-white md:w-50 md:px-4 md:py-2" />
              {PERMISSION_ACTIONS.map((action) => (
                <th
                  key={action.key}
                  className="px-2 py-1.5 text-center text-[11px] font-bold text-white md:px-3 md:py-2 md:text-xs"
                >
                  {action.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {group.resources.map((resource, index) => (
              <tr
                key={resource.key}
                className={cn(
                  'border-b border-border last:border-b-0',
                  index % 2 === 0 ? 'bg-white' : 'bg-[#f8fafb]',
                )}
              >
                <td className="px-3 py-1.5 font-medium text-[#2c3e50] md:px-4 md:py-2">{resource.label}</td>
                {PERMISSION_ACTIONS.map((action) => (
                  <td key={action.key} className="px-2 py-1.5 text-center md:px-3 md:py-2">
                    <Checkbox
                      checked={value[resource.key]?.[action.key] ?? false}
                      disabled={readOnly}
                      onChange={(event) =>
                        togglePermission(resource.key, action.key, event.target.checked)
                      }
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
