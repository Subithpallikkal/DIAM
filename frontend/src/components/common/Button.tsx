import { forwardRef } from 'react'
import { Button as AntButton, type ButtonProps } from 'antd'
import { btnBaseClass, btnOutlineClass, btnPrimaryClass } from '../../lib/ui'
import { cn } from '../../utils/cn'

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button({ className, type, ...props }, ref) {
    const resolvedType = type ?? 'default'

    return (
      <AntButton
        ref={ref}
        {...props}
        type={type}
        className={cn(
          btnBaseClass,
          resolvedType === 'primary' && btnPrimaryClass,
          resolvedType === 'default' && btnOutlineClass,
          className,
        )}
      />
    )
  },
)
