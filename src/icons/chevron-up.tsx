import React from 'react'
import { IconProps } from './props'

export default function ChevronUp(props: IconProps) {
  let { height = 16, width = 16, viewBox = '0 0 16 16', fill = 'currentColor', className = '' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill} className={className}>
      <path fillRule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z" />
    </svg>
  )
}
