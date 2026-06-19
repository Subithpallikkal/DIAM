import { Button as AntButton, type ButtonProps } from 'antd'
import { btnOutlineClass, btnPrimaryClass } from '../../lib/ui'
import { cn } from '../../utils/cn'

export function Button({ className, type, ...props }: ButtonProps) {
  return (
    <AntButton
      {...props}
      type={type}
      className={cn(
        '!rounded-lg !font-medium !shadow-none',
        type === 'primary' && btnPrimaryClass,
        type === 'default' && btnOutlineClass,
        className,
      )}
    />
  )
}
