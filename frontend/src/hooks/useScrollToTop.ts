import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollToTop() {
  const { pathname } = useLocation()
  const prevPathRef = useRef(pathname)

  useLayoutEffect(() => {
    if (prevPathRef.current === pathname) return
    prevPathRef.current = pathname

    const scrollTargets = document.querySelectorAll<HTMLElement>('[data-page-body]')
    scrollTargets.forEach((element) => {
      element.scrollTop = 0
    })
  }, [pathname])
}
