import { Link, useLocation } from 'react-router-dom'
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { cn } from '../utils/cn'

const PRIMARY_NAV_ITEMS = [
  { key: '/dashboard', icon: DashboardOutlined, label: 'Home' },
  { key: '/engagements', icon: AuditOutlined, label: 'Audits' },
  { key: '/documents', icon: FileTextOutlined, label: 'Docs' },
  { key: '/issues', icon: ExclamationCircleOutlined, label: 'Issues' },
  { key: '/reports', icon: BarChartOutlined, label: 'Reports' },
] as const

const MORE_ROUTES = [
  '/clients',
  '/risks',
  '/tasks',
  '/users',
  '/role-permissions',
]

interface MobileBottomNavProps {
  onMoreClick: () => void
}

export function MobileBottomNav({ onMoreClick }: MobileBottomNavProps) {
  const location = useLocation()

  const isMoreActive = MORE_ROUTES.some((path) => location.pathname.startsWith(path))

  return (
    <nav
      className="shrink-0 border-t border-[#e8ecf0] bg-white/95 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-md"
      aria-label="Mobile navigation"
    >
      <div className="grid grid-cols-6 gap-0.5">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = location.pathname.startsWith(item.key)
          const Icon = item.icon

          return (
            <Link
              key={item.key}
              to={item.key}
              className={cn(
                'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition',
                active
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
              )}
            >
              <Icon className={cn('text-lg', active && 'text-indigo-600')} />
              <span className="truncate">{item.label}</span>
            </Link>
          )
        })}

        <button
          type="button"
          onClick={onMoreClick}
          className={cn(
            'flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition',
            isMoreActive
              ? 'bg-indigo-50 text-indigo-600'
              : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700',
          )}
        >
          <AppstoreOutlined className={cn('text-lg', isMoreActive && 'text-indigo-600')} />
          <span className="truncate">More</span>
        </button>
      </div>
    </nav>
  )
}
