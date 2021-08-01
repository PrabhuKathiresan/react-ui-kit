
import React from 'react'
import { ToastContainerProps } from './props'

const positions = {
  'top-left': { top: 0, left: 0 },
  'top-center': { top: 0, left: '50%', transform: 'translateX(-50%)' },
  'top-right': { top: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
  'bottom-center': { bottom: 0, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right': { bottom: 0, right: 0 }
};

export const ToastContainer = ({
  hasToasts,
  position,
  children,
  ...props
}: ToastContainerProps) => {
  let style: React.CSSProperties = {
    boxSizing: 'border-box',
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    padding: 16,
    position: 'fixed',
    zIndex: 1000,
    ...positions[position],
  }
  if (!hasToasts) style.pointerEvents = 'none'
  return (
    <div
      className="ui-kit-toast__container"
      style={style}
      {...props}
    >
      {children}
    </div>
  )
}
