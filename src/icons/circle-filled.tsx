import React from 'react'
import { IconProps } from './props'

export default function CircleFilled(props: IconProps) {
  let { height = 16, width = 16, viewBox = '0 0 24 24', fill = 'currentColor', className = '' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill} className={className}>
      <path d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z" />
    </svg>
  )
}
