import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import Button from '../Button'
import { noop } from '../utils'
import Close from '../icons/close'
import Warning from '../icons/warning'
import Success from '../icons/success'
import InfoCircle from '../icons/info-circle'
import Error from '../icons/error'
import WarningFilled from '../icons/warning-filled'
import SuccessFilled from '../icons/success-filled'
import InfoCircleFilled from '../icons/info-circle-filled'
import ErrorFilled from '../icons/error-filled'
import { SingleToastProp, TransitionProps } from './props'

const gutter = 16

const ICONSMAP = {
  warning: {
    default: Warning,
    filled: WarningFilled
  },
  success: {
    default: Success,
    filled: SuccessFilled
  },
  info: {
    default: InfoCircle,
    filled: InfoCircleFilled
  },
  error: {
    default: Error,
    filled: ErrorFilled
  }
}

function getTranslate(placement: string) {
  const pos = placement.split('-');
  const relevantPlacement = pos[1] === 'center' ? pos[0] : pos[1];
  const translateMap = {
    right: 'translate3d(120%, 0, 0)',
    left: 'translate3d(-120%, 0, 0)',
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
  };

  return translateMap[relevantPlacement];
}

const toastStates = (placement: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center') => ({
  entering: { transform: getTranslate(placement) },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: 'scale(0.66)', opacity: 0 },
  exited: { transform: 'scale(0.66)', opacity: 0 },
})

export const ToastElement = (props: SingleToastProp & TransitionProps) => {
  let {
    type,
    position,
    message,
    children,
    onClose = noop,
    transitionDuration,
    transitionState,
    confirm,
    onConfirm = noop,
    onCancel = noop,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    id,
    onMouseEnter,
    onMouseLeave,
    iconType = 'filled'
  } = props

  let [confirming, setConfirming] = useState(false)
  let [height, setHeight] = useState<string | number>('auto')
  let element = useRef<HTMLDivElement | null>(null)

  useEffect(
    () => {
      if (transitionState === 'entered') {
        let el = element.current;
        setHeight((el?.offsetHeight || 0) + gutter);
      }
      if (transitionState === 'exiting') {
        setHeight(0);
      }
    },
    [transitionState]
  )

  let cancelAction = () => {
    onCancel()
    onClose()
  }

  let confirmAction = async () => {
    setConfirming(true)
    try {
      await onConfirm()
      onClose(true)
    } catch (error) {
      onClose()
    }
  }

  let Icon = ICONSMAP[type][iconType]

  return (
    <div
      ref={element}
      style={{
        height,
        transition: `height ${transitionDuration - 100}ms 100ms`,
      }}
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
      id={id}
      data-testid={`${id}-toast`}
    >
      <div
        className={cx('ui-kit-toast', `ui-kit-toast-${type}`, `ui-kit-toast-${position}`)}
        style={{
          marginBottom: gutter,
          transition: `transform ${transitionDuration}ms cubic-bezier(0.2, 0, 0, 1), opacity ${transitionDuration}ms`,
          ...toastStates(position)[transitionState],
        }}
      >
        <div className='ui-kit-toast-title'>
          <span className='mr-auto element-flex'>
            <span className='mr-8 element-flex-center ui-kit-toast-title-icon'><Icon /></span>
            <span>{message}</span>
          </span>
          <span
            role='button'
            tabIndex={0}
            onClick={() => onClose()}
            className='ui-kit-toast-close cursor-pointer element-flex-center has-hover-effect radius-circle'
          >
            <Close width={20} height={20} />
          </span>
        </div>
        {
          children && (
            <div className='ui-kit-toast-description'>
              {children}
            </div>
          )
        }
        {
          confirm && (
            <div className='ui-kit-toast-action'>
              <Button size='small' variant='plain'  onClick={() => cancelAction()}>
                {cancelText}
              </Button>
              <Button size='small' variant='plain' className='is-primary' disabled={confirming} loading={confirming} onClick={() => confirmAction()}>
                {confirmText}
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}
