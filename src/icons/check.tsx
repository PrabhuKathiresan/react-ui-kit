import React from 'react'
import { IconProps } from './props'

const Check = (props: IconProps) => {
  let { height = 16, width = 16, viewBox = '0 0 16 16', fill = 'currentColor', className } = props
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} height={height} viewBox={viewBox} width={width} fill={fill}>
      <path d="M13.485 1.431a1.473 1.473 0 0 1 2.104 2.062l-7.84 9.801a1.473 1.473 0 0 1-2.12.04L.431 8.138a1.473 1.473 0 0 1 2.084-2.083l4.111 4.112 6.82-8.69a.486.486 0 0 1 .04-.045z" />
    </svg>
  )
}

export default Check
