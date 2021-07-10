import React, { useState, useImperativeHandle, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Transition } from 'react-transition-group'
import cx from 'classnames'
import { DropdownProps, PositionalProps, DropdownPosition, OptionItem, TransitionState } from './props'
import Button from '../Button'
import { uniqueId, noop } from '../utils'

const transitionDuration = 220
const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
)
const floatingPositionMap = (elem: HTMLUListElement & HTMLDivElement | null, floatOffset: number = 10) => ({
  'top-left': (rect: any) => {
    let width = elem?.clientWidth || 0
    return {
      top: rect.top,
      left: rect.left - (width + floatOffset),
      marginTop: 0,
      marginLeft: 10
    }
  },
  'bottom-left': (rect: any) => {
    let width = elem?.clientWidth || 0
    return {
      bottom: rect.bottom,
      left: rect.left - (width + floatOffset),
      marginTop: 0,
      marginLeft: 10
    }
  },
  'top-right': (rect: any) => {
    return {
      top: rect.top,
      left: rect.right + floatOffset,
      marginTop: 0,
      marginRight: 10
    }
  },
  'bottom-right': (rect: any) => {
    let height = elem?.clientHeight || 0
    return {
      top: rect.bottom - height,
      left: rect.right + floatOffset,
      marginTop: 0,
      marginRight: 10
    }
  }
})
const floatPositions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
const transitionClassMap = (type: string = 'dropdown', state: string) => {
  let classMap = {
    dropdown: {
      'entering': 'ui-kit-slide-in-down',
      'entered': 'open ui-kit-slide-in-down',
      'exiting': 'hidden slide-out-down',
      'exited': ''
    },
    dropup: {
      'entering': 'ui-kit-slide-in-up',
      'entered': 'open ui-kit-slide-in-up',
      'exiting': 'hidden ui-kit-slide-out-up',
      'exited': ''
    },
    slideleft: {
      'entering': 'ui-kit-slide-out-left',
      'entered': 'open ui-kit-slide-out-left',
      'exiting': 'hidden ui-kit-slide-in-left',
      'exited': ''
    },
    slideright: {
      'entering': 'ui-kit-slide-out-right',
      'entered': 'open ui-kit-slide-out-right',
      'exiting': 'hidden ui-kit-slide-in-right',
      'exited': ''
    }
  };

  return classMap[type][state] || '';
}

const Dropdown = (props: DropdownProps & PositionalProps, ref: any) => {
  let {
    options = [], onClick, additionalClass = '', loading = false, container = 'body', float = false,
    dropdownClass = '', textContent, icon = {}, children, hasTriggerComponent, id = uniqueId(),
    position = 'right', additionalTriggerClass = '', size = 'sm', offsetTop = 0, maxHeight = 'auto',
    floatOffset
  } = props
  let [_position, _setPosition] = useState(position);

  useEffect(() => {
    if (!float && floatPositions.includes(_position)) {
      console.warn(`Position cannot be ${_position} when float is not enabled. You can either enable float or use 'right' or 'left'`);
      _setPosition('right');
    }
  }, [float]);

  let dropdownOptions = options.filter((option) => !option.hidden)

  let __dropdownActive = useRef<boolean>(true)
  let [open, setOpen] = useState<boolean>(false)
  let [dropup, setDropup] = useState<boolean>(false)
  let dropdown = useRef<HTMLUListElement & HTMLDivElement | null>(null)
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
      closeDropdown() {
        if (__dropdownActive.current) {
          setOpen(false)
        }
      }
    }),
    []
  )

  let getRelativePosition = () => {
    if (!trigger.current) return {}
    let rect = trigger.current.getBoundingClientRect()
    let pos: DropdownPosition = {}
    if (float) {
      pos = floatingPositionMap(dropdown.current, floatOffset)[_position](rect);
    } else {
      let body = document.documentElement || document.body
      let offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
      let offsetHeight = body.scrollHeight - offset
      let menuHeight = dropdown.current ? dropdown.current.clientHeight : 100
      if (_position === 'right') {
        pos.right = window.innerWidth - rect.right
      }
      if (_position === 'left') {
        pos.left = rect.left
      }
      if ((rect.bottom + menuHeight) > offsetHeight) {
        setDropup(true)
        pos.bottom = (offsetHeight - rect.y + 4) + offsetTop
      } else {
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
      setDropdownPosition(getRelativePosition())
      addEvtListerner()
    } else {
      removeEvtListener()
    }
  }, [open])

  let hasOptions = Boolean(dropdownOptions.length)

  let dropdownContent = (transitionClass: string) => {
    return (
      hasOptions ?
        (
          <ul style={{ ...dropdownPosition, maxHeight }} data-testid={`${id}-dropdown`} className={cx('ui-kit-dropdown__wrapper', dropdownClass, `dropdown--${size}`, transitionClass)} ref={dropdown}>
            {
              dropdownOptions.map((option, index) => (
                option.divider ?
                  <hr className='mx-0 my-8' key={index} />
                  :
                  <li data-testid={option.key} className={cx('dropdown-item cursor-pointer', { 'dropdown-item-disabled': option.disabled })} onClick={option.disabled ? noop : () => onMenuClick(option)} key={option.key}>
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
          <div style={{ ...dropdownPosition, maxHeight }} data-testid={`${id}-dropdown`} className={cx('ui-kit-dropdown__wrapper', dropdownClass, `dropdown--${size}`, transitionClass)} ref={dropdown}>
            {children}
          </div>
        )
    )
  }

  let getTransitionType = (): string => {
    let type = 'dropdown';
    if (float) {
      let [, pos] = position.split('-');
      type = `slide${pos}`;
    } else if (dropup) {
      type = 'dropup';
    }

    return type;
  }

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
        (transitionState: TransitionState) => dropdownContent(transitionClassMap(getTransitionType(), transitionState))
      }
    </Transition>
  )

  let portalTarget = canUseDOM && container ? document.querySelector(container) : null

  return (
    <div data-testid={id} className={cx('ui-kit-dropdown', additionalClass)} ref={ref}>
      <div className='ui-kit-dropdown__trigger'>
        {
          hasTriggerComponent ?
            <div ref={trigger} data-testid={`${id}-trigger`} onClick={toggleDropdown} className='cursor-pointer'>
              {textContent}
            </div>
            :
            <Button
              className={additionalTriggerClass}
              icon={icon}
              onClick={toggleDropdown}
              ref={trigger}
              aria-haspopup='true'
              aria-controls='dropdown'
              loading={loading}
              data-testid={`${id}-trigger`}
            >
              {textContent}
            </Button>
        }
      </div>
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
    </div >
  )
}

export default React.forwardRef(Dropdown)
