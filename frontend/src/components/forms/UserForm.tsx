import { Form, Select, Switch } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { Button, ModalFormField, ModalFormGrid, modalFormClassName } from '../common'
import { Input } from '../common/Input'
import { ROLE_OPTIONS } from '../../api/users.api'
import type { RoleName } from '../../types/auth'

export interface UserFormValues {
  name: string
  email: string
  password?: string
  role: RoleName
  isActive?: boolean
}

interface UserFormProps {
  form: FormInstance<UserFormValues>
  mode: 'create' | 'edit'
  loading?: boolean
  hideActions?: boolean
  inModal?: boolean
  onCancel: () => void
  onFinish: (values: UserFormValues) => void
}

export function UserForm({
  form,
  mode,
  loading = false,
  hideActions = false,
  inModal = false,
  onCancel,
  onFinish,
}: UserFormProps) {
  const Field = inModal ? ModalFormField : Form.Item
  const isCreate = mode === 'create'

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      className={inModal ? modalFormClassName : undefined}
      onFinish={onFinish}
      initialValues={{ isActive: true, role: 'AUDITOR' }}
    >
      <ModalFormGrid>
        <Field
          name="name"
          label="Full Name"
          requiredMark
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Jane Auditor" />
        </Field>

        <Field
          name="email"
          label="Email"
          requiredMark
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' },
          ]}
        >
          <Input placeholder="jane@company.com" />
        </Field>

        <Field
          name="role"
          label="Role"
          requiredMark
          rules={[{ required: true, message: 'Role is required' }]}
        >
          <Select className="w-full" placeholder="Select role" options={ROLE_OPTIONS} />
        </Field>

        <Field
          name="password"
          label={isCreate ? 'Password' : 'New Password'}
          requiredMark={isCreate}
          rules={
            isCreate
              ? [
                  { required: true, message: 'Password is required' },
                  { min: 8, message: 'Password must be at least 8 characters' },
                ]
              : [{ min: 8, message: 'Password must be at least 8 characters' }]
          }
        >
          <Input.Password placeholder={isCreate ? 'Minimum 8 characters' : 'Leave blank to keep current'} />
        </Field>

        {!isCreate && (
          <Field name="isActive" label="Active" valuePropName="checked">
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Field>
        )}
      </ModalFormGrid>

      {!hideActions && (
        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isCreate ? 'Create User' : 'Update User'}
          </Button>
        </div>
      )}
    </Form>
  )
}
