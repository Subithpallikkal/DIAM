/** ATS-inspired palette — use with Tailwind arbitrary values or ConfigProvider tokens */
import { cn } from '../utils/cn'

export const UI = {
  brand: '#1abc9c',
  brandHover: '#16a085',
  shell: '#0a2e2e',
  shellInner: '#0a2e2e',
  contentSurface: '#f8f9fa',
  sidebar: '#0a2e2e',
  sidebarBorder: 'rgba(255, 255, 255, 0.1)',
  tableHeader: '#0f3d3d',
  tableBorder: '#dfe6e9',
  rowHover: '#f0faf8',
  rowSelected: '#dff5ef',
} as const

/** Shared compact control height (36px) */
export const fieldHeightClass = 'h-9 min-h-9'
export const textareaMinHeightClass = 'min-h-20'

export const inputFieldClass =
  'h-9 min-h-9 w-full rounded-lg border border-[#d8dee8] bg-white px-3 text-sm shadow-none hover:border-[#b8c4d9] focus:border-brand focus:shadow-[0_0_0_2px_rgba(26,188,156,0.15)]'

export const selectFieldClass = cn(
  'w-full',
  '[&_.ant-select-selector]:h-9! [&_.ant-select-selector]:min-h-9! [&_.ant-select-selector]:items-center!',
  '[&_.ant-select-selector]:rounded-lg! [&_.ant-select-selector]:border-[#d8dee8]! [&_.ant-select-selector]:px-3!',
  '[&_.ant-select-selector]:shadow-none! hover:[&_.ant-select-selector]:border-[#b8c4d9]!',
  '[&_.ant-select-selection-item]:text-sm! [&_.ant-select-selection-placeholder]:text-sm!',
)

export const datePickerFieldClass = cn(
  'w-full',
  '[&_.ant-picker]:h-9! [&_.ant-picker]:min-h-9! [&_.ant-picker]:w-full!',
  '[&_.ant-picker]:rounded-lg! [&_.ant-picker]:border-[#d8dee8]! [&_.ant-picker]:px-3!',
  '[&_.ant-picker]:shadow-none! hover:[&_.ant-picker]:border-[#b8c4d9]!',
  '[&_.ant-picker-input>input]:text-sm!',
)

export const modalFormItemClass = 'mb-3'

export const modalFieldShellClass =
  'relative min-h-9 rounded-[5px] border border-[#cfd6df] bg-white transition-[border-color,box-shadow] duration-200 focus-within:border-brand focus-within:shadow-[0_0_0_1px_#1abc9c]'

export const modalOutlinedControlClass = cn(
  'w-full text-sm text-[#1c2430]',
  '[&_.ant-select]:w-full! [&_.ant-select-selector]:h-9! [&_.ant-select-selector]:min-h-9! [&_.ant-select-selector]:items-center!',
  '[&_.ant-select-selector]:border-0! [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:px-3! [&_.ant-select-selector]:shadow-none!',
  '[&_.ant-select-selection-item]:font-semibold! [&_.ant-select-selection-placeholder]:font-normal! [&_.ant-select-selection-placeholder]:text-[#b0b8c4]!',
  '[&_.ant-picker]:h-9! [&_.ant-picker]:min-h-9! [&_.ant-picker]:w-full! [&_.ant-picker]:border-0! [&_.ant-picker]:bg-transparent!',
  '[&_.ant-picker]:px-3! [&_.ant-picker]:shadow-none! [&_.ant-picker-input>input]:font-semibold!',
  '[&_.ant-input]:h-9! [&_.ant-input]:min-h-9! [&_.ant-input]:border-0! [&_.ant-input]:bg-transparent! [&_.ant-input]:px-3! [&_.ant-input]:shadow-none!',
  '[&_.ant-input-affix-wrapper]:h-9! [&_.ant-input-affix-wrapper]:min-h-9! [&_.ant-input-affix-wrapper]:border-0! [&_.ant-input-affix-wrapper]:bg-transparent!',
  '[&_.ant-input-affix-wrapper]:px-3! [&_.ant-input-affix-wrapper]:shadow-none!',
)

export const btnBaseClass = 'rounded-lg! font-medium! shadow-none!'

export const btnPrimaryClass =
  'border-brand! bg-brand! shadow-none! hover:border-[#16a085]! hover:bg-[#16a085]!'

export const btnOutlineClass =
  'border-brand text-brand shadow-none hover:border-[#16a085] hover:text-[#16a085]'

export const statusPillBase =
  'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white'

export const modalFormClassName = cn(
  modalFormItemClass,
  '[&_.ant-form-item-full]:md:col-span-2',
  '[&_.ant-form-item-third]:md:col-span-1',
  '[&_.ant-checkbox-checked_.ant-checkbox-inner]:border-brand! [&_.ant-checkbox-checked_.ant-checkbox-inner]:bg-brand!',
  '[&_.ant-checkbox-wrapper:hover_.ant-checkbox-inner]:border-brand!',
  '[&_.ant-checkbox:hover_.ant-checkbox-inner]:border-brand!',
  '[&_.ant-switch.ant-switch-checked]:bg-brand!',
)

export const mobileFullSelectClass = 'w-full sm:max-w-xs'
export const stackListItemClass =
  'flex-col! items-start! gap-1 sm:flex-row! sm:items-center! sm:justify-between! [&_.ant-list-item-meta]:w-full! [&_.ant-list-item-meta]:min-w-0!'
export const responsiveDescriptionsClass =
  '[&_.ant-descriptions-view]:overflow-x-auto [&_.ant-descriptions-item-label]:align-top [&_.ant-descriptions-item-content]:align-top'

export const outlinedControlClass = cn(
  'flex w-full min-h-9 items-center',
  modalOutlinedControlClass,
  '[&_textarea.ant-input]:min-h-20! [&_textarea.ant-input]:items-start! [&_textarea.ant-input]:py-2! [&_textarea.ant-input]:font-medium! [&_textarea.ant-input]:leading-relaxed!',
  '[&_.ant-input::placeholder]:font-normal! [&_.ant-input::placeholder]:text-[#b0b8c4]!',
)

/** Default modal widths — pass to useResponsiveModalWidth */
export const MODAL_WIDTH = {
  sm: 440,
  md: 480,
  lg: 520,
  xl: 720,
} as const
