import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
// import Portal from 'react-overlays/Portal'
import cx from 'classnames'
import { TooltipProps } from './props'

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)

interface WrapperPos {
  left?: number,
  top?: number,
  height?: number,
  width?: number
}

export default function Tooltip(props: TooltipProps) {
  let {
    position,
    overlayClass = '',
    wrapperClass = '',
    content,
    container = 'body',
    children
  } = props

  let [opening, setOpening] = useState(false)
  let [open, setOpen] = useState(false)
  let [style, setStyle] = useState<WrapperPos>({})
  let wrapper = useRef<HTMLDivElement | null>(null)
  let hasToolTip = useRef<boolean>(false)

  let onEnter = () => {
    let pos = wrapper.current?.getBoundingClientRect().toJSON() || {}
    let top = pos.top;
    let left = pos.left;
    if (position === 'top'){
      top = top - pos.height
    }
    if (position === 'bottom') {
      top = top + pos.height
    }
    if (position === 'left') {
      left = left + pos.width
    }
    if (position === 'right') {
      left = left - pos.width
    }
    setStyle({
      top,
      left,
      height: pos.height,
      width: pos.width
    })
    setOpening(true)
  }

  let onLeave = () => {
    setStyle({})
    setOpen(false)
    setOpening(false)
    setTimeout(() => {
      hasToolTip.current = false
    }, 10);
  }

  let setToolTip = (tooltipEle: (HTMLDivElement | null)) => {
    if (hasToolTip.current) return
    hasToolTip.current = true
    let tooltip = tooltipEle?.getBoundingClientRect().toJSON() || {}
    let { left = 0, top = 0 } = style
    if (position === 'top' || position === 'bottom') {
      left = left - (tooltip.width / 2) + 6
    }
    if (position === 'left' || position === 'right') {
      top = top - (tooltip.height / 2) + 6
    }
    if (position === 'top') {
      top = top - tooltip.height + 12
    }
    if (position === 'right') {
      left = left - tooltip.width + 12
    }
    setStyle({
      left,
      top
    })
    setOpen(true)
  }

  let portalTarget = canUseDOM && container ? document.querySelector(container) : null

  let tooltip = (
    <div ref={(tool) => setToolTip(tool)} className={cx('ui-kit-tooltip', `position-${position}`, { 'ui-kit-tooltip-open': open }, overlayClass)} style={{
      top: style.top,
      left: style.left
    }}>
      <span className={cx('ui-kit-tooltip-arrow', position)} />
      <div className='ui-kit-tooltip-content'>
        {content}
      </div>
    </div>
  )

  let tooltipContainer = opening ? tooltip : null

  return (
    <span className={cx('ui-kit-tooltip-wrapper', wrapperClass)} ref={wrapper} onMouseEnter={() => onEnter()} onMouseLeave={() => onLeave()}>
      {children}
      {
        portalTarget ?
          (
            createPortal(
              tooltipContainer,
              portalTarget
            )
          )
          :
          tooltipContainer
      }
    </span>
  )
}
