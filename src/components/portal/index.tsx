import { type FC, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import type { PortalProps } from './types'

const Portal: FC<PortalProps> = ({ children, container = document.body }) => {
  const target = useMemo(() => {
    const el = document.createElement('div')
    return el
  }, [])

  useEffect(() => {
    container?.appendChild(target)
    return () => {
      container?.removeChild(target)
    }
  }, [container, target])

  return createPortal(children, target)
}

export default Portal
