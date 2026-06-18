import { Form } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from '../common/Button'
import { Input } from '../common/Input'

export interface ClientFormValues {
  name: string
  email?: string
  phone?: string
  address?: string
  gstNumber?: string
  code?: string
}

interface ClientFormProps {
  form: FormInstance<ClientFormValues>
  mode: 'create' | 'edit'
  loading?: boolean
  hideActions?: boolean
  onCancel: () => void
  onFinish: (values: ClientFormValues) => void
}

export function ClientForm({
  form,
  mode,
  loading = false,
  hideActions = false,
  onCancel,
  onFinish,
}: ClientFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Client Name"
        rules={[{ required: true, message: 'Client name is required' }]}
      >
        <Input placeholder={mode === 'create' ? 'ABC Pvt Ltd' : undefined} />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ type: 'email', message: 'Enter a valid email' }]}
      >
        <Input placeholder={mode === 'create' ? 'contact@abc.com' : undefined} />
      </Form.Item>

      <Form.Item name="phone" label="Phone">
        <Input placeholder={mode === 'create' ? '+91-9876543210' : undefined} />
      </Form.Item>

      <Form.Item name="address" label="Address">
        <Input.TextArea
          rows={3}
          placeholder={mode === 'create' ? '123 Business Park, Mumbai' : undefined}
        />
      </Form.Item>

      <Form.Item name="gstNumber" label="GST Number">
        <Input placeholder={mode === 'create' ? '27AABCU9603R1ZM' : undefined} />
      </Form.Item>

      {mode === 'edit' && (
        <Form.Item name="code" label="Client Code">
          <Input />
        </Form.Item>
      )}

      {!hideActions && (
        <Form.Item className="!mb-0 !mt-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button icon={<ArrowLeftOutlined />} onClick={onCancel} block className="sm:!w-auto">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} block className="sm:!w-auto">
              {mode === 'create' ? 'Create Client' : 'Save Changes'}
            </Button>
          </div>
        </Form.Item>
      )}
    </Form>
  )
}
