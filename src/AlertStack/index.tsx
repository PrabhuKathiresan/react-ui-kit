import React, { useState } from 'react'
import cx from 'classnames'
import { noop } from '../utils'
import { AlertStackProps } from './props'
import Next from '../icons/next'
import Alert from '../Alert'
import Previous from '../icons/previous'

export default function AlertStack(props: AlertStackProps) {
  let {
    onDismiss = noop,
    onNavigation = noop,
    alerts = [],
    placement = 'top',
    className = '',
    banner = false,
    offset = 0
  } = props
  let [activeIndex, setActiveIndex] = useState<number>(0)
  let alertCount = alerts.length

  let gotoNext = () => {
    setActiveIndex(_index => Math.min(_index + 1, alertCount - 1))
    onNavigation()
  }
  let gotoPrevious = () => {
    setActiveIndex(_index => Math.max(_index - 1, 0))
    onNavigation()
  }

  let hasAlert = Boolean(alertCount)
  
  if (!hasAlert) return null

  let disablePrev = activeIndex === 0
  let disableNext = activeIndex === (alertCount - 1)
  let showNav = alertCount > 1
  let stackStyle = {}

  if (banner) stackStyle[placement] = offset

  let alert = alerts[activeIndex]

  return (
    <div
      className={cx('ui-kit-alert-stack element-flex-center', { 'ui-kit-alert-stack__banner': banner }, className)}
      style={stackStyle}
    >
      {
        showNav && (
          <span role='button' className={cx('ui-kit-alert-stack-nav-btn ui-kit-alert-stack-nav-btn__left element-flex-center', { disabled: disablePrev })} onClick={() => !disablePrev && gotoPrevious()}>
            <Previous />
          </span>
        )
      }
      <Alert {...alert} onClose={() => onDismiss(alert)} show={hasAlert} className={cx('mb-0', showNav ? 'px-40' : 'px-16')} containerClass='w-100' />
      {
        showNav && (
          <span role='button' className={cx('ui-kit-alert-stack-nav-btn ui-kit-alert-stack-nav-btn__right element-flex-center', { disabled: disableNext })} onClick={() => !disableNext && gotoNext()}>
            <Next />
          </span>
        )
      }
    </div>
  )
}
