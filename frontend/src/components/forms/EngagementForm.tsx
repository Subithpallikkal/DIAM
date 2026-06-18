import { DatePicker, Form, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { type Dayjs } from 'dayjs'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from '../common/Button'
import { Input } from '../common/Input'
import type { ClientListItem } from '../../types/client'
import type { CreateEngagementPayload, EngagementStatus } from '../../types/engagement'

const AUDIT_TYPES = ['Financial', 'Internal', 'Compliance', 'Tax', 'Operational']
const STATUS_OPTIONS: { label: string; value: EngagementStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
]

export interface EngagementFormValues
  extends Omit<CreateEngagementPayload, 'startDate' | 'endDate'> {
  startDate?: Dayjs
  endDate?: Dayjs
}

interface EngagementFormProps {
  form: FormInstance<EngagementFormValues>
  clients: ClientListItem[]
  loading?: boolean
  hideActions?: boolean
  onCancel: () => void
  onFinish: (values: EngagementFormValues) => void
}

export function EngagementForm({
  form,
  clients,
  loading = false,
  hideActions = false,
  onCancel,
  onFinish,
}: EngagementFormProps) {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      initialValues={{ status: 'DRAFT' }}
      onFinish={onFinish}
    >
      <Form.Item
        name="clientId"
        label="Client"
        rules={[{ required: true, message: 'Please select a client' }]}
      >
        <Select
          showSearch
          placeholder="Select client"
          optionFilterProp="label"
          options={clients.map((client) => ({
            value: client.id,
            label: client.name,
          }))}
        />
      </Form.Item>

      <Form.Item
        name="title"
        label="Title"
        rules={[{ required: true, message: 'Title is required' }]}
      >
        <Input placeholder="Financial Audit 2026" />
      </Form.Item>

      <Form.Item
        name="auditType"
        label="Audit Type"
        rules={[{ required: true, message: 'Audit type is required' }]}
      >
        <Select
          placeholder="Select audit type"
          options={AUDIT_TYPES.map((type) => ({ value: type, label: type }))}
        />
      </Form.Item>

      <Form.Item name="financialYear" label="Financial Year">
        <Input placeholder="2025-26" />
      </Form.Item>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
        <Form.Item name="startDate" label="Start Date" className="!mb-0">
          <DatePicker className="w-full" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item name="endDate" label="End Date" className="!mb-0">
          <DatePicker
            className="w-full"
            format="YYYY-MM-DD"
            disabledDate={(current) => {
              const start = form.getFieldValue('startDate') as Dayjs | undefined
              return start ? current && current.isBefore(start, 'day') : false
            }}
          />
        </Form.Item>
      </div>

      <Form.Item name="status" label="Status">
        <Select options={STATUS_OPTIONS} />
      </Form.Item>

      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} placeholder="Optional notes about this engagement" />
      </Form.Item>

      {!hideActions && (
        <Form.Item className="!mb-0 !mt-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button icon={<ArrowLeftOutlined />} onClick={onCancel} block className="sm:!w-auto">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} block className="sm:!w-auto">
              Create Engagement
            </Button>
          </div>
        </Form.Item>
      )}
    </Form>
  )
}
