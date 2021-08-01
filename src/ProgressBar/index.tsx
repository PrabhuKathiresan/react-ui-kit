import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { ProgressBarProps } from './props'

function ProgressBar(props: ProgressBarProps) {
  let {
    max = 100,
    value,
    type = 'primary',
    size = 'default'
  } = props

  let [stateValue, setStateValue] = useState<number>(0)

  useEffect(() => {
    setTimeout(() => setStateValue(value), 100)
  }, [value])

  let width = `${Math.round((stateValue / max) * 100)}%`

  return (
    <div className={cx('ui-kit-progress-bar', `ui-kit-progress-bar-${type}`, `ui-kit-progress-bar-${size}`)}>
      <div className='ui-kit-progress-bar-outer' />
      <div className='ui-kit-progress-bar-inner' style={{ width }} />
    </div>
  )
}

export default ProgressBar
