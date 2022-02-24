import React, { HTMLAttributes } from 'react'
import cx from 'classnames'
import Button from '../Button'
import Close from '../icons/close'
import { noop } from '../utils'
import { DialogProps, DialogPositions } from './props'

function getTranslate(position: string) {
  const pos = position.split('-')
  const relevantPlacement = (!pos[1] || pos[1] === 'center') ? pos[0] : pos[1]
  const translateMap = {
    right: 'translate3d(120%, 0, 0)',
    left: 'translate3d(-120%, 0, 0)',
    bottom: 'translate3d(0, 120%, 0)',
    top: 'translate3d(0, -120%, 0)',
    center: 'scale(0.66)'
  }

  return translateMap[relevantPlacement]
}

const dialogStates = (position: DialogPositions) => ({
  entering: { transform: getTranslate(position) },
  entered: { transform: 'translate3d(0,0,0)' },
  exiting: { transform: getTranslate(position) },
  exited: { transform: getTranslate(position) },
})

const getGutter = (position: DialogPositions) => {
  const fullWidthPos = ['top', 'right', 'bottom', 'left']

  if (fullWidthPos.includes(position)) {
    let borderRadius = {
      top: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0
      },
      right: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0
      },
      bottom: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
      },
      left: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0
      },
    }
    return {
      ...borderRadius[position],
      margin: 0,
      height: '100%'
    }
  }
  return {
    margin: 16
  }
}

const backDropTransistion = {
  entering: { backgroundColor: 'transparent' },
  entered: { backgroundColor: 'rgba(49, 58, 66, .6)' },
  exiting: { backgroundColor: 'transparent' },
  exited: { backgroundColor: 'transparent' }
}

export default function Dialog(props: DialogProps) {
  let {
    title,
    content,
    showFooter = false,
    actions = [],
    onClose = noop,
    position = 'right',
    transitionState,
    showBackdrop = false,
    closeOnOutsideClick = false,
    id,
    contentPadding = 16
  } = props

  let backdropProps: HTMLAttributes<HTMLDivElement> = {
    className: 'ui-kit-dialog-mask',
    style: backDropTransistion[transitionState]
  }

  if (showBackdrop && closeOnOutsideClick) {
    backdropProps.onClick = () => onClose()
  }

  let contentClass = `pb-0 px-${contentPadding} pt-${contentPadding}`

  return (
    <>
      {showBackdrop && <div {...backdropProps} />}
      <div
        className='ui-kit-dialog pa-1'
        id={id}
        data-testid={id}
        style={{
          ...dialogStates(position)[transitionState],
          transition: `transform 220ms, opacity 220ms`,
          transitionTimingFunction: 'linear, linear',
          ...getGutter(position)
        }}
      >
        <div className='ui-kit-dialog-title' data-testid={`${id}-title`}>
          <span className='mr-auto'>{title}</span>
          <span
            role='button'
            tabIndex={0}
            onClick={() => onClose()}
            data-testid={`close-${id}`}
            className='ui-kit-dialog-close cursor-pointer element-flex-center has-hover-effect border-radius'
          >
            <Close width={20} height={20} />
          </span>
        </div>
        <div className={cx('ui-kit-dialog-content', contentClass)} data-testid={`${id}-content`}>{content}</div>
        {
          showFooter && (
            <div className='ui-kit-dialog-footer' data-testid={`${id}-footer`}>
              {
                actions.map(action => (
                  <Button theme={action.theme} onClick={() => action.onClick()}>{action.text}</Button>
                ))
              }
            </div>
          )
        }
      </div>
    </>
  )
}
