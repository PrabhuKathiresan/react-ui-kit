import React, { useState, useRef, cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import { canUseDOM } from '../utils'
import { TooltipProps } from './props'
import { TransitionState } from '../constants'
import { isDefined } from '../utils/type-check'

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
    delay = 200,
    zIndex
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
    let transformOriginMap = {
      top: 'bottom',
      bottom: 'top',
      left: 'right',
      right: 'left'
    }
    let transitionMap = {
      top: {
        entering: `translateX(-50%) translateY(-100%) scale(.8)`,
        entered: `translateX(-50%) translateY(-100%) scale(1)`,
        exiting: `translateX(-50%) translateY(-100%) scale(.8)`,
        exited: `translateX(-50%) translateY(-100%) scale(.8)`,
      },
      bottom: {
        entering: `translateX(-50%) translateY(0) scale(.8)`,
        entered: `translateX(-50%) translateY(0) scale(1)`,
        exiting: `translateX(-50%) translateY(0) scale(.8)`,
        exited: `translateX(-50%) translateY(0) scale(.8)`,
      },
      left: {
        entering: `translateX(-100%) translateY(-50%) scale(.8)`,
        entered: `translateX(-100%) translateY(-50%) scale(1)`,
        exiting: `translateX(-100%) translateY(-50%) scale(.8)`,
        exited: `translateX(-100%) translateY(-50%) scale(.8)`,
      },
      right: {
        entering: `translateX(0) translateY(-50%) scale(.8)`,
        entered: `translateX(0) translateY(-50%) scale(1)`,
        exiting: `translateX(0) translateY(-50%) scale(.8)`,
        exited: `translateX(0) translateY(-50%) scale(.8)`,
      }
    }
    let transitionStyle = {
      opacity: transitionState === 'entered' ? 1 : 0,
      transform: transitionMap[direction][transitionState],
      transition: 'transform, opacity',
      transitionDuration: `${delay}ms`,
      transitionTimingFunction: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
      transformOrigin: transformOriginMap[direction]
    }
    let style = {
      ...tooltipStyle,
      ...transitionStyle
    }
    if (isDefined(zIndex)) style.zIndex = zIndex
    return (
      <div className={`ui-kit-tooltip-Tip ${direction}`} style={style}>
        {content}
      </div>
    )
  }

  let tooltipContainer = (
    <Transition
      appear
      mountOnEnter
      unmountOnExit
      in={active}
      timeout={delay}
    >
      {
        (transitionState: TransitionState) => tooltipContent(transitionState)
      }
    </Transition>
  )

  let portalTarget = canUseDOM && container ? document.querySelector(container) : null

  return (
    <>
      <span
        className='ui-kit-tooltip-Wrapper'
        // When to show the tooltip
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        ref={wrapper}
      >
        {/* Wrapping */}
        {cloneElement(children)}
      </span>
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
    </>
  )
}
