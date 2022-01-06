import React from 'react'
import Loader from '../Loader'
import { ProgressBarOptions, WithChildren } from './props'

export default function ProgressBarContainer(props: ProgressBarOptions & WithChildren) {
  let {
    children,
    placement = 'top',
    position = 'absolute',
    height = 3,
    showSpinner = true
  } = props

  return (
    <div
      style={{
        position,
        [`${placement}`]: 0,
        left: 0,
        zIndex: 999,
        height,
        width: '100%',
        maxHeight: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}
    >
      {children}
      {
        showSpinner && (
          <div
            className='position-absolute'
            style={{
              [`${placement}`]: 8,
              right: 16
            }}
          >
            <Loader size={20} />
          </div>
        )
      }
    </div>
  )
}
