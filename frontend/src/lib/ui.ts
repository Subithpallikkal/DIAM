/** ATS-inspired palette — use with Tailwind arbitrary values or ConfigProvider tokens */
import { cn } from '../utils/cn'

export const UI = {
  brand: '#1abc9c',
  brandHover: '#16a085',
  sidebar: '#52606d',
  sidebarBorder: '#455a64',
  tableHeader: '#52606d',
  tableBorder: '#dfe6e9',
  rowHover: '#f0faf8',
  rowSelected: '#dff5ef',
} as const

export const inputFieldClass =
  'rounded-lg border border-[#d8dee8] bg-white shadow-none hover:border-[#b8c4d9] focus:border-[#1abc9c] focus:shadow-[0_0_0_2px_rgba(26,188,156,0.15)]'

export const btnPrimaryClass =
  '!border-[#1abc9c] !bg-[#1abc9c] !shadow-none hover:!border-[#16a085] hover:!bg-[#16a085]'

export const btnOutlineClass =
  'border-[#1abc9c] text-[#1abc9c] shadow-none hover:border-[#16a085] hover:text-[#16a085]'

export const statusPillBase =
  'inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold text-white'

export const modalFormClassName = cn(
  '[&_.ant-form-item]:mb-4',
  '[&_.ant-form-item:first-child]:mt-1',
  '[&_.ant-form-item-full]:md:col-span-2',
  '[&_.ant-form-item-third]:md:col-span-1',
  '[&_.ant-checkbox-checked_.ant-checkbox-inner]:!border-[#1abc9c] [&_.ant-checkbox-checked_.ant-checkbox-inner]:!bg-[#1abc9c]',
  '[&_.ant-checkbox-wrapper:hover_.ant-checkbox-inner]:!border-[#1abc9c]',
  '[&_.ant-checkbox:hover_.ant-checkbox-inner]:!border-[#1abc9c]',
  '[&_.ant-switch.ant-switch-checked]:!bg-[#1abc9c]',
)

export const mobileFullSelectClass = 'w-full sm:max-w-xs'
export const mobileFullInputClass = 'w-full max-w-full sm:max-w-md'
export const stackListItemClass =
  '!flex-col !items-start gap-1 sm:!flex-row sm:!items-center sm:!justify-between [&_.ant-list-item-meta]:!w-full [&_.ant-list-item-meta]:!min-w-0'
export const responsiveDescriptionsClass =
  '[&_.ant-descriptions-view]:overflow-x-auto [&_.ant-descriptions-item-label]:align-top [&_.ant-descriptions-item-content]:align-top'

export const outlinedControlClass = cn(
  'w-full [&_.ant-input]:!min-h-[42px] [&_.ant-input]:!border-0 [&_.ant-input]:!bg-transparent [&_.ant-input]:!px-3.5 [&_.ant-input]:!py-[10px] [&_.ant-input]:!text-sm [&_.ant-input]:!font-semibold [&_.ant-input]:!text-[#1c2430] [&_.ant-input]:!shadow-none',
  '[&_.ant-input-affix-wrapper]:!min-h-[42px] [&_.ant-input-affix-wrapper]:!border-0 [&_.ant-input-affix-wrapper]:!bg-transparent [&_.ant-input-affix-wrapper]:!shadow-none',
  '[&_.ant-input-affix-wrapper_.ant-input]:!px-3.5 [&_.ant-input-affix-wrapper_.ant-input]:!py-[10px]',
  '[&_.ant-input::placeholder]:!font-normal [&_.ant-input::placeholder]:!text-[#b0b8c4]',
  '[&_.ant-select]:!w-full [&_.ant-select-selector]:!min-h-[42px] [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!bg-transparent [&_.ant-select-selector]:!px-3.5 [&_.ant-select-selector]:!py-2 [&_.ant-select-selector]:!shadow-none',
  '[&_.ant-select-selection-item]:!text-sm [&_.ant-select-selection-item]:!font-semibold [&_.ant-select-selection-item]:!text-[#1c2430]',
  '[&_.ant-select-selection-placeholder]:!text-sm [&_.ant-select-selection-placeholder]:!font-normal [&_.ant-select-selection-placeholder]:!text-[#b0b8c4]',
  '[&_.ant-picker]:!w-full [&_.ant-picker]:!min-h-[42px] [&_.ant-picker]:!border-0 [&_.ant-picker]:!bg-transparent [&_.ant-picker]:!px-3.5 [&_.ant-picker]:!py-2 [&_.ant-picker]:!shadow-none',
  '[&_.ant-picker-input>input]:!text-sm [&_.ant-picker-input>input]:!font-semibold [&_.ant-picker-input>input]:!text-[#1c2430]',
  '[&_textarea.ant-input]:!min-h-[80px] [&_textarea.ant-input]:!px-3.5 [&_textarea.ant-input]:!py-3 [&_textarea.ant-input]:!text-sm [&_textarea.ant-input]:!font-medium [&_textarea.ant-input]:!leading-relaxed',
)
