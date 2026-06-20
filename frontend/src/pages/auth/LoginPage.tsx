import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Form, Typography } from 'antd'
import {
  AuditOutlined,
  BarChartOutlined,
  LockOutlined,
  MailOutlined,
  SafetyCertificateOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Input } from '../../components/common'
import { getApiErrorMessage } from '../../utils/errors'
import { cn } from '../../utils/cn'

const { Title, Text } = Typography

interface LoginFormValues {
  email: string
  password: string
}

const FEATURES = [
  { icon: <TeamOutlined />, label: 'Clients' },
  { icon: <AuditOutlined />, label: 'Engagements' },
  { icon: <BarChartOutlined />, label: 'Reports' },
] as const

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm<LoginFormValues>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true)
    setError(null)

    try {
      await login(values)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(getApiErrorMessage(err, 'Invalid email or password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-dvh w-full overflow-y-auto bg-shell">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-shell via-table-header to-[#145454]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-64 w-64 rounded-full bg-brand/10 blur-3xl" />
      </div>

      <div
        className={cn(
          'relative flex min-h-dvh flex-col',
          'px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))]',
          'sm:items-center sm:justify-center sm:px-6 sm:py-10',
          'md:px-8',
        )}
      >
        <div
          className={cn(
            'mb-5 flex flex-1 flex-col items-center justify-center text-center sm:mb-8 sm:flex-none',
            'md:mb-10',
          )}
        >
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl text-brand backdrop-blur-sm sm:h-16 sm:w-16 sm:text-3xl">
            <SafetyCertificateOutlined />
          </div>
          <Title level={2} className="mb-2! text-2xl! text-white! sm:text-3xl!">
            DIAM
          </Title>
          <Text className="max-w-xs text-sm text-white! sm:max-w-sm sm:text-base">
            Digital Internal Audit Management
          </Text>

          <div className="mt-6 hidden flex-wrap justify-center gap-2 sm:flex">
            {FEATURES.map(({ icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs text-white/80 backdrop-blur-sm"
              >
                {icon}
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="w-full sm:max-w-105 md:max-w-110">
          <div className="overflow-hidden rounded-t-3xl bg-white shadow-2xl ring-1 ring-white/20 sm:rounded-3xl">
            <div className="border-b border-border/60 bg-linear-to-r from-table-header to-brand px-5 py-5 sm:px-6 sm:py-6">
              <Title level={4} className="mb-1! text-lg! text-white! sm:text-xl!">
                Sign in to your account
              </Title>
              <Text className="text-sm text-white/75">
                Use your work credentials to access the platform
              </Text>
            </div>

            <div className="px-5 py-6 sm:px-6 sm:py-7">
              {error && (
                <Alert
                  type="error"
                  message={error}
                  closable
                  className="mb-4"
                  onClose={() => setError(null)}
                />
              )}

              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
                initialValues={{ email: 'admin@gmail.com', password: 'Admin@123' }}
              >
                <Form.Item
                  name="email"
                  label="Email"
                  className="mb-4!"
                  rules={[
                    { required: true, message: 'Email is required' },
                    { type: 'email', message: 'Enter a valid email' },
                  ]}
                >
                  <Input
                    size="large"
                    prefix={<MailOutlined className="text-slate-400" />}
                    placeholder="you@company.com"
                    autoComplete="email"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  label="Password"
                  className="mb-4!"
                  rules={[{ required: true, message: 'Password is required' }]}
                >
                  <Input.Password
                    size="large"
                    prefix={<LockOutlined className="text-slate-400" />}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                </Form.Item>

                <Form.Item className="mb-0!">
                  <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                    Sign in
                  </Button>
                </Form.Item>
              </Form>

              <div className="mt-5 rounded-xl bg-surface px-3 py-2.5 text-center">
                <Text type="secondary" className="text-xs">
                  Demo credentials:{' '}
                  <span className="font-medium text-brand-dark">admin@gmail.com</span>
                  {' / '}
                  <span className="font-medium text-brand-dark">Admin@123</span>
                </Text>
              </div>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-white/40 sm:mt-5">
            Authorized personnel only · All activity is monitored
          </p>
        </div>
      </div>
    </div>
  )
}
