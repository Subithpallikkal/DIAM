import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { Avatar, Badge, Drawer, Dropdown, Input, Layout, Menu, Typography } from 'antd'
import {
  AuditOutlined,
  BarChartOutlined,
  BellOutlined,
  DashboardOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MailOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button } from '../components/common/Button'
import { inputFieldClass, UI } from '../lib/ui'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useResponsive'
import { canManageUsers } from '../lib/roles'
import { cn } from '../utils/cn'
import { MobileBottomNav } from './MobileBottomNav'

const { Header, Content } = Layout
const { Text } = Typography

const SIDEBAR_COLLAPSED_KEY = 'diam-sidebar-collapsed'

const sidebarMenuClass = cn(
  'border-e-0! bg-transparent!',
  '[&_.ant-menu-item]:mx-3! [&_.ant-menu-item]:mb-1! [&_.ant-menu-item]:h-10! [&_.ant-menu-item]:w-[calc(100%-24px)]! [&_.ant-menu-item]:cursor-pointer! [&_.ant-menu-item]:rounded-xl! [&_.ant-menu-item]:text-white/75!',
  '[&_.ant-menu-item:hover]:bg-white/10! [&_.ant-menu-item:hover]:text-white!',
  '[&_.ant-menu-item-selected]:bg-white/15! [&_.ant-menu-item-selected]:font-medium! [&_.ant-menu-item-selected]:text-white!',
  '[&_.ant-menu-item-selected_.ant-menu-item-icon]:text-[#2ecc71]!',
)

