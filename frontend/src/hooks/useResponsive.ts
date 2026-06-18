import { useLayoutEffect, useState } from 'react'
import { Grid } from 'antd'

export function useIsMobile(breakpoint: 'sm' | 'md' | 'lg' = 'lg') {
  const screens = Grid.useBreakpoint()

  if (breakpoint === 'sm') return !screens.sm
  if (breakpoint === 'md') return !screens.md
  return !screens.lg
}

export function useResponsiveModalWidth(desktopWidth: number) {
  const screens = Grid.useBreakpoint()
  const [width, setWidth] = useState<number | string>(desktopWidth)

  useLayoutEffect(() => {
    if (!screens.sm) {
      setWidth('calc(100vw - 32px)')
      return
    }

    if (!screens.md) {
      setWidth(Math.min(desktopWidth, window.innerWidth - 32))
      return
    }

    setWidth(desktopWidth)
  }, [screens.sm, screens.md, desktopWidth])

  return width
}
