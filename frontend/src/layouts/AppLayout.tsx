import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
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
  MenuOutlined,
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

const { Header, Sider, Content } = Layout
const { Text } = Typography

const SIDEBAR_COLLAPSED_KEY = 'diam-sidebar-collapsed'

const sidebarMenuClass = cn(
  '!border-e-0 !bg-transparent',
  '[&_.ant-menu-item]:!mx-2 [&_.ant-menu-item]:!mb-0.5 [&_.ant-menu-item]:!h-9 [&_.ant-menu-item]:!w-[calc(100%-16px)] [&_.ant-menu-item]:!rounded-md [&_.ant-menu-item]:!text-white/80',
  '[&_.ant-menu-item:hover]:!bg-white/10 [&_.ant-menu-item:hover]:!text-white',
  '[&_.ant-menu-item-selected]:!bg-[#455a64] [&_.ant-menu-item-selected]:!font-semibold [&_.ant-menu-item-selected]:!text-white',
  '[&_.ant-menu-item-selected]:!border-l-[3px] [&_.ant-menu-item-selected]:!border-[#1abc9c] [&_.ant-menu-item-selected]:!pl-[calc(1rem-3px)]',
  '[&_.ant-menu-item-selected_.ant-menu-item-icon]:!text-[#1abc9c] [&_.ant-menu-item-selected_a]:!text-white',
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

  const navigationMenu = (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      items={visibleMenuItems.map((item) => ({
        ...item,
        label: <Link to={item.key}>{item.label}</Link>,
      }))}
      className={sidebarMenuClass}
      onClick={() => setDrawerOpen(false)}
    />
  )

  const brandBlock = (compact = false) => (
    <div
      className={cn(
        'flex items-center border-b',
        compact ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3',
      )}
      style={{ borderColor: UI.sidebarBorder }}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1abc9c] text-xs font-bold text-white">
        D
      </div>
      {!compact && (
        <div className="flex min-w-0 flex-col overflow-hidden">
          <Text strong className="!truncate !text-sm !leading-tight !text-white">
            DIAM
          </Text>
          <Text className="!truncate !text-[11px] !text-white/60">
            Audit Management
          </Text>
        </div>
      )}
    </div>
  )

  const sidebarFooter = !isMobile && (
    <div className="border-t p-2" style={{ borderColor: UI.sidebarBorder }}>
      <button
        type="button"
        onClick={toggleCollapsed}
        className="flex w-full items-center justify-center rounded-lg py-2.5 text-white/70 transition hover:bg-white/10 hover:text-white"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? <MenuUnfoldOutlined className="text-lg" /> : <MenuFoldOutlined className="text-lg" />}
      </button>
    </div>
  )

  const desktopSidebar = (
    <Sider
      width={220}
      collapsedWidth={68}
      collapsed={collapsed}
      className={cn(
        '!flex !h-dvh !flex-col',
        collapsed && '[&_.ant-menu-item]:!px-0 [&_.ant-menu-item]:!text-center',
      )}
      style={{ background: UI.sidebar, borderRight: `1px solid ${UI.sidebarBorder}` }}
      trigger={null}
    >
      {brandBlock(collapsed)}
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden py-2">
        {navigationMenu}
      </div>
      {sidebarFooter}
    </Sider>
  )

  return (
    <Layout className="flex h-dvh w-full overflow-hidden bg-[#f4f6f9]">
      {!isMobile && desktopSidebar}

      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={260}
          styles={{
            body: { padding: 0, background: UI.sidebar },
            header: { display: 'none' },
          }}
        >
          {brandBlock(false)}
          {navigationMenu}
        </Drawer>
      )}

      <Layout className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header className="!flex !h-12 !items-center !gap-2 !border-b !border-[#e4e8ef] !bg-white !px-3 !shadow-sm md:!px-4">
          {isMobile ? (
            <Button
              type="text"
              aria-label="Open menu"
              icon={<MenuOutlined className="text-lg text-[#34495e]" />}
              onClick={() => setDrawerOpen(true)}
              className="!flex !h-9 !w-9 !items-center !justify-center"
            />
          ) : (
            <Text strong className="hidden shrink-0 text-base text-[#34495e] sm:block">
              DIAM
            </Text>
          )}

          <div className="mx-auto w-full max-w-xl flex-1 px-0 sm:px-4">
            <Input
              allowClear
              prefix={<span className="text-slate-400">⌕</span>}
              placeholder="Search anything..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className={cn(inputFieldClass, '!h-9 !rounded-full !border-[#e4e8ef] !bg-[#f8fafc]')}
            />
          </div>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Button
              type="text"
              icon={<MailOutlined className="text-base text-slate-500" />}
              className="!hidden !h-9 !w-9 sm:!inline-flex"
            />
            <Badge dot offset={[-2, 2]}>
              <Button
                type="text"
                icon={<BellOutlined className="text-base text-slate-500" />}
                className="!h-9 !w-9"
              />
            </Badge>
            <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
              <button
                type="button"
                className="ml-1 flex max-w-[10rem] cursor-pointer items-center gap-2 rounded-full border border-[#e4e8ef] bg-white py-1 pl-1 pr-2 transition hover:border-[#c5d0e0] sm:max-w-none sm:pr-3"
              >
                <Avatar
                  size={32}
                  icon={<UserOutlined />}
                  className="!bg-[#1abc9c]"
                />
                <div className="hidden min-w-0 flex-col items-start text-left sm:flex">
                  <Text strong className="max-w-[100px] truncate text-sm text-slate-800">
                    {user?.name}
                  </Text>
                  <Text className="!text-[11px] capitalize text-slate-500">
                    {user?.role?.toLowerCase()}
                  </Text>
                </div>
              </button>
            </Dropdown>
          </div>
        </Header>

        <Content className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 md:p-3">
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
