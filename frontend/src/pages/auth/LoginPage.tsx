import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Form, Space, Typography } from 'antd'
import { LockOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons'
import { useAuth } from '../../context/AuthContext'
import { Alert, Button, Input } from '../../components/common'
import { getApiErrorMessage } from '../../utils/errors'

const { Title, Text, Paragraph } = Typography

interface LoginFormValues {
  email: string
  password: string
}

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
    <div className="grid h-dvh w-full grid-cols-1 overflow-hidden lg:grid-cols-2">
      <div className="hidden items-center justify-center bg-linear-to-br from-shell via-table-header to-[#0d5249] p-8 lg:flex lg:p-12">
        <div className="max-w-md text-white">
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-[28px] text-brand">
            <SafetyCertificateOutlined />
          </div>
          <Title level={2} className="mb-4! text-white!">
            DIAM
          </Title>
          <Paragraph className="mb-0! text-base! text-white/75!">
            Digital Internal Audit Management — streamline clients, engagements, and audit
            workflows in one place.
          </Paragraph>
        </div>
      </div>

      <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-surface px-4 py-6 sm:justify-center sm:p-8">
        <div className="mb-6 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-table-header to-brand text-lg font-bold text-white">
            D
          </div>
          <div>
            <Title level={4} className="mb-0!">
              DIAM
            </Title>
            <Text type="secondary" className="text-xs">
              Audit Management
            </Text>
          </div>
        </div>

        <Card bordered={false} className="w-full max-w-md self-center rounded-2xl! shadow-xl! sm:mx-auto">
          <Space direction="vertical" size={8} className="mb-6 w-full">
            <Title level={3} className="text-xl! sm:text-2xl!">
              Welcome back
            </Title>
            <Text type="secondary" className="text-sm sm:text-base">
              Sign in with your work email to continue
            </Text>
          </Space>

          {error && (
            <Alert
              type="error"
              message={error}
              closable
              className="mb-5"
              onClose={() => setError(null)}
            />
          )}

          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            initialValues={{ email: 'admin@gmail.com', password: 'Admin@123' }}
            className="mt-2"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Email is required' },
                { type: 'email', message: 'Enter a valid email' },
              ]}
            >
              <Input
                size="large"
                prefix={<MailOutlined />}
                placeholder="you@company.com"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Password is required' }]}
            >
              <Input.Password
                size="large"
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item className="mb-0! mt-2!">
              <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                Sign in
              </Button>
            </Form.Item>
          </Form>

          <Text type="secondary" className="mt-4 block text-center text-xs">
            Demo: admin@demo.com / Admin@123
          </Text>
        </Card>
      </div>
    </div>
  )
}
