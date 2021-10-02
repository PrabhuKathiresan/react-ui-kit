import React from 'react'
import cx from 'classnames'
import { Transition } from 'react-transition-group'
import { TransitionState } from '../constants'
import { ActionContainerProps } from './props'

const mainContentTransformMap = {
  entering: 'translate3d(0, -100%, 0)',
  entered: 'translate3d(0, 0, 0)',
  exiting: 'translate3d(0, -100%, 0)',
  exited: 'translate3d(0, -100%, 0)'
}

const subContentTransformMap = {
  entering: 'translate3d(0, 0, 0)',
  entered: 'translate3d(0, -100%, 0)',
  exiting: 'translate3d(0, 0, 0)',
  exited: 'translate3d(0, 0, 0)'
}

export default function ActionContainer(props: ActionContainerProps) {
  const {
    height = 64,
    content,
    showSecondaryAction = false,
    containerClass = '',
    primaryContentClass = '',
    secondaryContentClass = '',
    transitionDuration = 150
  } = props

  const renderMainContent = () => (
    <Transition
      in={!showSecondaryAction}
      timeout={transitionDuration}
    >
      {(transitionState: TransitionState) => (
        <div
          className={cx('ui-kit-action-container__main-content element-flex-align-center', primaryContentClass)}
          style={{
            height,
            transition: `transform ${transitionDuration}ms linear`,
            transform: mainContentTransformMap[transitionState]
          }}
        >
          {content.primary}
        </div>
      )}
    </Transition>
  )

  const renderSubContent = () => {
    if (!content.secondary) return null

    return (
      <Transition
        in={showSecondaryAction}
        timeout={transitionDuration}
        unmountOnExit
      >
        {(transitionState: TransitionState) => (
          <div
            className={cx('ui-kit-action-container__sub-content element-flex-align-center', secondaryContentClass)}
            style={{
              height,
              transition: `transform ${transitionDuration}ms linear`,
              transform: subContentTransformMap[transitionState]
            }}
          >
            {content.secondary}
          </div>
        )}
      </Transition>
    )
  }


  return (
    <div className={cx('ui-kit-action-container', containerClass)} style={{ height }}>
      {renderMainContent()}
      {renderSubContent()}
    </div>
  )
}
