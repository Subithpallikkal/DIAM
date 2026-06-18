import { Spin, type SpinProps } from 'antd'
import { cn } from '../../utils/cn'

interface LoaderProps extends SpinProps {
  fullPage?: boolean
}

export function Loader({ fullPage = false, size = 'large', ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        fullPage ? 'h-full min-h-0 w-full flex-1' : 'p-6',
      )}
    >
      <Spin size={size} {...props} />
    </div>
  )
}
