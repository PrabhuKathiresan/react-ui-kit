import React from 'react'
import { IconProps } from './props'

export default function CircleOutline(props: IconProps) {
  let { height = 16, width = 16, viewBox = '0 0 24 24', fill = 'currentColor', className = '' } = props
  return (
    // <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox={viewBox} width={width} fill={fill} className={className}>
    //   <path d="M0 0h24v24H0z" fill="none"/>
    //   <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2z"/>
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height={height} viewBox={viewBox} width={width} fill={fill} className={className}>
      <g>
        <rect fill="none" height="24" width="24"/>
      </g>
      <g>
        <path d="M12,2C6.47,2,2,6.47,2,12c0,5.53,4.47,10,10,10s10-4.47,10-10C22,6.47,17.53,2,12,2z M12,20c-4.42,0-8-3.58-8-8 c0-4.42,3.58-8,8-8s8,3.58,8,8C20,16.42,16.42,20,12,20z"/>
      </g>
    </svg>
  )
}
