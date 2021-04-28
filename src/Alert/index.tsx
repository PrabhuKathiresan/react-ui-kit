import React, { useState } from 'react'
import cx from 'classnames'
import { Transition } from 'react-transition-group'
import { AlertProps } from './props'
import Close from '../icons/close'
import Warning from '../icons/warning'
import Success from '../icons/success'
import InfoCircle from '../icons/info-circle'
import Error from '../icons/error'
import { noop } from '../utils'

const ICONSMAP = {
  warning: Warning,
  success: Success,
  info: InfoCircle,
  error: Error
}

export default function Alert(props: AlertProps) {
  let {
    type = 'info',
    children = null,
    content,
    title,
    dismissable,
    onClose = noop,
    showIcon = true,
    className
  } = props
  let description = children || content
  let [open, setOpen] = useState(true)

  let Icon = ICONSMAP[type]

  return (
    <Transition
      in={open}
      timeout={220}
      onExited={() => onClose()}
    >
      {
        (transitionState) => (
          <div className={cx('ui-kit-alert', `ui-kit-alert-${type} ui-kit-alert-${transitionState}`, className)}>
            {
              showIcon && <span className='d-flex-center mr-16'><Icon /></span>
            }
            <div className='ui-kit-alert-content'>
              {title && <div className='ui-kit-alert-title'>{title}</div>}
              <div className='ui-kit-alert-description'>{description}</div>
            </div>
            {
              dismissable && <span className='d-flex-center clickable' onClick={() => setOpen(false)} role='button' tabIndex={0}><Close /></span>
            }
          </div>
        )
      }
    </Transition>
  )
}
