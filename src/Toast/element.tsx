import React, { useState, useRef, useEffect } from 'react'
import cx from 'classnames'
import Button from '../Button'
import { noop } from '../utils'
import { Positions, TransitionState  } from './props'
import Close from '../icons/close'
import Warning from '../icons/warning'
import Success from '../icons/success'
import InfoCircle from '../icons/info-circle'
import Error from '../icons/error'

interface SingleToastProp {
  title?: string;
  type: string,
  autoDismiss: boolean, // may be inherited from ToastProvider
  duration: number, // inherited from ToastProvider
  children: any,
  onClose: Function,
  position: Positions,
  confirm?: boolean;
  onConfirm?: Function;
  onCancel?: Function;
  confirmText?: string;
  cancelText?: string;
}

interface TransitionProps {
  transitionDuration: number;
  transitionState: TransitionState;
}

const gutter = 16

const ICONSMAP = {
  warning: Warning,
  success: Success,
  info: InfoCircle,
  error: Error
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
    title,
    children,
    onClose = noop,
    transitionDuration,
    transitionState,
    confirm,
    onConfirm = noop,
    onCancel = noop,
    confirmText = 'Confirm',
    cancelText = 'Cancel'
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

  let Icon = ICONSMAP[type]

  return (
    <div
      ref={element}
      style={{
        height,
        transition: `height ${transitionDuration - 100}ms 100ms`,
      }}
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
            <span className='mr-8 element-flex-center'><Icon /></span>
            <span>{title}</span>
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
              <Button small plain onClick={() => cancelAction()}>
                {cancelText}
              </Button>
              <Button small plain className='is-primary' disabled={confirming} loading={confirming} onClick={() => confirmAction()}>
                {confirmText}
              </Button>
            </div>
          )
        }
      </div>
    </div>
  )
}
