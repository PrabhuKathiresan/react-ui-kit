import React from 'react'
import { IconProps } from './props'

export default function MoreHorizontal(props: IconProps) {
  let { height = 16, width = 16, viewBox = '0 0 24 24', fill = 'currentColor' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
    </svg>
  )
}
