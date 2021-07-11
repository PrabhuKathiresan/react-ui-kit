import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import { TooltipProps } from './props'

export type TransitionState = 'entering' | 'entered' | 'exiting' | 'exited';

const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
const directionStyleMap = {
  top: (position: any) => {
    return {
      top: position.top - 10,
      left: Math.round(position.left + (position.width / 2))
    }
  },
  bottom: (position: any) => {
    return {
      top: position.bottom + 10,
      left: Math.round(position.left + (position.width / 2))
    }
  },
  left: (position: any) => {
    return {
      top: Math.round(position.top + (position.height / 2)),
      left: position.left - 10
    }
  },
  right: (position: any) => {
    return {
      top: Math.round(position.top + (position.height / 2)),
      left: position.right + 10
    }
  }
}

export default function Tooltip(props: TooltipProps) {
  let {
    direction = 'top',
    content,
    children,
    container = 'body',
    delay = 200
  } = props

  let timeout = useRef<any>(null)
  let [active, setActive] = useState(false)
  let [tooltipStyle, setTooltipStyle] = useState<any>({})
  let wrapper = useRef<HTMLDivElement | null>(null)

  let onEnter = () => {
    if (wrapper.current) {
      let position = wrapper.current?.getBoundingClientRect()
      let getStyle = directionStyleMap[direction]
      let style = getStyle(position)
      setTooltipStyle(style)
    }
    timeout.current = setTimeout(() => {
      setActive(true)
    }, delay)
  }

  let onLeave = () => {
    if (timeout.current) {
      clearTimeout(timeout.current)
      timeout.current = null
    }
    setActive(false)
  }

  let tooltipContent = (transitionState: string) => (
    <div className={`ui-kit-tooltip-Tip ${direction} ui-kit-tooltip-${transitionState}`} style={{ ...tooltipStyle, transitionDuration: `${delay}ms` }}>
      {/* Content */}
      {content}
    </div>
  );

  let tooltipContainer = (
    <Transition
      appear
      mountOnEnter
      unmountOnExit
      in={active}
      timeout={{
        appear: delay,
        enter: 0,
        exit: delay
      }}
    >
      {
        (transitionState: TransitionState) => tooltipContent(transitionState)
      }
    </Transition>
  )

  let portalTarget = canUseDOM && container ? document.querySelector(container) : null

  return (
    <span
      className='ui-kit-tooltip-Wrapper'
      // When to show the tooltip
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      ref={wrapper}
    >
      {/* Wrapping */}
      {children}
      {
        portalTarget ?
          (
            createPortal(
              <>{tooltipContainer}</>,
              portalTarget
            )
          ) :
          (
            <>{tooltipContainer}</>
          )
      }
    </span>
  )
}
