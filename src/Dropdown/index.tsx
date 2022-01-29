import React, { useState, useImperativeHandle, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import cx from 'classnames'
import { DropdownProps, PositionalProps, DropdownPosition, OptionItem } from './props'
import Button from '../Button'
import { uniqueId, canUseDOM } from '../utils'
import { TransitionState } from '../constants'

const transitionDuration = 220
const floatingPositionMap = (elem: HTMLDivElement | null, floatOffset: number = 10) => ({
  'top-left': (rect: any) => {
    let width = elem?.clientWidth || 0
    let height = elem?.clientHeight || 0
    let top = rect.top
    let left: any = (rect.left - width) - floatOffset
    let marginLeft: any
    if (left < 0) {
      left = 'auto'
      marginLeft = 10
    }
    let bufferTop = window.innerHeight - top
    if (bufferTop < height) {
      top = top - (height - bufferTop)
    }
    return {
      top,
      left,
      marginTop: 0,
      marginRight: 10,
      marginLeft
    }
  },
  'bottom-left': (rect: any) => {
    let width = elem?.clientWidth || 0
    let left = (rect.left - floatOffset) - 10
    if (left < width) {
      left = width
    }
    return {
      top: rect.bottom,
      left,
      marginTop: 0,
      marginLeft: 10,
      transform: 'translate(-100%, -100%)'
    }
  },
  'top-right': (rect: any) => {
    let width = elem?.clientWidth || 0
    let height = elem?.clientHeight || 0
    let top = rect.top
    let left = rect.right + floatOffset
    let bufferWidth = document.body.clientWidth - left
    if (bufferWidth < width) {
      left = left - (width - bufferWidth)
    }
    let bufferTop = window.innerHeight - top
    if (bufferTop < height) {
      top = top - (height - bufferTop)
    }
    return {
      top,
      left,
      marginTop: 0,
      marginRight: 10
    }
  },
  'bottom-right': (rect: any) => {
    let width = elem?.clientWidth || 0
    let left = rect.right + floatOffset
    let bufferWidth = document.body.clientWidth - left
    if (bufferWidth < width) {
      left = left - (width - bufferWidth)
    }
    return {
      top: rect.bottom,
      left,
      marginTop: 0,
      marginRight: 10,
      transform: 'translateY(-100%)'
    }
  }
})
const floatPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right']

const getDropdownStyle = (state: string, position: string = 'dropdown') => {
  let style: any = {
    transition: `transform, opacity`,
    transitionDuration: `${transitionDuration}ms, ${transitionDuration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.075, 0.82, 0.165, 1), cubic-bezier(0.075, 0.82, 0.165, 1)',
  }
  let stateTransformMap = {
    entering: 'scale(.8)',
    entered: 'scale(1)',
    exiting: 'scale(.8)',
    exited: 'scale(.8)'
  }
  let stateTransformOriginMap = {
    dropdown: 'top',
    dropup: 'bottom',
    slideright: 'left',
    slideleft: 'right'
  }
  style.opacity = state === 'entered' ? 1 : 0
  style.transform = stateTransformMap[state]
  style.transformOrigin = stateTransformOriginMap[position]

  return style
}

const Dropdown = (props: DropdownProps & PositionalProps, ref: any) => {
  let {
    options = [], onClick, additionalClass = '', loading = false, container = 'body', float = false,
    dropdownClass = '', textContent, icon = {}, iconOnly = false, children, hasTriggerComponent, id = uniqueId(),
    position = 'right', additionalTriggerClass = '', size = 'sm', offsetTop = 0, maxHeight = 'auto',
    floatOffset, theme = 'default', variant = 'filled', triggerSize = 'default'
  } = props
  let [_position, _setPosition] = useState(position)

  useEffect(() => {
    if (!float && floatPositions.includes(_position)) {
      console.warn(`Position cannot be ${_position} when float is not enabled. You can either enable float or use 'right' or 'left'`)
      _setPosition('right')
    }
  }, [float])

  useEffect(() => {
    _setPosition(position)
  }, [position])

  let dropdownOptions = options.filter((option) => !option.hidden)

  let __dropdownActive = useRef<boolean>(true)
  let __dropup = useRef<boolean>(false)
  let [open, setOpen] = useState<boolean>(false)
  let [dropup, setDropup] = useState<boolean>(false)
  let dropdown = useRef<HTMLDivElement | null>(null)
  let trigger = useRef<HTMLDivElement | null>(null)
  let [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({})

  useEffect(() => {
    setDropdownPosition({})
    return () => {
      __dropdownActive.current = false
    }
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      closeDropdown
    }),
    []
  )

  let getRelativePosition = () => {
    if (!trigger.current) return {}
    let rect = trigger.current.getBoundingClientRect()
    let pos: DropdownPosition = {}
    if (float) {
      pos = floatingPositionMap(dropdown.current, floatOffset)[_position](rect)
    } else {
      let body = document.documentElement || document.body
      let offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
      let offsetHeight = body.scrollHeight - offset
      let menuHeight = dropdown.current?.clientHeight || 100
      if (_position === 'right') {
        pos.right = window.innerWidth - rect.right
      }
      if (_position === 'left') {
        pos.left = rect.left
      }
      if ((rect.bottom + menuHeight) > offsetHeight) {
        __dropup.current = true
        setDropup(true)
        pos.bottom = (offsetHeight - rect.y + 4) + offsetTop
      } else {
        __dropup.current = false
        setDropup(false)
        pos.top = rect.bottom + offsetTop
      }
    }
    return pos
  }

  let toggleDropdown = () => {
    setOpen(currentstate => !currentstate)
  }

  let closeDropdown = () => {
    if (__dropdownActive.current) {
      setOpen(false)
    }
  }

  let addEvtListerner = () => {
    document.addEventListener('click', handleClickEvt, false)
    document.addEventListener('scroll', handlePageScroll, true)
  }

  let removeEvtListener = () => {
    document.removeEventListener('click', handleClickEvt, false)
    document.removeEventListener('scroll', handlePageScroll, true)
  }

  let handleClickEvt = (e: Event) => {
    if (
      dropdown.current &&
      trigger.current &&
      (e.target instanceof HTMLElement || e.target instanceof SVGElement) &&
      !dropdown.current.contains(e.target) &&
      !trigger.current.contains(e.target)
    ) {
      closeDropdown()
    }
  }

  let handlePageScroll = (e: Event) => {
    if (
      open &&
      dropdown.current &&
      (e.target instanceof Document || e.target instanceof HTMLElement) &&
      !dropdown.current.contains(e.target)
    ) {
      closeDropdown()
    }
  }

  let onMenuClick = (option: OptionItem) => {
    typeof option.onClick === 'function' && option.onClick(option)
    typeof onClick === 'function' && onClick(option)
    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      let position = getRelativePosition()
      setDropdownPosition(position)
      setTimeout(addEvtListerner, 10)
    }

    return () => removeEvtListener()
  }, [open])

  let hasOptions = Boolean(dropdownOptions.length)

  let dropdownContent = (style: any) => {
    return (
      <div data-testid={id} className={cx('ui-kit-dropdown', additionalClass)}>
        {
          hasOptions ?
            (
              <ul className='ui-kit-dropdown__container pa-8' style={{ ...style, maxHeight }}>
                {
                  dropdownOptions.map((option, index) => (
                    option.divider ?
                      <hr className='mx-0 my-8' key={index} />
                      :
                      <li data-testid={option.key} className={cx('dropdown-item cursor-pointer', { 'dropdown-item-disabled': option.disabled })} onClick={() => !option.disabled && onMenuClick(option)} key={option.key}>
                        {
                          <span>{option.name}</span>
                        }
                      </li>
                  ))
                }
              </ul>
            )
            :
            (
              <div className='ui-kit-dropdown__container' style={{ ...style, maxHeight }}>
                {children}
              </div>
            )
        }
      </div>
    )
  }

  let getTransitionType = (): string => {
    let type = 'dropdown'
    if (float) {
      let [, pos] = position.split('-')
      type = `slide${pos}`
    } else if (dropup) {
      type = 'dropup'
    }

    return type
  }

  let dropdownWrapper = (content: any) => (
    <div
      data-testid={`${id}-dropdown`}
      className={cx('ui-kit-dropdown__wrapper', dropdownClass, `dropdown--${size}`)}
      ref={dropdown}
      style={{ ...dropdownPosition }}
    >
      {content}
    </div>
  )

  let dropdownContainer = (
    <Transition
      appear
      mountOnEnter
      unmountOnExit
      in={open}
      timeout={{
        appear: transitionDuration,
        enter: 0,
        exit: (transitionDuration - 100)
      }}
    >
      {
        (transitionState: TransitionState) => dropdownWrapper(dropdownContent(getDropdownStyle(transitionState, getTransitionType())))
      }
    </Transition>
  )

  let portalTarget = canUseDOM && container ? document.querySelector(container) : null

  return (
    <>
      {
        hasTriggerComponent ?
          <div ref={trigger} data-testid={`${id}-trigger`} onClick={toggleDropdown} className={cx('cursor-pointer', additionalTriggerClass)}>
            {textContent}
          </div>
          :
          <Button
            className={additionalTriggerClass}
            icon={icon}
            iconOnly={iconOnly}
            onClick={toggleDropdown}
            ref={trigger}
            aria-haspopup='true'
            aria-controls='dropdown'
            loading={loading}
            data-testid={`${id}-trigger`}
            id={`${id}-trigger`}
            theme={theme}
            variant={variant}
            size={triggerSize}
          >
            {textContent}
          </Button>
      }
      {
        portalTarget ?
          (
            createPortal(
              <>{dropdownContainer}</>,
              portalTarget
            )
          ) :
          (
            <>{dropdownContainer}</>
          )
      }
    </>
  )
}

export default React.forwardRef(Dropdown)
