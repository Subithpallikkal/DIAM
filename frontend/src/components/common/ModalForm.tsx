import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Form, Modal, type FormItemProps } from 'antd'
import { Alert } from './Alert'
import { Button } from './Button'
import {
  ModalFormInputContext,
  OutlinedField,
  isDiamInputElement,
  isDiamTextAreaElement,
  wrapOutlinedChildren,
} from './Input'
import { Loader } from './Loader'
import {
  modalFormClassName,
  modalFormItemClass,
  modalOutlinedControlClass,
} from '../../lib/ui'
import { cn } from '../../utils/cn'

export interface ModalFormMetaItem {
  label: string
  value: ReactNode
}

export interface ModalFormProps {
  open: boolean
  title: string
  subtitle?: string
  meta?: ModalFormMetaItem[]
  onClose: () => void
  onSubmit: () => void
  submitText?: string
  loading?: boolean
  submitDisabled?: boolean
  error?: string | null
  width?: number | string
  children: ReactNode
  footerExtra?: ReactNode
  loadingContent?: boolean
  destroyOnClose?: boolean
  showSubmit?: boolean
}

export interface ModalFormFieldProps extends FormItemProps {
  label: string
  requiredMark?: boolean
}

export function ModalFormField({
  label,
  requiredMark,
  children,
  className,
  ...formItemProps
}: ModalFormFieldProps) {
  const child = Children.only(children)

  if (!isValidElement(child)) {
    return null
  }

  const element = child as ReactElement<{ className?: string; variant?: string }>
  const isTextArea = isDiamTextAreaElement(element)
  const isTextInput = isDiamInputElement(element) && !isTextArea
  const isToggleControl =
    formItemProps.valuePropName === 'checked' || formItemProps.valuePropName === 'file'

  if (isTextInput || isTextArea) {
    return (
      <Form.Item
        {...formItemProps}
        label={null}
        required={false}
        className={cn(modalFormItemClass, 'h-full', className)}
      >
        {wrapOutlinedChildren(children as ReactNode, { label, required: requiredMark })}
      </Form.Item>
    )
  }

  const shellClass = isTextArea
    ? 'min-h-20 items-start'
    : isToggleControl
      ? 'flex min-h-9 items-center px-3'
      : undefined

  return (
    <div className={cn(modalFormItemClass, 'h-full', className)}>
      <OutlinedField
        label={label}
        required={requiredMark}
        className={cn(shellClass, 'h-full')}
      >
        <Form.Item {...formItemProps} noStyle>
          {cloneElement(element, {
            variant: isToggleControl ? element.props.variant : 'borderless',
            className: cn(modalOutlinedControlClass, element.props.className),
          })}
        </Form.Item>
      </OutlinedField>
    </div>
  )
}

export function ModalForm({
  open,
  title,
  subtitle,
  meta,
  onClose,
  onSubmit,
  submitText,
  loading = false,
  submitDisabled = false,
  error,
  width = 720,
  children,
  footerExtra,
  loadingContent = false,
  destroyOnClose = true,
  showSubmit = true,
}: ModalFormProps) {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={width}
      centered
      destroyOnClose={destroyOnClose}
      className="[&_.ant-modal-content]:overflow-visible [&_.ant-modal-content]:rounded [&_.ant-modal-content]:border [&_.ant-modal-content]:border-[#e2e8f0] [&_.ant-modal-content]:p-0 [&_.ant-modal-content]:shadow-[0_18px_48px_rgba(15,23,42,0.18)] [&_.ant-modal-body]:overflow-visible [&_.ant-modal-body]:p-0"
      wrapClassName="flex items-center justify-center [&_.ant-modal]:m-0! [&_.ant-modal]:max-w-[calc(100vw-2rem)] [&_.ant-modal]:p-0! [&_.ant-modal]:top-auto!"
      styles={{
        body: { padding: 0 },
        wrapper: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
      }}
      modalRender={(modal) => (
        <div className="relative mx-auto block pt-4 pr-4">
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute right-0 top-0 z-1061 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-0 bg-brand text-xs text-white shadow-[0_2px_8px_rgba(26,188,156,0.4)] transition-colors hover:bg-[#16a085]"
          >
            <CloseOutlined />
          </button>
          <div className="block">{modal}</div>
        </div>
      )}
    >
      <div className="flex flex-col gap-2 px-3 pb-2 pt-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="m-0 text-lg font-bold leading-tight text-[#2f3a4a] sm:text-xl">
            {title}
          </h2>
          {subtitle && <p className="mb-0 mt-1 text-xs text-[#9aa3b2]">{subtitle}</p>}
        </div>
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 sm:justify-end">
            {meta.map((item) => (
              <div key={item.label} className="flex flex-col gap-0.5">
                <span className="text-[10px] leading-none text-[#9aa3b2]">{item.label}</span>
                <span className="text-xs font-semibold leading-tight text-[#2f3a4a]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="max-h-[calc(100vh-180px)] overflow-x-visible overflow-y-auto px-3 pb-1.5 pt-2">
        {error && <Alert type="error" message={error} className="mb-3" />}
        {loadingContent ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <ModalFormInputContext.Provider value>{children}</ModalFormInputContext.Provider>
        )}
      </div>

      {(showSubmit || footerExtra) && (
        <div className="flex flex-col-reverse items-stretch gap-2 px-3 pb-3 pt-1.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-[#5c6777]">{footerExtra}</div>
          {showSubmit && (
            <Button
              type="primary"
              loading={loading}
              disabled={submitDisabled || loadingContent}
              onClick={onSubmit}
              className="h-9! min-w-36! rounded! px-8! text-sm! font-semibold!"
            >
              {submitText}
            </Button>
          )}
        </div>
      )}
    </Modal>
  )
}

interface ModalFormSectionProps {
  title?: string
  children: ReactNode
  className?: string
}

export function ModalFormSection({ title, children, className }: ModalFormSectionProps) {
  return (
    <fieldset
      className={cn(
        'relative m-0 mb-2.5 rounded border border-[#d5dce6] bg-white p-2.5 pt-3.5',
        className,
      )}
    >
      {title && (
        <legend className="float-none m-0 mb-0 ml-2.5 w-auto border-0 px-1.5 text-[11px] font-normal text-[#8b95a5]">
          {title}
        </legend>
      )}
      <div className="w-full min-w-0">{children}</div>
    </fieldset>
  )
}

export function ModalFormGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid grid-cols-1 gap-x-2.5 gap-y-3 md:grid-cols-2 md:items-stretch', className)}>
      {children}
    </div>
  )
}

interface ModalFormColumnsProps {
  left: ReactNode
  right?: ReactNode
  className?: string
}

export function ModalFormColumns({ left, right, className }: ModalFormColumnsProps) {
  return (
    <div className={cn('grid grid-cols-1 gap-x-6 gap-y-0 lg:grid-cols-2', className)}>
      <div className="min-w-0">{left}</div>
      {right && <div className="min-w-0">{right}</div>}
    </div>
  )
}

export { modalFormClassName }
