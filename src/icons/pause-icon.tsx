import React from 'react'
import { IconProps } from './props'

export default function PauseIcon(props: IconProps) {
  let { height = 16, width = 16, viewBox = '0 0 24 24', fill = 'currentColor' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill}>
      <path d="M0 0h24v24H0z" fill="none"/>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
    </svg>
  )
}
