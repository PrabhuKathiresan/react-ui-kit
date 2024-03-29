import React from 'react'
import { IconProps } from './props'

const UncheckedIcon = (props: IconProps) => {
  let { height = 18, width = 18, viewBox = '0 0 24 24', fill = 'currentColor' } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="ui-kit-table-icon" height={height} viewBox={viewBox} width={width} fill={fill}>
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
}

export default UncheckedIcon