const collapsedMenuClass = cn(
  'flex flex-col items-center!',
  '[&_.ant-menu-item]:mx-auto! [&_.ant-menu-item]:mb-1! [&_.ant-menu-item]:flex! [&_.ant-menu-item]:h-10! [&_.ant-menu-item]:w-10! [&_.ant-menu-item]:items-center! [&_.ant-menu-item]:justify-center! [&_.ant-menu-item]:px-0!',
  '[&_.ant-menu-item-icon]:m-0! [&_.ant-menu-item-icon]:inline-flex! [&_.ant-menu-item-icon]:items-center! [&_.ant-menu-item-icon]:justify-center! [&_.ant-menu-item-icon]:text-base! [&_.ant-menu-item-icon]:text-white/80!',
  '[&_.ant-menu-item-selected_.ant-menu-item-icon]:text-[#2ecc71]!',
  '[&_.ant-menu-inline-collapsed_.ant-menu-title-content]:hidden!',
)

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Clients' },
  { key: '/engagements', icon: <AuditOutlined />, label: 'Engagements' },
  { key: '/documents', icon: <FileTextOutlined />, label: 'Documents' },
  { key: '/risks', icon: <WarningOutlined />, label: 'Risks' },
  { key: '/tasks', icon: <AuditOutlined />, label: 'Tasks' },
  { key: '/issues', icon: <ExclamationCircleOutlined />, label: 'Issues' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
  { key: '/users', icon: <TeamOutlined />, label: 'Users' },
  { key: '/role-permissions', icon: <SafetyCertificateOutlined />, label: 'Role Permissions' },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  useScrollToTop()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile('md')
  const isCompactShell = useIsMobile('lg')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === 'true'
  })
  const [globalSearch, setGlobalSearch] = useState('')

  const visibleMenuItems = useMemo(
    () =>
      menuItems.filter((item) =>
        item.key === '/users' || item.key === '/role-permissions'
          ? canManageUsers(user?.role)
          : true,
      ),
    [user?.role],
  )

  const selectedKey = useMemo(() => {
    const match = visibleMenuItems.find((item) => location.pathname.startsWith(item.key))
    return match?.key ?? '/dashboard'
  }, [location.pathname, visibleMenuItems])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(next))
      return next
    })
  }

  const userMenu: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sign out',
      danger: true,
      onClick: () => {
        logout()
        navigate('/login')
      },
    },
  ]

  const userHandle = user?.email ? `#${user.email.split('@')[0]}` : undefined

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    setDrawerOpen(false)
    navigate(key)
  }

  const navigationMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={visibleMenuItems}
      className={cn(sidebarMenuClass, collapsed && collapsedMenuClass)}
      inlineCollapsed={collapsed}
      onClick={handleMenuClick}
    />
  )

  const brandBlock = (compact = false) => (
    <div
      className={cn(
        'flex items-center',
        compact ? 'justify-center px-2 py-5' : 'gap-3 px-5 py-5',
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#2ecc71] text-sm font-bold text-white shadow-sm">
        D
      </div>
      {!compact && (
        <div className="flex min-w-0 flex-col overflow-hidden">
          <Text strong className="truncate! text-base! leading-tight! text-white!">
            DIAM
          </Text>
          <Text className="truncate! text-[11px]! text-white/50!">
            Audit Management
          </Text>
        </div>
      )}
    </div>
  )

  const sectionLabel = (label: string) => (
    <Text className="mb-2! block! px-5! text-[10px]! font-semibold! uppercase! tracking-[0.14em]! text-white/35!">
      {label}
    </Text>
  )

  const profileBlock = (compact = false) => (
    <div
      className={cn('border-t py-3', compact ? 'px-2' : 'px-3')}
      style={{ borderColor: UI.sidebarBorder }}
    >
      {!compact && sectionLabel('User Account')}
      <Dropdown menu={{ items: userMenu }} placement="topRight" trigger={['click']}>
        <button
          type="button"
          className={cn(
            'flex w-full cursor-pointer items-center rounded-xl transition hover:bg-white/10',
            compact ? 'justify-center p-2' : 'gap-3 p-2',
          )}
        >
          <Avatar
            size={compact ? 36 : 40}
            icon={<UserOutlined />}
            className="shrink-0! bg-[#2ecc71]!"
          />
          {!compact && (
            <div className="min-w-0 flex-1 text-left">
              <Text strong className="block! truncate! text-sm! text-white!">
                {user?.name}
              </Text>
              <Text className="block! truncate! text-[11px]! text-white/45!">
                {userHandle ?? user?.role?.toLowerCase()}
              </Text>
            </div>
          )}
        </button>
      </Dropdown>

      {!isMobile && (
        <button
          type="button"
          onClick={toggleCollapsed}
          className="mt-2 flex w-full items-center justify-center rounded-xl py-2.5 text-white transition hover:bg-white/15"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <MenuUnfoldOutlined className="text-lg text-white!" />
          ) : (
            <MenuFoldOutlined className="text-lg text-white!" />
          )}
        </button>
      )}
    </div>
  )

  const sidebarContent = (compact = false) => (
    <>
      {brandBlock(compact)}
      {!compact && sectionLabel('Navigation')}
      <div className="sidebar-scroll min-h-0 flex-1 overflow-y-auto overflow-x-hidden pb-2 pr-0.5">
        {navigationMenu}
      </div>
      {profileBlock(compact)}
    </>
  )

  const desktopSidebar = (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col transition-[width] duration-200',
        collapsed ? 'w-19' : 'w-62',
      )}
      style={{ background: UI.sidebar }}
    >
      {sidebarContent(collapsed)}
    </aside>
  )

  return (
    <div
      className={cn(
        'flex h-dvh w-full overflow-hidden',
        isCompactShell ? 'bg-surface' : 'p-2 md:p-3',
      )}
      style={isCompactShell ? undefined : { background: UI.sidebar }}
    >
      <div
        className={cn(
          'flex h-full w-full min-w-0 overflow-hidden',
          !isCompactShell && 'rounded-[28px] md:rounded-[44px]',
        )}
        style={isCompactShell ? undefined : { background: UI.sidebar }}
      >
        {!isMobile && desktopSidebar}

        {isMobile && (
          <Drawer
            title={null}
            placement="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            width={272}
            styles={{
              body: { padding: 0, background: UI.sidebar, display: 'flex', flexDirection: 'column' },
              header: { display: 'none' },
            }}
          >
            <div className="flex h-full flex-col">{sidebarContent(false)}</div>
          </Drawer>
        )}

        <div
          className={cn(
            'flex min-h-0 min-w-0 flex-1 flex-col',
            !isCompactShell && 'p-2 md:p-3 md:pl-2',
          )}
        >
          <div
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-hidden',
              isCompactShell
                ? 'bg-surface'
                : 'rounded-[22px] shadow-[0_4px_24px_rgba(0,0,0,0.12)] md:rounded-[36px]',
            )}
            style={isCompactShell ? undefined : { background: UI.contentSurface }}
          >
            <Layout className="flex! h-full! min-h-0! flex-col! bg-transparent!">
              <Header className="flex! h-14! shrink-0! items-center! gap-2! border-b! border-[#e8ecf0]! bg-transparent! px-3! shadow-none! md:px-5!">
                <div className={cn('w-full flex-1 px-0 sm:px-2', !isMobile && 'mx-auto max-w-xl')}>
                  <Input
                    allowClear
                    prefix={<span className="text-slate-400">⌕</span>}
                    placeholder="Search anything..."
                    value={globalSearch}
                    onChange={(e) => setGlobalSearch(e.target.value)}
                    className={cn(inputFieldClass, 'h-9! rounded-full! border-border! bg-white!')}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                  <Button
                    type="text"
                    icon={<MailOutlined className="text-base text-slate-500" />}
                    className="hidden! h-9! w-9! sm:inline-flex!"
                  />
                  <Badge dot offset={[-2, 2]}>
                    <Button
                      type="text"
                      icon={<BellOutlined className="text-base text-slate-500" />}
                      className="h-9! w-9!"
                    />
                  </Badge>
                </div>
              </Header>

              <Content className="flex! min-h-0! flex-1! flex-col! overflow-hidden! bg-transparent! p-2! md:p-4!">
                <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
                  <Outlet />
                </div>
                {isMobile && <MobileBottomNav onMoreClick={() => setDrawerOpen(true)} />}
              </Content>
            </Layout>
          </div>
        </div>
      </div>
    </div>
  )
}
