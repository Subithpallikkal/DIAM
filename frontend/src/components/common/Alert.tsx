import { Alert as AntAlert, type AlertProps } from 'antd'
import { cn } from '../../utils/cn'

interface AppAlertProps extends Omit<AlertProps, 'variant'> {
  layout?: 'inline' | 'form'
}

export function Alert({ layout = 'inline', className, ...props }: AppAlertProps) {
  return (
    <AntAlert
      showIcon
      {...props}
      className={cn(layout === 'form' && 'mb-5', className)}
    />
  )
}
