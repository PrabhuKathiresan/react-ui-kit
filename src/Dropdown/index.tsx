import React, { useState, useImperativeHandle, useEffect, useRef } from 'react'
import { Transition } from 'react-transition-group'
import cx from 'classnames'
import { DropdownProps, DropdownPosition, OptionItem, TransitionState } from './props'
import Button from '../Button'
import { uniqueId, noop } from '../utils'

const transitionDuration = 220

const transitionClassMap = (type: string = 'dropdown', state: string) => {
  let classMap = {
    dropdown: {
      'entering': 'slide-in-down',
      'entered': 'open slide-in-down',
      'exiting': 'hidden slide-out-down',
      'exited': ''
    },
    dropup: {
      'entering': 'slide-in-up',
      'entered': 'open slide-in-up',
      'exiting': 'hidden slide-out-up',
      'exited': ''
    }
  };

  return classMap[type][state] || '';
}

const Dropdown = (props: DropdownProps, ref: any) => {
  let {
    options = [], onClick, additionalClass = '', loading = false,
    dropdownClass = '', textContent, icon = {}, children, hasTriggerComponent, id = uniqueId(),
    position = 'right', additionalTriggerClass = '', size = 'sm', offsetTop = 0
  } = props

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
    if (position === 'right') {
      pos.right = window.innerWidth - rect.right
    }
    if (position === 'left') {
      pos.left = rect.left
    }
    let body = document.documentElement || document.body
    let offset = Math.max(body.scrollTop, (body.scrollHeight - window.innerHeight))
    let offsetHeight = body.scrollHeight - offset
    let menuHeight = dropdown.current ? dropdown.current.clientHeight : 100
    if ((rect.bottom + menuHeight) > offsetHeight) {
      setDropup(true)
      pos.bottom = (offsetHeight - rect.y + 4) + offsetTop
    } else {
      setDropup(false)
      pos.top = rect.bottom + offsetTop
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

  let handlePageScroll = () => {
    if (open) {
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
          <ul style={{ ...dropdownPosition }} data-testid={`${id}-dropdown`} className={cx('ui-kit-dropdown__wrapper', dropdownClass, `dropdown--${size}`, transitionClass)} ref={dropdown}>
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
          <div style={{ ...dropdownPosition }} data-testid={`${id}-dropdown`} className={cx('ui-kit-dropdown__wrapper', dropdownClass, `dropdown--${size}`, transitionClass)} ref={dropdown}>
            {children}
          </div>
        )
    )
  }

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
          (transitionState: TransitionState) => dropdownContent(transitionClassMap(dropup ? 'dropup' : 'dropdown', transitionState))
        }
      </Transition>
    </div >
  )
}

export default React.forwardRef(Dropdown)
