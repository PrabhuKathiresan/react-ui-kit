import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import { canUseDOM } from '../utils';
import { TooltipProps } from './props'
import { TransitionState } from '../constants'

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

  let tooltipContent = (transitionState: string) => {
    let transitionMap = {
      top: {
        entering: `translateX(-50%) translateY(-75%)`,
        entered: `translateX(-50%) translateY(-100%)`,
        exiting: `translateX(-50%) translateY(-75%)`,
        exited: `translateX(-50%) translateY(-75%)`,
      },
      bottom: {
        entering: `translateX(-50%) translateY(-25%)`,
        entered: `translateX(-50%) translateY(0)`,
        exiting: `translateX(-50%) translateY(-25%)`,
        exited: `translateX(-50%) translateY(-25%)`,
      },
      left: {
        entering: `translateX(-90%) translateY(-50%)`,
        entered: `translateX(-100%) translateY(-50%)`,
        exiting: `translateX(-90%) translateY(-50%)`,
        exited: `translateX(-90%) translateY(-50%)`,
      },
      right: {
        entering: `translateX(-10%) translateY(-50%)`,
        entered: `translateX(0) translateY(-50%)`,
        exiting: `translateX(-10%) translateY(-50%)`,
        exited: `translateX(-10%) translateY(-50%)`,
      }
    }
    let transitionStyle = {
      transform: transitionMap[direction][transitionState],
      transition: 'transform linear',
      transitionDuration: `${delay}ms`,
    }
    return (
      <div className={`ui-kit-tooltip-Tip ${direction}`} style={{ ...tooltipStyle, ...transitionStyle }}>
        {/* Content */}
        {content}
      </div>
    )
  };

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
