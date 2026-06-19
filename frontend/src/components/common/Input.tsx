import {
  Input as AntInput,
  type InputProps,
} from 'antd'
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useMemo,
  useState,
  type ComponentProps,
  type FocusEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react'
import { cn } from '../../utils/cn'
import { inputFieldClass, outlinedControlClass } from '../../lib/ui'

export interface OutlinedFieldProps {
  label: string
  required?: boolean
  className?: string
  children: ReactNode
}

export function OutlinedField({ label, required, className, children }: OutlinedFieldProps) {
  return (
    <div
      className={cn(
        'relative min-h-[44px] rounded-[5px] border border-[#cfd6df] bg-white transition-[border-color,box-shadow] duration-200',
        'focus-within:border-[#1abc9c] focus-within:shadow-[0_0_0_1px_#1abc9c]',
        className,
      )}
    >
      <span className="absolute -top-[9px] left-[11px] z-[2] bg-white px-[5px] text-[12px] leading-none text-[#7d8694]">
        {label}
        {required && <span className="ml-0.5 text-[#e53935]">*</span>}
      </span>
      <div className={cn('h-full w-full', outlinedControlClass)}>{children}</div>
    </div>
  )
}

export interface DiamInputProps extends Omit<InputProps, 'variant'> {
  outlined?: boolean
  label?: string
  requiredMark?: boolean
}

function useOutlinedState(
  value: InputProps['value'],
  defaultValue: InputProps['defaultValue'],
) {
  const [focused, setFocused] = useState(false)
  const hasValue = useMemo(() => {
    const current = value ?? defaultValue
    if (current === undefined || current === null) return false
    return String(current).length > 0
  }, [defaultValue, value])

  return {
    focused,
    hasValue,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
  }
}

function mergeFocusHandlers(
  onFocus: FocusEventHandler<HTMLElement> | undefined,
  onBlur: FocusEventHandler<HTMLElement> | undefined,
  outlinedOnFocus: () => void,
  outlinedOnBlur: () => void,
) {
  return {
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      outlinedOnFocus()
      onFocus?.(event)
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      outlinedOnBlur()
      onBlur?.(event)
    },
  }
}

export function Input({
  outlined = false,
  label,
  requiredMark,
  className,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}: DiamInputProps) {
  const useOutlined = outlined && Boolean(label)
  const { onFocus: outlinedOnFocus, onBlur: outlinedOnBlur } = useOutlinedState(
    value,
    defaultValue,
  )
  const focusHandlers = mergeFocusHandlers(
    onFocus as FocusEventHandler<HTMLElement> | undefined,
    onBlur as FocusEventHandler<HTMLElement> | undefined,
    outlinedOnFocus,
    outlinedOnBlur,
  )

  const input = (
    <AntInput
      {...props}
      value={value}
      defaultValue={defaultValue}
      {...focusHandlers}
      variant={useOutlined ? 'borderless' : undefined}
      className={cn(useOutlined ? 'px-3.5 py-[10px] text-sm font-semibold text-[#1c2430]' : inputFieldClass, className)}
    />
  )

  if (!useOutlined || !label) {
    return input
  }

  return (
    <OutlinedField label={label} required={requiredMark}>
      {input}
    </OutlinedField>
  )
}

Input.displayName = 'DiamInput'

type TextAreaProps = Omit<ComponentProps<typeof AntInput.TextArea>, 'variant'> & {
  outlined?: boolean
  label?: string
  requiredMark?: boolean
}

function TextArea({
  outlined = false,
  label,
  requiredMark,
  className,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}: TextAreaProps) {
  const useOutlined = outlined && Boolean(label)
  const { onFocus: outlinedOnFocus, onBlur: outlinedOnBlur } = useOutlinedState(
    value,
    defaultValue,
  )
  const focusHandlers = mergeFocusHandlers(
    onFocus as FocusEventHandler<HTMLElement> | undefined,
    onBlur as FocusEventHandler<HTMLElement> | undefined,
    outlinedOnFocus,
    outlinedOnBlur,
  )

  const textArea = (
    <AntInput.TextArea
      {...props}
      value={value}
      defaultValue={defaultValue}
      {...focusHandlers}
      variant={useOutlined ? 'borderless' : undefined}
      className={cn(useOutlined ? 'px-3.5 py-[10px] text-sm font-semibold text-[#1c2430]' : inputFieldClass, className)}
    />
  )

  if (!useOutlined || !label) {
    return textArea
  }

  return (
    <OutlinedField label={label} required={requiredMark} className="min-h-[96px]">
      {textArea}
    </OutlinedField>
  )
}

TextArea.displayName = 'DiamTextArea'

type PasswordProps = Omit<ComponentProps<typeof AntInput.Password>, 'variant'> & {
  outlined?: boolean
  label?: string
  requiredMark?: boolean
}

function Password({
  outlined = false,
  label,
  requiredMark,
  className,
  value,
  defaultValue,
  onFocus,
  onBlur,
  ...props
}: PasswordProps) {
  const useOutlined = outlined && Boolean(label)
  const { onFocus: outlinedOnFocus, onBlur: outlinedOnBlur } = useOutlinedState(
    value,
    defaultValue,
  )
  const focusHandlers = mergeFocusHandlers(
    onFocus as FocusEventHandler<HTMLElement> | undefined,
    onBlur as FocusEventHandler<HTMLElement> | undefined,
    outlinedOnFocus,
    outlinedOnBlur,
  )

  const password = (
    <AntInput.Password
      {...props}
      value={value}
      defaultValue={defaultValue}
      {...focusHandlers}
      variant={useOutlined ? 'borderless' : undefined}
      className={cn(useOutlined ? 'px-3.5 py-[10px] text-sm font-semibold text-[#1c2430]' : inputFieldClass, className)}
    />
  )

  if (!useOutlined || !label) {
    return password
  }

  return (
    <OutlinedField label={label} required={requiredMark}>
      {password}
    </OutlinedField>
  )
}

Password.displayName = 'DiamPassword'

Input.TextArea = TextArea
Input.Password = Password

export { TextArea, Password }

export const ModalFormInputContext = createContext(false)

export function useModalFormInputContext() {
  return useContext(ModalFormInputContext)
}

type OutlinedChildProps = {
  className?: string
  variant?: string
  outlined?: boolean
  label?: string
  requiredMark?: boolean
}

export function isDiamInputElement(child: ReactElement) {
  const type = child.type as { displayName?: string }
  return (
    type?.displayName === 'DiamInput' ||
    type?.displayName === 'DiamTextArea' ||
    type?.displayName === 'DiamPassword'
  )
}

export function enhanceOutlinedChild(
  child: ReactElement<OutlinedChildProps>,
  options: { label: string; required?: boolean },
) {
  if (isDiamInputElement(child)) {
    return cloneElement(child, {
      outlined: true,
      label: options.label,
      requiredMark: options.required,
    })
  }

  return (
    <OutlinedField label={options.label} required={options.required}>
      {cloneElement(child, {
        variant: 'borderless',
        className: cn(outlinedControlClass, child.props.className),
      })}
    </OutlinedField>
  )
}

export function wrapOutlinedChildren(
  children: ReactNode,
  options: { label: string; required?: boolean },
) {
  const child = Children.only(children)
  if (!isValidElement(child)) {
    return children
  }

  return enhanceOutlinedChild(child as ReactElement<OutlinedChildProps>, options)
}
