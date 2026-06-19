import { Form } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button, ModalFormField, ModalFormGrid, modalFormClassName } from '../common'
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
  inModal?: boolean
  onCancel: () => void
  onFinish: (values: ClientFormValues) => void
}

export function ClientForm({
  form,
  mode,
  loading = false,
  hideActions = false,
  inModal = false,
  onCancel,
  onFinish,
}: ClientFormProps) {
  const Field = inModal ? ModalFormField : Form.Item

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      className={inModal ? modalFormClassName : undefined}
      onFinish={onFinish}
    >
      <ModalFormGrid>
        <Field
          name="name"
          label="Client Name"
          requiredMark
          rules={[{ required: true, message: 'Client name is required' }]}
        >
          <Input placeholder={mode === 'create' ? 'ABC Pvt Ltd' : undefined} />
        </Field>

        {mode === 'edit' ? (
          <Field name="code" label="Client Code">
            <Input />
          </Field>
        ) : (
          <Field name="gstNumber" label="GST Number">
            <Input placeholder="27AABCU9603R1ZM" />
          </Field>
        )}

        <Field
          name="email"
          label="Email"
          rules={[{ type: 'email', message: 'Enter a valid email' }]}
        >
          <Input placeholder={mode === 'create' ? 'contact@abc.com' : undefined} />
        </Field>

        <Field name="phone" label="Phone">
          <Input placeholder={mode === 'create' ? '+91-9876543210' : undefined} />
        </Field>

        {mode === 'edit' && (
          <Field name="gstNumber" label="GST Number">
            <Input />
          </Field>
        )}

        <Field name="address" label="Address" className="ant-form-item-full">
          <Input.TextArea
            rows={3}
            placeholder={mode === 'create' ? '123 Business Park, Mumbai' : undefined}
          />
        </Field>
      </ModalFormGrid>

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
