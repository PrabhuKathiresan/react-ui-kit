import React from 'react'
import { IconProps } from './props'

export default function Dropdown(props: IconProps) {
  let { height = 18, width = 18, viewBox = '0 0 24 24', fill = 'currentColor' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill}>
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M7 10l5 5 5-5H7z" />
    </svg>
  )
}
