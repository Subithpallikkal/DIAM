import { DatePicker, Form, Select } from 'antd'
import type { FormInstance } from 'antd/es/form'
import { type Dayjs } from 'dayjs'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {
  Button,
  ModalFormField,
  ModalFormGrid,
  ModalFormSection,
  modalFormClassName,
} from '../common'
import { Input } from '../common/Input'
import { datePickerFieldClass, selectFieldClass } from '../../lib/ui'
import { cn } from '../../utils/cn'
import type { ClientListItem } from '../../types/client'
import type { EngagementStatus, UpsertEngagementPayload } from '../../types/engagement'

const AUDIT_TYPES = ['Financial', 'Internal', 'Compliance', 'Tax', 'Operational']
const STATUS_OPTIONS: { label: string; value: EngagementStatus }[] = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'In Progress', value: 'IN_PROGRESS' },
  { label: 'Completed', value: 'COMPLETED' },
]

export interface EngagementFormValues
  extends Omit<UpsertEngagementPayload, 'startDate' | 'endDate'> {
  startDate?: Dayjs
  endDate?: Dayjs
}

interface EngagementFormProps {
  form: FormInstance<EngagementFormValues>
  clients: ClientListItem[]
  loading?: boolean
  hideActions?: boolean
  inModal?: boolean
  submitLabel?: string
  onCancel: () => void
  onFinish: (values: EngagementFormValues) => void
}

export function EngagementForm({
  form,
  clients,
  loading = false,
  hideActions = false,
  inModal = false,
  submitLabel = 'Create Engagement',
  onCancel,
  onFinish,
}: EngagementFormProps) {
  const Field = inModal ? ModalFormField : Form.Item

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
      className={inModal ? modalFormClassName : undefined}
      initialValues={{ status: 'DRAFT' }}
      onFinish={onFinish}
    >
      <ModalFormGrid>
        <Field
          name="clientId"
          label="Client"
          requiredMark
          rules={[{ required: true, message: 'Please select a client' }]}
        >
          <Select
            showSearch
            className={cn('w-full', !inModal && selectFieldClass)}
            placeholder="Select client"
            optionFilterProp="label"
            options={clients.map((client) => ({
              value: client.id,
              label: client.name,
            }))}
          />
        </Field>

        <Field
          name="auditType"
          label="Audit Type"
          requiredMark
          rules={[{ required: true, message: 'Audit type is required' }]}
        >
          <Select
            className={cn('w-full', !inModal && selectFieldClass)}
            placeholder="Select audit type"
            options={AUDIT_TYPES.map((type) => ({ value: type, label: type }))}
          />
        </Field>

        <Field
          name="title"
          label="Title"
          requiredMark
          rules={[{ required: true, message: 'Title is required' }]}
          className="ant-form-item-full"
        >
          <Input placeholder="Financial Audit 2026" />
        </Field>

        <Field name="financialYear" label="Financial Year">
          <Input placeholder="2025-26" />
        </Field>

        <Field name="status" label="Status">
          <Select className={cn('w-full', !inModal && selectFieldClass)} options={STATUS_OPTIONS} />
        </Field>
      </ModalFormGrid>

      <ModalFormSection title="Engagement Period" className="mt-1 mb-4">
        <ModalFormGrid className="md:items-stretch [&>*]:mb-0!">
          <Field name="startDate" label="Start Date">
            <DatePicker className={cn('w-full', !inModal && datePickerFieldClass)} format="YYYY-MM-DD" />
          </Field>
          <Field name="endDate" label="End Date">
            <DatePicker
              className={cn('w-full', !inModal && datePickerFieldClass)}
              format="YYYY-MM-DD"
              disabledDate={(current) => {
                const start = form.getFieldValue('startDate') as Dayjs | undefined
                return start ? current && current.isBefore(start, 'day') : false
              }}
            />
          </Field>
        </ModalFormGrid>
      </ModalFormSection>

      <Field name="description" label="Description">
        <Input.TextArea rows={3} placeholder="Optional notes about this engagement" />
      </Field>

      {!hideActions && (
        <Form.Item className="mb-0! mt-2!">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Button htmlType="button" icon={<ArrowLeftOutlined />} onClick={onCancel} block className="sm:w-auto!">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={loading} block className="sm:w-auto!">
              {submitLabel}
            </Button>
          </div>
        </Form.Item>
      )}
    </Form>
  )
}
