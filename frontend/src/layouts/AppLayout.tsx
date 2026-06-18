import { useEffect, useMemo, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'
import { Avatar, Drawer, Dropdown, Layout, Menu, Typography } from 'antd'
import {
  AuditOutlined,
  BarChartOutlined,
  DashboardOutlined,
  ExclamationCircleOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuOutlined,
  TeamOutlined,
  UserOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Button } from '../components/common/Button'
import { useAuth } from '../context/AuthContext'
import { useIsMobile } from '../hooks/useResponsive'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const menuItems = [
  { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
  { key: '/clients', icon: <TeamOutlined />, label: 'Clients' },
  { key: '/engagements', icon: <AuditOutlined />, label: 'Engagements' },
  { key: '/documents', icon: <FileTextOutlined />, label: 'Documents' },
  { key: '/risks', icon: <WarningOutlined />, label: 'Risks' },
  { key: '/tasks', icon: <AuditOutlined />, label: 'Tasks' },
  { key: '/issues', icon: <ExclamationCircleOutlined />, label: 'Issues' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Reports' },
]

export function AppLayout() {
  const { user, logout } = useAuth()
  useScrollToTop()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile('md')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const selectedKey = useMemo(() => {
    const match = menuItems.find((item) => location.pathname.startsWith(item.key))
    return match?.key ?? '/dashboard'
  }, [location.pathname])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location.pathname])

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
      items={menuItems.map((item) => ({
        ...item,
        label: <Link to={item.key}>{item.label}</Link>,
      }))}
      className="!border-e-0 !bg-transparent px-3 [&_.ant-menu-item]:!my-1 [&_.ant-menu-item]:!w-full [&_.ant-menu-item]:!rounded-[10px]"
      onClick={() => setDrawerOpen(false)}
    />
  )

  const brandBlock = (
    <div className="flex items-center gap-3 px-5 pb-4 pt-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-lg font-bold text-white">
        D
      </div>
      <div className="flex min-w-0 flex-col">
        <Text strong className="!text-base !leading-tight !text-white">
          DIAM
        </Text>
        <Text type="secondary" className="!text-[11px] !text-white/55">
          Audit Management
        </Text>
      </div>
    </div>
  )

  return (
    <Layout className="flex h-dvh w-full overflow-hidden">
      {!isMobile && (
        <Sider
          width={240}
          breakpoint="md"
          collapsedWidth={72}
          className="!h-dvh !border-r !border-white/5 !bg-slate-900"
        >
          {brandBlock}
          {navigationMenu}
        </Sider>
      )}

      {isMobile && (
        <Drawer
          title={null}
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          width={280}
          styles={{
            body: { padding: 0, background: '#0f172a' },
            header: { display: 'none' },
          }}
        >
          {brandBlock}
          {navigationMenu}
        </Drawer>
      )}

      <Layout className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header className="!flex !h-14 !items-center !gap-3 !border-b !border-slate-200 !bg-white !px-4 !shadow-sm sm:!h-16 sm:!px-6 lg:!px-7">
          {isMobile && (
            <Button
              type="text"
              aria-label="Open menu"
              icon={<MenuOutlined className="text-lg" />}
              onClick={() => setDrawerOpen(true)}
              className="!flex !h-10 !w-10 !items-center !justify-center"
            />
          )}
          <div className="flex-1" />
          <Dropdown menu={{ items: userMenu }} placement="bottomRight" trigger={['click']}>
            <button
              type="button"
              className="flex max-w-[calc(100vw-5rem)] cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-slate-300 hover:shadow-md sm:gap-3 sm:pr-3.5"
            >
              <Avatar
                size={isMobile ? 32 : 36}
                icon={<UserOutlined />}
                className="!bg-gradient-to-br !from-indigo-600 !to-violet-600"
              />
              <div className="hidden min-w-0 flex-col items-start text-left sm:flex">
                <Text strong className="max-w-[120px] truncate text-sm sm:max-w-none">
                  {user?.name}
                </Text>
                <Text type="secondary" className="!text-[11px] capitalize">
                  {user?.role}
                </Text>
              </div>
            </button>
          </Dropdown>
        </Header>

        <Content className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 sm:p-5 md:p-6 lg:p-7">
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
