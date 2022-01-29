import React from 'react'
import cx from 'classnames'
import CircleLoader from '../icons/circle-loader'

interface LoaderProps {
  size?: number
  strokeWidth?: number
  className?: string
  theme?: 'primary' | 'currentColor'
}

export default function Loader(props: LoaderProps) {
  let { size = 24, strokeWidth = 4, className = '', theme = 'primary' } = props
  return (
    <span className={cx('loader', className, `loader-${theme}`)} style={{ width: size, height: size }}>
      <CircleLoader strokeWidth={strokeWidth} />
    </span>
  )
}
