import React from 'react'
import { ProgressBarProps } from './props'

export default function ProgressBar(props: ProgressBarProps) {
  let {
    value = 0,
    trickleSpeed,
    type
  } = props
  let width = `${value * 100}%` // .5 * 100 = 50

  let isIndeterminate = type === 'indeterminate'

  if (isIndeterminate) {
    return (
      <div className='w-100 h-100 overflow-hidden'>
        <div className='ui-kit-progress-bar-meter-indeterminate' />
      </div>
    )
  }

  return (
    <div className='ui-kit-progress-bar-meter' style={{
      width,
      transitionProperty: 'width',
      transitionDuration: `${trickleSpeed}ms`,
      transitionTimingFunction: 'linear'
    }} />
  )
}
