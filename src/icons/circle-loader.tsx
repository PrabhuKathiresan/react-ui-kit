import React from 'react'
import cx from 'classnames'

export default function CircleLoader({ className = '', strokeWidth = 2 }) {
  return (
    <svg className={cx('circular', className)} viewBox='25 25 50 50'>
      <circle className='path' cx='50' cy='50' r='20' fill='none' strokeWidth={strokeWidth} strokeMiterlimit='10'/>
    </svg>
  )
}
