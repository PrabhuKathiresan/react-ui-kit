import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import cx from 'classnames'
import { Transition } from 'react-transition-group'
import { AlertProps } from './props'
import Close from '../icons/close'
import SuccessFilled from '../icons/success-filled'
import InfoCircleFilled from '../icons/info-circle-filled'
import WarningFilled from '../icons/warning-filled'
import Success from '../icons/success'
import InfoCircle from '../icons/info-circle'
import Warning from '../icons/warning'
import { getPortalTarget, noop, isDefined } from '../utils'

const ICONSMAP = {
  default: {
    warning: Warning,
    success: Success,
    info: InfoCircle,
    error: Warning
  },
  filled: {
    warning: WarningFilled,
    success: SuccessFilled,
    info: InfoCircleFilled,
    error: WarningFilled
  }
}

const alertTransitionMap = {
  entering: {
    transform: 'scale(.8)',
    opacity: 0
  },
  entered: {
    marginBottom: '1rem',
    transform: 'scale(1)',
    opacity: 1
  },
  exiting: {
    transform: 'scale(.8)',
    opacity: 0
  },
  exited: {
    transform: 'scale(.8)',
    opacity: 0
  }
}

const getContainerPosition = (element: any, placement: string = 'top') => {
  let rect = element.getBoundingClientRect()
  let position = { width: rect.width, left: rect.left }
  
  position[placement] = rect[placement]

  return position
}

const getInititalValue = (show: any) => isDefined(show) ? Boolean(show) : true

export default function Alert(props: AlertProps) {
  let {
    type = 'info',
    children = null,
    content,
    title,
    dismissable,
    onClose = noop,
    showIcon = true,
    containerClass = '',
    className = '',
    iconType = 'default',
    variant = 'default',
    container = null,
    banner = false,
    fixed = false,
    show,
    transitionDuration = 220,
    style = {},
    position,
    fitToContainer = false
  } = props
  let customHandle = isDefined(show)
  let [open, setOpen] = useState<boolean | undefined>(getInititalValue(show))
  let [portalTarget, setPortalTarget] = useState<any>(null)
  let [containerStyle, setContainerStyle] = useState<any>({})
  let containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (isDefined(show)) setOpen(show)
  }, [show])

  useEffect(() => {
    let target = getPortalTarget(container)
    if (target && fitToContainer) {
      setContainerStyle(getContainerPosition(target))
    }
    setPortalTarget(target)
  }, [])

  let Icon = ICONSMAP[iconType][type]

  let alert = (
    <Transition
      in={open}
      timeout={{
        appear: transitionDuration,
        enter: 0,
        exit: transitionDuration,
      }}
      onExited={() => onClose()}
      unmountOnExit
    >
      {
        (transitionState) => (
          <div
            className={
              cx('ui-kit-alert__container', containerClass, {
                'ui-kit-alert__banner': banner,
                'ui-kit-alert__banner-fixed': fixed
              })
            }
            style={{ ...style, position, ...containerStyle }}
            ref={containerRef}
          >
            <div
              className={cx('ui-kit-alert', `ui-kit-alert-${type}`, `ui-kit-alert-${variant}`, className)}
              style={{
                ...alertTransitionMap[transitionState],
                transitionDuration: `${transitionDuration}ms`,
                transformOrigin: 'top',
              }}
            >
              {
                showIcon && <span className='element-flex-center mr-8 ui-kit-alert-icon-container'><Icon /></span>
              }
              <div className='ui-kit-alert-content mr-8'>
                {title && <div className='ui-kit-alert-title'>{title}</div>}
                <div className='ui-kit-alert-description'>{children || content}</div>
              </div>
              {
                dismissable && <span className='cursor-pointer element-flex-center has-hover-effect radius-circle' onClick={() => customHandle ? onClose() : setOpen(false)} role='button' tabIndex={0}><Close /></span>
              }
            </div>
          </div>
        )
      }
    </Transition>
  )

  return (
    portalTarget ? createPortal(<>{alert}</>, portalTarget) : <>{alert}</>
  )
}
